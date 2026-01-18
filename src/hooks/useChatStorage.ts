import { useState, useEffect, useCallback } from "react";

const CHAT_STORAGE_KEY = "ai_assistant_chat_history";
const SETTINGS_STORAGE_KEY = "ai_assistant_settings";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  image?: string;
  timestamp: number;
}

export interface AppSettings {
  darkMode: boolean;
  responseSpeed: "normal" | "fast" | "ultra";
  animationLevel: "off" | "smooth" | "crazy";
}

const defaultSettings: AppSettings = {
  darkMode: false,
  responseSpeed: "ultra",
  animationLevel: "smooth",
};

export const useChatStorage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    }
  }, [messages, isLoaded]);

  const addMessage = useCallback((message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  const updateLastMessage = useCallback((content: string) => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = {
        ...updated[updated.length - 1],
        content,
      };
      return updated;
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

  return {
    messages,
    addMessage,
    updateLastMessage,
    clearMessages,
    isLoaded,
  };
};

export const useSettingsStorage = () => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    }
  }, [settings, isLoaded]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded,
  };
};
