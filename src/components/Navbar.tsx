import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-neutral-800 px-4 py-4 flex justify-between items-center">
      <Link href="/" className="font-semibold">
        VelvetVibe
      </Link>

      <div className="flex gap-4 text-sm">
        <Link href="/feed" className="hover:underline">
          Feed
        </Link>

        <Link href="/settings/profile" className="hover:underline">
          Edit Profile
        </Link>
      </div>
    </nav>
  );
}
