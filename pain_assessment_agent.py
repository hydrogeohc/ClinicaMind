#!/usr/bin/env python3
import json
import sys
import re
import numpy as np
from typing import Dict, Any
import joblib
import os
import warnings

WORD2NUM = {"zero":0,"one":1,"two":2,"three":3,"four":4,"five":5,"six":6,"seven":7,"eight":8,"nine":9,"ten":10}
SEVERITY_WORDS = {
    "no pain":0, "mild":2, "slight":2, "tolerable":3, "moderate":5, "bad":6,
    "severe":8, "very severe":9, "excruciating":9.5, "worst imaginable":10, "worst":10, "agonizing":10
}
INTENSIFIERS = {
    "a little":-0.5, "a bit":-0.5, "some":-0.3, "quite":0.5, "really":0.8, "very":0.8, "extremely":1.0,
    "wakes me up":1.0, "can't sleep":1.2, "throbbing":0.3, "stabbing":0.7, "burning":0.5, "numb":-0.4
}

class PainAssessmentAgent:
    def __init__(self):
        self.name = "Pain_Assessment_Agent"
        self.version = "1.0"
        
        classification_model_path = "arm_pain_classification_model.joblib"
        regression_model_path = "arm_pain_regression_model.joblib"
        
        # Try to load models with error handling for version compatibility
        self.classification_model = None
        self.regression_model = None
        
        if os.path.exists(classification_model_path):
            try:
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    self.classification_model = joblib.load(classification_model_path)
            except Exception as e:
                print(f"Warning: Could not load classification model: {e}", file=sys.stderr)
                self.classification_model = None
            
        if os.path.exists(regression_model_path):
            try:
                with warnings.catch_warnings():
                    warnings.simplefilter("ignore")
                    self.regression_model = joblib.load(regression_model_path)
            except Exception as e:
                print(f"Warning: Could not load regression model: {e}", file=sys.stderr)
                self.regression_model = None

    def parse_numeric_scale(self, text: str):
        tl = text.lower()
        m = re.search(r'(\b\d{1,2})\s*(?:/|out of|over)\s*(?:10|ten)\b', tl)
        if m:
            return float(np.clip(int(m.group(1)), 0, 10))
        m = re.search(r'\b(zero|one|two|three|four|five|six|seven|eight|nine|ten)\s*(?:/|out of|over)\s*(?:10|ten)\b', tl)
        if m:
            return float(WORD2NUM[m.group(1)])
        return None

    def parse_severity_words(self, text: str):
        tl = text.lower()
        hits = []
        for phrase, score in sorted(SEVERITY_WORDS.items(), key=lambda x: -len(x[0])):
            if phrase in tl:
                hits.append(score)
        return float(np.mean(hits)) if hits else None

    def compute_intensifier_shift(self, text: str):
        tl = text.lower()
        return sum(w for phrase, w in INTENSIFIERS.items() if phrase in tl)

    def bucketize(self, x: float) -> str:
        if x <= 3: return "mild (0–3)"
        if x <= 6: return "moderate (4–6)"
        return "severe (7–10)"

    def estimate_pain_from_text(self, text: str):
        base = self.parse_numeric_scale(text)
        if base is None:
            base = self.parse_severity_words(text)
        if base is None:
            base = 4.5
        est = float(np.clip(base + self.compute_intensifier_shift(text), 0, 10))
        return est, self.bucketize(est)

    def assess_pain(self, request: Dict[str, Any]) -> Dict[str, Any]:
        try:
            transcript = request.get("transcript", "")
            visit_type = request.get("visit_type", "unknown")
            
            if not transcript:
                return {
                    "success": False,
                    "agent": self.name,
                    "error": "No transcript provided"
                }

            pain_score, severity_bucket = self.estimate_pain_from_text(transcript)
            
            result = {
                "success": True,
                "agent": self.name,
                "version": self.version,
                "visit_type": visit_type,
                "transcript": transcript,
                "pain_nrs": pain_score,
                "severity": severity_bucket,
                "classification": None,
                "regression_prediction": None
            }
            
            if self.classification_model:
                try:
                    classification_features = [len(transcript), transcript.lower().count('pain')]
                    classification_result = self.classification_model.predict([classification_features])[0]
                    result["classification"] = classification_result
                except Exception as e:
                    result["classification_error"] = str(e)
            
            if self.regression_model:
                try:
                    regression_features = [len(transcript), transcript.lower().count('pain')]
                    regression_result = self.regression_model.predict([regression_features])[0]
                    result["regression_prediction"] = float(regression_result)
                except Exception as e:
                    result["regression_error"] = str(e)
            
            return result
            
        except Exception as e:
            return {
                "success": False,
                "agent": self.name,
                "error": f"Pain assessment failed: {str(e)}"
            }

def main():
    try:
        request = json.loads(sys.stdin.read())
        
        agent = PainAssessmentAgent()
        response = agent.assess_pain(request)
        
        print(json.dumps(response, indent=2))
        
    except json.JSONDecodeError:
        error_response = {
            "success": False,
            "agent": "Pain_Assessment_Agent",
            "error": "Invalid JSON input"
        }
        print(json.dumps(error_response))
        sys.exit(1)
        
    except Exception as e:
        error_response = {
            "success": False,
            "agent": "Pain_Assessment_Agent", 
            "error": str(e)
        }
        print(json.dumps(error_response))
        sys.exit(1)

if __name__ == "__main__":
    main()