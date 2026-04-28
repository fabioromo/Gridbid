import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGridbidUiStore } from "../store/gridbidUiStore";
const GridbidSidebar = () => {
    const view = useGridbidUiStore((s) => s.view);
    const navigate = useGridbidUiStore((s) => s.navigate);
    return (_jsxs("nav", { className: "flex flex-col gap-1 p-3", children: [_jsxs("button", { onClick: () => navigate("overview"), className: `flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${view === "overview"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`, children: [_jsx("span", { className: "text-base", children: "\u25A4" }), "\u00DCbersicht"] }), _jsxs("button", { onClick: () => navigate("create"), className: `flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors ${view === "create"
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`, children: [_jsx("span", { className: "text-base", children: "\uFF0B" }), "Neues Verfahren"] })] }));
};
export default GridbidSidebar;
