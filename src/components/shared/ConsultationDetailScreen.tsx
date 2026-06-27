import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Plus, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useConsultation, useCreateRecommendation, useAssignConsultant, useRecommendation, useConfirmConsultationPayment } from "@/features/consultations/useConsultations";
import { useProducts } from "@/features/products/useProducts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useStaff } from "@/features/auth/useAuth";
import { useAuthStore } from "@/store/auth-store";
import { formatDate, formatDateTime } from "@/lib/format";
import type { RoutineBlock } from "@/types/consultation";

export function ConsultationDetailScreen({ rolePath }: { rolePath: string }) {
  const { id } = useParams();
  const { data: c, isLoading } = useConsultation(id);
  const rec = useRecommendation(c?.recommendationId);
  const products = useProducts();
  const user = useAuthStore((s) => s.user);
  const canAssignConsultant = user?.role === "admin" || user?.role === "manager";
  const staff = useStaff(canAssignConsultant);
  const consultants = (staff.data?.items ?? []).filter((u) => u.role === "consultant" && u.active);
  const create = useCreateRecommendation();
  const assign = useAssignConsultant();
  const confirmPay = useConfirmConsultationPayment();

  const [title, setTitle] = useState("Personalised herbal protocol");
  const [note, setNote] = useState("");
  const [additional, setAdditional] = useState("");
  const [routine, setRoutine] = useState<RoutineBlock[]>([
    { time: "Morning", steps: [""] },
    { time: "Evening", steps: [""] },
  ]);
  const [selectedProducts, setSelectedProducts] = useState<{ productId: string; usage: string }[]>([]);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!c) return <p className="text-sm text-ink-muted">Consultation not found.</p>;

  function addRoutineStep(blockIdx: number) {
    setRoutine((r) => r.map((b, i) => (i === blockIdx ? { ...b, steps: [...b.steps, ""] } : b)));
  }
  function setRoutineStep(blockIdx: number, stepIdx: number, value: string) {
    setRoutine((r) => r.map((b, i) =>
      i === blockIdx ? { ...b, steps: b.steps.map((s, j) => (j === stepIdx ? value : s)) } : b,
    ));
  }
  function removeRoutineStep(blockIdx: number, stepIdx: number) {
    setRoutine((r) => r.map((b, i) =>
      i === blockIdx ? { ...b, steps: b.steps.filter((_, j) => j !== stepIdx) } : b,
    ));
  }
  function addRoutineBlock() {
    setRoutine((r) => [...r, { time: "Weekly", steps: [""] }]);
  }

  function addProduct() {
    const first = products.data?.items[0];
    if (!first) return;
    setSelectedProducts((p) => [...p, { productId: first.id, usage: "" }]);
  }

  async function send(asDraft: boolean) {
    if (!c || !user) return;
    await create.mutateAsync({
      id: c.id,
      consultantId: user.id,
      consultantName: user.fullName,
      title,
      note,
      additionalAdvice: additional || undefined,
      routine: routine.map((b) => ({ ...b, steps: b.steps.filter(Boolean) })).filter((b) => b.steps.length > 0),
      products: selectedProducts.filter((p) => p.productId),
      sent: !asDraft,
    });
    toast.success(asDraft ? "Saved as draft." : "Recommendation sent to customer.");
  }

  async function pickConsultant(id: string) {
    const consultant = consultants.find((u) => u.id === id);
    if (!consultant || !c) return;
    await assign.mutateAsync({ id: c.id, consultantId: id, consultantName: consultant.fullName });
    toast.success(`${consultant.fullName} assigned.`);
  }

  const productMap = new Map((products.data?.items ?? []).map((p) => [p.id, p]));

  return (
    <div>
      <Link to={`${rolePath}/consultations`} className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink">
        <ChevronLeft className="h-3.5 w-3.5" /> Consultations
      </Link>

      <header className="mt-3 mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Consultation</p>
          <h1 className="font-display text-2xl text-ink">{c.customerName}</h1>
          <p className="text-[12px] text-ink-muted mt-1">{c.primaryConcern} · {formatDate(c.preferredDate)} {c.preferredTime}</p>
        </div>
        <Badge variant={c.status === "completed" ? "success" : c.status === "scheduled" ? "info" : c.status === "cancelled" ? "danger" : "warn"}>
          {c.status.replace("-", " ")}
        </Badge>
      </header>

      <div className="grid lg:grid-cols-[1.4fr_360px] gap-4">
        <div className="space-y-4">
          <section className="card p-5 space-y-2 text-[13px]">
            <h2 className="font-display text-base text-ink">Customer brief</h2>
            <p className="text-ink-muted">{c.customerEmail} · {c.customerPhone}</p>
            <p><span className="text-ink-muted">Goal:</span> {c.goal}</p>
            {c.notes && <p className="text-ink-muted italic">"{c.notes}"</p>}
          </section>

          {(c.scheduledAt || c.fee) && (
            <section className="card p-5 space-y-2 text-[13px]">
              <h2 className="font-display text-base text-ink">Booking & payment</h2>
              {c.scheduledAt && (
                <p>
                  <span className="text-ink-muted">Scheduled:</span>{" "}
                  {new Date(c.scheduledAt).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}
                </p>
              )}
              <p className="flex items-center gap-2">
                <span className="text-ink-muted">Payment:</span>
                <span>{(c.paymentMethod ?? "").replace("_", " ") || "—"}</span>
                <Badge variant={c.paymentStatus === "paid" ? "success" : "warn"}>
                  {c.paymentStatus || "pending"}
                </Badge>
              </p>
              {c.paymentStatus !== "paid" && c.paymentMethod === "bank_transfer" && (
                <Button
                  size="sm"
                  className="mt-1"
                  disabled={confirmPay.isPending}
                  onClick={async () => {
                    try {
                      await confirmPay.mutateAsync(c.id);
                      toast.success("Payment confirmed — consultation scheduled");
                    } catch (e) {
                      toast.error(e instanceof Error ? e.message : "Could not confirm");
                    }
                  }}
                >
                  {confirmPay.isPending ? "Confirming…" : "Confirm transfer received"}
                </Button>
              )}
            </section>
          )}

          {rec.data ? (
            <section className="card p-5 space-y-3">
              <h2 className="font-display text-base text-ink">Recommendation sent</h2>
              <p className="text-[12px] text-ink-muted">By {rec.data.consultantName} · {formatDateTime(rec.data.createdAt)}</p>
              <p className="text-[13px] text-ink">"{rec.data.note}"</p>
              <div className="space-y-3 mt-3">
                {rec.data.routine.map((r) => (
                  <div key={r.time}>
                    <p className="eyebrow">{r.time}</p>
                    <ul className="list-disc pl-5 text-[13px] text-ink mt-1 space-y-1">
                      {r.steps.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <p className="eyebrow mb-1">Products</p>
                <ul className="text-[12px] text-ink-muted space-y-1">
                  {rec.data.products.map((p) => (
                    <li key={p.productId}>· {productMap.get(p.productId)?.name ?? p.productId} — {p.usage}</li>
                  ))}
                </ul>
              </div>
              {rec.data.additionalAdvice && (
                <p className="text-[12px] text-ink-muted italic mt-2">"{rec.data.additionalAdvice}"</p>
              )}
            </section>
          ) : (
            <section className="card p-5 space-y-4">
              <h2 className="font-display text-base text-ink">Build recommendation</h2>
              <FormInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <FormTextarea label="Consultant note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Honest, plain-language framing of the protocol." />

              <div className="space-y-4">
                {routine.map((b, i) => (
                  <div key={i} className="rounded-md border border-line/70 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Label>{b.time}</Label>
                    </div>
                    <ul className="space-y-2">
                      {b.steps.map((s, j) => (
                        <li key={j} className="flex items-center gap-2">
                          <FormInput
                            label=""
                            placeholder="e.g. Ashwagandha Calm Drops — 1 ml before bed"
                            value={s}
                            onChange={(e) => setRoutineStep(i, j, e.target.value)}
                            className="flex-1"
                          />
                          <Button type="button" size="icon" variant="ghost" onClick={() => removeRoutineStep(i, j)} aria-label="Remove">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                    <Button type="button" size="xs" variant="outline" className="mt-2" onClick={() => addRoutineStep(i)}>
                      <Plus className="h-3 w-3" /> Add step
                    </Button>
                  </div>
                ))}
                <Button type="button" size="sm" variant="outline" onClick={addRoutineBlock}>
                  <Plus className="h-3.5 w-3.5" /> Add weekly / morning block
                </Button>
              </div>

              <div className="rounded-md border border-line/70 p-3 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <Label>Recommended products</Label>
                  <Button type="button" size="xs" variant="outline" onClick={addProduct}>
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>
                {selectedProducts.length === 0 && (
                  <p className="text-[11px] text-ink-muted">Add the products and usage notes the customer should follow.</p>
                )}
                {selectedProducts.map((p, idx) => (
                  <div key={idx} className="grid sm:grid-cols-[1fr_1fr_auto] gap-2 items-end">
                    <Select
                      value={p.productId}
                      onValueChange={(v) => setSelectedProducts((sp) => sp.map((x, i) => (i === idx ? { ...x, productId: v } : x)))}
                    >
                      <SelectTrigger className="h-9 text-[12px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(products.data?.items ?? []).map((pr) => (
                          <SelectItem key={pr.id} value={pr.id}>{pr.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormInput
                      label=""
                      placeholder="Usage (e.g. AM with breakfast)"
                      value={p.usage}
                      onChange={(e) => setSelectedProducts((sp) => sp.map((x, i) => (i === idx ? { ...x, usage: e.target.value } : x)))}
                    />
                    <Button type="button" size="icon" variant="ghost" onClick={() => setSelectedProducts((sp) => sp.filter((_, i) => i !== idx))} aria-label="Remove">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              <FormTextarea label="Additional advice (optional)" value={additional} onChange={(e) => setAdditional(e.target.value)} />

              <div className="flex flex-col-reverse gap-2 border-t border-line/70 pt-2 sm:flex-row sm:justify-end">
                <Button type="button" variant="ghost" onClick={() => send(true)} disabled={create.isPending}>Save as draft</Button>
                <Button type="button" onClick={() => send(false)} disabled={create.isPending}>
                  <Send className="h-3.5 w-3.5" /> Send recommendation
                </Button>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <section className="card p-5 space-y-3">
            <h2 className="eyebrow">Consultant</h2>
            <p className="text-[13px] text-ink">{c.consultantName ?? "Unassigned"}</p>
            {canAssignConsultant && (
              <Select value={c.consultantId ?? ""} onValueChange={pickConsultant}>
                <SelectTrigger className="h-9 text-[12px]"><SelectValue placeholder={staff.isLoading ? "Loading consultants" : "Assign consultant"} /></SelectTrigger>
                <SelectContent>
                  {consultants.map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.fullName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
