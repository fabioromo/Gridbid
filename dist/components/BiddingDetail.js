import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BiddingStatus } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";
import { PROCESS_LABEL, PRICE_LABEL, STATUS_LABEL, formatDate, formatDateTime, formatDeadline, formatCHF, } from "../utils/labels";
import PublicLinkCard from "./PublicLinkCard";
const STATUS_BADGE = {
    [BiddingStatus.DRAFT]: {
        label: STATUS_LABEL[BiddingStatus.DRAFT],
        className: "bg-gray-100 text-gray-500 border border-gray-200",
    },
    [BiddingStatus.ACTIVE]: {
        label: STATUS_LABEL[BiddingStatus.ACTIVE],
        className: "bg-blue-50 text-blue-600 border border-blue-200",
    },
    [BiddingStatus.CLOSED]: {
        label: STATUS_LABEL[BiddingStatus.CLOSED],
        className: "bg-gray-100 text-gray-400 border border-gray-200",
    },
};
const BiddingDetail = () => {
    const selectedBiddingId = useGridbidUiStore((s) => s.selectedBiddingId);
    const navigate = useGridbidUiStore((s) => s.navigate);
    const switchToBuyer = useGridbidUiStore((s) => s.switchToBuyer);
    const service = useGridbidService();
    const [bidding, setBidding] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [activating, setActivating] = useState(false);
    const [activationError, setActivationError] = useState(null);
    const [confirmingActivation, setConfirmingActivation] = useState(false);
    useEffect(() => {
        if (!selectedBiddingId)
            return;
        setLoading(true);
        setLoadError(null);
        service
            .getBiddingById(selectedBiddingId)
            .then((data) => {
            setBidding(data);
            setLoading(false);
        })
            .catch((err) => {
            setLoadError(err instanceof Error ? err.message : "Unbekannter Fehler");
            setLoading(false);
        });
    }, [service, selectedBiddingId]);
    async function handleActivate() {
        if (!bidding)
            return;
        setActivating(true);
        setActivationError(null);
        setConfirmingActivation(false);
        try {
            const updated = await service.activateBidding(bidding.id);
            setBidding(updated);
        }
        catch (err) {
            setActivationError(err instanceof Error ? err.message : "Aktivierung fehlgeschlagen");
        }
        finally {
            setActivating(false);
        }
    }
    if (loading) {
        return (_jsx("div", { className: "flex h-40 items-center justify-center text-sm text-gray-400", children: "Wird geladen\u2026" }));
    }
    if (loadError) {
        return (_jsxs("div", { className: "flex h-40 items-center justify-center text-sm text-red-500", children: ["Fehler: ", loadError] }));
    }
    if (!bidding) {
        return (_jsx("div", { className: "flex h-40 items-center justify-center text-sm text-gray-400", children: "Wird geladen\u2026" }));
    }
    const badge = STATUS_BADGE[bidding.status];
    return (_jsx("div", { className: "px-6 py-8", children: _jsxs("div", { className: "mx-auto max-w-4xl", children: [_jsx("button", { onClick: () => navigate("overview"), className: "mb-6 text-sm text-gray-400 transition-colors hover:text-gray-700", children: "\u2190 Zur\u00FCck zur \u00DCbersicht" }), _jsxs("div", { className: "mb-8 flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "mb-2 flex items-center gap-3", children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: bidding.title || "Unbenannt" }), _jsx("span", { className: `rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`, children: badge.label })] }), _jsx("p", { className: "text-sm text-gray-500", children: bidding.address || "—" })] }), _jsxs("div", { className: "flex items-start gap-3", children: [bidding.status === BiddingStatus.ACTIVE && (_jsx("button", { onClick: () => switchToBuyer(bidding.id), className: "rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900", children: "K\u00E4ufer-Vorschau" })), bidding.status === BiddingStatus.DRAFT && (_jsxs("div", { className: "flex flex-col items-end gap-2", children: [!confirmingActivation ? (_jsx("button", { onClick: () => setConfirmingActivation(true), className: "rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500", children: "Verfahren aktivieren" })) : (_jsxs("div", { className: "flex flex-col items-end gap-2", children: [_jsx("p", { className: "text-xs text-gray-500", children: "Nach der Aktivierung ist das Verfahren \u00F6ffentlich und kann nicht mehr bearbeitet werden." }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setConfirmingActivation(false), className: "rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700", children: "Abbrechen" }), _jsx("button", { onClick: () => void handleActivate(), disabled: activating, className: "rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50", children: activating ? "Wird aktiviert…" : "Jetzt aktivieren" })] })] })), activationError && (_jsx("p", { className: "text-xs text-red-500", children: activationError }))] }))] })] }), _jsx("div", { className: "mb-8", children: _jsx(PublicLinkCard, { status: bidding.status, url: bidding.publicUrl }) }), bidding.status !== BiddingStatus.DRAFT && (_jsx("div", { className: "mb-8", children: _jsx(OrderBookSummary, { participants: bidding.participants, offers: bidding.offers }) })), _jsxs("div", { className: "mb-8 grid grid-cols-2 gap-6 sm:grid-cols-4", children: [_jsx(Field, { label: "Verfahrenstyp", value: PROCESS_LABEL[bidding.processType] }), _jsx(Field, { label: "Preisanzeige", value: PRICE_LABEL[bidding.priceDisplay] }), _jsx(Field, { label: "Frist", value: formatDeadline(bidding.deadline) }), _jsx(Field, { label: "Erstellt", value: formatDate(bidding.createdAt) })] }), _jsx(Section, { title: "Teilnehmer", children: bidding.participants.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400", children: "Noch keine Teilnehmer registriert." })) : (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left text-xs text-gray-400", children: [_jsx("th", { className: "pb-3 font-medium", children: "Name" }), _jsx("th", { className: "pb-3 font-medium", children: "E-Mail" }), _jsx("th", { className: "pb-3 font-medium", children: "Registriert" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: bidding.participants.map((p) => (_jsxs("tr", { children: [_jsx("td", { className: "py-3 text-gray-800", children: p.name }), _jsx("td", { className: "py-3 text-gray-500", children: p.email }), _jsx("td", { className: "py-3 text-gray-500", children: formatDate(p.registeredAt) })] }, p.id))) })] })) }), _jsx(Section, { title: "Angebote", children: bidding.offers.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400", children: "Noch keine Angebote eingegangen." })) : (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "text-left text-xs text-gray-400", children: [_jsx("th", { className: "pb-3 font-medium", children: "Teilnehmer" }), _jsx("th", { className: "pb-3 font-medium", children: "Betrag" }), _jsx("th", { className: "pb-3 font-medium", children: "Version" }), _jsx("th", { className: "pb-3 font-medium", children: "Eingereicht" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: bidding.offers.map((o) => {
                                    const participant = bidding.participants.find((p) => p.id === o.participantId);
                                    return (_jsxs("tr", { children: [_jsx("td", { className: "py-3 text-gray-800", children: participant?.name ?? o.participantId }), _jsx("td", { className: "py-3 font-mono text-gray-800", children: formatCHF(o.amount) }), _jsxs("td", { className: "py-3 text-gray-500", children: ["v", o.version] }), _jsx("td", { className: "py-3 text-gray-500", children: formatDateTime(o.submittedAt) })] }, o.id));
                                }) })] })) })] }) }));
};
function Field({ label, value }) {
    return (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-400", children: label }), _jsx("p", { className: "mt-1 text-sm font-medium text-gray-800", children: value })] }));
}
function OrderBookSummary({ participants, offers, }) {
    // For each participant, keep only the offer with the highest version number
    const latestByParticipant = new Map();
    for (const offer of offers) {
        const current = latestByParticipant.get(offer.participantId);
        if (!current || offer.version > current.version) {
            latestByParticipant.set(offer.participantId, offer);
        }
    }
    const latestOffers = Array.from(latestByParticipant.values());
    const highestOffer = latestOffers.length > 0
        ? Math.max(...latestOffers.map((o) => o.amount))
        : null;
    return (_jsxs("div", { className: "rounded-lg border border-gray-200 bg-white p-6", children: [_jsx("h2", { className: "mb-5 text-sm font-semibold text-gray-700", children: "Gebotsspiegel" }), _jsxs("div", { className: "grid grid-cols-3 gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-400", children: "Registrierte K\u00E4ufer" }), _jsx("p", { className: "mt-2 text-2xl font-semibold text-gray-900", children: participants.length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-400", children: "Eingegangene Angebote" }), _jsx("p", { className: "mt-2 text-2xl font-semibold text-gray-900", children: latestOffers.length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-gray-400", children: "H\u00F6chstes Angebot" }), _jsx("p", { className: "mt-2 text-2xl font-semibold text-gray-900", children: highestOffer !== null ? formatCHF(highestOffer) : "—" })] })] })] }));
}
function Section({ title, children }) {
    return (_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "mb-4 text-sm font-semibold text-gray-700", children: title }), children] }));
}
export default BiddingDetail;
