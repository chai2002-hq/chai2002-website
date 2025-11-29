import { siteUrl } from "@/lib/constants";
import { basehub } from "basehub";
import type { MetadataRoute } from "next";

export const revalidate = 1800; // 30 minutes - adjust as needed

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await basehub().query({
    site: {
      pages: {
        items: {
          pathname: true,
        },
      },
      blog: {
        posts: {
          items: {
            _slug: true,
          },
        },
      },
      changelog: {
        posts: {
          items: {
            _slug: true,
          },
        },
      },
    },
  });

  const lastModified = new Date();

  const formattedPages = data.site.pages.items.map(
    (page) =>
      ({
        url: `${siteUrl}${page.pathname}`,
        lastModified,
        changeFrequency: "daily",
      }) satisfies MetadataRoute.Sitemap[number],
  );

  const formattedBlogPosts = data.site.blog.posts.items.map(
    (post) =>
      ({
        url: `${siteUrl}/blog/${post._slug}`,
        lastModified,
        changeFrequency: "daily",
      }) satisfies MetadataRoute.Sitemap[number],
  );

  const formattedChangelogPosts = data.site.changelog.posts.items.map(
    (post) =>
      ({
        url: `${siteUrl}/changelog/${post._slug}`,
        lastModified,
        changeFrequency: "daily",
      }) satisfies MetadataRoute.Sitemap[number],
  );

  const routes = [
    ...formattedPages,
    ...formattedBlogPosts,
    ...formattedChangelogPosts,
  ];

  return routes;
}
