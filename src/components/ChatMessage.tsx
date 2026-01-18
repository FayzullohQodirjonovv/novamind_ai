import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  image?: string;
  isNew?: boolean;
}

const ChatMessage = ({ role, content, image, isNew = false }: ChatMessageProps) => {
  const [displayedContent, setDisplayedContent] = useState(
    isNew && role === "assistant" ? "" : content
  );
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
      className={`
        w-full max-w-full 
        flex px-3 sm:px-4 py-1
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      <div
        className={`
          flex items-start gap-2 sm:gap-3 
          max-w-[92%] sm:max-w-[80%] md:max-w-[70%]
          ${isUser ? "flex-row-reverse" : ""}
        `}
      >
        {/* Avatar */}
        <motion.div
          className={`
            flex-shrink-0 
            w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 
            rounded-full flex items-center justify-center
            ${isUser ? "bg-accent/20 text-accent" : "gradient-primary text-primary-foreground"}
          `}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          {isUser ? "👤" : "✨"}
        </motion.div>

        {/* Message content */}
        <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0">
          {/* Image preview */}
          {image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`${isUser ? "self-end" : "self-start"} max-w-[220px] sm:max-w-xs`}
            >
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-auto rounded-xl border border-border object-cover"
              />
            </motion.div>
          )}

          {/* Message bubble */}
          <motion.div
            className={`
              inline-block 
              px-4 sm:px-5 py-3 sm:py-4 
              rounded-2xl sm:rounded-3xl
              break-words
              ${isUser
                ? "bg-accent text-accent-foreground rounded-tr-lg"
                : "bg-card shadow-premium rounded-tl-lg"}
            `}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.05 }}
          >
            <div
              className="
                text-sm sm:text-base 
                leading-relaxed 
                whitespace-pre-wrap 
                break-words
              "
            >
              {displayedContent}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
