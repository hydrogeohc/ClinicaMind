#!/usr/bin/env python3
import json
import sys
import argparse
from typing import Dict, Any

def transcribe_google_cloud(audio_path: str, language: str = "en-US") -> str:
    """
    Transcribe audio using Google Cloud Speech-to-Text API.
    """
    from google.cloud import speech
    
    client = speech.SpeechClient()
    
    with open(audio_path, "rb") as audio_file:
        content = audio_file.read()
    
    audio = speech.RecognitionAudio(content=content)
    
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code=language,
        enable_automatic_punctuation=True,
        enable_word_time_offsets=False,
        model="latest_long",
        use_enhanced=True,
    )
    
    try:
        response = client.recognize(config=config, audio=audio)
        
        transcript_parts = []
        for result in response.results:
            transcript_parts.append(result.alternatives[0].transcript)
        
        return " ".join(transcript_parts).strip()
    
    except Exception as e:
        config.encoding = speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED
        try:
            response = client.recognize(config=config, audio=audio)
            transcript_parts = []
            for result in response.results:
                transcript_parts.append(result.alternatives[0].transcript)
            return " ".join(transcript_parts).strip()
        except Exception as e2:
            raise RuntimeError(f"Google Cloud Speech recognition failed: {e2}") from e2

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
            
            transcript = transcribe_google_cloud(audio_path, language)
            
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