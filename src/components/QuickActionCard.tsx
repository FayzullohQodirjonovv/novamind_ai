import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  delay?: number;
}

const QuickActionCard = ({ icon: Icon, title, description, onClick, delay = 0 }: QuickActionCardProps) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-premium"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary group-hover:gradient-primary group-hover:text-primary-foreground transition-all duration-300">
        <Icon className="h-5 w-5 text-secondary-foreground group-hover:text-primary-foreground transition-colors" />
      </div>
      <div>
        <h3 className="font-semibold text-card-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.button>
  );
};

export default QuickActionCard;
