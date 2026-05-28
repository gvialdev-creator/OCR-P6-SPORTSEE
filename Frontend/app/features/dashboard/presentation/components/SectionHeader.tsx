type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function SectionHeader({
  title,
  subtitle,
  titleClassName = "text-2xl font-semibold text-primary",
  subtitleClassName = "mt-1 text-sm text-[var(--color-text-soft)]",
}: SectionHeaderProps) {
  return (
    <header>
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </header>
  );
}
