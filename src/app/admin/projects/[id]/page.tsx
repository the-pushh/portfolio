import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/data";
import { saveProject } from "../../actions";

export const dynamic = "force-dynamic";

export default async function ProjectEdit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const p = isNew ? null : await getProjectById(id);
  if (!isNew && !p) return notFound();

  async function action(fd: FormData) {
    "use server";
    await saveProject(isNew ? null : id, fd);
  }

  return (
    <div>
      <h1 className="admin-h1">{isNew ? "new project" : "edit project"}</h1>
      <form action={action} className="form-grid">
        <div className="form-row">
          <label>slug</label>
          <input name="slug" defaultValue={p?.slug ?? ""} required />
        </div>
        <div className="form-row">
          <label>name</label>
          <input name="name" defaultValue={p?.name ?? ""} required />
        </div>
        <div className="form-row">
          <label>role</label>
          <input name="role" defaultValue={p?.role ?? ""} />
        </div>
        <div className="form-row">
          <label>when</label>
          <input name="when" defaultValue={p?.when ?? ""} />
        </div>
        <div className="form-row">
          <label>blurb</label>
          <input name="blurb" defaultValue={p?.blurb ?? ""} />
        </div>
        <div className="form-row">
          <label>content (markdown)</label>
          <textarea name="content" defaultValue={p?.content ?? ""} />
        </div>
        <div className="form-row">
          <label>tags (comma separated)</label>
          <input name="tags" defaultValue={(p?.tags ?? []).join(", ")} />
        </div>
        <div className="form-row">
          <label>live url</label>
          <input name="live" defaultValue={p?.live ?? ""} />
        </div>
        <div className="form-row">
          <label>code url</label>
          <input name="code" defaultValue={p?.code ?? ""} />
        </div>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" name="current" defaultChecked={p?.current ?? false} />
            current (shown in main grid)
          </label>
          <div className="form-row" style={{ flex: 1 }}>
            <label>kind</label>
            <select name="kind" defaultValue={p?.kind ?? "project"} style={{ fontFamily: "var(--font-mono)", fontSize: 13, padding: "6px 10px", background: "var(--bg-2)", border: "1px solid var(--line)", borderRadius: 6, color: "var(--ink)" }}>
              <option value="project">project</option>
              <option value="experience">experience</option>
            </select>
          </div>
          <div className="form-row" style={{ flex: 1 }}>
            <label>order</label>
            <input name="order" type="number" defaultValue={p?.order ?? 0} />
          </div>
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
