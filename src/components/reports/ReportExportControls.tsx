import { useState } from "react";
import { Eye, FileSpreadsheet, FileText, Loader2, Table2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { fetchReportFile, type DateRange, type ReportFormat, type ReportId } from "@/features/reports/useReports";

const EXT: Record<ReportFormat, string> = { pdf: "pdf", csv: "csv", xlsx: "xlsx" };

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

interface Props {
  reportId: ReportId;
  title: string;
  /** Omit for an all-time export. */
  range?: DateRange;
  size?: "xs" | "sm";
  disabled?: boolean;
}

/** Preview / PDF / Excel / CSV controls backed by the server report engine. */
export function ReportExportControls({ reportId, title, range, size = "xs", disabled }: Props) {
  const [busy, setBusy] = useState<ReportFormat | "preview" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const stamp = (range?.dateTo ?? new Date().toISOString()).slice(0, 10);
  const blocked = disabled || busy !== null;

  async function download(format: ReportFormat) {
    setBusy(format);
    try {
      const blob = await fetchReportFile(reportId, range, format);
      triggerDownload(blob, `${reportId}-${stamp}.${EXT[format]}`);
    } catch (e) {
      toast.error("Couldn't generate the report.", { description: (e as Error).message });
    } finally {
      setBusy(null);
    }
  }

  async function openPreview() {
    setBusy("preview");
    try {
      const blob = await fetchReportFile(reportId, range, "pdf");
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e) {
      toast.error("Couldn't generate the preview.", { description: (e as Error).message });
    } finally {
      setBusy(null);
    }
  }

  function closePreview() {
    setPreviewUrl((url) => {
      if (url) URL.revokeObjectURL(url);
      return null;
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button size={size} onClick={openPreview} disabled={blocked}>
        {busy === "preview" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3 w-3" />} Preview
      </Button>
      <Button size={size} variant="outline" onClick={() => download("pdf")} disabled={blocked}>
        {busy === "pdf" ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileText className="h-3 w-3" />} PDF
      </Button>
      <Button size={size} variant="outline" onClick={() => download("xlsx")} disabled={blocked}>
        {busy === "xlsx" ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileSpreadsheet className="h-3 w-3" />} Excel
      </Button>
      <Button size={size} variant="ghost" onClick={() => download("csv")} disabled={blocked}>
        {busy === "csv" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Table2 className="h-3 w-3" />} CSV
      </Button>

      <Dialog open={!!previewUrl} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="max-w-4xl w-[95vw]">
          <DialogHeader>
            <DialogTitle>{title} — preview</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <iframe src={previewUrl} title={`${title} preview`} className="h-[70vh] w-full rounded-md border border-line" />
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={closePreview}>Close</Button>
            <Button onClick={() => download("pdf")} disabled={busy !== null}>Download PDF</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
