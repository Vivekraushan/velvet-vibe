"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default function PostCard({ post }: any) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl shadow-md hover:bg-neutral-850 transition">
      {/* User info */}
      <div className="flex items-center gap-3 mb-3">
        <Image
          src={post.profiles?.avatar_url || "/default-avatar.png"}
          width={40}
          height={40}
          alt="avatar"
          className="rounded-full object-cover"
        />

        <div>
          <p className="font-medium">{post.profiles?.username || "Unknown"}</p>
          <span className="text-gray-500 text-xs">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Post content */}
      <p className="mb-3 text-gray-200 whitespace-pre-line">{post.content}</p>

      {/* Optional image */}
      {post.image_url && (
        <div className="rounded-lg overflow-hidden border border-neutral-800 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image_url} alt="Post Image" className="w-full rounded-lg" />
        </div>
      )}

      {/* Post actions (likes/comments coming later) */}
      <div className="flex items-center gap-6 text-gray-400 text-sm pt-2 border-t border-neutral-800">
        <button className="hover:text-blue-400 transition">❤️ Like</button>
        <button className="hover:text-blue-400 transition">💬 Comment</button>
      </div>
    </div>
  );
}
