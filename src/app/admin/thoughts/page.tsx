import Link from "next/link";
import { getThoughts } from "@/lib/data";
import { deleteThought } from "../actions";

export const dynamic = "force-dynamic";

export default async function ThoughtsAdmin() {
  const thoughts = await getThoughts({ onlyPublished: false });
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 className="admin-h1">thoughts</h1>
        <Link href="/admin/thoughts/new" className="btn primary">
          + new thought
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>title</th>
            <th>slug</th>
            <th>date</th>
            <th>published</th>
            <th>featured</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {thoughts.map((t) => (
            <tr key={t.id}>
              <td>{t.title}</td>
              <td style={{ color: "var(--ink-dim)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                {t.slug}
              </td>
              <td>{t.date}</td>
              <td>{t.published ? "yes" : "no"}</td>
              <td>{t.featured ? "yes" : "no"}</td>
              <td style={{ display: "flex", gap: 8 }}>
                <Link href={`/admin/thoughts/${t.id}`} className="btn">
                  edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteThought(t.id);
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
