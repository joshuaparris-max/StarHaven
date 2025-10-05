import { Clock, AlertTriangle } from "lucide-react";

interface TimeCountdownProps {
  time: number;
}

export function TimeCountdown({ time }: TimeCountdownProps) {
  const getTimeColor = () => {
    if (time <= 10) return 'text-destructive';
    if (time <= 30) return 'text-chart-1';
    return 'text-accent-foreground';
  };

  const shouldPulse = time <= 10;

  return (
    <div className="flex items-center gap-2" data-testid="time-countdown">
      {time <= 15 ? (
        <AlertTriangle className={`w-4 h-4 ${getTimeColor()} ${shouldPulse ? 'animate-pulse' : ''}`} />
      ) : (
        <Clock className="w-4 h-4 text-muted-foreground" />
      )}
      <div className="font-mono text-sm">
        <span className="text-muted-foreground">TIME: </span>
        <span 
          className={`font-bold ${getTimeColor()} ${shouldPulse ? 'animate-pulse' : ''}`}
          style={{ textShadow: shouldPulse ? '0 0 8px currentColor' : 'none' }}
          data-testid="text-time-remaining"
        >
          {time}
        </span>
        <span className="text-muted-foreground"> min</span>
      </div>
    </div>
  );
}