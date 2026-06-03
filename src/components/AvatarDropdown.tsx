import React, { useEffect, useRef, useState } from "react";
import { BiddingStatus } from "../types/domain";
import { useGridbidUiStore } from "../store/gridbidUiStore";
import { useGridbidService } from "../services/GridbidServiceContext";

export function AvatarDropdown() {
  const mode = useGridbidUiStore((s) => s.mode);
  const switchToAgency = useGridbidUiStore((s) => s.switchToAgency);
  const switchToBuyer = useGridbidUiStore((s) => s.switchToBuyer);
  const service = useGridbidService();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function goToBuyer() {
    setOpen(false);
    const biddings = await service.listBiddings();
    const first = biddings.find((b) => b.status === BiddingStatus.ACTIVE);
    if (first) switchToBuyer(first.id);
  }

  const isAgent = mode === "agency";

  const items = [
    {
      label: "Als Makler:in ansehen",
      active: isAgent,
      onClick: () => { switchToAgency(); setOpen(false); },
    },
    {
      label: "Als Käufer:in ansehen",
      active: !isAgent,
      onClick: goToBuyer,
    },
  ];

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}
      >
        <div style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 9999, background: "#4782f3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "white" }}>
          A
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#0D0D0D" }}>Anton</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 6px)",
          background: "white", border: "0.5px solid #E5E7EB",
          borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          minWidth: 210, overflow: "hidden", zIndex: 200,
        }}>
          {items.map(({ label, active, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%", background: "none", border: "none",
                padding: "9px 14px", fontSize: 13, cursor: "pointer",
                color: active ? "#0D0D0D" : "#6B7280",
                fontWeight: active ? 500 : 400,
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <span style={{ width: 14, flexShrink: 0, fontSize: 12, color: "#0D0D0D" }}>
                {active ? "✓" : ""}
              </span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
