// 注册service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(function (registration) {
        console.log('service worker register success!')
      })
      .catch(function (error) {
        console.error("register error: ", error);
      });
}
