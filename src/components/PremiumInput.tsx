import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, Send, Image, X, Check } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { toast } from "sonner";

interface PremiumInputProps {
  onSend: (message: string, image?: string) => void;
  disabled?: boolean;
}

const PremiumInput = ({ onSend, disabled }: PremiumInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ End-da AUTOSEND emas – faqat matnni inputga qo'yamiz
  const handleVoiceEnd = useCallback((finalText: string) => {
    if (finalText.trim()) {
      setMessage(finalText.trim());
      inputRef.current?.focus();
    }
  }, []);

  const {
    isListening,
    transcript,
    error: voiceError,
    isSupported: voiceSupported,
    toggleListening,
  } = useVoiceInput({
    onTranscript: (text) => setMessage(text),
    onEnd: handleVoiceEnd,
    language: "uz-UZ",
  });

  useEffect(() => {
    if (voiceError) {
      toast.error(voiceError);
    }
  }, [voiceError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim(), selectedImage || undefined);
      setMessage("");
      setSelectedImage(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
        toast.error("Faqat JPG, PNG yoki WEBP formatdagi rasmlar");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Rasm hajmi 5MB dan oshmasligi kerak");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setShowAttachMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMicClick = () => {
    if (!voiceSupported) {
      toast.error("Brauzeringiz ovozli kiritishni qo'llab-quvvatlamaydi");
      return;
    }
    // eski matnni tozalaymiz va yozishni boshlaymiz
    if (!isListening) {
      setMessage("");
      inputRef.current?.focus();
    }
    toggleListening();
  };

  const handleCancelRecording = () => {
    if (isListening) toggleListening();
    setMessage("");
  };

  const handleConfirmRecording = () => {
    if (isListening) toggleListening();
    if (transcript?.trim()) {
      setMessage(transcript.trim());
      inputRef.current?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-full relative">
      {/* 🎙 ChatGPT dagidek voice bar */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-3 w-full"
          >
            <div className="w-full rounded-full bg-background/80 border border-border/60 px-4 py-2 flex items-center gap-3 shadow-sm">
              {/* fake waveform */}
              <div className="flex-1 flex items-center gap-2 overflow-hidden">
                <div className="relative flex-1 h-[2px] overflow-hidden">
                  <div className="absolute inset-0 border-t border-dotted border-muted-foreground/60 animate-pulse" />
                </div>
                <div className="flex items-end gap-[3px]">
                  <span className="inline-flex h-3 w-[2px] rounded-full bg-primary/70 animate-[ping_1s_ease-in-out_infinite]" />
                  <span className="inline-flex h-5 w-[3px] rounded-full bg-primary/90 animate-[pulse_1s_ease-in-out_infinite]" />
                  <span className="inline-flex h-4 w-[2px] rounded-full bg-primary/60 animate-[ping_1.2s_ease-in-out_infinite]" />
                  <span className="inline-flex h-6 w-[3px] rounded-full bg-primary/80 animate-[pulse_1.1s_ease-in-out_infinite]" />
                </div>
              </div>

              {/* transcript preview */}
              <span className="flex-1 truncate text-xs sm:text-sm text-muted-foreground">
                {transcript && transcript.length > 0
                  ? transcript
                  : "Gapiring... ovozingizni matnga aylantiryapman 🎙️"}
              </span>

              {/* X / ✓ tugmalar */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCancelRecording}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-destructive/10 text-destructive"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRecording}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-3 left-0"
          >
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Preview"
                className="max-h-32 rounded-xl border border-border"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attachment menu */}
      <AnimatePresence>
        {showAttachMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-3 left-0 bg-card rounded-2xl shadow-premium p-2 flex gap-2"
          >
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-secondary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Rasm</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleImageSelect}
      />

      {/* Main input container */}
      <motion.div
        className={`relative rounded-3xl transition-all duration-300 max-w-full overflow-hidden ${
          isFocused || isListening ? "shadow-glow" : "shadow-premium"
        }`}
        animate={isFocused || isListening ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Gradient border */}
        <div
          className={`absolute inset-0 rounded-3xl p-[2px] transition-opacity duration-300 ${
            isFocused || isListening ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 rounded-3xl gradient-primary animate-gradient opacity-50" />
        </div>

        {/* Input row */}
        <div
          className="
            relative bg-card rounded-3xl flex items-center 
            gap-1.5 md:gap-2 
            px-3 md:px-4 
            py-2.5 md:py-3 
            min-h-[56px] md:min-h-[72px]
            w-full
          "
        >
          {/* Plus */}
          <motion.button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: showAttachMenu ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {showAttachMenu ? (
                <X className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Plus className="w-5 h-5 text-muted-foreground" />
              )}
            </motion.div>
          </motion.button>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={
              isListening
                ? "Ovoz yozilmoqda..."
                : "Savolingizni yozing yoki mic-ni bosib gapiring..."
            }
            className="flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base md:text-lg"
            disabled={disabled}
          />

          {/* Mic */}
          <motion.button
            type="button"
            onClick={handleMicClick}
            className={`flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${
              isListening
                ? "bg-destructive text-destructive-foreground"
                : "hover:bg-secondary"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={
              isListening
                ? {
                    scale: [1, 1.08, 1],
                    transition: { repeat: Infinity, duration: 1 },
                  }
                : {}
            }
          >
            <Mic className="w-5 h-5" />
          </motion.button>

          {/* Send */}
          <motion.button
            type="submit"
            disabled={(!message.trim() && !selectedImage) || disabled || isListening}
            className={`
              flex-shrink-0 
              w-10 h-10 md:w-12 md:h-12 
              rounded-full flex items-center justify-center transition-all
              ${
                message.trim() || selectedImage
                  ? "gradient-primary text-primary-foreground shadow-glow"
                  : "bg-secondary text-muted-foreground"
              }
            `}
            whileHover={message.trim() || selectedImage ? { scale: 1.05 } : {}}
            whileTap={message.trim() || selectedImage ? { scale: 0.95 } : {}}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </form>
  );
};

export default PremiumInput;
