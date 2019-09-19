self.addEventListener('fetch', function(event) {
    if (event.request.url.endsWith("/")) {
        event.request.url = event.request.url.substring(0, event.request.url.length - 1) + ".html";
    }
    if (event.request.url.endsWith(".html")) {
        event.respondWith(fetch(event.request).then(function(fetchResponse) {
            if (badResponse(fetchResponse)) {
                caches.match(event.request).then(function(cachedResponse) {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetchResponse;
                });
            }
            return cacheAndClone(event.request, fetchResponse);
        }));
    } else {
        event.respondWith(caches.match(event.request).then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then(function(fetchResponse) {
                if (badResponse(fetchResponse)) {
                    return fetchResponse;
                }
                return cacheAndClone(event.request, fetchResponse);
            });
        }));
    }
});

var badResponse = function(fetchData) {
    return !fetchData || fetchData.status !== 200 || fetchData.type !== 'basic'
};

var cacheAndClone = function(key, response) {
    var responseToCache = response.clone();
    caches.open("Jekyll-Reflection")
        .then(function(cache) {
            cache.put(key, responseToCache);
        });
    return response;
};