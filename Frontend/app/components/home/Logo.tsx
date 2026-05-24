export function Logo() {
  return (
    <div className="ds-logo">
      <div className="ds-logo-mark" aria-hidden="true">
        <span className="h-2 w-0.5 rounded-full bg-red-500" />
        <span className="h-3.5 w-0.5 rounded-full bg-red-400" />
        <span className="h-4.5 w-0.5 rounded-full bg-blue-600" />
        <span className="h-3 w-0.5 rounded-full bg-red-400" />
      </div>
      <span className="ds-logo-text">SportSee</span>
    </div>
  );
}
