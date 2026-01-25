import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center mt-20 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to VelvetVibe</h1>
      <p className="text-gray-400 max-w-md mx-auto">
        A platform built for creators, authenticity, and expression.
      </p>

      <div className="space-x-4">
        <Link
          href="/auth/login"
          className="bg-blue-600 px-5 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Login
        </Link>

        <Link
          href="/auth/register"
          className="bg-neutral-800 px-5 py-3 rounded-lg hover:bg-neutral-700 transition font-medium border border-neutral-700"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
