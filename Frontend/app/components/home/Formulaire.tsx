import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { ApiError } from "../../services/api";

export function Formulaire() {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);

    if (!email || !password) {
      setError("Adresse email et mot de passe requis");
      return;
    }

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : "La connexion a echoue";
      setError(errorMessage);
    }
  };

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      {(error || authError) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error || authError}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="ds-input-label">
          Adresse email
        </label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isLoading}
          className="ds-input"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="ds-input-label">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isLoading}
          className="ds-input"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="app-btn-primary ds-btn ds-btn-primary"
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>

      <button
        type="button"
        className="text-sm font-medium text-gray-700 transition hover:text-blue-700"
      >
        Mot de passe oublie ?
      </button>
    </form>
  );
}
