import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useState } from "react";
import { BiddingStatus } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { formatCHF } from "../utils/labels";
// Shared grid column template — must match header in BiddingsOverview
export const ROW_GRID = "grid-cols-[88px_1fr_180px_84px_112px_164px_116px_116px]";
const STATUS_STYLE = {
    [BiddingStatus.DRAFT]: {
        label: "Entwurf",
        cls: "border",
        style: {
            backgroundColor: "#f3f4f6",
            color: "#6b7280",
            borderColor: "#e5e7eb",
        },
    },
    [BiddingStatus.ACTIVE]: {
        label: "Aktiv",
        cls: "border",
        style: {
            backgroundColor: "#eaf3ee",
            color: "#206942",
            borderColor: "#bfdacb",
        },
        dot: true,
    },
    [BiddingStatus.CLOSED]: {
        label: "Abgelaufen",
        cls: "border",
        style: {
            backgroundColor: "#fbf2ea",
            color: "#a45f1d",
            borderColor: "#f2d8c0",
        },
    },
};
function getHighestBidInfo(offers, participants) {
    if (offers.length === 0)
        return null;
    const top = offers.reduce((max, o) => (o.amount > max.amount ? o : max), offers[0]);
    const participant = participants.find((p) => p.id === top.participantId);
    return { amount: top.amount, name: participant?.name ?? "—" };
}
function getUniqueBidderCount(offers) {
    return new Set(offers.map((o) => o.participantId)).size;
}
// ─── Live countdown ──────────────────────────────────────────────────────────
function Countdown({ deadline }) {
    const [, tick] = useState(0);
    useEffect(() => {
        if (!deadline)
            return;
        // update every 30s normally, every second if < 5 minutes remaining
        const diff = new Date(deadline).getTime() - Date.now();
        const interval = diff < 300000 ? 1000 : 30000;
        const id = setInterval(() => tick((n) => n + 1), interval);
        return () => clearInterval(id);
    }, [deadline]);
    if (!deadline) {
        return _jsx("span", { className: "text-xs text-gray-400", children: "Ohne Frist" });
    }
    const diff = new Date(deadline).getTime() - Date.now();
    if (diff <= 0) {
        return (_jsx("span", { className: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", style: { backgroundColor: "#fbf2ea", color: "#a45f1d", borderColor: "#f2d8c0" }, children: "Abgelaufen" }));
    }
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const isCritical = diff < 3600000; // < 1h
    const isUrgent = diff < 86400000; // < 24h
    // dot: critical → amber, urgent → amber (pulsing), normal → brand green
    const dotStyle = isCritical || isUrgent
        ? { backgroundColor: "#b56100" }
        : { backgroundColor: "#288352" };
    // numbers: critical/urgent → amber, normal → gray-800
    const numStyle = isCritical || isUrgent
        ? { color: "#b56100" }
        : { color: "#1f2937" };
    const unitStyle = isCritical || isUrgent
        ? { color: "#f2d8c0" }
        : { color: "#9ca3af" };
    // Build segments: always show H and M; show D only if > 0; show S only if < 1 min
    const segments = [];
    if (days > 0)
        segments.push({ v: days, u: "D" });
    segments.push({ v: hours, u: "H" });
    if (days === 0) {
        segments.push({ v: minutes, u: "M" });
        if (diff < 60000)
            segments.push({ v: seconds, u: "S" });
    }
    return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full animate-pulse", style: dotStyle }), _jsx("div", { className: "flex items-baseline gap-0.5", children: segments.map(({ v, u }, i) => (_jsxs(React.Fragment, { children: [i > 0 && (_jsx("span", { className: "mx-0.5 text-xs font-light", style: unitStyle, children: ":" })), _jsx("span", { className: "font-mono text-sm font-semibold tabular-nums", style: numStyle, children: String(v).padStart(2, "0") }), _jsx("span", { className: "text-[10px] font-medium uppercase", style: unitStyle, children: u })] }, u))) })] }));
}
const BiddingRow = ({ bidding }) => {
    const navigate = useGridbidUiStore((s) => s.navigate);
    const topBid = getHighestBidInfo(bidding.offers, bidding.participants);
    const uniqueBidders = getUniqueBidderCount(bidding.offers);
    const badge = STATUS_STYLE[bidding.status];
    return (_jsxs("div", { onClick: () => navigate("detail", bidding.id), className: `grid ${ROW_GRID} cursor-pointer items-stretch border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50`, children: [_jsx("div", { className: "self-stretch p-2", children: _jsx("div", { className: "h-full overflow-hidden rounded-lg", children: bidding.imageUrl ? (_jsx("img", { src: bidding.imageUrl, alt: bidding.title, className: "h-full w-full object-cover" })) : (_jsx("div", { className: "flex h-full min-h-[64px] w-full items-center justify-center bg-gray-100 text-gray-300", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-5 w-5", children: _jsx("path", { d: "M3 9.5L12 3l9 6.5V21H15v-5h-6v5H3V9.5z" }) }) })) }) }), _jsxs("div", { className: "flex flex-col justify-center py-4 pr-5", children: [_jsx("p", { className: "text-sm font-medium leading-snug text-gray-900", children: bidding.title || "Unbenannt" }), _jsx("p", { className: "mt-0.5 text-xs text-gray-400", children: bidding.address || "—" })] }), _jsx("div", { className: "flex flex-col justify-center py-4 pr-5 text-right", children: topBid ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-sm font-semibold tabular-nums text-gray-900", children: formatCHF(topBid.amount) }), _jsx("span", { className: "mt-0.5 truncate text-xs text-gray-400", children: topBid.name })] })) : (_jsx("span", { className: "text-sm text-gray-300", children: "\u2014" })) }), _jsx("div", { className: "flex items-center justify-end py-4 pr-5", children: _jsx("span", { className: `text-sm tabular-nums ${uniqueBidders > 0 ? "font-medium text-gray-900" : "text-gray-300"}`, children: uniqueBidders }) }), _jsx("div", { className: "flex items-center justify-end py-4 pr-5", children: _jsx("span", { className: `text-sm tabular-nums ${bidding.participants.length > 0 ? "font-medium text-gray-900" : "text-gray-300"}`, children: bidding.participants.length }) }), _jsx("div", { className: "flex items-center py-4 pr-5", children: _jsx(Countdown, { deadline: bidding.deadline }) }), _jsx("div", { className: "flex items-center py-4 pr-5", children: _jsxs("span", { className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.cls}`, style: badge.style, children: [badge.dot && (_jsx("span", { className: "h-1.5 w-1.5 rounded-full animate-pulse", style: { backgroundColor: "#288352" } })), badge.label] }) }), _jsx("div", { className: "flex items-center justify-end py-4 pr-5", children: _jsx("button", { onClick: (e) => {
                        e.stopPropagation();
                        navigate("detail", bidding.id);
                    }, className: "whitespace-nowrap rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-white hover:text-gray-900", children: "Deal Room \u2192" }) })] }));
};
export default BiddingRow;
