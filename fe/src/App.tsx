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
        delay: 2000, // 2 seconds
        component: {
          component: "generic-info",
          params: {
            id: "session-start",
            title: "Consultation Started - David S",
            content: "First visit consultation initiated. Patient presenting with chief complaint of arm pain.",
            type: "info"
          }
        }
      },
      {
        delay: 3000, // 3 seconds after previous
        component: {
          component: "assessment",
          params: {
            id: "clinical-assessment",
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
        delay: 4000, // 4 seconds after previous
        component: {
          component: "pain-assessment",
          params: {
            id: "pain-diagram",
            conversationId: 1,
            patientName: "David S"
          }
        }
      },
      {
        delay: 3500, // 3.5 seconds after previous
        component: {
          component: "physical-examination",
          params: {
            id: "physical-exam",
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
        delay: 4000, // 4 seconds after previous
        component: {
          component: "treatment-plan",
          params: {
            id: "treatment-plan",
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
        delay: 2000, // 2 seconds
        component: {
          component: "follow-up-assessment",
          params: {
            id: "follow-up-assessment",
            visitType: "follow-up",
            daysSinceLastVisit: 30,
            patientName: "David S",
            previousTreatment: {
              medications: ["Extra strength Tylenol (self-administered)", "High-dose Ibuprofen (prescribed)"],
              effectiveness: "ineffective",
              ongoingSymptoms: ["Pain when laying down", "Pain when turning head left", "Continued arm pain"]
            },
            clinicalDecision: {
              nextStep: "EMG and Nerve Conduction Velocity Testing",
              reasoning: "Pain persists despite treatment for 30 days. Suspect pinched nerves requiring diagnostic confirmation.",
              workingDiagnosis: ["Pinched nerve", "Cervical radiculopathy", "Nerve compression syndrome"]
            }
          }
        }
      },
      {
        delay: 3000, // 3 seconds after previous
        component: {
          component: "pain-assessment",
          params: {
            id: "persistent-pain-diagram",
            conversationId: 2,
            patientName: "David S"
          }
        }
      },
      {
        delay: 4000, // 4 seconds after previous
        component: {
          component: "medication-interaction",
          params: {
            id: "medication-safety-check",
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
        delay: 4500, // 4.5 seconds after previous
        component: {
          component: "emg-test",
          params: {
            id: "emg-nerve-testing",
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
