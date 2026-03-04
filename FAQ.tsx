import { motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    question: "How do I import a CapCut template?",
    answer: "Click the 'Open in CapCut' button on any template page. This will open CapCut directly and prompt you to import the template. Make sure you have CapCut installed on your device. Once imported, you can replace the placeholder clips with your own footage!"
  },
  {
    question: "What's the best export setting for TikTok?",
    answer: "For TikTok, export at 1080x1920 resolution (9:16 aspect ratio) at 30fps or 60fps. Use H.264 codec for best compatibility. Keep the bitrate around 15-20 Mbps for crisp quality without huge file sizes."
  },
  {
    question: "What's the best export setting for Instagram Reels?",
    answer: "For Reels, use 1080x1920 (9:16) at 30fps. Instagram compresses videos heavily, so export at the highest quality possible - around 20-25 Mbps. H.264 codec works best."
  },
  {
    question: "What's the best export setting for YouTube Shorts?",
    answer: "YouTube Shorts supports 1080x1920 at up to 60fps. Export with H.264 codec and a bitrate of 15-20 Mbps. YouTube re-encodes everything anyway, so focus on getting clean source footage."
  },
  {
    question: "Can I use these templates commercially?",
    answer: "Yes! All templates on Edit Hive are free to use for personal and commercial content. You can use them for brand content, sponsored posts, or any monetized videos. Just don't resell the templates themselves."
  },
  {
    question: "Why isn't the template importing correctly?",
    answer: "Make sure your CapCut app is updated to the latest version. Some templates require specific CapCut features that may not be available in older versions. Also check that you have a stable internet connection during the import process."
  },
  {
    question: "How do I get smooth slow motion?",
    answer: "For the best slow motion, record at higher frame rates (60fps or 120fps) and then slow it down in editing. CapCut's optical flow feature can help smooth out footage that wasn't recorded at high frame rates, but nothing beats shooting at 120fps for buttery smooth slow-mo."
  },
  {
    question: "What's the best way to sync edits to music?",
    answer: "Use CapCut's auto-beat sync feature to automatically detect beats in your music. For manual control, add markers on the beat drops and cut your clips to match. Pro tip: try to cut on the downbeat (strong beats) for the most satisfying edits."
  },
  {
    question: "How can I make my text look more professional?",
    answer: "Use consistent fonts throughout your video - stick to 2-3 max. Add subtle shadows or outlines for readability. Animate text with smooth fade-ins or slides. Match your text colors to your video's color palette for a cohesive look."
  },
  {
    question: "My video quality looks bad after export. What's wrong?",
    answer: "This usually happens when you export at too low a bitrate or resolution. Always export at 1080p minimum with a bitrate of at least 15 Mbps. Also make sure your source footage is high quality - you can't improve low-quality clips in editing."
  }
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-white/10 rounded-xl overflow-hidden bg-card/50"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover-elevate"
        data-testid={`button-faq-${index}`}
      >
        <span className="font-medium text-white pr-4">{question}</span>
        <ChevronDown 
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-6 pb-5"
        >
          <p className="text-muted-foreground leading-relaxed">{answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know about using templates, exporting videos, and getting the best results.
        </p>
      </motion.div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, index) => (
          <FAQItem key={index} {...item} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-muted-foreground">
          Still have questions?{" "}
          <a href="/contact" className="text-primary hover:text-primary/80 transition-colors">
            Send me a message
          </a>
        </p>
      </motion.div>
    </div>
  );
}
