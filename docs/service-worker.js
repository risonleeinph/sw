(() => {
    const ARCHIVE_NAME = 'pwatest'
    const pattern = '.*(css)';
    let regExp;
    try {
      regExp = new RegExp(pattern);
    } catch (error) {
      regExp = new RegExp(pattern.replace(childMatch, ''));
    }
  
    // 预存储文件列表
    const PRECACHE_URLS = [
      // 'main.css',
      // 'test.jpg'
    ];
  
    // 监听安装
    self.addEventListener('install', event => {
      self.skipWaiting();
      event.waitUntil(
        caches.open(ARCHIVE_NAME)
          .then(cache => cache.addAll(PRECACHE_URLS))
          .then(self.skipWaiting())
      );
    });
  
    // 监听激活
    self.addEventListener('activate', event => {
      self.clients.claim();
      const currentCaches = [ARCHIVE_NAME];
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
          return Promise.all(cachesToDelete.map(cacheToDelete => {
            return caches.delete(cacheToDelete);
          }));
        }).then(() => self.clients.claim())
      );
    });
  
    // 监听fetch事件
    self.addEventListener('fetch', event => {
      if (event.request.url === self.location.origin) {
        return;
      }
  
      if (regExp.test(event.request.url) && event.request.method === 'GET') {
        event.respondWith(
          caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
  
            return caches.open(ARCHIVE_NAME).then(cache => {
              return fetch(event.request,
                {
                  method: 'GET', // *GET, POST, PUT, DELETE, etc.
                  mode: 'no-cors',
                  credentials: 'omit'
                }).then(response => {
                  return cache.put(event.request, response.clone()).then(() => {
                    return response;
                  });
                });
            }).catch(e => {
              console.error('fetch remote error：', event.request.url, e);
            })
          })
        );
      }
    });
  })();
  