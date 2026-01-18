import { motion } from "framer-motion";

const FloatingShape = ({ 
  className, 
  delay = 0 
}: { 
  className?: string; 
  delay?: number 
}) => (
  <motion.div
    className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
    animate={{
      y: [0, -20, 10, 0],
      x: [0, 10, -10, 0],
      scale: [1, 1.1, 0.95, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  />
);

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient */}
      <div className="absolute inset-0 gradient-bg" />
      
      {/* Floating shapes */}
      <FloatingShape 
        className="w-96 h-96 bg-primary/20 -top-20 -left-20" 
        delay={0}
      />
      <FloatingShape 
        className="w-80 h-80 bg-accent/20 top-1/3 -right-20" 
        delay={2}
      />
      <FloatingShape 
        className="w-72 h-72 bg-primary/15 bottom-20 left-1/4" 
        delay={4}
      />
      <FloatingShape 
        className="w-64 h-64 bg-accent/15 -bottom-10 right-1/4" 
        delay={1}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
