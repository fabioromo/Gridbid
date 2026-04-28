import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { PriceDisplay, ProcessType } from "../types/domain";
const PRESETS = [
    {
        id: "standard",
        label: "Standard",
        badge: "Empfohlen",
        summary: "Verdeckt · 1 Runde · Kein Preis",
        config: {
            processType: ProcessType.SEALED_BID,
            roundsPlanned: 1,
            priceDisplay: PriceDisplay.HIDDEN,
            deadline: null,
        },
    },
    {
        id: "preisgeführt",
        label: "Preisgeführt",
        summary: "Verdeckt · 1 Runde · Richtpreis",
        config: {
            processType: ProcessType.SEALED_BID,
            roundsPlanned: 1,
            priceDisplay: PriceDisplay.PRICE,
            deadline: null,
        },
    },
    {
        id: "mehrstufig",
        label: "Mehrstufig",
        summary: "Verdeckt · 2 Runden · Kein Preis",
        config: {
            processType: ProcessType.SEALED_BID,
            roundsPlanned: 2,
            priceDisplay: PriceDisplay.HIDDEN,
            deadline: null,
        },
    },
];
function detectPreset(draft) {
    const pt = draft.processType ?? ProcessType.SEALED_BID;
    const r = draft.roundsPlanned ?? 1;
    const pd = draft.priceDisplay ?? PriceDisplay.HIDDEN;
    if (pt === ProcessType.SEALED_BID && r === 1 && pd === PriceDisplay.HIDDEN)
        return "standard";
    if (pt === ProcessType.SEALED_BID && r === 1 && pd === PriceDisplay.PRICE)
        return "preisgeführt";
    if (pt === ProcessType.SEALED_BID && r === 2 && pd === PriceDisplay.HIDDEN)
        return "mehrstufig";
    return null;
}
const PROCESS_OPTIONS = [
    {
        value: ProcessType.SEALED_BID,
        label: "Verdeckt",
        description: "Gebote bleiben bis Fristablauf vertraulich — Standard in der Schweiz.",
        badge: "Empfohlen",
    },
    {
        value: ProcessType.OPEN_BID,
        label: "Offen",
        description: "Der aktuelle Höchststand ist für alle Interessent:innen sichtbar.",
        badge: null,
    },
];
const PRICE_OPTIONS = [
    {
        value: PriceDisplay.HIDDEN,
        label: "Kein Preis",
        description: "Stärkt echte Marktpreisfindung",
    },
    {
        value: PriceDisplay.PRICE,
        label: "Richtpreis",
        description: "Gibt Orientierung",
    },
    {
        value: PriceDisplay.RANGE,
        label: "Preisspanne",
        description: "Definiert Erwartungsbereich",
    },
];
const ChevronIcon = ({ open }) => (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor", className: `h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`, children: _jsx("path", { fillRule: "evenodd", d: "M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z", clipRule: "evenodd" }) }));
const StepProcess = ({ draft, onChange, onBack, onNext }) => {
    const [guidePrice, setGuidePrice] = useState("");
    const [priceRangeMin, setPriceRangeMin] = useState("");
    const [priceRangeMax, setPriceRangeMax] = useState("");
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [showNotes, setShowNotes] = useState(!!(draft.biddingRules?.trim()));
    const activePreset = detectPreset(draft);
    const deadlineEnabled = draft.deadline !== null && draft.deadline !== undefined;
    const rounds = draft.roundsPlanned ?? 1;
    const priceDisplay = draft.priceDisplay ?? PriceDisplay.HIDDEN;
    function applyPreset(preset) {
        onChange(preset.config);
        setShowAdvanced(false);
    }
    function handleDeadlineToggle(enabled) {
        if (enabled) {
            const d = new Date();
            d.setDate(d.getDate() + 14);
            d.setHours(17, 0, 0, 0);
            onChange({ deadline: d.toISOString() });
        }
        else {
            onChange({ deadline: null });
        }
    }
    return (_jsxs("div", { className: "flex flex-col gap-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "mb-1 text-lg font-semibold text-zinc-900", children: "Vorlage w\u00E4hlen" }), _jsx("p", { className: "mb-4 text-sm text-zinc-500", children: "W\u00E4hle eine Vorlage \u2014 du kannst alle Einstellungen anpassen." }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: PRESETS.map((preset) => {
                            const selected = activePreset === preset.id;
                            return (_jsxs("button", { onClick: () => applyPreset(preset), className: `flex flex-col gap-2 rounded-lg border-2 px-4 py-4 text-left transition-all ${selected
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-sm font-semibold ${selected ? "text-blue-700" : "text-zinc-800"}`, children: preset.label }), preset.badge && (_jsx("span", { className: "rounded border border-gw-200 bg-gw-50 px-1.5 py-0.5 text-xs font-medium text-gw-600", children: preset.badge }))] }), _jsx("p", { className: "text-xs text-zinc-400", children: preset.summary }), _jsx("span", { className: `mt-1 flex h-4 w-4 items-center justify-center rounded-full border-2 ${selected ? "border-blue-500" : "border-zinc-300"}`, children: selected && _jsx("span", { className: "h-2 w-2 rounded-full bg-blue-500" }) })] }, preset.id));
                        }) })] }), _jsxs("div", { className: "rounded-lg border border-zinc-200 bg-white", children: [_jsxs("button", { onClick: () => setShowAdvanced(!showAdvanced), className: "flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-zinc-50", children: [_jsx("span", { className: "text-sm font-medium text-zinc-700", children: "Weitere Einstellungen anpassen" }), _jsx(ChevronIcon, { open: showAdvanced })] }), showAdvanced && (_jsxs("div", { className: "flex flex-col gap-6 border-t border-zinc-100 px-5 pb-6 pt-5", children: [_jsxs("div", { children: [_jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400", children: "Verfahren" }), _jsx("div", { className: "flex flex-col gap-2", children: PROCESS_OPTIONS.map(({ value, label, description, badge }) => {
                                            const selected = (draft.processType ?? ProcessType.SEALED_BID) === value;
                                            return (_jsxs("button", { onClick: () => onChange({ processType: value }), className: `flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors ${selected
                                                    ? "border-blue-200 bg-blue-50"
                                                    : "border-zinc-200 bg-white hover:border-zinc-300"}`, children: [_jsx("span", { className: `mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-blue-500" : "border-zinc-300"}`, children: selected && _jsx("span", { className: "h-2 w-2 rounded-full bg-blue-500" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-sm font-medium ${selected ? "text-zinc-900" : "text-zinc-700"}`, children: label }), badge && (_jsx("span", { className: "rounded border border-gw-200 bg-gw-50 px-1.5 py-0.5 text-xs font-medium text-gw-600", children: badge }))] }), _jsx("p", { className: `mt-0.5 text-xs ${selected ? "text-zinc-600" : "text-zinc-400"}`, children: description })] })] }, value));
                                        }) })] }), _jsxs("div", { children: [_jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400", children: "Runden" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center rounded-lg border border-zinc-200 bg-white", children: [_jsx("button", { onClick: () => onChange({ roundsPlanned: Math.max(1, rounds - 1) }), disabled: rounds <= 1, className: "flex h-9 w-9 items-center justify-center rounded-l-lg text-zinc-500 transition-colors hover:bg-zinc-50 disabled:text-zinc-300", children: "\u2212" }), _jsx("span", { className: "flex h-9 w-10 items-center justify-center border-x border-zinc-200 text-sm font-semibold text-zinc-900 tabular-nums", children: rounds }), _jsx("button", { onClick: () => onChange({ roundsPlanned: Math.min(4, rounds + 1) }), disabled: rounds >= 4, className: "flex h-9 w-9 items-center justify-center rounded-r-lg text-zinc-500 transition-colors hover:bg-zinc-50 disabled:text-zinc-300", children: "+" })] }), _jsx("p", { className: "text-sm text-zinc-500", children: rounds === 1
                                                    ? "Meist reicht eine Runde."
                                                    : "Weitere Runden startest du manuell nach Runde 1." })] })] }), _jsxs("div", { children: [_jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400", children: "Frist" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm font-medium text-zinc-700", children: "Angebotsfrist setzen" }), _jsx("button", { role: "switch", "aria-checked": deadlineEnabled, onClick: () => handleDeadlineToggle(!deadlineEnabled), className: `relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${deadlineEnabled ? "bg-gw-600" : "bg-zinc-200"}`, children: _jsx("span", { className: `mt-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${deadlineEnabled ? "translate-x-4" : "translate-x-0.5"}` }) })] }), deadlineEnabled ? (_jsxs("div", { className: "mt-3 flex gap-3", children: [_jsx("input", { type: "date", value: draft.deadline
                                                    ? new Date(draft.deadline).toISOString().slice(0, 10)
                                                    : "", onChange: (e) => {
                                                    const time = draft.deadline
                                                        ? new Date(draft.deadline).toTimeString().slice(0, 5)
                                                        : "17:00";
                                                    onChange({
                                                        deadline: e.target.value
                                                            ? new Date(`${e.target.value}T${time}`).toISOString()
                                                            : null,
                                                    });
                                                }, className: "flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-gw-500 focus:outline-none" }), _jsx("input", { type: "time", value: draft.deadline
                                                    ? new Date(draft.deadline).toTimeString().slice(0, 5)
                                                    : "17:00", onChange: (e) => {
                                                    const date = draft.deadline
                                                        ? new Date(draft.deadline).toISOString().slice(0, 10)
                                                        : new Date().toISOString().slice(0, 10);
                                                    onChange({
                                                        deadline: e.target.value
                                                            ? new Date(`${date}T${e.target.value}`).toISOString()
                                                            : null,
                                                    });
                                                }, className: "w-32 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-gw-500 focus:outline-none" })] })) : (_jsx("p", { className: "mt-1.5 text-xs text-zinc-400", children: "Ohne Frist k\u00F6nnen Angebote unbegrenzt eingereicht werden." }))] }), _jsxs("div", { children: [_jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-wide text-zinc-400", children: "Preisorientierung" }), _jsx("div", { className: "flex flex-col gap-2", children: PRICE_OPTIONS.map(({ value, label, description }) => {
                                            const selected = priceDisplay === value;
                                            return (_jsxs("div", { children: [_jsxs("button", { onClick: () => onChange({ priceDisplay: value }), className: `flex w-full items-start gap-3 rounded-lg border px-4 py-3.5 text-left transition-colors ${selected
                                                            ? "border-blue-200 bg-blue-50"
                                                            : "border-zinc-200 bg-white hover:border-zinc-300"}`, children: [_jsx("span", { className: `mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-blue-500" : "border-zinc-300"}`, children: selected && _jsx("span", { className: "h-2 w-2 rounded-full bg-blue-500" }) }), _jsxs("div", { children: [_jsx("span", { className: `text-sm font-medium ${selected ? "text-zinc-900" : "text-zinc-700"}`, children: label }), _jsx("p", { className: `mt-0.5 text-xs ${selected ? "text-zinc-600" : "text-zinc-400"}`, children: description })] })] }), selected && value === PriceDisplay.PRICE && (_jsx("div", { className: "mt-2 px-1", children: _jsx("input", { type: "text", value: guidePrice, onChange: (e) => setGuidePrice(e.target.value), placeholder: "CHF 1'200'000", className: "w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none" }) })), selected && value === PriceDisplay.RANGE && (_jsxs("div", { className: "mt-2 flex items-center gap-3 px-1", children: [_jsx("input", { type: "text", value: priceRangeMin, onChange: (e) => setPriceRangeMin(e.target.value), placeholder: "CHF 900'000", className: "flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none" }), _jsx("span", { className: "text-sm text-zinc-400", children: "bis" }), _jsx("input", { type: "text", value: priceRangeMax, onChange: (e) => setPriceRangeMax(e.target.value), placeholder: "CHF 1'100'000", className: "flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none" })] }))] }, value));
                                        }) })] })] }))] }), !showNotes ? (_jsx("button", { onClick: () => setShowNotes(true), className: "w-fit text-sm text-zinc-400 transition-colors hover:text-zinc-600", children: "+ Hinweise f\u00FCr Interessent:innen hinzuf\u00FCgen" })) : (_jsxs("div", { children: [_jsxs("label", { className: "mb-1.5 block text-sm font-medium text-zinc-700", children: ["Hinweise f\u00FCr Interessent:innen", " ", _jsx("span", { className: "font-normal text-zinc-400", children: "(optional)" })] }), _jsx("textarea", { autoFocus: true, value: draft.biddingRules ?? "", onChange: (e) => onChange({ biddingRules: e.target.value }), rows: 3, placeholder: "z. B. Nur hypothekarisch gesicherte Angebote\nBesichtigung: Sa 14. Juni, 10–12 Uhr", className: "w-full resize-none rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 transition-colors focus:border-gw-500 focus:outline-none" }), _jsx("p", { className: "mt-1.5 text-xs text-zinc-400", children: "Wird im Interessent:innen-Bereich angezeigt." })] })), _jsxs("div", { className: "flex justify-between pt-2", children: [_jsx("button", { onClick: onBack, className: "rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-700", children: "Zur\u00FCck" }), _jsx("button", { onClick: onNext, className: "rounded-lg bg-gw-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gw-500", children: "Dokumente festlegen \u2192" })] })] }));
};
export default StepProcess;
