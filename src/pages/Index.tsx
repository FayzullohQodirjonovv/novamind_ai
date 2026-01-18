import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Languages, BookOpen, Camera, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import PremiumInput from "@/components/PremiumInput";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import QuickActionCard from "@/components/QuickActionCard";
import Settings from "@/components/Settings";
import Pricing from "@/components/Pricing";
import { useChatStorage, useSettingsStorage, ChatMessage as ChatMessageType } from "@/hooks/useChatStorage";
import { streamChat } from "@/lib/chatApi";
import { useAuth } from "@/contexts/AuthContext";

const quickActions = [
  {
    icon: Calculator,
    title: "Matematika masalasini yechish",
    description: "Har qanday matematik masalani yeching",
  },
  {
    icon: Languages,
    title: "Tarjima qilish",
    description: "Matnlarni turli tillarga tarjima qiling",
  },
  {
    icon: BookOpen,
    title: "Tushuntirish",
    description: "Murakkab mavzularni oddiy tilda tushuntiring",
  },
  {
    icon: Camera,
    title: "Rasmni tahlil qilish",
    description: "Rasmlarni yuklang va tahlil qiling",
  },
];

const Index = () => {
  const { messages, addMessage, updateLastMessage, clearMessages, isLoaded } = useChatStorage();
  const { settings, updateSettings, isLoaded: settingsLoaded } = useSettingsStorage();
  const { user } = useAuth();
  
  const [isTyping, setIsTyping] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Apply dark mode
  useEffect(() => {
    if (settingsLoaded) {
      if (settings.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings.darkMode, settingsLoaded]);

  // Disable zoom
  useEffect(() => {
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingContent]);

  const handleSend = useCallback(async (content: string, image?: string) => {
    // Add user message
    const userMessage = addMessage({
      role: "user",
      content,
      image,
    });

    setIsTyping(true);
    setStreamingContent("");

    // Prepare messages for API
    const apiMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    apiMessages.push({ role: "user", content });

    // Add placeholder for assistant message
    const assistantMessage = addMessage({
      role: "assistant",
      content: "",
    });

    let fullContent = "";

    await streamChat({
      messages: apiMessages,
      image,
      onDelta: (delta) => {
        fullContent += delta;
        setStreamingContent(fullContent);
        updateLastMessage(fullContent);
      },
      onDone: () => {
        setIsTyping(false);
        setStreamingContent("");
      },
      onError: (error) => {
        setIsTyping(false);
        setStreamingContent("");
        toast.error(error);
        updateLastMessage("⚠️ Xatolik yuz berdi. Qayta urinib ko'ring.");
      },
    });
  }, [messages, addMessage, updateLastMessage]);

  const handleQuickAction = (title: string) => {
    handleSend(title);
  };

  const handleSettingsChange = (newSettings: typeof settings) => {
    updateSettings(newSettings);
  };

  const hasMessages = messages.length > 0;

  // Wait for data to load
  if (!isLoaded || !settingsLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary animate-pulse flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-hidden">
      <AnimatedBackground />
      
      <Header 
        onSettingsClick={() => setSettingsOpen(true)} 
        onPricingClick={() => setPricingOpen(true)}
      />
      
      <main className="flex flex-1 flex-col relative">
        {/* Welcome section - shown when no messages */}
        <AnimatePresence>
          {!hasMessages && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-1 flex-col items-center justify-center px-4 pb-8"
            >
              <motion.div 
                className="mb-8 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl gradient-primary shadow-glow"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px hsl(142 71% 45% / 0.4)",
                      "0 0 40px hsl(142 71% 45% / 0.6)",
                      "0 0 20px hsl(142 71% 45% / 0.4)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-10 w-10 text-primary-foreground" />
                </motion.div>
                <h1 className="mb-3 text-3xl md:text-4xl font-bold text-foreground">
                  {user ? `Salom, ${user.user_metadata?.full_name?.split(' ')[0] || 'do\'stim'}! ` : ''}
                  Sizga qanday yordam <span className="text-gradient">bera olaman?</span>
                </h1>
                <p className="max-w-md text-muted-foreground text-lg">
                  Sun'iy intellekt yordamchisi bilan savol javob, tarjima va boshqa ko'p narsalarni bajaring ✨
                </p>
              </motion.div>

              <div className="mb-8 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                {quickActions.map((action, index) => (
                  <QuickActionCard
                    key={index}
                    icon={action.icon}
                    title={action.title}
                    description={action.description}
                    onClick={() => handleQuickAction(action.title)}
                    delay={0.3 + index * 0.1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat messages */}
        {hasMessages && (
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                image={message.image}
                isNew={index === messages.length - 1 && message.role === "assistant"}
              />
            ))}
            {isTyping && !streamingContent && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input section */}
        <div className="sticky bottom-0 w-full px-4 pb-6 pt-4 bg-gradient-to-t from-background via-background to-transparent">
          <div className="mx-auto max-w-2xl">
            <PremiumInput onSend={handleSend} disabled={isTyping} />
            <motion.p 
              className="mt-3 text-center text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              AI Assistant xatolar qilishi mumkin. Muhim ma'lumotlarni tekshiring.
            </motion.p>
          </div>
        </div>
      </main>

      {/* Settings panel */}
      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onClearChat={clearMessages}
      />

      {/* Pricing modal */}
      <Pricing isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
    </div>
  );
};

export default Index;
