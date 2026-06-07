// Importation des bibliothèques nécessaires
import { useEffect, useState, type ReactNode } from "react";

// Définition des types pour les props du composant StageTransition
type StageTransitionProps = {
  stageKey: string;
  children: ReactNode;
};

// Durée de l'animation de transition en millisecondes
const STAGE_FADE_DURATION_MS = 320;

// Composant StageTransition qui effectue une transition fluide entre des étapes de contenu
export function StageTransition({ stageKey, children }: StageTransitionProps) {
  // État pour suivre la clé de l'étape à afficher
  const [displayedStageKey, setDisplayedStageKey] = useState(stageKey);
  
  // État pour stocker le contenu actuellement affiché
  const [displayedChildren, setDisplayedChildren] = useState(children);
  
  // État pour contrôler l'opacité de l'étape en cours d'affichage
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (stageKey === displayedStageKey) {
      setDisplayedChildren(children);
      return;
    }

    setOpacity(0);

    // Définir un délai pour basculer vers la nouvelle étape et le nouveau contenu
    const swapTimer = window.setTimeout(() => {
      setDisplayedStageKey(stageKey);
      setDisplayedChildren(children);

      // Utiliser requestAnimationFrame pour permettre une transition fluide de l'opacité à 1
      requestAnimationFrame(() => {
        setOpacity(1);
      });
    }, STAGE_FADE_DURATION_MS);

    // Nettoyer le délai lors du démontage ou lorsque les props changent
    return () => {
      window.clearTimeout(swapTimer);
    };
  }, [children, displayedStageKey, stageKey]);

  // Rendu du composant avec une transition fluide de l'opacité
  return (
    <section
      key={displayedStageKey}
      style={{
        ["--stage-fade-duration-ms" as string]: `${STAGE_FADE_DURATION_MS}ms`,
        opacity,
        transition: `opacity ${STAGE_FADE_DURATION_MS}ms ease`,
      }}
    >
      {displayedChildren}
    </section>
  );
}
