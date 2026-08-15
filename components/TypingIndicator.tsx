export function TypingIndicator() {
  return (
    <div
      className="flex items-center gap-2 text-sm text-muted"
      role="status"
      aria-live="polite"
    >
      <span className="flex gap-1" aria-hidden>
        <Dot delay="0ms" />
        <Dot delay="150ms" />
        <Dot delay="300ms" />
      </span>
      El sommelier está pensando…
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent"
      style={{ animationDelay: delay }}
    />
  );
}
