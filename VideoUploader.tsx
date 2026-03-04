import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Video, X, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  uploadEndpoint?: string;
}

export function VideoUploader({ value, onChange, placeholder = "Enter URL or upload a video", uploadEndpoint = "/api/uploads/admin-request-url" }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({ title: "Invalid file", description: "Please select a video file.", variant: "destructive" });
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select a video under 100MB.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const res = await apiRequest("POST", uploadEndpoint, {
        name: file.name,
        size: file.size,
        contentType: file.type,
      });
      const { uploadURL, objectPath } = await res.json() as { uploadURL: string; objectPath: string };

      setUploadProgress(30);

      await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      setUploadProgress(100);

      // objectPath already includes the /objects/ prefix from the API
      onChange(objectPath);
      toast({ title: "Upload complete!", description: "Video uploaded successfully." });
    } catch (error) {
      console.error("Upload error:", error);
      toast({ title: "Upload failed", description: "Could not upload the video. Try again.", variant: "destructive" });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isVideoUrl = value && (value.startsWith("/objects") || value.includes("youtube") || value.includes("vimeo") || value.startsWith("http"));

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
          data-testid="input-video-url"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="video/*"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          data-testid="button-upload-video"
        >
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            data-testid="button-clear-video"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isUploading && (
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-300" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {isVideoUrl && !isUploading && (
        <div className="relative w-full rounded-lg overflow-hidden bg-muted">
          {value.startsWith("/objects") ? (
            <video
              src={value}
              className="w-full max-h-48 object-contain"
              controls
              data-testid="video-preview"
            />
          ) : (
            <div className="flex items-center gap-3 p-4">
              <Video className="h-8 w-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">External Video</p>
                <p className="text-xs text-muted-foreground truncate">{value}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
