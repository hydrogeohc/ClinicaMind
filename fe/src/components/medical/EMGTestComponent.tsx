import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Activity, Zap, Syringe, AlertCircle } from "lucide-react";
import { EMGTestComponentProps } from "~/types/components";
import { cn } from "~/lib/utils";

export function EMGTestComponent({ 
  testName,
  testType,
  procedureSteps,
  clinicalIndication,
  expectedFindings = [],
  patientConcerns = []
}: EMGTestComponentProps) {
  const getTestTypeIcon = () => {
    switch (testType) {
      case "EMG":
        return <Syringe className="h-5 w-5 text-blue-600" />;
      case "NCV":
        return <Zap className="h-5 w-5 text-yellow-600" />;
      case "Combined":
        return <Activity className="h-5 w-5 text-purple-600" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getDiscomfortColor = (level?: string) => {
    switch (level) {
      case "minimal":
        return "text-green-600 bg-green-50 border-green-200";
      case "mild":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "moderate":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTestTypeBadge = () => {
    switch (testType) {
      case "EMG":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Electromyography</Badge>;
      case "NCV":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Nerve Conduction</Badge>;
      case "Combined":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">EMG + NCV</Badge>;
      default:
        return <Badge variant="outline">Neurological Test</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getTestTypeIcon()}
          {testName}
          {getTestTypeBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Clinical Indication */}
        <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r">
          <h4 className="font-semibold mb-2 text-blue-900">Clinical Indication</h4>
          <p className="text-sm text-blue-800">{clinicalIndication}</p>
        </div>

        {/* Procedure Steps */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-600" />
            Procedure Steps
          </h4>
          <div className="space-y-3">
            {procedureSteps.map((step, index) => (
              <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium mb-1">{step.step}</h5>
                  <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                  {step.discomfortLevel && (
                    <Badge 
                      className={cn("text-xs", getDiscomfortColor(step.discomfortLevel))}
                      variant="outline"
                    >
                      {step.discomfortLevel} discomfort
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Concerns */}
        {patientConcerns.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Patient Concerns Addressed
              </h4>
              <div className="space-y-2">
                {patientConcerns.map((concern, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-amber-50 rounded border-l-4 border-amber-400">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-amber-700">{concern}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Expected Findings */}
        {expectedFindings.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-3 text-indigo-700">Expected Findings</h4>
              <ul className="space-y-1">
                {expectedFindings.map((finding, index) => (
                  <li key={index} className="text-sm text-indigo-600">• {finding}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Test Visualization */}
        <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
          <div className="text-center">
            <Activity className="h-12 w-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-600 font-medium">Nerve Signal Monitoring</p>
            <p className="text-xs text-slate-500 mt-1">Real-time electrical activity measurement</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}