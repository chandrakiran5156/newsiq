
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useVoicePlayback() {
  const { toast } = useToast();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  if (typeof window !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio();
    
    audioRef.current.onplay = () => setIsPlaying(true);
    audioRef.current.onpause = () => setIsPlaying(false);
    audioRef.current.onended = () => setIsPlaying(false);
  }
  
  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);
  
  const playText = useCallback(async (text: string, voice?: string) => {
    if (!isEnabled || !text) return;
    
    try {
      setIsLoading(true);
      
      // Call the text-to-speech Edge Function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice },
      });
      
      if (error) {
        throw new Error(`Error generating speech: ${error.message}`);
      }
      
      if (!data?.audioContent) {
        throw new Error('No audio content returned');
      }
      
      // Create audio source from base64
      const audioSrc = `data:audio/mp3;base64,${data.audioContent}`;
      
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        await audioRef.current.play();
      }
    } catch (err) {
      console.error('Error playing audio:', err);
      toast({
        title: 'Audio Playback Error',
        description: err instanceof Error ? err.message : 'Failed to play audio',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled, toast]);
  
  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);
  
  return {
    isEnabled,
    isPlaying,
    isLoading,
    toggleEnabled,
    playText,
    stopPlayback,
  };
}
