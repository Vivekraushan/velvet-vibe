/* ---------- Media ---------- */
export type MediaItem = {
  id: number;
  url: string;
  media_type: string;
  sort_order: number | null;
  thumbnail_url: string | null;
};

/* ---------- Profile ---------- */
export type Profile = {
  id: string;
  username: string;
  avatar_url: string | null;
};

/* ---------- Post ---------- */
export type Post = {
  id: number;
  text_content: string | null;
  type: string;
  created_at: string;
  profiles: Profile | null;
  media: MediaItem[];
  likes?: { user_id: string }[];
  comments?: { id: number }[];
};


