import { getTracks } from "@/lib/data";
import { deleteTrack, saveTrack } from "../actions";

export const dynamic = "force-dynamic";

export default async function TracksAdmin() {
  const tracks = await getTracks();

  async function add(fd: FormData) {
    "use server";
    await saveTrack(null, fd);
  }

  return (
    <div>
      <h1 className="admin-h1">tracks</h1>

      <table className="admin-table" style={{ marginBottom: 28 }}>
        <thead>
          <tr>
            <th>artist</th>
            <th>title</th>
            <th>length</th>
            <th>order</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((t) => (
            <tr key={t.id}>
              <td colSpan={5}>
                <form
                  action={async (fd: FormData) => {
                    "use server";
                    await saveTrack(t.id, fd);
                  }}
                  style={{ display: "grid", gridTemplateColumns: "1fr 2fr 80px 60px auto auto", gap: 8, alignItems: "center" }}
                >
                  <input name="artist" defaultValue={t.artist} />
                  <input name="title" defaultValue={t.title} />
                  <input name="len" defaultValue={t.len} />
                  <input name="order" type="number" defaultValue={t.order} />
                  <button className="btn" type="submit">
                    save
                  </button>
                  <button
                    className="btn danger"
                    type="button"
                    formAction={async () => {
                      "use server";
                      await deleteTrack(t.id);
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
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr 80px 60px auto", gap: 8, alignItems: "center" }}
      >
        <input name="artist" placeholder="artist" required />
        <input name="title" placeholder="title" required />
        <input name="len" placeholder="3:42" />
        <input name="order" type="number" defaultValue={0} />
        <button className="btn primary" type="submit">
          add
        </button>
      </form>
    </div>
  );
}
