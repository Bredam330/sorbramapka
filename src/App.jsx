import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Login from "./components/Login";
import RejestrZlecen from "./components/RejestrZlecen";
import Wyceny from "./components/Wyceny";
import Kalendarz from "./components/Kalendarz";
import Zapytania from "./components/Zapytania";
import CzesciZamienne from "./components/CzesciZamienne";
import Podsumowanie from "./components/Podsumowanie";

const TABS = [
  { id: "rejestr", label: "Rejestr zleceń" },
  { id: "podsumowanie", label: "Podsumowanie" },
  { id: "wyceny", label: "Wyceny" },
  { id: "kalendarz", label: "Kalendarz" },
  { id: "zapytania", label: "Zapytania" },
  { id: "czesci", label: "Części zamienne" },
];

export default function App() {
  const [session, setSession] = useState(undefined);
  const [tab, setTab] = useState("rejestr");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="min-h-screen bg-neutral-950" />;
  }

  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-24">
      <header
        className="border-b border-neutral-800 sticky top-0 bg-neutral-950/95 backdrop-blur z-10"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔧</span>
            <div>
              <h1 className="font-bold text-sm leading-none">SOR-BRAM</h1>
              <p className="text-[11px] text-neutral-400">Rejestr zleceń</p>
            </div>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            Wyloguj
          </button>
        </div>
        <nav className="max-w-3xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 transition-colors ${
                tab === t.id
                  ? "border-accent text-accent"
                  : "border-transparent text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4">
        {tab === "rejestr" && <RejestrZlecen />}
        {tab === "podsumowanie" && <Podsumowanie />}
        {tab === "wyceny" && <Wyceny />}
        {tab === "kalendarz" && <Kalendarz />}
        {tab === "zapytania" && <Zapytania />}
        {tab === "czesci" && <CzesciZamienne />}
      </main>
    </div>
  );
}
