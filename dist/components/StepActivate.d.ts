import React from "react";
import { type CreateDraftInput } from "../types/domain";
type UserPlan = "standard" | "pro" | "enterprise";
interface StepActivateProps {
    draft: CreateDraftInput;
    activating: boolean;
    userPlan?: UserPlan;
    onBack: () => void;
    onGoToStep: (step: number) => void;
    onSaveAndActivate: () => void;
    onSaveAsDraft: () => void;
}
declare const StepActivate: React.FC<StepActivateProps>;
export default StepActivate;
