import { Accident } from "@/types/types";
import MapInput from "../shared/MapInput";
import { SEVERITY_LABELS } from "@/lib/enums";
import {
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  Cloud,
  Thermometer,
  Eye,
  Navigation,
  Building2,
  Map,
} from "lucide-react";
import { Badge } from "../ui/badge";

const getSeverityStyles = (severity: number) => {
  const styles = {
    1: {
      bg: "bg-[var(--severity-1)]/10",
      border: "border-[var(--severity-1)]/30",
      text: "text-[var(--severity-1)]",
      badge: "bg-[var(--severity-1)] text-white",
    },
    2: {
      bg: "bg-[var(--severity-2)]/10",
      border: "border-[var(--severity-2)]/30",
      text: "text-[var(--severity-2)]",
      badge: "bg-[var(--severity-2)] text-white",
    },
    3: {
      bg: "bg-[var(--severity-3)]/10",
      border: "border-[var(--severity-3)]/30",
      text: "text-[var(--severity-3)]",
      badge: "bg-[var(--severity-3)] text-white",
    },
    4: {
      bg: "bg-[var(--severity-4)]/10",
      border: "border-[var(--severity-4)]/30",
      text: "text-[var(--severity-4)]",
      badge: "bg-[var(--severity-4)] text-white",
    },
  };
  return styles[severity as keyof typeof styles] || styles[1];
};

const Simple = (accident: Accident) => {
  const severityStyles = getSeverityStyles(accident.severity);
  const date = new Date(accident.startTime);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article
      className={`
        group relative overflow-hidden rounded-2xl border-2 
        ${severityStyles.border} ${severityStyles.bg}
        bg-[var(--card_full_white)] 
        transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-[var(--cta)]/10
        hover:border-[var(--cta)]/50
        hover:-translate-y-1
      `}
    >
      {/* Severity Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge
          className={`${severityStyles.badge} text-xs font-semibold px-2.5 py-1 rounded-full`}
        >
          <AlertTriangle className="w-3 h-3 mr-1" />
          {SEVERITY_LABELS[accident.severity]}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Header - Location */}
        <div className="pr-24">
          <div className="flex items-start gap-2">
            <MapPin
              className={`w-5 h-5 mt-0.5 ${severityStyles.text} shrink-0`}
            />
            <div>
              <h3 className="font-semibold text-[var(--on-white-text)] text-lg leading-tight">
                {accident.city || "Unknown City"}
                {accident.state && `, ${accident.state}`}
              </h3>
              {accident.street && (
                <p className="text-sm text-[var(--muted)] mt-0.5">
                  {accident.street}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {accident.description && (
          <p className="text-sm text-[var(--text)] leading-relaxed line-clamp-2 bg-[var(--background)]/50 p-3 rounded-lg">
            {accident.description}
          </p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[var(--cta)]" />
            <span className="text-[var(--text)]">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-[var(--primary_girl)]" />
            <span className="text-[var(--text)]">{formattedTime}</span>
          </div>

          {/* Weather Info */}
          {accident.weatherCondition && (
            <div className="flex items-center gap-2 text-sm">
              <Cloud className="w-4 h-4 text-[var(--info)]" />
              <span className="text-[var(--text)] truncate">
                {accident.weatherCondition}
              </span>
            </div>
          )}
          {accident.temperature !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Thermometer className="w-4 h-4 text-[var(--warning)]" />
              <span className="text-[var(--text)]">
                {Math.round(accident.temperature)}°F
              </span>
            </div>
          )}

          {/* Visibility */}
          {accident.visibility !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-[var(--muted)]" />
              <span className="text-[var(--text)]">
                {accident.visibility} mi visibility
              </span>
            </div>
          )}

          {/* County */}
          {accident.county && (
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-[var(--accent)]" />
              <span className="text-[var(--text)] truncate">
                {accident.county} County
              </span>
            </div>
          )}
        </div>

        {/* POI Tags */}
        <div className="flex flex-wrap gap-1.5">
          {accident.junction && (
            <Badge
              variant="outline"
              className="text-xs border-[var(--border-color)] text-[var(--muted)]"
            >
              Junction
            </Badge>
          )}
          {accident.trafficSignal && (
            <Badge
              variant="outline"
              className="text-xs border-[var(--border-color)] text-[var(--muted)]"
            >
              Traffic Signal
            </Badge>
          )}
          {accident.crossing && (
            <Badge
              variant="outline"
              className="text-xs border-[var(--border-color)] text-[var(--muted)]"
            >
              Crossing
            </Badge>
          )}
          {accident.stop && (
            <Badge
              variant="outline"
              className="text-xs border-[var(--border-color)] text-[var(--muted)]"
            >
              Stop Sign
            </Badge>
          )}
          {accident.railway && (
            <Badge
              variant="outline"
              className="text-xs border-[var(--border-color)] text-[var(--muted)]"
            >
              Railway
            </Badge>
          )}
        </div>

        {/* Map */}
        <div className="relative rounded-xl overflow-hidden border border-[var(--border-color)]">
          <div className="absolute top-2 left-2 z-10">
            <Badge className="bg-[var(--card_full_white)]/90 text-[var(--text)] text-xs backdrop-blur-sm">
              <Map className="w-3 h-3 mr-1" />
              {parseFloat(accident.startLat).toFixed(4)},{" "}
              {parseFloat(accident.startLng).toFixed(4)}
            </Badge>
          </div>
          <MapInput
            initialLat={parseFloat(accident.startLat)}
            initialLng={parseFloat(accident.startLng)}
          />
        </div>
      </div>

      {/* Bottom Gradient */}
      <div
        className={`h-1 w-full bg-gradient-to-r from-[var(--severity-${accident.severity})] via-[var(--cta)] to-[var(--severity-${accident.severity})]`}
      />
    </article>
  );
};

const AccidentCard = () => {
  return null;
};
AccidentCard.Simple = Simple;

export { AccidentCard };
