import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useGridbidUiStore } from "../../store/gridbidUiStore";
// ── Option data ───────────────────────────────────────────────────────────────
const FINANCING_OPTIONS = [
    {
        value: "open",
        label: "Noch offen",
        description: "Ich prüfe die Finanzierung noch.",
    },
    {
        value: "in_preparation",
        label: "In Vorbereitung",
        description: "Ich plane den Kauf und bereite die Finanzierung vor.",
    },
    {
        value: "confirmed",
        label: "Bereits bestätigt",
        description: "Eine Finanzierungsbestätigung oder Zusage liegt vor.",
    },
];
const TIMING_OPTIONS = [
    { value: "immediately", label: "Sofort — ich bin kaufbereit" },
    { value: "within_3_months", label: "In den nächsten 3 Monaten" },
    { value: "later", label: "Später oder noch offen" },
];
const BUDGET_OPTIONS = [
    { value: "under_600", label: "Bis CHF 600'000" },
    { value: "600_900", label: "CHF 600'000 – 900'000" },
    { value: "900_1300", label: "CHF 900'000 – 1'300'000" },
    { value: "1300_1800", label: "CHF 1'300'000 – 1'800'000" },
    { value: "1800_2500", label: "CHF 1'800'000 – 2'500'000" },
    { value: "over_2500", label: "Über CHF 2'500'000" },
];
const HOUSING_OPTIONS = [
    { value: "renting", label: "Ich miete" },
    { value: "owning", label: "Ich wohne im Eigentum" },
    { value: "other", label: "Andere Situation" },
];
function computeProfileItems(s) {
    const kaufvorhabenDone = !!s.financingStatus && !!s.purchaseTiming;
    const budgetDone = !!s.budgetRange;
    return [
        {
            label: "Kontaktdaten",
            status: "complete",
            text: "Vollständig",
        },
        {
            label: "Kaufvorhaben",
            status: kaufvorhabenDone ? "complete" : "progress",
            text: kaufvorhabenDone ? "Vollständig" : "in Bearbeitung",
        },
        {
            label: "Budget",
            status: budgetDone ? "complete" : "pending",
            text: budgetDone ? "Vollständig" : "Offen",
        },
        {
            label: "Finanzierungsnachweis",
            status: "pending",
            text: "Offen",
        },
        {
            label: "Identitätsverifizierung",
            status: "pending",
            text: "Offen",
        },
    ];
}
// ── Profile status icons ──────────────────────────────────────────────────────
function IconComplete() {
    return (_jsx("svg", { className: "h-3.5 w-3.5 shrink-0 text-green-500", viewBox: "0 0 16 16", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M8 15A7 7 0 108 1a7 7 0 000 14zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z", clipRule: "evenodd" }) }));
}
function IconProgress() {
    return (_jsxs("svg", { className: "h-3.5 w-3.5 shrink-0 text-gw-600", viewBox: "0 0 16 16", fill: "none", children: [_jsx("circle", { cx: "8", cy: "8", r: "7", stroke: "currentColor", strokeWidth: "1.5" }), _jsx("circle", { cx: "8", cy: "8", r: "3", fill: "currentColor" })] }));
}
function IconPending() {
    return (_jsx("svg", { className: "h-3.5 w-3.5 shrink-0 text-gray-300", viewBox: "0 0 16 16", fill: "none", children: _jsx("circle", { cx: "8", cy: "8", r: "7", stroke: "currentColor", strokeWidth: "1.5" }) }));
}
// ── Profilstatus panel (right sidebar) ───────────────────────────────────────
function ProfilstatusPanel({ items }) {
    return (_jsxs("div", { className: "sticky top-6 rounded-xl border border-gray-200 bg-white p-5", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: "Profilstatus" }), _jsx("span", { className: "rounded-full bg-gw-50 px-2 py-0.5 text-xs font-medium text-gw-700", children: "Basiszugang" })] }), _jsx("div", { className: "space-y-1.5", children: items.map((item) => (_jsxs("div", { className: "flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-2.5", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [item.status === "complete" ? _jsx(IconComplete, {}) :
                                    item.status === "progress" ? _jsx(IconProgress, {}) :
                                        _jsx(IconPending, {}), _jsx("span", { className: `truncate text-sm ${item.status === "pending" ? "text-gray-400" : "text-gray-700"}`, children: item.label })] }), _jsx("span", { className: `shrink-0 text-xs font-medium ${item.status === "complete" ? "text-green-600" :
                                item.status === "progress" ? "text-gw-600" :
                                    "text-gray-400"}`, children: item.text })] }, item.label))) }), _jsx("p", { className: "mt-4 border-t border-gray-100 pt-4 text-xs leading-relaxed text-gray-400", children: "Mit vollst\u00E4ndigem Profil schaffst du Vertrauen bei der Agentur und erh\u00E4ltst erweiterten Zugang zu Unterlagen." })] }));
}
// ── Validation ────────────────────────────────────────────────────────────────
function validateStep1(f) {
    const e = {};
    if (!f.firstName.trim())
        e.firstName = "Bitte gib deinen Vornamen ein.";
    if (!f.lastName.trim())
        e.lastName = "Bitte gib deinen Nachnamen ein.";
    if (!f.email.includes("@"))
        e.email = "Bitte gib eine gültige E-Mail-Adresse ein.";
    return e;
}
function validateStep2(f) {
    const e = {};
    if (!f.financingStatus)
        e.financingStatus = "Bitte wähle deine aktuelle Finanzierungssituation aus.";
    if (!f.purchaseTiming)
        e.purchaseTiming = "Bitte gib deinen geplanten Kaufzeitpunkt an.";
    if (!f.termsAccepted)
        e.termsAccepted = "Bitte bestätige die Nutzungsbedingungen, um fortzufahren.";
    return e;
}
function hasErrors(e) {
    return Object.keys(e).length > 0;
}
// ── Component ─────────────────────────────────────────────────────────────────
const BuyerRegistration = () => {
    const navigateBuyer = useGridbidUiStore((s) => s.navigateBuyer);
    const setBuyerRegistration = useGridbidUiStore((s) => s.setBuyerRegistration);
    const switchToAgency = useGridbidUiStore((s) => s.switchToAgency);
    const buyerBidding = useGridbidUiStore((s) => s.buyerBidding);
    const [step, setStep] = useState(1);
    const [step1, setStep1] = useState({
        firstName: "", lastName: "", email: "", phone: "",
    });
    const [step2, setStep2] = useState({
        financingStatus: null, purchaseTiming: null,
        budgetRange: null, housingSituation: null,
        interestedInSimilar: false, termsAccepted: false,
    });
    const [errors1, setErrors1] = useState({});
    const [errors2, setErrors2] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // ── Handlers ────────────────────────────────────────────────────────────────
    function handleStep1Continue() {
        const errs = validateStep1(step1);
        setErrors1(errs);
        if (!hasErrors(errs))
            setStep(2);
    }
    function handleSubmit(e) {
        e.preventDefault();
        const errs = validateStep2(step2);
        setErrors2(errs);
        if (hasErrors(errs) || !step2.financingStatus || !step2.purchaseTiming)
            return;
        setIsSubmitting(true);
        const reg = {
            firstName: step1.firstName.trim(),
            lastName: step1.lastName.trim(),
            email: step1.email.trim(),
            phone: step1.phone.trim(),
            financingStatus: step2.financingStatus,
            purchaseTiming: step2.purchaseTiming,
            budgetRange: step2.budgetRange,
            housingSituation: step2.housingSituation,
            interestedInSimilar: step2.interestedInSimilar,
            // termsAccepted is consent metadata — not stored in buyer profile
        };
        setBuyerRegistration(reg);
        setTimeout(() => navigateBuyer("dealroom"), 800);
    }
    // ── Input class helpers ──────────────────────────────────────────────────────
    const inputBase = "w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:border-gw-500 focus:outline-none transition-colors";
    const inputNormal = `${inputBase} border-gray-200`;
    const inputError = `${inputBase} border-red-400`;
    // ── Render ───────────────────────────────────────────────────────────────────
    return (_jsxs("div", { className: "min-h-full bg-white", children: [_jsx("div", { className: "border-b border-amber-200 bg-amber-50 px-6 py-2.5", children: _jsxs("div", { className: "mx-auto flex max-w-2xl items-center justify-between gap-4", children: [_jsxs("p", { className: "text-xs text-amber-700", children: [_jsx("span", { className: "font-semibold", children: "Vorschau:" }), " So sehen K\u00E4ufer diese Seite."] }), _jsx("button", { onClick: switchToAgency, className: "text-xs font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900", children: "Zur\u00FCck zur Agentur-Ansicht" })] }) }), buyerBidding && (_jsx("div", { className: "border-b border-gray-100 bg-white px-6 py-3", children: _jsxs("div", { className: "mx-auto flex max-w-4xl items-center gap-3", children: [buyerBidding.imageUrl && (_jsx("img", { src: buyerBidding.imageUrl, alt: buyerBidding.title, className: "h-11 w-16 shrink-0 rounded-lg object-cover" })), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "truncate text-sm font-medium text-gray-900", children: buyerBidding.title }), _jsx("p", { className: "truncate text-xs text-gray-400", children: buyerBidding.address })] })] }) })), step === 1 && (_jsxs("div", { className: "mx-auto max-w-lg animate-fade-in px-6 py-10", children: [_jsxs("button", { onClick: () => navigateBuyer("public"), className: "mb-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700", children: [_jsx("svg", { className: "h-4 w-4", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M10 4L6 8l4 4" }) }), "Zur\u00FCck"] }), _jsx("p", { className: "mb-4 text-xs text-gray-400", children: "Schritt 1 von 2" }), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "mb-2 text-xl font-semibold text-gray-900", children: "Zugang zum Deal Room sichern" }), _jsx("p", { className: "text-sm text-gray-500", children: "Gib deine Kontaktdaten ein, um den Zugang zum Deal Room zu sichern." })] }), _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1.5 block text-sm font-medium text-gray-700", children: "Vorname" }), _jsx("input", { type: "text", value: step1.firstName, onChange: (e) => setStep1((s) => ({ ...s, firstName: e.target.value })), placeholder: "Anna", className: errors1.firstName ? inputError : inputNormal }), errors1.firstName && (_jsx("p", { className: "mt-1 text-xs text-red-500", children: errors1.firstName }))] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1.5 block text-sm font-medium text-gray-700", children: "Nachname" }), _jsx("input", { type: "text", value: step1.lastName, onChange: (e) => setStep1((s) => ({ ...s, lastName: e.target.value })), placeholder: "M\u00FCller", className: errors1.lastName ? inputError : inputNormal }), errors1.lastName && (_jsx("p", { className: "mt-1 text-xs text-red-500", children: errors1.lastName }))] })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1.5 block text-sm font-medium text-gray-700", children: "E-Mail-Adresse" }), _jsx("input", { type: "email", value: step1.email, onChange: (e) => setStep1((s) => ({ ...s, email: e.target.value })), placeholder: "anna@beispiel.ch", className: errors1.email ? inputError : inputNormal }), errors1.email && (_jsx("p", { className: "mt-1 text-xs text-red-500", children: errors1.email }))] }), _jsxs("div", { children: [_jsxs("label", { className: "mb-1.5 block text-sm font-medium text-gray-700", children: ["Telefon", " ", _jsx("span", { className: "font-normal text-gray-400", children: "(optional)" })] }), _jsx("input", { type: "tel", value: step1.phone, onChange: (e) => setStep1((s) => ({ ...s, phone: e.target.value })), placeholder: "+41 79 123 45 67", className: inputNormal })] }), _jsx("p", { className: "text-xs text-gray-400", children: "Deine Daten werden vertraulich behandelt und nicht an Dritte weitergegeben." }), _jsx("button", { type: "button", onClick: handleStep1Continue, className: "w-full rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500", children: "Weiter" })] })] }, "step1")), step === 2 && (_jsxs("div", { className: "mx-auto max-w-4xl animate-fade-in px-6 py-10", children: [_jsx("p", { className: "mb-6 text-xs text-gray-400", children: "Schritt 2 von 2" }), _jsxs("div", { className: "flex items-start gap-8", children: [_jsxs("form", { onSubmit: handleSubmit, className: "min-w-0 flex-1 space-y-7", children: [_jsxs("div", { children: [_jsx("h1", { className: "mb-2 text-xl font-semibold text-gray-900", children: "Ein paar kurze Angaben zu deinem Kaufvorhaben" }), _jsx("p", { className: "text-sm text-gray-500", children: "Diese Angaben helfen der Agentur, den Prozess passend zu begleiten und dir den richtigen Zugang zum Deal Room zu geben." })] }), _jsxs("div", { children: [_jsx("p", { className: "mb-3 text-sm font-medium text-gray-700", children: "Wie weit bist du mit der Finanzierung?" }), _jsx("div", { className: "space-y-2", children: FINANCING_OPTIONS.map((opt) => (_jsxs("label", { className: `flex cursor-pointer items-start gap-3 rounded-lg border-2 px-4 py-3.5 transition-colors ${step2.financingStatus === opt.value
                                                        ? "border-gw-600 bg-gw-50"
                                                        : "border-gray-100 hover:border-gray-200"}`, children: [_jsx("input", { type: "radio", name: "financing", value: opt.value, checked: step2.financingStatus === opt.value, onChange: () => setStep2((s) => ({ ...s, financingStatus: opt.value })), className: "mt-0.5 accent-gw-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: opt.label }), _jsx("p", { className: "text-xs text-gray-400", children: opt.description })] })] }, opt.value))) }), errors2.financingStatus && (_jsx("p", { className: "mt-2 text-xs text-red-500", children: errors2.financingStatus }))] }), _jsxs("div", { children: [_jsx("p", { className: "mb-3 text-sm font-medium text-gray-700", children: "Wann planst du den Kauf?" }), _jsx("div", { className: "space-y-2", children: TIMING_OPTIONS.map((opt) => (_jsxs("label", { className: `flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition-colors ${step2.purchaseTiming === opt.value
                                                        ? "border-gw-600 bg-gw-50"
                                                        : "border-gray-100 hover:border-gray-200"}`, children: [_jsx("input", { type: "radio", name: "timing", value: opt.value, checked: step2.purchaseTiming === opt.value, onChange: () => setStep2((s) => ({ ...s, purchaseTiming: opt.value })), className: "accent-gw-600" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: opt.label })] }, opt.value))) }), errors2.purchaseTiming && (_jsx("p", { className: "mt-2 text-xs text-red-500", children: errors2.purchaseTiming }))] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { className: "space-y-6", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wider text-gray-400", children: "Weitere Angaben" }), _jsxs("div", { children: [_jsxs("p", { className: "mb-1 text-sm font-medium text-gray-700", children: ["Ungef\u00E4hres Budget", " ", _jsx("span", { className: "font-normal text-gray-400", children: "(optional)" })] }), _jsx("p", { className: "mb-3 text-xs text-gray-400", children: "Die Angabe hilft bei der Einordnung deines Interesses. Sie hat keinen Einfluss auf die Preisgestaltung des Verfahrens." }), _jsx("div", { className: "flex flex-wrap gap-2", children: BUDGET_OPTIONS.map((opt) => (_jsx("button", { type: "button", onClick: () => setStep2((s) => ({
                                                                ...s,
                                                                budgetRange: s.budgetRange === opt.value ? null : opt.value,
                                                            })), className: `rounded-full border px-3 py-1.5 text-sm transition-colors ${step2.budgetRange === opt.value
                                                                ? "border-gw-600 bg-gw-50 font-medium text-gw-700"
                                                                : "border-gray-200 text-gray-600 hover:border-gray-300"}`, children: opt.label }, opt.value))) })] }), _jsxs("div", { children: [_jsxs("p", { className: "mb-2 text-xs text-gray-500", children: ["Wie wohnst du aktuell?", " ", _jsx("span", { className: "text-gray-300", children: "(optional)" })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: HOUSING_OPTIONS.map((opt) => (_jsx("button", { type: "button", onClick: () => setStep2((s) => ({
                                                                ...s,
                                                                housingSituation: s.housingSituation === opt.value ? null : opt.value,
                                                            })), className: `rounded-full border px-3 py-1.5 text-xs transition-colors ${step2.housingSituation === opt.value
                                                                ? "border-gw-600 bg-gw-50 font-medium text-gw-700"
                                                                : "border-gray-200 text-gray-500 hover:border-gray-300"}`, children: opt.label }, opt.value))) })] })] }), _jsx("hr", { className: "border-gray-100" }), _jsxs("div", { children: [_jsxs("label", { className: "flex cursor-pointer items-start gap-3", children: [_jsx("input", { type: "checkbox", checked: step2.termsAccepted, onChange: (e) => setStep2((s) => ({ ...s, termsAccepted: e.target.checked })), className: "mt-0.5 accent-gw-600" }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Ich best\u00E4tige, dass meine Angaben der Wahrheit entsprechen, und stimme den", " ", _jsx("a", { href: "#", className: "underline underline-offset-2 hover:text-gray-900", onClick: (e) => e.stopPropagation(), children: "Nutzungsbedingungen" }), " ", "von Gridbid zu."] })] }), errors2.termsAccepted && (_jsx("p", { className: "mt-1.5 text-xs text-red-500", children: errors2.termsAccepted }))] }), _jsxs("label", { className: "flex cursor-pointer items-start gap-3", children: [_jsx("input", { type: "checkbox", checked: step2.interestedInSimilar, onChange: (e) => setStep2((s) => ({ ...s, interestedInSimilar: e.target.checked })), className: "mt-0.5 accent-gw-600" }), _jsx("p", { className: "text-sm text-gray-500", children: "Ich bin auch an \u00E4hnlichen Objekten in dieser Region interessiert." })] }), _jsx("p", { className: "text-center text-xs text-gray-400", children: "Deine Angaben sind nur f\u00FCr die zust\u00E4ndige Agentur sichtbar." }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { type: "button", onClick: () => setStep(1), className: "flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700", children: [_jsx("svg", { className: "h-4 w-4", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M10 4L6 8l4 4" }) }), "Zur\u00FCck"] }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 rounded-xl bg-gw-600 px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-gw-500 disabled:cursor-not-allowed disabled:opacity-50", children: isSubmitting ? "Wird vorbereitet …" : "Deal Room öffnen" })] })] }), _jsx("div", { className: "w-60 shrink-0", children: _jsx(ProfilstatusPanel, { items: computeProfileItems(step2) }) })] })] }, "step2"))] }));
};
export default BuyerRegistration;
