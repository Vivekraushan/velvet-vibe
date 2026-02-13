
import "./globals.css";
import Navbar from "@/components/Navbar";
import { SupabaseAuthProvider } from "@/lib/supabaseSessionProvider";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "VelvetVibe",
  description: "Connect. Create. Express.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
