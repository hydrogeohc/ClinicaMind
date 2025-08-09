import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Pill, CheckCircle, Clock, ArrowRight } from "lucide-react";
import { TreatmentPlanComponentProps } from "~/types/components";

export function TreatmentPlanComponent({ 
  prescribedMedications,
  procedures = [],
  followUpInstructions,
  nextSteps = []
}: TreatmentPlanComponentProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5" />
          Treatment Plan
          <Badge variant="outline">Prescribed</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prescribed Medications */}
        {prescribedMedications.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Pill className="h-4 w-4 text-blue-600" />
              Prescribed Medications
            </h4>
            <div className="space-y-3">
              {prescribedMedications.map((medication, index) => (
                <div key={index} className="p-4 border rounded-lg bg-blue-50/50 border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-blue-900">{medication.name}</h5>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {medication.duration}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                    <div>
                      <span className="font-medium">Dosage:</span>
                      <span className="text-muted-foreground ml-2">{medication.dosage}</span>
                    </div>
                    <div>
                      <span className="font-medium">Frequency:</span>
                      <span className="text-muted-foreground ml-2">{medication.frequency}</span>
                    </div>
                  </div>
                  
                  {medication.instructions && (
                    <div className="text-sm">
                      <span className="font-medium">Instructions:</span>
                      <span className="text-muted-foreground ml-2">{medication.instructions}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Procedures */}
        {procedures.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Procedures
              </h4>
              <div className="space-y-2">
                {procedures.map((procedure, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                    <div>
                      <div className="font-medium">{procedure.name}</div>
                      <div className="text-sm text-muted-foreground">{procedure.description}</div>
                    </div>
                    {procedure.completed !== undefined && (
                      <Badge variant={procedure.completed ? "default" : "secondary"}>
                        {procedure.completed ? "Completed" : "Pending"}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Follow-up Instructions */}
        {followUpInstructions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                Follow-up Instructions
              </h4>
              <ul className="space-y-2">
                {followUpInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Next Steps */}
        {nextSteps.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-purple-600" />
                Next Steps
              </h4>
              <div className="space-y-2">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-purple-50 rounded border-l-4 border-purple-400">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className="text-sm text-purple-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}