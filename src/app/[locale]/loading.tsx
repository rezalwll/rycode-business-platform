export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
      <span className="meta-label animate-pulse text-muted-foreground">RYCODE / LOADING</span>
    </div>
  );
}
