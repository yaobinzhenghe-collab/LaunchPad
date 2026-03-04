import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Play, Pause, Volume2, VolumeX, ChevronUp, ChevronDown, Lightbulb, Layout, ExternalLink, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Template, Tip } from "@shared/schema";

interface FeedItem {
  id: string;
  type: "template" | "tip";
  title: string;
  description: string;
  category: string;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  authorName?: string | null;
  linkUrl: string;
  externalUrl?: string;
}

export default function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const { data: tips = [] } = useQuery<Tip[]>({
    queryKey: ["/api/tips/search"],
    queryFn: async () => {
      const res = await fetch("/api/tips/search");
      return res.json();
    },
  });

  const feedItems: FeedItem[] = [
    ...tips.map((tip) => ({
      id: `tip-${tip.id}`,
      type: "tip" as const,
      title: tip.title,
      description: tip.content,
      category: tip.category,
      videoUrl: tip.videoUrl,
      thumbnailUrl: tip.thumbnailUrl,
      authorName: tip.authorName,
      linkUrl: `/tips/${tip.id}`,
    })),
    ...templates.map((template) => ({
      id: `template-${template.id}`,
      type: "template" as const,
      title: template.title,
      description: template.description,
      category: template.category,
      thumbnailUrl: template.thumbnailUrl,
      authorName: template.authorName,
      linkUrl: `/templates/${template.id}`,
      externalUrl: template.capcutUrl,
    })),
  ].sort(() => Math.random() - 0.5);

  const currentItem = feedItems[currentIndex];

  const goToNext = () => {
    if (currentIndex < feedItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        goToNext();
      } else if (e.key === "ArrowUp" || e.key === "k") {
        goToPrev();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m") {
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isPlaying, isMuted]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let endY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      endY = e.changedTouches[0].clientY;
      const diff = startY - endY;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToNext();
        } else {
          goToPrev();
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex]);

  if (feedItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading feed...</p>
      </div>
    );
  }

  const hasVideo = currentItem?.videoUrl?.startsWith("/objects");

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden pt-16"
      data-testid="feed-container"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem?.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              src={currentItem.videoUrl}
              className="w-full h-full object-contain"
              loop
              muted={isMuted}
              playsInline
              autoPlay
              onClick={togglePlay}
              data-testid="feed-video"
            />
          ) : currentItem?.thumbnailUrl ? (
            <img
              src={currentItem.thumbnailUrl}
              alt={currentItem.title}
              className="w-full h-full object-contain"
              data-testid="feed-image"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
              {currentItem?.type === "tip" ? (
                <Lightbulb className="w-24 h-24 text-primary/50" />
              ) : (
                <Layout className="w-24 h-24 text-primary/50" />
              )}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          <div className="absolute bottom-0 left-0 right-16 p-6 pb-24">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                currentItem?.type === "tip" 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
              }`}>
                {currentItem?.type === "tip" ? (
                  <><Lightbulb className="w-3 h-3 inline mr-1" /> Tip</>
                ) : (
                  <><Layout className="w-3 h-3 inline mr-1" /> Template</>
                )}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70">
                {currentItem?.category}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">
              {currentItem?.title}
            </h2>
            <p className="text-white/70 text-sm line-clamp-3 mb-3">
              {currentItem?.description}
            </p>

            {currentItem?.authorName && (
              <p className="text-purple-400 text-sm mb-4">
                by {currentItem.authorName}
              </p>
            )}

            <div className="flex gap-3">
              <Link href={currentItem?.linkUrl || "/"}>
                <Button size="sm" className="gap-2" data-testid="button-view-details">
                  View Details
                </Button>
              </Link>
              {currentItem?.externalUrl && (
                <a href={currentItem.externalUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline" className="gap-2" data-testid="button-open-capcut">
                    <ExternalLink className="w-4 h-4" />
                    Open in CapCut
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="absolute right-4 bottom-32 flex flex-col gap-6">
            {hasVideo && (
              <>
                <button
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                  data-testid="button-toggle-play"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>
                <button
                  onClick={toggleMute}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                  data-testid="button-toggle-mute"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </>
            )}
            <Link href={currentItem?.linkUrl || "/"}>
              <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
            </Link>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              data-testid="button-prev"
            >
              <ChevronUp className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex === feedItems.length - 1}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              data-testid="button-next"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
            {currentIndex + 1} / {feedItems.length}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs text-center">
        Swipe up/down or use arrow keys
      </div>
    </div>
  );
}
