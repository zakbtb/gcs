import Link from "next/link";

export function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#0b1020" />
      <path d="M27.5 13.2A10 10 0 1 0 30 20h-9" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" />
      <circle cx="30" cy="20" r="3.2" fill="#f97316" />
      <circle cx="27.6" cy="13" r="2.2" fill="#22d3ee" />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5 rounded-lg" aria-label="GCS – Global Connect Services, retour à l'accueil">
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={`font-display text-xl font-bold tracking-tight ${dark ? "text-white" : "text-ink"}`}>GCS</span>
        <span className={`text-[0.68rem] font-medium tracking-wide ${dark ? "text-white/60" : "text-muted"}`}>Global Connect Services</span>
      </span>
    </Link>
  );
}
