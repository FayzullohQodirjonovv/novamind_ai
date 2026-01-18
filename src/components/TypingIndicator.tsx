import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-5 py-4"
    >
      <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
        <span className="text-sm">✨</span>
      </div>
      <div className="flex items-center gap-1.5 px-4 py-3 bg-card rounded-2xl shadow-sm">
        <motion.span
          className="w-2.5 h-2.5 rounded-full bg-primary typing-dot-1"
        />
        <motion.span
          className="w-2.5 h-2.5 rounded-full bg-primary typing-dot-2"
        />
        <motion.span
          className="w-2.5 h-2.5 rounded-full bg-primary typing-dot-3"
        />
      </div>
      <span className="text-sm text-muted-foreground">AI o'ylayapti...</span>
    </motion.div>
  );
};

export default TypingIndicator;
