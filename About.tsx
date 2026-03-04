import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen pt-16">
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs text-white/30 uppercase tracking-[0.25em] mb-4 font-medium">About us</p>
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white leading-[1.05] tracking-tight mb-12">
              Edit Hive.
            </h1>

            <div className="space-y-6 text-white/60 leading-[1.9] text-base md:text-lg">
              <p>
                I started this website because I enjoyed editing. I spend hours while trying to find clips or skills that I didn't know, to improve my videos. That was a big problem because many people faced that same issue while editing, especially young creators that had just started — that reminds me about when I had just started editing 2 years ago. Before I didn't know how to edit at all but after testing the app countless times and looking up tutorials I improved during the years.
              </p>
              <p>
                Editing without knowing how to do the style can double the editing time, causing precious time that could have been spent creating the same feature on the edit much faster with a good tutorial. This is because people aren't 100% sure about their techniques and don't learn new ways to edit so they stay stuck with the same transitions, overlays, texts and etc.
              </p>
              <p>
                I noticed that many content creators don't know how to edit. When seeing videos I noticed messy work, bad quality videos, bad texts and etc. My website is a creative platform made to help beginners and experts at improving their content and video editing skills. This website's mission is to make editing easy, accessible and less overwhelming for everyone to create high quality videos on simple step tutorials.
              </p>
              <p>
                Something that many people don't understand is that many creators struggle with complicated tools, confusing tutorials and limited access to premium effects or tools. That's why we built this app to provide tips, tutorials and support.
              </p>
              <p>
                Our goal is not to give users ready made templates but, to teach them how certain edits are made and what to improve. By showing people templates that interest them they will want to learn how to make those editing styles on websites like CapCut. By combining step by step guidance, trend based techniques and personalized advice. Helping creators turn their ideas into professional looking content.
              </p>
            </div>

            <div className="mt-14 flex flex-wrap gap-3">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-black font-semibold text-sm hover:bg-primary/90 transition-all"
                data-testid="link-about-templates"
              >
                Browse Templates <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tips"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/8 border border-white/15 text-white font-medium text-sm hover:bg-white/15 transition-all"
                data-testid="link-about-tips"
              >
                Explore Tips
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
