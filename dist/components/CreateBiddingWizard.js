import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from "react";
import { PriceDisplay, ProcessType } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";
import StepProperty from "./StepProperty";
import StepProcess from "./StepProcess";
import StepDocuments from "./StepDocuments";
import StepActivate from "./StepActivate";
const STEPS = ["Objekt", "Prozess", "Dokumente", "Starten"];
const DEFAULT_DOCUMENTS = {
    level1: ["Verkaufsbroschüre", "Grundrisse", "Fotos"],
    level2: ["Grundbuchauszug", "Baubeschrieb", "Renovationsinfos"],
    level3: ["Reservierungsvereinbarung", "Rechtsdokumente"],
};
const DEFAULT_DRAFT = {
    title: "",
    address: "",
    websiteUrl: undefined,
    processType: ProcessType.SEALED_BID,
    priceDisplay: PriceDisplay.HIDDEN,
    deadline: null,
    roundsPlanned: 1,
    biddingRules: "",
    documents: DEFAULT_DOCUMENTS,
};
const CreateBiddingWizard = ({ userPlan }) => {
    const navigate = useGridbidUiStore((s) => s.navigate);
    const service = useGridbidService();
    const [step, setStep] = useState(0);
    const [draft, setDraft] = useState(DEFAULT_DRAFT);
    const [activating, setActivating] = useState(false);
    const [error, setError] = useState(null);
    function patchDraft(patch) {
        setDraft((prev) => ({ ...prev, ...patch }));
    }
    async function persistAndActivate() {
        setActivating(true);
        setError(null);
        try {
            const bidding = await service.createDraft(draft);
            const activated = await service.activateBidding(bidding.id);
            navigate("detail", activated.id);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Aktivierung fehlgeschlagen");
            setActivating(false);
        }
    }
    async function persistAsDraft() {
        setError(null);
        try {
            const bidding = await service.createDraft(draft);
            navigate("detail", bidding.id);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
        }
    }
    return (_jsx("div", { className: "px-6 py-8", children: _jsxs("div", { className: "mx-auto max-w-3xl", children: [_jsx("button", { onClick: () => navigate("overview"), className: "mb-6 text-sm text-gray-400 transition-colors hover:text-gray-700", children: "\u2190 Zur\u00FCck zur \u00DCbersicht" }), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Neues Bieterverfahren" }), _jsx("p", { className: "mt-1 text-sm text-gray-400", children: "In ca. 2\u20133 Minuten einsatzbereit" })] }), _jsx("div", { className: "mb-10 flex gap-2", children: STEPS.map((label, i) => (_jsxs(React.Fragment, { children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("span", { className: `flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${i < step
                                            ? "bg-gray-200 text-gray-600"
                                            : i === step
                                                ? "bg-gw-600 text-white"
                                                : "border border-gray-300 bg-white text-gray-400"}`, children: i < step ? "✓" : i + 1 }), _jsx("span", { className: `text-sm ${i === step ? "font-medium text-gray-900" : "text-gray-400"}`, children: label })] }), i < STEPS.length - 1 && (_jsx("span", { className: "mt-3.5 flex-1 border-t border-gray-200" }))] }, label))) }), error && _jsxs("p", { className: "mb-4 text-sm text-red-500", children: ["Fehler: ", error] }), step === 0 && (_jsx(StepProperty, { draft: draft, onChange: patchDraft, onNext: () => setStep(1) })), step === 1 && (_jsx(StepProcess, { draft: draft, onChange: patchDraft, onBack: () => setStep(0), onNext: () => setStep(2) })), step === 2 && (_jsx(StepDocuments, { documents: draft.documents ?? DEFAULT_DOCUMENTS, onChange: (docs) => patchDraft({ documents: docs }), onBack: () => setStep(1), onNext: () => setStep(3) })), step === 3 && (_jsx(StepActivate, { draft: draft, activating: activating, userPlan: userPlan, onBack: () => setStep(2), onGoToStep: setStep, onSaveAndActivate: () => void persistAndActivate(), onSaveAsDraft: () => void persistAsDraft() }))] }) }));
};
export default CreateBiddingWizard;
