import { useState, useRef, useCallback, useEffect } from "react";

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new(): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

interface UseVoiceInputOptions {
  onTranscript?: (text: string) => void;
  onEnd?: (finalText: string) => void;
  language?: string;
}

export const useVoiceInput = (options: UseVoiceInputOptions = {}) => {
  const { onTranscript, onEnd, language = "uz-UZ" } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);
      onTranscript?.(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      
      if (event.error === "no-speech") {
        setError("Ovoz eshitilmadi. Qaytadan urinib ko'ring 🎤");
      } else if (event.error === "not-allowed") {
        setError("Mikrofondan foydalanishga ruxsat berilmagan 🔇");
      } else {
        setError("Xatolik yuz berdi. Qaytadan urinib ko'ring");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        onEnd?.(transcript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [language, onTranscript, onEnd, transcript]);

  const startListening = useCallback(() => {
    setTranscript("");
    setError(null);
    recognitionRef.current?.start();
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
};
