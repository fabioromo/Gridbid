import React from "react";
import type { CreateDraftInput } from "../types/domain";
interface StepPropertyProps {
    draft: CreateDraftInput;
    onChange: (patch: Partial<CreateDraftInput>) => void;
    onNext: () => void;
}
declare const StepProperty: React.FC<StepPropertyProps>;
export default StepProperty;
