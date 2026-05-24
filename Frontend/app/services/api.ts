// API Configuration
const API_BASE_URL = "http://localhost:8000";

// Types
export interface LoginResponse {
  token: string;
  userId: number;
}

export interface ErrorResponse {
  message: string;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Token management
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

const setToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("authToken", token);
};

const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
};

export const clearStoredAuth = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};

// Generic fetch with auth
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

  // Add auth token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // If token is invalid or expired, clear persisted auth state.
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

// API Methods
export const api = {
  /**
   * Login with username and password
   * Returns token and userId
   */
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const data = await fetchWithAuth("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    
    // Store token locally
    if (data.token) {
      setToken(data.token);
    }
    
    return data as LoginResponse;
  },

  /**
   * Logout - clear token from storage
   */
  logout: (): void => {
    removeToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("authUser");
    }
  },

  /**
   * Fetch user info (requires authentication)
   */
  getUserInfo: async () => {
    return fetchWithAuth("/api/user-info", {
      method: "GET",
    });
  },

  /**
   * Fetch user activity for a date range (requires authentication)
   */
  getUserActivity: async (startWeek: string, endWeek: string) => {
    const params = new URLSearchParams({
      startWeek,
      endWeek,
    });
    return fetchWithAuth(`/api/user-activity?${params.toString()}`, {
      method: "GET",
    });
  },

  /**
   * Generic GET request with auth
   */
  get: async (endpoint: string) => {
    return fetchWithAuth(endpoint, {
      method: "GET",
    });
  },

  /**
   * Generic POST request with auth
   */
  post: async (endpoint: string, data: any) => {
    return fetchWithAuth(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Generic PUT request with auth
   */
  put: async (endpoint: string, data: any) => {
    return fetchWithAuth(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Generic DELETE request with auth
   */
  delete: async (endpoint: string) => {
    return fetchWithAuth(endpoint, {
      method: "DELETE",
    });
  },
};

export default api;
