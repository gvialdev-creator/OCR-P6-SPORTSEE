import type { MockProfileData } from "../../model";

export const fetchMockProfileData = async (): Promise<MockProfileData> => {
  // Le mode mock charge un fichier statique local pour simuler la même structure que l'API.
  const response = await fetch("/data/mock.json");
  if (!response.ok) {
    throw new Error(`Impossible de charger les donnees mock (${response.status})`);
  }

  return (await response.json()) as MockProfileData;
};
