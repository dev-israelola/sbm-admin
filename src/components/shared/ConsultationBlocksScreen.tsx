import { useState } from "react";
import { toast } from "sonner";
import { CalendarOff, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/forms/FormInput";
import {
  useConsultationBlocks,
  useCreateConsultationBlock,
  useDeleteConsultationBlock,
} from "@/features/consultations/useConsultations";

const TZ = "Africa/Lagos";
const fmt = new Intl.DateTimeFormat("en-NG", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TZ,
});

// Treat the admin's date/time inputs as Lagos (WAT, +01:00).
function lagosISO(date: string, time: string) {
  return new Date(`${date}T${time}:00+01:00`).toISOString();
}

export function ConsultationBlocksScreen() {
  const { data: blocks, isLoading } = useConsultationBlocks();
  const create = useCreateConsultationBlock();
  const remove = useDeleteConsultationBlock();

  const [date, setDate] = useState("");
  const [wholeDay, setWholeDay] = useState(true);
  const [start, setStart] = useState("11:00");
  const [end, setEnd] = useState("13:00");
  const [reason, setReason] = useState("");

  async function add() {
    if (!date) return toast.error("Pick a date");
    const startsAt = wholeDay ? lagosISO(date, "00:00") : lagosISO(date, start);
    const endsAt = wholeDay ? lagosISO(date, "23:59") : lagosISO(date, end);
    if (new Date(endsAt) <= new Date(startsAt)) return toast.error("End must be after start");
    try {
      await create.mutateAsync({ startsAt, endsAt, reason: reason.trim() || undefined });
      toast.success("Time blocked");
      setReason("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not block");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Consultations"
        title="Availability blocks"
        description="Block dates or time ranges when you're unavailable. Booking slots are Mon & Wed, 11am–1pm; blocked times are hidden from customers."
      />

      <div className="card mb-6 p-5">
        <h2 className="font-display text-base mb-3">Block a time</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FormInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={wholeDay} onChange={(e) => setWholeDay(e.target.checked)} />
              Whole day
            </label>
          </div>
          {!wholeDay && (
            <>
              <FormInput label="From" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
              <FormInput label="To" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </>
          )}
          <FormInput label="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={add} disabled={create.isPending}>
            {create.isPending ? "Blocking…" : "Block time"}
          </Button>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-display text-base mb-3">Upcoming blocks</h2>
        {isLoading ? (
          <p className="text-sm text-ink-muted">Loading…</p>
        ) : !blocks || blocks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-ink-muted">
            <CalendarOff className="h-5 w-5" />
            <span className="text-sm">No blocks — all configured slots are open.</span>
          </div>
        ) : (
          <ul className="divide-y divide-line/60">
            {blocks.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="text-sm">
                  <span className="text-ink">
                    {fmt.format(new Date(b.startsAt))} → {fmt.format(new Date(b.endsAt))}
                  </span>
                  {b.reason && <span className="data-muted block">{b.reason}</span>}
                </div>
                <Button size="xs" variant="ghost" onClick={() => remove.mutate(b.id)} aria-label="Remove block">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
