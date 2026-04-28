import React from "react";
import type { BiddingDocuments } from "../types/domain";
interface StepDocumentsProps {
    documents: BiddingDocuments;
    onChange: (docs: BiddingDocuments) => void;
    onBack: () => void;
    onNext: () => void;
}
declare const StepDocuments: React.FC<StepDocumentsProps>;
export default StepDocuments;
