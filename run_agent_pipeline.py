#!/usr/bin/env python3
"""
Example script showing how to use the agent-based pain assessment pipeline.
"""
import json
import sys

def main():
    if len(sys.argv) < 3:
        print("Usage: python run_agent_pipeline.py <first_visit.m4a> <second_visit.m4a>")
        print("Example: python run_agent_pipeline.py 'first visit.m4a' 'second visit.m4a'")
        sys.exit(1)
    
    first_visit_file = sys.argv[1]
    second_visit_file = sys.argv[2]
    
    # Run the orchestrator
    import subprocess
    
    cmd = [
        sys.executable, "pain_orchestrator.py",
        "--first-visit", first_visit_file,
        "--second-visit", second_visit_file,
        "--language", "en-US",
        "--voice", "en-US-Neural2-F",
        "--output-audio", "pain_assessment_output.wav",
        "--output-json", "pain_assessment_results.json"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        # Parse and display the JSON result
        output_data = json.loads(result.stdout)
        
        print("🎤 Dual Visit Pain Assessment Results:")
        print("="*60)
        
        final = output_data.get("final_result", {})
        if final.get("success"):
            visits = final.get("visits", {})
            comparison = final.get("comparison", {})
            
            print("First Visit:")
            first_visit = visits.get("first_visit", {})
            first_assessment = first_visit.get("pain_assessment", {})
            print(f"  Transcript: {first_visit.get('transcript', 'N/A')}")
            print(f"  Pain Score: {first_assessment.get('pain_nrs', 0):.1f}/10")
            print(f"  Severity: {first_assessment.get('severity', 'unknown')}")
            
            print("\nSecond Visit:")
            second_visit = visits.get("second_visit", {})
            second_assessment = second_visit.get("pain_assessment", {})
            print(f"  Transcript: {second_visit.get('transcript', 'N/A')}")
            print(f"  Pain Score: {second_assessment.get('pain_nrs', 0):.1f}/10")
            print(f"  Severity: {second_assessment.get('severity', 'unknown')}")
            
            print("\nComparison:")
            pain_change = comparison.get("pain_change", 0)
            print(f"  Pain Change: {pain_change:+.1f} points")
            if pain_change > 0:
                print("  📈 Pain has increased")
            elif pain_change < 0:
                print("  📉 Pain has decreased")
            else:
                print("  ➡️  Pain level unchanged")
                
            print(f"\n💾 Results saved to: pain_assessment_results.json")
            if final.get('tts_output', {}).get('success'):
                print(f"🔊 Audio output: pain_assessment_output.wav")
        else:
            print(f"❌ Error: {final.get('error', 'Unknown error')}")
        
        print(f"\n📊 Detailed Agent Results saved to JSON file")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Pipeline failed: {e}")
        print(f"stdout: {e.stdout}")
        print(f"stderr: {e.stderr}")
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {e}")
        print(f"Raw output: {result.stdout}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == "__main__":
    main()