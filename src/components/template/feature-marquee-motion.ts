export const FEATURE_SPEED = 44;
export const FEATURE_HOVER_SPEED = 5;
export type MarqueeState = { offset: number; speed: number };

/** Distance-based motion: retiming hover never jumps to a new animation phase. */
export function advanceFeatureMarquee(state: MarqueeState, elapsedMs: number, period: number, hovered: boolean): MarqueeState {
  if (!Number.isFinite(period) || period <= 0) return state;
  const seconds = Number.isFinite(elapsedMs) ? Math.max(0, Math.min(elapsedMs, 64)) / 1000 : 0;
  const target = hovered ? FEATURE_HOVER_SPEED : FEATURE_SPEED;
  const decay = Math.exp(-seconds / .24);
  const speed = target + (state.speed - target) * decay;
  const distance = target * seconds + (state.speed - target) * .24 * (1 - decay);
  const offset = ((state.offset + distance) % period + period) % period;
  return { offset, speed };
}
