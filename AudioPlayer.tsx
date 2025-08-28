import { useState } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from './ui/slider';

interface AudioPlayerProps {
  trackName: string;
  artist: string;
  duration?: string;
  size?: 'sm' | 'md' | 'lg';
  showWaveform?: boolean;
}

export function AudioPlayer({ 
  trackName, 
  artist, 
  duration = "3:24", 
  size = 'md',
  showWaveform = true 
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(75);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Mock waveform data
  const waveformData = Array.from({ length: 50 }, (_, i) => 
    Math.sin(i * 0.1) * 40 + Math.random() * 20 + 20
  );

  const getPlayerSize = () => {
    switch (size) {
      case 'sm':
        return { height: 'h-16', buttonSize: 'w-8 h-8', iconSize: 'w-4 h-4' };
      case 'lg':
        return { height: 'h-24', buttonSize: 'w-12 h-12', iconSize: 'w-6 h-6' };
      default:
        return { height: 'h-20', buttonSize: 'w-10 h-10', iconSize: 'w-5 h-5' };
    }
  };

  const playerSize = getPlayerSize();

  return (
    <div className={`bg-card border border-border rounded-lg p-4 ${playerSize.height}`}>
      <div className="flex items-center gap-3 h-full">
        {/* Play/Pause Button */}
        <Button
          variant="default"
          size="icon"
          className={`${playerSize.buttonSize} bg-primary hover:bg-primary/90 flex-shrink-0`}
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className={playerSize.iconSize} />
          ) : (
            <Play className={playerSize.iconSize} />
          )}
        </Button>

        {/* Track Info & Waveform */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{trackName}</p>
              <p className="text-xs text-muted-foreground truncate">{artist}</p>
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{duration}</span>
          </div>

          {/* Waveform Visualization */}
          {showWaveform && (
            <div className="flex items-end gap-0.5 h-6 mt-2">
              {waveformData.map((height, index) => (
                <div
                  key={index}
                  className={`flex-1 rounded-sm transition-all duration-150 ${
                    index < currentTime * 2.5
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                  style={{ height: `${Math.max(height, 8)}%` }}
                />
              ))}
            </div>
          )}

          {/* Progress Bar (if no waveform) */}
          {!showWaveform && (
            <div className="mt-2">
              <Slider
                value={[currentTime]}
                onValueChange={(value) => setCurrentTime(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Volume Control */}
        {size !== 'sm' && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="w-16"
            />
          </div>
        )}
      </div>
    </div>
  );
}