// src/features/tickets/api/http.ts
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:4000";

type HttpOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
};

export async function http<T>(path: string, opts: HttpOptions = {}): Promise<T> {
  const url = `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const headers: Record<string, string> = {
    ...(opts.headers || {}),
  };
  let body: BodyInit | undefined;

  if (opts.body !== undefined) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
    body = headers["Content-Type"] === "application/json"
      ? JSON.stringify(opts.body)
      : (opts.body as any);
  }

  const res = await fetch(url, {
    method: opts.method || "GET",
    headers,
    body,
    credentials: "omit",
    cache: "no-store",
  });

  const text = await res.text();
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = (isJson && text) ? JSON.parse(text) : (text as any);

  if (!res.ok) {
    const message = data?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}
