const BASE_URL = "https://aiforj.com";

export function articleOgImage({ kind = "help", slug = "", title = "" }) {
  const params = new URLSearchParams({
    kind,
    slug,
    title,
  });

  return `${BASE_URL}/api/og/article?${params.toString()}`;
}
