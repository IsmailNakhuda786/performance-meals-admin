export function readLocalState<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocalState<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
