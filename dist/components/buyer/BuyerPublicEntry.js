import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useGridbidUiStore } from "../../store/gridbidUiStore";
import { useGridbidService } from "../../services/GridbidServiceContext";
const STEPS = [
    {
        bold: "Registrierung",
        rest: " – Kurze Angaben zu deiner Person und Finanzierungssituation.",
    },
    {
        bold: "Unterlagenzugang",
        rest: " – Du erhältst Zugang zu den relevanten Unterlagen.",
    },
    {
        bold: "Angebotsabgabe",
        rest: " – Dein Angebot wird vertraulich und strukturiert eingereicht.",
    },
    {
        bold: "Entscheid",
        rest: " – Der Eigentümer prüft alle Angebote und entscheidet.",
    },
];
function formatDeadlineShort(iso) {
    const d = new Date(iso);
    const date = d.toLocaleDateString("de-CH");
    const time = d.toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });
    return `${date}, ${time} Uhr`;
}
// ── Lock icon ─────────────────────────────────────────────────────────────────
function LockIcon() {
    return (_jsx("svg", { className: "h-3.5 w-3.5 shrink-0", viewBox: "0 0 16 16", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M8 1a3 3 0 00-3 3v1H4a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1V6a1 1 0 00-1-1h-1V4a3 3 0 00-3-3zm-1 3a1 1 0 112 0v1H7V4zm1 4a1 1 0 011 1v2a1 1 0 11-2 0V9a1 1 0 011-1z", clipRule: "evenodd" }) }));
}
// ── Component ─────────────────────────────────────────────────────────────────
const BuyerPublicEntry = () => {
    const buyerBiddingId = useGridbidUiStore((s) => s.buyerBiddingId);
    const navigateBuyer = useGridbidUiStore((s) => s.navigateBuyer);
    const switchToAgency = useGridbidUiStore((s) => s.switchToAgency);
    const setBuyerBidding = useGridbidUiStore((s) => s.setBuyerBidding);
    const service = useGridbidService();
    const [bidding, setBidding] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!buyerBiddingId)
            return;
        setLoading(true);
        service
            .getBiddingById(buyerBiddingId)
            .then((data) => {
            setBidding(data);
            if (data)
                setBuyerBidding(data); // cache in store — registration steps read from here
            setLoading(false);
        })
            .catch(() => setLoading(false));
    }, [service, buyerBiddingId]);
    if (loading) {
        return (_jsx("div", { className: "flex h-40 items-center justify-center text-sm text-gray-400", children: "Wird geladen\u2026" }));
    }
    if (!bidding) {
        return (_jsx("div", { className: "flex h-40 items-center justify-center text-sm text-gray-400", children: "Dieses Verfahren wurde nicht gefunden." }));
    }
    const daysUntilDeadline = bidding.deadline
        ? Math.ceil((new Date(bidding.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
    return (_jsxs("div", { className: "min-h-full bg-white", children: [_jsx("div", { className: "border-b border-amber-200 bg-amber-50 px-6 py-2.5", children: _jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between gap-4", children: [_jsxs("p", { className: "text-xs text-amber-700", children: [_jsx("span", { className: "font-semibold", children: "Vorschau:" }), " So sehen K\u00E4ufer diese Seite."] }), _jsx("button", { onClick: switchToAgency, className: "text-xs font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900", children: "Zur\u00FCck zur Agentur-Ansicht" })] }) }), _jsxs("div", { className: "mx-auto max-w-2xl px-6 py-14", children: [bidding.imageUrl && (_jsxs("div", { className: "relative mb-8 overflow-hidden rounded-2xl shadow-md", children: [_jsx("img", { src: bidding.imageUrl, alt: bidding.title, className: "h-72 w-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" }), _jsx("div", { className: "absolute bottom-4 left-0 right-0 flex justify-center", children: _jsxs("div", { className: "inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/45 px-4 py-1.5 backdrop-blur-sm", children: [_jsx(LockIcon, {}), _jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-white", children: "Privater Deal Room" })] }) })] })), _jsxs("div", { className: "mb-12 text-center", children: [_jsx("h1", { className: "mb-2 text-4xl font-bold tracking-tight text-gray-900", children: bidding.title }), _jsx("p", { className: "mb-4 text-sm text-gray-400", children: bidding.address }), bidding.websiteUrl && (_jsxs("a", { href: bidding.websiteUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 text-xs font-medium text-gw-600 hover:text-gw-500", children: ["Objektbeschreibung ansehen", _jsx("svg", { className: "h-3 w-3", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" }) })] }))] }), _jsxs("div", { className: "mb-14", children: [_jsx("p", { className: "mb-5 text-xs font-medium uppercase tracking-wider text-gray-400", children: "Wie es funktioniert" }), _jsx("ol", { className: "space-y-4", children: STEPS.map((step, i) => (_jsxs("li", { className: "flex items-start gap-3.5 text-sm text-gray-600", children: [_jsx("span", { className: "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gw-600 text-xs font-bold text-white", children: i + 1 }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold text-gray-800", children: step.bold }), step.rest] })] }, i))) })] }), _jsxs("div", { children: [bidding.deadline && (_jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "mb-2 text-xs font-medium uppercase tracking-wider text-gray-400", children: "Angebotsfrist" }), daysUntilDeadline !== null && daysUntilDeadline > 0 ? (_jsxs(_Fragment, { children: [_jsxs("p", { className: "text-3xl font-bold tracking-tight text-gray-900", children: ["Noch", " ", daysUntilDeadline === 1 ? "1 Tag" : `${daysUntilDeadline} Tage`] }), _jsx("p", { className: "mt-1.5 text-sm text-gray-500", children: formatDeadlineShort(bidding.deadline) })] })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-lg font-semibold text-gray-400", children: "Angebotsfrist abgelaufen" }), _jsx("p", { className: "mt-1 text-sm text-gray-400", children: formatDeadlineShort(bidding.deadline) })] }))] })), _jsx("hr", { className: "mb-6 border-gray-100" }), _jsxs("p", { className: "mb-6 flex items-center gap-2 text-xs text-gray-400", children: [_jsx(LockIcon, {}), "Zugang nur f\u00FCr registrierte Interessenten."] }), _jsx("button", { onClick: () => navigateBuyer("register"), className: "w-full rounded-xl bg-gw-600 px-6 py-5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-gw-500", children: "Zugang zum Deal Room sichern" }), _jsx("p", { className: "mt-3 text-center text-xs text-gray-300", children: "Unverbindlich \u00B7 Vertraulich \u00B7 F\u00FCr alle Bieter gleich" })] })] })] }));
};
export default BuyerPublicEntry;
