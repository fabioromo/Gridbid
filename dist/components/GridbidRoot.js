import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import BiddingsOverview from "./BiddingsOverview";
import BiddingDetail from "./BiddingDetail";
import CreateBiddingWizard from "./CreateBiddingWizard";
import BuyerPublicEntry from "./buyer/BuyerPublicEntry";
import BuyerRegistration from "./buyer/BuyerRegistration";
import BuyerDealRoom from "./buyer/BuyerDealRoom";
const GridbidRoot = () => {
    const view = useGridbidUiStore((s) => s.view);
    const mode = useGridbidUiStore((s) => s.mode);
    if (mode === "buyer") {
        return _jsx(BuyerRoot, {});
    }
    return (_jsxs("div", { className: "min-h-full bg-gray-50 text-gray-900", children: [view === "overview" && _jsx(BiddingsOverview, {}), view === "create" && _jsx(CreateBiddingWizard, {}), view === "detail" && _jsx(BiddingDetail, {})] }));
};
const BuyerRoot = () => {
    const buyerView = useGridbidUiStore((s) => s.buyerView);
    return (_jsxs("div", { className: "min-h-full text-gray-900", children: [buyerView === "public" && _jsx(BuyerPublicEntry, {}), buyerView === "register" && _jsx(BuyerRegistration, {}), buyerView === "dealroom" && _jsx(BuyerDealRoom, {})] }));
};
export default GridbidRoot;
