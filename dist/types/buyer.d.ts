export type FinancingStatus = "open" | "in_preparation" | "confirmed";
export type PurchaseTiming = "immediately" | "within_3_months" | "later";
export type BudgetRange = "under_600" | "600_900" | "900_1300" | "1300_1800" | "1800_2500" | "over_2500";
export type HousingSituation = "renting" | "owning" | "other";
export type BuyerAccessTier = "basic" | "verified" | "full";
export interface BuyerRegistration {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    financingStatus: FinancingStatus;
    purchaseTiming: PurchaseTiming;
    budgetRange: BudgetRange | null;
    housingSituation: HousingSituation | null;
    interestedInSimilar: boolean;
}
export type BuyerView = "public" | "register" | "dealroom";
export type BuyerDealRoomTab = "overview" | "documents" | "qa" | "bid";
