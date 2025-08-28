import type { SignInInput, AuthResult } from "../model/types";

/** Stub UI-first: simulasi login agar alur & loading UI bisa dites.
 *  Ganti isi fungsi ini dengan fetch/axios ke backend kamu nanti.
 */
export async function signIn(payload: SignInInput): Promise<AuthResult> {
  // delay manis biar keliatan loading
  await new Promise((r) => setTimeout(r, 700));

  // contoh error sederhana
  if (payload.password === "wrong") {
    const e = new Error("Kredensial salah");
    (e as any).status = 401;
    throw e;
  }

  // sukses palsu
  return {
    user: {
      id: "u_demo",
      name: payload.identifier.includes("@")
        ? "Demo (Email)"
        : "Demo (Username)",
      email: payload.identifier.includes("@")
        ? payload.identifier
        : "demo@example.com",
    },
    token: "demo-token-123",
  };
}
