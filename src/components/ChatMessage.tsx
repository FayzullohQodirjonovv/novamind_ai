import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  image?: string;
  isNew?: boolean;
}

const ChatMessage = ({ role, content, image, isNew = false }: ChatMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState(isNew && role === "assistant" ? "" : content);
  const isUser = role === "user";

  useEffect(() => {
    if (isNew && role === "assistant" && content !== displayedContent) {
      setDisplayedContent(content);
    }
  }, [content, isNew, role, displayedContent]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-4`}
    >
      <div className={`flex items-start gap-3 max-w-[85%] md:max-w-[70%] ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <motion.div 
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
            isUser 
              ? "bg-accent/20 text-accent" 
              : "gradient-primary text-primary-foreground"
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          {isUser ? "👤" : "✨"}
        </motion.div>

        {/* Message content */}
        <div className="flex flex-col gap-2">
          {/* Image preview */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${isUser ? "self-end" : "self-start"}`}
            >
              <img 
                src={image} 
                alt="Uploaded" 
                className="max-h-48 rounded-xl border border-border"
              />
            </motion.div>
          )}

          {/* Message bubble */}
          <motion.div
            className={`px-5 py-4 rounded-3xl ${
              isUser
                ? "bg-accent text-accent-foreground rounded-tr-lg"
                : "bg-card shadow-premium rounded-tl-lg"
            }`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05 }}
          >
            <div className="text-base leading-relaxed whitespace-pre-wrap">
              {displayedContent}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
