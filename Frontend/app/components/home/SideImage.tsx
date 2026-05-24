export function SideImage() {
  return (
    <aside className="relative min-h-[34vh] overflow-hidden md:min-h-screen">
      <img
        src="/images/runners.webp"
        alt="Coureur en action"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/30 via-transparent to-transparent" />
    </aside>
  );
}
