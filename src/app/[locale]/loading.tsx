export default function Loading() {
  return (
    <div
      className="grid min-h-screen place-items-center bg-[#00364a] text-white"
      role="status"
      aria-live="polite"
    >
      <span className="meta-label animate-pulse text-[#5fe1d5]">RYCODE / LOADING</span>
    </div>
  );
}
