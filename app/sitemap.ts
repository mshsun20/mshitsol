import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        { url: "https://mshitsol.com/", lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: "https://mshitsol.com/about", lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: "https://mshitsol.com/projects", lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: "https://mshitsol.com/contact", lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: "https://mshitsol.com/skills", lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ];
}