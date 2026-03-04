import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Video, Zap, BookOpen, Clock, DollarSign } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Services() {
  const services = [
    {
      title: "CapCut Templates",
      description: "Ready-to-use viral templates. Just swap your clips and you're done.",
      icon: <Video className="w-8 h-8 text-primary" />,
      link: "/templates",
      cta: "Browse Templates"
    },
    {
      title: "Tips & Tutorials",
      description: "Learn professional techniques made simple for beginners and experts.",
      icon: <Zap className="w-8 h-8 text-primary" />,
      link: "/tips",
      cta: "Explore Tips"
    },
    {
      title: "Editing Classes",
      description: "Personalized 1-on-1 editing sessions to master your craft.",
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      price: "5000 colones / hour",
      link: "/contact",
      cta: "Book a Class"
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Our Services
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Everything you need to create professional-looking content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/20 transition-all group"
            >
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-2xl font-display font-bold text-white mb-3">
                {service.title}
              </h3>
              <p className="text-white/60 mb-6 leading-relaxed">
                {service.description}
              </p>
              {service.price && (
                <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-bold text-primary">{service.price}</span>
                </div>
              )}
              <Link href={service.link}>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium group-hover:bg-primary group-hover:text-black transition-all">
                  {service.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
