import { notFound } from "next/navigation";
import { getThoughtById } from "@/lib/data";
import { saveThought } from "../../actions";

export const dynamic = "force-dynamic";

export default async function ThoughtEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const t = isNew ? null : await getThoughtById(id);
  if (!isNew && !t) return notFound();

  async function action(fd: FormData) {
    "use server";
    await saveThought(isNew ? null : id, fd);
  }

  return (
    <div>
      <h1 className="admin-h1">{isNew ? "new thought" : "edit thought"}</h1>
      <form action={action} className="form-grid">
        <div className="form-row">
          <label>slug</label>
          <input name="slug" defaultValue={t?.slug ?? ""} required />
        </div>
        <div className="form-row">
          <label>title</label>
          <input name="title" defaultValue={t?.title ?? ""} required />
        </div>
        <div className="form-row">
          <label>excerpt</label>
          <input name="excerpt" defaultValue={t?.excerpt ?? ""} />
        </div>
        <div className="form-row">
          <label>content (markdown)</label>
          <textarea name="content" defaultValue={t?.content ?? ""} />
        </div>
        <div className="form-row">
          <label>tags (comma separated)</label>
          <input name="tags" defaultValue={(t?.tags ?? []).join(", ")} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-row">
            <label>date</label>
            <input name="date" defaultValue={t?.date ?? ""} />
          </div>
          <div className="form-row">
            <label>read time</label>
            <input name="readTime" defaultValue={t?.readTime ?? ""} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 18 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" name="featured" defaultChecked={t?.featured ?? false} />
            featured
          </label>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" name="published" defaultChecked={t?.published ?? true} />
            published
          </label>
        </div>
        <div>
          <button className="btn primary" type="submit">
            save
          </button>
        </div>
      </form>
    </div>
  );
}
