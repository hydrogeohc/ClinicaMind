import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { User, Clock, MapPin, Activity, TrendingUp, TrendingDown } from "lucide-react";
import { AssessmentComponentProps } from "~/types/components";

export function AssessmentComponent({ 
  patientName,
  chiefComplaint,
  onsetDetails,
  painCharacteristics,
  associatedSymptoms,
  aggravatingFactors,
  alleviatingFactors,
  workingDiagnosis = []
}: AssessmentComponentProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Clinical Assessment - {patientName}
          <Badge variant="outline">Evaluation</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chief Complaint */}
        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r">
          <h4 className="font-semibold mb-2 text-blue-900">Chief Complaint</h4>
          <p className="text-sm text-blue-800">{chiefComplaint}</p>
        </div>

        {/* Onset Details */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Onset & Timeline
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="font-medium min-w-fit">Duration:</span>
              <span className="text-muted-foreground">{onsetDetails.timeframe}</span>
            </div>
            {onsetDetails.precipitatingEvent && (
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-fit">Precipitating Event:</span>
                <span className="text-muted-foreground">{onsetDetails.precipitatingEvent}</span>
              </div>
            )}
            {onsetDetails.delayedOnset && (
              <div className="flex items-start gap-2">
                <span className="font-medium min-w-fit">Delayed Onset:</span>
                <span className="text-muted-foreground">{onsetDetails.delayedOnset}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Pain Characteristics */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Pain Characteristics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h5 className="text-sm font-medium mb-2">Location</h5>
              <p className="text-sm text-muted-foreground">{painCharacteristics.location}</p>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-2">Quality</h5>
              <div className="flex flex-wrap gap-1">
                {painCharacteristics.quality.map((quality, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {quality}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-2">Pattern</h5>
              <Badge variant="outline" className="text-xs">
                {painCharacteristics.pattern}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Associated Symptoms */}
        {associatedSymptoms.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Associated Symptoms
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {associatedSymptoms.map((symptom, index) => (
                <li key={index}>• {symptom}</li>
              ))}
            </ul>
          </div>
        )}

        {(aggravatingFactors.length > 0 || alleviatingFactors.length > 0) && <Separator />}

        {/* Aggravating and Alleviating Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {aggravatingFactors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-600" />
                <span className="text-red-700">Aggravating Factors</span>
              </h4>
              <ul className="text-sm space-y-1">
                {aggravatingFactors.map((factor, index) => (
                  <li key={index} className="text-red-600">• {factor}</li>
                ))}
              </ul>
            </div>
          )}

          {alleviatingFactors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-green-600" />
                <span className="text-green-700">Alleviating Factors</span>
              </h4>
              <ul className="text-sm space-y-1">
                {alleviatingFactors.map((factor, index) => (
                  <li key={index} className="text-green-600">• {factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {workingDiagnosis.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 text-purple-700">Working Diagnosis</h4>
              <div className="flex flex-wrap gap-2">
                {workingDiagnosis.map((diagnosis, index) => (
                  <Badge key={index} className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {diagnosis}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}