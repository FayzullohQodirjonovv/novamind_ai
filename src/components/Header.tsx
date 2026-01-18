import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Settings as SettingsIcon,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onSettingsClick: () => void;
  onPricingClick: () => void;
}

type Language = {
  code: "uz" | "en" | "ru";
  name: string;
  flag: string;
  short: string;
};

const languages: Language[] = [
  { code: "uz", name: "O'zbek", flag: "🇺🇿", short: "UZ" },
  { code: "en", name: "English", flag: "🇺🇸", short: "EN" },
  { code: "ru", name: "Русский", flag: "🇷🇺", short: "RU" },
];

const Header = ({ onSettingsClick, onPricingClick }: HeaderProps) => {
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);

  return (
    <motion.header
      className="
        fixed top-0 inset-x-0 z-30
        flex items-center justify-between 
        px-3 md:px-6 py-3 md:py-4 
        bg-slate-950/80 backdrop-blur-xl border-b border-white/10
      "
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo / Left side */}
      <motion.div
        className="flex items-center gap-2.5 md:gap-3 min-w-0"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl gradient-primary shadow-glow flex-shrink-0">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm md:text-lg font-semibold text-slate-50 truncate max-w-[140px] sm:max-w-[200px] md:max-w-[260px]">
              NovaMind AI Assistant
            </span>
            <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
              Pro
            </span>
          </div>
          <span className="hidden md:inline text-[11px] text-slate-400">
            Math · ChatGPT-style · Vision
          </span>
        </div>
      </motion.div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
        {/* Pricing button – only md+ */}
        <motion.button
          onClick={onPricingClick}
          className="
            hidden md:inline-flex items-center gap-1.5 
            px-3.5 py-2 rounded-xl 
            bg-slate-900/80 hover:bg-slate-800/90 
            text-sm text-slate-100
            border border-white/10 
            transition-colors
          "
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <CreditCard className="w-4 h-4" />
          <span className="font-medium">Tariflar</span>
        </motion.button>

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="
                flex items-center gap-1.5 md:gap-2 
                px-2.5 md:px-3 py-1.5 
                rounded-xl bg-slate-900/70 hover:bg-slate-800/80 
                border border-white/10
                text-xs md:text-sm text-slate-100
              "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-base md:text-lg leading-none">
                {currentLang.flag}
              </span>
              <span className="hidden md:inline">{currentLang.name}</span>
              <span className="md:hidden font-medium tracking-wide">
                {currentLang.short}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="rounded-xl bg-slate-950 border border-white/10 min-w-[160px]"
          >
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Language
            </div>
            <DropdownMenuSeparator className="bg-white/5" />
            {languages.map((lang) => {
              const active = lang.code === currentLang.code;
              return (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setCurrentLang(lang)}
                  className={`
                    cursor-pointer rounded-lg px-2 py-1.5 text-sm flex items-center gap-2
                    ${active ? "bg-emerald-500/15 text-emerald-300" : "text-slate-200"}
                  `}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span>{lang.name}</span>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wide">
                      {lang.short}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings button */}
        <motion.button
          onClick={onSettingsClick}
          className="
            w-9 h-9 md:w-10 md:h-10 
            rounded-xl bg-slate-900/80 hover:bg-slate-800 
            flex items-center justify-center 
            border border-white/10
            text-slate-200
            transition-colors
          "
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <SettingsIcon className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
