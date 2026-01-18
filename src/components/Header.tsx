import { motion } from "framer-motion";
import {
  Bot,
  Settings as SettingsIcon,
  CreditCard,
  ChevronDown,
  LogIn,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const languages = [
  { code: "uz", name: "O'zbek", flag: "🇺🇿" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

interface HeaderProps {
  onSettingsClick: () => void;
  onPricingClick: () => void;
}

const Header = ({ onSettingsClick, onPricingClick }: HeaderProps) => {
  const [currentLang, setCurrentLang] = useState(languages[0]);
  const { user, isLoading, signInWithGoogle, signOut } = useAuth();

  // const handleSignIn = async () => {
  //   try {
  //     await signInWithGoogle();
  //   } catch (error) {
  //     toast.error("Tizimga kirishda xatolik yuz berdi");
  //   }
  // };

  // const handleSignOut = async () => {
  //   try {
  //     await signOut();
  //     toast.success("Tizimdan chiqdingiz");
  //   } catch (error) {
  //     toast.error("Chiqishda xatolik yuz berdi");
  //   }
  // };

  return (
    <motion.header
      className="
        w-full max-w-full 
        flex items-center justify-between 
        px-3 md:px-6 py-3 md:py-4 
        relative z-10 
        overflow-x-hidden
      "
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo / Left side */}
      <motion.div
        className="flex items-center gap-2 md:gap-3 min-w-0"
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl gradient-primary shadow-glow flex-shrink-0">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-sm md:text-lg font-bold text-foreground truncate max-w-[120px] sm:max-w-[180px] md:max-w-[220px]">
            AI Assistant
          </span>
          <span className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium flex-shrink-0">
            Pro
          </span>
        </div>
      </motion.div>

      {/* Right side */}
      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
        {/* Pricing button – only md+ */}
        <motion.button
          onClick={onPricingClick}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-sm font-medium">Tariflar</span>
        </motion.button>

        {/* Language selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="
                flex items-center gap-1.5 md:gap-2 
                px-2.5 md:px-3 py-2 
                rounded-xl hover:bg-secondary transition-colors
              "
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{currentLang.flag}</span>
              <span className="hidden md:inline text-sm">{currentLang.name}</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setCurrentLang(lang)}
                className="cursor-pointer rounded-lg"
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings button */}
        <motion.button
          onClick={onSettingsClick}
          className="
            w-9 h-9 md:w-10 md:h-10 
            rounded-xl bg-secondary hover:bg-secondary/80 
            flex items-center justify-center transition-colors
          "
          whileHover={{ scale: 1.05, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <SettingsIcon className="w-5 h-5" />
        </motion.button>

        {/* Auth section
        {isLoading ? (
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-secondary animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                className="
                  flex items-center gap-1.5 md:gap-2 
                  p-0.5 md:p-1 
                  rounded-xl hover:bg-secondary/80 transition-colors
                "
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Avatar className="w-8 h-8 md:w-9 md:h-9">
                  <AvatarImage
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.full_name}
                  />
                  <AvatarFallback className="gradient-primary text-primary-foreground text-sm">
                    {user.user_metadata?.full_name?.charAt(0) ||
                      user.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <div className="px-3 py-2">
                <p className="font-medium text-sm">
                  {user.user_metadata?.full_name || "Foydalanuvchi"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-destructive cursor-pointer rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Chiqish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <motion.button
            onClick={handleSignIn}
            className="
              flex items-center gap-1.5 md:gap-2 
              px-3 md:px-4 py-2 
              rounded-xl gradient-primary text-primary-foreground shadow-glow
            "
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* <LogIn className="w-4 h-4" />
            <span className="text-sm font-medium hidden sm:inline">
              Kirish
            </span> */}
          {/* </motion.button> */}
        {/* )}  */}
      </div>
    </motion.header>
  );
};

export default Header;
