import React from "react";
import { BiddingStatus } from "../types/domain";
interface PublicLinkCardProps {
    status: BiddingStatus;
    url?: string;
}
declare const PublicLinkCard: React.FC<PublicLinkCardProps>;
export default PublicLinkCard;
