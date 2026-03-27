// Client-side helper for admin pages to call admin API routes

type AdminFetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  params?: Record<string, string>;
};

export async function adminFetch<T = any>(
  table: string,
  options: AdminFetchOptions = {}
): Promise<T> {
  const { method = 'GET', data, params } = options;

  let url = `/api/admin/${table}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const res = await fetch(url, {
    method,
    headers: data ? { 'Content-Type': 'application/json' } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || `Request failed with status ${res.status}`);
  }

  return json;
}
