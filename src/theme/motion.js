/**
 * Material 3 motion tokens.
 * https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
 * Plus "expressive" spring approximations for playful spatial feedback.
 */
export const easing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
  standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  /** Slight overshoot, like an M3 Expressive fast spatial spring. */
  springFast: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  /** Softer overshoot for larger surfaces. */
  springDefault: 'cubic-bezier(0.34, 1.3, 0.64, 1)',
};

export const duration = {
  short1: 50,
  short2: 100,
  short3: 150,
  short4: 200,
  medium1: 250,
  medium2: 300,
  medium3: 350,
  medium4: 400,
  long1: 450,
  long2: 500,
  long3: 550,
  long4: 600,
};

/** Builds a `transition` value, e.g. `transition(['opacity', 'transform'], 'medium2')`. */
export function transition(props, time = 'short4', curve = 'standard') {
  const list = Array.isArray(props) ? props : [props];
  return list.map((p) => `${p} ${duration[time]}ms ${easing[curve]}`).join(', ');
}

/** M3 state-layer opacities used for hover/focus/press feedback. */
export const stateLayer = {
  hover: 0.08,
  focus: 0.1,
  pressed: 0.1,
  dragged: 0.16,
};
