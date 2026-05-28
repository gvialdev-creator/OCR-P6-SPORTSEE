import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  className?: string;
  as?: "article" | "section" | "div";
};

export function DashboardCard({
  children,
  className = "",
  as = "section",
}: DashboardCardProps) {
  const Tag = as;

  return (
    <Tag className={`rounded-2xl ${className}`.trim()}>
      {children}
    </Tag>
  );
}
