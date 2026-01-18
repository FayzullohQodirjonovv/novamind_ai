import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Languages, BookOpen, Camera, Sparkles, Play } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import PremiumInput from "@/components/PremiumInput";
import ChatMessage from "@/components/ChatMessage";
import TypingIndicator from "@/components/TypingIndicator";
import QuickActionCard from "@/components/QuickActionCard";
import Settings from "@/components/Settings";
import Pricing from "@/components/Pricing";
import { useChatStorage, useSettingsStorage } from "@/hooks/useChatStorage";
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
    description: "Rasmlarni yuklang va sun'iy intellekt bilan tahlil qiling",
  },
];

// ⭐ Yulduzchali animatsion fon komponenti
const StarBackground = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // foizlarda
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 6,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Asosiy gradient fon */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#22c55e22,_transparent_60%),radial-gradient(circle_at_bottom,_#06b6d422,_transparent_55%),radial-gradient(circle_at_20%_80%,_#a855f722,_transparent_55%),radial-gradient(circle_at_80%_20%,_#22c55e33,_transparent_55%)] bg-slate-950" />

      {/* Yumshoq gradient “orb” lar */}
      <motion.div
        className="absolute -top-40 -left-40 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl"
        animate={{ x: [-20, 30, -10], y: [0, 40, -20], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-52 -right-40 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl"
        animate={{ x: [10, -40, 20], y: [0, -30, 10], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Yulduzchalar */}
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-white/90 dark:bg-white"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const Index = () => {
  const { messages, addMessage, updateLastMessage, clearMessages, isLoaded } = useChatStorage();
  const { settings, updateSettings, isLoaded: settingsLoaded } = useSettingsStorage();
  const { user } = useAuth();

  const [isTyping, setIsTyping] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [hasStarted, setHasStarted] = useState(false); // 🆕 chat start flag

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputSectionRef = useRef<HTMLDivElement | null>(null);

  const hasMessages = messages.length > 0;

  // Dark mode
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
      meta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      );
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, streamingContent]);

  const handleSend = useCallback(
    async (content: string, image?: string) => {
      // Chat avtomatik start bo‘lsin (agar welcome holatda yozsa)
      if (!hasStarted) {
        setHasStarted(true);
      }

      // Add user message
      addMessage({
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
      addMessage({
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
    },
    [messages, addMessage, updateLastMessage, hasStarted]
  );

  const handleQuickAction = (title: string) => {
    handleSend(title);
  };

  const handleSettingsChange = (newSettings: typeof settings) => {
    updateSettings(newSettings);
  };

  const handleStartClick = () => {
    // avval chatni start qilamiz
    if (!hasStarted) {
      setHasStarted(true);
    }

    // keyin biroz kechikib inputga scroll qilamiz (chat render bo‘lishi uchun)
    setTimeout(() => {
      inputSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);
  };

  // Loading state
  if (!isLoaded || !settingsLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <StarBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/90 animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.7)]">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-300">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <StarBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header
          onSettingsClick={() => setSettingsOpen(true)}
          onPricingClick={() => setPricingOpen(true)}
        />

        <main className="flex-1 px-2 sm:px-4 pb-4 pt-16 md:pt-20">
          <div>
            {/* Glow halo around card */}
            <div className="pointer-events-none absolute inset-x-10 -top-10 h-24 rounded-full bg-emerald-500/20 blur-3xl" />

            {/* Welcome section - faqat start bo‘lmagan va message yo‘q holatda */}
            <AnimatePresence initial={false}>
              {!hasStarted && !hasMessages && (
                <motion.section
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex flex-1 flex-col items-center justify-center px-4 pb-4"
                >
                  <motion.div
                    className="mb-8 flex flex-col items-center text-center max-w-3xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    {/* Floating badge */}
                    <motion.div
                      className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-slate-900/60 px-4 py-1 text-xs font-medium backdrop-blur shadow-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                        AI
                      </span>
                      <span className="text-slate-300">
                        2026 · Qodirjonov Fayzullox tomonidan yaratilgan AI yordamchi
                      </span>
                    </motion.div>

                    {/* Main icon */}
                    <motion.div
                      className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-[0_0_40px_rgba(34,197,94,0.9)] relative overflow-hidden"
                      animate={{
                        y: [0, -6, 0],
                        boxShadow: [
                          "0 0 24px rgba(34,197,94,0.6)",
                          "0 0 48px rgba(34,197,94,0.9)",
                          "0 0 24px rgba(34,197,94,0.6)",
                        ],
                      }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Sparkles className="h-12 w-12 text-white" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </motion.div>

                    {/* Title */}
                    <h1 className="mb-3 text-3xl md:text-4xl font-bold text-slate-50 leading-tight tracking-tight">
                      {user
                        ? `Salom, ${user.user_metadata?.full_name?.split(" ")[0] || "do'stim"}! `
                        : "Salom! "}
                      <span className="block mt-1">
                        Sizga qanday yordam{" "}
                        <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                          bera olaman?
                        </span>
                      </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-xl text-slate-300/90 text-base md:text-lg mt-2">
                      Sun'iy intellekt yordamchisi bilan savol-javob, tarjima, matematik masalalar,
                      rasm tahlili va boshqa ko‘p ishlarni bir joyda bajarishingiz mumkin ✨
                    </p>

                    {/* Start button */}
                    <motion.button
                      onClick={handleStartClick}
                      className="
                        mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium
                        bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 hover:bg-emerald-600
                        active:scale-[0.98] transition-all border border-emerald-300/40
                      "
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Play className="w-4 h-4" />
                      Chatni boshlash
                    </motion.button>
                  </motion.div>

                  {/* Feature cards */}
                  <motion.div
                    className="relative w-full max-w-3xl"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/40 via-cyan-500/30 to-purple-500/40 opacity-70 blur-[4px]" />
                    <div className="relative rounded-3xl bg-slate-900/75 border border-white/10 backdrop-blur-xl p-4 md:p-5 shadow-[0_18px_45px_rgba(15,23,42,0.9)]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                          <QuickActionCard
                            key={index}
                            icon={action.icon}
                            title={action.title}
                            description={action.description}
                            onClick={() => handleQuickAction(action.title)}
                            delay={0.4 + index * 0.1}
                          />
                        ))}
                      </div>

                      <div className="mt-3 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
                        <span>• Matematikadan tortib rasm tahliligacha – barchasi bitta oynada</span>
                        <span className="opacity-80">
                          • Rasmni tahlil qilish uchun uni yuklab, chat orqali yuboring
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Chat messages – start bosilgandan keyin yoki message bo‘lsa ko‘rinadi */}
            {(hasStarted || hasMessages) && (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4">
                  {!hasMessages && (
                    <div className="mb-2 rounded-2xl border border-dashed border-white/10 bg-slate-900/70 px-4 py-3 text-[13px] text-slate-300/80">
                      Chat boshlandi. Birinchi savolingizni pastdan yozib yuboring.
                    </div>
                  )}

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

                {/* Input section */}
                <div
                  ref={inputSectionRef}
                  className=""
                >
                  <div className="mx-auto max-w-2xl">
                    <PremiumInput onSend={handleSend} disabled={isTyping} />
                    <motion.p
                      className="mt-3 text-center text-[11px] text-slate-500"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      AI Assistant xatolar qilishi mumkin. Muhim ma'lumotlarni albatta tekshiring.
                    </motion.p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer / Contact section */}
        <footer className="border-t border-white/10 bg-slate-950/90 backdrop-blur-xl relative">
  {/* top subtle glow */}
  <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[300px] h-[60px] bg-emerald-500/20 blur-3xl pointer-events-none"></div>

  <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-slate-400">
    
    {/* Left */}
    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-center md:text-left">
      <span className="font-medium text-slate-300">
        © 2026 Qodirjonov Fayzullox
      </span>
      <span className="hidden md:inline text-slate-500">|</span>
      <span className="opacity-80">
        NovaMind AI — Sun'iy intellekt yordamchi platformasi
      </span>
    </div>

    {/* Right */}
    <div className="flex items-center gap-4">
      
      <a
        href="tel:935415474"
        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
      >
        <span>📞</span>
        <span>+998 (93) 541 54 74</span>
      </a>

      <span className="hidden md:inline text-slate-500">|</span>

      <a
        href="https://github.com/FayzullohQodirjonovv"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
      >
        <span>🧑‍💻</span>
        <span>GitHub</span>
      </a>

      <span className="hidden md:inline text-slate-500">|</span>

      <a
        href="https://t.me/Mr_kadirjanoff"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 hover:text-slate-200 transition-colors"
      >
        <span>✈️</span>
        <span>Telegram</span>
      </a>
    </div>
  </div>

  {/* bottom subtle line */}
  <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-700/40 to-transparent"></div>
</footer>


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
    </div>
  );
};

export default Index;
