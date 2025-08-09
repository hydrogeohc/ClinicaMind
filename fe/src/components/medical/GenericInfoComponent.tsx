import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { AlertCircle, Info, CheckCircle, XCircle } from "lucide-react";
import { GenericInfoComponentProps } from "~/types/components";
import { cn } from "~/lib/utils";

export function GenericInfoComponent({ 
  title, 
  content, 
  type = "info", 
  sections = [] 
}: GenericInfoComponentProps) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "warning":
        return {
          icon: AlertCircle,
          badge: "bg-amber-100 text-amber-800 hover:bg-amber-200",
          border: "border-amber-200",
          iconColor: "text-amber-600"
        };
      case "error":
        return {
          icon: XCircle,
          badge: "bg-red-100 text-red-800 hover:bg-red-200",
          border: "border-red-200",
          iconColor: "text-red-600"
        };
      case "success":
        return {
          icon: CheckCircle,
          badge: "bg-green-100 text-green-800 hover:bg-green-200",
          border: "border-green-200",
          iconColor: "text-green-600"
        };
      case "info":
      default:
        return {
          icon: Info,
          badge: "bg-blue-100 text-blue-800 hover:bg-blue-200",
          border: "border-blue-200",
          iconColor: "text-blue-600"
        };
    }
  };

  const typeStyles = getTypeStyles(type);
  const IconComponent = typeStyles.icon;

  return (
    <Card className={cn("mb-6", typeStyles.border)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className={cn("h-5 w-5", typeStyles.iconColor)} />
          {title}
          <Badge className={typeStyles.badge}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
        </div>

        {sections.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-2">{section.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{section.content}</p>
                  {section.items && section.items.length > 0 && (
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>• {item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}