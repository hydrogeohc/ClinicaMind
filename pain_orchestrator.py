#!/usr/bin/env python3
import json
import sys
import argparse
import subprocess
import tempfile
import os
import re
import numpy as np
from typing import Dict, Any

# Pain NLP extractor (from original pipeline)
WORD2NUM = {"zero":0,"one":1,"two":2,"three":3,"four":4,"five":5,"six":6,"seven":7,"eight":8,"nine":9,"ten":10}
SEVERITY_WORDS = {
    "no pain":0, "mild":2, "slight":2, "tolerable":3, "moderate":5, "bad":6,
    "severe":8, "very severe":9, "excruciating":9.5, "worst imaginable":10, "worst":10, "agonizing":10
}
INTENSIFIERS = {
    "a little":-0.5, "a bit":-0.5, "some":-0.3, "quite":0.5, "really":0.8, "very":0.8, "extremely":1.0,
    "wakes me up":1.0, "can't sleep":1.2, "throbbing":0.3, "stabbing":0.7, "burning":0.5, "numb":-0.4
}

def parse_numeric_scale(text: str):
    tl = text.lower()
    m = re.search(r'(\b\d{1,2})\s*(?:/|out of|over)\s*(?:10|ten)\b', tl)
    if m:
        return float(np.clip(int(m.group(1)), 0, 10))
    m = re.search(r'\b(zero|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:/|out of|over)\s*(?:10|ten)\b', tl)
    if m:
        return float(WORD2NUM[m.group(1)])
    return None

def parse_severity_words(text: str):
    tl = text.lower()
    hits = []
    for phrase, score in sorted(SEVERITY_WORDS.items(), key=lambda x: -len(x[0])):
        if phrase in tl:
            hits.append(score)
    return float(np.mean(hits)) if hits else None

def compute_intensifier_shift(text: str):
    tl = text.lower()
    return sum(w for phrase, w in INTENSIFIERS.items() if phrase in tl)

def bucketize(x: float) -> str:
    if x <= 3: return "mild (0–3)"
    if x <= 6: return "moderate (4–6)"
    return "severe (7–10)"

def estimate_pain_from_text(text: str):
    base = parse_numeric_scale(text)
    if base is None:
        base = parse_severity_words(text)
    if base is None:
        base = 4.5
    est = float(np.clip(base + compute_intensifier_shift(text), 0, 10))
    return est, bucketize(est)

class PainOrchestrator:
    def __init__(self):
        self.name = "Pain_Orchestrator"
        self.version = "1.0"
    
    def call_agent(self, agent_script: str, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call an agent subprocess with JSON input/output.
        """
        try:
            process = subprocess.Popen(
                [sys.executable, agent_script],
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            
            stdout, stderr = process.communicate(input=json.dumps(request))
            
            if process.returncode != 0:
                return {
                    "success": False,
                    "error": f"Agent failed with return code {process.returncode}",
                    "stderr": stderr
                }
            
            return json.loads(stdout)
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to call agent: {str(e)}"
            }
    
    def process_audio(self, audio_path: str, language: str = "en-US", voice_name: str = "en-US-Neural2-F", output_audio: str = None) -> Dict[str, Any]:
        """
        Complete pain assessment pipeline using agent architecture.
        """
        pipeline_result = {
            "pipeline": "pain_assessment",
            "orchestrator": self.name,
            "steps": {},
            "final_result": {}
        }
        
        # Step 1: ASR Agent
        asr_request = {
            "audio_path": audio_path,
            "language": language
        }
        
        asr_result = self.call_agent("asr_agent.py", asr_request)
        pipeline_result["steps"]["asr"] = asr_result
        
        if not asr_result.get("success"):
            pipeline_result["final_result"] = {
                "success": False,
                "error": "ASR agent failed",
                "details": asr_result
            }
            return pipeline_result
        
        transcript = asr_result["transcript"]
        
        # Step 2: Pain NLP Processing
        try:
            pain_score, severity_bucket = estimate_pain_from_text(transcript)
            nlp_result = {
                "success": True,
                "agent": "pain_nlp",
                "transcript": transcript,
                "pain_nrs": pain_score,
                "severity": severity_bucket
            }
        except Exception as e:
            nlp_result = {
                "success": False,
                "error": str(e),
                "agent": "pain_nlp"
            }
        
        pipeline_result["steps"]["pain_nlp"] = nlp_result
        
        if not nlp_result.get("success"):
            pipeline_result["final_result"] = {
                "success": False,
                "error": "Pain NLP processing failed",
                "details": nlp_result
            }
            return pipeline_result
        
        # Step 3: TTS Agent (optional)
        tts_text = f"The estimated arm pain is {pain_score:.1f} out of ten, which is {severity_bucket}."
        
        if output_audio:
            tts_request = {
                "text": tts_text,
                "output_path": output_audio,
                "language_code": language,
                "voice_name": voice_name
            }
            
            tts_result = self.call_agent("tts_agent.py", tts_request)
            pipeline_result["steps"]["tts"] = tts_result
        else:
            pipeline_result["steps"]["tts"] = {"skipped": True, "reason": "No output audio path specified"}
        
        # Final result
        pipeline_result["final_result"] = {
            "success": True,
            "audio_input": audio_path,
            "transcript": transcript,
            "pain_nrs": pain_score,
            "severity": severity_bucket,
            "assessment_text": tts_text,
            "output_audio": output_audio if output_audio else None
        }
        
        return pipeline_result

def main():
    parser = argparse.ArgumentParser(description="Pain Assessment Orchestrator - Coordinates ASR and TTS agents")
    parser.add_argument("--audio", required=True, help="Input audio file path")
    parser.add_argument("--language", default="en-US", help="Language code")
    parser.add_argument("--voice", default="en-US-Neural2-F", help="TTS voice name")
    parser.add_argument("--output-audio", help="Output audio file path (optional)")
    parser.add_argument("--output-json", help="Output JSON file path (optional)")
    args = parser.parse_args()
    
    orchestrator = PainOrchestrator()
    
    result = orchestrator.process_audio(
        audio_path=args.audio,
        language=args.language,
        voice_name=args.voice,
        output_audio=args.output_audio
    )
    
    # Output result
    if args.output_json:
        with open(args.output_json, 'w') as f:
            json.dump(result, f, indent=2)
    else:
        print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()