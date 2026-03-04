import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Video, Zap, Sparkles, ChevronRight, Move, Type, Palette, Volume2, Film } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TrendingSection } from "@/components/TrendingSection";
import type { Template } from "@shared/schema";
import editorMockupImg from "@assets/IMG_1931_1771962640643.png";

const SKILL_CATEGORIES = [
  { id: "all", label: "All Resources", icon: Sparkles, filter: "" },
  { id: "motion", label: "Motion", icon: Move, filter: "Transitions" },
  { id: "text", label: "Text Effects", icon: Type, filter: "Text Effects" },
  { id: "color", label: "Color Grading", icon: Palette, filter: "Color Grading" },
  { id: "sound", label: "Sound Design", icon: Volume2, filter: "Sound Design" },
  { id: "cinematic", label: "Cinematic", icon: Film, filter: "Cinematic" },
];

const SHOWCASE_ITEMS = [
  {
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&q=90",
    title: "CapCut Templates",
    description: "Ready-to-use viral templates",
    href: "/templates",
    cta: "Explore Templates",
  },
  {
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=90",
    title: "Editing Tips",
    description: "Professional techniques made simple",
    href: "/tips",
    cta: "Explore Tips",
  },
  {
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=90",
    title: "AI Video Ideas",
    description: "Fresh concepts powered by AI",
    href: "/generator",
    cta: "Explore Ideas",
  },
];

const BOTTOM_FEATURES = [
  {
    image: "https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=1200&q=90",
    title: "Community",
    description: "Join creators sharing their best work",
    href: "/submit",
    cta: "Discover Community",
  },
  {
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=90",
    title: "Trending",
    description: "See what's hot right now",
    href: "/templates",
    cta: "Explore Trending",
  },
];

const APP_LOGOS = [
  "TikTok",
  "CapCut",
  "Instagram Reels",
  "YouTube Shorts",
  "Adobe Premiere",
  "DaVinci Resolve",
  "Final Cut Pro",
  "After Effects",
  "Canva",
  "InShot",
];

function SectionDivider() {
  return <div className="section-divider max-w-6xl mx-auto" />;
}

function LogoMarquee() {
  const logos = [...APP_LOGOS, ...APP_LOGOS];
  return (
    <section className="py-14 overflow-hidden" data-testid="logo-marquee">
      <p className="text-center text-xs text-white/25 uppercase tracking-[0.25em] mb-8 font-medium">
        Works with your favorite apps
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee w-max">
          {logos.map((name, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 px-10 md:px-14 flex items-center"
            >
              <span className="text-lg md:text-xl font-display font-bold text-white/20 whitespace-nowrap tracking-wide">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ParallaxMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [8, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.5, 1]);

  return (
    <section ref={containerRef} className="py-24 overflow-hidden relative" data-testid="parallax-mockup">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-xs text-white/25 uppercase tracking-[0.25em] mb-3 font-medium">
            Professional editing tools
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
            Everything in one place.
          </h2>
        </motion.div>

        <motion.div
          style={{ scale, y, rotateX, opacity, perspective: 1200, transformStyle: "preserve-3d" }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            <div className="relative overflow-hidden" style={{ paddingTop: "56.25%" }}>
              <img
                src={editorMockupImg}
                alt="Video editing interface"
                className="absolute w-[104%] h-auto -left-[2%] animate-mockup-pan"
                style={{ top: "-12%", objectFit: "cover" }}
              />
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: "inset 0 0 40px 10px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-primary/5 to-transparent -z-10 blur-xl" />
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const { data: featuredTemplates, isLoading: featuredLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates/featured"],
  });

  const { data: popularTemplates, isLoading: popularLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates/popular"],
  });

  const isLoading = featuredLoading || popularLoading;
  const displayTemplates = (featuredTemplates?.length ? featuredTemplates : popularTemplates) || [];

  return (
    <div className="min-h-screen pt-16 overflow-hidden">
      <section className="relative min-h-[85vh] flex items-center justify-center" data-testid="hero-section">
        <div className="absolute inset-0 overflow-hidden">
          <video
            src="/hero-bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            data-testid="hero-video"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-left md:text-left w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight mb-4">
              Sweetening your edits<br />
              with free templates,<br />
              tips & ideas.
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-8 max-w-xl">
              The ultimate video editing resource for TikTok, Reels, and Shorts.
            </p>

            <Link
              href="/templates"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium text-base hover:bg-white/20 transition-all duration-300"
              data-testid="link-explore-templates"
            >
              Explore Templates
            </Link>
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      <section className="py-12" data-testid="category-tabs">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide snap-x snap-mandatory">
            {SKILL_CATEGORIES.map((cat, idx) => (
              <Link
                key={cat.id}
                href={cat.filter ? `/tips?category=${encodeURIComponent(cat.filter)}` : "/tips"}
              >
                <motion.div
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 hover:border-white/40 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-200 snap-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  data-testid={`skill-badge-${cat.id}`}
                >
                  {idx === 0 && <span className="text-white/40 mr-0.5">✓</span>}
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="py-10" data-testid="templates-carousel">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-white/50">
              {displayTemplates.length > 0
                ? `${displayTemplates.length} templates`
                : "Loading templates..."}
            </p>
            <div className="flex gap-2">
              <Link href="/templates" className="text-sm text-white/50 hover:text-white flex items-center gap-1 transition-colors" data-testid="link-view-all-templates">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-shrink-0 w-56 rounded-2xl bg-white/5 animate-pulse">
                  <div className="aspect-[4/3] rounded-t-2xl bg-white/5" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayTemplates.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/5 bg-white/[0.02]">
              <p className="text-white/40">No templates yet. Check back soon!</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {displayTemplates.map((template) => (
                <Link key={template.id} href={`/templates/${template.id}`}>
                  <motion.div
                    className="group flex-shrink-0 w-56 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/20 overflow-hidden cursor-pointer transition-all duration-300 snap-start"
                    whileHover={{ y: -4 }}
                    data-testid={`template-card-${template.id}`}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={template.thumbnailUrl || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80"}
                        alt={template.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-semibold text-white line-clamp-1 mb-1">
                        {template.title}
                      </h4>
                      <p className="text-xs text-white/40">
                        {template.category} · {template.views || 0} views
                      </p>
                      <ChevronRight className="w-4 h-4 text-white/20 mt-2 group-hover:text-white/60 transition-colors" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      <LogoMarquee />

      <SectionDivider />

      <ParallaxMockup />

      <SectionDivider />

      <section className="py-16" data-testid="showcase-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="text-sm text-white/40 mb-2 tracking-wide">Everything you need</p>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              Edit Hive begins here.<br />
              <span className="text-white/50">Explore resources available now.</span>
            </h2>
            <div className="flex gap-3 mt-6">
              <Link
                href="/templates"
                className="px-6 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm font-medium hover:bg-white/15 transition-all"
                data-testid="link-templates-cta"
              >
                Templates
              </Link>
              <Link
                href="/tips"
                className="px-6 py-2.5 rounded-full bg-white/10 border border-white/15 text-white text-sm font-medium hover:bg-white/15 transition-all"
                data-testid="link-tips-cta"
              >
                Tips & Tutorials
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SHOWCASE_ITEMS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={item.href}>
                  <div
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-white/15 transition-all duration-300"
                    data-testid={`showcase-card-${idx}`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/50 mb-4">{item.description}</p>
                      <span className="inline-flex items-center px-5 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium group-hover:bg-white/20 transition-all">
                        {item.cta}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="py-20" data-testid="features-section">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } }
            }}
          >
            <FeatureCard
              icon={<Video className="w-6 h-6 text-white/80" />}
              title="Free Templates"
              description="Grab ready-made CapCut templates. Just swap your clips and you're done."
              href="/templates"
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-white/80" />}
              title="AI-Powered Ideas"
              description="Stuck? Let AI give you fresh video ideas that match your style."
              href="/generator"
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-white/80" />}
              title="Pro Tips"
              description="Learn simple tricks to make your edits look professional."
              href="/tips"
            />
          </motion.div>
        </div>
      </section>

      <SectionDivider />

      <section className="py-16" data-testid="bottom-features">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BOTTOM_FEATURES.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={item.href}>
                  <div className="group cursor-pointer" data-testid={`bottom-feature-${idx}`}>
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 mb-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-1">
                      {item.title}
                    </h3>
                    <span className="text-sm text-white/50 group-hover:text-white/70 inline-flex items-center gap-1 transition-colors">
                      {item.cta} <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <TrendingSection />
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

function FeatureCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={href}>
        <div className="group p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer h-full">
          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5">
            {icon}
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/90 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-white/40 leading-relaxed">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
