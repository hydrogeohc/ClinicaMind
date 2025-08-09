// Base props that all dynamic components should have
export interface BaseComponentProps {
  timestamp?: number;
  id?: string;
}

// Props for physical examination component
export interface PhysicalExaminationComponentProps extends BaseComponentProps {
  examinerName: string;
  examinationType: string;
  rangeOfMotion: {
    armRaise: "normal" | "limited" | "painful";
    headTurning: {
      left: "normal" | "painful" | "limited";
      right: "normal" | "painful" | "limited";
    };
  };
  neurologicalFindings: {
    reflexes: string;
    strength: {
      biceps: string;
      triceps: string;
      shoulder: string;
      handGrip: string;
      fingerStrength: string;
    };
    sensation: string;
  };
  additionalFindings?: string[];
}

// Props for clinical assessment component
export interface AssessmentComponentProps extends BaseComponentProps {
  patientName: string;
  chiefComplaint: string;
  onsetDetails: {
    timeframe: string;
    precipitatingEvent?: string;
    delayedOnset?: string;
  };
  painCharacteristics: {
    quality: string[];
    pattern: "continuous" | "intermittent" | "episodic";
    location: string;
  };
  associatedSymptoms: string[];
  aggravatingFactors: string[];
  alleviatingFactors: string[];
  workingDiagnosis?: string[];
}

// Props for treatment plan component
export interface TreatmentPlanComponentProps extends BaseComponentProps {
  prescribedMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  procedures?: Array<{
    name: string;
    description: string;
    completed?: boolean;
  }>;
  followUpInstructions: string[];
  nextSteps?: string[];
}

// Props for pain assessment component
export interface PainAssessmentComponentProps extends BaseComponentProps {
  conversationId: 1 | 2;
  patientName?: string;
}

// Props for EMG/nerve conduction testing component
export interface EMGTestComponentProps extends BaseComponentProps {
  testName: string;
  testType: "EMG" | "NCV" | "Combined";
  procedureSteps: Array<{
    step: string;
    description: string;
    discomfortLevel?: "minimal" | "mild" | "moderate";
  }>;
  clinicalIndication: string;
  expectedFindings?: string[];
  patientConcerns?: string[];
}

// Props for follow-up assessment component
export interface FollowUpAssessmentComponentProps extends BaseComponentProps {
  visitType: "follow-up" | "initial";
  daysSinceLastVisit: number;
  patientName: string;
  previousTreatment: {
    medications: string[];
    effectiveness: "effective" | "partially-effective" | "ineffective";
    ongoingSymptoms: string[];
  };
  clinicalDecision: {
    nextStep: string;
    reasoning: string;
    workingDiagnosis?: string[];
  };
}

// Props for medication interaction component
export interface MedicationInteractionComponentProps extends BaseComponentProps {
  currentMedications: Array<{
    name: string;
    dosage?: string;
    purpose: string;
  }>;
  proposedProcedure: string;
  interactions: Array<{
    medication: string;
    interaction: "none" | "caution" | "contraindicated";
    explanation: string;
  }>;
  recommendations: string[];
}

export interface RecentLabResultsComponentProps extends BaseComponentProps {
  labType: string;
  results: Array<{
    test: string;
    value: string | number;
    unit?: string;
    reference_range?: string;
    status: "normal" | "high" | "low" | "critical";
  }>;
  interpretation?: string;
  date: string;
}

// Props for clinical guidance component (proactive recommendations)
export interface ClinicalGuidanceComponentProps extends BaseComponentProps {
  title: string;
  guidanceType: "examination" | "questions" | "procedure" | "assessment";
  recommendations: string[];
  context?: string;
  priority?: "high" | "medium" | "low";
}

// Props for insurance coverage component
export interface InsuranceCoverageComponentProps extends BaseComponentProps {
  procedureName: string;
  icd10Code: string;
  cptCode: string;
  coverageStatus: "covered" | "partial" | "not-covered" | "pre-auth-required";
  patientResponsibility?: string;
  notes?: string[];
  estimatedCost?: {
    total: string;
    patientPortion: string;
  };
}

// Props for generic information component (fallback)
export interface GenericInfoComponentProps extends BaseComponentProps {
  title: string;
  content: string;
  type?: "info" | "warning" | "success" | "error";
  sections?: Array<{
    title: string;
    content: string;
    items?: string[];
  }>;
}

// Union type for all dynamic components
export type DynamicComponent =
  | { component: "physical-examination"; params: PhysicalExaminationComponentProps }
  | { component: "assessment"; params: AssessmentComponentProps }
  | { component: "treatment-plan"; params: TreatmentPlanComponentProps }
  | { component: "pain-assessment"; params: PainAssessmentComponentProps }
  | { component: "emg-test"; params: EMGTestComponentProps }
  | { component: "follow-up-assessment"; params: FollowUpAssessmentComponentProps }
  | { component: "medication-interaction"; params: MedicationInteractionComponentProps }
  | { component: "recent-lab-result"; params: RecentLabResultsComponentProps }
  | { component: "clinical-guidance"; params: ClinicalGuidanceComponentProps }
  | { component: "insurance-coverage"; params: InsuranceCoverageComponentProps }
  | { component: "generic-info"; params: GenericInfoComponentProps };

// Type for component registry mapping
export type ComponentType = DynamicComponent["component"];

// Type for timed component sequence (for demo orchestration)
export interface TimedComponent {
  delay: number; // delay in ms from start or previous component
  component: DynamicComponent;
}

// Type for conversation demo configuration
export interface ConversationDemoConfig {
  audioFile?: string;
  components: TimedComponent[];
  autoPlay?: boolean;
  onComponentAdd?: (component: DynamicComponent) => void;
  onSequenceComplete?: () => void;
}

// Type for component renderer props
export interface ComponentRendererProps {
  components: DynamicComponent[];
  onComponentRemove?: (id: string) => void;
}
