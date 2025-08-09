#!/usr/bin/env python3
import json
import sys
import argparse
import tempfile
import os
from typing import Dict, Any

def tts_google_cloud(text: str, out_wav: str, language_code: str = "en-US", voice_name: str = "en-US-Neural2-F"):
    """
    Generate speech using Google Cloud Text-to-Speech API.
    """
    from google.cloud import texttospeech
    
    client = texttospeech.TextToSpeechClient()
    
    synthesis_input = texttospeech.SynthesisInput(text=text)
    
    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        name=voice_name,
    )
    
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16,
        sample_rate_hertz=24000,
        speaking_rate=1.0,
        pitch=0.0,
    )
    
    response = client.synthesize_speech(
        input=synthesis_input, 
        voice=voice, 
        audio_config=audio_config
    )
    
    with open(out_wav, "wb") as out:
        out.write(response.audio_content)

class TTSAgent:
    def __init__(self):
        self.name = "TTS_Agent"
        self.version = "1.0"
    
    def process(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process TTS request and return JSON response.
        Expected input: {
            "text": "text to synthesize",
            "output_path": "path/to/output.wav",
            "language_code": "en-US",
            "voice_name": "en-US-Neural2-F"
        }
        """
        try:
            text = request.get("text")
            output_path = request.get("output_path")
            language_code = request.get("language_code", "en-US")
            voice_name = request.get("voice_name", "en-US-Neural2-F")
            
            if not text:
                return {
                    "success": False,
                    "error": "Missing text in request",
                    "agent": self.name
                }
            
            if not output_path:
                output_path = tempfile.mktemp(suffix=".wav")
            
            tts_google_cloud(text, output_path, language_code, voice_name)
            
            return {
                "success": True,
                "agent": self.name,
                "text": text,
                "output_path": output_path,
                "language_code": language_code,
                "voice_name": voice_name,
                "file_size": os.path.getsize(output_path) if os.path.exists(output_path) else 0
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "agent": self.name
            }

def main():
    parser = argparse.ArgumentParser(description="TTS Agent - Text-to-Speech service")
    parser.add_argument("--input", "-i", help="JSON input string or file path")
    parser.add_argument("--text", help="Text to synthesize (direct mode)")
    parser.add_argument("--output", help="Output audio file path")
    parser.add_argument("--language", default="en-US", help="Language code")
    parser.add_argument("--voice", default="en-US-Neural2-F", help="Voice name")
    args = parser.parse_args()
    
    agent = TTSAgent()
    
    if args.text:
        request = {
            "text": args.text,
            "output_path": args.output,
            "language_code": args.language,
            "voice_name": args.voice
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