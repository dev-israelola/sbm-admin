import { useEffect } from "react";
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
import { useCreateProduct, useProduct, useUpdateProduct } from "@/features/products/useProducts";
import { PRODUCT_CATEGORIES_BY_PLATFORM, PRODUCT_CATEGORY_LABEL } from "@/types/product";
import { useAuthStore } from "@/store/auth-store";
import { PLATFORM_CONFIG } from "@/types/platform";

const schema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
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
  const create = useCreateProduct();
  const update = useUpdateProduct();
  const categoryOptions = PRODUCT_CATEGORIES_BY_PLATFORM[activePlatform];
  const defaultCategory = categoryOptions[0];
  const defaultBrand = platform.defaultBrand;

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "draft",
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      retailPrice: 0,
      costPrice: 0,
      availableStock: 0,
      lowStockThreshold: 5,
      category: defaultCategory,
      brand: defaultBrand,
      images: [],
    } as Partial<Values> as Values,
  });

  useEffect(() => {
    if (existing.data) {
      const p = existing.data;
      form.reset({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        brand: p.brand,
        category: p.category,
        description: p.description,
        shortDescription: p.shortDescription,
        benefits: p.benefits.join("\n"),
        ingredients: p.ingredients.join("\n"),
        howToUse: p.howToUse.join("\n"),
        retailPrice: p.retailPrice,
        costPrice: p.costPrice,
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
    const payload = {
      name: v.name,
      slug: v.slug,
      sku: v.sku,
      brand: v.brand,
      category: v.category as any,
      description: v.description,
      shortDescription: v.shortDescription,
      benefits: v.benefits.split("\n").map((s) => s.trim()).filter(Boolean),
      ingredients: v.ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
      howToUse: v.howToUse.split("\n").map((s) => s.trim()).filter(Boolean),
      images: v.images,
      retailPrice: v.retailPrice,
      costPrice: v.costPrice,
      availableStock: v.availableStock,
      lowStockThreshold: v.lowStockThreshold,
      status: v.status,
      isFeatured: v.isFeatured,
      isBestSeller: v.isBestSeller,
      isNewArrival: v.isNewArrival,
      seoTitle: v.seoTitle,
      seoDescription: v.seoDescription,
      tags: [],
    };

    if (mode === "new") {
      const product = await create.mutateAsync(payload);
      toast.success("Product created.");
      navigate(`${rolePath}/products/${product.id}/edit`);
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
            <FormInput label="Slug" {...form.register("slug")} error={form.formState.errors.slug?.message} />
            <FormInput label="SKU" {...form.register("sku")} error={form.formState.errors.sku?.message} />
            <FormInput label="Brand" {...form.register("brand")} error={form.formState.errors.brand?.message} />
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormSelect
                  label="Category"
                  value={field.value}
                  onChange={field.onChange}
                  options={categoryOptions.map((value) => ({ value, label: PRODUCT_CATEGORY_LABEL[value] }))}
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
          <FormInput label="SEO title" {...form.register("seoTitle")} />
          <FormTextarea label="SEO description" {...form.register("seoDescription")} />
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
    </div>
  );
}
