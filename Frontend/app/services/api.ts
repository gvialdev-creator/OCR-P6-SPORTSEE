// Configuration de base de l'API
const API_BASE_URL = "http://localhost:8000";
const USER_INFO_CACHE_TTL_MS = 30_000; // Durée de vie de la mise en cache des informations utilisateur (30 secondes)
const USER_ACTIVITY_CACHE_TTL_MS = 30_000; // Durée de vie de la mise en cache de l'activité utilisateur (30 secondes)

// Types pour les demandes et entrées de cache en cours
type UserInfoInflightRequest = {
  token: string;
  promise: Promise<any>;
};

type UserInfoCacheEntry = {
  token: string;
  data: any;
  expiresAt: number;
};

type UserActivityInflightRequest = {
  key: string;
  promise: Promise<any>;
};

type UserActivityCacheEntry = {
  key: string;
  data: any;
  expiresAt: number;
};

// Variables de cache
let userInfoInflightRequest: UserInfoInflightRequest | null = null;
let userInfoCache: UserInfoCacheEntry | null = null;
const userActivityInflightRequests = new Map<string, UserActivityInflightRequest>();
const userActivityCache = new Map<string, UserActivityCacheEntry>();

// Types d'interfaces pour les réponses et erreurs de l'API
export interface LoginResponse {
  token: string;
  userId: number;
}

export interface ErrorResponse {
  message: string;
}

// Classe d'erreur personnalisée pour les erreurs API
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Gestion du token d'authentification
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

const clearApiRequestCaches = (): void => {
  userInfoInflightRequest = null;
  userInfoCache = null;
  userActivityInflightRequests.clear();
  userActivityCache.clear();
};

const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("authToken", token);
  clearApiRequestCaches();
};

const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  clearApiRequestCaches();
};

export const clearStoredAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
  clearApiRequestCaches();
};

// Fonction générique de requête fetch avec gestion d'authentification
async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Ajout du token d'authentification si disponible
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Si le token est invalide ou expiré, effacer l'état d'authentification persistant
    if (response.status === 401 || response.status === 403) {
      clearStoredAuth();
    }

    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = (await response.json()) as ErrorResponse;
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}

// Méthodes de l'API
export const api = {
  /**
   * Connexion avec nom d'utilisateur et mot de passe
   * Retourne le token et l'ID utilisateur
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const data = await fetchWithAuth("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    
    // Stocker le token localement
    if (data.token) {
      setToken(data.token);
    }
    
    return data as LoginResponse;
  },

  /**
   * Déconnexion - effacer le token de stockage
   */
  logout: (): void => {
    removeToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("authUser");
    }
  },

  /**
   * Récupération des informations utilisateur (nécessite une authentification)
   */
  getUserInfo: async () => {
    const token = getToken();

    if (!token) {
      return fetchWithAuth("/api/user-info", {
        method: "GET",
      });
    }

    const now = Date.now();
    if (
      userInfoCache &&
      userInfoCache.token === token &&
      userInfoCache.expiresAt > now
    ) {
      return userInfoCache.data;
    }

    if (userInfoInflightRequest && userInfoInflightRequest.token === token) {
      return userInfoInflightRequest.promise;
    }

    const requestPromise = fetchWithAuth("/api/user-info", {
      method: "GET",
    })
      .then((data) => {
        userInfoCache = {
          token,
          data,
          expiresAt: Date.now() + USER_INFO_CACHE_TTL_MS,
        };
        return data;
      })
      .finally(() => {
        if (userInfoInflightRequest?.promise === requestPromise) {
          userInfoInflightRequest = null;
        }
      });

    userInfoInflightRequest = {
      token,
      promise: requestPromise,
    };

    return requestPromise;
  },

  /**
   * Récupération de l'activité utilisateur pour une période donnée (nécessite une authentification)
   */
  getUserActivity: async (startWeek: string, endWeek: string) => {
    const token = getToken() ?? "anonymous";
    const key = `${token}|${startWeek}|${endWeek}`;
    const now = Date.now();
    const cached = userActivityCache.get(key);

    if (cached && cached.expiresAt > now) {
      return cached.data;
    }

    const inflight = userActivityInflightRequests.get(key);
    if (inflight) {
      return inflight.promise;
    }

    const params = new URLSearchParams({
      startWeek,
      endWeek,
    });
    const requestPromise = fetchWithAuth(`/api/user-activity?${params.toString()}`, {
      method: "GET",
    })
      .then((data) => {
        userActivityCache.set(key, {
          key,
          data,
          expiresAt: Date.now() + USER_ACTIVITY_CACHE_TTL_MS,
        });
        return data;
      })
      .finally(() => {
        userActivityInflightRequests.delete(key);
      });

    userActivityInflightRequests.set(key, {
      key,
      promise: requestPromise,
    });

    return requestPromise;
  },

  /**
   * Requête GET générique avec authentification
   */
  get: async (endpoint: string) => {
    return fetchWithAuth(endpoint, {
      method: "GET",
    });
  },

  /**
   * Requête POST générique avec authentification
   */
  post: async (endpoint: string, data: any) => {
    return fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Requête PUT générique avec authentification
   */
  put: async (endpoint: string, data: any) => {
    return fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Requête DELETE générique avec authentification
   */
  delete: async (endpoint: string) => {
    return fetchWithAuth(endpoint, {
      method: "DELETE",
    });
  },
};

export default api;
