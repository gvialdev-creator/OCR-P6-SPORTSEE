import { useEffect, useRef, useState, type ReactNode } from "react";

type ChartSize = {
  width: number;
  height: number;
};

type MeasuredChartContainerProps = {
  className?: string;
  children: (size: ChartSize) => ReactNode;
};

export function MeasuredChartContainer({
  className = "",
  children,
}: MeasuredChartContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<ChartSize | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect();
      const nextWidth = Math.floor(width);
      const nextHeight = Math.floor(height);

      if (nextWidth > 0 && nextHeight > 0) {
        setSize({ width: nextWidth, height: nextHeight });
      }
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={containerRef} className={className}>{size ? children(size) : null}</div>;
}