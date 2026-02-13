
"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import supabaseBrowser from "@/lib/supabaseBrowser";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function CreatePostPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [text, setText] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function handleSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    
    // limit for sanity
    if (files.length + mediaFiles.length > 10) {
      return setError("Max 10 media files allowed.");
    }

    setMediaFiles((prev) => [...prev, ...files]);
  }

  async function handlePost() {
    if (!text && mediaFiles.length === 0) {
      return setError("Post cannot be empty.");
    }

    setError("");
    setUploading(true);

    // Step 1: create post row
    const { data: session } = await supabase.auth.getUser();
    if (!session?.user) return setError("Authentication failed.");

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        author_id: session.user.id,
        text_content: text,
        type: mediaFiles.length > 0 ? "mixed" : "text",
      })
      .select()
      .single();

    if (postError) {
      setUploading(false);
      return setError(postError.message);
    }

    // Step 2: upload media (videos+images)
    for (let i = 0; i < mediaFiles.length; i++) {
      const file = mediaFiles[i];
      const filePath = `${session.user.id}/${post.id}-${Date.now()}-${file.name}`;

      const { data: upload, error: uploadError } = await supabase.storage
        .from("post-media") // unified bucket
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) continue;

      const mediaType = file.type.startsWith("video")
        ? "video"
        : "image";

      await supabase.from("media").insert({
        post_id: post.id,
        url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-media/${filePath}`,
        media_type: mediaType,
        sort_order: i,
      });
    }

    setUploading(false);
    router.replace("/feed");
  }

  return (
    <div className="max-w-xl mx-auto bg-neutral-900 p-6 rounded-lg border border-neutral-800 mt-10 space-y-4">
      <textarea
        placeholder="Write something..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-neutral-800 p-3 rounded text-white outline-none resize-none h-32"
      />

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleSelectFiles}
        className="text-sm text-gray-400"
      />

      {mediaFiles.length > 0 && (
        <div className="text-gray-500 text-sm">
          {mediaFiles.length} file(s) selected
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button loading={uploading} onClick={handlePost}>
        Post
      </Button>
    </div>
  );
}
