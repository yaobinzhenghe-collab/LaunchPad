import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Eye, Download, MessageCircle, Search, X, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { LikeButton } from "@/components/LikeButton";
import { PageWrapper } from "@/components/animations";
import type { Template } from "@shared/schema";

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08
    }
  }
};

// Card entrance + hover animation (Apple/Nike-style)
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
  },
  hover: { 
    y: -8,
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  tap: { 
    scale: 0.98,
    transition: { type: "spring", stiffness: 400, damping: 25 }
  }
};

const CATEGORIES = ["All", "TikTok", "Reels", "Shorts"];
const STYLES = ["All", "Transitions", "Text Effects", "Aesthetic", "Cinematic", "Trending", "Vintage"];

export default function Templates() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeStyle, setActiveStyle] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates/search", debouncedQuery, activeCategory, activeStyle],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedQuery) params.set("q", debouncedQuery);
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (activeStyle !== "All") params.set("style", activeStyle);
      const res = await fetch(`/api/templates/search?${params.toString()}`);
      return res.json();
    },
  });

  const clearFilters = () => {
    setActiveCategory("All");
    setActiveStyle("All");
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const hasActiveFilters = activeCategory !== "All" || activeStyle !== "All" || searchQuery;

  return (
    <PageWrapper className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          CapCut Templates
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Trending, viral-ready templates to speed up your workflow. 
          Just replace the clips and post.
        </p>
      </motion.div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
            data-testid="input-search-templates"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setDebouncedQuery(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
              data-testid="button-clear-search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground mr-2 self-center">Platform:</span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            data-testid={`filter-category-${cat.toLowerCase()}`}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
              ${activeCategory === cat
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                : "bg-transparent text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
              }
            `}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Styles */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <span className="text-sm text-muted-foreground mr-2 self-center">Style:</span>
        {STYLES.map((style) => (
          <button
            key={style}
            onClick={() => setActiveStyle(style)}
            data-testid={`filter-style-${style.toLowerCase().replace(" ", "-")}`}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border
              ${activeStyle === style
                ? "bg-secondary text-white border-secondary"
                : "bg-transparent text-muted-foreground border-white/10 hover:border-white/20 hover:text-white"
              }
            `}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="text-center mb-8">
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-white underline"
            data-testid="button-clear-filters"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="skeleton-template-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col bg-card rounded-2xl overflow-hidden border border-white/10">
              <Skeleton className="aspect-[9/16] w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between pt-4 border-t border-white/10">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : templates?.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
          <p className="text-muted-foreground">No templates found for this category yet.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {templates?.map((template) => (
            <Link href={`/templates/${template.id}`} key={template.id}>
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-white/10 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/20 cursor-pointer transition-[border-color,box-shadow] duration-300"
                data-testid={`template-card-${template.id}`}
              >
                <div className="aspect-[9/16] relative overflow-hidden bg-black/40">
                  <img
                    src={template.thumbnailUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80"}
                    alt={template.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-[opacity,transform] duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-medium text-white border border-white/10 group-hover:bg-primary/80 group-hover:border-primary transition-all duration-300">
                      {template.category}
                    </span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="px-6 py-3 rounded-xl bg-white text-black font-bold flex items-center gap-2 shadow-2xl scale-90 group-hover:scale-100 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      View Details <MessageCircle className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-4 flex-1 flex flex-col justify-end relative z-10 -mt-20">
                  <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                    {template.description}
                  </p>
                  {template.authorName && (
                    <p className="text-xs text-purple-400 mb-4">by {template.authorName}</p>
                  )}
                  {!template.authorName && <div className="mb-4" />}
                  <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{(template.views || 0).toLocaleString()}</span>
                      </div>
                      <LikeButton type="template" id={template.id} likes={template.likes || 0} variant="compact" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>{(template.downloads || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      )}
    </PageWrapper>
  );
}
