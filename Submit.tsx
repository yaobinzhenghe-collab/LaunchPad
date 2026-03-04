import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, Lightbulb, Loader2, Send, Info, LogIn } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { VideoUploader } from "@/components/VideoUploader";

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

const templateCategories = ["Transitions", "Text Effects", "Intro/Outro", "Trending", "Aesthetic"];
const tipCategories = ["Transitions", "Text Effects", "Color Grading", "Motion Graphics", "Sound Design", "CapCut Basics"];

export default function Submit() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("template");

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

  const submitTemplate = useMutation({
    mutationFn: (data: TemplateFormData) => apiRequest("POST", "/api/community/templates", data),
    onSuccess: () => {
      templateForm.reset();
      toast({ 
        title: "Template submitted!", 
        description: "Your template is pending review. An admin will approve it soon." 
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to submit template.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const submitTip = useMutation({
    mutationFn: (data: TipFormData) => apiRequest("POST", "/api/community/tips", data),
    onSuccess: () => {
      tipForm.reset();
      toast({ 
        title: "Tip submitted!", 
        description: "Your tip is pending review. An admin will approve it soon." 
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to submit tip.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8 pb-8">
              <LogIn className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-6">
                Please log in to submit your templates and tips to the community.
              </p>
              <Button onClick={() => navigate("/api/login")} data-testid="button-login">
                Log In
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Submit Content</h1>
            <p className="text-muted-foreground">
              Share your CapCut templates and editing tips with the community
            </p>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    All submissions are reviewed by our team before being published. 
                    Make sure your content follows our community guidelines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="template" className="flex items-center gap-2" data-testid="tab-template">
                <Layout className="h-4 w-4" />
                Template
              </TabsTrigger>
              <TabsTrigger value="tip" className="flex items-center gap-2" data-testid="tab-tip">
                <Lightbulb className="h-4 w-4" />
                Tip
              </TabsTrigger>
            </TabsList>

            <TabsContent value="template">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Template</CardTitle>
                  <CardDescription>Share your CapCut template with the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...templateForm}>
                    <form onSubmit={templateForm.handleSubmit((data) => submitTemplate.mutate(data))} className="space-y-4">
                      <FormField
                        control={templateForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="My Awesome Template" {...field} data-testid="input-template-title" />
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
                              <Textarea 
                                placeholder="Describe what makes your template special..."
                                className="min-h-[100px]"
                                {...field}
                                data-testid="input-template-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={templateForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-template-category">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {templateCategories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
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
                                uploadEndpoint="/api/uploads/user-request-url"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={templateForm.control}
                        name="capcutUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CapCut Template URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://www.capcut.com/template/..." 
                                {...field}
                                data-testid="input-template-url"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={submitTemplate.isPending}
                        className="w-full"
                        data-testid="button-submit-template"
                      >
                        {submitTemplate.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Submit Template
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tip">
              <Card>
                <CardHeader>
                  <CardTitle>Submit a Tip</CardTitle>
                  <CardDescription>Share your editing knowledge with the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...tipForm}>
                    <form onSubmit={tipForm.handleSubmit((data) => submitTip.mutate(data))} className="space-y-4">
                      <FormField
                        control={tipForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="My Pro Editing Tip" {...field} data-testid="input-tip-title" />
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
                              <Textarea 
                                placeholder="Explain the tip in detail..."
                                className="min-h-[120px]"
                                {...field}
                                data-testid="input-tip-content"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={tipForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-tip-category">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tipCategories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
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
                            <FormLabel>Tutorial Video</FormLabel>
                            <FormControl>
                              <VideoUploader
                                value={field.value}
                                onChange={field.onChange}
                                uploadEndpoint="/api/uploads/user-request-url"
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
                            <FormLabel>Thumbnail (Optional)</FormLabel>
                            <FormControl>
                              <ImageUploader
                                value={field.value || ""}
                                onChange={field.onChange}
                                uploadEndpoint="/api/uploads/user-request-url"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={tipForm.control}
                        name="capcutEffects"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CapCut Effects Used (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Blur, Shake, Zoom (comma-separated)" 
                                {...field}
                                data-testid="input-tip-effects"
                              />
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
                            <FormLabel>After Effects Inspiration (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Motion blur, keyframe animation..." 
                                {...field}
                                data-testid="input-tip-ae"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={submitTip.isPending}
                        className="w-full"
                        data-testid="button-submit-tip"
                      >
                        {submitTip.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-2" />
                        )}
                        Submit Tip
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
