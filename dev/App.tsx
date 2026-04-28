import React from "react";
import { createGridbidPlugin } from "../src/plugin";
import { useGridbidUiStore } from "../src/store/gridbidUiStore";

const plugin = createGridbidPlugin(); // uses mockGridbidService by default

const GridbidSidebar = plugin.sidebar;
const GridbidMain = plugin.main;
const GridbidIcon = plugin.icon;

// ─── View switcher ────────────────────────────────────────────────────────────
// Dev/admin control — not part of the buyer product. Sits outside both shells.

const ViewSwitcher: React.FC = () => {
  const mode = useGridbidUiStore((s) => s.mode);
  const selectedBiddingId = useGridbidUiStore((s) => s.selectedBiddingId);
  const switchToBuyer = useGridbidUiStore((s) => s.switchToBuyer);
  const switchToAgency = useGridbidUiStore((s) => s.switchToAgency);

  // Buyer switch is only meaningful when a specific bidding is in context
  const canSwitchToBuyer = mode === "buyer" || selectedBiddingId !== null;

  function handleBuyerClick() {
    if (mode === "agency" && selectedBiddingId) switchToBuyer(selectedBiddingId);
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-xs font-medium">
      <button
        onClick={switchToAgency}
        className={`rounded-md px-3 py-1.5 transition-colors ${
          mode === "agency"
            ? "bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        Agenturansicht
      </button>
      <button
        onClick={handleBuyerClick}
        disabled={!canSwitchToBuyer}
        className={`rounded-md px-3 py-1.5 transition-colors ${
          mode === "buyer"
            ? "bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200"
            : canSwitchToBuyer
            ? "text-gray-400 hover:text-gray-600"
            : "cursor-not-allowed text-gray-200"
        }`}
      >
        Käuferansicht
      </button>
    </div>
  );
};

// ─── Agency shell ─────────────────────────────────────────────────────────────
// Full seller layout: sidebar nav + topbar with switcher + scrollable main.

const AgencyShell: React.FC = () => (
  <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
    {/* Sidebar */}
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
        <span className="text-violet-500">
          <GridbidIcon />
        </span>
        <span className="text-sm font-semibold tracking-tight text-gray-900">
          {plugin.name}
        </span>
        <span className="ml-auto rounded bg-violet-50 px-1.5 py-0.5 text-xs font-medium text-violet-600 ring-1 ring-violet-200">
          dev
        </span>
      </div>
      <GridbidSidebar />
    </aside>

    {/* Main column */}
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-shrink-0 items-center justify-end border-b border-gray-100 bg-white px-4 py-2">
        <ViewSwitcher />
      </div>
      <main className="flex-1 overflow-auto">
        <GridbidMain />
      </main>
    </div>
  </div>
);

// ─── Buyer shell ──────────────────────────────────────────────────────────────
// Standalone buyer layout: no seller sidebar. Switcher bar at top-right is the
// only dev chrome — the rest is pure buyer product surface.

const BuyerShell: React.FC = () => (
  <div className="flex h-screen flex-col overflow-hidden bg-gray-50 text-gray-900">
    <div className="flex flex-shrink-0 items-center justify-end border-b border-gray-100 bg-white px-4 py-2">
      <ViewSwitcher />
    </div>
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
