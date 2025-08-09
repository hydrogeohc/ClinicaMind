
import argparse, json, os, re, sys, tempfile, numpy as np

# ==== ASR backends ====
def transcribe_whisper(audio_path: str, model_name: str = "small", language: str = "en") -> str:
    """
    Try faster-whisper first; if unavailable, fall back to openai-whisper.
    """
    try:
        from faster_whisper import WhisperModel
        model = WhisperModel(model_name, device="auto", compute_type="auto")
        segments, info = model.transcribe(audio_path, language=language, beam_size=5, vad_filter=True)
        transcript = " ".join(seg.text.strip() for seg in segments)
        return transcript.strip()
    except Exception as e_fast:
        print(f"[faster-whisper] failed ({e_fast}). Falling back to openai/whisper...", file=sys.stderr)
        try:
            import whisper
            model = whisper.load_model(model_name)
            result = model.transcribe(audio_path, language=language)
            return result["text"].strip()
        except Exception as e_open:
            raise RuntimeError(f"Both faster-whisper and openai-whisper failed: {e_open}") from e_open

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
def tts_coqui(text: str, out_wav: str, model_id: str = "tts_models/en/ljspeech/tacotron2-DDC"):
    # Coqui TTS (higher quality; needs first-time download)
    from TTS.api import TTS
    tts = TTS(model_id)
    tts.tts_to_file(text=text, file_path=out_wav)

def tts_pyttsx3(text: str):
    # pyttsx3 is lightweight and fully offline
    import pyttsx3
    engine = pyttsx3.init()
    engine.say(text)
    engine.runAndWait()

def main():
    import argparse
    p = argparse.ArgumentParser(description="ASR→NLP→TTS pipeline for estimating arm pain NRS from audio.")
    p.add_argument("--audio", required=True, help="Path to WAV/MP3")
    p.add_argument("--whisper-model", default="small", help="Whisper size: tiny, base, small, medium, large-v3")
    p.add_argument("--language", default="en", help="Spoken language code (e.g., en)")
    p.add_argument("--tts", choices=["coqui","pyttsx3","none"], default="coqui", help="Text-to-speech backend")
    p.add_argument("--coqui-model-id", default="tts_models/en/ljspeech/tacotron2-DDC", help="Coqui TTS model id")
    p.add_argument("--out-json", default="asr_tts_output.json")
    p.add_argument("--out-tts", default="pain_assessment_tts.wav")
    args = p.parse_args()

    # ASR
    print(f"[ASR] Transcribing with Whisper model: {args.whisper_model}")
    transcript = transcribe_whisper(args.audio, model_name=args.whisper_model, language=args.language)
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
    if args.tts == "coqui":
        print(f"[TTS] Synthesizing speech with Coqui to {args.out_tts}")
        tts_coqui(tts_text, args.out_tts, model_id=args.coqui_model_id)
        print(f"[I/O] Saved {args.out_tts}")
    elif args.tts == "pyttsx3":
        print("[TTS] Speaking result via pyttsx3 (no file saved).")
        tts_pyttsx3(tts_text)
    else:
        print("[TTS] Skipped.")

if __name__ == "__main__":
    main()
