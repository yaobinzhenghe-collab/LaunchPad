import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Sparkles, Wand2, ExternalLink, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comments } from "@/components/Comments";
import { ShareButtons } from "@/components/ShareButtons";
import { LikeButton } from "@/components/LikeButton";
import type { Tip } from "@shared/schema";

export default function TipDetail() {
  const params = useParams<{ id: string }>();
  const tipId = parseInt(params.id || "0");
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { data: tip, isLoading } = useQuery<Tip>({
    queryKey: ["/api/tips", tipId],
    queryFn: async () => {
      const res = await fetch(`/api/tips/${tipId}`);
      if (!res.ok) throw new Error("Tip not found");
      return res.json();
    },
    enabled: tipId > 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tip) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Tip not found</h1>
        <Link href="/tips">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Tips
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/tips">
        <Button variant="ghost" className="gap-2 mb-6" data-testid="button-back-tips">
          <ArrowLeft className="h-4 w-4" />
          Back to Tips
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-card border border-white/10 rounded-2xl overflow-hidden mb-8">
          <div className="aspect-video bg-black relative group">
            {tip.videoUrl.startsWith("/objects") ? (
              <>
                {!isPlaying ? (
                  <>
                    {tip.thumbnailUrl ? (
                      <img
                        src={tip.thumbnailUrl}
                        alt="Tutorial thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={`${tip.videoUrl}#t=0.5`}
                        className="w-full h-full object-contain"
                        preload="metadata"
                        playsInline
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <button
                        onClick={() => {
                          setIsPlaying(true);
                          setTimeout(() => videoRef.current?.play(), 100);
                        }}
                        className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                        data-testid="button-play-video"
                      >
                        <Play className="w-10 h-10 text-white fill-white ml-1" />
                      </button>
                    </div>
                  </>
                ) : (
                  <video
                    ref={videoRef}
                    src={tip.videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    data-testid="video-player"
                  />
                )}
              </>
            ) : (
              <>
                {tip.thumbnailUrl ? (
                  <img
                    src={tip.thumbnailUrl}
                    alt="Tutorial thumbnail"
                    className="w-full h-full object-cover opacity-70"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50" />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <a
                    href={tip.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Play className="w-10 h-10 text-white fill-white ml-1" />
                  </a>
                </div>
              </>
            )}
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/20 text-sm font-bold text-primary-foreground">
              {tip.category}
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-4">{tip.title}</h1>
            <p className="text-muted-foreground text-lg mb-6 whitespace-pre-wrap">{tip.content}</p>

            {tip.capcutEffects && tip.capcutEffects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">CapCut Effects Used</h3>
                <div className="flex flex-wrap gap-2">
                  {tip.capcutEffects.map((effect, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-300 border border-white/10 flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-purple-400" />
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {tip.aeInspiration && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 mb-6">
                <div className="flex items-center gap-2 mb-2 text-sm font-bold text-blue-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  After Effects Inspiration
                </div>
                <p className="text-blue-200/80 italic">"{tip.aeInspiration}"</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {!tip.videoUrl.startsWith("/objects") && (
                <a
                  href={tip.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="gap-2" data-testid="button-watch-tutorial">
                    Watch Tutorial
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
              <LikeButton type="tip" id={tipId} likes={tip.likes || 0} />
              <ShareButtons title={tip.title} type="tip" id={tipId} />
            </div>
          </div>
        </div>
      </motion.div>

      <Comments tipId={tipId} />
    </div>
  );
}
