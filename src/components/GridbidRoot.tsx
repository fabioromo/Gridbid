import React from "react";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import BiddingsOverview from "./BiddingsOverview";
import BiddingDetail from "./BiddingDetail";
import CreateBiddingWizard from "./CreateBiddingWizard";
// SHIM — swap BiddingDetail for PropertyWorkspace with mock data
import PropertyWorkspace from "./agent/PropertyWorkspace";
import { mockBidding, mockBuyers } from "../mocks/propertyWorkspaceMock";
import BuyerPublicEntry from "./buyer/BuyerPublicEntry";
import BuyerRegistration from "./buyer/BuyerRegistration";
import BuyerDealRoom from "./buyer/BuyerDealRoom";

const GridbidRoot: React.FC = () => {
  const view = useGridbidUiStore((s) => s.view);
  const mode = useGridbidUiStore((s) => s.mode);
  const navigate = useGridbidUiStore((s) => s.navigate);

  if (mode === "buyer") {
    return <BuyerRoot />;
  }

  return (
    <div className="min-h-full bg-white text-gray-900">
      {view === "overview" && <BiddingsOverview />}
      {view === "create" && <CreateBiddingWizard />}
      {view === "detail" && (
        <PropertyWorkspace
          bidding={mockBidding}
          buyers={mockBuyers}
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
