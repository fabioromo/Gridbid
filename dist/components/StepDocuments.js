import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const LEVELS = [
    {
        key: "level1",
        badge: "Phase 1",
        title: "Erste Einsicht",
        description: "Erste Informationen für alle Interessenten",
        rule: "Freigabe nach Registrierung",
    },
    {
        key: "level2",
        badge: "Phase 2",
        title: "Vertiefte Prüfung",
        description: "Nur für ernsthafte Käufer nach erstem Gebot",
        rule: "Freigabe nach erstem Gebot",
    },
    {
        key: "level3",
        badge: "Phase 3",
        title: "Abschlussphase",
        description: "Nur für ausgewählte Käufer",
        rule: "Freigabe manuell durch dich",
    },
];
const StepDocuments = ({ documents, onChange, onBack, onNext, }) => {
    const [pendingAdd, setPendingAdd] = useState(null);
    function removeItem(key, index) {
        onChange({ ...documents, [key]: documents[key].filter((_, i) => i !== index) });
    }
    function startAdd(key) {
        setPendingAdd({ key, value: "" });
    }
    function confirmAdd() {
        if (!pendingAdd)
            return;
        const trimmed = pendingAdd.value.trim();
        if (trimmed) {
            onChange({
                ...documents,
                [pendingAdd.key]: [...documents[pendingAdd.key], trimmed],
            });
        }
        setPendingAdd(null);
    }
    function cancelAdd() {
        setPendingAdd(null);
    }
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "Welche Unterlagen erh\u00E4lt der K\u00E4ufer \u2014 und wann?" }), _jsx("p", { className: "mt-1.5 text-sm text-zinc-400", children: "Dokumente werden automatisch freigegeben, sobald der Interessent die jeweilige Phase erreicht." })] }), _jsx("div", { className: "flex flex-col gap-4", children: LEVELS.map(({ key, badge, title, description, rule }) => {
                    const isAdding = pendingAdd?.key === key;
                    return (_jsxs("div", { className: "rounded-lg border border-zinc-200 bg-white", children: [_jsxs("div", { className: "border-b border-zinc-100 px-5 py-4", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "rounded border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-500", children: badge }), _jsx("span", { className: "text-sm font-semibold text-zinc-900", children: title })] }), _jsx("span", { className: "shrink-0 text-xs text-zinc-400", children: rule })] }), _jsx("p", { className: "mt-1.5 text-xs text-zinc-500", children: description })] }), _jsxs("div", { className: "px-5 py-4", children: [_jsxs("div", { className: "flex flex-wrap gap-2", children: [documents[key].map((doc, i) => (_jsxs("span", { className: "flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700", children: [doc, _jsx("button", { onClick: () => removeItem(key, i), className: "ml-0.5 text-zinc-400 transition-colors hover:text-zinc-600", "aria-label": `${doc} entfernen`, children: "\u00D7" })] }, i))), isAdding ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { autoFocus: true, type: "text", value: pendingAdd.value, onChange: (e) => setPendingAdd({ key, value: e.target.value }), onKeyDown: (e) => {
                                                            if (e.key === "Enter")
                                                                confirmAdd();
                                                            if (e.key === "Escape")
                                                                cancelAdd();
                                                        }, placeholder: "Dokumentname\u2026", className: "rounded-md border border-gw-300 bg-white px-3 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-gw-400" }), _jsx("button", { onClick: confirmAdd, className: "rounded-md bg-gw-600 px-2.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gw-500", children: "Hinzuf\u00FCgen" }), _jsx("button", { onClick: cancelAdd, className: "text-xs text-zinc-400 transition-colors hover:text-zinc-600", children: "Abbrechen" })] })) : (_jsx("button", { onClick: () => startAdd(key), className: "flex items-center gap-1 rounded-md border border-dashed border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-300 hover:text-zinc-600", children: "+ Dokument hinzuf\u00FCgen" }))] }), documents[key].length === 0 && !isAdding && (_jsx("p", { className: "mt-2 text-xs text-zinc-400", children: "Noch keine Dokumente \u2014 optional" }))] })] }, key));
                }) }), _jsx("p", { className: "text-xs text-zinc-400", children: "Dokumente werden nach der Aktivierung in einem separaten Schritt hochgeladen." }), _jsxs("div", { className: "flex justify-between pt-2", children: [_jsx("button", { onClick: onBack, className: "rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-700", children: "Zur\u00FCck" }), _jsx("button", { onClick: onNext, className: "rounded-lg bg-gw-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gw-500", children: "Verfahren pr\u00FCfen \u2192" })] })] }));
};
export default StepDocuments;
