import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { ImagePicker } from "@/components/forms/ImagePicker";
import { useCategory, useCreateCategory, useUpdateCategory } from "@/features/categories/useCategoriesAdmin";
import { slugify } from "@/lib/slug";

const schema = z.object({
  name: z.string().min(2, "Name is too short"),
  slug: z.string().min(2, "Slug is required"),
  blurb: z.string().optional(),
  image: z.string().min(1, "An image is required"),
});

export function CategoryFormScreen({ rolePath, mode }: { rolePath: string; mode: "new" | "edit" }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const slugTouched = useRef(false);

  const categoryQuery = useCategory(mode === "edit" ? slug : undefined);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", blurb: "", image: "" },
  });

  const name = form.watch("name");

  // Auto-fill slug if untouched
  useEffect(() => {
    if (mode === "new" && !slugTouched.current && name) {
      form.setValue("slug", slugify(name), { shouldValidate: true });
    }
  }, [name, mode, form]);

  useEffect(() => {
    if (mode === "edit" && categoryQuery.data) {
      form.reset({
        name: categoryQuery.data.name,
        slug: categoryQuery.data.slug,
        blurb: categoryQuery.data.blurb ?? "",
        image: categoryQuery.data.image ?? "",
      });
    }
  }, [mode, categoryQuery.data, form]);

  const onSubmit = (values: z.infer<typeof schema>) => {
    if (mode === "new") {
      createMutation.mutate(values, {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => navigate(`${rolePath}/categories`), 1000);
        },
      });
    } else {
      updateMutation.mutate({ id: categoryQuery.data.id, ...values }, {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => navigate(`${rolePath}/categories`), 1000);
        },
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link to={`${rolePath}/categories`} className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" />
          Back to categories
        </Link>
      </div>

      <PageHeader
        eyebrow="Taxonomy"
        title={mode === "new" ? "Create Category" : "Edit Category"}
        description="Structure your storefront inventory groups seamlessly."
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6 lg:flex-row">
        {/* Left Column (Main Form) */}
        <section className="flex flex-1 flex-col gap-6">
          <div className="rounded-xl border border-line bg-surface p-5 space-y-5">
            <h2 className="font-display text-base">Basic Information</h2>

            <div className="space-y-1">
              <label className="text-[13px] font-medium text-ink">Name</label>
              <input
                {...form.register("name")}
                className="w-full rounded-md border border-line bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. Cleansers & Face Washes"
              />
              {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-medium text-ink">Slug</label>
              <div className="flex w-full items-center rounded-md border border-line bg-background pl-3 text-sm focus-within:ring-1 focus-within:ring-accent">
                <span className="text-ink-muted">/categories/</span>
                <input
                  {...form.register("slug")}
                  className="w-full bg-transparent p-2 outline-none"
                  placeholder="cleansers-and-face-washes"
                  onChange={(e) => {
                    slugTouched.current = true;
                    form.register("slug").onChange(e);
                  }}
                />
              </div>
              {form.formState.errors.slug && <p className="text-xs text-red-500">{form.formState.errors.slug.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-medium text-ink">Short Blurb (Optional)</label>
              <textarea
                {...form.register("blurb")}
                rows={3}
                className="w-full rounded-md border border-line bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Purify and refresh your skin daily."
              />
            </div>
          </div>
        </section>

        {/* Right Column */}
        <section className="flex w-full flex-col gap-6 lg:w-[320px]">
          <div className="rounded-xl border border-line bg-surface p-5 space-y-5">
            <h2 className="font-display text-base">Media</h2>
            <Controller
              control={form.control}
              name="image"
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <ImagePicker label="Category Image" value={field.value ? [field.value] : []} onChange={(urls) => field.onChange(urls[0] || "")} />
                  {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                </div>
              )}
            />
          </div>

          <div className="sticky top-[72px] space-y-3 rounded-xl border border-line bg-surface p-5">
            <Button type="submit" disabled={isSaving} className="w-full" size="lg">
              {isSaving ? "Saving..." : "Save Category"} <Save className="ml-2 h-4 w-4" />
            </Button>
            {showSuccess && (
              <p className="text-center text-[13px] font-medium text-green-600">Saved successfully!</p>
            )}
            {(createMutation.isError || updateMutation.isError) && (
              <p className="text-center text-[13px] text-red-500">Failed to save. Check slug constraints.</p>
            )}
          </div>
        </section>
      </form>
    </div>
  );
}
