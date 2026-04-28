import React, { useState } from "react";
import { ProcessType, PriceDisplay, type CreateDraftInput } from "../types/domain";
import { PROCESS_LABEL, PRICE_LABEL, formatDeadline } from "../utils/labels";

type UserPlan = "standard" | "pro" | "enterprise";
type DeadlineChoice = null | "open" | "fixed";

interface StepActivateProps {
  draft: CreateDraftInput;
  activating: boolean;
  userPlan?: UserPlan;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onDeadlineChange: (deadline: string | null) => void;
  onSaveAndActivate: () => void;
  onSaveAsDraft: () => void;
}

const NACH_DEM_START = [
  "Das Verfahren ist sofort aktiv — Interessenten können sich registrieren.",
  "Gebote sind erst für dich sichtbar, nicht für andere Bieter.",
  "Du kannst das Verfahren jederzeit pausieren oder beenden.",
];

const SMART_MATCHING_BULLETS = [
  "Erhöht die Reichweite deines Verfahrens",
  "Schlägt dein Objekt passenden Kaufinteressenten vor",
  "Spart CHF 60 bei Abschluss",
];

const StepActivate: React.FC<StepActivateProps> = ({
  draft,
  activating,
  userPlan = "standard",
  onBack,
  onGoToStep,
  onDeadlineChange,
  onSaveAndActivate,
  onSaveAsDraft,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [smartMatching, setSmartMatching] = useState(false);
  const [deadlineChoice, setDeadlineChoice] = useState<DeadlineChoice>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [termsHighlight, setTermsHighlight] = useState(false);

  const hasTitle = (draft.title?.trim().length ?? 0) > 0;
  const hasDeadline = draft.deadline != null;
  const deadlineResolved = hasDeadline || deadlineChoice === "open";
  const canActivate = hasTitle && termsAccepted && deadlineResolved;
  const isPaidPlan = userPlan === "pro" || userPlan === "enterprise";
  const fee = smartMatching ? 290 : 350;

  const docs = draft.documents ?? { level1: [], level2: [], level3: [] };
  const totalDocs = docs.level1.length + docs.level2.length + docs.level3.length;
  const docSummary =
    totalDocs === 0
      ? "Noch keine Dokumente"
      : `${docs.level1.length} / ${docs.level2.length} / ${docs.level3.length} nach Phase`;

  const rounds = draft.roundsPlanned ?? 1;
  const processLabel = PROCESS_LABEL[draft.processType ?? ProcessType.SEALED_BID];
  const processDetail = `${processLabel} · ${rounds} Runde${rounds !== 1 ? "n" : ""}`;

  // Dynamic subtitle — becomes decisive once all blockers are cleared
  const subtitle = canActivate
    ? "Alles bereit — starte dein Bieterverfahren."
    : "Prüfe deine Angaben und starte das Verfahren.";

  function getHelperText(): string | null {
    if (!hasTitle) return "Objekt-Titel fehlt — bitte geh zurück zu Schritt 1.";
    if (!deadlineResolved && !termsAccepted)
      return "Frist-Entscheidung und Nutzungsbedingungen fehlen noch.";
    if (!deadlineResolved) return "Bitte wähle eine Frist-Option.";
    if (!termsAccepted) return "Bitte akzeptiere die Nutzungsbedingungen.";
    return null;
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setSelectedDate(val);
    if (val) {
      onDeadlineChange(new Date(val).toISOString());
    }
  }

  function handleResetDeadline() {
    setDeadlineChoice(null);
    setSelectedDate("");
    onDeadlineChange(null);
  }

  function handleStartClick() {
    setSubmitAttempted(true);
    if (!termsAccepted) {
      setTermsHighlight(true);
      setTimeout(() => setTermsHighlight(false), 800);
    }
    if (canActivate && !activating) {
      onSaveAndActivate();
    }
  }

  const helperText = submitAttempted ? getHelperText() : null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Bieterverfahren starten</h2>
        <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>
      </div>

      {/* Confirmation strip — no section heading */}
      <div className="rounded-lg border border-zinc-200 bg-white">
        <dl className="flex flex-col divide-y divide-zinc-100 text-sm">
          <ConfirmationRow
            label="Objekt"
            value={[draft.title, draft.address].filter(Boolean).join(" · ") || "—"}
            actionLabel="Ändern"
            onAction={() => onGoToStep(0)}
          />
          <ConfirmationRow
            label="Verfahren"
            value={processDetail}
            actionLabel="Anpassen"
            onAction={() => onGoToStep(1)}
          />
          <ConfirmationRow
            label="Preisorientierung"
            value={PRICE_LABEL[draft.priceDisplay ?? PriceDisplay.HIDDEN]}
            actionLabel="Anpassen"
            onAction={() => onGoToStep(1)}
          />
          <DeadlineRow
            deadline={draft.deadline ?? null}
            deadlineChoice={deadlineChoice}
            selectedDate={selectedDate}
            onChooseFixed={() => setDeadlineChoice("fixed")}
            onChooseOpen={() => setDeadlineChoice("open")}
            onDateChange={handleDateChange}
            onReset={handleResetDeadline}
          />
          <ConfirmationRow
            label="Dokumente"
            value={docSummary}
            actionLabel="Verwalten"
            onAction={() => onGoToStep(2)}
          />
        </dl>
      </div>

      {/* Smart Matching + Pricing */}
      {!isPaidPlan ? (
        <div className="rounded-lg border border-zinc-200 bg-white px-5 py-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={smartMatching}
              onChange={(e) => setSmartMatching(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-300 text-gw-600 focus:ring-gw-500"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-zinc-800">Smart Matching</span>
              <ul className="mt-1.5 flex flex-col gap-1">
                {SMART_MATCHING_BULLETS.map((item) => (
                  <li key={item} className="flex items-baseline gap-1.5">
                    <span className="text-xs text-zinc-300">+</span>
                    <span className="text-xs text-zinc-500">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </label>

          <div className="mt-4 border-t border-zinc-100 pt-4">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-zinc-500">Heute fällig</span>
              <span className="font-semibold text-zinc-800">CHF 0.–</span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between text-sm">
              <span className="text-zinc-500">Bei Abschluss</span>
              <div className="flex items-baseline gap-2">
                {smartMatching && (
                  <span className="text-xs text-zinc-400 line-through">CHF 350</span>
                )}
                <span
                  className={`font-semibold ${smartMatching ? "text-gw-600" : "text-zinc-800"}`}
                >
                  CHF {fee}.–
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-zinc-400">Nur bei erfolgreichem Verkauf.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3">
          <span className="text-sm text-gw-600">✓</span>
          <span className="text-sm text-zinc-500">
            In deinem Tarif enthalten — keine Erfolgsgebühr.
          </span>
        </div>
      )}

      {/* Nach dem Start */}
      <div className="pl-1">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Nach dem Start
        </p>
        <ul className="flex flex-col gap-2 border-l-2 border-zinc-100 pl-4">
          {NACH_DEM_START.map((line) => (
            <li key={line} className="text-sm text-zinc-500">
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Terms — own card, clearly required */}
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3.5 transition-all duration-150 ${
          termsHighlight
            ? "border-red-300 bg-red-50 ring-2 ring-red-200 ring-offset-1"
            : submitAttempted && !termsAccepted
            ? "border-red-200 bg-red-50"
            : "border-zinc-200 bg-white hover:bg-zinc-50"
        }`}
      >
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-zinc-300 text-gw-600 focus:ring-gw-500"
        />
        <div>
          <span className="text-sm text-zinc-600">
            Ich akzeptiere die{" "}
            <span className="font-medium text-zinc-800">Nutzungsbedingungen von Gridbid</span>
          </span>
          {!termsAccepted && (
            <p className="mt-0.5 text-xs text-zinc-400">
              Erforderlich, um das Verfahren zu starten
            </p>
          )}
        </div>
      </label>

      {/* Footer — commit zone */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-700"
        >
          Zurück
        </button>
        <div className="flex flex-col items-end gap-1.5">
          {!isPaidPlan && (
            <p className="text-xs text-zinc-400">
              CHF 0.– heute · CHF {fee}.– bei Abschluss
            </p>
          )}
          {helperText && <p className="text-xs text-red-500">{helperText}</p>}
          <button
            onClick={handleStartClick}
            disabled={activating}
            className="rounded-lg bg-gw-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gw-500 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none"
          >
            {activating ? "Wird gestartet…" : "Bieterverfahren starten →"}
          </button>
          <button
            onClick={onSaveAsDraft}
            disabled={activating}
            className="text-xs text-zinc-400 transition-colors hover:text-zinc-600"
          >
            Als Entwurf speichern
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConfirmationRow({
  label,
  value,
  actionLabel,
  onAction,
}: {
  label: string;
  value: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-baseline gap-4 px-5 py-3">
      <dt className="w-32 shrink-0 text-sm text-zinc-400">{label}</dt>
      <dd className="flex-1 text-sm text-zinc-800">{value}</dd>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="shrink-0 text-xs text-zinc-400 transition-colors hover:text-zinc-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/**
 * Deadline row — three render states:
 *   resolved-date  draft.deadline is set → show date + "Ändern"
 *   resolved-open  choice === "open"     → show "Offen" + "Ändern"
 *   decision       everything else       → full decision widget (radio cards + optional date input)
 *
 * Product decision: explicit choice required (Position B).
 * "Offen lassen" is always available — unresolved means the user hasn't decided yet.
 */
function DeadlineRow({
  deadline,
  deadlineChoice,
  selectedDate,
  onChooseFixed,
  onChooseOpen,
  onDateChange,
  onReset,
}: {
  deadline: string | null;
  deadlineChoice: DeadlineChoice;
  selectedDate: string;
  onChooseFixed: () => void;
  onChooseOpen: () => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}) {
  // Resolved: a specific date is set
  if (deadline) {
    return (
      <ConfirmationRow
        label="Frist"
        value={formatDeadline(deadline)}
        actionLabel="Ändern"
        onAction={onReset}
      />
    );
  }

  // Resolved: explicitly left open
  if (deadlineChoice === "open") {
    return (
      <ConfirmationRow
        label="Frist"
        value="Offen — kein Ablaufdatum"
        actionLabel="Ändern"
        onAction={onReset}
      />
    );
  }

  // Decision required — renders as an expanded block within the strip
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="px-5 py-4">
      <div className="mb-3 flex items-baseline gap-4">
        <dt className="w-32 shrink-0 text-sm text-zinc-400">Frist</dt>
        <dd className="text-sm text-zinc-500">Wie soll das Verfahren enden?</dd>
      </div>

      <div className="ml-32 grid grid-cols-2 gap-2.5">
        {/* Option A: Set an end date */}
        <button
          onClick={onChooseFixed}
          className={`rounded-lg border-2 p-3.5 text-left transition-colors ${
            deadlineChoice === "fixed"
              ? "border-gw-600 bg-gw-50"
              : "border-zinc-200 hover:border-zinc-300 bg-white"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-zinc-800">Enddatum setzen</span>
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              Empfohlen
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Mehr Verbindlichkeit, klarer Abschluss
          </p>
        </button>

        {/* Option B: Leave open */}
        <button
          onClick={onChooseOpen}
          className="rounded-lg border-2 border-zinc-200 bg-white p-3.5 text-left transition-colors hover:border-zinc-300"
        >
          <span className="text-sm font-medium text-zinc-800">Offen lassen</span>
          <p className="mt-1 text-xs text-zinc-500">
            Kein Ablaufdatum, maximale Flexibilität
          </p>
        </button>
      </div>

      {/* Date picker — appears once "Enddatum setzen" is chosen */}
      {deadlineChoice === "fixed" && (
        <div className="ml-32 mt-3">
          <input
            type="date"
            value={selectedDate}
            onChange={onDateChange}
            min={today}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 focus:border-gw-500 focus:outline-none focus:ring-1 focus:ring-gw-500"
          />
          {!selectedDate && (
            <p className="mt-1.5 text-xs text-zinc-400">Wähle ein Datum, um fortzufahren.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default StepActivate;
