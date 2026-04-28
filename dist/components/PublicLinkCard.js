import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { BiddingStatus } from "../types/domain";
const PublicLinkCard = ({ status, url }) => {
    const [copied, setCopied] = useState(false);
    if (status === BiddingStatus.DRAFT) {
        return (_jsxs("div", { className: "rounded-lg border border-gray-200 bg-white p-5", children: [_jsx("p", { className: "mb-1.5 text-xs font-medium text-gray-400", children: "\u00D6ffentlicher Link" }), _jsx("p", { className: "text-sm text-gray-400", children: "Noch nicht aktiv \u2013 kein \u00F6ffentlicher Link verf\u00FCgbar." })] }));
    }
    if (!url)
        return null;
    function handleCopy() {
        void navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }
    return (_jsxs("div", { className: "rounded-lg border border-blue-200 bg-blue-50 p-5", children: [_jsx("p", { className: "mb-3 text-xs font-medium text-blue-600", children: "\u00D6ffentlicher Link" }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "flex-1 truncate rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-mono text-sm text-gray-700", children: url }), _jsx("button", { onClick: handleCopy, className: "rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500", children: copied ? "Kopiert!" : "Kopieren" })] })] }));
};
export default PublicLinkCard;
