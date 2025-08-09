import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { RecentLabResultsComponentProps } from "~/types/components";
import { cn } from "~/lib/utils";

export function RecentLabResultsComponent({ 
  labType, 
  results, 
  interpretation, 
  date 
}: RecentLabResultsComponentProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "normal":
      default:
        return "text-green-600 bg-green-50 border-green-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">High</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Low</Badge>;
      case "normal":
      default:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Normal</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {labType} Results
          <Badge variant="outline">{new Date(date).toLocaleDateString()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {results.map((result, index) => (
            <div 
              key={index} 
              className={cn(
                "p-3 rounded-lg border-2",
                getStatusColor(result.status)
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{result.test}</span>
                    {getStatusBadge(result.status)}
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="font-medium">
                      {result.value} {result.unit && result.unit}
                    </span>
                    {result.reference_range && (
                      <span className="text-muted-foreground ml-2">
                        (Reference: {result.reference_range})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {interpretation && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold mb-2">Clinical Interpretation</h4>
              <p className="text-sm text-muted-foreground">{interpretation}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}