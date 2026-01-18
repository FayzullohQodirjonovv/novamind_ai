import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Mic, Send, Image, X } from "lucide-react";
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

  const handleVoiceEnd = useCallback((finalText: string) => {
    if (finalText.trim() && !disabled) {
      onSend(finalText.trim(), selectedImage || undefined);
      setMessage("");
      setSelectedImage(null);
    }
  }, [disabled, onSend, selectedImage]);

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
    toggleListening();
  };

  // Show voice error as toast
  if (voiceError) {
    toast.error(voiceError);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
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
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
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
        className={`relative rounded-3xl transition-all duration-300 ${
          isFocused || isListening ? "shadow-glow" : "shadow-premium"
        }`}
        animate={isFocused || isListening ? { scale: 1.01 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Animated gradient border */}
        <div
          className={`absolute inset-0 rounded-3xl p-[2px] transition-opacity duration-300 ${
            isFocused || isListening ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 rounded-3xl gradient-primary animate-gradient opacity-50" />
        </div>

        {/* Input field container */}
        <div className="relative bg-card rounded-3xl flex items-center gap-2 px-4 py-3 min-h-[64px] md:min-h-[72px]">
          {/* Plus button */}
          <motion.button
            type="button"
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
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

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isListening ? "Tinglayapman..." : "Savolingizni yozing yoki rasm yuklang..."}
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base md:text-lg"
            disabled={disabled || isListening}
          />

          {/* Mic button */}
          <motion.button
            type="button"
            onClick={handleMicClick}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isListening 
                ? "bg-destructive text-destructive-foreground" 
                : "hover:bg-secondary"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={isListening ? {
              scale: [1, 1.1, 1],
              transition: { repeat: Infinity, duration: 1 }
            } : {}}
          >
            <Mic className="w-5 h-5" />
          </motion.button>

          {/* Send button */}
          <motion.button
            type="submit"
            disabled={(!message.trim() && !selectedImage) || disabled || isListening}
            className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              message.trim() || selectedImage
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "bg-secondary text-muted-foreground"
            }`}
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
