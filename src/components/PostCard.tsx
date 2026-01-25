"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import type { Post } from "@/types/post";
import Comments from "@/components/Comments";

export default function PostCard({ post }: { post: Post }) {
  const [activeMedia, setActiveMedia] = useState(0);

  const media = post.media ?? [];
  const user = post.profiles;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 shadow-sm">
      {/* User info */}
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={user?.avatar_url || "/default-avatar.png"}
          width={40}
          height={40}
          alt="avatar"
          className="rounded-full object-cover"
        />

        <div>
        <a
        href={`/profile/${user?.username}`}
        className="font-medium hover:underline"
        >
         @{user?.username || "unknown"}
        </a>

          <span className="text-gray-500 text-xs">
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      {/* Text */}
      {post.text_content && (
        <p className="mb-3 text-gray-200 whitespace-pre-line">
          {post.text_content}
        </p>
      )}

      {/* Media */}
      {media.length > 0 && (
        <div className="relative border border-neutral-800 rounded-lg overflow-hidden mb-3">
          {media[activeMedia].media_type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media[activeMedia].url}
              className="w-full object-cover"
              alt="media"
            />
          ) : (
            <video
              className="w-full rounded-lg"
              controls
              preload="metadata"
              poster={media[activeMedia].thumbnail_url || undefined}
            >
              <source src={media[activeMedia].url} type="video/mp4" />
            </video>
          )}

          {media.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
              {media.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveMedia(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === activeMedia
                      ? "bg-white"
                      : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-400 text-sm pt-2 border-t border-neutral-800">
        <span>❤️ {post.likes?.length ?? 0}</span>
        <span>💬 {post.comments?.length ?? 0}</span>
      </div>

      {/* Comments */}
      <Comments postId={post.id} />
    </div>
  );
}
