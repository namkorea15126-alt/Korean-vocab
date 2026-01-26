self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open("korean-vocab").then(function (cache) {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js"
      ]);
    })
  );
});
