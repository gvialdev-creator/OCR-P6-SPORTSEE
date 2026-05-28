export function DashboardFooter() {
  return (
    <footer className="app-footer-bar mt-12 ">
        <div className="max-w-(--container-max) m-auto flex flex-wrap items-center justify-between gap-3 px-3 py-4 text-sm text-gray-600">
            <p>Sportsee Tous droits reserves</p>
            <div className="flex items-center gap-5">
                <button type="button" className="transition hover:text-primary">
                Conditions generales
                </button>
                <button type="button" className="transition hover:text-primary">
                Contact
                </button>
            </div>
        </div>
    </footer>
  );
}
