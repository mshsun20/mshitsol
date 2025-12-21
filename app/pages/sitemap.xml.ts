import type { GetServerSideProps } from "next";

const SITE_URL = "https://mshitsol-app.vercel.app"; // 🔴 change to your domain

interface SiteMapPage {
    url: string;
    freq: string;
    priority: number;
}

function generateSiteMap(pages: SiteMapPage[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
    .map((page) => {
        return `
        <url>
            <loc>${SITE_URL}${page.url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>${page.freq}</changefreq>
            <priority>${parseFloat(String(page.priority)).toFixed(1)}</priority>
        </url>`;
    })
    .join("")}
    </urlset>`;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const staticPages = [
        { url: "/", freq: "weekly", priority: 1.0 },
        { url: "/about", freq: "monthly", priority: 0.8 },
        { url: "/project", freq: "monthly", priority: 0.8 },
        { url: "/contact", freq: "monthly", priority: 0.8 },
    ];

    const sitemap = generateSiteMap(staticPages);

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
};

const Sitemap = () => {
    return null;
};

export default Sitemap;
