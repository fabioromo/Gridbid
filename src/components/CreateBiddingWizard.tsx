import React, { useRef, useState } from "react";
import { PriceDisplay, ProcessType, type BiddingDocuments, type CreateDraftInput, type GridbidBidding } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";
import StepProcess from "./StepProcess";
import StepDocuments from "./StepDocuments";
import StepActivate from "./StepActivate";

const STEPS = ["Objekt", "Prozess", "Dokumente", "Starten"];

const DEFAULT_DOCUMENTS: BiddingDocuments = {
  level1: ["Verkaufsbroschüre", "Grundrisse", "Fotos"],
  level2: ["Grundbuchauszug", "Baubeschrieb", "Renovationsinfos"],
  level3: ["Reservierungsvereinbarung", "Rechtsdokumente"],
};

const DEFAULT_DRAFT: CreateDraftInput = {
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

// ── Icons ─────────────────────────────────────────────────────────────────────

const GridBidLogoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#4782f3" aria-hidden="true">
    <circle cx="12" cy="12"   r="2.63" />
    <circle cx="12" cy="7"    r="2.63" />
    <circle cx="12" cy="17"   r="2.63" />
    <circle cx="7"  cy="12"   r="2.63" />
    <circle cx="17" cy="12"   r="2.63" />
    <circle cx="7"  cy="7"    r="2.07" />
    <circle cx="17" cy="7"    r="2.07" />
    <circle cx="7"  cy="17"   r="2.07" />
    <circle cx="17" cy="17"   r="2.07" />
    <circle cx="12" cy="1.84" r="1.84" />
    <circle cx="12" cy="22.2" r="1.84" />
    <circle cx="1.84" cy="12" r="1.84" />
    <circle cx="22.2" cy="12" r="1.84" />
    <circle cx="7"    cy="1.84" r="1.22" />
    <circle cx="17"   cy="1.84" r="1.22" />
    <circle cx="7"    cy="22.2" r="1.22" />
    <circle cx="17"   cy="22.2" r="1.22" />
    <circle cx="1.84" cy="7"    r="1.22" />
    <circle cx="22.2" cy="7"    r="1.22" />
    <circle cx="1.84" cy="17"   r="1.22" />
    <circle cx="22.2" cy="17"   r="1.22" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 3L13 13M13 3L3 13" stroke="#182024" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ImagePlaceholderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1" y="2.5" width="14" height="11" rx="1" stroke="#182024" strokeWidth="1.2" />
    <circle cx="5" cy="6.5" r="1.5" stroke="#182024" strokeWidth="1.2" />
    <path d="M1 11L5 8L8 10.5L11 7.5L15 11" stroke="#182024" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Step indicator ────────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ step: number }> = ({ step }) => (
  <div className="flex items-center">
    {STEPS.map((label, i) => (
      <React.Fragment key={label}>
        <div className="flex items-center gap-3">
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-base font-medium leading-none ${
              i === step
                ? "bg-[#182024] text-white"
                : "bg-[#e8e9e9] text-[#73787a]"
            }`}
          >
            {i + 1}
          </span>
          <span
            className={`whitespace-nowrap text-sm font-medium ${
              i === step ? "text-[#182024]" : "text-[#73787a]"
            }`}
          >
            {label}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div className="mx-2 h-px min-w-[16px] flex-1 bg-[#e8e9e9]" />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ── Labelled field wrapper ────────────────────────────────────────────────────

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-3">
    <span className="text-sm font-medium text-[#182024]">{label}</span>
    {children}
  </div>
);

const inputClass =
  "w-full rounded border border-[#e8e9e9] bg-white px-3 py-3 text-base text-[#182024] placeholder-[#d1d2d3] outline-none transition-colors focus:border-[#73787a]";

// ── Main component ────────────────────────────────────────────────────────────

interface CreateBiddingWizardProps {
  userPlan?: "standard" | "pro" | "enterprise";
  initialDraft?: GridbidBidding;
}

const CreateBiddingWizard: React.FC<CreateBiddingWizardProps> = ({ userPlan, initialDraft }) => {
  const navigate = useGridbidUiStore((s) => s.navigate);
  const service = useGridbidService();
  const [step, setStep] = useState(initialDraft?.wizardStep ?? 0);
  const [draft, setDraft] = useState<CreateDraftInput>(
    initialDraft
      ? {
          title: initialDraft.title,
          address: initialDraft.address,
          websiteUrl: initialDraft.websiteUrl,
          imageUrl: initialDraft.imageUrl,
          processType: initialDraft.processType,
          priceDisplay: initialDraft.priceDisplay,
          richtpreis: initialDraft.richtpreis ?? undefined,
          listingPrice: initialDraft.listingPrice ?? undefined,
          deadline: initialDraft.deadline,
          roundsPlanned: initialDraft.roundsPlanned,
          biddingRules: initialDraft.biddingRules,
          documents: initialDraft.documents,
        }
      : DEFAULT_DRAFT
  );
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function patchDraft(patch: Partial<CreateDraftInput>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function advanceStep(nextStep: number) {
    if (initialDraft) {
      try {
        await service.updateBidding(initialDraft.id, { ...draft, wizardStep: nextStep });
      } catch {
        // non-blocking — step advance is local even if save fails
      }
    }
    setStep(nextStep);
  }

  async function persistAndActivate() {
    setActivating(true);
    setError(null);
    try {
      if (initialDraft) {
        await service.updateBidding(initialDraft.id, draft);
        const activated = await service.activateBidding(initialDraft.id);
        navigate("detail", activated.id, activated);
      } else {
        const bidding = await service.createDraft(draft);
        const activated = await service.activateBidding(bidding.id);
        navigate("detail", activated.id, activated);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Aktivierung fehlgeschlagen");
      setActivating(false);
    }
  }

  async function persistAsDraft() {
    setError(null);
    try {
      if (initialDraft) {
        await service.updateBidding(initialDraft.id, { ...draft, wizardStep: step });
      } else {
        await service.createDraft({ ...draft, wizardStep: step });
      }
      navigate("overview");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        patchDraft({ imageUrl: ev.target.result });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* ── Top bar ── */}
      <header className="flex shrink-0 h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <GridBidLogoIcon />
          <span className="text-sm font-semibold tracking-tight text-[#182024]">GridBid</span>
        </div>
        <button
          type="button"
          onClick={() => navigate("overview")}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-[#e8e9e9]"
          aria-label="Schliessen"
        >
          <CloseIcon />
        </button>
      </header>
      <div className="h-px bg-[#e8e9e9]" />

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-6 pb-10 pt-10">
          <h1 className="mb-8 text-3xl font-bold text-[#182024]">Neues Bieterverfahren</h1>

          <div className="mb-8">
            <StepIndicator step={step} />
          </div>

          {error && (
            <p className="mb-4 text-sm text-red-500">Fehler: {error}</p>
          )}

          {/* ── Step 0: property form (inlined, replaces StepProperty) ── */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-[#182024]">Was sind die Objektdetails?</h2>
              </div>

              <Field label="Bezeichnung">
                <input
                  type="text"
                  value={draft.title ?? ""}
                  onChange={(e) => patchDraft({ title: e.target.value })}
                  placeholder="z. B. Einfamilienhaus in Basel"
                  className={inputClass}
                />
              </Field>

              <Field label="Adresse">
                <input
                  type="text"
                  value={draft.address ?? ""}
                  onChange={(e) => patchDraft({ address: e.target.value })}
                  placeholder="z. B. Musterstrasse 18, 1244 Basel"
                  className={inputClass}
                />
              </Field>

              <Field label="Link zur Vermarktung (optional)">
                <input
                  type="url"
                  value={draft.websiteUrl ?? ""}
                  onChange={(e) => patchDraft({ websiteUrl: e.target.value || undefined })}
                  placeholder="https://link-zum-inserat.ch"
                  className={inputClass}
                />
              </Field>

              <Field label="Objektbild">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#d1d2d3] bg-[#fafafa] py-4 transition-colors hover:bg-[#f0f0f0]"
                >
                  {draft.imageUrl ? (
                    <img
                      src={draft.imageUrl}
                      alt="Objektbild"
                      className="max-h-48 rounded object-contain"
                    />
                  ) : (
                    <>
                      <ImagePlaceholderIcon />
                      <span className="text-sm font-medium text-[#182024]">
                        Bild auswählen oder hier ablegen
                      </span>
                    </>
                  )}
                </button>
              </Field>
            </div>
          )}

          {/* ── Steps 1–3: existing step components ── */}
          {step === 1 && (
            <StepProcess
              draft={draft}
              onChange={patchDraft}
              onBack={() => setStep(0)}
              onNext={() => void advanceStep(2)}
            />
          )}
          {step === 2 && (
            <StepDocuments
              documents={draft.documents ?? DEFAULT_DOCUMENTS}
              onChange={(docs) => patchDraft({ documents: docs })}
              onBack={() => setStep(1)}
              onNext={() => void advanceStep(3)}
            />
          )}
          {step === 3 && (
            <StepActivate
              draft={draft}
              activating={activating}
              userPlan={userPlan}
              propertyImage={draft.imageUrl ?? null}
              termsAccepted={termsAccepted}
              onTermsChange={setTermsAccepted}
              onBack={() => setStep(2)}
              onGoToStep={(s) => void advanceStep(s)}
              onDeadlineChange={(deadline) => patchDraft({ deadline })}
              onSaveAndActivate={() => void persistAndActivate()}
              onSaveAsDraft={() => void persistAsDraft()}
            />
          )}
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <footer className="shrink-0 border-t border-[#e8e9e9] bg-white">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            {step >= 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                aria-label="Zurück"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#2f363a] transition-colors hover:bg-[#e8e9e9]"
              >
                <ArrowLeftIcon />
              </button>
            )}
            <button
              type="button"
              onClick={() => void persistAsDraft()}
              className="rounded-full px-4 py-2 text-sm font-medium text-[#2f363a] transition-colors hover:bg-[#e8e9e9]"
            >
              Als Entwurf speichern
            </button>
          </div>

          {step === 0 && (
            <button
              type="button"
              onClick={() => void advanceStep(1)}
              className="flex items-center gap-2 rounded-full bg-[#182024] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2f363a]"
            >
              Weiter
              <ArrowRightIcon />
            </button>
          )}
          {step === 1 && (
            <button
              type="button"
              onClick={() => void advanceStep(2)}
              className="flex items-center gap-2 rounded-full bg-[#182024] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2f363a]"
            >
              Weiter
              <ArrowRightIcon />
            </button>
          )}
          {step === 2 && (
            <button
              type="button"
              onClick={() => void advanceStep(3)}
              className="flex items-center gap-2 rounded-full bg-[#182024] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2f363a]"
            >
              Verfahren prüfen
              <ArrowRightIcon />
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              onClick={() => void persistAndActivate()}
              disabled={!termsAccepted || activating}
              className="flex items-center gap-2 rounded-full bg-[#182024] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2f363a] disabled:cursor-not-allowed disabled:bg-[#e8e9e9] disabled:text-[#73787a]"
            >
              {activating ? "Wird gestartet…" : "Bieterverfahren starten →"}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default CreateBiddingWizard;
