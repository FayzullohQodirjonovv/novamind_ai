import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Zap, Sparkles, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    darkMode: boolean;
    responseSpeed: "normal" | "fast" | "ultra";
    animationLevel: "off" | "smooth" | "crazy";
  };
  onSettingsChange: (settings: SettingsProps["settings"]) => void;
  onClearChat?: () => void;
}

const Settings = ({ isOpen, onClose, settings, onSettingsChange, onClearChat }: SettingsProps) => {
  const speedOptions = [
    { value: "normal", label: "Normal", icon: "🐢" },
    { value: "fast", label: "Fast", icon: "🚀" },
    { value: "ultra", label: "Ultra", icon: "⚡" },
  ] as const;

  const animationOptions = [
    { value: "off", label: "Off", icon: "😴" },
    { value: "smooth", label: "Smooth", icon: "✨" },
    { value: "crazy", label: "Crazy", icon: "🔥" },
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
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-foreground">Sozlamalar</h2>
                <motion.button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Dark Mode */}
              <div className="mb-8">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {settings.darkMode ? (
                      <Moon className="w-5 h-5 text-primary" />
                    ) : (
                      <Sun className="w-5 h-5 text-primary" />
                    )}
                    <div>
                      <p className="font-medium">Tungi rejim</p>
                      <p className="text-sm text-muted-foreground">Ko'zni asraydi 🌙</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) =>
                      onSettingsChange({ ...settings, darkMode: checked })
                    }
                  />
                </div>
              </div>

              {/* Response Speed */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Javob tezligi</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {speedOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => onSettingsChange({ ...settings, responseSpeed: option.value })}
                      className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-colors ${
                        settings.responseSpeed === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Animation Level */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Animatsiya darajasi</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {animationOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => onSettingsChange({ ...settings, animationLevel: option.value })}
                      className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-colors ${
                        settings.animationLevel === option.value
                          ? "gradient-primary text-primary-foreground"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Clear Chat */}
              {onClearChat && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Trash2 className="w-5 h-5 text-destructive" />
                    <h3 className="font-semibold">Chat tarixini tozalash</h3>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      onClearChat();
                      onClose();
                    }}
                  >
                    Barcha xabarlarni o'chirish
                  </Button>
                </div>
              )}

              {/* Info */}
              <div className="p-4 bg-primary/10 rounded-2xl">
                <p className="text-sm text-center text-muted-foreground">
                  ✨ Barcha sozlamalar avtomatik saqlanadi
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
