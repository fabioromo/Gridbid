import React, { useState } from "react";
import { BiddingStatus } from "../types/domain";

interface PublicLinkCardProps {
  status: BiddingStatus;
  url?: string;
}

const PublicLinkCard: React.FC<PublicLinkCardProps> = ({ status, url }) => {
  const [copied, setCopied] = useState(false);

  if (status === BiddingStatus.DRAFT) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <p className="mb-1.5 text-xs font-medium text-gray-400">Öffentlicher Link</p>
        <p className="text-sm text-gray-400">
          Noch nicht aktiv – kein öffentlicher Link verfügbar.
        </p>
      </div>
    );
  }

  if (!url) return null;

  function handleCopy() {
    void navigator.clipboard.writeText(url!).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
      <p className="mb-3 text-xs font-medium text-blue-600">Öffentlicher Link</p>
      <div className="flex items-center gap-3">
        <span className="flex-1 truncate rounded-lg border border-gray-200 bg-white px-4 py-2.5 font-mono text-sm text-gray-700">
          {url}
        </span>
        <button
          onClick={handleCopy}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500"
        >
          {copied ? "Kopiert!" : "Kopieren"}
        </button>
      </div>
    </div>
  );
};

export default PublicLinkCard;
