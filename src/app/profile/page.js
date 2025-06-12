import styles from "./profile.module.css";
import { redirect } from "next/navigation";
import { requireAuth } from "@utils/supabase/server";
import { handleError } from "@utils/error-handler";
import { getUserProfile } from "@/services/profile.server";

export default async function ProfilePage() {
  try {
    // Verificar autenticación y obtener cliente de supabase
    const { session, supabase } = await requireAuth();

    // Obtener el perfil del usuario usando el servicio
    const profile = await getUserProfile(supabase, session);

    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <h1>Perfil de Usuario</h1>
          <div className={styles.profileInfo}>
            <div className={styles.infoItem}>
              <label>Email:</label>
              <p>{profile.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>Nombre de usuario:</label>
              <p>{profile.username}</p>
            </div>

            <div className={styles.infoItem}>
              <label>Nombre:</label>
              <p>{profile.name || "No especificado"}</p>
            </div>

            <div className={styles.infoItem}>
              <label>Último inicio de sesión:</label>
              <p>{new Date(profile.lastSignIn).toLocaleString("es-ES")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Manejar el error y redirigir si es necesario
    const handledError = handleError(error, {
      component: "ProfilePage",
      action: "fetch",
      userId: error.session?.user?.id,
    });

    if (handledError.type === "AUTH_ERROR") {
      redirect("/login");
    }

    throw error; // Next.js manejará el error y mostrará la página de error más cercana
  }
}
