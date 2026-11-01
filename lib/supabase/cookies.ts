const localHttpUrl = /^http:\/\/(localhost|127(?:\.\d{1,3}){3}|\[::1\])(?::\d+)?(?:\/|$)/i;

export function supabaseCookieOptions() {
  const plainHttpLocal = localHttpUrl.test(process.env.NEXT_PUBLIC_SITE_URL ?? "");
  return {
    name: "nova-supabase-session",
    path: "/",
    sameSite: plainHttpLocal ? "lax" as const : "none" as const,
    secure: !plainHttpLocal,
  };
}

export function supabaseCookieAttributes() {
  const { name: _name, ...attributes } = supabaseCookieOptions();
  return attributes;
}
