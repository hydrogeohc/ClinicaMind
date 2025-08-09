import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { PhysicalExaminationComponentProps } from "~/types/components";
import { cn } from "~/lib/utils";

export function PhysicalExaminationComponent({ 
  examinerName, 
  examinationType,
  rangeOfMotion,
  neurologicalFindings,
  additionalFindings = []
}: PhysicalExaminationComponentProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "painful":
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "limited":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-700";
      case "painful":
        return "text-amber-700";
      case "limited":
        return "text-red-700";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Physical Examination - {examinationType}
          <Badge variant="outline">Dr. {examinerName}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Range of Motion */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            Range of Motion Assessment
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <span className="text-sm">Arm Raise</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(rangeOfMotion.armRaise)}
                <span className={cn("text-sm font-medium", getStatusColor(rangeOfMotion.armRaise))}>
                  {rangeOfMotion.armRaise}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <span className="text-sm">Head Turn Left</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(rangeOfMotion.headTurning.left)}
                <span className={cn("text-sm font-medium", getStatusColor(rangeOfMotion.headTurning.left))}>
                  {rangeOfMotion.headTurning.left}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <span className="text-sm">Head Turn Right</span>
              <div className="flex items-center gap-2">
                {getStatusIcon(rangeOfMotion.headTurning.right)}
                <span className={cn("text-sm font-medium", getStatusColor(rangeOfMotion.headTurning.right))}>
                  {rangeOfMotion.headTurning.right}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Neurological Findings */}
        <div>
          <h4 className="font-semibold mb-3">Neurological Assessment</h4>
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-1">Reflexes</h5>
              <p className="text-sm text-muted-foreground">{neurologicalFindings.reflexes}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-2">Strength Testing</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Biceps:</span>
                  <span className="text-muted-foreground">{neurologicalFindings.strength.biceps}</span>
                </div>
                <div className="flex justify-between">
                  <span>Triceps:</span>
                  <span className="text-muted-foreground">{neurologicalFindings.strength.triceps}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shoulder:</span>
                  <span className="text-muted-foreground">{neurologicalFindings.strength.shoulder}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hand Grip:</span>
                  <span className="text-muted-foreground">{neurologicalFindings.strength.handGrip}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span>Finger Strength:</span>
                  <span className="text-muted-foreground">{neurologicalFindings.strength.fingerStrength}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium mb-1">Sensation</h5>
              <p className="text-sm text-muted-foreground">{neurologicalFindings.sensation}</p>
            </div>
          </div>
        </div>

        {additionalFindings.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Additional Findings</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {additionalFindings.map((finding, index) => (
                  <li key={index}>• {finding}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}