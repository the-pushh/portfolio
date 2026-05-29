import { getToolbox } from "@/lib/data";
import { deleteToolbox, saveToolbox } from "../actions";

export const dynamic = "force-dynamic";

export default async function ToolboxAdmin() {
  const cats = await getToolbox();

  async function add(fd: FormData) {
    "use server";
    await saveToolbox(null, fd);
  }

  return (
    <div>
      <h1 className="admin-h1">toolbox</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
        {cats.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <form
              action={async (fd: FormData) => {
                "use server";
                await saveToolbox(c.id, fd);
              }}
              style={{
                flex: 1,
                display: "grid",
                gridTemplateColumns: "1fr 3fr 60px auto",
                gap: 8,
                alignItems: "center",
                padding: 12,
                border: "1px solid var(--line)",
                borderRadius: 10,
                background: "var(--bg-2)",
              }}
            >
              <input name="name" defaultValue={c.name} />
              <input name="items" defaultValue={c.items.join(", ")} placeholder="comma separated items" />
              <input name="order" type="number" defaultValue={c.order} />
              <button className="btn" type="submit">save</button>
            </form>
            <form action={async () => { "use server"; await deleteToolbox(c.id); }}>
              <button className="btn danger" type="submit">delete</button>
            </form>
          </div>
        ))}
      </div>

      <h2 style={{ fontFamily: "var(--font-edit)", fontSize: 22 }}>add category</h2>
      <form
        action={add}
        style={{ display: "grid", gridTemplateColumns: "1fr 3fr 60px auto", gap: 8, alignItems: "center" }}
      >
        <input name="name" placeholder="Frontend" required />
        <input name="items" placeholder="React, Vue, Svelte" />
        <input name="order" type="number" defaultValue={0} />
        <button className="btn primary" type="submit">
          add
        </button>
      </form>
    </div>
  );
}
