/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://loa-koon.co.kr",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/**", "/sponsor"],
  transform: async (config, path) => {
    // 우선순위를 높게 설정할 핵심 페이지들
    const highPriorityPages = ["/", "/refine", "/raid"];
    const priority = highPriorityPages.includes(path) ? 1.0 : 0.5;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api"],
      },
    ],
  },
};
