import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function TemplateSkeletonCard() {
  return (
    <Card className="overflow-hidden" data-testid="skeleton-template-card">
      <div className="aspect-video relative">
        <Skeleton className="w-full h-full" />
      </div>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}

export function TipSkeletonCard() {
  return (
    <Card className="overflow-hidden" data-testid="skeleton-tip-card">
      <div className="aspect-video relative">
        <Skeleton className="w-full h-full" />
      </div>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </CardFooter>
    </Card>
  );
}

export function TemplateGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="skeleton-template-grid">
      {Array.from({ length: count }).map((_, i) => (
        <TemplateSkeletonCard key={i} />
      ))}
    </div>
  );
}

export function TipGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="skeleton-tip-grid">
      {Array.from({ length: count }).map((_, i) => (
        <TipSkeletonCard key={i} />
      ))}
    </div>
  );
}
