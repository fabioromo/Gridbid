import React, { useEffect, useState } from "react";
import { BiddingStatus } from "../types/domain";

// ─── Formatting ──────────────────────────────────────────────────────────────

function formatDeadlineDate(iso: string): string {
  return new Intl.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// ─── Countdown ───────────────────────────────────────────────────────────────

interface CountdownProps {
  deadline: string;
}

/**
 * Live DD:HH:MM:SS countdown that updates every second.
 * Switches to an "Abgelaufen" pill when diff ≤ 0 (never shows negative values).
 *
 * Color progression:
 *  > 7 days  → gray
 *  2–7 days  → amber
 *  < 48 h    → red + pulse
 */
function Countdown({ deadline }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  const diff = new Date(deadline).getTime() - now;

  // Countdown expired — render nothing (Status column already shows "Abgelaufen")
  if (diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1_000);
  const d = Math.floor(totalSeconds / 86_400);
  const h = Math.floor((totalSeconds % 86_400) / 3_600);
  const m = Math.floor((totalSeconds % 3_600) / 60);
  const s = totalSeconds % 60;

  // Urgency thresholds
  const isUrgent = diff < 48 * 3_600_000;   // < 48 h  → red
  const isWarning = diff < 7 * 86_400_000;  // < 7 d   → amber (but > 48 h)

  const colorCls = isUrgent
    ? "text-[#ce4742]"
    : isWarning
    ? "text-[#b56100]"
    : "text-[#b56100]";

  const formatted = `${d}d : ${h}h : ${m}m : ${s}s`;

  return (
    <span className={`whitespace-nowrap font-mono text-sm tabular-nums ${colorCls} ${isUrgent ? "animate-pulse" : ""}`}>
      {formatted}
    </span>
  );
}

// ─── DeadlineCell ─────────────────────────────────────────────────────────────

interface DeadlineCellProps {
  status: BiddingStatus;
  deadline: string | null;
}

/**
 * Frist column cell.
 *
 * Render logic:
 *  DRAFT             → "—" (bidding not started)
 *  no deadline       → "Ohne Frist"
 *  deadline defined  → date on row 1, live DD:HH:MM:SS countdown on row 2
 *                      (countdown self-switches to "Abgelaufen" when expired)
 */
const DeadlineCell: React.FC<DeadlineCellProps> = ({ status, deadline }) => {
  if (status === BiddingStatus.DRAFT) {
    return (
      <div className="flex items-center relative px-6 py-3 before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200 before:content-['']">
        <span className="text-sm text-[#73787a]">—</span>
      </div>
    );
  }

  if (!deadline) {
    return (
      <div className="flex items-center relative px-6 py-3 before:absolute before:left-0 before:top-1/2 before:h-8 before:w-px before:-translate-y-1/2 before:bg-gray-200 before:content-['']">
        <span className="whitespace-nowrap text-sm text-[#73787a]">Ohne Frist</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center border-l border-gray-200 gap-0.5 px-6 py-3">
      <span className="whitespace-nowrap text-sm text-[#2f363a]">
        {formatDeadlineDate(deadline)}
      </span>
      <Countdown deadline={deadline} />
    </div>
  );
};

export default DeadlineCell;
