const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function getCachedRegions() {
  try {
    console.log(`📡 Fetch a: ${BASE_URL}/api/regions`);
    
    const response = await fetch(`${BASE_URL}/api/regions`, {
      credentials: "include",  // ✅ Incluye las cookies de sesión
      headers: {
        "Content-Type": "application/json",
      },
    });

    const contentType = response.headers.get("content-type") || "";
    console.log("🔍 Response Headers:", contentType);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }

    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("⚠️ Respuesta inesperada:", text);
      throw new Error(`Respuesta no es JSON. Recibido: ${contentType}`);
    }

    const data = await response.json();
    console.log("✅ Datos recibidos:", data);
    return data;
  } catch (error) {
    console.error(`❌ Error al obtener regiones:`, error);
    return [];
  }
}
