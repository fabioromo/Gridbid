import React from "react";
import { type CreateDraftInput } from "../types/domain";
interface StepProcessProps {
    draft: CreateDraftInput;
    onChange: (patch: Partial<CreateDraftInput>) => void;
    onBack: () => void;
    onNext: () => void;
}
declare const StepProcess: React.FC<StepProcessProps>;
export default StepProcess;
