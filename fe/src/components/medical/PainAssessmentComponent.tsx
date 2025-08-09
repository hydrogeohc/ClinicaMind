import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { MapPin } from "lucide-react";
import { PainAssessmentComponentProps } from "~/types/components";

// Hardcoded SVG for Conversation 1 (David S - left upper arm pain)
const Conversation1SVG = () => (
  <svg viewBox="0 0 400 600" className="w-full max-w-md mx-auto">
    {/* Basic human body outline */}
    <g stroke="#e2e8f0" strokeWidth="2" fill="none">
      {/* Head */}
      <circle cx="200" cy="80" r="40" />
      {/* Torso */}
      <rect x="160" y="120" width="80" height="150" rx="10" />
      {/* Arms */}
      <rect x="100" y="130" width="60" height="15" rx="7" />
      <rect x="240" y="130" width="60" height="15" rx="7" />
      {/* Left upper arm (vertical) */}
      <rect x="140" y="145" width="15" height="60" rx="7" />
      {/* Right upper arm (vertical) */}
      <rect x="245" y="145" width="15" height="60" rx="7" />
      {/* Left forearm */}
      <rect x="140" y="205" width="15" height="50" rx="7" />
      {/* Right forearm */}
      <rect x="245" y="205" width="15" height="50" rx="7" />
      {/* Legs */}
      <rect x="170" y="270" width="15" height="80" rx="7" />
      <rect x="215" y="270" width="15" height="80" rx="7" />
      {/* Lower legs */}
      <rect x="170" y="350" width="15" height="70" rx="7" />
      <rect x="215" y="350" width="15" height="70" rx="7" />
    </g>
    
    {/* Pain indicator - Left upper arm (front) */}
    <g>
      <rect x="135" y="140" width="25" height="30" rx="12" fill="#ef4444" fillOpacity="0.7" />
      <circle cx="147.5" cy="155" r="8" fill="#dc2626" />
      <text x="147.5" y="160" textAnchor="middle" className="fill-white text-xs font-bold">!</text>
    </g>
    
    {/* Labels */}
    <text x="200" y="480" textAnchor="middle" className="fill-gray-600 text-sm font-medium">
      Pain Location: Left Upper Arm (Front)
    </text>
    <text x="200" y="500" textAnchor="middle" className="fill-gray-500 text-xs">
      Sharp, dull and stabbing pain
    </text>
    
    {/* Legend */}
    <g>
      <rect x="50" y="520" width="15" height="15" fill="#ef4444" fillOpacity="0.7" />
      <text x="70" y="532" className="fill-gray-600 text-xs">Primary pain location</text>
    </g>
  </svg>
);

// Hardcoded SVG for Conversation 2 (placeholder for future conversation)
const Conversation2SVG = () => (
  <svg viewBox="0 0 400 600" className="w-full max-w-md mx-auto">
    {/* Basic human body outline */}
    <g stroke="#e2e8f0" strokeWidth="2" fill="none">
      {/* Head */}
      <circle cx="200" cy="80" r="40" />
      {/* Torso */}
      <rect x="160" y="120" width="80" height="150" rx="10" />
      {/* Arms */}
      <rect x="100" y="130" width="60" height="15" rx="7" />
      <rect x="240" y="130" width="60" height="15" rx="7" />
      {/* Left upper arm (vertical) */}
      <rect x="140" y="145" width="15" height="60" rx="7" />
      {/* Right upper arm (vertical) */}
      <rect x="245" y="145" width="15" height="60" rx="7" />
      {/* Left forearm */}
      <rect x="140" y="205" width="15" height="50" rx="7" />
      {/* Right forearm */}
      <rect x="245" y="205" width="15" height="50" rx="7" />
      {/* Legs */}
      <rect x="170" y="270" width="15" height="80" rx="7" />
      <rect x="215" y="270" width="15" height="80" rx="7" />
      {/* Lower legs */}
      <rect x="170" y="350" width="15" height="70" rx="7" />
      <rect x="215" y="350" width="15" height="70" rx="7" />
    </g>
    
    {/* Persistent pain indicator - Same location as conversation 1 but showing chronicity */}
    <g>
      <rect x="135" y="140" width="25" height="30" rx="12" fill="#f97316" fillOpacity="0.7" />
      <circle cx="147.5" cy="155" r="8" fill="#ea580c" />
      <text x="147.5" y="160" textAnchor="middle" className="fill-white text-xs font-bold">!</text>
      {/* Additional indicator for chronicity */}
      <circle cx="147.5" cy="155" r="12" stroke="#ea580c" strokeWidth="2" fill="none" strokeDasharray="4,4" />
    </g>
    
    {/* Labels */}
    <text x="200" y="480" textAnchor="middle" className="fill-gray-600 text-sm font-medium">
      Persistent Pain: Left Upper Arm (Follow-up)
    </text>
    <text x="200" y="500" textAnchor="middle" className="fill-gray-500 text-xs">
      Pain continues after 30 days of treatment
    </text>
    
    {/* Legend */}
    <g>
      <rect x="50" y="520" width="15" height="15" fill="#f97316" fillOpacity="0.7" />
      <text x="70" y="532" className="fill-gray-600 text-xs">Persistent pain location (30 days)</text>
    </g>
  </svg>
);

export function PainAssessmentComponent({ 
  conversationId,
  patientName
}: PainAssessmentComponentProps) {
  const renderPainDiagram = () => {
    switch (conversationId) {
      case 1:
        return <Conversation1SVG />;
      case 2:
        return <Conversation2SVG />;
      default:
        return <Conversation1SVG />;
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-red-600" />
          Pain Assessment {patientName && `- ${patientName}`}
          <Badge variant="outline">Diagram</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg">
          {renderPainDiagram()}
        </div>
      </CardContent>
    </Card>
  );
}