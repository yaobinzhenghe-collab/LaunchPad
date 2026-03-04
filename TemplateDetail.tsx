import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Download, ExternalLink, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Comments } from "@/components/Comments";
import { StarRating } from "@/components/StarRating";
import { ShareButtons } from "@/components/ShareButtons";
import { LikeButton } from "@/components/LikeButton";
import type { Template } from "@shared/schema";

export default function TemplateDetail() {
  const params = useParams<{ id: string }>();
  const templateId = parseInt(params.id || "0");

  const { data: template, isLoading } = useQuery<Template>({
    queryKey: ["/api/templates", templateId],
    queryFn: async () => {
      const res = await fetch(`/api/templates/${templateId}`);
      if (!res.ok) throw new Error("Template not found");
      return res.json();
    },
    enabled: templateId > 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Template not found</h1>
        <Link href="/templates">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link href="/templates">
        <Button variant="ghost" className="gap-2 mb-6" data-testid="button-back-templates">
          <ArrowLeft className="h-4 w-4" />
          Back to Templates
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-8"
      >
        <div className="aspect-[9/16] relative rounded-2xl overflow-hidden bg-card border border-white/10">
          <img
            src={template.thumbnailUrl || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80"}
            alt={template.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-medium text-white border border-white/10">
              {template.category}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-white mb-4">{template.title}</h1>
          <p className="text-muted-foreground mb-6">{template.description}</p>

          <div className="mb-6">
            <StarRating templateId={templateId} />
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{(template.views || 0).toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span>{(template.downloads || 0).toLocaleString()} downloads</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={template.capcutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button size="lg" className="gap-2" data-testid="button-open-capcut">
                Open in CapCut
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
            <LikeButton type="template" id={templateId} likes={template.likes || 0} />
            <ShareButtons title={template.title} type="template" id={templateId} />
          </div>
        </div>
      </motion.div>

      <Comments templateId={templateId} />
    </div>
  );
}
