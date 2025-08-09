import { motion, AnimatePresence } from "framer-motion";
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
    <AnimatePresence initial={false}>
      <motion.div 
        layout
        className="space-y-6"
      >
        {components.slice().reverse().map((component, index) => {
          const key = `${component.component}-${component.params.id || index}`;
          return (
            <motion.div
              key={key}
              layout
              initial={{ 
                opacity: 0, 
                y: -50,
                scale: 0.95
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                y: -20,
                scale: 0.95
              }}
              whileHover={{ 
                y: -2,
                transition: { duration: 0.2 }
              }}
              transition={{ 
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                layout: { 
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94]
                },
                delay: index * 0.05 // Subtle stagger effect
              }}
            >
              {renderComponent(component, components.length - 1 - index)}
            </motion.div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}