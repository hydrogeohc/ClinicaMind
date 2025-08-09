import { 
  PhysicalExaminationComponent,
  AssessmentComponent,
  TreatmentPlanComponent,
  PainAssessmentComponent,
  EMGTestComponent,
  FollowUpAssessmentComponent,
  MedicationInteractionComponent,
  RecentLabResultsComponent, 
  GenericInfoComponent 
} from "~/components/medical";
import { DynamicComponent, ComponentRendererProps } from "~/types/components";

export function DynamicComponentRenderer({ components }: ComponentRendererProps) {
  const renderComponent = (dynamicComponent: DynamicComponent, index: number) => {
    const key = `${dynamicComponent.component}-${dynamicComponent.params.id || index}`;

    switch (dynamicComponent.component) {
      case "physical-examination":
        return (
          <PhysicalExaminationComponent 
            key={key}
            {...dynamicComponent.params}
          />
        );
      case "assessment":
        return (
          <AssessmentComponent 
            key={key}
            {...dynamicComponent.params}
          />
        );
      case "treatment-plan":
        return (
          <TreatmentPlanComponent 
            key={key}
            {...dynamicComponent.params}
          />
        );
      case "pain-assessment":
        return (
          <PainAssessmentComponent 
            key={key}
            {...dynamicComponent.params}
          />
        );
      case "emg-test":
        return (
          <EMGTestComponent 
            key={key}
            {...dynamicComponent.params}
          />
        );
      case "follow-up-assessment":
        return (
          <FollowUpAssessmentComponent 
            key={key}
            {...dynamicComponent.params}
          />
        );
      case "medication-interaction":
        return (
          <MedicationInteractionComponent 
            key={key}
            {...dynamicComponent.params}
          />
        );
      case "recent-lab-result":
        return (
          <RecentLabResultsComponent 
            key={key}
            {...dynamicComponent.params}
          />
        );
      case "generic-info":
        return (
          <GenericInfoComponent 
            key={key}
            {...dynamicComponent.params}
          />
        );
      default:
        // Fallback for unknown component types
        return (
          <GenericInfoComponent 
            key={key}
            title="Unknown Component"
            content="This component type is not recognized by the system."
            type="warning"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {components.map((component, index) => renderComponent(component, index))}
    </div>
  );
}