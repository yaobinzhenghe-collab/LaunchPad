import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Trash2, Send, Loader2, Reply, CheckCircle } from "lucide-react";
import type { Comment } from "@shared/schema";

const commentSchema = z.object({
  authorName: z.string().min(1, "Name is required"),
  authorEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  content: z.string().min(1, "Comment is required").max(1000, "Comment too long"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentsProps {
  templateId?: number;
  tipId?: number;
}

export function Comments({ templateId, tipId }: CommentsProps) {
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const endpoint = templateId
    ? `/api/templates/${templateId}/comments`
    : `/api/tips/${tipId}/comments`;

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: [endpoint],
    enabled: !!(templateId || tipId),
  });

  const form = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      authorName: "",
      authorEmail: "",
      content: "",
    },
  });

  const addComment = useMutation({
    mutationFn: (data: CommentFormData) => apiRequest("POST", endpoint, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      form.reset();
      setShowForm(false);
      toast({ title: "Comment posted!", description: "Your comment has been added." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to post comment. Try again.", variant: "destructive" });
    },
  });

  const deleteComment = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/comments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      toast({ title: "Comment deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete comment.", variant: "destructive" });
    },
  });

  const replyToComment = useMutation({
    mutationFn: ({ id, reply }: { id: number; reply: string }) =>
      apiRequest("POST", `/api/comments/${id}/reply`, { reply }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoint] });
      setReplyingTo(null);
      setReplyContent("");
      toast({ title: "Reply posted!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to post reply.", variant: "destructive" });
    },
  });

  const handleReply = (commentId: number) => {
    if (replyContent.trim()) {
      replyToComment.mutate({ id: commentId, reply: replyContent.trim() });
    }
  };

  const onSubmit = (data: CommentFormData) => {
    addComment.mutate(data);
  };

  const formatDate = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} data-testid="button-add-comment">
            Add Comment
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border rounded-lg p-4 bg-muted/30"
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="authorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} data-testid="input-comment-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="authorEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (optional)</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="you@example.com" {...field} data-testid="input-comment-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comment</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Write your comment..." className="min-h-[80px]" {...field} data-testid="input-comment-content" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2">
                    <Button type="submit" disabled={addComment.isPending} className="gap-2" data-testid="button-submit-comment">
                      {addComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Post Comment
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => { setShowForm(false); form.reset(); }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 p-3 rounded-lg bg-muted/30"
                data-testid={`comment-${comment.id}`}
              >
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary text-sm">
                    {getInitials(comment.authorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{comment.authorName}</span>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!comment.adminReply && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => { setReplyingTo(comment.id); setReplyContent(""); }}
                            data-testid={`button-reply-comment-${comment.id}`}
                          >
                            <Reply className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => deleteComment.mutate(comment.id)}
                          disabled={deleteComment.isPending}
                          data-testid={`button-delete-comment-${comment.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-sm mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
                  
                  {comment.adminReply && (
                    <div className="mt-3 ml-4 pl-4 border-l-2 border-primary/50 bg-primary/5 rounded-r-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-primary">Edit Hive</span>
                        {comment.adminRepliedAt && (
                          <span className="text-xs text-muted-foreground">{formatDate(comment.adminRepliedAt)}</span>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{comment.adminReply}</p>
                    </div>
                  )}

                  {replyingTo === comment.id && (
                    <div className="mt-3 flex gap-2">
                      <Textarea
                        placeholder="Write your reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[60px] text-sm"
                        data-testid={`input-reply-${comment.id}`}
                      />
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          onClick={() => handleReply(comment.id)}
                          disabled={replyToComment.isPending || !replyContent.trim()}
                          data-testid={`button-submit-reply-${comment.id}`}
                        >
                          {replyToComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reply"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => { setReplyingTo(null); setReplyContent(""); }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
