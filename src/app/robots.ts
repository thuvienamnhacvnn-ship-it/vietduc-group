import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/settings";
import { resolveSiteUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = resolveSiteUrl(settings.seo.siteUrl);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The editor area, the API surface and result pages carry nothing worth
        // indexing and some of it is personal.
        disallow: ["/admin", "/api/", "/*/tim-kiem", "/*/chuong-trinh/so-sanh"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
