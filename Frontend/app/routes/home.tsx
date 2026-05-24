import type { Route } from "./+types/home";
import { Formulaire } from "../components/home/Formulaire";
import { Logo } from "../components/home/Logo";
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
    <main className="home-shell">
      <div className="home-grid">
        <section className="home-left-column">
          <Logo />

          <div className="flex flex-1 items-center justify-center">
            <div className="home-auth-card">
              <h1 className="mb-6 text-5xl font-black leading-tight text-blue-700">
                Transformez
                <br />
                vos stats en resultats
              </h1>

              <h2 className="mb-7 text-4xl font-semibold text-gray-800">
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
  );
}
