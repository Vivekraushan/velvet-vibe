"use client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { useEffect, useState } from "react";
import supabaseBrowser from "@/lib/supabaseBrowser";
import Image from "next/image";

export default function EditProfilePage() {
  const supabase = supabaseBrowser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  /* ---------- Load profile ---------- */
  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("username, bio, avatar_url")
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username);
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url);
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  /* ---------- Save profile ---------- */
  async function saveProfile() {
    setSaving(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    let newAvatarUrl = avatarUrl;

    // Upload avatar if changed
    if (file) {
      const path = `${user.id}/avatar-${Date.now()}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      newAvatarUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username,
        bio,
        avatar_url: newAvatarUrl,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
    }

    setSaving(false);
  }

  if (loading) {
    return <p className="text-gray-400">Loading profile…</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <h1 className="text-xl font-bold">Edit Profile</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Image
          src={avatarUrl || "/default-avatar.png"}
          width={80}
          height={80}
          alt="avatar"
          className="rounded-full object-cover"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm text-gray-400"
        />
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Username
        </label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-neutral-800 rounded px-3 py-2 outline-none"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full bg-neutral-800 rounded px-3 py-2 outline-none resize-none"
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        onClick={saveProfile}
        disabled={saving}
        className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-white disabled:bg-gray-600"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
