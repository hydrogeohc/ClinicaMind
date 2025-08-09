import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Calendar, TrendingUp, Stethoscope, ArrowRight } from "lucide-react";
import { FollowUpAssessmentComponentProps } from "~/types/components";
import { cn } from "~/lib/utils";

export function FollowUpAssessmentComponent({ 
  visitType,
  daysSinceLastVisit,
  patientName,
  previousTreatment,
  clinicalDecision
}: FollowUpAssessmentComponentProps) {
  const getEffectivenessColor = (effectiveness: string) => {
    switch (effectiveness) {
      case "effective":
        return "text-green-700 bg-green-50 border-green-200";
      case "partially-effective":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "ineffective":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const getEffectivenessBadge = (effectiveness: string) => {
    switch (effectiveness) {
      case "effective":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Effective</Badge>;
      case "partially-effective":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Partially Effective</Badge>;
      case "ineffective":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Ineffective</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Follow-Up Assessment - {patientName}
          <Badge variant="outline">{daysSinceLastVisit} days later</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visit Timeline */}
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Visit Timeline</span>
          </div>
          <div className="text-sm text-blue-700">
            {visitType === "follow-up" ? "Follow-up" : "Initial"} visit • {daysSinceLastVisit} days since last appointment
          </div>
        </div>

        {/* Previous Treatment Response */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            Previous Treatment Response
          </h4>
          
          <div className={cn("p-4 rounded-lg border-2 mb-3", getEffectivenessColor(previousTreatment.effectiveness))}>
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium">Treatment Effectiveness</h5>
              {getEffectivenessBadge(previousTreatment.effectiveness)}
            </div>
            
            <div className="text-sm mb-3">
              <strong>Medications Tried:</strong>
              <ul className="mt-1 space-y-1">
                {previousTreatment.medications.map((medication, index) => (
                  <li key={index} className="ml-4">• {medication}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Ongoing Symptoms */}
          {previousTreatment.ongoingSymptoms.length > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <h5 className="font-medium text-amber-800 mb-2">Ongoing Symptoms</h5>
              <ul className="text-sm text-amber-700 space-y-1">
                {previousTreatment.ongoingSymptoms.map((symptom, index) => (
                  <li key={index}>• {symptom}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Separator />

        {/* Clinical Decision */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-green-600" />
            Clinical Decision & Next Steps
          </h4>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-r">
              <h5 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Next Step
              </h5>
              <p className="text-sm text-green-800">{clinicalDecision.nextStep}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <h5 className="font-medium text-slate-800 mb-2">Clinical Reasoning</h5>
              <p className="text-sm text-slate-600">{clinicalDecision.reasoning}</p>
            </div>

            {/* Working Diagnosis */}
            {clinicalDecision.workingDiagnosis && clinicalDecision.workingDiagnosis.length > 0 && (
              <div>
                <h5 className="font-medium text-indigo-700 mb-2">Working Diagnosis</h5>
                <div className="flex flex-wrap gap-2">
                  {clinicalDecision.workingDiagnosis.map((diagnosis, index) => (
                    <Badge key={index} className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                      {diagnosis}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-800">Case Progress</p>
              <p className="text-sm text-slate-600">Advancing to diagnostic testing phase</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}