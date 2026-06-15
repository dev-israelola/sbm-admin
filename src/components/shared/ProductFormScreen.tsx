import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FormInput } from "@/components/forms/FormInput";
import { FormTextarea } from "@/components/forms/FormTextarea";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormSwitch } from "@/components/forms/FormSwitch";
import { ImagePicker } from "@/components/forms/ImagePicker";
import { useCategories, useCreateProduct, useProduct, useUpdateProduct } from "@/features/products/useProducts";
import { useAuthStore } from "@/store/auth-store";
import { PLATFORM_CONFIG } from "@/types/platform";
import { slugify, suggestSku } from "@/lib/slug";
import { koboToNaira, nairaToKobo } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mirror the backend DTO limits so we can trim instead of erroring.
const SEO_TITLE_MAX = 200;
const SEO_DESC_MAX = 320;

const schema = z.object({
  name: z.string().min(2),
  // Auto-derived from the name; editable. Backend de-duplicates on save.
  slug: z.string().optional(),
  // Auto-suggested from the name; editable and optional.
  sku: z.string().optional(),
  brand: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(20),
  shortDescription: z.string().min(5),
  benefits: z.string(),
  ingredients: z.string(),
  howToUse: z.string(),
  retailPrice: z.coerce.number().min(0),
  costPrice: z.coerce.number().min(0),
  availableStock: z.coerce.number().int().min(0),
  lowStockThreshold: z.coerce.number().int().min(0),
  status: z.enum(["draft", "active", "archived"]),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  images: z.array(z.string().min(1)).min(1, "At least one image is required"),
});
type Values = z.infer<typeof schema>;

interface Props {
  rolePath: string;
  mode: "new" | "edit";
}

export function ProductFormScreen({ rolePath, mode }: Props) {
  const activePlatform = useAuthStore((s) => s.activePlatform);
  const platform = PLATFORM_CONFIG[activePlatform];
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = useProduct(mode === "edit" ? id : undefined);
  const categories = useCategories();
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const defaultBrand = platform.defaultBrand;

  const emptyValues: Values = {
    name: "",
    slug: "",
    sku: "",
    brand: defaultBrand,
    category: "",
    description: "",
    shortDescription: "",
    benefits: "",
    ingredients: "",
    howToUse: "",
    retailPrice: 0,
    costPrice: 0,
    availableStock: 0,
    lowStockThreshold: 5,
    status: "draft",
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    seoTitle: "",
    seoDescription: "",
    images: [],
  };

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  // Track manual edits so auto-fill stops overriding the user's own values.
  const slugTouched = useRef(false);
  const skuTouched = useRef(false);
  const seoTitleTouched = useRef(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const name = form.watch("name");
  const seoDescription = form.watch("seoDescription") ?? "";

  useEffect(() => {
    if (mode === "new" && categories.data?.[0] && !form.getValues("category")) {
      form.setValue("category", categories.data[0].id);
    }
  }, [categories.data, form, mode]);

  // Auto-derive slug + suggest a SKU from the product name (new products only).
  useEffect(() => {
    if (mode !== "new") return;
    if (!slugTouched.current) {
      form.setValue("slug", slugify(name ?? ""), { shouldValidate: true });
    }
    // Fill the SKU once when a name first appears and the field is still empty,
    // so the readable random suffix doesn't churn on every keystroke.
    if (!skuTouched.current && !form.getValues("sku") && (name ?? "").trim().length >= 2) {
      form.setValue("sku", suggestSku(name));
    }
    // SEO title mirrors the product name unless the user edits it.
    if (!seoTitleTouched.current) {
      form.setValue("seoTitle", (name ?? "").slice(0, SEO_TITLE_MAX));
    }
  }, [name, mode, form]);

  function regenerateSku() {
    skuTouched.current = false;
    form.setValue("sku", suggestSku(form.getValues("name") ?? ""), { shouldValidate: true });
  }

  function resetForm() {
    slugTouched.current = false;
    skuTouched.current = false;
    seoTitleTouched.current = false;
    form.reset(emptyValues);
  }

  useEffect(() => {
    if (existing.data) {
      const p = existing.data;
      form.reset({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brand: p.brand,
        category: p.categoryId ?? "",
        description: p.description,
        shortDescription: p.shortDescription,
        benefits: p.benefits.join("\n"),
        ingredients: p.ingredients.join("\n"),
        howToUse: p.howToUse.join("\n"),
        retailPrice: koboToNaira(p.retailPrice),
        costPrice: koboToNaira(p.costPrice),
        availableStock: p.availableStock,
        lowStockThreshold: p.lowStockThreshold,
        status: p.status,
        isFeatured: p.isFeatured,
        isBestSeller: p.isBestSeller,
        isNewArrival: p.isNewArrival,
        seoTitle: p.seoTitle ?? "",
        seoDescription: p.seoDescription ?? "",
        images: p.images ?? [],
      });
    }
  }, [existing.data, form]);

  if (mode === "edit" && existing.isLoading) return <Skeleton className="h-64" />;
  if (mode === "edit" && !existing.data) return <p className="text-sm text-ink-muted">Product not found.</p>;

  async function submit(v: Values) {
    const statusByApi = { draft: "DRAFT", active: "ACTIVE", archived: "ARCHIVED" } as const;
    const payload = {
      name: v.name,
      slug: v.slug,
      sku: v.sku,
      brand: v.brand,
      categoryId: v.category,
      description: v.description,
      shortDescription: v.shortDescription,
      benefits: v.benefits.split("\n").map((s) => s.trim()).filter(Boolean),
      ingredients: v.ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      howToUse: v.howToUse.split("\n").map((s) => s.trim()).filter(Boolean),
      images: v.images,
      retailPrice: nairaToKobo(v.retailPrice),
      costPrice: nairaToKobo(v.costPrice),
      availableStock: v.availableStock,
      lowStockThreshold: v.lowStockThreshold,
      status: statusByApi[v.status],
      isFeatured: v.isFeatured,
      isBestSeller: v.isBestSeller,
      isNewArrival: v.isNewArrival,
      // Trim to the backend limits so over-length copy never blocks the save.
      seoTitle: v.seoTitle?.slice(0, SEO_TITLE_MAX),
      seoDescription: v.seoDescription?.slice(0, SEO_DESC_MAX),
    };

    if (mode === "new") {
      await create.mutateAsync(payload);
      toast.success("Product created.");
      resetForm();
      setShowSuccess(true);
    } else {
      await update.mutateAsync({ id: id!, ...payload });
      toast.success("Product updated.");
    }
  }

  return (
    <div>
      <Link to={`${rolePath}/products`} className="inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-ink">
        <ChevronLeft className="h-3.5 w-3.5" /> Products
      </Link>

      <PageHeader
        eyebrow="Catalog"
        title={mode === "new" ? "New product" : "Edit product"}
        description={mode === "new" ? "Add a new product to the active platform catalog." : "Update product information, pricing and inventory."}
      />

      <form onSubmit={form.handleSubmit(submit)} className="space-y-6 max-w-4xl">
        <section className="card p-5 space-y-4">
          <h2 className="font-display text-base">Basics</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            <FormInput label="Product name" {...form.register("name")} error={form.formState.errors.name?.message} />
            <FormInput
              label="Slug"
              hint="Auto-generated from the name. Edit to override."
              {...form.register("slug", { onChange: () => { slugTouched.current = true; } })}
              error={form.formState.errors.slug?.message}
            />
            <div className="flex flex-col gap-1.5">
              <FormInput
                label="SKU"
                hint="Auto-suggested from the name. Edit to override."
                {...form.register("sku", { onChange: () => { skuTouched.current = true; } })}
                error={form.formState.errors.sku?.message}
              />
              <button
                type="button"
                onClick={regenerateSku}
                className="self-start text-[11px] text-accent hover:underline"
              >
                Regenerate SKU
              </button>
            </div>
            <FormInput label="Brand" {...form.register("brand")} error={form.formState.errors.brand?.message} />
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormSelect
                  label="Category"
                  value={field.value}
                  onChange={field.onChange}
                  options={(categories.data ?? []).map((category) => ({ value: category.id, label: category.name }))}
                  placeholder={categories.isLoading ? "Loading categories..." : "Select category"}
                />
              )}
            />
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormSelect
                  label="Status"
                  value={field.value}
                  onChange={(v) => field.onChange(v as Values["status"])}
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "active", label: "Active" },
                    { value: "archived", label: "Archived" },
                  ]}
                />
              )}
            />
          </div>
          <FormTextarea
            label="Short description"
            {...form.register("shortDescription")}
            error={form.formState.errors.shortDescription?.message}
          />
          <FormTextarea
            label="Full description"
            {...form.register("description")}
            error={form.formState.errors.description?.message}
          />
        </section>

        <section className="card p-5 space-y-4">
          <h2 className="font-display text-base">Pricing & inventory</h2>
          <div className="grid sm:grid-cols-4 gap-3">
            <FormInput label="Retail price (₦)" type="number" step="100" {...form.register("retailPrice")} />
            <FormInput label="Cost price (₦)" type="number" step="100" {...form.register("costPrice")} />
            <FormInput label="Available stock" type="number" {...form.register("availableStock")} />
            <FormInput label="Low-stock threshold" type="number" {...form.register("lowStockThreshold")} />
          </div>
        </section>

        <section className="card p-5 space-y-4">
          <h2 className="font-display text-base">Content</h2>
          <FormTextarea label="Benefits (one per line)" {...form.register("benefits")} />
          <FormTextarea label="Ingredients (one per line)" {...form.register("ingredients")} />
          <FormTextarea label="How to use (one per line)" {...form.register("howToUse")} />
          <Controller
            control={form.control}
            name="images"
            render={({ field, fieldState }) => (
              <ImagePicker
                label="Product images"
                hint="Upload from your device (preferred) or paste a public image URL. First image becomes the cover."
                value={field.value ?? []}
                onChange={field.onChange}
                max={6}
                error={fieldState.error?.message}
              />
            )}
          />
        </section>

        <section className="card p-5 space-y-3">
          <h2 className="font-display text-base">Visibility</h2>
          <Controller
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormSwitch
                label="Featured"
                description="Appears in featured edits on the storefront."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Controller
            control={form.control}
            name="isBestSeller"
            render={({ field }) => (
              <FormSwitch
                label="Best seller"
                description="Shows a 'Bestseller' tag on product cards."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Controller
            control={form.control}
            name="isNewArrival"
            render={({ field }) => (
              <FormSwitch
                label="New arrival"
                description="Shows a 'New' tag on product cards."
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </section>

        <section className="card p-5 space-y-3">
          <h2 className="font-display text-base">SEO</h2>
          <FormInput
            label="SEO title"
            hint="Auto-filled from the product name. Edit to override."
            maxLength={SEO_TITLE_MAX}
            {...form.register("seoTitle", { onChange: () => { seoTitleTouched.current = true; } })}
          />
          <FormTextarea
            label="SEO description"
            hint={`${seoDescription.length}/${SEO_DESC_MAX} characters`}
            maxLength={SEO_DESC_MAX}
            {...form.register("seoDescription")}
          />
        </section>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={() => navigate(`${rolePath}/products`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={create.isPending || update.isPending}>
            {create.isPending || update.isPending ? "Saving…" : mode === "new" ? "Create product" : "Save changes"}
          </Button>
        </div>
      </form>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Product created</DialogTitle>
            <DialogDescription>
              The product was added to the catalog. What would you like to do next?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowSuccess(false);
                navigate(`${rolePath}/inventory`);
              }}
            >
              Go to inventory
            </Button>
            <Button type="button" onClick={() => setShowSuccess(false)}>
              Add another product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
