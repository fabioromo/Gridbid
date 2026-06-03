import React, { useMemo } from "react";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import BiddingsOverview from "./BiddingsOverview";
import BiddingDetail from "./BiddingDetail";
import CreateBiddingWizard from "./CreateBiddingWizard";
import PropertyWorkspace from "./agent/PropertyWorkspace";
import type { WorkspaceBidding, WorkspaceBuyer } from "./agent/PropertyWorkspace";
import { mockBidding, mockBuyers } from "../mocks/propertyWorkspaceMock";
import BuyerPublicEntry from "./buyer/BuyerPublicEntry";
import BuyerRegistration from "./buyer/BuyerRegistration";
import BuyerDealRoom from "./buyer/BuyerDealRoom";

const GridbidRoot: React.FC = () => {
  const view = useGridbidUiStore((s) => s.view);
  const mode = useGridbidUiStore((s) => s.mode);
  const navigate = useGridbidUiStore((s) => s.navigate);
  const selectedBidding = useGridbidUiStore((s) => s.selectedBidding);

  const workspaceBidding = useMemo((): WorkspaceBidding => {
    if (!selectedBidding) return mockBidding;
    return { ...selectedBidding, currentRound: 1 };
  }, [selectedBidding]);

  const workspaceBuyers = useMemo((): WorkspaceBuyer[] => {
    if (!selectedBidding) return mockBuyers;
    return selectedBidding.participants.map((p) => {
      const latestOffer = [...selectedBidding.offers]
        .filter((o) => o.participantId === p.id)
        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0];
      const lvlStr = latestOffer?.verificationLevelAtSubmission ?? "level1";
      const qualificationLevel: 1 | 2 | 3 = lvlStr === "level3" ? 3 : lvlStr === "level2" ? 2 : 1;
      return {
        ...p,
        qualificationLevel,
        buyerProfile: qualificationLevel >= 2,
        idDocument: qualificationLevel >= 3,
        financingProof: qualificationLevel >= 3,
      };
    });
  }, [selectedBidding]);

  if (mode === "buyer") {
    return <BuyerRoot />;
  }

  return (
    <div className="min-h-full bg-white text-gray-900">
      {view === "overview" && <BiddingsOverview />}
      {view === "create" && <CreateBiddingWizard />}
      {view === "edit" && <CreateBiddingWizard initialDraft={selectedBidding ?? undefined} />}
      {view === "detail" && (
        <PropertyWorkspace
          bidding={workspaceBidding}
          buyers={workspaceBuyers}
          onBack={() => navigate("overview")}
          onBiddingChange={() => undefined}
        />
      )}
    </div>
  );
};

const BuyerRoot: React.FC = () => {
  const buyerView = useGridbidUiStore((s) => s.buyerView);

  return (
    <div className="min-h-full text-gray-900">
      {buyerView === "public" && <BuyerPublicEntry />}
      {buyerView === "register" && <BuyerRegistration />}
      {buyerView === "dealroom" && <BuyerDealRoom />}
    </div>
  );
};

export default GridbidRoot;
