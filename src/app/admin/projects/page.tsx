import Link from "next/link";
import { getProjects } from "@/lib/data";
import { deleteProject } from "../actions";

export const dynamic = "force-dynamic";

export default async function ProjectsAdmin() {
  const projects = await getProjects();
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="admin-h1">projects</h1>
        <Link href="/admin/projects/new" className="btn primary">
          + new project
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
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td style={{ color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                {p.slug}
              </td>
              <td>{p.when}</td>
              <td>{p.current ? "yes" : "no"}</td>
              <td>{p.order}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link href={`/admin/projects/${p.id}`} className="btn">
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
