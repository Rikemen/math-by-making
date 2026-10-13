const APP_CACHE_PREFIX = "math-by-making-";

interface PwaRegistration {
  update: () => Promise<unknown>;
  waiting?: {
    postMessage: (message: unknown) => void;
  } | null;
}

interface ServiceWorkerRegistrar {
  register: (scriptURL: string, options: RegistrationOptions) => Promise<unknown>;
}

export interface PwaUpdateDependencies {
  isOnline: boolean;
  getRegistration: () => Promise<PwaRegistration | undefined>;
  requestLatestPage: () => Promise<{ ok: boolean }>;
  listCacheNames: () => Promise<string[]>;
  deleteCache: (cacheName: string) => Promise<boolean>;
  reload: () => void;
}

const getServiceWorkerContainer = (): ServiceWorkerContainer | undefined => {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return undefined;
  }

  return navigator.serviceWorker;
};

const getCacheStorage = (): CacheStorage | undefined => {
  if (typeof window === "undefined" || !("caches" in window)) {
    return undefined;
  }

  return window.caches;
};

const createBrowserDependencies = (): PwaUpdateDependencies => {
  const serviceWorker = getServiceWorkerContainer();
  const cacheStorage = getCacheStorage();

  const getRegistration = (): Promise<PwaRegistration | undefined> => {
    if (!serviceWorker) {
      return Promise.resolve(undefined);
    }

    return serviceWorker.getRegistration();
  };

  const listCacheNames = (): Promise<string[]> => {
    if (!cacheStorage) {
      return Promise.resolve([]);
    }

    return cacheStorage.keys();
  };

  const deleteCache = (cacheName: string): Promise<boolean> => {
    if (!cacheStorage) {
      return Promise.resolve(false);
    }

    return cacheStorage.delete(cacheName);
  };

  return {
    isOnline: typeof navigator === "undefined" || navigator.onLine,
    getRegistration,
    requestLatestPage: () => {
      const refreshUrl = new URL(window.location.href);
      refreshUrl.searchParams.set("pwa-refresh", Date.now().toString());

      return fetch(refreshUrl, { cache: "no-store" });
    },
    listCacheNames,
    deleteCache,
    reload: () => window.location.reload(),
  };
};

const verifyLatestPage = async (dependencies: PwaUpdateDependencies): Promise<void> => {
  const latestPage = await dependencies.requestLatestPage();

  if (!latestPage.ok) {
    throw new Error("update-check-failed");
  }
};

const clearAppCaches = async (dependencies: PwaUpdateDependencies): Promise<void> => {
  const cacheNames = await dependencies.listCacheNames();
  const appCacheNames = cacheNames.filter((cacheName) => cacheName.startsWith(APP_CACHE_PREFIX));

  await Promise.all(appCacheNames.map((cacheName) => dependencies.deleteCache(cacheName)));
};

export const refreshPwaContent = async (
  dependencies: PwaUpdateDependencies = createBrowserDependencies(),
): Promise<void> => {
  if (!dependencies.isOnline) {
    throw new Error("offline");
  }

  const registration = await dependencies.getRegistration();
  await registration?.update();

  await verifyLatestPage(dependencies);

  registration?.waiting?.postMessage({ type: "SKIP_WAITING" });

  await clearAppCaches(dependencies);

  dependencies.reload();
};

export const registerPwa = (
  serviceWorker: ServiceWorkerRegistrar | undefined = getServiceWorkerContainer(),
): Promise<unknown> => {
  if (!serviceWorker) {
    return Promise.resolve(undefined);
  }

  return serviceWorker.register("/sw.js", { scope: "/" });
};
