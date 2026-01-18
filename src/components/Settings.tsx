import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Zap, Sparkles, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export interface AppSettings {
  darkMode: boolean;
  responseSpeed: "normal" | "fast" | "ultra";
  animationLevel: "off" | "smooth" | "crazy";
}

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onClearChat?: () => void;
}

const Settings = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  onClearChat,
}: SettingsProps) => {
  const speedOptions = [
    { value: "normal", label: "Normal", icon: "🐢", desc: "Tabiiy tezlik" },
    { value: "fast", label: "Fast", icon: "🚀", desc: "Tezroq oqish" },
    { value: "ultra", label: "Ultra", icon: "⚡", desc: "ChatGPT’dan ham chaqqon" },
  ] as const;

  const animationOptions = [
    { value: "off", label: "Off", icon: "😴", desc: "Animatsiya yo‘q" },
    { value: "smooth", label: "Smooth", icon: "✨", desc: "Yumshoq effektlar" },
    { value: "crazy", label: "Crazy", icon: "🔥", desc: "Maksimal harakat" },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card/95 shadow-2xl z-50 overflow-y-auto border-l border-border"
          >
            <div className="p-6 space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Sozlamalar
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ilova xulq-atvorini o‘z didingizga moslang
                  </p>
                </div>
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {/* Dark Mode */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Tashqi ko‘rinish
                </h3>
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {settings.darkMode ? (
                      <Moon className="w-5 h-5 text-primary" />
                    ) : (
                      <Sun className="w-5 h-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">Tungi rejim</p>
                      <p className="text-xs text-muted-foreground">
                        Ko&apos;zni asraydi, kechasi ishlash uchun qulay 🌙
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      onSettingsChange({ ...settings, darkMode: checked })
                    }
                  />
                </div>
              </section>

              {/* Response Speed */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Javob tezligi
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {speedOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() =>
                        onSettingsChange({
                          ...settings,
                          responseSpeed: option.value,
                        })
                      }
                      className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-colors text-center ${
                        settings.responseSpeed === option.value
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <span className="text-xs font-medium">
                        {option.label}
                      </span>
                      <span className="text-[10px] text-primary-foreground/80">
                        {option.desc}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Animation Level */}
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    Animatsiya darajasi
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {animationOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() =>
                        onSettingsChange({
                          ...settings,
                          animationLevel: option.value,
                        })
                      }
                      className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-colors text-center ${
                        settings.animationLevel === option.value
                          ? "gradient-primary text-primary-foreground shadow-glow"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-xl">{option.icon}</span>
                      <span className="text-xs font-medium">
                        {option.label}
                      </span>
                      <span className="text-[10px] text-primary-foreground/80">
                        {option.desc}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </section>

              {/* Clear Chat */}
              {onClearChat && (
                <section className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <h3 className="text-sm font-semibold text-muted-foreground">
                      Chat tarixini tozalash
                    </h3>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      onClearChat();
                      onClose();
                    }}
                  >
                    Barcha xabarlarni o&apos;chirish
                  </Button>
                </section>
              )}

              {/* Info */}
              <div className="p-4 bg-primary/10 rounded-2xl">
                <p className="text-xs text-center text-muted-foreground">
                  ✨ Barcha sozlamalar brauzeringizda (localStorage) avtomatik
                  saqlanadi
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Settings;
