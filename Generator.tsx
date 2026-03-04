import { useState } from "react";
import { useGenerateIdea } from "@/hooks/use-ideas";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Sparkles, Loader2, RefreshCw, Scissors, Layers } from "lucide-react";

export default function Generator() {
  const [prompt, setPrompt] = useState("");
  const { mutate, isPending, data, reset } = useGenerateIdea();

  const handleGenerate = () => {
    mutate(prompt || undefined);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center mb-12 max-w-2xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-600 mb-6 shadow-lg shadow-primary/25">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Edit Idea Generator
        </h1>
        <p className="text-lg text-muted-foreground">
          Stuck on what to create? Get a unique video concept, editing style, and tool recommendations instantly.
        </p>
      </div>

      <div className="w-full max-w-xl bg-card border border-white/10 rounded-3xl p-8 shadow-xl">
        {!data ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                What kind of video are you making? (Optional)
              </label>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., travel vlog, gaming clips, fitness..."
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isPending}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-amber-600 text-white font-bold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Idea
                </>
              )}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <span className="text-xs font-bold tracking-widest text-primary uppercase">Your Concept</span>
              <h2 className="text-2xl font-bold text-white mt-2 leading-tight">
                {data.concept}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Visual Style</h3>
                  <p className="text-sm text-gray-400">{data.style}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Scissors className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">CapCut Tools</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.tools.map((tool, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                <h3 className="font-bold text-yellow-400 text-xs uppercase mb-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  AE Inspiration
                </h3>
                <p className="text-sm text-yellow-100/80 italic">
                  "{data.aeInspiration}"
                </p>
              </div>
            </div>

            <button
              onClick={() => reset()}
              className="w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate Another
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
