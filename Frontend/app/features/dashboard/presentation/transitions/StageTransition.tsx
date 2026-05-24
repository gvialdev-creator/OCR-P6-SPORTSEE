import type { ReactNode } from "react";

type StageTransitionProps = {
  stageKey: string;
  children: ReactNode;
};

export function StageTransition({ stageKey, children }: StageTransitionProps) {
  return <section key={stageKey}>{children}</section>;
}
