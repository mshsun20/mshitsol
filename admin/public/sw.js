
let cacheData='cacheVAdm'

this.addEventListener('install', async (e) => {
    const cache = await caches.open(cacheData)
    if (cache) {
        await cache.addAll([
            '/static/js/bundle.js',
            '/favicon.ico',
            '/index.html',
            '/',
            '/admin',
            '/admin/register',
            '/admin/dashboard',
            '/admin/users',
            '/admin/users/adduser',
            '/admin/users/upldusers',
            '/admin/users/exprtusers',
            '/admin/users/usracc/:id',
            '/admin/users/edituser/:id',
            '/admin/services',
            '/admin/plans',
            '/admin/features',
            '/admin/faqs',
            '/admin/feedbacks',
            '/admin/countrymaster',
            '/admin/countrymaster/addcountry',
            '/admin/countrymaster/upldcountry',
            '/admin/countrymaster/exprtcountry',
            '/admin/countrymaster/countrydtl/:id',
            '/admin/countrymaster/editcountry/:id',
            '/admin/currencymaster',
            '/admin/currencymaster/addcurrency',
            '/admin/currencymaster/upldcurrency',
            '/admin/currencymaster/exprtcurrency',
            '/admin/currencymaster/currencydtl/:id',
            '/admin/currencymaster/editcurrency/:id'
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
