export function formatNaira(value: number) {
  if (value == null || Number.isNaN(value)) return "₦0";
  return `₦${value.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

export function formatNairaSigned(value: number) {
  const sign = value < 0 ? "-" : "+";
  return `${sign}${formatNaira(Math.abs(value))}`;
}

export function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

export function formatRelative(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return formatDate(d);
}
