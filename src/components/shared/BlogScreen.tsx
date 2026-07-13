import { useEffect, useState } from "react";
import { Plus, Newspaper } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ImagePicker } from "@/components/forms/ImagePicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import {
  useBlogPosts,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  type AdminBlogPost,
} from "@/features/blog/useBlog";

export function BlogScreen() {
  const { data, isLoading } = useBlogPosts();
  const remove = useDeleteBlogPost();
  const [editing, setEditing] = useState<AdminBlogPost | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteFor, setDeleteFor] = useState<AdminBlogPost | null>(null);

  const columns: DataTableColumn<AdminBlogPost>[] = [
    {
      key: "title",
      header: "Post",
      render: (p) => (
        <div>
          <p className="text-[13px] font-medium text-ink">{p.title}</p>
          <p className="data-muted">/{p.slug}</p>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (p) => <span className="text-[13px]">{p.category}</span> },
    { key: "author", header: "Author", render: (p) => <span className="data-muted">{p.author}</span> },
    {
      key: "status",
      header: "Status",
      render: (p) => <Badge variant={p.status === "PUBLISHED" ? "success" : "warn"}>{p.status === "PUBLISHED" ? "Published" : "Draft"}</Badge>,
    },
    {
      key: "published",
      header: "Published",
      render: (p) => <span className="data-muted">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : "—"}</span>,
    },
    {
      key: "act",
      header: "",
      align: "right",
      render: (p) => (
        <div className="flex justify-end gap-2">
          <Button size="xs" variant="outline" onClick={() => setEditing(p)}>Edit</Button>
          <Button size="xs" variant="ghost" onClick={() => setDeleteFor(p)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Content"
        title="Journal"
        description="Write, edit and publish storefront blog posts."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> New post
          </Button>
        }
      />
      <DataTable
        rows={data}
        columns={columns}
        loading={isLoading}
        rowKey={(p) => p.id}
        dense
        emptyState={
          <div className="flex flex-col items-center gap-2 py-4">
            <Newspaper className="h-5 w-5 text-ink-muted" />
            <span>No posts yet.</span>
          </div>
        }
      />

      <BlogDialog open={createOpen} onOpenChange={setCreateOpen} />
      <BlogDialog key={editing?.id} open={!!editing} onOpenChange={(v) => !v && setEditing(null)} post={editing ?? undefined} />

      <ConfirmDialog
        open={!!deleteFor}
        onOpenChange={(v) => !v && setDeleteFor(null)}
        title={`Delete "${deleteFor?.title ?? ""}"?`}
        description="This removes the post permanently."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (deleteFor) await remove.mutateAsync(deleteFor.id);
        }}
      />
    </div>
  );
}

interface FormValues {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover: string;
  author: string;
  readTime: string;
  bodyText: string;
  status: "DRAFT" | "PUBLISHED";
}

function BlogDialog({
  open,
  onOpenChange,
  post,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  post?: AdminBlogPost;
}) {
  const create = useCreateBlogPost();
  const update = useUpdateBlogPost();
  const editing = !!post;
  const form = useForm<FormValues>({
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      category: post?.category ?? "",
      cover: post?.cover ?? "",
      author: post?.author ?? "",
      readTime: post?.readTime ?? "5 min read",
      bodyText: post?.body.join("\n\n") ?? "",
      status: post?.status ?? "DRAFT",
    },
  });

  useEffect(() => {
    if (!open) form.reset();
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(v: FormValues) {
    const body = v.bodyText.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
    if (body.length === 0) {
      toast.error("Add at least one body paragraph");
      return;
    }
    const payload = {
      title: v.title.trim(),
      slug: v.slug.trim() || undefined,
      excerpt: v.excerpt.trim(),
      category: v.category.trim(),
      cover: v.cover.trim(),
      author: v.author.trim(),
      readTime: v.readTime.trim(),
      body,
      status: v.status,
    };
    try {
      if (editing) {
        await update.mutateAsync({ id: post!.id, ...payload });
        toast.success("Post updated");
      } else {
        await create.mutateAsync(payload);
        toast.success("Post created");
      }
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save post");
    }
  }

  const busy = create.isPending || update.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit post" : "New post"}</DialogTitle>
          <DialogDescription>Separate body paragraphs with a blank line.</DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-3">
          <FormInput label="Title" {...form.register("title", { required: true })} />
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Slug (optional)" placeholder="auto from title" {...form.register("slug")} />
            <FormInput label="Category" {...form.register("category", { required: true })} />
          </div>
          <FormInput label="Excerpt" {...form.register("excerpt", { required: true })} />
          <div className="space-y-1">
            <Controller
              control={form.control}
              name="cover"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <ImagePicker label="Cover Image" value={field.value ? [field.value] : []} onChange={(urls) => field.onChange(urls[0] || "")} />
                  {fieldState.error && <p className="text-xs text-red-500">{fieldState.error.message}</p>}
                </>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FormInput label="Author" {...form.register("author", { required: true })} />
            <FormInput label="Read time" placeholder="5 min read" {...form.register("readTime", { required: true })} />
            <FormSelect
              label="Status"
              value={form.watch("status")}
              onChange={(v) => form.setValue("status", v as "DRAFT" | "PUBLISHED")}
              options={[
                { value: "DRAFT", label: "Draft" },
                { value: "PUBLISHED", label: "Published" },
              ]}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-ink">Body</label>
            <Textarea rows={10} placeholder="Write paragraphs separated by a blank line…" {...form.register("bodyText")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create post"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
