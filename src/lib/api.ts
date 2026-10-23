export type ApiResult = { ok: boolean; message?: string; error?: string; unverified?: boolean };

/** POST JSON a la API y devuelve la respuesta con un `ok` normalizado. */
export async function postJson(url: string, body: unknown): Promise<ApiResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, error: "No se pudo conectar con el servidor" };
  }
}
