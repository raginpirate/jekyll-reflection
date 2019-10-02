self.addEventListener('fetch', function(event) {
    let strippedUrl = stripUrl(event.request.url);
    if (strippedUrl.endsWith(".html") || strippedUrl.endsWith("/")) {
        event.respondWith(fetch(event.request).then(function(fetchResponse) {
            if (badResponse(fetchResponse)) {
                if (fetchResponse.status === 404) {
                    strippedUrl = self.location.origin + "/404/";
                } else {
                    return caches.match(digestFreeUrl(strippedUrl)).then(function(cachedResponse) {
                        if (cachedResponse && (stripUrl(cachedResponse.url) === strippedUrl || strippedUrl === self.location.origin + "/404/")) {
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
        event.respondWith(caches.match(digestFreeUrl(strippedUrl)).then(function(cachedResponse) {
            if (cachedResponse && stripUrl(cachedResponse.url) === strippedUrl) {
                return cachedResponse;
            }
            return fetch(event.request).then(function(fetchResponse) {
                if (badResponse(fetchResponse)) {
                    return fetchResponse;
                }
                return cacheAndClone(digestFreeUrl(strippedUrl), fetchResponse);
            }).catch(function(error){
                throw error;
            });
        }));
    }
});

const badResponse = function(fetchData) {
    return !fetchData || fetchData.status !== 200 || fetchData.type !== 'basic'
};

const cacheAndClone = function(key, response) {
    let responseToCache = response.clone();
    caches.open("Jekyll-Reflection")
        .then(function(cache) {
            cache.put(key, responseToCache);
        });
    return response;
};

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

const digestFreeUrl = function(url) {
    // Eliminate asset digest token
    return url.replace(/(-[^-.]*\.)(?!.*-[^-.]*\.)/, ".");
};
