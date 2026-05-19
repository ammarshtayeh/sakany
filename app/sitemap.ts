import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://sakany.vercel.app";

  // Static pages
  const staticPages = [
    "",
    "/students",
    "/studentesses",
    "/roommate",
    "/owner/submit",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic listing pages (example - you can generate from database)
  const listingPages = Array.from({ length: 10 }, (_, i) => ({
    url: `${baseUrl}/listing/${i + 1}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...listingPages];
}
