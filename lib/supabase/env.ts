export function hasSupabasePublicConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function hasSupabaseServerConfig(): boolean {
  return hasSupabasePublicConfig() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function supabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("La configuration Supabase publique est incomplète.");
  return { url, anonKey };
}
