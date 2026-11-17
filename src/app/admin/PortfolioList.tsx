import Link from "next/link";
import { getProjects } from "@/lib/data";
import { deleteProject } from "./actions";

export default async function PortfolioList({ kind }: { kind: "experience" | "project" }) {
  const isWork = kind === "experience";
  const path = isWork ? "/admin/work" : "/admin/projects";
  const entries = (await getProjects()).filter((entry) => (entry.kind === "experience") === isWork);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="admin-h1">{isWork ? "work" : "projects"}</h1>
        <Link href={`${path}/new`} className="btn primary">
          {isWork ? "+ new work experience" : "+ new project"}
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>name</th>
            <th>slug</th>
            <th>when</th>
            <th>current</th>
            <th>order</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 && (
            <tr><td colSpan={6}>{isWork ? "No work experience yet." : "No projects yet."}</td></tr>
          )}
          {entries.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td style={{ color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                {p.slug}
              </td>
              <td>{p.when}</td>
              <td>{p.current ? "yes" : "no"}</td>
              <td>{p.order}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link href={`${path}/${p.id}`} className="btn">
                  edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteProject(p.id);
                  }}
                >
                  <button className="btn danger" type="submit">
                    delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
