import createCache from "@emotion/cache";

const emotionCache = createCache({
    key: "css",
    prepend: true,
});

export default emotionCache;
