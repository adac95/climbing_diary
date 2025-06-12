/**
 * Servicio para manejar las operaciones de perfil de usuario en el servidor
 */

/**
 * Obtiene el perfil público y datos de usuario seguros
 * @param {Object} supabase - Cliente Supabase del servidor
 * @param {Object} session - Sesión del usuario
 * @returns {Object} - Datos combinados del perfil
 */
export async function getUserProfile(supabase, session) {
  if (!session || !supabase) {
    throw new Error("Se requiere una sesión y cliente Supabase válidos");
  }

  // Extrae datos seguros de la sesión
  const userId = session.user.id;
  const userEmail = session.user.email;
  const lastSignIn = session.user.last_sign_in_at;
  const userMetadata = session.user.user_metadata || {};

  // Crea un objeto base con los datos de autenticación
  const profileData = {
    id: userId,
    email: userEmail,
    lastSignIn,
    name: userMetadata.full_name || null,
    // Otros datos básicos que puedan venir de los metadatos de usuario
  };

  try {
    // Intenta obtener datos del perfil público
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId);

    console.log(data);
    if (!error && data) {
      // Combina los datos del perfil público con los datos básicos
      return {
        ...profileData,
        // Aquí se sobrescriben o añaden datos del perfil público
        name: data.name || profileData.name,
        username: data.user_name || "No especificado",
        avatar_url: data.avatar_url,
        ...data,
        // Puedes añadir más campos específicos aquí
      };
    }
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    // Continuamos con los datos básicos en caso de error
  }

  // Si no hay perfil público o hubo un error, devuelve los datos básicos
  return profileData;
}

/**
 * Actualiza el perfil de un usuario
 * @param {Object} supabase - Cliente Supabase del servidor
 * @param {string} userId - ID del usuario
 * @param {Object} profileData - Datos a actualizar
 * @returns {Object} - Resultado de la operación
 */
export async function updateUserProfile(supabase, userId, profileData) {
  if (!userId || !supabase) {
    throw new Error("Se requiere un ID de usuario y cliente Supabase válidos");
  }

  try {
    // Primero verifica si el perfil ya existe
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    let result;

    if (existingProfile) {
      // Actualiza el perfil existente
      result = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", userId);
    } else {
      // Crea un nuevo perfil
      result = await supabase
        .from("profiles")
        .insert([{ id: userId, ...profileData }]);
    }

    return { success: !result.error, data: result.data, error: result.error };
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    return { success: false, error };
  }
}
