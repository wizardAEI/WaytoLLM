import gsap from "gsap";

const ENTRY_DURATION = 0.62;
const ENTRY_BLUR = 8;
const ENTRY_EASE = "power2.out";

export function entryBlurIn(
  targets: string | Element | Element[],
  stagger = 0
): gsap.core.Tween {
  return gsap.fromTo(
    targets,
    { opacity: 0, filter: `blur(${ENTRY_BLUR}px)` },
    {
      opacity: 1,
      filter: "blur(0px)",
      duration: ENTRY_DURATION,
      stagger,
      ease: ENTRY_EASE,
    }
  );
}

export function entryBlurOut(
  targets: string | Element | Element[],
  stagger = 0
): gsap.core.Tween {
  return gsap.to(targets, {
    opacity: 0,
    filter: `blur(${ENTRY_BLUR}px)`,
    duration: ENTRY_DURATION * 0.55,
    stagger,
    ease: "power2.in",
  });
}
