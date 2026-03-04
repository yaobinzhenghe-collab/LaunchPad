import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function SDG() {
  return (
    <div className="min-h-screen pt-16">
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs text-white/30 uppercase tracking-[0.25em] mb-4 font-medium">
              Sustainable Development Goal
            </p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-[1.05] tracking-tight mb-4">
              SDG 4.4
            </h1>
            <p className="text-white/40 text-sm mb-12">
              Quality Education — Skills for Work
            </p>

            <div className="space-y-6 text-white/60 leading-[1.9] text-base md:text-lg">
              <p>
                Our goal for the SDG 4.4 is to teach people other skills on editing, because many people don't know how to edit and we're trying to give tips and ideas to other creators so they can edit with style and courage.
              </p>
            </div>

            <div className="mt-14 flex flex-wrap gap-3">
              <Link
                href="/tips"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-black font-semibold text-sm hover:bg-primary/90 transition-all"
                data-testid="link-sdg-tips"
              >
                Explore Tips <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/8 border border-white/15 text-white font-medium text-sm hover:bg-white/15 transition-all"
                data-testid="link-sdg-templates"
              >
                Browse Templates
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
