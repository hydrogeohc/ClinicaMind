
import argparse, json, os, re, sys, tempfile, numpy as np

# ==== ASR backends ====
def transcribe_google_cloud(audio_path: str, language: str = "en-US") -> str:
    """
    Transcribe audio using Google Cloud Speech-to-Text API.
    Provides superior accuracy and performance compared to Whisper.
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
        print(f"[Google Cloud Speech] Recognition failed: {e}", file=sys.stderr)
        
        config.encoding = speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED
        try:
            response = client.recognize(config=config, audio=audio)
            transcript_parts = []
            for result in response.results:
                transcript_parts.append(result.alternatives[0].transcript)
            return " ".join(transcript_parts).strip()
        except Exception as e2:
            raise RuntimeError(f"Google Cloud Speech recognition failed: {e2}") from e2

# ==== Pain NLP extractor ====
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

# ==== TTS backends ====
def tts_google_cloud(text: str, out_wav: str, language_code: str = "en-US", voice_name: str = "en-US-Neural2-F"):
    """
    Generate speech using Google Cloud Text-to-Speech API.
    Provides superior quality and natural-sounding voices.
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
    
    try:
        response = client.synthesize_speech(
            input=synthesis_input, 
            voice=voice, 
            audio_config=audio_config
        )
        
        with open(out_wav, "wb") as out:
            out.write(response.audio_content)
            
    except Exception as e:
        raise RuntimeError(f"Google Cloud Text-to-Speech failed: {e}") from e

def tts_google_cloud_speak(text: str):
    """
    Play synthesized speech directly without saving to file.
    """
    import tempfile
    import os
    try:
        import soundfile as sf
        import numpy as np
        from io import BytesIO
    except ImportError:
        print("[TTS] soundfile not available for direct playback. Use file output instead.", file=sys.stderr)
        return
    
    from google.cloud import texttospeech
    
    client = texttospeech.TextToSpeechClient()
    
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US",
        name="en-US-Neural2-F",
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.LINEAR16,
        sample_rate_hertz=24000,
    )
    
    try:
        response = client.synthesize_speech(
            input=synthesis_input, 
            voice=voice, 
            audio_config=audio_config
        )
        
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp_file:
            tmp_file.write(response.audio_content)
            tmp_path = tmp_file.name
        
        try:
            import pygame
            pygame.mixer.init()
            pygame.mixer.music.load(tmp_path)
            pygame.mixer.music.play()
            while pygame.mixer.music.get_busy():
                pygame.time.wait(100)
        except ImportError:
            print(f"[TTS] Audio saved to {tmp_path}. Install pygame for direct playback.", file=sys.stderr)
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
                
    except Exception as e:
        raise RuntimeError(f"Google Cloud Text-to-Speech playback failed: {e}") from e

def main():
    import argparse
    p = argparse.ArgumentParser(description="ASR→NLP→TTS pipeline for estimating arm pain NRS from audio using Google Cloud.")
    p.add_argument("--audio", required=True, help="Path to WAV/MP3")
    p.add_argument("--language", default="en-US", help="Language code (e.g., en-US, es-ES)")
    p.add_argument("--tts", choices=["google_cloud","google_cloud_speak","none"], default="google_cloud", help="Text-to-speech backend")
    p.add_argument("--voice-name", default="en-US-Neural2-F", help="Google Cloud TTS voice name")
    p.add_argument("--out-json", default="asr_tts_output.json")
    p.add_argument("--out-tts", default="pain_assessment_tts.wav")
    args = p.parse_args()

    # ASR
    print(f"[ASR] Transcribing with Google Cloud Speech-to-Text")
    transcript = transcribe_google_cloud(args.audio, language=args.language)
    print(f"[ASR] Transcript: {transcript}")

    # NLP pain estimation
    est, bucket = estimate_pain_from_text(transcript)
    print(f"[Pain] Estimated NRS: {est:.2f}  |  Bucket: {bucket}")

    # Save JSON
    payload = {"audio": args.audio, "transcript": transcript, "pain_nrs": est, "severity": bucket}
    with open(args.out_json, "w") as f:
        json.dump(payload, f, indent=2)
    print(f"[I/O] Saved {args.out_json}")

    # TTS
    tts_text = f"The estimated arm pain is {est:.1f} out of ten, which is {bucket}."
    if args.tts == "google_cloud":
        print(f"[TTS] Synthesizing speech with Google Cloud TTS to {args.out_tts}")
        tts_google_cloud(tts_text, args.out_tts, language_code=args.language, voice_name=args.voice_name)
        print(f"[I/O] Saved {args.out_tts}")
    elif args.tts == "google_cloud_speak":
        print("[TTS] Speaking result via Google Cloud TTS (direct playback).")
        tts_google_cloud_speak(tts_text)
    else:
        print("[TTS] Skipped.")

if __name__ == "__main__":
    main()
