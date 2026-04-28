import { BiddingStatus, PriceDisplay, ProcessType } from "../types/domain";

export const PROCESS_LABEL: Record<ProcessType, string> = {
  [ProcessType.SEALED_BID]: "Verdecktes Bieterverfahren",
  [ProcessType.OPEN_BID]: "Offenes Verfahren",
};

export const PRICE_LABEL: Record<PriceDisplay, string> = {
  [PriceDisplay.HIDDEN]: "Kein Preis anzeigen",
  [PriceDisplay.PRICE]: "Richtpreis anzeigen",
  [PriceDisplay.RANGE]: "Preisrahmen anzeigen",
};

export const STATUS_LABEL: Record<BiddingStatus, string> = {
  [BiddingStatus.DRAFT]: "Entwurf",
  [BiddingStatus.ACTIVE]: "Aktiv",
  [BiddingStatus.CLOSED]: "Abgeschlossen",
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-CH");
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("de-CH");
}

export function formatDeadline(deadline: string | null): string {
  return deadline ? formatDateTime(deadline) : "Ohne Frist (offen)";
}

export function formatCHF(amount: number): string {
  return `CHF ${amount.toLocaleString("de-CH")}`;
}

export function formatTimeRemaining(deadline: string | null): string {
  if (!deadline) return "Ohne Frist";
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Abgelaufen";
  const totalMinutes = Math.floor(diff / 60_000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
