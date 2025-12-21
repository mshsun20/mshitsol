import type { GetServerSideProps } from "next";

const SITE_URL = "https://mshitsol-app.vercel.app"; // 🔴 change to your domain

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    const robotsTxt = `
        User-agent: *
        Allow: /

        Sitemap: ${SITE_URL}/sitemap.xml
    `.trim();

    res.setHeader("Content-Type", "text/plain");
    res.write(robotsTxt);
    res.end();

    return {
        props: {},
    };
};

export default function Robots() {
    return null;
}
