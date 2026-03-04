import { motion } from "framer-motion";
import { Lightbulb, Sparkles, Zap, TrendingUp } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Innovation() {
  const innovations = [
    {
      title: "AI Idea Generation",
      description: "Using advanced AI to spark unique video concepts tailored to your style.",
      icon: <Lightbulb className="w-10 h-10 text-primary" />
    },
    {
      title: "Trend Forecasting",
      description: "Identifying viral styles before they peak to give you a competitive edge.",
      icon: <TrendingUp className="w-10 h-10 text-primary" />
    },
    {
      title: "Dynamic Templates",
      description: "Next-gen editing structures that adapt to your footage automatically.",
      icon: <Sparkles className="w-10 h-10 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Innovation at <span className="text-primary">Edit Hive</span>
          </h1>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">
            We are constantly pushing the boundaries of what's possible in mobile video editing.
          </p>
        </motion.div>

        <div className="space-y-12">
          {innovations.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col md:flex-row gap-8 items-center p-8 rounded-3xl bg-white/[0.02] border border-white/5"
            >
              <div className="p-5 rounded-2xl bg-primary/10 border border-primary/20">
                {item.icon}
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-lg text-white/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-24 p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 text-center"
        >
          <Zap className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-display font-bold text-white mb-4">The Future of Content</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Our research and development team is focused on making professional production quality 
            accessible to anyone with a smartphone.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
