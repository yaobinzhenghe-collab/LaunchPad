import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Mail, Check, Loader2 } from "lucide-react";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export function NewsletterSignup() {
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const form = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (data: NewsletterFormData) => {
      const res = await apiRequest("POST", "/api/newsletter/subscribe", data);
      return res.json();
    },
    onSuccess: () => {
      setSubscribed(true);
      form.reset();
      toast({
        title: "Subscribed!",
        description: "You'll be the first to know when new templates drop.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Oops!",
        description: error.message || "Failed to subscribe. Try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: NewsletterFormData) => {
    subscribeMutation.mutate(data);
  };

  if (subscribed) {
    return (
      <div className="flex items-center gap-2 text-green-400" data-testid="text-newsletter-success">
        <Check className="w-5 h-5" />
        <span className="text-sm">You're subscribed!</span>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground"
                      data-testid="input-newsletter-email"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage data-testid="text-newsletter-error" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="sm"
            disabled={subscribeMutation.isPending}
            data-testid="button-newsletter-subscribe"
          >
            {subscribeMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground" data-testid="text-newsletter-hint">
          Get notified when I drop new templates
        </p>
      </form>
    </Form>
  );
}
