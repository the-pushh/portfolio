import { redirect } from "next/navigation";
export default function TracksRedirect() {
  redirect("/admin/playlists");
}
