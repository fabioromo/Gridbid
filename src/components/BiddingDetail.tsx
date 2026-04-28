import React, { useEffect, useState } from "react";
import { BiddingStatus, type GridbidBidding, type GridbidOffer, type GridbidParticipant } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";
import {
  PROCESS_LABEL,
  PRICE_LABEL,
  STATUS_LABEL,
  formatDate,
  formatDateTime,
  formatDeadline,
  formatCHF,
} from "../utils/labels";
import PublicLinkCard from "./PublicLinkCard";

const STATUS_BADGE: Record<BiddingStatus, { label: string; className: string }> = {
  [BiddingStatus.DRAFT]: {
    label: STATUS_LABEL[BiddingStatus.DRAFT],
    className: "bg-gray-100 text-gray-500 border border-gray-200",
  },
  [BiddingStatus.ACTIVE]: {
    label: STATUS_LABEL[BiddingStatus.ACTIVE],
    className: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  [BiddingStatus.CLOSED]: {
    label: STATUS_LABEL[BiddingStatus.CLOSED],
    className: "bg-gray-100 text-gray-400 border border-gray-200",
  },
};

const BiddingDetail: React.FC = () => {
  const selectedBiddingId = useGridbidUiStore((s) => s.selectedBiddingId);
  const navigate = useGridbidUiStore((s) => s.navigate);
  const service = useGridbidService();
  const [bidding, setBidding] = useState<GridbidBidding | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);
  const [confirmingActivation, setConfirmingActivation] = useState(false);

  useEffect(() => {
    if (!selectedBiddingId) return;
    setLoading(true);
    setLoadError(null);
    service
      .getBiddingById(selectedBiddingId)
      .then((data) => {
        setBidding(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : "Unbekannter Fehler");
        setLoading(false);
      });
  }, [service, selectedBiddingId]);

  async function handleActivate() {
    if (!bidding) return;
    setActivating(true);
    setActivationError(null);
    setConfirmingActivation(false);
    try {
      const updated = await service.activateBidding(bidding.id);
      setBidding(updated);
    } catch (err: unknown) {
      setActivationError(err instanceof Error ? err.message : "Aktivierung fehlgeschlagen");
    } finally {
      setActivating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Wird geladen…
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-red-500">
        Fehler: {loadError}
      </div>
    );
  }

  if (!bidding) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-gray-400">
        Wird geladen…
      </div>
    );
  }

  const badge = STATUS_BADGE[bidding.status];

  return (
    <div className="px-6 py-8">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate("overview")}
          className="mb-6 text-sm text-gray-400 transition-colors hover:text-gray-700"
        >
          ← Zurück zur Übersicht
        </button>

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">
                {bidding.title || "Unbenannt"}
              </h1>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-sm text-gray-500">{bidding.address || "—"}</p>
          </div>

          <div className="flex items-start gap-3">
            {bidding.status === BiddingStatus.DRAFT && (
              <div className="flex flex-col items-end gap-2">
                {!confirmingActivation ? (
                  <button
                    onClick={() => setConfirmingActivation(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                  >
                    Verfahren aktivieren
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-gray-500">
                      Nach der Aktivierung ist das Verfahren öffentlich und kann nicht mehr
                      bearbeitet werden.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmingActivation(false)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700"
                      >
                        Abbrechen
                      </button>
                      <button
                        onClick={() => void handleActivate()}
                        disabled={activating}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
                      >
                        {activating ? "Wird aktiviert…" : "Jetzt aktivieren"}
                      </button>
                    </div>
                  </div>
                )}
                {activationError && (
                  <p className="text-xs text-red-500">{activationError}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <PublicLinkCard status={bidding.status} url={bidding.publicUrl} />
        </div>

        {bidding.status !== BiddingStatus.DRAFT && (
          <div className="mb-8">
            <OrderBookSummary
              participants={bidding.participants}
              offers={bidding.offers}
            />
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Field label="Verfahrenstyp" value={PROCESS_LABEL[bidding.processType]} />
          <Field label="Preisanzeige" value={PRICE_LABEL[bidding.priceDisplay]} />
          <Field label="Frist" value={formatDeadline(bidding.deadline)} />
          <Field label="Erstellt" value={formatDate(bidding.createdAt)} />
        </div>

        <Section title="Teilnehmer">
          {bidding.participants.length === 0 ? (
            <p className="text-sm text-gray-400">Noch keine Teilnehmer registriert.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">E-Mail</th>
                  <th className="pb-3 font-medium">Registriert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bidding.participants.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 text-gray-800">{p.name}</td>
                    <td className="py-3 text-gray-500">{p.email}</td>
                    <td className="py-3 text-gray-500">{formatDate(p.registeredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        <Section title="Angebote">
          {bidding.offers.length === 0 ? (
            <p className="text-sm text-gray-400">Noch keine Angebote eingegangen.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400">
                  <th className="pb-3 font-medium">Teilnehmer</th>
                  <th className="pb-3 font-medium">Betrag</th>
                  <th className="pb-3 font-medium">Version</th>
                  <th className="pb-3 font-medium">Eingereicht</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bidding.offers.map((o) => {
                  const participant = bidding.participants.find(
                    (p) => p.id === o.participantId
                  );
                  return (
                    <tr key={o.id}>
                      <td className="py-3 text-gray-800">
                        {participant?.name ?? o.participantId}
                      </td>
                      <td className="py-3 font-mono text-gray-800">{formatCHF(o.amount)}</td>
                      <td className="py-3 text-gray-500">v{o.version}</td>
                      <td className="py-3 text-gray-500">{formatDateTime(o.submittedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </Section>
      </div>
    </div>
  );
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

function OrderBookSummary({
  participants,
  offers,
}: {
  participants: GridbidParticipant[];
  offers: GridbidOffer[];
}) {
  // For each participant, keep only the offer with the highest version number
  const latestByParticipant = new Map<string, GridbidOffer>();
  for (const offer of offers) {
    const current = latestByParticipant.get(offer.participantId);
    if (!current || offer.version > current.version) {
      latestByParticipant.set(offer.participantId, offer);
    }
  }
  const latestOffers = Array.from(latestByParticipant.values());
  const highestOffer =
    latestOffers.length > 0
      ? Math.max(...latestOffers.map((o) => o.amount))
      : null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-5 text-sm font-semibold text-gray-700">Gebotsspiegel</h2>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-gray-400">Registrierte Käufer</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{participants.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Eingegangene Angebote</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{latestOffers.length}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Höchstes Angebot</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {highestOffer !== null ? formatCHF(highestOffer) : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-sm font-semibold text-gray-700">{title}</h2>
      {children}
    </div>
  );
}

export default BiddingDetail;
