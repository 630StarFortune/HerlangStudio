
import { useRef, useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SoundConfig {
  [key: string]: {
    frequency: number;
    duration: number;
    type: OscillatorType;
    volume: number;
  };
}

const soundEffects: SoundConfig = {
  success: { frequency: 800, duration: 200, type: 'sine', volume: 0.3 },
  error: { frequency: 300, duration: 300, type: 'sawtooth', volume: 0.2 },
  click: { frequency: 600, duration: 100, type: 'square', volume: 0.1 },
  type: { frequency: 1000, duration: 50, type: 'sine', volume: 0.05 },
  magic: { frequency: 1200, duration: 400, type: 'sine', volume: 0.2 },
  dragon: { frequency: 400, duration: 800, type: 'triangle', volume: 0.3 }
};

export const useSounds = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const { currentTheme } = useTheme();

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((soundName: keyof typeof soundEffects) => {
    if (!currentTheme.effects.sounds) return;

    const config = soundEffects[soundName];
    if (!config) return;

    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);

      gainNode.gain.setValueAtTime(config.volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration / 1000);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [currentTheme.effects.sounds, getAudioContext]);

  const playMelody = useCallback((notes: number[], noteDuration: number = 200) => {
    if (!currentTheme.effects.sounds) return;

    notes.forEach((frequency, index) => {
      setTimeout(() => {
        try {
          const audioContext = getAudioContext();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + noteDuration / 1000);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + noteDuration / 1000);
        } catch (error) {
          console.warn('Melody playback failed:', error);
        }
      }, index * noteDuration);
    });
  }, [currentTheme.effects.sounds, getAudioContext]);

  return { playSound, playMelody };
};
