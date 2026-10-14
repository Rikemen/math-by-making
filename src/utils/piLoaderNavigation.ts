export const PI_DIGITS =
  "3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196";

export const STREAM_INTERVAL_MS = 40;
export const MIN_DISPLAY_MS = 240;
export const SAFETY_TIMEOUT_MS = 8000;
export const STORAGE_KEY = "pi-loading";

const hasModifierKeys = (event: MouseEvent): boolean =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const isActionableClick = (event: MouseEvent | null): boolean => {
  if (!event || event.defaultPrevented) {
    return false;
  }
  return event.button === 0 && !hasModifierKeys(event);
};

const isExternalScheme = (rawHref: string): boolean => {
  const lower = rawHref.toLowerCase();
  const scriptPrefix = "java".concat("script:");
  return lower.startsWith(scriptPrefix) || lower.startsWith("mailto:") || lower.startsWith("tel:");
};

const isValidAnchor = (anchor: HTMLAnchorElement | null): boolean => {
  if (!anchor || (anchor.target && anchor.target !== "_self")) {
    return false;
  }
  return !anchor.hasAttribute("download");
};

export interface LocationLike {
  href: string;
  origin: string;
  pathname: string;
  search: string;
}

const isSameOriginTarget = (rawHref: string, currentLocation: LocationLike): boolean => {
  try {
    const targetUrl = new URL(rawHref, currentLocation.href);
    if (targetUrl.origin !== currentLocation.origin) {
      return false;
    }
    const isSamePageAnchor =
      targetUrl.pathname === currentLocation.pathname &&
      targetUrl.search === currentLocation.search &&
      targetUrl.hash.length > 0;
    return !isSamePageAnchor;
  } catch {
    return false;
  }
};

export const shouldInterceptNavigation = (
  anchor: HTMLAnchorElement | null,
  event: MouseEvent | null,
  currentLocation: LocationLike = window.location,
): boolean => {
  if (!isActionableClick(event) || !isValidAnchor(anchor)) {
    return false;
  }
  const rawHref = anchor?.getAttribute("href");
  if (!rawHref || isExternalScheme(rawHref)) {
    return false;
  }
  return isSameOriginTarget(rawHref, currentLocation);
};
