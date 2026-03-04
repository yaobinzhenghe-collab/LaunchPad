import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function getVisitorId(): string {
  let visitorId = localStorage.getItem("edithive-visitor-id");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("edithive-visitor-id", visitorId);
  }
  return visitorId;
}

interface LikeButtonProps {
  type: "template" | "tip";
  id: number;
  likes: number;
  variant?: "default" | "compact";
}

export function LikeButton({ type, id, likes, variant = "default" }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setLikeCount(likes);
  }, [likes]);
  
  useEffect(() => {
    const checkFavorited = async () => {
      const visitorId = getVisitorId();
      try {
        const res = await fetch(`/api/favorites/check/${type}s/${id}?visitorId=${visitorId}`);
        const data = await res.json();
        setIsLiked(data.favorited);
      } catch (err) {
        console.error("Failed to check favorite status:", err);
      }
    };
    checkFavorited();
  }, [type, id]);
  
  const handleToggleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    const visitorId = getVisitorId();
    
    try {
      const res = await apiRequest("POST", `/api/favorites/${type}s/${id}`, { visitorId });
      const data = await res.json();
      
      setIsLiked(data.favorited);
      setLikeCount(prev => data.favorited ? prev + 1 : prev - 1);
      
      toast({
        title: data.favorited ? "Added to favorites" : "Removed from favorites",
        duration: 2000,
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tips"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/templates/search"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tips/search"] });
    } catch (err) {
      console.error("Failed to toggle like:", err);
      toast({
        title: "Failed to update",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);
  
  const triggerAnimation = () => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    setIsAnimating(true);
    animationTimerRef.current = setTimeout(() => setIsAnimating(false), 400);
  };
  
  const handleClick = async (e: React.MouseEvent) => {
    triggerAnimation();
    await handleToggleLike(e);
  };

  if (variant === "compact") {
    return (
      <motion.button
        onClick={handleClick}
        disabled={isLoading}
        className={`flex items-center gap-1 text-sm transition-colors ${
          isLiked ? "text-red-500" : "text-gray-400 hover:text-red-400"
        }`}
        data-testid={`button-like-${type}-${id}`}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={isAnimating ? {
            scale: [1, 1.4, 0.9, 1.15, 1],
            rotate: [0, -10, 10, -5, 0]
          } : {}}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </motion.div>
        <span>{likeCount.toLocaleString()}</span>
      </motion.button>
    );
  }
  
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        variant={isLiked ? "default" : "outline"}
        size="sm"
        onClick={handleClick}
        disabled={isLoading}
        className={`gap-2 ${isLiked ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}`}
        data-testid={`button-like-${type}-${id}`}
      >
        <motion.div
          animate={isAnimating ? {
            scale: [1, 1.4, 0.9, 1.15, 1],
            rotate: [0, -10, 10, -5, 0]
          } : {}}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
        </motion.div>
        <span>{likeCount.toLocaleString()}</span>
      </Button>
    </motion.div>
  );
}
