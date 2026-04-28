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
    ? "text-red-500"
    : isWarning
    ? "text-amber-500"
    : "text-green-700";

  const segments: Array<{ v: number; u: string }> = [
    { v: d, u: "D" },
    { v: h, u: "H" },
    { v: m, u: "M" },
    { v: s, u: "S" },
  ];

  return (
    <div className={`flex items-baseline gap-0.5 font-mono tabular-nums ${colorCls} ${isUrgent ? "animate-pulse" : ""}`}>
      {segments.map(({ v, u }, i) => (
        <React.Fragment key={u}>
          {i > 0 && (
            <span className="mx-px text-xs opacity-40">:</span>
          )}
          <span className="text-sm font-semibold">{String(v).padStart(2, "0")}</span>
          <span className="text-[10px] font-medium uppercase opacity-50">{u}</span>
        </React.Fragment>
      ))}
    </div>
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
      <div className="flex items-center py-4 pr-5">
        <span className="text-sm text-gray-300">—</span>
      </div>
    );
  }

  if (!deadline) {
    return (
      <div className="flex items-center py-4 pr-5">
        <span className="text-xs text-gray-400">Ohne Frist</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center gap-1 py-4 pr-5">
      <span className="text-xs text-gray-600">
        {formatDeadlineDate(deadline)}
      </span>
      <Countdown deadline={deadline} />
    </div>
  );
};

export default DeadlineCell;
