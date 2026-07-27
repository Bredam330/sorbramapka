import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Login() {
  const [mode, setMode] = useState("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } =
      mode === "signIn"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🔧</span>
            <div>
              <h1 className="font-bold text-lg leading-none">SOR-BRAM</h1>
              <p className="text-xs text-neutral-400">Rejestr zleceń</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
          <input
            type="password"
            required
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-accent"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-orange-600 transition-colors rounded-lg py-2 font-medium disabled:opacity-50"
        >
          {loading ? "..." : mode === "signIn" ? "Zaloguj się" : "Utwórz konto"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
          className="w-full text-xs text-neutral-400 hover:text-neutral-200"
        >
          {mode === "signIn"
            ? "Pierwszy raz? Utwórz konto"
            : "Masz już konto? Zaloguj się"}
        </button>
      </form>
    </div>
  );
}
