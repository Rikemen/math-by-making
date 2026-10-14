import { initializePiPageLoader } from "./pi-loader.js";

const APP_CACHE_PREFIX = "math-by-making-";

const createBrowserDependencies = () => {
    const serviceWorker = "serviceWorker" in navigator ? navigator.serviceWorker : undefined;
    const cacheStorage = "caches" in window ? window.caches : undefined;

    return {
        isOnline: navigator.onLine,
        getRegistration: () => serviceWorker?.getRegistration(),
        requestLatestPage: () => {
            const refreshUrl = new URL(window.location.href);
            refreshUrl.searchParams.set("pwa-refresh", Date.now().toString());

            return fetch(refreshUrl, { cache: "no-store" });
        },
        listCacheNames: () => cacheStorage?.keys() ?? Promise.resolve([]),
        deleteCache: (cacheName) => cacheStorage?.delete(cacheName) ?? Promise.resolve(false),
        reload: () => window.location.reload(),
    };
};

const verifyLatestPage = async (dependencies) => {
    const latestPage = await dependencies.requestLatestPage();

    if (!latestPage.ok) {
        throw new Error("update-check-failed");
    }
};

const clearAppCaches = async (dependencies) => {
    const cacheNames = await dependencies.listCacheNames();
    const appCacheNames = cacheNames.filter((cacheName) => cacheName.startsWith(APP_CACHE_PREFIX));

    await Promise.all(appCacheNames.map((cacheName) => dependencies.deleteCache(cacheName)));
};

export const refreshArticlePwaContent = async (dependencies = createBrowserDependencies()) => {
    if (!dependencies.isOnline) {
        throw new Error("offline");
    }

    const registration = await dependencies.getRegistration();
    await registration?.update?.();

    await verifyLatestPage(dependencies);

    registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
    await clearAppCaches(dependencies);
    dependencies.reload();
};

export const initializeArticleHeader = (root = document, refresh = refreshArticlePwaContent) => {
    const button = root.querySelector("[data-pwa-update]");
    const label = root.querySelector("[data-pwa-update-label]");
    const status = root.querySelector("[data-pwa-update-status]");

    if (!button || !label || !status) {
        return undefined;
    }

    const handleUpdate = async () => {
        if (button.disabled) {
            return;
        }

        button.disabled = true;
        button.setAttribute("aria-busy", "true");
        label.textContent = "更新中…";
        status.hidden = true;

        try {
            await refresh();
        } catch {
            status.hidden = false;
        } finally {
            button.disabled = false;
            button.removeAttribute("aria-busy");
            label.textContent = "更新";
        }
    };

    button.addEventListener("click", handleUpdate);
    return () => button.removeEventListener("click", handleUpdate);
};

const initializeCurrentArticleHeader = () => {
    initializePiPageLoader();

    const articleHeader = document.querySelector("[data-article-header]");

    if (articleHeader) {
        initializeArticleHeader(articleHeader);
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCurrentArticleHeader, { once: true });
} else {
    initializeCurrentArticleHeader();
}
