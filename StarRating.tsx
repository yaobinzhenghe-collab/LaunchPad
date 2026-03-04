import { useState } from "react";
import { Star } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StarRatingProps {
  templateId: number;
  readonly?: boolean;
}

export function StarRating({ templateId, readonly = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ratingData } = useQuery<{ average: number; count: number }>({
    queryKey: ["/api/templates", templateId, "rating"],
    queryFn: async () => {
      const res = await fetch(`/api/templates/${templateId}/rating`);
      return res.json();
    },
  });

  const rateMutation = useMutation({
    mutationFn: async (rating: number) => {
      const res = await apiRequest("POST", `/api/templates/${templateId}/rating`, { rating });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates", templateId, "rating"] });
      toast({
        title: "Thanks for rating!",
        description: "Your feedback helps other creators.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Couldn't rate",
        description: error.message || "You may have already rated this template.",
        variant: "destructive",
      });
    },
  });

  const handleRate = (rating: number) => {
    if (!readonly) {
      rateMutation.mutate(rating);
    }
  };

  const average = ratingData?.average || 0;
  const count = ratingData?.count || 0;
  const displayRating = hoverRating || Math.round(average);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`transition-all duration-150 ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !readonly && setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            disabled={readonly || rateMutation.isPending}
            data-testid={`button-star-${star}`}
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= displayRating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        ))}
        {count > 0 && (
          <span className="ml-2 text-sm text-muted-foreground">
            {average.toFixed(1)} ({count} {count === 1 ? "rating" : "ratings"})
          </span>
        )}
      </div>
      {!readonly && count === 0 && (
        <p className="text-xs text-muted-foreground">Be the first to rate this template</p>
      )}
    </div>
  );
}
