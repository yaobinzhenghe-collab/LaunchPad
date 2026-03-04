import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { TrendingUp, Heart, Eye, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Template, Tip } from "@shared/schema";

export function TrendingSection() {
  const { data: trendingTemplates, isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ["/api/trending/templates?limit=3"],
  });

  const { data: trendingTips, isLoading: tipsLoading } = useQuery<Tip[]>({
    queryKey: ["/api/trending/tips?limit=3"],
  });

  const isLoading = templatesLoading || tipsLoading;
  const hasContent = (trendingTemplates?.length || 0) > 0 || (trendingTips?.length || 0) > 0;

  if (!isLoading && !hasContent) return null;

  return (
    <section className="py-16 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm text-white/40 mb-1 tracking-wide">Popular right now</p>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Trending</h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {(trendingTemplates?.length || 0) > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold text-white/70">Templates</h3>
                  <Link href="/templates" className="text-sm text-white/40 hover:text-white flex items-center gap-1 transition-colors">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {trendingTemplates?.map((template, idx) => (
                    <motion.div
                      key={template.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <Link href={`/templates/${template.id}`}>
                        <div className="group rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer" data-testid={`trending-template-${template.id}`}>
                          <div className="aspect-video relative overflow-hidden">
                            <img
                              src={template.thumbnailUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80"}
                              alt={template.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1 border border-white/10">
                              <TrendingUp className="w-3 h-3" />
                              Hot
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-white text-sm group-hover:text-white/80 transition-colors line-clamp-1 mb-2">
                              {template.title}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-white/30">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {(template.likes || 0).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {(template.views || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {(trendingTips?.length || 0) > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-semibold text-white/70">Tips & Tutorials</h3>
                  <Link href="/tips" className="text-sm text-white/40 hover:text-white flex items-center gap-1 transition-colors">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {trendingTips?.map((tip, idx) => (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                    >
                      <Link href={`/tips/${tip.id}`}>
                        <div className="group rounded-2xl bg-white/[0.03] border border-white/8 overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer" data-testid={`trending-tip-${tip.id}`}>
                          <div className="aspect-video relative overflow-hidden">
                            {tip.thumbnailUrl ? (
                              <img
                                src={tip.thumbnailUrl}
                                alt={tip.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02]" />
                            )}
                            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1 border border-white/10">
                              <TrendingUp className="w-3 h-3" />
                              Hot
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-white text-sm group-hover:text-white/80 transition-colors line-clamp-1 mb-2">
                              {tip.title}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-white/30">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {(tip.likes || 0).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {(tip.views || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 flex justify-end">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm text-white/30 hover:text-white/60 flex items-center gap-2 transition-colors"
            data-testid="button-back-to-top"
          >
            Back to top <span className="text-lg">∧</span>
          </button>
        </div>
      </div>
    </section>
  );
}
