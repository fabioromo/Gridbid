import { BiddingStatus, PriceDisplay, ProcessType } from "../types/domain";
export declare const PROCESS_LABEL: Record<ProcessType, string>;
export declare const PRICE_LABEL: Record<PriceDisplay, string>;
export declare const STATUS_LABEL: Record<BiddingStatus, string>;
export declare function formatDate(iso: string): string;
export declare function formatDateTime(iso: string): string;
export declare function formatDeadline(deadline: string | null): string;
export declare function formatCHF(amount: number): string;
export declare function formatTimeRemaining(deadline: string | null): string;
