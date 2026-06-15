import { useRef, useState } from "react";
import { ImageIcon, Link2, Plus, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { uploadFile } from "@/lib/uploads";

interface ImagePickerProps {
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  error?: string;
  className?: string;
}

const MAX_FILE_MB = 10;

export function ImagePicker({
  label,
  hint,
  value,
  onChange,
  max = 6,
  error,
  className,
}: ImagePickerProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const slotsLeft = Math.max(0, max - value.length);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList).slice(0, slotsLeft);
    setBusy(true);
    try {
      const next: string[] = [];
      for (const f of incoming) {
        if (!f.type.startsWith("image/")) {
          toast.error(`${f.name} is not an image.`);
          continue;
        }
        if (f.size > MAX_FILE_MB * 1024 * 1024) {
          toast.error(`${f.name} is over ${MAX_FILE_MB}MB.`);
          continue;
        }
        try {
          const uploaded = await uploadFile(f, "PRODUCT_IMAGE");
          next.push(uploaded.url);
        } catch (error) {
          toast.error(`Could not upload ${f.name}.`, {
            description: error instanceof Error ? error.message : undefined,
          });
        }
      }
      if (next.length) onChange([...value, ...next]);
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function addUrl() {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (slotsLeft <= 0) {
      toast.error(`Up to ${max} images.`);
      return;
    }
    try {
      const parsed = new URL(trimmed);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("bad protocol");
    } catch {
      toast.error("Use a valid http(s) URL.");
      return;
    }
    onChange([...value, trimmed]);
    setUrl("");
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const next = [...value];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-end justify-between">
        <Label>{label}</Label>
        <span className="text-[11px] text-ink-muted">
          {value.length} / {max}
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "rounded-xl border border-dashed border-line bg-surface-muted/40 p-4",
          slotsLeft === 0 && "opacity-60",
        )}
      >
        <p className="eyebrow mb-2 flex items-center gap-1.5">
          <Upload className="h-3 w-3 text-accent" /> Option 1 · Upload image
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={busy || slotsLeft === 0}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fileInput.current?.click()}
            disabled={busy || slotsLeft === 0}
          >
            <Upload className="h-3.5 w-3.5" />
            {busy ? "Reading…" : "Choose images"}
          </Button>
          <span className="text-[11px] text-ink-muted">
            or drop image files here — up to {MAX_FILE_MB}MB each. PNG, JPG, WebP.
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-line/70">
          <p className="eyebrow mb-2 flex items-center gap-1.5">
            <Link2 className="h-3 w-3 text-accent" /> Option 2 · Paste image URL
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="url"
              value={url}
              placeholder="https://images.unsplash.com/..."
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addUrl();
                }
              }}
              className="flex-1 min-w-[200px] h-9"
            />
            <Button type="button" size="sm" variant="outline" onClick={addUrl} disabled={!url.trim() || slotsLeft === 0}>
              <Plus className="h-3.5 w-3.5" /> Add URL
            </Button>
          </div>
        </div>
      </div>

      {hint && !error && <p className="text-[11px] text-ink-muted">{hint}</p>}
      {error && <p className="text-[11px] text-danger">{error}</p>}

      <div className="mt-1">
        <p className="eyebrow mb-2 flex items-center gap-1.5">
          <ImageIcon className="h-3 w-3 text-ink-muted" /> Preview
          {value.length > 1 && (
            <span className="text-[10px] normal-case tracking-normal text-ink-muted">
              · drag arrows to reorder · first image is the cover
            </span>
          )}
        </p>
        {value.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line/70 px-4 py-8 text-center text-[12px] text-ink-muted">
            No images yet. Upload or paste a URL above.
          </div>
        ) : (
          <ul className="flex gap-3 overflow-x-auto pb-2">
            {value.map((src, idx) => (
              <li
                key={src + idx}
                className="relative shrink-0 w-32 group"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-surface-muted border border-line/70">
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23F1EEE8'/%3E%3Cpath d='M30 50l8-10 8 10 6-6 8 14H22z' fill='%23E5DED2'/%3E%3Ccircle cx='28' cy='28' r='5' fill='%23E5DED2'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
                {idx === 0 && (
                  <span className="absolute top-1.5 left-1.5 rounded-md bg-accent text-accent-ink text-[9px] uppercase tracking-[0.14em] px-1.5 py-0.5">
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="absolute top-1.5 right-1.5 grid place-items-center h-6 w-6 rounded-full bg-surface/95 border border-line text-ink-muted hover:text-danger hover:border-danger transition-colors"
                  aria-label="Remove image"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-ink-muted">
                  <span className="truncate flex-1">
                    {src.startsWith("data:") ? "Uploaded file" : "Linked URL"}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="h-5 w-5 grid place-items-center rounded hover:bg-surface-muted disabled:opacity-30"
                      aria-label="Move left"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === value.length - 1}
                      className="h-5 w-5 grid place-items-center rounded hover:bg-surface-muted disabled:opacity-30"
                      aria-label="Move right"
                    >
                      ›
                    </button>
                  </span>
                </div>
              </li>
            ))}
            {slotsLeft > 0 && (
              <li className="shrink-0 w-32">
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="aspect-square w-full rounded-lg border border-dashed border-line/70 flex flex-col items-center justify-center gap-1 text-[11px] text-ink-muted hover:border-ink/30 hover:text-ink transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add more
                </button>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

export { ImagePicker as default };
