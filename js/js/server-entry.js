(() => {
  const target = "http://localhost:3000/";
  if (location.protocol === "file:") {
    location.replace(target);
    return;
  }
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(
    location.hostname,
  );
  const canInstall = location.protocol === "https:" || loopback;
  if (canInstall && "serviceWorker" in navigator) {
    addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js").catch(() => {});
    });
  }
  if (!loopback || location.protocol !== "http:" || location.port === "3000")
    return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  fetch("api/health", { cache: "no-store", signal: controller.signal })
    .then(async (response) => {
      if (!response.ok) return false;
      const data = await response.json();
      return data.ok === true && data.persistence === "json";
    })
    .catch(() => false)
    .then((hasApi) => {
      clearTimeout(timer);
      if (!hasApi) location.replace(target);
    });
})();
