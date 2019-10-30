/**
 * Jekyll Reflection Service Worker Version 1.0.0
 * Update this version if you wish to bust cache
 */

/**
 * Bust all cache on a new service worker installation.
 * Feel free to improve this busting process if you will make changes to this service worker and wish to persist cache.
 */
self.addEventListener('install', function(event) {
    caches.open('Jekyll-Reflection').then(function(cache) {
        cache.keys().then(function(keys) {
            keys.forEach(function(request) {
                cache.delete(request);
            });
        });
    });
});

/**
 * Intercept fetch requests with a network first approach on HTML files, and cache first approach for other assets.
 */
self.addEventListener('fetch', function(event) {
    let strippedUrl = stripUrl(event.request.url);
    // If html file (or root)
    if (strippedUrl.endsWith(".html") || strippedUrl.endsWith("/")) {
        // Network attempt first
        event.respondWith(fetch(event.request).then(function(fetchResponse) {
            if (badResponse(fetchResponse)) {
                // If the bad response was a 404, we are actually ok to respond with it and cache it as the 404 response
                if (fetchResponse.status === 404) {
                    strippedUrl = self.location.origin + "/404/";
                } else {
                    // Cache attempt second
                    // Note, we fetch cache from a key with the digest scrapped off
                    // This enables us to have new versions of assets replace old versions (prevent cache bloat)
                    return caches.match(digestFreeUrl(strippedUrl)).then(function(cachedResponse) {
                        // Ensure the cached response shares the same digest as the one we need (or is a 404)
                        if (cachedResponse && (stripUrl(cachedResponse.url) === strippedUrl ||
                            strippedUrl === self.location.origin + "/404/")) {
                            return cachedResponse;
                        }
                        return fetchResponse;
                    });
                }
            }
            return cacheAndClone(digestFreeUrl(strippedUrl), fetchResponse);
        }).catch(function(error){
            return caches.match(digestFreeUrl(strippedUrl)).then(function(cachedResponse) {
                if (cachedResponse && stripUrl(cachedResponse.url) === strippedUrl || strippedUrl === self.location.origin + "/404/") {
                    return cachedResponse;
                }
                throw error;
            });
        }));
    } else {
        // Cache attempt first
        event.respondWith(caches.match(digestFreeUrl(strippedUrl)).then(function(cachedResponse) {
            if (cachedResponse && stripUrl(cachedResponse.url) === strippedUrl) {
                return cachedResponse;
            }
            // Network attempt second
            return fetch(event.request).then(function(fetchResponse) {
                if (badResponse(fetchResponse)) {
                    if (fetchResponse.status === 404) {
                        strippedUrl = self.location.origin + "/404/";
                    } else {
                        return fetchResponse;
                    }
                }
                return cacheAndClone(digestFreeUrl(strippedUrl), fetchResponse);
            }).catch(function(error){
                throw error;
            });
        }));
    }
});

/**
 * @param fetchData - A Response object to test
 * @returns {boolean} - If a fetch is a proper 200
 */
const badResponse = function(fetchData) {
    return !fetchData || fetchData.status !== 200 || fetchData.type !== 'basic'
};

/**
 * Duplicate the provided Response and write one of them to cache
 * Need to duplicate since their buffer is a one-time-read
 * @param key - The key to write against in cache
 * @param response - A Response to cache
 * @returns {Response} - Response given
 */
const cacheAndClone = function(key, response) {
    let responseToCache = response.clone();
    caches.open("Jekyll-Reflection")
        .then(function(cache) {
            cache.put(key, responseToCache);
        });
    return response;
};

/**
 * @param url - The url string to sanitize
 * @returns {string} - A url stripped of unnecessary characters
 */
const stripUrl = function(url) {
    // Remove query params / id targets
    let strippedUrl = url.split("?")[0].split("#")[0];
    // Compress running slashes
    strippedUrl.replace(/\/*/, "/");
    // Remove trailing slash
    if (strippedUrl[strippedUrl.length-1] === "/") {
        strippedUrl = strippedUrl.substring(0, strippedUrl.length-1);
    }
    // Fix directory requests back with the trailing /
    if (strippedUrl.substring(self.location.origin.length).indexOf(".") === -1) {
        strippedUrl = strippedUrl + "/";
    }
    return strippedUrl;
};

/**
 * @param url - The url string to sanitize
 * @returns {string} - A url with the digest token removed
 */
const digestFreeUrl = function(url) {
    // Only sanitize urls under the /assets route
    if (url.indexOf("/assets/") === -1) {
        return url.replace(/(-[^-.]*\.)(?!.*-[^-.]*\.)/, ".");
    }
    return url;
};
