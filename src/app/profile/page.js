import styles from "./profile.module.css";
import { redirect } from "next/navigation";
import { createClient } from "@utils/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  const { user } = data;

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileCard}>
        <h1>Perfil de Usuario</h1>
        <div className={styles.profileInfo}>
          <div className={styles.infoItem}>
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className={styles.infoItem}>
            <label>ID de Usuario:</label>
            <p>{user.id}</p>
          </div>
          <div className={styles.infoItem}>
            <label>Último inicio de sesión:</label>
            <p>{new Date(user.last_sign_in_at).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
