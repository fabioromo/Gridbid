import {
  BiddingStatus,
  PriceDisplay,
  ProcessType,
  type BiddingPatch,
  type CreateDraftInput,
  type GridbidBidding,
} from "../types/domain";
import type { GridbidService } from "./gridbidService";
import houseWiedikon from "../assets/house-wiedikon.png";

function uuid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function now(): string {
  return new Date().toISOString();
}

function fakePublicUrl(id: string): string {
  return `https://gridbid.local/b/${id}`;
}

function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
}

const INITIAL_BIDDINGS: GridbidBidding[] = [
  {
    id: "b001",
    title: "Einfamilienhaus Zürich-Witikon",
    address: "Witikoner Strasse 42, 8053 Zürich",
    websiteUrl: "https://www.homegate.ch/kaufen/b001",
    imageUrl: houseWiedikon,
    processType: ProcessType.SEALED_BID,
    status: BiddingStatus.ACTIVE,
    priceDisplay: PriceDisplay.HIDDEN,
    richtpreis: 1_450_000,
    listingPrice: 1_450_000,
    deadline: futureDate(14),
    publicUrl: fakePublicUrl("b001"),
    roundsPlanned: 2,
    biddingRules: "Nur hypothekarisch gesicherte Angebote. Besichtigung: Sa 14. Juni, 10–12 Uhr.",
    documents: {
      level1: ["Verkaufsbroschüre", "Grundrisse", "Fotos"],
      level2: ["Grundbuchauszug", "Baubeschrieb", "Renovationsinfos"],
      level3: ["Reservierungsvereinbarung", "Rechtsdokumente"],
    },
    phase3Grants: [
      { participantId: "p001", grantedAt: "2026-04-15T10:00:00.000Z", grantedBy: "agent001" },
    ],
    round2Deadline: null,
    round2InvitedBuyerIds: [],
    round2Transparency: "rank",
    winnerId: null,
    winnerName: null,
    finalPrice: null,
    participants: [
      { id: "p001", name: "Anna Müller",  email: "anna.mueller@example.ch",  registeredAt: "2026-04-10T08:00:00.000Z", phone: "+41 79 123 45 67" },
      { id: "p002", name: "Beat Keller",  email: "beat.keller@example.ch",   registeredAt: "2026-04-11T09:30:00.000Z" },
      { id: "p003", name: "Daniela Frei", email: "daniela.frei@example.ch",  registeredAt: "2026-04-11T14:15:00.000Z", phone: "+41 76 234 56 78" },
      { id: "p004", name: "Ernst Hofer",  email: "ernst.hofer@example.ch",   registeredAt: "2026-04-12T07:45:00.000Z" },
    ],
    offers: [
      {
        id: "o001a",
        biddingId: "b001",
        participantId: "p001",
        amount: 1_480_000,
        validityDays: 30,
        preferredClosingDate: null,
        financingStatus: "confirmed",
        conditions: "",
        verificationSignals: { idUploaded: true, financingProofUploaded: true },
        verificationLevelAtSubmission: "level3",
        version: 1,
        submittedAt: "2026-04-12T10:00:00.000Z",
      },
      {
        id: "o001b",
        biddingId: "b001",
        participantId: "p001",
        amount: 1_550_000,
        validityDays: 30,
        preferredClosingDate: "2026-07-01",
        financingStatus: "confirmed",
        conditions: "Übergabe per 1. Juli bevorzugt.",
        verificationSignals: { idUploaded: true, financingProofUploaded: true },
        verificationLevelAtSubmission: "level3",
        version: 2,
        submittedAt: "2026-04-13T09:15:00.000Z",
      },
      {
        id: "o002a",
        biddingId: "b001",
        participantId: "p002",
        amount: 1_460_000,
        validityDays: 14,
        preferredClosingDate: null,
        financingStatus: "open",
        conditions: "",
        verificationSignals: { idUploaded: false, financingProofUploaded: false },
        verificationLevelAtSubmission: "level1",
        version: 1,
        submittedAt: "2026-04-12T14:30:00.000Z",
      },
      {
        id: "o003a",
        biddingId: "b001",
        participantId: "p003",
        amount: 1_510_000,
        validityDays: 30,
        preferredClosingDate: null,
        financingStatus: "in_preparation",
        conditions: "",
        verificationSignals: { idUploaded: false, financingProofUploaded: false },
        verificationLevelAtSubmission: "level2",
        version: 1,
        submittedAt: "2026-04-12T16:00:00.000Z",
      },
    ],
    createdAt: "2026-04-08T07:00:00.000Z",
  },
  {
    id: "b002",
    title: "3.5-Zi-Wohnung Basel Innenstadt",
    address: "Freie Strasse 18, 4001 Basel",
    websiteUrl: undefined,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=200&fit=crop&crop=entropy&q=80",
    processType: ProcessType.OPEN_BID,
    status: BiddingStatus.DRAFT,
    priceDisplay: PriceDisplay.PRICE,
    richtpreis: 860_000,
    listingPrice: null,
    deadline: null,
    publicUrl: undefined,
    roundsPlanned: 1,
    biddingRules: "",
    documents: { level1: [], level2: [], level3: [] },
    phase3Grants: [],
    participants: [],
    offers: [],
    round2Deadline: null,
    round2InvitedBuyerIds: [],
    round2Transparency: "rank",
    winnerId: null,
    winnerName: null,
    finalPrice: null,
    createdAt: "2026-04-12T14:00:00.000Z",
  },
  {
    id: "b003",
    title: "Maisonette Bern Länggasse",
    address: "Sidlerstrasse 7, 3012 Bern",
    websiteUrl: "https://www.immoscout24.ch/de/kaufen/b003",
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&h=200&fit=crop&crop=entropy&q=80",
    processType: ProcessType.SEALED_BID,
    status: BiddingStatus.CLOSED,
    priceDisplay: PriceDisplay.HIDDEN,
    richtpreis: 985_000,
    listingPrice: 985_000,
    deadline: "2026-03-15T12:00:00.000Z",
    closedAt: "2026-03-15T14:00:00.000Z",
    publicUrl: fakePublicUrl("b003"),
    roundsPlanned: 1,
    biddingRules: "",
    documents: {
      level1: ["Verkaufsbroschüre", "Grundrisse"],
      level2: ["Grundbuchauszug"],
      level3: [],
    },
    phase3Grants: [],
    round2Deadline: null,
    round2InvitedBuyerIds: [],
    round2Transparency: "rank",
    winnerId: "p005",
    winnerName: null,
    finalPrice: 1_010_000,
    participants: [
      { id: "p005", name: "Carmen Suter", email: "carmen.suter@example.ch", registeredAt: "2026-03-10T11:00:00.000Z" },
    ],
    offers: [
      {
        id: "o003b",
        biddingId: "b003",
        participantId: "p005",
        amount: 1_010_000,
        validityDays: 30,
        preferredClosingDate: null,
        financingStatus: "in_preparation",
        conditions: "",
        verificationSignals: { idUploaded: false, financingProofUploaded: false },
        verificationLevelAtSubmission: "level2",
        version: 1,
        submittedAt: "2026-03-14T16:00:00.000Z",
      },
    ],
    createdAt: "2026-03-01T09:00:00.000Z",
  },
  {
    id: "b004",
    title: "4.5-Zi-Wohnung Zürich Seefeld",
    address: "Seefeldstrasse 112, 8008 Zürich",
    websiteUrl: undefined,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop&crop=entropy&q=80",
    processType: ProcessType.OPEN_BID,
    status: BiddingStatus.ACTIVE,
    priceDisplay: PriceDisplay.PRICE,
    richtpreis: 1_250_000,
    listingPrice: null,
    deadline: null,
    publicUrl: fakePublicUrl("b004"),
    roundsPlanned: 1,
    biddingRules: "",
    documents: { level1: ["Verkaufsbroschüre"], level2: [], level3: [] },
    phase3Grants: [],
    round2Deadline: null,
    round2InvitedBuyerIds: [],
    round2Transparency: "rank",
    winnerId: null,
    winnerName: null,
    finalPrice: null,
    participants: [],
    offers: [],
    createdAt: "2026-04-14T10:00:00.000Z",
  },
  {
    id: "b005",
    title: "Bergweg Gstaad",
    address: "Bergweg 12, 3780 Gstaad",
    websiteUrl: "https://www.homegate.ch/kaufen/b005",
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop&crop=entropy&q=80",
    processType: ProcessType.SEALED_BID,
    status: BiddingStatus.ACTIVE,
    priceDisplay: PriceDisplay.HIDDEN,
    richtpreis: 3_200_000,
    listingPrice: 3_200_000,
    deadline: "2026-06-08T17:00:00.000Z",
    publicUrl: fakePublicUrl("b005"),
    roundsPlanned: 2,
    biddingRules: "Nur hypothekarisch gesicherte Angebote. Besichtigung nach Vereinbarung.",
    documents: {
      level1: ["Verkaufsbroschüre", "Lageplan"],
      level2: ["Grundbuchauszug", "Baubeschrieb"],
      level3: ["Reservierungsvereinbarung"],
    },
    phase3Grants: [],
    round2Deadline: "2026-06-15T17:00:00",
    round2InvitedBuyerIds: ["p006", "p007"],
    round2Transparency: "rank",
    winnerId: null,
    winnerName: null,
    finalPrice: null,
    participants: [
      { id: "p006", name: "Franziska Huber",  email: "franziska.huber@example.ch",  registeredAt: "2026-05-15T09:00:00.000Z", phone: "+41 79 345 67 89" },
      { id: "p007", name: "Gerhard Lanz",     email: "gerhard.lanz@example.ch",     registeredAt: "2026-05-16T10:30:00.000Z", phone: "+41 76 456 78 90" },
      { id: "p008", name: "Helena Brändli",   email: "helena.braendli@example.ch",  registeredAt: "2026-05-17T08:15:00.000Z" },
    ],
    offers: [
      {
        id: "o005a",
        biddingId: "b005",
        participantId: "p006",
        amount: 2_100_000,
        validityDays: 30,
        preferredClosingDate: null,
        financingStatus: "confirmed",
        conditions: "",
        verificationSignals: { idUploaded: true, financingProofUploaded: true },
        verificationLevelAtSubmission: "level3",
        version: 1,
        round: 1,
        submittedAt: "2026-05-25T11:00:00.000Z",
      },
      {
        id: "o005b",
        biddingId: "b005",
        participantId: "p007",
        amount: 2_050_000,
        validityDays: 30,
        preferredClosingDate: null,
        financingStatus: "confirmed",
        conditions: "",
        verificationSignals: { idUploaded: true, financingProofUploaded: false },
        verificationLevelAtSubmission: "level2",
        version: 1,
        round: 1,
        submittedAt: "2026-05-25T14:00:00.000Z",
      },
      {
        id: "o005c",
        biddingId: "b005",
        participantId: "p008",
        amount: 1_980_000,
        validityDays: 30,
        preferredClosingDate: null,
        financingStatus: "in_preparation",
        conditions: "",
        verificationSignals: { idUploaded: false, financingProofUploaded: false },
        verificationLevelAtSubmission: "level2",
        version: 1,
        round: 1,
        submittedAt: "2026-05-26T09:30:00.000Z",
      },
      {
        id: "o005d",
        biddingId: "b005",
        participantId: "p006",
        amount: 2_180_000,
        validityDays: 30,
        preferredClosingDate: null,
        financingStatus: "confirmed",
        conditions: "Bevorzugter Übergabetermin: 1. September.",
        verificationSignals: { idUploaded: true, financingProofUploaded: true },
        verificationLevelAtSubmission: "level3",
        version: 2,
        round: 2,
        submittedAt: "2026-06-10T10:00:00.000Z",
      },
      {
        id: "o005e",
        biddingId: "b005",
        participantId: "p007",
        amount: 2_090_000,
        validityDays: 30,
        preferredClosingDate: null,
        financingStatus: "confirmed",
        conditions: "",
        verificationSignals: { idUploaded: true, financingProofUploaded: false },
        verificationLevelAtSubmission: "level2",
        version: 2,
        round: 2,
        submittedAt: "2026-06-10T14:30:00.000Z",
      },
    ],
    createdAt: "2026-05-10T08:00:00.000Z",
  },
];

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export class MockGridbidService implements GridbidService {
  private biddings: GridbidBidding[] = clone(INITIAL_BIDDINGS);

  async listBiddings(): Promise<GridbidBidding[]> {
    return clone(this.biddings);
  }

  async getBiddingById(id: string): Promise<GridbidBidding | null> {
    return clone(this.biddings.find((b) => b.id === id) ?? null);
  }

  async createDraft(input?: CreateDraftInput): Promise<GridbidBidding> {
    const draft: GridbidBidding = {
      id: uuid(),
      title: input?.title ?? "",
      address: input?.address ?? "",
      websiteUrl: input?.websiteUrl ?? undefined,
      imageUrl: input?.imageUrl ?? undefined,
      processType: input?.processType ?? ProcessType.SEALED_BID,
      status: BiddingStatus.DRAFT,
      priceDisplay: input?.priceDisplay ?? PriceDisplay.HIDDEN,
      richtpreis: input?.richtpreis ?? null,
      listingPrice: input?.listingPrice ?? null,
      deadline: input?.deadline ?? null,
      publicUrl: undefined,
      roundsPlanned: input?.roundsPlanned ?? 1,
      biddingRules: input?.biddingRules ?? "",
      documents: input?.documents ?? { level1: [], level2: [], level3: [] },
      phase3Grants: [],
      round2Deadline: null,
      round2InvitedBuyerIds: [],
      round2Transparency: "rank",
      winnerId: null,
      winnerName: null,
      finalPrice: null,
      participants: [],
      offers: [],
      createdAt: now(),
    };
    this.biddings.push(draft);
    return clone(draft);
  }

  async updateBidding(id: string, patch: BiddingPatch): Promise<GridbidBidding> {
    const index = this.biddings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error(`Bidding ${id} not found`);
    this.biddings[index] = { ...this.biddings[index]!, ...patch };
    return clone(this.biddings[index]!);
  }

  async activateBidding(id: string): Promise<GridbidBidding> {
    await new Promise<void>((r) => setTimeout(r, 2500));
    const index = this.biddings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error(`Bidding ${id} not found`);
    this.biddings[index] = {
      ...this.biddings[index]!,
      status: BiddingStatus.ACTIVE,
      publicUrl: fakePublicUrl(id),
    };
    return clone(this.biddings[index]!);
  }
}

export const mockGridbidService: GridbidService = new MockGridbidService();
