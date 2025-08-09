#!/usr/bin/env python3
import json
import sys
import argparse
import os
from typing import Dict, Any

def transcribe_openai_whisper(audio_path: str, language: str = "en") -> str:
    """
    Transcribe audio using OpenAI Whisper API.
    """
    from openai import OpenAI
    
    # Initialize OpenAI client
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    try:
        with open(audio_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language=language[:2] if len(language) > 2 else language  # Convert en-US to en
            )
        
        return transcript.text.strip()
    
    except Exception as e:
        raise RuntimeError(f"OpenAI Whisper transcription failed: {str(e)}") from e

class ASRAgent:
    def __init__(self):
        self.name = "ASR_Agent"
        self.version = "1.0"
    
    def process(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process ASR request and return JSON response.
        Expected input: {"audio_path": "path/to/file", "language": "en-US"}
        """
        try:
            audio_path = request.get("audio_path")
            language = request.get("language", "en-US")
            
            if not audio_path:
                return {
                    "success": False,
                    "error": "Missing audio_path in request",
                    "agent": self.name
                }
            
            transcript = transcribe_openai_whisper(audio_path, language)
            
            return {
                "success": True,
                "agent": self.name,
                "transcript": transcript,
                "audio_path": audio_path,
                "language": language
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }

def main():
    parser = argparse.ArgumentParser(description="ASR Agent - Speech-to-Text service")
    parser.add_argument("--input", "-i", help="JSON input string or file path")
    parser.add_argument("--audio", help="Audio file path (direct mode)")
    parser.add_argument("--language", default="en-US", help="Language code")
    args = parser.parse_args()
    
    agent = ASRAgent()
    
    if args.audio:
        request = {
            "audio_path": args.audio,
            "language": args.language
        }
    elif args.input:
        if args.input.startswith('{'):
            request = json.loads(args.input)
        else:
            with open(args.input, 'r') as f:
                request = json.load(f)
    else:
        request = json.load(sys.stdin)
    
    result = agent.process(request)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()