"use client";

export default function Button({
  children,
  loading,
  ...props
}: {
  children: React.ReactNode;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full py-3 rounded-md text-white font-medium transition ${
        props.disabled || loading
          ? "bg-neutral-700 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      } ${props.className}`}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}
