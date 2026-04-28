import React from "react";
import { useGridbidUiStore } from "../store/gridbidUiStore";

const GridbidSidebar: React.ComponentType = () => {
  const view = useGridbidUiStore((s) => s.view);
  const navigate = useGridbidUiStore((s) => s.navigate);

  return (
    <nav className="flex flex-col gap-1 p-3">
      <button
        onClick={() => navigate("overview")}
        className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
          view === "overview"
            ? "bg-blue-50 text-blue-700"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <span className="text-base">▤</span>
        Übersicht
      </button>
      <button
        onClick={() => navigate("create")}
        className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${
          view === "create"
            ? "bg-blue-50 text-blue-700"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <span className="text-base">＋</span>
        Neues Verfahren
      </button>
    </nav>
  );
};

export default GridbidSidebar;
