import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useGridbidUiStore } from "../../store/gridbidUiStore";
import { useGridbidService } from "../../services/GridbidServiceContext";
import { formatDeadline, formatCHF } from "../../utils/labels";
// ─── Tab configuration ────────────────────────────────────────────────────────
const TABS = [
    { id: "overview", label: "Übersicht" },
    { id: "documents", label: "Unterlagen" },
    { id: "qa", label: "Fragen & Updates" },
    { id: "bid", label: "Angebot einreichen" },
];
// ─── Root component ───────────────────────────────────────────────────────────
const BuyerDealRoom = () => {
    const buyerBiddingId = useGridbidUiStore((s) => s.buyerBiddingId);
    const buyerRegistration = useGridbidUiStore((s) => s.buyerRegistration);
    const activeTab = useGridbidUiStore((s) => s.buyerDealRoomTab);
    const setTab = useGridbidUiStore((s) => s.setBuyerDealRoomTab);
    const switchToAgency = useGridbidUiStore((s) => s.switchToAgency);
    const service = useGridbidService();
    const [bidding, setBidding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [documentsViewed, setDocumentsViewed] = useState(false);
    function handleTabChange(tab) {
        if (tab === "documents")
            setDocumentsViewed(true);
        setTab(tab);
    }
    useEffect(() => {
        if (!buyerBiddingId)
            return;
        setLoading(true);
        service
            .getBiddingById(buyerBiddingId)
            .then((data) => {
            setBidding(data);
            setLoading(false);
        })
            .catch(() => setLoading(false));
    }, [service, buyerBiddingId]);
    if (loading) {
        return (_jsx("div", { className: "flex h-40 items-center justify-center text-sm text-gray-400", children: "Wird geladen\u2026" }));
    }
    if (!bidding) {
        return (_jsx("div", { className: "flex h-40 items-center justify-center text-sm text-gray-400", children: "Verfahren nicht gefunden." }));
    }
    return (_jsxs("div", { className: "min-h-full bg-gray-50", children: [_jsx("div", { className: "border-b border-amber-200 bg-amber-50 px-6 py-2.5", children: _jsxs("div", { className: "mx-auto flex max-w-3xl items-center justify-between gap-4", children: [_jsxs("p", { className: "text-xs text-amber-700", children: [_jsx("span", { className: "font-semibold", children: "Vorschau:" }), " So sehen K\u00E4ufer den Deal Room", buyerRegistration && (_jsxs("span", { className: "ml-1 text-amber-600", children: ["(", buyerRegistration.firstName, " ", buyerRegistration.lastName, ")"] }))] }), _jsx("button", { onClick: switchToAgency, className: "text-xs font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900", children: "Zur\u00FCck zur Agentur-Ansicht" })] }) }), _jsx("div", { className: "border-b border-gray-200 bg-white", children: _jsxs("div", { className: "mx-auto max-w-3xl px-6 py-5", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "mb-0.5 text-xs font-semibold uppercase tracking-widest text-gray-400", children: "Deal Room" }), _jsx("h1", { className: "text-lg font-semibold text-gray-900", children: bidding.title }), _jsx("p", { className: "mt-0.5 text-sm text-gray-500", children: bidding.address })] }), bidding.websiteUrl && (_jsxs("a", { href: bidding.websiteUrl, target: "_blank", rel: "noopener noreferrer", className: "mt-1 shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gw-200 bg-gw-50 px-3 py-2 text-xs font-medium text-gw-700 transition-colors hover:border-gw-300 hover:bg-gw-100", children: ["Objektbeschreibung", _jsx("svg", { className: "h-3 w-3", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" }) })] }))] }), _jsx("div", { className: "mt-5 flex gap-0 border-b border-gray-100", children: TABS.map((tab) => (_jsxs("button", { onClick: () => handleTabChange(tab.id), className: `relative -mb-px px-4 pb-3 text-sm font-medium transition-colors ${activeTab === tab.id
                                    ? "border-b-2 border-gw-600 text-gw-600"
                                    : "text-gray-400 hover:text-gray-700"}`, children: [tab.label, tab.id === "bid" && activeTab !== "bid" && (_jsx("span", { className: "ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gw-600 text-[10px] font-bold text-white", children: "!" }))] }, tab.id))) })] }) }), _jsxs("div", { className: "mx-auto max-w-3xl px-6 py-8", children: [activeTab === "overview" && (_jsx(OverviewTab, { bidding: bidding, documentsViewed: documentsViewed, onViewDocuments: () => handleTabChange("documents"), onSubmitBid: () => handleTabChange("bid") })), activeTab === "documents" && _jsx(DocumentsTab, { bidding: bidding }), activeTab === "qa" && _jsx(QATab, {}), activeTab === "bid" && _jsx(BidTab, { bidding: bidding })] })] }));
};
// ─── Overview tab ─────────────────────────────────────────────────────────────
function OverviewTab({ bidding, documentsViewed, onViewDocuments, onSubmitBid, }) {
    const daysUntilDeadline = bidding.deadline
        ? Math.ceil((new Date(bidding.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
    return (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "rounded-xl border border-gw-100 bg-gw-50 px-5 py-4", children: [_jsx("p", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-gw-600", children: "N\u00E4chster Schritt" }), _jsx("ol", { className: "space-y-2", children: [
                            { num: 1, label: "Unterlagen prüfen", done: documentsViewed },
                            { num: 2, label: "Fragen klären", done: false },
                            { num: 3, label: "Angebot einreichen", done: false },
                        ].map((step) => (_jsxs("li", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: `flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${step.done ? "bg-emerald-100 text-emerald-600" : "bg-gw-600 text-white"}`, children: step.done ? (_jsx("svg", { className: "h-3 w-3", fill: "none", viewBox: "0 0 12 12", stroke: "currentColor", strokeWidth: "2.5", children: _jsx("path", { d: "M2 6l3 3 5-5" }) })) : (step.num) }), _jsx("span", { className: `text-sm ${step.done ? "text-gray-400 line-through" : "font-medium text-gray-700"}`, children: step.label })] }, step.num))) })] }), _jsx("div", { className: "rounded-xl border border-gray-100 bg-white p-6", children: _jsxs("div", { className: "flex items-start gap-4", children: [bidding.imageUrl && (_jsx("img", { src: bidding.imageUrl, alt: bidding.title, className: "h-20 w-20 shrink-0 rounded-lg object-cover" })), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: bidding.title }), _jsx("p", { className: "mt-0.5 text-xs text-gray-400", children: bidding.address }), bidding.websiteUrl && (_jsxs("a", { href: bidding.websiteUrl, target: "_blank", rel: "noopener noreferrer", className: "mt-2 inline-flex items-center gap-1 text-xs font-medium text-gw-600 underline underline-offset-2 hover:text-gw-500", children: ["Vollst\u00E4ndige Objektbeschreibung ansehen", _jsx("svg", { className: "h-3 w-3", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M6 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-3M10 2h4m0 0v4m0-4L7 9" }) })] }))] })] }) }), _jsxs("div", { className: "rounded-xl border border-gray-100 bg-white p-6", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between gap-3", children: [_jsx("h2", { className: "text-sm font-semibold text-gray-700", children: "Ablauf & Fristen" }), _jsxs("div", { className: "flex items-center gap-3", children: [daysUntilDeadline !== null && daysUntilDeadline > 0 && (_jsxs("span", { className: "flex items-center gap-1.5 text-xs font-medium text-orange-600", children: [_jsx("svg", { className: "h-3.5 w-3.5", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule: "evenodd" }) }), "Endet in ", daysUntilDeadline === 1 ? "1 Tag" : `${daysUntilDeadline} Tagen`] })), _jsxs("span", { className: "flex items-center gap-1.5 text-xs text-gray-400", children: [_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400" }), "Mehrere Interessenten aktiv"] })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(TimelineItem, { done: true, label: "Registrierung abgeschlossen", description: "Du hast Zugang zum Deal Room." }), _jsx(TimelineItem, { done: true, label: "Unterlagen zug\u00E4nglich", description: "Phase-1-Dokumente stehen bereit." }), _jsx(TimelineItem, { active: true, label: "Angebotsabgabe", description: bidding.deadline
                                    ? `Frist: ${formatDeadline(bidding.deadline)}`
                                    : "Keine Frist gesetzt." }), _jsx(TimelineItem, { label: "Entscheid", description: "Der Eigent\u00FCmer pr\u00FCft alle Angebote." })] })] }), _jsx("div", { className: "space-y-3", children: !documentsViewed ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: onViewDocuments, className: "w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500", children: "Unterlagen pr\u00FCfen" }), _jsx("button", { onClick: onSubmitBid, className: "w-full rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700", children: "Direkt zum Angebot" })] })) : (_jsxs(_Fragment, { children: [_jsx("button", { onClick: onSubmitBid, className: "w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500", children: "Angebot vorbereiten" }), _jsx("button", { onClick: onViewDocuments, className: "w-full rounded-lg border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700", children: "Unterlagen nochmals ansehen" })] })) })] }));
}
function TimelineItem({ label, description, done = false, active = false, }) {
    return (_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${done
                    ? "bg-emerald-100 text-emerald-600"
                    : active
                        ? "bg-gw-600 text-white"
                        : "bg-gray-100 text-gray-300"}`, children: done ? (_jsx("svg", { className: "h-3 w-3", fill: "none", viewBox: "0 0 12 12", stroke: "currentColor", strokeWidth: "2.5", children: _jsx("path", { d: "M2 6l3 3 5-5" }) })) : (_jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-current" })) }), _jsxs("div", { children: [_jsx("p", { className: `text-sm font-medium ${done || active ? "text-gray-900" : "text-gray-400"}`, children: label }), _jsx("p", { className: "text-xs text-gray-400", children: description })] })] }));
}
// ─── Documents tab ────────────────────────────────────────────────────────────
function DocumentsTab({ bidding }) {
    const { level1, level2, level3 } = bidding.documents;
    const hasAny = level1.length > 0 || level2.length > 0 || level3.length > 0;
    if (!hasAny) {
        return (_jsx("div", { className: "rounded-xl border border-gray-100 bg-white p-8 text-center", children: _jsx("p", { className: "text-sm text-gray-400", children: "Noch keine Unterlagen freigegeben." }) }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [level1.length > 0 && (_jsx(DocumentPhase, { phase: "Phase 1 \u2013 Basisunterlagen", description: "F\u00FCr alle registrierten Interessenten zug\u00E4nglich.", documents: level1, unlocked: true })), level2.length > 0 && (_jsx(DocumentPhase, { phase: "Phase 2 \u2013 Erweiterte Unterlagen", description: "Zug\u00E4nglich nach Abgabe eines Erstangebots.", documents: level2, unlocked: false })), level3.length > 0 && (_jsx(DocumentPhase, { phase: "Phase 3 \u2013 Vertragsdokumente", description: "Wird individuell freigegeben.", documents: level3, unlocked: false }))] }));
}
function DocumentPhase({ phase, description, documents, unlocked, }) {
    return (_jsxs("div", { className: `rounded-xl border bg-white p-6 ${unlocked ? "border-gray-100" : "border-gray-100 opacity-70"}`, children: [_jsxs("div", { className: "mb-4 flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-semibold text-gray-800", children: phase }), _jsx("p", { className: "mt-0.5 text-xs text-gray-400", children: description })] }), !unlocked && (_jsxs("span", { className: "flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-400", children: [_jsx("svg", { className: "h-3 w-3", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z", clipRule: "evenodd" }) }), "Gesperrt"] }))] }), _jsx("div", { className: "space-y-2", children: documents.map((doc) => (_jsxs("div", { className: `flex items-center gap-3 rounded-lg px-3 py-2.5 ${unlocked ? "cursor-pointer bg-gray-50 hover:bg-gray-100" : "bg-gray-50"}`, children: [_jsx("svg", { className: "h-4 w-4 shrink-0 text-gray-400", fill: "none", viewBox: "0 0 20 20", stroke: "currentColor", strokeWidth: "1.5", children: _jsx("path", { d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }), _jsx("span", { className: "flex-1 text-sm text-gray-700", children: doc }), unlocked ? (_jsx("svg", { className: "h-3.5 w-3.5 text-gray-400", fill: "none", viewBox: "0 0 16 16", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M4 8h8M9 5l3 3-3 3" }) })) : (_jsx("svg", { className: "h-3.5 w-3.5 text-gray-300", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z", clipRule: "evenodd" }) }))] }, doc))) })] }));
}
// ─── Q&A tab ──────────────────────────────────────────────────────────────────
const MOCK_UPDATES = [
    {
        id: "u1",
        date: "2026-04-11T10:00:00.000Z",
        type: "update",
        title: "Besichtigungstermin bestätigt",
        body: "Die Besichtigung findet am Samstag, 14. Juni von 10–12 Uhr statt. Bitte melde dich per E-Mail an, um deinen Platz zu reservieren.",
    },
    {
        id: "u2",
        date: "2026-04-12T14:30:00.000Z",
        type: "faq",
        title: "Ist eine Teilfinanzierung möglich?",
        body: "Ja, Hypothekarangebote werden akzeptiert. Bitte lege eine Finanzierungsbestätigung deiner Bank bei der Angebotsabgabe bei.",
    },
];
function QATab() {
    const [question, setQuestion] = useState("");
    const [sent, setSent] = useState(false);
    function handleSend(e) {
        e.preventDefault();
        if (!question.trim())
            return;
        setSent(true);
        setQuestion("");
        setTimeout(() => setSent(false), 3000);
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "mb-4 text-sm font-semibold text-gray-700", children: "Updates & FAQ" }), _jsx("div", { className: "space-y-3", children: MOCK_UPDATES.map((item) => (_jsxs("div", { className: "rounded-xl border border-gray-100 bg-white p-5", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx("span", { className: `rounded-full px-2 py-0.5 text-xs font-medium ${item.type === "update"
                                                ? "bg-blue-50 text-blue-600"
                                                : "bg-gray-100 text-gray-500"}`, children: item.type === "update" ? "Update" : "FAQ" }), _jsx("span", { className: "text-xs text-gray-400", children: new Date(item.date).toLocaleDateString("de-CH") })] }), _jsx("p", { className: "mb-1.5 text-sm font-medium text-gray-900", children: item.title }), _jsx("p", { className: "text-sm text-gray-500 leading-relaxed", children: item.body })] }, item.id))) })] }), _jsxs("div", { className: "rounded-xl border border-gray-100 bg-white p-6", children: [_jsx("h2", { className: "mb-1 text-sm font-semibold text-gray-700", children: "Frage stellen" }), _jsx("p", { className: "mb-4 text-xs text-gray-400", children: "Deine Frage wird vertraulich an den zust\u00E4ndigen Makler weitergeleitet." }), sent ? (_jsx("div", { className: "rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700", children: "Frage erfolgreich gesendet. Du erh\u00E4ltst eine Antwort per E-Mail." })) : (_jsxs("form", { onSubmit: handleSend, className: "space-y-3", children: [_jsx("textarea", { value: question, onChange: (e) => setQuestion(e.target.value), placeholder: "Deine Frage \u2026", rows: 3, className: "w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gw-500 focus:outline-none" }), _jsx("button", { type: "submit", disabled: !question.trim(), className: "rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-40", children: "Frage senden" })] }))] })] }));
}
// ─── Bid tab ──────────────────────────────────────────────────────────────────
function BidTab({ bidding }) {
    const [amount, setAmount] = useState("");
    const [conditions, setConditions] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const parsedAmount = parseInt(amount.replace(/['. ]/g, ""), 10);
    const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;
    function handleSubmit(e) {
        e.preventDefault();
        if (!isValidAmount)
            return;
        if (!confirming) {
            setConfirming(true);
            return;
        }
        setSubmitted(true);
    }
    if (submitted) {
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "rounded-xl border border-emerald-100 bg-emerald-50 p-8 text-center", children: [_jsx("div", { className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100", children: _jsx("svg", { className: "h-6 w-6 text-emerald-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M5 13l4 4L19 7" }) }) }), _jsx("h2", { className: "mb-1 text-base font-semibold text-emerald-800", children: "Angebot eingereicht" }), _jsxs("p", { className: "text-sm text-emerald-700", children: [isValidAmount && formatCHF(parsedAmount), " wurde vertraulich \u00FCbermittelt."] }), _jsx("p", { className: "mt-1 text-xs text-emerald-600", children: "Du erh\u00E4ltst eine Best\u00E4tigung per E-Mail." })] }), _jsxs("div", { className: "rounded-xl border border-gray-100 bg-white p-5", children: [_jsx("p", { className: "mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400", children: "Status deines Angebots" }), _jsxs("div", { className: "space-y-3", children: [_jsx(TimelineItem, { done: true, label: "Angebot eingereicht", description: "Dein Angebot wurde erfolgreich \u00FCbermittelt." }), _jsx(TimelineItem, { active: true, label: "In Pr\u00FCfung", description: "Der Eigent\u00FCmer pr\u00FCft alle eingegangenen Angebote." }), _jsx(TimelineItem, { label: "Entscheid", description: "Du wirst per E-Mail \u00FCber den Entscheid informiert." })] })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-xl border border-gray-100 bg-white p-6", children: [_jsx("h2", { className: "mb-1 text-sm font-semibold text-gray-700", children: "Angebot einreichen" }), _jsxs("p", { className: "mb-6 text-xs text-gray-400", children: ["Dein Angebot wird vertraulich behandelt und direkt an den Eigent\u00FCmer weitergeleitet.", bidding.deadline && (_jsxs("span", { className: "ml-1 font-medium text-orange-500", children: ["Frist: ", formatDeadline(bidding.deadline)] }))] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1.5 block text-sm font-medium text-gray-700", children: "Angebotsbetrag" }), _jsxs("div", { className: "relative", children: [_jsx("span", { className: "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400", children: "CHF" }), _jsx("input", { type: "text", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "1'200'000", className: "w-full rounded-lg border border-gray-200 py-3 pl-12 pr-4 font-mono text-base text-gray-900 placeholder-gray-300 focus:border-gw-500 focus:outline-none", required: true })] }), amount && !isValidAmount && (_jsx("p", { className: "mt-1.5 text-xs text-red-500", children: "Bitte gib einen g\u00FCltigen Betrag ein." }))] }), _jsxs("div", { children: [_jsxs("label", { className: "mb-1.5 block text-sm font-medium text-gray-700", children: ["Bedingungen / Bemerkungen", " ", _jsx("span", { className: "font-normal text-gray-400", children: "(optional)" })] }), _jsx("textarea", { value: conditions, onChange: (e) => setConditions(e.target.value), placeholder: "z.B. Vorbehalt Finanzierungszusage, gew\u00FCnschter \u00DCbergabetermin \u2026", rows: 3, className: "w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gw-500 focus:outline-none" })] }), confirming ? (_jsxs("div", { className: "space-y-4 rounded-xl border border-orange-100 bg-orange-50 p-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-orange-800", children: "Angebot best\u00E4tigen" }), _jsxs("p", { className: "mt-1 text-sm text-orange-700", children: ["Du reichst ein Angebot von", " ", _jsx("span", { className: "font-mono font-semibold", children: isValidAmount ? formatCHF(parsedAmount) : "—" }), " ", "ein. Angebote sind verbindlich und werden direkt an den Eigent\u00FCmer \u00FCbermittelt."] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { type: "button", onClick: () => setConfirming(false), className: "rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 transition-colors hover:border-orange-300", children: "Zur\u00FCck" }), _jsx("button", { type: "submit", className: "rounded-lg bg-gw-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-gw-500", children: "Verbindlich einreichen" })] })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-xs text-gray-500 leading-relaxed", children: "Dein Angebot ist verbindlich und wird direkt an den Eigent\u00FCmer \u00FCbermittelt." }), _jsx("button", { type: "submit", disabled: !isValidAmount, className: "w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500 disabled:cursor-not-allowed disabled:opacity-40", children: "Angebot einreichen" }), bidding.deadline && (_jsx("p", { className: "text-center text-xs text-gray-400", children: "Du kannst dein Angebot bis zur Frist jederzeit anpassen." }))] }))] })] }), _jsx("div", { className: "grid grid-cols-3 gap-3", children: [
                    { icon: "🔒", label: "Vertraulich", sub: "Nur der Eigentümer sieht dein Angebot" },
                    { icon: "📄", label: "Dokumentiert", sub: "Automatische Bestätigung per E-Mail" },
                    { icon: "⚖️", label: "Fair", sub: "Alle Bieter haben die gleichen Bedingungen" },
                ].map((item) => (_jsxs("div", { className: "rounded-xl border border-gray-100 bg-white p-4 text-center", children: [_jsx("p", { className: "mb-1 text-lg", children: item.icon }), _jsx("p", { className: "text-xs font-semibold text-gray-700", children: item.label }), _jsx("p", { className: "mt-0.5 text-xs text-gray-400", children: item.sub })] }, item.label))) })] }));
}
export default BuyerDealRoom;
