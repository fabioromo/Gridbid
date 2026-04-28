import React from "react";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import BiddingsOverview from "./BiddingsOverview";
import BiddingDetail from "./BiddingDetail";
import CreateBiddingWizard from "./CreateBiddingWizard";
import BuyerPublicEntry from "./buyer/BuyerPublicEntry";
import BuyerRegistration from "./buyer/BuyerRegistration";
import BuyerDealRoom from "./buyer/BuyerDealRoom";

const GridbidRoot: React.FC = () => {
  const view = useGridbidUiStore((s) => s.view);
  const mode = useGridbidUiStore((s) => s.mode);

  if (mode === "buyer") {
    return <BuyerRoot />;
  }

  return (
    <div className="min-h-full bg-gray-50 text-gray-900">
      {view === "overview" && <BiddingsOverview />}
      {view === "create" && <CreateBiddingWizard />}
      {view === "detail" && <BiddingDetail />}
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
