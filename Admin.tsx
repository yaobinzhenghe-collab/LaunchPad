import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Edit, Layout, Lightbulb, Loader2, Inbox, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { ImageUploader } from "@/components/ImageUploader";
import { VideoUploader } from "@/components/VideoUploader";
import type { Template, Tip } from "@shared/schema";

const templateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  thumbnailUrl: z.string().min(1, "Thumbnail is required"),
  capcutUrl: z.string().url("Must be a valid CapCut URL"),
});

const tipSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  videoUrl: z.string().min(1, "Video is required"),
  thumbnailUrl: z.string().optional(),
  capcutEffects: z.string().optional(),
  aeInspiration: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;
type TipFormData = z.infer<typeof tipSchema>;

export default function Admin() {
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [editingTip, setEditingTip] = useState<Tip | null>(null);

  const { data: templates = [], isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const { data: tips = [], isLoading: tipsLoading } = useQuery<Tip[]>({
    queryKey: ["/api/tips"],
  });

  const templateForm = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      thumbnailUrl: "",
      capcutUrl: "",
    },
  });

  const tipForm = useForm<TipFormData>({
    resolver: zodResolver(tipSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      videoUrl: "",
      thumbnailUrl: "",
      capcutEffects: "",
      aeInspiration: "",
    },
  });

  const createTemplate = useMutation({
    mutationFn: (data: TemplateFormData) => apiRequest("POST", "/api/templates", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      templateForm.reset();
      toast({ title: "Template added!", description: "Your template has been published." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add template. Make sure you're logged in as admin.", variant: "destructive" });
    },
  });

  const updateTemplate = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TemplateFormData> }) =>
      apiRequest("PATCH", `/api/templates/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      setEditingTemplate(null);
      templateForm.reset();
      toast({ title: "Template updated!", description: "Your changes have been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update template.", variant: "destructive" });
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({ title: "Template deleted", description: "The template has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete template.", variant: "destructive" });
    },
  });

  const createTip = useMutation({
    mutationFn: (data: TipFormData) => {
      const payload = {
        ...data,
        capcutEffects: data.capcutEffects ? data.capcutEffects.split(",").map((s) => s.trim()) : [],
      };
      return apiRequest("POST", "/api/tips", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tips"] });
      tipForm.reset();
      toast({ title: "Tip added!", description: "Your editing tip has been published." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add tip. Make sure you're logged in as admin.", variant: "destructive" });
    },
  });

  const updateTip = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TipFormData> }) => {
      const payload = {
        ...data,
        capcutEffects: data.capcutEffects ? data.capcutEffects.split(",").map((s) => s.trim()) : undefined,
      };
      return apiRequest("PATCH", `/api/tips/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tips"] });
      setEditingTip(null);
      tipForm.reset();
      toast({ title: "Tip updated!", description: "Your changes have been saved." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update tip.", variant: "destructive" });
    },
  });

  const deleteTip = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/tips/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tips"] });
      toast({ title: "Tip deleted", description: "The tip has been removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete tip.", variant: "destructive" });
    },
  });

  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    templateForm.reset({
      title: template.title,
      description: template.description,
      category: template.category,
      thumbnailUrl: template.thumbnailUrl,
      capcutUrl: template.capcutUrl,
    });
  };

  const handleEditTip = (tip: Tip) => {
    setEditingTip(tip);
    tipForm.reset({
      title: tip.title,
      content: tip.content,
      category: tip.category,
      videoUrl: tip.videoUrl,
      thumbnailUrl: tip.thumbnailUrl || "",
      capcutEffects: tip.capcutEffects?.join(", ") || "",
      aeInspiration: tip.aeInspiration || "",
    });
  };

  const onTemplateSubmit = (data: TemplateFormData) => {
    if (editingTemplate) {
      updateTemplate.mutate({ id: editingTemplate.id, data });
    } else {
      createTemplate.mutate(data);
    }
  };

  const onTipSubmit = (data: TipFormData) => {
    if (editingTip) {
      updateTip.mutate({ id: editingTip.id, data });
    } else {
      createTip.mutate(data);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardTitle className="mb-4">Admin Access Required</CardTitle>
          <p className="text-muted-foreground mb-4">Please log in to access the admin dashboard.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardTitle className="mb-4">Not Authorized</CardTitle>
          <p className="text-muted-foreground mb-4">You don't have permission to access the admin dashboard.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 font-heading">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your templates and editing tips</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/moderation">
                <Button variant="outline" className="gap-2" data-testid="button-moderation">
                  <ShieldCheck className="w-4 h-4" />
                  Moderation
                </Button>
              </Link>
              <Link href="/admin/inbox">
                <Button variant="outline" className="gap-2" data-testid="button-open-inbox">
                  <Inbox className="w-4 h-4" />
                  Message Inbox
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="templates" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="templates" className="gap-2" data-testid="tab-templates">
                <Layout className="h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="tips" className="gap-2" data-testid="tab-tips">
                <Lightbulb className="h-4 w-4" />
                Editing Tips
              </TabsTrigger>
            </TabsList>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingTemplate ? "Edit Template" : "Add New Template"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...templateForm}>
                    <form onSubmit={templateForm.handleSubmit(onTemplateSubmit)} className="space-y-4">
                      <FormField
                        control={templateForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Neon Velocity" {...field} data-testid="input-template-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={templateForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe your template..." {...field} data-testid="input-template-description" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={templateForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-template-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="TikTok">TikTok</SelectItem>
                                  <SelectItem value="Reels">Reels</SelectItem>
                                  <SelectItem value="Shorts">Shorts</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={templateForm.control}
                          name="thumbnailUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thumbnail</FormLabel>
                              <FormControl>
                                <ImageUploader
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Enter URL or upload an image"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={templateForm.control}
                        name="capcutUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CapCut Template Link</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.capcut.com/template/..." {...field} data-testid="input-template-capcut" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={createTemplate.isPending || updateTemplate.isPending} data-testid="button-save-template">
                          {(createTemplate.isPending || updateTemplate.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {editingTemplate ? "Update Template" : "Add Template"}
                        </Button>
                        {editingTemplate && (
                          <Button type="button" variant="outline" onClick={() => { setEditingTemplate(null); templateForm.reset(); }}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Templates ({templates.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {templatesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : templates.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No templates yet. Add your first one above!</p>
                  ) : (
                    <div className="space-y-3">
                      {templates.map((template) => (
                        <div key={template.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50" data-testid={`template-item-${template.id}`}>
                          <div className="flex items-center gap-4">
                            <img src={template.thumbnailUrl} alt={template.title} className="w-16 h-12 object-cover rounded" />
                            <div>
                              <h3 className="font-medium">{template.title}</h3>
                              <p className="text-sm text-muted-foreground">{template.category}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEditTemplate(template)} data-testid={`button-edit-template-${template.id}`}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteTemplate.mutate(template.id)} disabled={deleteTemplate.isPending} data-testid={`button-delete-template-${template.id}`}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingTip ? "Edit Tip" : "Add New Editing Tip"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...tipForm}>
                    <form onSubmit={tipForm.handleSubmit(onTipSubmit)} className="space-y-4">
                      <FormField
                        control={tipForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Smooth Zoom Transition" {...field} data-testid="input-tip-title" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={tipForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Explain the technique..." className="min-h-[120px]" {...field} data-testid="input-tip-content" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={tipForm.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-tip-category">
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Transitions">Transitions</SelectItem>
                                  <SelectItem value="Effects">Effects</SelectItem>
                                  <SelectItem value="Color Grading">Color Grading</SelectItem>
                                  <SelectItem value="Audio">Audio</SelectItem>
                                  <SelectItem value="Text & Titles">Text & Titles</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={tipForm.control}
                          name="videoUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Video/Tutorial</FormLabel>
                              <FormControl>
                                <VideoUploader
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Enter URL or upload a video"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={tipForm.control}
                          name="thumbnailUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Thumbnail (optional)</FormLabel>
                              <FormControl>
                                <ImageUploader
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  placeholder="Upload a cover image or leave blank"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={tipForm.control}
                        name="capcutEffects"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CapCut Effects (comma separated)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Zoom, Fade, Blur" {...field} data-testid="input-tip-effects" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={tipForm.control}
                        name="aeInspiration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>After Effects Inspiration (optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe the AE technique this is inspired by..." {...field} data-testid="input-tip-ae" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-2">
                        <Button type="submit" disabled={createTip.isPending || updateTip.isPending} data-testid="button-save-tip">
                          {(createTip.isPending || updateTip.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {editingTip ? "Update Tip" : "Add Tip"}
                        </Button>
                        {editingTip && (
                          <Button type="button" variant="outline" onClick={() => { setEditingTip(null); tipForm.reset(); }}>
                            Cancel
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Tips ({tips.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {tipsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : tips.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No tips yet. Add your first one above!</p>
                  ) : (
                    <div className="space-y-3">
                      {tips.map((tip) => (
                        <div key={tip.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50" data-testid={`tip-item-${tip.id}`}>
                          <div>
                            <h3 className="font-medium">{tip.title}</h3>
                            <p className="text-sm text-muted-foreground">{tip.category}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEditTip(tip)} data-testid={`button-edit-tip-${tip.id}`}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => deleteTip.mutate(tip.id)} disabled={deleteTip.isPending} data-testid={`button-delete-tip-${tip.id}`}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
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
    </div>
  );
}
