const cache = new Map<string, unknown>();

export async function cachedFetch<T>(
  url: string,
  parse: (data: unknown) => T,
  fetchFn: typeof fetch = fetch
): Promise<T> {
  const hit = cache.get(url);
  if (hit !== undefined) {
    return hit as T;
  }

  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}): ${url}`);
  }

  const json = await res.json();
  const parsed = parse(json);
  cache.set(url, parsed);
  return parsed;
}

export function clearCache(): void {
  cache.clear();
}

export function cacheSize(): number {
  return cache.size;
}
