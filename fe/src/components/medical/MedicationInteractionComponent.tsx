import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Shield, AlertTriangle, CheckCircle, Pill } from "lucide-react";
import { MedicationInteractionComponentProps } from "~/types/components";
import { cn } from "~/lib/utils";

export function MedicationInteractionComponent({ 
  currentMedications,
  proposedProcedure,
  interactions,
  recommendations
}: MedicationInteractionComponentProps) {
  const getInteractionIcon = (interaction: string) => {
    switch (interaction) {
      case "none":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "caution":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "contraindicated":
        return <Shield className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInteractionColor = (interaction: string) => {
    switch (interaction) {
      case "none":
        return "text-green-700 bg-green-50 border-green-200";
      case "caution":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "contraindicated":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getInteractionBadge = (interaction: string) => {
    switch (interaction) {
      case "none":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Safe</Badge>;
      case "caution":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Caution</Badge>;
      case "contraindicated":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Contraindicated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          Medication Interaction Check
          <Badge variant="outline">Safety Review</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Medications */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Pill className="h-4 w-4 text-blue-600" />
            Current Medications
          </h4>
          <div className="grid gap-2">
            {currentMedications.map((medication, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
                <div>
                  <div className="font-medium text-blue-900">{medication.name}</div>
                  <div className="text-sm text-blue-700">
                    {medication.dosage && `${medication.dosage} • `}
                    {medication.purpose}
                  </div>
                </div>
                <Pill className="h-4 w-4 text-blue-600" />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Proposed Procedure */}
        <div className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r">
          <h4 className="font-semibold text-indigo-900 mb-2">Proposed Procedure</h4>
          <p className="text-sm text-indigo-800">{proposedProcedure}</p>
        </div>

        {/* Interaction Analysis */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Shield className="h-4 w-4 text-purple-600" />
            Interaction Analysis
          </h4>
          <div className="space-y-3">
            {interactions.map((interaction, index) => (
              <div 
                key={index} 
                className={cn("p-4 rounded-lg border-2", getInteractionColor(interaction.interaction))}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getInteractionIcon(interaction.interaction)}
                    <span className="font-medium">{interaction.medication}</span>
                  </div>
                  {getInteractionBadge(interaction.interaction)}
                </div>
                <p className="text-sm">{interaction.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Clinical Recommendations
              </h4>
              <div className="space-y-2">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded border-l-4 border-green-400">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-green-700">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Safety Summary */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Safety Assessment Complete</p>
              <p className="text-sm text-slate-600">
                {interactions.every(i => i.interaction === "none") 
                  ? "No contraindications identified - Safe to proceed"
                  : interactions.some(i => i.interaction === "contraindicated")
                  ? "Contraindications identified - Review required"
                  : "Cautions noted - Proceed with monitoring"
                }
              </p>
            </div>
            <div className="flex items-center gap-1">
              {interactions.every(i => i.interaction === "none") && (
                <CheckCircle className="h-8 w-8 text-green-500" />
              )}
              {interactions.some(i => i.interaction === "contraindicated") && (
                <Shield className="h-8 w-8 text-red-500" />
              )}
              {interactions.some(i => i.interaction === "caution") && !interactions.some(i => i.interaction === "contraindicated") && (
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}