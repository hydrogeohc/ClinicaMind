import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Shield, DollarSign, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { InsuranceCoverageComponentProps } from "~/types/components";

export function InsuranceCoverageComponent({ 
  procedureName, 
  icd10Code, 
  cptCode, 
  coverageStatus, 
  patientResponsibility, 
  notes, 
  estimatedCost 
}: InsuranceCoverageComponentProps) {
  const getStatusIcon = () => {
    switch (coverageStatus) {
      case "covered": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "partial": return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "not-covered": return <XCircle className="h-4 w-4 text-red-600" />;
      case "pre-auth-required": return <FileText className="h-4 w-4 text-blue-600" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (coverageStatus) {
      case "covered": return "default";
      case "partial": return "secondary";
      case "not-covered": return "destructive";
      case "pre-auth-required": return "outline";
      default: return "outline";
    }
  };

  const getStatusText = () => {
    switch (coverageStatus) {
      case "covered": return "Fully Covered";
      case "partial": return "Partially Covered";
      case "not-covered": return "Not Covered";
      case "pre-auth-required": return "Pre-Authorization Required";
      default: return "Unknown";
    }
  };

  const getBorderColor = () => {
    switch (coverageStatus) {
      case "covered": return "border-green-200";
      case "partial": return "border-yellow-200";
      case "not-covered": return "border-red-200";
      case "pre-auth-required": return "border-blue-200";
      default: return "border-gray-200";
    }
  };

  return (
    <Card className={`${getBorderColor()} border-l-4`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Insurance Coverage</CardTitle>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge variant={getStatusColor()}>{getStatusText()}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Procedure</h4>
            <p className="text-sm font-medium">{procedureName}</p>
          </div>
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Billing Codes</h4>
            <div className="text-sm">
              <p><span className="font-medium">ICD-10:</span> {icd10Code}</p>
              <p><span className="font-medium">CPT:</span> {cptCode}</p>
            </div>
          </div>
        </div>

        {estimatedCost && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4" />
              <h4 className="font-medium text-sm">Cost Estimate</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Cost</p>
                <p className="font-medium">{estimatedCost.total}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Your Responsibility</p>
                <p className="font-medium">{estimatedCost.patientPortion}</p>
              </div>
            </div>
          </div>
        )}

        {patientResponsibility && (
          <div className="text-sm">
            <h4 className="font-medium mb-1">Patient Responsibility</h4>
            <p className="text-muted-foreground">{patientResponsibility}</p>
          </div>
        )}

        {notes && notes.length > 0 && (
          <div className="text-sm">
            <h4 className="font-medium mb-2">Important Notes</h4>
            <ul className="space-y-1">
              {notes.map((note, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}