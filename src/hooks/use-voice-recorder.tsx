
import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useVoiceRecorder() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: 'Microphone Access Error',
        description: 'Please allow microphone access to use voice features.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      return;
    }
    
    return new Promise<string>((resolve) => {
      mediaRecorderRef.current!.onstop = async () => {
        try {
          setIsProcessing(true);
          
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          
          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          
          reader.onloadend = async () => {
            try {
              const base64data = reader.result as string;
              // Remove the data URL prefix
              const base64Audio = base64data.split(',')[1];
              
              // Call the speech-to-text Edge Function
              const { data, error } = await supabase.functions.invoke('speech-to-text', {
                body: { audio: base64Audio },
              });
              
              if (error) {
                throw new Error(`Error transcribing audio: ${error.message}`);
              }
              
              if (data?.quotaExceeded) {
                toast({
                  title: 'OpenAI API Quota Exceeded',
                  description: 'Your OpenAI API quota has been exceeded. Please check your account billing status.',
                  variant: 'destructive',
                  duration: 6000,
                });
                resolve('');
                return;
              }
              
              if (data?.text) {
                setTranscribedText(data.text);
                resolve(data.text);
              } else if (data?.error) {
                throw new Error(data.error);
              } else {
                throw new Error('No text was transcribed from the audio');
              }
            } catch (err) {
              console.error('Error processing audio:', err);
              toast({
                title: 'Transcription Error',
                description: err instanceof Error ? err.message : 'Failed to transcribe audio',
                variant: 'destructive',
              });
              resolve('');
            } finally {
              setIsProcessing(false);
            }
          };
        } catch (err) {
          console.error('Error in recording stop handler:', err);
          setIsProcessing(false);
          resolve('');
        }
      };
      
      mediaRecorderRef.current!.stop();
      setIsRecording(false);
      
      // Stop all audio tracks to release the microphone
      if (mediaRecorderRef.current!.stream) {
        mediaRecorderRef.current!.stream.getTracks().forEach(track => track.stop());
      }
    });
  }, [toast]);

  // Cancel recording without processing
  const cancelRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return;
    
    if (mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    setIsRecording(false);
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
  }, []);

  return {
    isRecording,
    isProcessing,
    transcribedText,
    startRecording,
    stopRecording,
    cancelRecording,
    setTranscribedText,
  };
}
