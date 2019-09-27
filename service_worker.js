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

var stripUrl = function(url) {
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

var digestFreeUrl = function(url) {
    // Eliminate asset digest token
    return url.replace(/(-[^.]*\.)(?!.*-[^.]*\.)/, ".");
};
