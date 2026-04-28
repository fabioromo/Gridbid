// ── Financing ─────────────────────────────────────────────────────────────────
export type FinancingStatus =
  | "open"           // Noch offen
  | "in_preparation" // In Vorbereitung
  | "confirmed";     // Bereits bestätigt

// ── Purchase timing ───────────────────────────────────────────────────────────
export type PurchaseTiming =
  | "immediately"     // Sofort
  | "within_3_months" // In den nächsten 3 Monaten
  | "later";          // Später oder noch offen

// ── Budget (optional) ─────────────────────────────────────────────────────────
export type BudgetRange =
  | "under_600"
  | "600_900"
  | "900_1300"
  | "1300_1800"
  | "1800_2500"
  | "over_2500";

// ── Housing situation (optional) ──────────────────────────────────────────────
export type HousingSituation =
  | "renting" // Ich miete
  | "owning"  // Ich wohne im Eigentum
  | "other";  // Andere Situation

// ── Access tier (platform logic — stored separately in Zustand) ───────────────
export type BuyerAccessTier = "basic" | "verified" | "full";

// ── Registration (buyer-supplied data only) ───────────────────────────────────
export interface BuyerRegistration {
  // Step 1 — required (phone is empty string if omitted)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Step 2 — required
  financingStatus: FinancingStatus;
  purchaseTiming: PurchaseTiming;

  // Step 2 — optional
  budgetRange: BudgetRange | null;
  housingSituation: HousingSituation | null;
  interestedInSimilar: boolean;
}

// ── Access tier (platform logic — stored separately in Zustand) ───────────────
// Level is a display label only. Signals are decision-critical.
// Never infer offer quality from level alone — always read BuyerVerificationSignals directly.
export type BuyerLevel = "level1" | "level2" | "level3";

// ── Verification signals ──────────────────────────────────────────────────────
export interface BuyerVerificationSignals {
  idUploaded: boolean;
  financingProofUploaded: boolean;
}

// ── Navigation ────────────────────────────────────────────────────────────────
export type BuyerView = "public" | "register" | "dealroom";
export type BuyerDealRoomTab = "overview" | "documents" | "qa" | "bid";
