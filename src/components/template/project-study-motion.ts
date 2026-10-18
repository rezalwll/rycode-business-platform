export const projectStudyGap = 20;

// Overdamped: filter wheel steps and settle gently without a rubbery bounce.
// Keep native page scrolling; this follows only the three showcase cards.
export const projectStudySpring = {
  stiffness: 120,
  damping: 28,
  mass: 1,
  restSpeed: .001,
  restDelta: .0001,
  skipInitialAnimation: true,
} as const;

/** Reference landmarks: entry at viewport bottom, flat when this card's
 * bottom reaches viewport bottom, exit when the next card reaches that point.
 * A symmetric [0, .5, 1] viewport mapping misses both of the latter landmarks.
 */
export function projectStudyPhase(progress: number, viewport: number, height: number, gap = projectStudyGap): number {
  if (!Number.isFinite(progress) || !Number.isFinite(viewport) || !Number.isFinite(height) || viewport <= 0 || height <= 0) return 0;
  const travel = Math.max(0, Math.min(1, progress)) * (viewport + height);
  const phase = travel <= height ? travel / height - 1 : (travel - height) / (height + Math.max(0, gap));
  return Math.max(-1, Math.min(1, phase));
}
