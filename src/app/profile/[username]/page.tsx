export const dynamic = "force-dynamic";
import supabaseServer from "@/lib/supabaseServer";
import Image from "next/image";
import PostCard from "@/components/PostCard";
import { notFound } from "next/navigation";

type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
};

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const supabase = await supabaseServer();

  // 1️⃣ Fetch profile by username
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, avatar_url, bio")
    .eq("username", params.username)
    .single<Profile>();

  if (!profile) {
    notFound();
  }

  // 2️⃣ Fetch posts by this user
  const { data: posts } = await supabase
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
      likes ( user_id ),
      comments ( id )
    `)
    .eq("author_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <Image
          src={profile.avatar_url || "/default-avatar.png"}
          width={80}
          height={80}
          alt="avatar"
          className="rounded-full object-cover"
        />

        <div>
          <h1 className="text-xl font-bold">@{profile.username}</h1>
          {profile.bio && (
            <p className="text-gray-400 text-sm mt-1">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* User posts */}
      <div className="space-y-6">
        {posts && posts.length === 0 && (
          <p className="text-gray-500">
            No posts yet.
          </p>
        )}

        {posts?.map((post) => (
          <PostCard key={post.id} post={post as any} />
        ))}
      </div>
    </div>
  );
}
