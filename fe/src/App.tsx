import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { DynamicComponentRenderer } from "~/components/DynamicComponentRenderer";
import { useConversationDemo } from "~/hooks/useConversationDemo";
import { ConversationDemoConfig } from "~/types/components";

export default function Demo() {
  const [currentConversation, setCurrentConversation] = useState<1 | 2>(1);

  // Demo configuration for first visit (David S initial consultation)
  const firstVisitConfig: ConversationDemoConfig = {
    audioFile: "/first visit.m4a",
    components: [
      {
        delay: 1000, // 1 second - greeting
        component: {
          component: "generic-info",
          params: {
            id: "greeting",
            title: "Patient Greeting",
            content: "David S: 'Hi doctor, how are you?'",
            type: "info"
          }
        }
      },
      {
        delay: 8000, // 8 seconds - chief complaint [00:01-00:08]
        component: {
          component: "generic-info",
          params: {
            id: "chief-complaint",
            title: "Chief Complaint",
            content: "David S reports: 'I'm having very sharp pain on my left arm, the upper part on the front.'",
            type: "warning"
          }
        }
      },
      {
        delay: 9000, // 9 seconds - onset timing [00:08-00:17]
        component: {
          component: "generic-info",
          params: {
            id: "onset-details",
            title: "Pain Onset Details",
            content: "Started about a week ago. Patient fell on his back but didn't hit his arm. Pain started the day after the fall.",
            type: "info"
          }
        }
      },
      {
        delay: 5000, // 5 seconds - pain pattern [00:18-00:23]
        component: {
          component: "generic-info",
          params: {
            id: "pain-pattern",
            title: "Pain Pattern",
            content: "Dr. Sha asks about pain pattern. David S: 'It comes and goes.'",
            type: "info"
          }
        }
      },
      {
        delay: 12000, // 12 seconds - pain quality [00:23-00:35]
        component: {
          component: "generic-info",
          params: {
            id: "pain-quality",
            title: "Pain Description",
            content: "David S describes pain as 'Dull and sometimes stabbing. It kind of varies between those two.'",
            type: "info"
          }
        }
      },
      {
        delay: 14000, // 14 seconds - associated symptoms [00:36-00:49]
        component: {
          component: "generic-info",
          params: {
            id: "associated-symptoms",
            title: "Associated Symptoms",
            content: "David S reports: 'I've had shortness of breath sometimes I've noticed.' Occurs some of the time, not every time.",
            type: "warning"
          }
        }
      },
      {
        delay: 14000, // 14 seconds - pain relief [00:50-01:04]
        component: {
          component: "generic-info",
          params: {
            id: "current-treatment",
            title: "Current Self-Treatment",
            content: "David S: 'Sometimes I'll take like extra strength Tylenol and it kind of helps, but I haven't been given any pain medications yet.'",
            type: "success"
          }
        }
      },
      {
        delay: 12000, // 12 seconds - aggravating factors [01:05-01:17]
        component: {
          component: "generic-info",
          params: {
            id: "aggravating-factors",
            title: "Aggravating Factors",
            content: "Dr. Sha asks about triggers. David S: 'When I'm laying down. It makes it worse, yeah.'",
            type: "warning"
          }
        }
      },
      {
        delay: 17000, // 17 seconds - physical examination starts [01:18-01:35]
        component: {
          component: "generic-info",
          params: {
            id: "physical-exam-start",
            title: "Physical Examination Started",
            content: "Dr. Sha begins examination: 'Raise your arm up' → Normal. 'Turn your head to the right' → Normal. 'Turn to the left' → Patient reports pain.",
            type: "info"
          }
        }
      },
      {
        delay: 18000, // 18 seconds - neurological examination [01:36-01:54]
        component: {
          component: "generic-info",
          params: {
            id: "neuro-exam",
            title: "Neurological Examination",
            content: "Dr. Sha: 'Any weakness?' David S: 'No, no weakness at all.' Reflexes symmetric, strength normal in all muscle groups, sensation intact bilaterally.",
            type: "success"
          }
        }
      },
      {
        delay: 3000, // 3 seconds - treatment transition [01:54-01:57]
        component: {
          component: "generic-info",
          params: {
            id: "treatment-transition",
            title: "Treatment Discussion",
            content: "Dr. Sha: 'Now, let's talk treatment plan and diagnosis.'",
            type: "info"
          }
        }
      },
      {
        delay: 10000, // 10 seconds - medication prescription [01:58-02:07]
        component: {
          component: "generic-info",
          params: {
            id: "medication-prescribed",
            title: "Medication Prescribed",
            content: "Dr. Sha prescribes: 'Here's some high-dose ibuprofen. Let's try that for the next week, twice a day, see if you feel...'",
            type: "success"
          }
        }
      },
      {
        delay: 5000, // 5 seconds - summary components
        component: {
          component: "pain-assessment",
          params: {
            id: "pain-diagram-summary",
            conversationId: 1,
            patientName: "David S"
          }
        }
      },
      {
        delay: 3000, // 3 seconds after pain diagram
        component: {
          component: "assessment",
          params: {
            id: "clinical-assessment-summary",
            patientName: "David S",
            chiefComplaint: "Sharp pain in left upper arm (front/upper part)",
            onsetDetails: {
              timeframe: "Started about 1 week ago",
              precipitatingEvent: "Fell on back (didn't hit arm directly)",
              delayedOnset: "Pain began day after the fall"
            },
            painCharacteristics: {
              quality: ["dull", "stabbing"],
              pattern: "intermittent",
              location: "Left upper arm, front/upper part"
            },
            associatedSymptoms: ["Shortness of breath (sometimes)"],
            aggravatingFactors: ["Laying down", "Turning head to the left"],
            alleviatingFactors: ["Extra strength Tylenol provides partial relief"]
          }
        }
      },
      {
        delay: 3000, // 3 seconds after assessment
        component: {
          component: "physical-examination",
          params: {
            id: "physical-exam-summary",
            examinerName: "Dr. Sha",
            examinationType: "Focused Musculoskeletal and Neurological Examination",
            rangeOfMotion: {
              armRaise: "normal",
              headTurning: {
                left: "painful",
                right: "normal"
              }
            },
            neurologicalFindings: {
              reflexes: "Symmetric reflexes bilaterally",
              strength: {
                biceps: "Normal, no weakness",
                triceps: "Normal, no weakness", 
                shoulder: "Normal, no weakness",
                handGrip: "Normal, no weakness",
                fingerStrength: "Normal, no weakness"
              },
              sensation: "Intact and symmetric in both arms"
            },
            additionalFindings: [
              "Patient reports pain when turning head to the left",
              "No visible swelling or deformity observed",
              "Full range of motion in arm raise test"
            ]
          }
        }
      },
      {
        delay: 3000, // 3 seconds after physical exam
        component: {
          component: "treatment-plan",
          params: {
            id: "treatment-plan-summary",
            prescribedMedications: [
              {
                name: "High-dose Ibuprofen",
                dosage: "High-dose",
                frequency: "Twice a day",
                duration: "1 week",
                instructions: "Take to see if symptoms improve"
              }
            ],
            followUpInstructions: [
              "Monitor pain levels over the next week",
              "Return if symptoms worsen or persist",
              "Continue current Tylenol as needed for breakthrough pain"
            ],
            nextSteps: [
              "Follow up in 1 week if no improvement",
              "Consider imaging studies if pain persists",
              "Evaluate response to anti-inflammatory treatment"
            ]
          }
        }
      }
    ],
    onComponentAdd: (component) => {
      console.log("Component added:", component.component);
    },
    onSequenceComplete: () => {
      console.log("First visit demo completed");
    }
  };

  // Demo configuration for follow-up visit (30 days later)
  const followUpVisitConfig: ConversationDemoConfig = {
    audioFile: "/second visit.m4a",
    components: [
      {
        delay: 8000, // 8 seconds - follow-up status [00:00-00:08]
        component: {
          component: "generic-info",
          params: {
            id: "follow-up-status",
            title: "30-Day Follow-up",
            content: "Dr. Sha: 'So now it's been a month and you're still feeling the pain. I think we should take a closer look to see what may be causing it.'",
            type: "warning"
          }
        }
      },
      {
        delay: 12000, // 12 seconds - patient treatment report [00:08-00:20]
        component: {
          component: "generic-info",
          params: {
            id: "treatment-report",
            title: "Treatment Response",
            content: "David S: 'I was taking the Tylenol or the ibuprofen that you've prescribed. I'm still getting the pain when I lay down and I'm not sure what's going on with me. I'm starting to get worried.'",
            type: "warning"
          }
        }
      },
      {
        delay: 10000, // 10 seconds - doctor's plan [00:21-00:31]
        component: {
          component: "generic-info",
          params: {
            id: "clinical-decision",
            title: "Clinical Decision",
            content: "Dr. Sha: 'No weakness. So we'll take a closer look and seeing what's going on as far as what maybe causing the symptoms. I suspect it to be pinched nerves, but we'll take a look.'",
            type: "info"
          }
        }
      },
      {
        delay: 17000, // 17 seconds - EMG introduction [00:32-00:48]
        component: {
          component: "generic-info",
          params: {
            id: "emg-introduction",
            title: "Diagnostic Test Ordered",
            content: "Patient asks: 'What is this test?' Dr. Sha: 'It's called an EMG. It's a electromyography and nerve conduction velocity testing. Looks to see if the nerves are getting pinched, what spot maybe they're getting pinched or hurt or injured.'",
            type: "info"
          }
        }
      },
      {
        delay: 9000, // 9 seconds - patient understanding [00:49-00:58]
        component: {
          component: "generic-info",
          params: {
            id: "patient-understanding",
            title: "Patient Understanding",
            content: "David S: 'Oh, that's interesting. I can see it here on the tablet. So this is basically what my it's going to measure the nerve activity.'",
            type: "success"
          }
        }
      },
      {
        delay: 17000, // 17 seconds - first test explanation [00:58-01:15]
        component: {
          component: "generic-info",
          params: {
            id: "ncs-explanation",
            title: "Nerve Conduction Study",
            content: "Dr. Sha: 'We're going to start the first half of the test involves us putting a little electric current and following the current from the nerve all the way to the spinal cord and back. And that measuring of that will tell us what may or may not be going on with the nerves.'",
            type: "info"
          }
        }
      },
      {
        delay: 7000, // 7 seconds - pain concern [01:13-01:22]
        component: {
          component: "generic-info",
          params: {
            id: "pain-concern",
            title: "Pain Tolerance Discussion",
            content: "David S: 'Is it going to hurt?' Dr. Sha: 'It's a little uncomfortable. It's honestly like very quick such as a rubber band being snapped against the skin.' David S: 'Okay, I can handle that.'",
            type: "warning"
          }
        }
      },
      {
        delay: 16000, // 16 seconds - EMG needle explanation [01:23-01:39]
        component: {
          component: "generic-info",
          params: {
            id: "emg-needle-explanation",
            title: "EMG Needle Procedure",
            content: "Dr. Sha: 'Second half of the test, I'll insert a needle almost like acupuncture into a few spots in the muscles to measure the signal and that will give us an idea of what may be going on with the nerves that address those muscles.'",
            type: "info"
          }
        }
      },
      {
        delay: 14000, // 14 seconds - medication interaction [01:40-01:54]
        component: {
          component: "generic-info",
          params: {
            id: "medication-interaction-check",
            title: "Medication Safety Check",
            content: "David S: 'I am on some medication, Prozac. Does that affect any of this?' Dr. Sha: 'No, it's totally fine. The only thing we worry about is if you were on blood thinners, sometimes you can get a little excess bleeding from the needle insertion.'",
            type: "success"
          }
        }
      },
      {
        delay: 5000, // 5 seconds - safety confirmation [01:55-02:00]
        component: {
          component: "generic-info",
          params: {
            id: "safety-confirmation",
            title: "Safety Confirmed",
            content: "David S: 'I'm not taking any aspirin or anything like that.' Dr. Sha: 'Great. Perfect. Then you should be fine.'",
            type: "success"
          }
        }
      },
      {
        delay: 5000, // 5 seconds - summary components start
        component: {
          component: "pain-assessment",
          params: {
            id: "persistent-pain-diagram-summary",
            conversationId: 2,
            patientName: "David S"
          }
        }
      },
      {
        delay: 3000, // 3 seconds after pain diagram
        component: {
          component: "follow-up-assessment",
          params: {
            id: "follow-up-assessment-summary",
            visitType: "follow-up",
            daysSinceLastVisit: 30,
            patientName: "David S",
            previousTreatment: {
              medications: ["Extra strength Tylenol (self-administered)", "High-dose Ibuprofen (prescribed)"],
              effectiveness: "ineffective",
              ongoingSymptoms: ["Pain when laying down", "Pain when turning head left", "Continued arm pain", "Patient getting worried"]
            },
            clinicalDecision: {
              nextStep: "EMG and Nerve Conduction Velocity Testing",
              reasoning: "Pain persists despite treatment for 30 days. No weakness observed. Suspect pinched nerves requiring diagnostic confirmation.",
              workingDiagnosis: ["Pinched nerve", "Cervical radiculopathy", "Nerve compression syndrome"]
            }
          }
        }
      },
      {
        delay: 3000, // 3 seconds after follow-up assessment
        component: {
          component: "medication-interaction",
          params: {
            id: "medication-safety-check-summary",
            currentMedications: [
              {
                name: "Prozac",
                purpose: "Antidepressant therapy"
              }
            ],
            proposedProcedure: "EMG and Nerve Conduction Velocity Testing with needle insertion",
            interactions: [
              {
                medication: "Prozac",
                interaction: "none",
                explanation: "Prozac (fluoxetine) does not interfere with EMG/NCV testing procedures. No contraindications identified."
              }
            ],
            recommendations: [
              "Procedure is safe to perform with current Prozac therapy",
              "No medication adjustments needed prior to testing",
              "Only blood thinners would be contraindicated - patient confirms not taking aspirin"
            ]
          }
        }
      },
      {
        delay: 3000, // 3 seconds after medication interaction
        component: {
          component: "emg-test",
          params: {
            id: "emg-nerve-testing-summary",
            testName: "EMG & Nerve Conduction Velocity Testing",
            testType: "Combined",
            clinicalIndication: "Evaluate for pinched nerves causing persistent left upper arm pain after conservative treatment failure",
            procedureSteps: [
              {
                step: "Nerve Conduction Study (NCS)",
                description: "Small electrical current applied to follow nerve pathway from arm to spinal cord and back",
                discomfortLevel: "mild"
              },
              {
                step: "Electromyography (EMG)", 
                description: "Fine needle insertion into specific muscles (similar to acupuncture) to measure electrical signals",
                discomfortLevel: "mild"
              }
            ],
            expectedFindings: [
              "Identify specific nerve compression locations",
              "Measure nerve conduction velocity",
              "Assess muscle electrical activity patterns",
              "Determine severity of nerve involvement"
            ],
            patientConcerns: [
              "Patient asked: 'Is it going to hurt?' - Explained mild discomfort like rubber band snap",
              "Patient confirmed ability to handle mild discomfort level",
              "Medication interaction with Prozac addressed and cleared"
            ]
          }
        }
      }
    ],
    onComponentAdd: (component) => {
      console.log("Component added:", component.component);
    },
    onSequenceComplete: () => {
      console.log("Follow-up visit demo completed");
    }
  };

  const currentConfig = currentConversation === 1 ? firstVisitConfig : followUpVisitConfig;
  const { components, isPlaying, startDemo, stopDemo, resetDemo } = useConversationDemo(currentConfig);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();

        if (isPlaying) {
          stopDemo();
          console.log("Demo stopped");
        } else {
          if (components.length > 0) {
            resetDemo();
            console.log("Demo reset");
          } else {
            startDemo();
            console.log("Demo started");
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [isPlaying, components.length, startDemo, stopDemo, resetDemo]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">ClinicaMind</div>
        <div className="flex items-center gap-4">
          {/* Conversation Switcher */}
          <div className="flex items-center gap-2">
            <Button 
              variant={currentConversation === 1 ? "default" : "outline"} 
              size="sm"
              onClick={() => {
                if (currentConversation !== 1) {
                  setCurrentConversation(1);
                  resetDemo();
                }
              }}
              disabled={isPlaying}
            >
              First Visit
            </Button>
            <Button 
              variant={currentConversation === 2 ? "default" : "outline"} 
              size="sm"
              onClick={() => {
                if (currentConversation !== 2) {
                  setCurrentConversation(2);
                  resetDemo();
                }
              }}
              disabled={isPlaying}
            >
              Follow-up (30d)
            </Button>
          </div>
          <div className="text-right">
            <div className="font-semibold">Dr. James Andrews</div>
            <div className="text-sm text-muted-foreground">Northwell</div>
          </div>
          <Avatar>
            <AvatarFallback className="bg-muted">JA</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content - Two Column Grid */}
      <div className="grid grid-cols-2 h-[calc(100vh-73px)]">
        {/* Left Column - Patient Info */}
        <div className="p-6 border-r">
          <div className="mb-6">
            <div className="flex items-baseline gap-6 mb-4">
              <h1 className="text-3xl font-bold">Andrey Los</h1>
              <span className="text-lg text-muted-foreground">
                Patient 55 / M
              </span>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="labs">Labs</TabsTrigger>
                <TabsTrigger value="imaging">Imaging</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="bg-blue-50/50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Vital Signs & Lab Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="font-medium">BP</span>
                        <span>80 / 40</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">BUN</span>
                        <span>42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">HR</span>
                        <span>124</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">INR</span>
                        <span>1.4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Platelets</span>
                        <span>72</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Creatinine</span>
                        <span>1.2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Hematocrit</span>
                        <span>32 / B40</span>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-4 text-sm">
                      <p>
                        Hematemesis with red clots (large/small no Hematochezia)
                        for 1 day with Syncope
                      </p>

                      <div>
                        <h3 className="font-medium mb-1">
                          Last Bowel Movement
                        </h3>
                        <p className="text-muted-foreground">
                          6 hr ago, Red blood (Tarry Black/Brown stool)
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-1">Rectal Exam</h3>
                        <p className="text-muted-foreground">
                          Reveals Ongoing red blood (No melena)
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-1">Prior History</h3>
                        <p className="text-muted-foreground">
                          Patient denies prior history CAD, COPD, CRF risk for
                          stress ulcer, cirrhosis. Patient is on aspirin, PPI
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="labs">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Lab results will be displayed here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="imaging">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Imaging results will be displayed here.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column - Dynamic Scrollable Content */}
        <div className="bg-muted/30">
          <ScrollArea className="h-full">
            <div className="p-6">
              {components.length > 0 ? (
                <DynamicComponentRenderer components={components} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Notes & Assessment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center py-12">
                      <p className="text-lg font-medium mb-2">
                        {currentConversation === 1 ? "David S - First Visit" : "David S - Follow-up Visit (30 days)"}
                      </p>
                      <p className="text-muted-foreground mb-4">
                        Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Space</kbd> to start the conversation demo
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentConversation === 1 
                          ? "Initial consultation for left upper arm pain following a fall"
                          : "Follow-up visit after 30 days of treatment - EMG testing ordered"
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
