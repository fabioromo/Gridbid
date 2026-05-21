import React from "react";
import { createGridbidPlugin } from "../src/plugin";
import { useGridbidUiStore } from "../src/store/gridbidUiStore";

const plugin = createGridbidPlugin(); // uses mockGridbidService by default

const GridbidMain = plugin.main;

// ─── Agency shell ─────────────────────────────────────────────────────────────

const AgencyShell: React.FC = () => (
  <div className="flex h-screen flex-col overflow-hidden bg-white text-gray-900">
    <main className="flex-1 overflow-auto">
      <GridbidMain />
    </main>
  </div>
);

// ─── Buyer shell ──────────────────────────────────────────────────────────────

const BuyerShell: React.FC = () => (
  <div className="flex h-screen flex-col overflow-hidden bg-white text-gray-900">
    <main className="flex-1 overflow-auto">
      <GridbidMain />
    </main>
  </div>
);

// ─── App (shell router) ───────────────────────────────────────────────────────

const App: React.FC = () => {
  const mode = useGridbidUiStore((s) => s.mode);
  return mode === "buyer" ? <BuyerShell /> : <AgencyShell />;
};

export default App;
