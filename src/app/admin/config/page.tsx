import { getSiteConfig } from "@/lib/data";
import { saveConfig } from "../actions";

export const dynamic = "force-dynamic";

export default async function ConfigAdmin() {
  const cfg = await getSiteConfig();

  async function action(fd: FormData) {
    "use server";
    await saveConfig(fd);
  }

  return (
    <div>
      <h1 className="admin-h1">site config</h1>
      <form action={action} className="form-grid">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-row">
            <label>name</label>
            <input name="name" defaultValue={cfg.name} />
          </div>
          <div className="form-row">
            <label>role</label>
            <input name="role" defaultValue={cfg.role} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-row">
            <label>location</label>
            <input name="location" defaultValue={cfg.location} />
          </div>
          <div className="form-row">
            <label>accent (hex)</label>
            <input name="accent" defaultValue={cfg.accent} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-row">
            <label>status</label>
            <input name="status" defaultValue={cfg.status} />
          </div>
          <div className="form-row">
            <label>status dot</label>
            <input name="statusDot" defaultValue={cfg.statusDot} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="form-row">
            <label>email</label>
            <input name="email" defaultValue={cfg.email} />
          </div>
          <div className="form-row">
            <label>resume url</label>
            <input name="resumeUrl" defaultValue={cfg.resumeUrl} />
          </div>
        </div>
        <div className="form-row">
          <label>cal url</label>
          <input name="calUrl" defaultValue={cfg.calUrl} />
        </div>
        <div className="form-row">
          <label>about (home prose)</label>
          <textarea name="about" defaultValue={cfg.about} style={{ minHeight: 200 }} />
        </div>
        <div className="form-row">
          <label>bio (used by chatbot)</label>
          <textarea name="bio" defaultValue={cfg.bio} style={{ minHeight: 200 }} />
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
