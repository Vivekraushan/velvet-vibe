
import supabaseServer from "@/lib/supabaseServer";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import type { Post } from "@/types/post";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FeedPage() {
  const supabase = await supabaseServer();

  const { data: session } = await supabase.auth.getUser();

  if (!session?.user) {
    return (
      <div className="text-center mt-10 space-y-2">
        <p className="text-lg text-gray-400">
          You must be logged in to view the feed.
        </p>
        <Link
          href="/auth/login"
          className="text-blue-500 hover:underline text-sm"
        >
          Login
        </Link>
      </div>
    );
  }

  // 🔥 TYPE THE QUERY ITSELF (THIS IS THE FIX)
const { data, error } = await supabase
  .from("posts")
  .select(`
    id,
    text_content,
    type,
    created_at,
    profiles (
      id,
      username,
      avatar_url
    ),
    media (
      id,
      url,
      media_type,
      sort_order,
      thumbnail_url
    ),
    likes (
      user_id
    ),
    comments (
      id
    )
  `)
  .order("created_at", { ascending: false })
  .returns<Post[]>();



if (error) {
  return (
    <p className="text-center text-red-500 mt-10">
      {error.message}
    </p>
  );
}

const posts: Post[] = data ?? [];


  return (
    <div className="space-y-6 mt-6">
      {posts.length === 0 && (
        <p className="text-center text-gray-500">
          No posts yet. Create one!
        </p>
      )}

      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
