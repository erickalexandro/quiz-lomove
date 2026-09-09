import { useState, useEffect } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

interface WhatsAppPlayerProps {
  avatar?: string;
  name?: string;
  duration?: number;
  onPlayStateChange?: (playing: boolean) => void;
  isPlaying?: boolean;
  audioSrc?: string;
}

export function WhatsAppPlayer({
  avatar,
  name = "Dr. Elias",
  duration = 60,
  onPlayStateChange,
  isPlaying: externalIsPlaying,
}: WhatsAppPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (externalIsPlaying !== undefined) {
      setPlaying(externalIsPlaying);
    }
  }, [externalIsPlaying]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setElapsed((current) => {
        if (current >= duration) {
          setPlaying(false);
          onPlayStateChange?.(false);
          return duration;
        }
        return current + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, duration, onPlayStateChange]);

  const percent = Math.round((elapsed / duration) * 100);

  const togglePlay = () => {
    const next = !playing;
    setPlaying(next);
    onPlayStateChange?.(next);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const bars = Array.from({ length: 25 }, (_, i) => {
    const heights = [30, 45, 60, 80, 100, 80, 60, 45, 30, 20, 35, 55, 75, 90, 100, 90, 75, 55, 35, 20, 30, 45, 60, 80, 100];
    return heights[i % heights.length];
  });

  return (
    <div className="w-full">
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            className="size-12 shrink-0 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-colors active:scale-95"
            aria-label={playing ? "Pausar" : "Tocar"}
          >
            {playing ? (
              <Pause className="size-5 fill-white text-white" />
            ) : (
              <Play className="size-5 fill-white text-white ml-0.5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold truncate">{name}</span>
              <span className="text-xs text-muted-foreground shrink-0 ml-2">
                {formatTime(elapsed)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-1 h-8">
              {bars.map((h, i) => {
                const active = (i / bars.length) * 100 <= percent;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors ${
                      active ? "bg-primary" : "bg-muted-foreground/20"
                    }`}
                    style={{ height: `${h}%`, minHeight: "15%" }}
                  />
                );
              })}
            </div>

            <div className="h-1 bg-muted rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="shrink-0">
            <Volume2 className="size-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
