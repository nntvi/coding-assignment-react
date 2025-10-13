export async function fetchData<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const raw = await res.text();

  if (!res.ok) {
    let message = "Error fetching data";
    if (raw) {
      try {
        message = JSON.parse(raw)?.message ?? message;
      } catch {
        message = raw;
      }
    }
    throw new Error(message);
  }
  if (!raw) return undefined as unknown as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined as unknown as T;
  }
}
