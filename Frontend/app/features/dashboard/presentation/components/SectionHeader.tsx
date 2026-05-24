type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function SectionHeader({
  title,
  subtitle,
  titleClassName = "text-2xl font-semibold text-gray-900",
  subtitleClassName = "mt-1 text-sm text-gray-500",
}: SectionHeaderProps) {
  return (
    <header>
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </header>
  );
}
