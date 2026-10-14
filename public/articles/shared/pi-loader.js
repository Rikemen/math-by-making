export const PI_DIGITS =
  "3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196";

export const STREAM_INTERVAL_MS = 40;
export const MIN_DISPLAY_MS = 240;
export const SAFETY_TIMEOUT_MS = 8000;
export const STORAGE_KEY = "pi-loading";

export const shouldInterceptNavigation = (anchor, event, currentLocation = window.location) => {
  if (!anchor || !event) {
    return false;
  }
  if (event.defaultPrevented || event.button !== 0) {
    return false;
  }
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return false;
  }
  if (anchor.target && anchor.target !== "_self") {
    return false;
  }
  if (anchor.hasAttribute("download")) {
    return false;
  }

  const rawHref = anchor.getAttribute("href");
  if (!rawHref || rawHref.startsWith("javascript:") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
    return false;
  }

  try {
    const targetUrl = new URL(rawHref, currentLocation.href);
    if (targetUrl.origin !== currentLocation.origin) {
      return false;
    }
    const isSamePageAnchor =
      targetUrl.pathname === currentLocation.pathname &&
      targetUrl.search === currentLocation.search &&
      targetUrl.hash.length > 0;
    if (isSamePageAnchor) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

export const createPiLoader = (doc = document, win = window) => {
  let overlay = null;
  let digitsElement = null;
  let digitsWrapper = null;
  let streamTimer = null;
  let safetyTimer = null;
  let fadeTimer = null;
  let currentIndex = 2;
  let shownAt = 0;
  let isActive = false;

  const ensureElements = () => {
    if (overlay && doc.body.contains(overlay)) {
      return;
    }
    const existing = doc.querySelector("[data-pi-loader]");
    if (existing) {
      overlay = existing;
      digitsElement = overlay.querySelector("[data-pi-digits]");
      digitsWrapper = overlay.querySelector(".pi-loader-digits-wrapper");
      return;
    }

    overlay = doc.createElement("div");
    overlay.className = "pi-loader-overlay";
    overlay.setAttribute("role", "status");
    overlay.setAttribute("aria-live", "polite");
    overlay.setAttribute("aria-label", "読み込み中");
    overlay.setAttribute("data-pi-loader", "true");

    overlay.innerHTML = `
      <div class="pi-loader-card">
        <div class="pi-loader-header">
          <span class="pi-loader-spinner" aria-hidden="true"></span>
          <span>読み込み中…</span>
        </div>
        <div class="pi-loader-expression">
          <span class="pi-loader-symbol" aria-hidden="true">π =</span>
          <div class="pi-loader-digits-wrapper">
            <span class="pi-loader-digits" data-pi-digits>3.</span>
            <span class="pi-loader-cursor" aria-hidden="true"></span>
          </div>
        </div>
        <div class="pi-loader-footer">Math by Making</div>
      </div>
    `;

    doc.body.appendChild(overlay);
    digitsElement = overlay.querySelector("[data-pi-digits]");
    digitsWrapper = overlay.querySelector(".pi-loader-digits-wrapper");
  };

  const clearTimers = () => {
    if (streamTimer) {
      win.clearInterval(streamTimer);
      streamTimer = null;
    }
    if (safetyTimer) {
      win.clearTimeout(safetyTimer);
      safetyTimer = null;
    }
    if (fadeTimer) {
      win.clearTimeout(fadeTimer);
      fadeTimer = null;
    }
  };

  const tickStreaming = () => {
    if (currentIndex < PI_DIGITS.length) {
      currentIndex += 1;
      if (digitsElement) {
        digitsElement.textContent = PI_DIGITS.slice(0, currentIndex);
      }
      if (digitsWrapper) {
        digitsWrapper.scrollLeft = digitsWrapper.scrollWidth;
      }
    }
  };

  const start = () => {
    ensureElements();
    if (fadeTimer) {
      win.clearTimeout(fadeTimer);
      fadeTimer = null;
    }
    if (!isActive) {
      currentIndex = 2;
      if (digitsElement) {
        digitsElement.textContent = PI_DIGITS.slice(0, currentIndex);
      }
      shownAt = Date.now();
      isActive = true;
    }

    overlay.classList.add("is-active");

    if (!streamTimer) {
      streamTimer = win.setInterval(tickStreaming, STREAM_INTERVAL_MS);
    }
    if (!safetyTimer) {
      safetyTimer = win.setTimeout(() => stop(true), SAFETY_TIMEOUT_MS);
    }
  };

  const stop = (force = false) => {
    if (!overlay || !isActive) {
      return;
    }
    if (force) {
      clearTimers();
      overlay.classList.remove("is-active");
      isActive = false;
      return;
    }

    const elapsed = Date.now() - shownAt;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    fadeTimer = win.setTimeout(() => {
      overlay.classList.remove("is-active");
      fadeTimer = win.setTimeout(() => {
        clearTimers();
        isActive = false;
      }, 260);
    }, remaining);
  };

  return {
    start,
    stop,
    getElement: () => overlay,
    getIsActive: () => isActive,
  };
};

export const initializePiPageLoader = (doc = document, win = window) => {
  const loader = createPiLoader(doc, win);

  // Check if page opened with loading flag from previous navigation
  try {
    if (win.sessionStorage && win.sessionStorage.getItem(STORAGE_KEY) === "1") {
      win.sessionStorage.removeItem(STORAGE_KEY);
      loader.start();
      loader.stop();
    }
  } catch {
    // Ignore storage restriction
  }

  const handleClick = (event) => {
    const anchor = event.target instanceof Element ? event.target.closest("a") : null;
    if (anchor && shouldInterceptNavigation(anchor, event, win.location)) {
      try {
        if (win.sessionStorage) {
          win.sessionStorage.setItem(STORAGE_KEY, "1");
        }
      } catch {
        // Ignore storage restriction
      }
      loader.start();
    }
  };

  const handlePageShow = (event) => {
    if (event.persisted) {
      try {
        if (win.sessionStorage) {
          win.sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        // Ignore storage restriction
      }
      loader.stop(true);
    }
  };

  doc.addEventListener("click", handleClick, { capture: true });
  win.addEventListener("pageshow", handlePageShow);

  return () => {
    doc.removeEventListener("click", handleClick, { capture: true });
    win.removeEventListener("pageshow", handlePageShow);
    loader.stop(true);
  };
};
