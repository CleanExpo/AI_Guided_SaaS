
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Define cache zones
  const cacheZones = {
    static: /\.(js|css|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|gif|webp|avif|ico)$/i,
    api: /^\/api\//,
    page: /\.(html?|json)$/i
  }
  
  // Determine cache strategy
  let cacheTime = 0
  let sMaxAge = 0
  
  if (cacheZones.static.test(url.pathname)) {
    // Static assets - cache for 1 year
    cacheTime = 60 * 60 * 24 * 365
    sMaxAge = 60 * 60 * 24 * 365
  } else if (cacheZones.api.test(url.pathname)) {
    // API routes - no cache
    cacheTime = 0
    sMaxAge = 0
  } else {
    // HTML pages - cache with revalidation
    cacheTime = 0
    sMaxAge = 60 * 60 // 1 hour
  }
  
  // Check cache
  const cache = caches.default
  let response = await cache.match(request)
  
  if (!response) {
    // Fetch from origin
    response = await fetch(request)
    
    // Clone response for caching
    response = new Response(response.body, response)
    
    // Set cache headers
    response.headers.set('Cache-Control', `public, max-age=${cacheTime}, s-maxage=${sMaxAge}`)
    response.headers.set('X-Cache-Status', 'MISS')
    
    // Store in cache if cacheable
    if (cacheTime > 0) {
      event.waitUntil(cache.put(request, response.clone()))
    }
  } else {
    // Serve from cache
    response = new Response(response.body, response)
    response.headers.set('X-Cache-Status', 'HIT')
  }
  
  return response
}
