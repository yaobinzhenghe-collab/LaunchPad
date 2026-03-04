import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Layout, Lightbulb, Users, ShieldAlert, ShieldCheck, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import type { Template, Tip } from "@shared/schema";

interface PendingData {
  templates: Template[];
  tips: Tip[];
}

interface User {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileImageUrl: string | null;
  isBanned: boolean;
  createdAt: string;
}

export default function AdminModeration() {
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: pendingData, isLoading: pendingLoading } = useQuery<PendingData>({
    queryKey: ["/api/admin/pending"],
    enabled: isAdmin,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin,
  });

  const approveTemplate = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/admin/templates/${id}/status`, { status: "approved" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Template approved", description: "The template is now visible to the public." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve template.", variant: "destructive" });
    },
  });

  const rejectTemplate = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/admin/templates/${id}/status`, { status: "rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
      toast({ title: "Template rejected", description: "The template has been rejected." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject template.", variant: "destructive" });
    },
  });

  const approveTip = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/admin/tips/${id}/status`, { status: "approved" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tips"] });
      toast({ title: "Tip approved", description: "The tip is now visible to the public." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve tip.", variant: "destructive" });
    },
  });

  const rejectTip = useMutation({
    mutationFn: (id: number) => apiRequest("PATCH", `/api/admin/tips/${id}/status`, { status: "rejected" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending"] });
      toast({ title: "Tip rejected", description: "The tip has been rejected." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject tip.", variant: "destructive" });
    },
  });

  const banUser = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/users/${id}/ban`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User banned", description: "The user can no longer submit content." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to ban user.", variant: "destructive" });
    },
  });

  const unbanUser = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/users/${id}/unban`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User unbanned", description: "The user can now submit content again." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to unban user.", variant: "destructive" });
    },
  });

  if (authLoading || pendingLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    navigate("/");
    return null;
  }

  const pendingTemplates = pendingData?.templates || [];
  const pendingTips = pendingData?.tips || [];
  const totalPending = pendingTemplates.length + pendingTips.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Moderation</h1>
            <p className="text-muted-foreground">Review community submissions and manage users</p>
          </div>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2" data-testid="tab-pending">
              <Layout className="h-4 w-4" />
              Pending
              {totalPending > 0 && (
                <Badge variant="destructive" className="ml-1">{totalPending}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2" data-testid="tab-users">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {totalPending === 0 ? (
              <Card>
                <CardContent className="pt-8 pb-8 text-center">
                  <Check className="h-16 w-16 mx-auto mb-4 text-green-500" />
                  <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">No pending submissions to review.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {pendingTemplates.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Layout className="h-5 w-5" />
                      Pending Templates ({pendingTemplates.length})
                    </h2>
                    <div className="grid gap-4">
                      {pendingTemplates.map((template) => (
                        <Card key={template.id} data-testid={`card-pending-template-${template.id}`}>
                          <CardContent className="pt-4">
                            <div className="flex gap-4">
                              {template.thumbnailUrl && (
                                <img 
                                  src={template.thumbnailUrl} 
                                  alt={template.title}
                                  className="w-32 h-20 object-cover rounded"
                                />
                              )}
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold">{template.title}</h3>
                                    <p className="text-sm text-muted-foreground">{template.description}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant="secondary">{template.category}</Badge>
                                      {template.authorName && (
                                        <span className="text-xs text-muted-foreground">by {template.authorName}</span>
                                      )}
                                    </div>
                                    {template.capcutUrl && (
                                      <a 
                                        href={template.capcutUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-2"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        View CapCut Link
                                      </a>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => approveTemplate.mutate(template.id)}
                                      disabled={approveTemplate.isPending}
                                      data-testid={`button-approve-template-${template.id}`}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => rejectTemplate.mutate(template.id)}
                                      disabled={rejectTemplate.isPending}
                                      data-testid={`button-reject-template-${template.id}`}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {pendingTips.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Pending Tips ({pendingTips.length})
                    </h2>
                    <div className="grid gap-4">
                      {pendingTips.map((tip) => (
                        <Card key={tip.id} data-testid={`card-pending-tip-${tip.id}`}>
                          <CardContent className="pt-4">
                            <div className="flex gap-4">
                              {tip.thumbnailUrl ? (
                                <img 
                                  src={tip.thumbnailUrl} 
                                  alt={tip.title}
                                  className="w-32 h-20 object-cover rounded"
                                />
                              ) : tip.videoUrl && tip.videoUrl.startsWith("/objects/") ? (
                                <video 
                                  src={`${tip.videoUrl}#t=0.5`}
                                  className="w-32 h-20 object-cover rounded"
                                />
                              ) : null}
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold">{tip.title}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{tip.content}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant="secondary">{tip.category}</Badge>
                                      {tip.authorName && (
                                        <span className="text-xs text-muted-foreground">by {tip.authorName}</span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => approveTip.mutate(tip.id)}
                                      disabled={approveTip.isPending}
                                      data-testid={`button-approve-tip-${tip.id}`}
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => rejectTip.mutate(tip.id)}
                                      disabled={rejectTip.isPending}
                                      data-testid={`button-reject-tip-${tip.id}`}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>Manage user access and bans</CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No users registered yet.</p>
                ) : (
                  <div className="space-y-3">
                    {users.map((u) => (
                      <div 
                        key={u.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                        data-testid={`user-row-${u.id}`}
                      >
                        <div className="flex items-center gap-3">
                          {u.profileImageUrl ? (
                            <img 
                              src={u.profileImageUrl} 
                              alt={u.username || "User"} 
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {(u.firstName?.[0] || u.username?.[0] || "U").toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {u.firstName && u.lastName 
                                ? `${u.firstName} ${u.lastName}` 
                                : u.username || "Unknown User"}
                            </p>
                            {u.email && <p className="text-xs text-muted-foreground">{u.email}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {u.isBanned ? (
                            <>
                              <Badge variant="destructive" className="flex items-center gap-1">
                                <ShieldAlert className="h-3 w-3" />
                                Banned
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => unbanUser.mutate(u.id)}
                                disabled={unbanUser.isPending}
                                data-testid={`button-unban-${u.id}`}
                              >
                                <ShieldCheck className="h-4 w-4 mr-1" />
                                Unban
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => banUser.mutate(u.id)}
                              disabled={banUser.isPending}
                              data-testid={`button-ban-${u.id}`}
                            >
                              <ShieldAlert className="h-4 w-4 mr-1" />
                              Ban
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
