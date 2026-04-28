import { BiddingStatus, PriceDisplay, ProcessType, } from "../types/domain";
function uuid() {
    return Math.random().toString(36).slice(2, 10);
}
function now() {
    return new Date().toISOString();
}
function fakePublicUrl(id) {
    return `https://gridbid.local/b/${id}`;
}
const INITIAL_BIDDINGS = [
    {
        id: "b001",
        title: "Einfamilienhaus Zürich-Witikon",
        address: "Witikoner Strasse 42, 8053 Zürich",
        websiteUrl: "https://www.homegate.ch/kaufen/b001",
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&h=200&fit=crop&crop=entropy&q=80",
        processType: ProcessType.SEALED_BID,
        status: BiddingStatus.ACTIVE,
        priceDisplay: PriceDisplay.HIDDEN,
        deadline: "2026-05-01T12:00:00.000Z",
        publicUrl: fakePublicUrl("b001"),
        roundsPlanned: 2,
        biddingRules: "Nur hypothekarisch gesicherte Angebote. Besichtigung: Sa 14. Juni, 10–12 Uhr.",
        documents: {
            level1: ["Verkaufsbroschüre", "Grundrisse", "Fotos"],
            level2: ["Grundbuchauszug", "Baubeschrieb", "Renovationsinfos"],
            level3: ["Reservierungsvereinbarung", "Rechtsdokumente"],
        },
        participants: [
            {
                id: "p001",
                name: "Anna Müller",
                email: "anna.mueller@example.ch",
                registeredAt: "2026-04-10T08:00:00.000Z",
            },
            {
                id: "p002",
                name: "Beat Keller",
                email: "beat.keller@example.ch",
                registeredAt: "2026-04-11T09:30:00.000Z",
            },
            {
                id: "p003",
                name: "Daniela Frei",
                email: "daniela.frei@example.ch",
                registeredAt: "2026-04-11T14:15:00.000Z",
            },
            {
                id: "p004",
                name: "Ernst Hofer",
                email: "ernst.hofer@example.ch",
                registeredAt: "2026-04-12T07:45:00.000Z",
            },
        ],
        offers: [
            {
                id: "o001a",
                biddingId: "b001",
                participantId: "p001",
                amount: 1450000,
                version: 1,
                submittedAt: "2026-04-12T10:00:00.000Z",
            },
            {
                id: "o001b",
                biddingId: "b001",
                participantId: "p001",
                amount: 1520000,
                version: 2,
                submittedAt: "2026-04-13T09:15:00.000Z",
            },
            {
                id: "o002a",
                biddingId: "b001",
                participantId: "p002",
                amount: 1390000,
                version: 1,
                submittedAt: "2026-04-12T14:30:00.000Z",
            },
            {
                id: "o003a",
                biddingId: "b001",
                participantId: "p003",
                amount: 1480000,
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
        deadline: null,
        publicUrl: undefined,
        roundsPlanned: 1,
        biddingRules: "",
        documents: { level1: [], level2: [], level3: [] },
        participants: [],
        offers: [],
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
        deadline: "2026-03-15T12:00:00.000Z",
        publicUrl: fakePublicUrl("b003"),
        roundsPlanned: 1,
        biddingRules: "",
        documents: {
            level1: ["Verkaufsbroschüre", "Grundrisse"],
            level2: ["Grundbuchauszug"],
            level3: [],
        },
        participants: [
            {
                id: "p003",
                name: "Carmen Suter",
                email: "carmen.suter@example.ch",
                registeredAt: "2026-03-10T11:00:00.000Z",
            },
        ],
        offers: [
            {
                id: "o002",
                biddingId: "b003",
                participantId: "p003",
                amount: 985000,
                version: 2,
                submittedAt: "2026-03-14T16:00:00.000Z",
            },
        ],
        createdAt: "2026-03-01T09:00:00.000Z",
    },
];
function clone(value) {
    return JSON.parse(JSON.stringify(value));
}
export class MockGridbidService {
    constructor() {
        this.biddings = clone(INITIAL_BIDDINGS);
    }
    async listBiddings() {
        return clone(this.biddings);
    }
    async getBiddingById(id) {
        return clone(this.biddings.find((b) => b.id === id) ?? null);
    }
    async createDraft(input) {
        const draft = {
            id: uuid(),
            title: input?.title ?? "",
            address: input?.address ?? "",
            websiteUrl: input?.websiteUrl ?? undefined,
            processType: input?.processType ?? ProcessType.SEALED_BID,
            status: BiddingStatus.DRAFT,
            priceDisplay: input?.priceDisplay ?? PriceDisplay.HIDDEN,
            deadline: input?.deadline ?? null,
            publicUrl: undefined,
            roundsPlanned: input?.roundsPlanned ?? 1,
            biddingRules: input?.biddingRules ?? "",
            documents: input?.documents ?? { level1: [], level2: [], level3: [] },
            participants: [],
            offers: [],
            createdAt: now(),
        };
        this.biddings.push(draft);
        return clone(draft);
    }
    async updateBidding(id, patch) {
        const index = this.biddings.findIndex((b) => b.id === id);
        if (index === -1)
            throw new Error(`Bidding ${id} not found`);
        this.biddings[index] = { ...this.biddings[index], ...patch };
        return clone(this.biddings[index]);
    }
    async activateBidding(id) {
        const index = this.biddings.findIndex((b) => b.id === id);
        if (index === -1)
            throw new Error(`Bidding ${id} not found`);
        this.biddings[index] = {
            ...this.biddings[index],
            status: BiddingStatus.ACTIVE,
            publicUrl: fakePublicUrl(id),
        };
        return clone(this.biddings[index]);
    }
}
export const mockGridbidService = new MockGridbidService();
