import type { Metadata } from "next";

export const metadata: Metadata = { title: "Administration", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-full flex-1 bg-surface">{children}</div>;
}
