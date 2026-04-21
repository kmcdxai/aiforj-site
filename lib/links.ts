const WORKBOOK_BASE_URL = "https://aiforj.gumroad.com/l/jmdqvd";

export type ConversionCampaign = "cbt_workbook" | "premium";

export interface ConversionParams {
  utm_source: "aiforj";
  utm_medium: string;
  utm_campaign: ConversionCampaign;
}

export function normalizeMedium(medium = "site") {
  return (
    String(medium || "site")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "site"
  );
}

export function conversionParams(medium: string, campaign: ConversionCampaign): ConversionParams {
  return {
    utm_source: "aiforj",
    utm_medium: normalizeMedium(medium),
    utm_campaign: campaign,
  };
}

export function workbookLink(medium = "site") {
  const url = new URL(WORKBOOK_BASE_URL);
  const params = conversionParams(medium, "cbt_workbook");
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
}

export function premiumAttribution(medium = "site") {
  return conversionParams(medium, "premium");
}
