#!/usr/bin/env python3
import json
import sys
import argparse
import re
import hashlib
from typing import Dict, Any, List, Tuple
from datetime import datetime

class SecurityEthicsAgent:
    def __init__(self):
        self.name = "Security_Ethics_Agent"
        self.version = "1.0"
        
        # Security patterns to detect
        self.sensitive_patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
            r'\b\d{16}\b',  # Credit card
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',  # Email
            r'\b\d{10}\b',  # Phone number (simple)
            r'\b(?:password|pwd|pass)\s*[:=]\s*\S+',  # Passwords
        ]
        
        # Medical ethics validation keywords
        self.concerning_terms = [
            'suicide', 'kill myself', 'end it all', 'self-harm', 'overdose',
            'abuse', 'neglect', 'violence', 'illegal', 'drug dealing'
        ]
        
        # Ethical guidelines for pain assessment
        self.pain_score_thresholds = {
            'emergency': 9.0,  # Requires immediate attention
            'urgent': 7.0,     # Requires timely follow-up
            'concerning': 5.0   # Monitor closely
        }
    
    def validate_input_security(self, text: str) -> Dict[str, Any]:
        """
        Validate input text for security concerns.
        """
        issues = []
        redacted_text = text
        
        # Check for sensitive data patterns
        for pattern in self.sensitive_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                issues.append({
                    'type': 'sensitive_data',
                    'pattern': pattern,
                    'position': [match.start(), match.end()],
                    'severity': 'high'
                })
                # Redact sensitive data
                redacted_text = re.sub(pattern, '[REDACTED]', redacted_text, flags=re.IGNORECASE)
        
        # Check for concerning terms that might need escalation
        concerning_found = []
        for term in self.concerning_terms:
            if term.lower() in text.lower():
                concerning_found.append(term)
                issues.append({
                    'type': 'concerning_content',
                    'term': term,
                    'severity': 'medium',
                    'action_required': 'review'
                })
        
        return {
            'secure': len(issues) == 0,
            'issues': issues,
            'redacted_text': redacted_text,
            'concerning_terms': concerning_found,
            'requires_escalation': len(concerning_found) > 0
        }
    
    def validate_pain_assessment_ethics(self, pain_score: float, severity: str, transcript: str) -> Dict[str, Any]:
        """
        Validate pain assessment results from ethical perspective.
        """
        recommendations = []
        ethical_flags = []
        
        # Check pain score thresholds
        if pain_score >= self.pain_score_thresholds['emergency']:
            recommendations.append({
                'priority': 'immediate',
                'action': 'emergency_protocol',
                'reason': f'Pain score {pain_score} indicates severe distress requiring immediate medical attention'
            })
            ethical_flags.append('emergency_pain_level')
        
        elif pain_score >= self.pain_score_thresholds['urgent']:
            recommendations.append({
                'priority': 'urgent',
                'action': 'urgent_follow_up',
                'reason': f'Pain score {pain_score} requires timely medical follow-up within 24 hours'
            })
            ethical_flags.append('urgent_pain_level')
        
        elif pain_score >= self.pain_score_thresholds['concerning']:
            recommendations.append({
                'priority': 'routine',
                'action': 'schedule_follow_up',
                'reason': f'Pain score {pain_score} should be monitored and followed up'
            })
        
        # Check for concerning language in transcript
        concerning_found = []
        for term in self.concerning_terms:
            if term.lower() in transcript.lower():
                concerning_found.append(term)
                recommendations.append({
                    'priority': 'immediate',
                    'action': 'human_review_required',
                    'reason': f'Concerning language detected: {term}'
                })
                ethical_flags.append('concerning_language')
        
        return {
            'ethically_compliant': len(ethical_flags) == 0,
            'flags': ethical_flags,
            'recommendations': recommendations,
            'requires_human_review': any(flag in ['emergency_pain_level', 'concerning_language'] for flag in ethical_flags)
        }
    
    def generate_audit_log(self, session_id: str, validation_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate audit log entry for compliance tracking.
        """
        return {
            'session_id': session_id,
            'timestamp': datetime.utcnow().isoformat(),
            'agent': self.name,
            'validation_summary': {
                'input_secure': validation_results.get('input_validation', {}).get('secure', True),
                'ethically_compliant': validation_results.get('ethics_validation', {}).get('ethically_compliant', True),
                'requires_escalation': validation_results.get('input_validation', {}).get('requires_escalation', False),
                'requires_human_review': validation_results.get('ethics_validation', {}).get('requires_human_review', False)
            },
            'recommendations': validation_results.get('ethics_validation', {}).get('recommendations', []),
            'security_issues_count': len(validation_results.get('input_validation', {}).get('issues', [])),
            'ethical_flags_count': len(validation_results.get('ethics_validation', {}).get('flags', []))
        }
    
    def process(self, request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process security and ethics validation request.
        Expected input: {
            'mode': 'input_validation' | 'assessment_validation' | 'full_pipeline',
            'text': 'text to validate',  # for input_validation
            'pain_score': float,  # for assessment_validation
            'severity': 'severity level',  # for assessment_validation
            'transcript': 'original transcript',  # for assessment_validation
            'session_id': 'unique_session_id'  # optional
        }
        """
        try:
            mode = request.get('mode', 'full_pipeline')
            session_id = request.get('session_id', hashlib.md5(str(datetime.utcnow()).encode()).hexdigest()[:8])
            
            results = {
                'success': True,
                'agent': self.name,
                'mode': mode,
                'session_id': session_id
            }
            
            if mode in ['input_validation', 'full_pipeline']:
                text = request.get('text', '')
                if text:
                    results['input_validation'] = self.validate_input_security(text)
                else:
                    return {
                        'success': False,
                        'error': 'Missing text for input validation',
                        'agent': self.name
                    }
            
            if mode in ['assessment_validation', 'full_pipeline']:
                pain_score = request.get('pain_score')
                severity = request.get('severity', '')
                transcript = request.get('transcript', '')
                
                if pain_score is not None:
                    results['ethics_validation'] = self.validate_pain_assessment_ethics(
                        pain_score, severity, transcript
                    )
                else:
                    return {
                        'success': False,
                        'error': 'Missing pain_score for assessment validation',
                        'agent': self.name
                    }
            
            # Generate audit log
            results['audit_log'] = self.generate_audit_log(session_id, results)
            
            # Determine overall status
            input_secure = results.get('input_validation', {}).get('secure', True)
            ethically_compliant = results.get('ethics_validation', {}).get('ethically_compliant', True)
            
            results['overall_status'] = {
                'approved': input_secure and ethically_compliant,
                'requires_review': (
                    results.get('input_validation', {}).get('requires_escalation', False) or
                    results.get('ethics_validation', {}).get('requires_human_review', False)
                ),
                'blocking_issues': not input_secure
            }
            
            return results
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'agent': self.name
            }

def main():
    parser = argparse.ArgumentParser(description="Security & Ethics Agent - Validates input and assessment for safety and compliance")
    parser.add_argument("--input", "-i", help="JSON input string or file path")
    parser.add_argument("--mode", choices=['input_validation', 'assessment_validation', 'full_pipeline'], 
                       default='full_pipeline', help="Validation mode")
    parser.add_argument("--text", help="Text to validate (input validation mode)")
    parser.add_argument("--pain-score", type=float, help="Pain score to validate (assessment mode)")
    parser.add_argument("--severity", help="Pain severity level (assessment mode)")
    parser.add_argument("--transcript", help="Original transcript (assessment mode)")
    args = parser.parse_args()
    
    agent = SecurityEthicsAgent()
    
    if args.input:
        if args.input.startswith('{'):
            request = json.loads(args.input)
        else:
            with open(args.input, 'r') as f:
                request = json.load(f)
    elif any([args.text, args.pain_score]):
        request = {
            'mode': args.mode,
            'text': args.text,
            'pain_score': args.pain_score,
            'severity': args.severity,
            'transcript': args.transcript
        }
    else:
        request = json.load(sys.stdin)
    
    result = agent.process(request)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()