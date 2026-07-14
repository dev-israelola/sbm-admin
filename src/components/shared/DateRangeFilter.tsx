import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export type DatePreset = "today" | "7d" | "30d" | "90d" | "ytd" | "custom" | "all";

export interface DateRangeFilterProps {
  onRangeChange: (range: { dateFrom?: string; dateTo?: string }) => void;
  defaultPreset?: DatePreset;
}

export function presetToDates(preset: string): { dateFrom?: string; dateTo?: string } {
  if (preset === "all" || !preset) return {};
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (preset === "today") {
    return { 
      dateFrom: todayStart.toISOString(), 
      dateTo: new Date(todayStart.getTime() + 86400000 - 1).toISOString() 
    };
  }
  if (preset === "7d") {
    const from = new Date(todayStart.getTime() - 7 * 86400000);
    return { dateFrom: from.toISOString(), dateTo: now.toISOString() };
  }
  if (preset === "30d") {
    const from = new Date(todayStart.getTime() - 30 * 86400000);
    return { dateFrom: from.toISOString(), dateTo: now.toISOString() };
  }
  if (preset === "90d") {
    const from = new Date(todayStart.getTime() - 90 * 86400000);
    return { dateFrom: from.toISOString(), dateTo: now.toISOString() };
  }
  if (preset === "ytd") {
    const from = new Date(now.getFullYear(), 0, 1);
    return { dateFrom: from.toISOString(), dateTo: now.toISOString() };
  }
  return {};
}

export function DateRangeFilter({ onRangeChange, defaultPreset = "all" }: DateRangeFilterProps) {
  const [preset, setPreset] = useState<DatePreset>(defaultPreset);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const usingCustom = preset === "custom" || (!!customFrom && !!customTo);

  const applyCustom = (fromVal: string, toVal: string) => {
    if (fromVal && toVal) {
      onRangeChange({
        dateFrom: new Date(`${fromVal}T00:00:00`).toISOString(),
        dateTo: new Date(`${toVal}T23:59:59`).toISOString(),
      });
    }
  };

  function clearCustom() {
    setCustomFrom("");
    setCustomTo("");
    setPreset("all");
    onRangeChange({}); // Reset filter
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={usingCustom ? "custom" : preset}
        onValueChange={(value) => {
          setPreset(value as DatePreset);
          if (value === "custom") return;
          
          setCustomFrom("");
          setCustomTo("");
          onRangeChange(presetToDates(value));
        }}
      >
        <SelectTrigger className="w-36 h-9 text-[12px]"><SelectValue placeholder="Date range" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="90d">Last 90 days</SelectItem>
          <SelectItem value="ytd">Year to date</SelectItem>
          {usingCustom && <SelectItem value="custom">Custom range</SelectItem>}
        </SelectContent>
      </Select>
      
      {usingCustom && (
        <>
          <input
            type="date"
            value={customFrom}
            max={customTo || undefined}
            onChange={(e) => {
              const val = e.target.value;
              setCustomFrom(val);
              applyCustom(val, customTo);
            }}
            className="h-9 rounded-md border border-line bg-surface px-2 text-[12px] text-ink"
            aria-label="From date"
          />
          <span className="text-[12px] text-ink-muted">–</span>
          <input
            type="date"
            value={customTo}
            min={customFrom || undefined}
            onChange={(e) => {
              const val = e.target.value;
              setCustomTo(val);
              applyCustom(customFrom, val);
            }}
            className="h-9 rounded-md border border-line bg-surface px-2 text-[12px] text-ink"
            aria-label="To date"
          />
          <Button size="xs" variant="ghost" onClick={clearCustom}>Clear</Button>
        </>
      )}
    </div>
  );
}
