
let cacheData='cacheVUsr'

this.addEventListener('install', async (e) => {
    const cache = await caches.open(cacheData)
    if (cache) {
        await cache.addAll([
            '/static/js/bundle.js',
            '/favicon.ico',
            '/index.html',
            '/',
            '/register',
            '/login',
            '/services',
            '/portfolio',
            '/testimonials',
            '/contacts',
        ])
    }
    else {
        console.warn(`Cache Still not Created !!!`)
    }
})

this.addEventListener('fetch', async (e) => {
    if (!navigator.onLine) {
        const resp = await e.respondWith(caches.match(e.request))
        if (resp) {
            return resp
        }
        let reqUrl = e.request.clone()
        fetch(reqUrl)
    }
})
