import React, { useState } from "react";
import { PriceDisplay, ProcessType, type BiddingDocuments, type CreateDraftInput } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";
import StepProperty from "./StepProperty";
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

interface CreateBiddingWizardProps {
  userPlan?: "standard" | "pro" | "enterprise";
}

const CreateBiddingWizard: React.FC<CreateBiddingWizardProps> = ({ userPlan }) => {
  const navigate = useGridbidUiStore((s) => s.navigate);
  const service = useGridbidService();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<CreateDraftInput>(DEFAULT_DRAFT);
  const [activating, setActivating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patchDraft(patch: Partial<CreateDraftInput>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  async function persistAndActivate() {
    setActivating(true);
    setError(null);
    try {
      const bidding = await service.createDraft(draft);
      const activated = await service.activateBidding(bidding.id);
      navigate("detail", activated.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Aktivierung fehlgeschlagen");
      setActivating(false);
    }
  }

  async function persistAsDraft() {
    setError(null);
    try {
      const bidding = await service.createDraft(draft);
      navigate("detail", bidding.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Speichern fehlgeschlagen");
    }
  }

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => navigate("overview")}
          className="mb-6 text-sm text-gray-400 transition-colors hover:text-gray-700"
        >
          ← Zurück zur Übersicht
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Neues Bieterverfahren</h1>
          <p className="mt-1 text-sm text-gray-400">In ca. 2–3 Minuten einsatzbereit</p>
        </div>

        {/* Step indicator */}
        <div className="mb-10 flex gap-2">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                    i < step
                      ? "bg-gray-200 text-gray-600"
                      : i === step
                      ? "bg-gw-600 text-white"
                      : "border border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </span>
                <span
                  className={`text-sm ${
                    i === step ? "font-medium text-gray-900" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="mt-3.5 flex-1 border-t border-gray-200" />
              )}
            </React.Fragment>
          ))}
        </div>

        {error && <p className="mb-4 text-sm text-red-500">Fehler: {error}</p>}

        {step === 0 && (
          <StepProperty
            draft={draft}
            onChange={patchDraft}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <StepProcess
            draft={draft}
            onChange={patchDraft}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepDocuments
            documents={draft.documents ?? DEFAULT_DOCUMENTS}
            onChange={(docs) => patchDraft({ documents: docs })}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <StepActivate
            draft={draft}
            activating={activating}
            userPlan={userPlan}
            onBack={() => setStep(2)}
            onGoToStep={setStep}
            onDeadlineChange={(deadline) => patchDraft({ deadline })}
            onSaveAndActivate={() => void persistAndActivate()}
            onSaveAsDraft={() => void persistAsDraft()}
          />
        )}
      </div>
    </div>
  );
};

export default CreateBiddingWizard;
