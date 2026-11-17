export function Logo({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <rect x="8" y="17" width="4" height="7" rx="1.5" fill="var(--accent-ink)" opacity="0.6" />
      <rect x="14" y="12" width="4" height="12" rx="1.5" fill="var(--accent-ink)" opacity="0.8" />
      <rect x="20" y="8" width="4" height="16" rx="1.5" fill="var(--accent-ink)" />
    </svg>
  );
}
