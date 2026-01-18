import { motion } from "framer-motion";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useState } from "react";

interface PricingProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  {
    name: "Free",
    price: "Bepul",
    icon: Zap,
    features: ["Cheksiz savollar", "Asosiy AI javoblar", "Standart tezlik"],
    popular: false,
  },
  {
    name: "Premium",
    price: "Bepul",
    icon: Star,
    features: ["Barcha Free imkoniyatlar", "Tezroq javoblar", "Emoji va stikerlar", "Prioritet qo'llab-quvvatlash"],
    popular: false,
  },
  {
    name: "Pro",
    price: "Bepul",
    icon: Crown,
    features: [
      "Barcha Premium imkoniyatlar",
      "Ultra tez javoblar ⚡",
      "Premium animatsiyalar 🔥",
      "Maxsus AI xususiyatlari",
      "VIP qo'llab-quvvatlash",
    ],
    popular: true,
  },
];

const Pricing = ({ isOpen, onClose }: PricingProps) => {
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    if (planName === "Pro") {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Tariflar</h2>
          <p className="text-muted-foreground">
            Barcha rejalar bepul! 🎉 Siz eng zo'risini tanlang
          </p>
        </div>

        {/* Success message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-primary/20 rounded-2xl text-center"
          >
            <span className="text-lg">🚀 Siz eng zo'r rejimdasiz!</span>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.name;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border hover:border-primary/50"
                } ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
                onClick={() => handleSelectPlan(plan.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-primary text-primary-foreground text-sm font-medium rounded-full">
                    ⭐ Tavsiya etiladi
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isSelected ? "gradient-primary text-primary-foreground" : "bg-secondary"
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    <p className="text-primary font-semibold">{plan.price}</p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-6 w-full py-3 rounded-2xl font-medium transition-all ${
                    isSelected
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {isSelected ? "Tanlangan ✓" : "Tanlash"}
                </button>
              </motion.div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-secondary hover:bg-secondary/80 rounded-2xl font-medium transition-colors"
        >
          Yopish
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Pricing;
