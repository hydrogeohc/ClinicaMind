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
    
    def process_dual_audio(self, first_visit_path: str, second_visit_path: str, language: str = "en-US", voice_name: str = "en-US-Neural2-F", output_audio: str = None) -> Dict[str, Any]:
        """
        Complete pain assessment pipeline using agent architecture for both visits.
        """
        pipeline_result = {
            "pipeline": "dual_visit_pain_assessment",
            "orchestrator": self.name,
            "steps": {},
            "final_result": {}
        }
        
        # Process both audio files
        visits_data = {}
        
        for visit_name, audio_path in [("first_visit", first_visit_path), ("second_visit", second_visit_path)]:
            # Step 1: ASR Agent for each visit
            asr_request = {
                "audio_path": audio_path,
                "language": language
            }
            
            asr_result = self.call_agent("asr_agent.py", asr_request)
            pipeline_result["steps"][f"{visit_name}_asr"] = asr_result
            
            if not asr_result.get("success"):
                pipeline_result["final_result"] = {
                    "success": False,
                    "error": f"ASR agent failed for {visit_name}",
                    "details": asr_result
                }
                return pipeline_result
            
            visits_data[visit_name] = {
                "audio_path": audio_path,
                "transcript": asr_result["transcript"]
            }
        
        # Step 2: TTS Agent - Generate combined assessment text
        combined_transcript = f"First visit: {visits_data['first_visit']['transcript']} | Second visit: {visits_data['second_visit']['transcript']}"
        tts_text = f"Pain assessment comparison between first and second visit."
        
        tts_request = {
            "text": tts_text,
            "output_path": output_audio if output_audio else "temp_assessment.wav",
            "language_code": language,
            "voice_name": voice_name
        }
        
        tts_result = self.call_agent("tts_agent.py", tts_request)
        pipeline_result["steps"]["tts"] = tts_result
        
        # Step 3: Pain Assessment Agent for both visits
        pain_assessments = {}
        for visit_name, visit_data in visits_data.items():
            pain_request = {
                "transcript": visit_data["transcript"],
                "visit_type": visit_name
            }
            
            pain_result = self.call_agent("pain_assessment_agent.py", pain_request)
            pipeline_result["steps"][f"{visit_name}_pain_assessment"] = pain_result
            
            if not pain_result.get("success"):
                pipeline_result["final_result"] = {
                    "success": False,
                    "error": f"Pain assessment failed for {visit_name}",
                    "details": pain_result
                }
                return pipeline_result
            
            pain_assessments[visit_name] = pain_result
        
        # Step 4: Security & Ethics Agent
        security_request = {
            "mode": "dual_visit_validation",
            "first_visit_transcript": visits_data["first_visit"]["transcript"],
            "second_visit_transcript": visits_data["second_visit"]["transcript"],
            "first_visit_assessment": pain_assessments["first_visit"],
            "second_visit_assessment": pain_assessments["second_visit"]
        }
        
        security_result = self.call_agent("security_ethics_agent.py", security_request)
        pipeline_result["steps"]["security_ethics"] = security_result
        
        if not security_result.get("success"):
            pipeline_result["final_result"] = {
                "success": False,
                "error": "Security & Ethics validation failed",
                "details": security_result
            }
            return pipeline_result
        
        # Step 5: Test Security Agent
        test_security_request = {
            "assessment_data": {
                "first_visit": pain_assessments["first_visit"],
                "second_visit": pain_assessments["second_visit"]
            },
            "security_validation": security_result
        }
        
        test_security_result = self.call_agent("test_security_agent.py", test_security_request)
        pipeline_result["steps"]["test_security"] = test_security_result
        
        if not test_security_result.get("success"):
            pipeline_result["final_result"] = {
                "success": False,
                "error": "Security testing failed",
                "details": test_security_result
            }
            return pipeline_result
        
        # Final result
        pipeline_result["final_result"] = {
            "success": True,
            "pipeline_type": "dual_visit_pain_assessment",
            "visits": {
                "first_visit": {
                    "audio_input": visits_data["first_visit"]["audio_path"],
                    "transcript": visits_data["first_visit"]["transcript"],
                    "pain_assessment": pain_assessments["first_visit"]
                },
                "second_visit": {
                    "audio_input": visits_data["second_visit"]["audio_path"],
                    "transcript": visits_data["second_visit"]["transcript"],
                    "pain_assessment": pain_assessments["second_visit"]
                }
            },
            "comparison": {
                "first_visit_pain_score": pain_assessments["first_visit"].get("pain_nrs", 0),
                "second_visit_pain_score": pain_assessments["second_visit"].get("pain_nrs", 0),
                "pain_change": pain_assessments["second_visit"].get("pain_nrs", 0) - pain_assessments["first_visit"].get("pain_nrs", 0),
                "first_visit_severity": pain_assessments["first_visit"].get("severity", "unknown"),
                "second_visit_severity": pain_assessments["second_visit"].get("severity", "unknown")
            },
            "tts_output": tts_result,
            "security_status": security_result.get("overall_status", {}),
            "security_test_results": test_security_result,
            "requires_review": security_result.get("overall_status", {}).get("requires_review", False)
        }
        
        return pipeline_result

def main():
    parser = argparse.ArgumentParser(description="Pain Assessment Orchestrator - Processes dual visit audio files")
    parser.add_argument("--first-visit", required=True, help="First visit audio file path")
    parser.add_argument("--second-visit", required=True, help="Second visit audio file path") 
    parser.add_argument("--language", default="en-US", help="Language code")
    parser.add_argument("--voice", default="en-US-Neural2-F", help="TTS voice name")
    parser.add_argument("--output-audio", help="Output audio file path (optional)")
    parser.add_argument("--output-json", help="Output JSON file path (optional)")
    args = parser.parse_args()
    
    orchestrator = PainOrchestrator()
    
    result = orchestrator.process_dual_audio(
        first_visit_path=args.first_visit,
        second_visit_path=args.second_visit,
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