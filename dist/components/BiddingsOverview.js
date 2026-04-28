import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";
import BiddingRow, { ROW_GRID } from "./BiddingCard";
const HEADERS = [
    { label: "", align: "" }, // photo
    { label: "Objekt", align: "" },
    { label: "Höchstgebot", align: "text-right" },
    { label: "Gebote", align: "text-right" },
    { label: "Teilnehmer", align: "text-right" },
    { label: "Frist", align: "" },
    { label: "Status", align: "" },
    { label: "", align: "text-right" }, // action
];
const BiddingsOverview = () => {
    const navigate = useGridbidUiStore((s) => s.navigate);
    const service = useGridbidService();
    const [biddings, setBiddings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
        setError(null);
        service
            .listBiddings()
            .then((data) => {
            setBiddings(data);
            setLoading(false);
        })
            .catch((err) => {
            setError(err instanceof Error ? err.message : "Unbekannter Fehler");
            setLoading(false);
        });
    }, [service]);
    if (loading) {
        return (_jsx("div", { className: "flex h-40 items-center justify-center text-sm text-gray-400", children: "Wird geladen\u2026" }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex h-40 items-center justify-center text-sm text-red-500", children: ["Fehler: ", error] }));
    }
    return (_jsx("div", { className: "px-6 py-8", children: _jsxs("div", { className: "mx-auto max-w-6xl", children: [_jsxs("div", { className: "mb-6 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-semibold text-gray-900", children: "Bieterverfahren" }), biddings.length > 0 && (_jsxs("p", { className: "mt-0.5 text-sm text-gray-400", children: [biddings.length, " Verfahren"] }))] }), _jsx("button", { onClick: () => navigate("create"), className: "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500", children: "+ Neues Verfahren" })] }), biddings.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400", children: "Noch keine Verfahren vorhanden." })) : (_jsxs("div", { className: "overflow-hidden rounded-lg border border-gray-200 bg-white", children: [_jsx("div", { className: `grid ${ROW_GRID} border-b border-gray-100 bg-gray-50`, children: HEADERS.map((h, i) => (_jsx("div", { className: `py-3 text-xs font-medium uppercase tracking-wide text-gray-400 ${h.align} ${i === 0
                                    ? "pl-0 pr-0" // image col — no padding
                                    : i === HEADERS.length - 1
                                        ? "pr-5"
                                        : "pr-5"}`, children: h.label }, i))) }), biddings.map((b) => (_jsx(BiddingRow, { bidding: b }, b.id)))] }))] }) }));
};
export default BiddingsOverview;
