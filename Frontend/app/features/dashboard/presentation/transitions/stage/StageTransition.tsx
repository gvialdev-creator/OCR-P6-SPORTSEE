import { useEffect, useState, type ReactNode } from "react";

type StageTransitionProps = {
  stageKey: string;
  children: ReactNode;
};

const STAGE_FADE_DURATION_MS = 320;

export function StageTransition({ stageKey, children }: StageTransitionProps) {
  const [displayedStageKey, setDisplayedStageKey] = useState(stageKey);
  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (stageKey === displayedStageKey) {
      setDisplayedChildren(children);
      return;
    }

    setOpacity(0);

    const swapTimer = window.setTimeout(() => {
      setDisplayedStageKey(stageKey);
      setDisplayedChildren(children);

      // Run on next frame so the new content fades in instead of appearing abruptly.
      requestAnimationFrame(() => {
        setOpacity(1);
      });
    }, STAGE_FADE_DURATION_MS);

    return () => {
      window.clearTimeout(swapTimer);
    };
  }, [children, displayedStageKey, stageKey]);

  return (
    <section
      key={displayedStageKey}
      style={{
        opacity,
        transition: `opacity ${STAGE_FADE_DURATION_MS}ms ease`,
      }}
    >
      {displayedChildren}
    </section>
  );
}
