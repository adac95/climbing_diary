import styles from "./profile.module.css";
import { redirect } from "next/navigation";
import { requireAuth } from "@utils/supabase/server";
import { handleError } from "@utils/error-handler";

export default async function ProfilePage() {
  try {
    // Verificar autenticación
    const { session, supabase } = await requireAuth();

    // Obtener datos del perfil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    return (
      <div className={styles.profileContainer}>
        <div className={styles.profileCard}>
          <h1>Perfil de Usuario</h1>
          <div className={styles.profileInfo}>
            <div className={styles.infoItem}>
              <label>Email:</label>
              <p>{session.user.email}</p>
            </div>
            <div className={styles.infoItem}>
              <label>ID de Usuario:</label>
              <p>{session.user.id}</p>
            </div>
            {profile && (
              <>
                <div className={styles.infoItem}>
                  <label>Nombre:</label>
                  <p>{profile.full_name || 'No especificado'}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Nombre de usuario:</label>
                  <p>{profile.username || 'No especificado'}</p>
                </div>
              </>
            )}
            <div className={styles.infoItem}>
              <label>Último inicio de sesión:</label>
              <p>{new Date(session.user.last_sign_in_at).toLocaleString('es-ES')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // Manejar el error y redirigir si es necesario
    const handledError = handleError(error, {
      component: 'ProfilePage',
      action: 'fetch',
      userId: error.session?.user?.id
    });

    if (handledError.type === 'AUTH_ERROR') {
      redirect('/login');
    }

    throw error; // Next.js manejará el error y mostrará la página de error más cercana
  }
}
