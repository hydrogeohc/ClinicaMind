#!/usr/bin/env python3
"""
Example script showing how to use the agent-based pain assessment pipeline.
"""
import json
import sys

def main():
    if len(sys.argv) < 2:
        print("Usage: python run_agent_pipeline.py <audio_file>")
        print("Example: python run_agent_pipeline.py sample_audio.wav")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    
    # Run the orchestrator
    import subprocess
    
    cmd = [
        sys.executable, "pain_orchestrator.py",
        "--audio", audio_file,
        "--language", "en-US",
        "--voice", "en-US-Neural2-F",
        "--output-audio", "pain_assessment_output.wav"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        # Parse and display the JSON result
        output_data = json.loads(result.stdout)
        
        print("🎤 Pain Assessment Results:")
        print("="*50)
        
        final = output_data.get("final_result", {})
        if final.get("success"):
            print(f"Transcript: {final['transcript']}")
            print(f"Pain Score: {final['pain_nrs']:.1f}/10")
            print(f"Severity: {final['severity']}")
            print(f"Assessment: {final['assessment_text']}")
            if final.get('output_audio'):
                print(f"Audio Output: {final['output_audio']}")
        else:
            print(f"❌ Error: {final.get('error', 'Unknown error')}")
        
        print("\n📊 Detailed Agent Results:")
        print(json.dumps(output_data, indent=2))
        
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