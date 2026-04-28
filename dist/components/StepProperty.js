import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
const MOCK_GRIDWORK_OBJECTS = [
    {
        id: "gw001",
        title: "Einfamilienhaus Küsnacht",
        address: "Seestrasse 85, 8700 Küsnacht",
        price: 2450000,
        status: "Aktiv",
        thumbColor: "from-blue-100 to-blue-200 text-blue-400",
        websiteUrl: "https://www.homegate.ch/kaufen/3001234567",
    },
    {
        id: "gw002",
        title: "4.5-Zi-Wohnung Zürich Seefeld",
        address: "Seefeldstrasse 112, 8008 Zürich",
        price: 1850000,
        status: "Aktiv",
        thumbColor: "from-emerald-100 to-emerald-200 text-emerald-400",
        websiteUrl: "https://www.immoscout24.ch/de/kaufen/4002345678",
    },
    {
        id: "gw003",
        title: "Maisonette Winterthur Altstadt",
        address: "Marktgasse 14, 8400 Winterthur",
        price: 980000,
        status: "Entwurf",
        thumbColor: "from-amber-100 to-amber-200 text-amber-400",
        websiteUrl: "https://www.homegate.ch/kaufen/3003456789",
    },
    {
        id: "gw004",
        title: "Terrassenwohnung Zug",
        address: "Baarerstrasse 21, 6300 Zug",
        price: 3200000,
        status: "Aktiv",
        thumbColor: "from-violet-100 to-violet-200 text-violet-400",
        websiteUrl: undefined,
    },
];
const chf = new Intl.NumberFormat("de-CH", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const HouseIcon = () => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-5 w-5", children: _jsx("path", { d: "M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z" }) }));
const StepProperty = ({ draft, onChange, onNext }) => {
    const [selectedId, setSelectedId] = useState(() => {
        if (!draft.title?.trim())
            return null;
        const match = MOCK_GRIDWORK_OBJECTS.find((o) => o.title === draft.title);
        return match ? match.id : "manual";
    });
    const [search, setSearch] = useState("");
    const filteredObjects = MOCK_GRIDWORK_OBJECTS.filter((o) => {
        const q = search.toLowerCase();
        return o.title.toLowerCase().includes(q) || o.address.toLowerCase().includes(q);
    });
    function handleSelectObject(obj) {
        setSelectedId(obj.id);
        onChange({ title: obj.title, address: obj.address, websiteUrl: obj.websiteUrl });
    }
    function handleSelectManual() {
        if (selectedId !== "manual") {
            setSelectedId("manual");
            onChange({ title: "", address: "", websiteUrl: undefined });
        }
    }
    const valid = selectedId !== null &&
        (selectedId !== "manual" || (draft.title?.trim().length ?? 0) > 0);
    const showNewCard = search === "" || "neues objekt erfassen".includes(search.toLowerCase());
    return (_jsxs("div", { className: "flex flex-col gap-6", children: [_jsx("h2", { className: "text-lg font-semibold text-zinc-900", children: "F\u00FCr welches Objekt m\u00F6chtest du ein Bieterverfahren starten?" }), _jsx("input", { type: "text", value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Objekt suchen \u2014 Adresse, Bezeichnung", className: "w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none" }), _jsxs("div", { className: "flex flex-col gap-3", children: [showNewCard && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: handleSelectManual, className: `flex items-center gap-4 rounded-lg border-2 border-dashed px-5 py-4 text-left transition-all ${selectedId === "manual"
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"}`, children: [_jsx("div", { className: `flex h-12 w-16 shrink-0 items-center justify-center rounded-md text-xl font-light ${selectedId === "manual"
                                            ? "bg-blue-100 text-blue-500"
                                            : "bg-zinc-100 text-zinc-400"}`, children: "+" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: `text-sm font-semibold ${selectedId === "manual" ? "text-blue-700" : "text-zinc-700"}`, children: "Neues Objekt erfassen" }), _jsx("p", { className: "mt-0.5 text-xs text-zinc-400", children: "Adresse und Details manuell eingeben" })] }), _jsx("span", { className: `flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selectedId === "manual" ? "border-blue-500" : "border-zinc-300"}`, children: selectedId === "manual" && (_jsx("span", { className: "h-2 w-2 rounded-full bg-blue-500" })) })] }), selectedId === "manual" && (_jsxs("div", { className: "flex flex-col gap-4 rounded-lg border border-blue-100 bg-blue-50/40 px-5 py-5", children: [_jsxs("div", { children: [_jsxs("label", { className: "mb-1.5 block text-sm font-medium text-zinc-700", children: ["Bezeichnung ", _jsx("span", { className: "text-red-500", children: "*" })] }), _jsx("input", { autoFocus: true, type: "text", value: draft.title ?? "", onChange: (e) => onChange({ title: e.target.value }), placeholder: "z. B. Einfamilienhaus Z\u00FCrich-Witikon", className: "w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1.5 block text-sm font-medium text-zinc-700", children: "Adresse" }), _jsx("input", { type: "text", value: draft.address ?? "", onChange: (e) => onChange({ address: e.target.value }), placeholder: "z. B. Musterstrasse 1, 8001 Z\u00FCrich", className: "w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "mb-1.5 block text-sm font-medium text-zinc-700", children: ["Link zur Vermarktung", " ", _jsx("span", { className: "font-normal text-zinc-400", children: "(optional)" })] }), _jsx("input", { type: "url", value: draft.websiteUrl ?? "", onChange: (e) => onChange({ websiteUrl: e.target.value || undefined }), placeholder: "z. B. https://www.homegate.ch/kaufen/\u2026", className: "w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none" }), _jsx("p", { className: "mt-1.5 text-xs text-zinc-400", children: "Wird Interessent:innen als Referenz angezeigt." })] })] }))] })), filteredObjects.map((obj) => {
                        const selected = selectedId === obj.id;
                        return (_jsxs("button", { onClick: () => handleSelectObject(obj), className: `flex items-center gap-4 rounded-lg border-2 px-5 py-4 text-left transition-all ${selected
                                ? "border-blue-500 bg-blue-50 shadow-sm"
                                : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"}`, children: [_jsx("div", { className: `flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-gradient-to-br ${obj.thumbColor}`, children: _jsx(HouseIcon, {}) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("p", { className: "truncate text-sm font-semibold text-zinc-900", children: obj.title }), _jsx("span", { className: `shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${obj.status === "Aktiv"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-zinc-100 text-zinc-500"}`, children: obj.status })] }), _jsx("p", { className: "mt-0.5 text-xs text-zinc-400", children: obj.address }), _jsxs("p", { className: "mt-1 text-xs font-medium text-zinc-500", children: ["CHF ", chf.format(obj.price)] })] }), _jsx("span", { className: `flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-blue-500" : "border-zinc-300"}`, children: selected && _jsx("span", { className: "h-2 w-2 rounded-full bg-blue-500" }) })] }, obj.id));
                    }), filteredObjects.length === 0 && !showNewCard && (_jsx("p", { className: "px-1 py-2 text-sm text-zinc-400", children: "Keine Objekte gefunden." }))] }), _jsx("div", { className: "flex justify-end pt-2", children: _jsx("button", { onClick: onNext, disabled: !valid, className: "rounded-lg bg-gw-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gw-500 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400", children: "Verfahren konfigurieren \u2192" }) })] }));
};
export default StepProperty;
