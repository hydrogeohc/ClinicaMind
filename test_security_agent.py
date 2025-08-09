#!/usr/bin/env python3
"""
Test script for the Security & Ethics Agent
"""
import json
import subprocess
import sys

def run_agent_test(request_data, description):
    """Run a test case for the security agent"""
    print(f"\n🧪 Test: {description}")
    print("="*50)
    
    try:
        process = subprocess.Popen(
            [sys.executable, "security_ethics_agent.py"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        stdout, stderr = process.communicate(input=json.dumps(request_data))
        
        if process.returncode != 0:
            print(f"❌ Agent failed: {stderr}")
            return False
        
        result = json.loads(stdout)
        print(f"✅ Success: {result.get('success')}")
        
        # Print key results
        if 'input_validation' in result:
            iv = result['input_validation']
            print(f"   Input Secure: {iv.get('secure')}")
            print(f"   Issues Found: {len(iv.get('issues', []))}")
            if not iv.get('secure'):
                print(f"   Redacted Text: {iv.get('redacted_text')}")
        
        if 'ethics_validation' in result:
            ev = result['ethics_validation']
            print(f"   Ethically Compliant: {ev.get('ethically_compliant')}")
            print(f"   Recommendations: {len(ev.get('recommendations', []))}")
            if ev.get('recommendations'):
                for rec in ev['recommendations']:
                    print(f"     - {rec.get('priority')}: {rec.get('reason')}")
        
        if 'overall_status' in result:
            os = result['overall_status']
            print(f"   Overall Approved: {os.get('approved')}")
            print(f"   Requires Review: {os.get('requires_review')}")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

def main():
    print("🛡️  Security & Ethics Agent Test Suite")
    print("="*60)
    
    # Test 1: Normal input validation
    run_agent_test({
        "mode": "input_validation",
        "text": "My arm hurts about a 6 out of 10. It's been bothering me for days."
    }, "Normal Pain Description")
    
    # Test 2: Input with sensitive data
    run_agent_test({
        "mode": "input_validation", 
        "text": "My arm hurts and my SSN is 123-45-6789, please help."
    }, "Input with SSN (should be redacted)")
    
    # Test 3: Input with concerning language
    run_agent_test({
        "mode": "input_validation",
        "text": "The pain is so bad I just want to kill myself."
    }, "Input with concerning language")
    
    # Test 4: Normal assessment validation
    run_agent_test({
        "mode": "assessment_validation",
        "pain_score": 5.5,
        "severity": "moderate (4-6)",
        "transcript": "My arm hurts about a 6 out of 10."
    }, "Normal Pain Assessment")
    
    # Test 5: High pain score assessment
    run_agent_test({
        "mode": "assessment_validation",
        "pain_score": 9.2,
        "severity": "severe (7-10)",
        "transcript": "The pain is excruciating, it's unbearable."
    }, "Emergency Pain Level")
    
    # Test 6: Full pipeline test
    run_agent_test({
        "mode": "full_pipeline",
        "text": "My credit card 1234567890123456 was stolen and the pain is terrible, about 8 out of 10.",
        "pain_score": 8.0,
        "severity": "severe (7-10)",
        "transcript": "My credit card 1234567890123456 was stolen and the pain is terrible, about 8 out of 10."
    }, "Full Pipeline with Security Issues")
    
    print(f"\n✅ Test suite completed")

if __name__ == "__main__":
    main()