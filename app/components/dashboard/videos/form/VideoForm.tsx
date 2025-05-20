"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVideo, updateVideo } from "@/app/lib/actions/videos";
import { Video, Article } from "@/app/lib/definition";
import VideoUpload from "./fields/VideoUpload";
import ArticleSelect from "./fields/ArticleSelect";
import DescriptionField from "./fields/DescriptionField";
import {
  showSuccessToast,
  showErrorToast,
} from "@/app/components/dashboard/shared/toast/Toast";
import { LoadingSpinner } from "@/app/components/dashboard/shared/loading-spinner";
import { uploadToCloudinary } from "@/app/lib/utils/cloudinaryUtils";

/**
 * Props interface for VideoForm component
 * @property video - Optional video data for edit mode
 * @property mode - Form mode: "create" or "edit"
 * @property articles - List of available articles for video association
 */
interface VideoFormProps {
  video?: Video;
  mode: "create" | "edit";
  articles: Article[];
}

/**
 * VideoForm Component
 * A form component for creating and editing videos with features for:
 * - Video file upload handling
 * - Article association
 * - Description management
 * - Form state tracking
 * - Error handling with toast notifications
 * - Responsive layout with consistent styling
 */
export default function VideoForm({ video, mode, articles }: VideoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    video_url: video?.video_url || "",
    article_id: video?.article_id || 0,
    description: video?.description || "",
  });

  // Check if form is empty
  const isFormEmpty = !formData.video_url && !selectedFile;

  /**
   * Form submission handler
   * Processes form data for both create and edit modes
   * Handles success/error notifications and navigation
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.article_id) {
        showErrorToast({ message: "Please select an article" });
        return;
      }

      if (!formData.video_url && !selectedFile) {
        showErrorToast({ message: "Please upload a video" });
        return;
      }

      let videoUrl = formData.video_url;

      // If there's a new file selected, upload it to Cloudinary
      if (selectedFile) {
        const result = await uploadToCloudinary(selectedFile, "video");
        if (!result.success || !result.url) {
          throw new Error(result.error || "Failed to upload video");
        }
        videoUrl = result.url.secure_url;
      }

      if (mode === "edit" && video) {
        // Check if there are any changes
        const hasChanges =
          formData.article_id !== video.article_id ||
          videoUrl !== video.video_url ||
          formData.description !== video.description;

        if (!hasChanges) {
          showSuccessToast({ message: "No changes to update" });
          router.back();
          return;
        }

        const success = await updateVideo(video.id, {
          ...formData,
          video_url: videoUrl,
        });

        if (success) {
          showSuccessToast({ message: "Video updated successfully" });
          router.refresh();
          router.back();
        } else {
          showErrorToast({ message: "Failed to update video" });
        }
      } else {
        const success = await createVideo({
          ...formData,
          video_url: videoUrl,
        });

        if (success) {
          showSuccessToast({ message: "Video created successfully" });
          router.refresh();
          router.back();
        } else {
          showErrorToast({ message: "Failed to create video" });
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      showErrorToast({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Article selection field */}
        <ArticleSelect
          value={formData.article_id}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, article_id: value || 0 }))
          }
          articles={articles}
        />

        {/* Video upload field */}
        <VideoUpload
          value={formData.video_url}
          onChange={setSelectedFile}
          selectedFile={selectedFile}
        />

        {/* Description field */}
        <DescriptionField
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
        />
      </div>

      {/* Form action buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || (!mode.includes("edit") && isFormEmpty)}
          className="inline-flex justify-center items-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <div className="mr-2">
                <LoadingSpinner />
              </div>
              {mode === "create" ? "Creating..." : "Updating..."}
            </>
          ) : mode === "create" ? (
            "Create Video"
          ) : (
            "Update Video"
          )}
        </button>
      </div>
    </form>
  );
}
