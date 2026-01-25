"use client";

import { useEffect, useState } from "react";
import supabaseBrowser from "@/lib/supabaseBrowser";


/* ---------- Types ---------- */
type CommentRow = {
  id: number;
  body: string;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};
/* --------------------------- */

export default function Comments({ postId }: { postId: number }) {
  const supabase = supabaseBrowser();

  const [comments, setComments] = useState<CommentRow[]>([]);
  const [text, setText] = useState("");

  /* ---------- Fetch comments ---------- */
  async function fetchComments() {
    const { data, error } = await supabase
      .from("comments")
      .select(`
        id,
        body,
        created_at,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .returns<CommentRow[]>();

    if (error) {
      console.error(error);
      return;
    }

    setComments(data ?? []);
  }

  /* ---------- Add comment ---------- */
  async function addComment() {
    if (!text.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      author_id: user.id,
      body: text,
    });

    if (error) {
      console.error(error);
      return;
    }

    setText("");
    fetchComments();
  }

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-3 space-y-3">
      {/* Existing comments */}
      {comments.map((c) => (
        <div key={c.id} className="flex gap-2 text-sm">
          <span className="font-medium">
            @{c.profiles?.username || "unknown"}
          </span>
          <span className="text-gray-300">{c.body}</span>
        </div>
      ))}

      {/* Input */}
      <div className="flex gap-2 mt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          className="flex-1 bg-neutral-800 rounded px-3 py-2 text-sm outline-none"
        />
        <button
          onClick={addComment}
          disabled={!text.trim()}
          className="text-blue-400 text-sm hover:underline disabled:text-gray-500"
        >
          Post
        </button>
      </div>
    </div>
  );
}
