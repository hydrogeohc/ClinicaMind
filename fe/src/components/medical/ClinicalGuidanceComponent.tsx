import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Lightbulb, AlertCircle, ClipboardCheck, Stethoscope } from "lucide-react";
import { ClinicalGuidanceComponentProps } from "~/types/components";

export function ClinicalGuidanceComponent({ 
  title, 
  guidanceType, 
  recommendations, 
  context, 
  priority = "medium" 
}: ClinicalGuidanceComponentProps) {
  const getTypeIcon = () => {
    switch (guidanceType) {
      case "examination": return <Stethoscope className="h-4 w-4" />;
      case "questions": return <Lightbulb className="h-4 w-4" />;
      case "procedure": return <ClipboardCheck className="h-4 w-4" />;
      case "assessment": return <AlertCircle className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (guidanceType) {
      case "examination": return "bg-blue-50 border-blue-200";
      case "questions": return "bg-yellow-50 border-yellow-200";
      case "procedure": return "bg-green-50 border-green-200";
      case "assessment": return "bg-purple-50 border-purple-200";
      default: return "bg-gray-50 border-gray-200";
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  return (
    <Card className={`${getTypeColor()} border-l-4`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getTypeIcon()}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge variant={getPriorityColor()}>{priority} priority</Badge>
        </div>
        {context && (
          <p className="text-sm text-muted-foreground mt-2">{context}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            Recommended Actions
          </h4>
          <ul className="space-y-2">
            {recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-current mt-2 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}