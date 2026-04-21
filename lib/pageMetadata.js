import { articleOgImage } from "./ogImages";

const BASE_URL = "https://aiforj.com";

function defaultSocialTitle(title) {
  return String(title).split("|")[0].trim();
}

export function buildContentPageMetadata({
  title,
  description,
  path,
  kind,
  slug,
  socialTitle,
  socialDescription,
  type = "article",
}) {
  const url = `${BASE_URL}${path}`;
  const ogTitle = socialTitle || defaultSocialTitle(title);
  const ogDescription = socialDescription || description;
  const image = kind && slug
    ? articleOgImage({ kind, slug, title: ogTitle })
    : `${BASE_URL}/aif.jpeg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      siteName: "AIForj",
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${ogTitle} | AIForj`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}
