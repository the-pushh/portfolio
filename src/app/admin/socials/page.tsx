import { getSocials } from "@/lib/data";
import { deleteSocial, saveSocial } from "../actions";

export const dynamic = "force-dynamic";

export default async function SocialsAdmin() {
  const socials = await getSocials();

  async function add(fd: FormData) {
    "use server";
    await saveSocial(null, fd);
  }

  return (
    <div>
      <h1 className="admin-h1">socials</h1>

      <table className="admin-table" style={{ marginBottom: 28 }}>
        <thead>
          <tr>
            <th>key</th>
            <th>value</th>
            <th>href</th>
            <th>order</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {socials.map((s) => (
            <tr key={s.id}>
              <td colSpan={5}>
                <form
                  action={async (fd: FormData) => {
                    "use server";
                    await saveSocial(s.id, fd);
                  }}
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr 60px auto auto", gap: 8, alignItems: "center" }}
                >
                  <input name="key" defaultValue={s.key} />
                  <input name="val" defaultValue={s.val} />
                  <input name="href" defaultValue={s.href} />
                  <input name="order" type="number" defaultValue={s.order} />
                  <button className="btn" type="submit">
                    save
                  </button>
                  <button
                    className="btn danger"
                    type="button"
                    formAction={async () => {
                      "use server";
                      await deleteSocial(s.id);
                    }}
                  >
                    delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontFamily: "var(--font-edit)", fontSize: 22 }}>add new</h2>
      <form
        action={add}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr 60px auto", gap: 8, alignItems: "center" }}
      >
        <input name="key" placeholder="Github" required />
        <input name="val" placeholder="@handle" required />
        <input name="href" placeholder="https://…" required />
        <input name="order" type="number" defaultValue={0} />
        <button className="btn primary" type="submit">
          add
        </button>
      </form>
    </div>
  );
}
