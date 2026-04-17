const BASE_URL = 'https://aiforj.com';

export const CARD_FORMATS = {
  og: { width: 1200, height: 630, label: 'Preview' },
  story: { width: 1080, height: 1920, label: 'Story' },
  feed: { width: 1080, height: 1350, label: 'Feed' },
  square: { width: 1080, height: 1080, label: 'Square' },
};

export function buildCalmCardUrl({ kind = 'technique', slug, format = 'og', download = false, brand = '' }) {
  const params = new URLSearchParams({
    kind,
    slug,
    format,
  });

  const normalizedBrand = String(brand || '').replace(/\s+/g, ' ').trim();
  if (normalizedBrand) {
    params.set('brand', normalizedBrand.slice(0, 48));
  }

  if (download) {
    params.set('download', '1');
  }

  return `${BASE_URL}/api/calm-card?${params.toString()}`;
}
