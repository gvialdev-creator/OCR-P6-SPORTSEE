import type { Route } from "./+types/home";
import { Formulaire } from "../components/home/Formulaire";
import { LogoFull } from "../components/logos/LogoFull";
import { SideImage } from "../components/home/SideImage";
import { Slogan } from "../components/home/Slogan";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home - SportSee" },
    { name: "description", content: "Page d'accueil SportSee" },
  ];
}


export default function Home() {
  return (
    <>
    <main className="home-shell">
      <div className="home-grid">
        <section className="home-left-column">
          <LogoFull />

          <div className="flex flex-1 items-center justify-center">
            <div className="home-auth-card">
              <h1 className="mb-10 text-[1.75rem] font-semibold leading-tight text-[var(--color-primary)]">
                Transformez
                <br />
                vos stats en resultats
              </h1>

              <h2 className="mb-7 text-[1.375rem] font-medium text-primary">
                Se connecter
              </h2>

              <Formulaire />
            </div>
          </div>

          <div className="mt-6 md:hidden">
            <Slogan />
          </div>
        </section>

        <SideImage />
      </div>

      <div className="pointer-events-none absolute bottom-6 right-6 hidden md:block">
        <Slogan />
      </div>
    </main>

    </>
  );
}
