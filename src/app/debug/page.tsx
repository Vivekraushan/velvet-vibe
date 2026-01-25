import supabaseServer from "@/lib/supabaseServer";

export default async function DebugPage() {
  const server = await supabaseServer();

  return (
    <pre style={{ padding: 20 }}>
      Debug page
    </pre>
  );
}

