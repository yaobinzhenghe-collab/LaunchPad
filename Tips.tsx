import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link, useSearch } from "wouter";
import { Play, Sparkles, Wand2, MessageCircle, Search, X, Heart, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LikeButton } from "@/components/LikeButton";
import { PageWrapper } from "@/components/animations";
import type { Tip } from "@shared/schema";

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.28, ease: "easeOut" }
  }
};

const CATEGORIES = ["All", "Transitions", "Text Effects", "Color Grading", "Motion Graphics", "Sound Design", "Cinematic", "CapCut Basics"];

export default function Tips() {
  const searchString = useSearch();
  const urlParams = new URLSearchParams(searchString);
  const urlCategory = urlParams.get("category");
  
  const [activeCategory, setActiveCategory] = useState(() => {
    if (urlCategory && CATEGORIES.includes(urlCategory)) {
      return urlCategory;
    }
    return "All";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (urlCategory && CATEGORIES.includes(urlCategory)) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [searchQuery]);

  const { data: tips, isLoading } = useQuery<Tip[]>({
    queryKey: ["/api/tips/search", debouncedQuery, activeCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (activeCategory !== "All") params.set("category", activeCategory);
      const res = await fetch(`/api/tips/search?${params.toString()}`);
      return res.json();
    },
  });

  const clearFilters = () => {
    setActiveCategory("All");
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const hasActiveFilters = activeCategory !== "All" || searchQuery;

  return (
    <PageWrapper className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Editing Tips & Tutorials
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Learn how to create After Effects quality edits right inside CapCut.
        </p>
      </motion.div>

      <div className="mb-8 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search tips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-white/5 border-white/10"
            data-testid="input-search-tips"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
              }`}
              data-testid={`filter-category-${category.toLowerCase().replace(/ /g, "-")}`}
            >
              {category}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <div className="flex justify-center">
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-white flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8" data-testid="skeleton-tip-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="break-inside-avoid bg-card border border-white/10 rounded-2xl overflow-hidden">
              <Skeleton className="aspect-[9/16] w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : tips?.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No tips found matching your search.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-primary hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <motion.div 
          className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {tips?.map((tip) => (
            <Link href={`/tips/${tip.id}`} key={tip.id}>
              <motion.div
                variants={cardVariants}
                className="break-inside-avoid bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-pointer"
                data-testid={`tip-card-${tip.id}`}
              >
                <div className="aspect-[9/16] bg-black/50 relative group">
                  {tip.thumbnailUrl ? (
                    <img 
                      src={tip.thumbnailUrl} 
                      alt="Tutorial thumbnail"
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                  ) : tip.videoUrl.startsWith("/objects") ? (
                    <video
                      src={`${tip.videoUrl}#t=0.5`}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                      preload="metadata"
                      muted
                      playsInline
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/20 text-xs font-bold text-primary-foreground">
                    {tip.category}
                  </div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-medium text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageCircle className="w-3 h-3" />
                    View & Comment
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                    {tip.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-3">
                    {tip.content}
                  </p>
                  {tip.authorName && (
                    <p className="text-xs text-purple-400 mb-4">by {tip.authorName}</p>
                  )}
                  {!tip.authorName && <div className="mb-4" />}
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tip.capcutEffects?.slice(0, 3).map((effect, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-300 border border-white/5 flex items-center gap-1">
                        <Wand2 className="w-3 h-3 text-purple-400" />
                        {effect}
                      </span>
                    ))}
                    {(tip.capcutEffects?.length || 0) > 3 && (
                      <span className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400">
                        +{tip.capcutEffects!.length - 3} more
                      </span>
                    )}
                  </div>

                  {tip.aeInspiration && (
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-1 text-xs font-bold text-blue-400 uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        AE Inspiration
                      </div>
                      <p className="text-xs text-blue-200/80 italic line-clamp-2">
                        "{tip.aeInspiration}"
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </PageWrapper>
  );
}
