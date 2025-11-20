import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionOptions {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

// Check for browser support
const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = ({ onResult, onError, onEnd }: SpeechRecognitionOptions) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(SpeechRecognition ? new SpeechRecognition() : null);

  const startListening = useCallback(() => {
    if (isListening || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error("Speech recognition error on start:", error);
      onError?.("Tidak dapat memulakan pengecaman pertuturan.");
    }
  }, [isListening, onError]);

  const stopListening = useCallback(() => {
    if (!isListening || !recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  }, [isListening]);

  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) {
        onError?.("Pengecaman pertuturan tidak disokong dalam pelayar ini.");
        return;
    };

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ar-SA'; // Set to Arabic for better accuracy

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
          onResult(finalTranscript.trim(), true);
      } else if(interimTranscript) {
          onResult(interimTranscript.trim(), false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      let errorMessage = "Berlaku ralat pengecaman pertuturan.";
      if (event.error === 'no-speech') {
        errorMessage = "Tiada pertuturan dikesan. Sila cuba lagi.";
      } else if (event.error === 'not-allowed') {
        errorMessage = "Akses mikrofon disekat. Sila benarkan akses dalam tetapan pelayar anda.";
      }
      onError?.(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onResult, onError, onEnd]);

  return {
    isListening,
    startListening,
    stopListening,
    isSupported: !!SpeechRecognition
  };
};