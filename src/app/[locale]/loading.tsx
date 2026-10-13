export default function Loading() {
  return (
    <div
      className="grid min-h-screen place-items-center bg-[#f7fcfb] text-[#073b4c]"
      role="status"
      aria-live="polite"
    >
      <span className="meta-label animate-pulse text-muted-foreground"><span className="rycode-brand-name">RYCODE</span> / LOADING</span>
    </div>
  );
}
