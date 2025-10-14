/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://loa-koon.co.kr",
  generateRobotsTxt: true,
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ["/api/**", "/sponsor"],
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
