import {
  MIN_DISPLAY_MS,
  PI_DIGITS,
  SAFETY_TIMEOUT_MS,
  STORAGE_KEY,
  STREAM_INTERVAL_MS,
  shouldInterceptNavigation,
} from "./piLoaderNavigation";

export {
  MIN_DISPLAY_MS,
  PI_DIGITS,
  SAFETY_TIMEOUT_MS,
  STORAGE_KEY,
  STREAM_INTERVAL_MS,
  shouldInterceptNavigation,
};

const INITIAL_PI_LENGTH = 2;
const FADE_OUT_DURATION_MS = 260;

interface PiLoaderElements {
  overlay: HTMLElement;
  digits: HTMLElement;
  wrapper: HTMLElement;
}

const LOADER_TEMPLATE = `
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

const setupOverlayAttributes = (overlay: HTMLElement): void => {
  overlay.className = "pi-loader-overlay";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "polite");
  overlay.setAttribute("aria-label", "読み込み中");
  overlay.setAttribute("data-pi-loader", "true");
};

const buildLoaderDom = (documentNode: Document): PiLoaderElements => {
  const overlay = documentNode.createElement("div");
  setupOverlayAttributes(overlay);
  overlay.innerHTML = LOADER_TEMPLATE;
  documentNode.body.appendChild(overlay);

  const digits = overlay.querySelector("[data-pi-digits]") as HTMLElement;
  const wrapper = overlay.querySelector(".pi-loader-digits-wrapper") as HTMLElement;
  return { overlay, digits, wrapper };
};

export class PiLoaderManager {
  private overlay: HTMLElement | null = null;
  private digitsElement: HTMLElement | null = null;
  private digitsWrapper: HTMLElement | null = null;
  private streamTimer: number | null = null;
  private safetyTimer: number | null = null;
  private fadeTimer: number | null = null;
  private currentIndex = INITIAL_PI_LENGTH;
  private shownAt = 0;
  private active = false;

  public constructor(
    private readonly documentNode: Document = document,
    private readonly windowNode: Window = window,
  ) {}

  private attachExistingElements(): boolean {
    const existing = this.documentNode.querySelector<HTMLElement>("[data-pi-loader]");
    if (!existing) {
      return false;
    }
    this.overlay = existing;
    this.digitsElement = existing.querySelector<HTMLElement>("[data-pi-digits]");
    this.digitsWrapper = existing.querySelector<HTMLElement>(".pi-loader-digits-wrapper");
    return true;
  }

  private ensureElements(): void {
    if (this.overlay && this.documentNode.body.contains(this.overlay)) {
      return;
    }
    if (this.attachExistingElements()) {
      return;
    }
    const elements = buildLoaderDom(this.documentNode);
    this.overlay = elements.overlay;
    this.digitsElement = elements.digits;
    this.digitsWrapper = elements.wrapper;
  }

  private clearTimers(): void {
    if (this.streamTimer !== null) {
      this.windowNode.clearInterval(this.streamTimer);
      this.streamTimer = null;
    }
    if (this.safetyTimer !== null) {
      this.windowNode.clearTimeout(this.safetyTimer);
      this.safetyTimer = null;
    }
    if (this.fadeTimer !== null) {
      this.windowNode.clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  private tickStreaming(): void {
    if (this.currentIndex < PI_DIGITS.length) {
      this.currentIndex += 1;
      if (this.digitsElement) {
        this.digitsElement.textContent = PI_DIGITS.slice(0, this.currentIndex);
      }
      if (this.digitsWrapper) {
        this.digitsWrapper.scrollLeft = this.digitsWrapper.scrollWidth;
      }
    }
  }

  private scheduleTimers(): void {
    if (this.streamTimer === null) {
      this.streamTimer = Number(this.windowNode.setInterval(() => this.tickStreaming(), STREAM_INTERVAL_MS));
    }
    if (this.safetyTimer === null) {
      this.safetyTimer = Number(this.windowNode.setTimeout(() => this.stop(true), SAFETY_TIMEOUT_MS));
    }
  }

  private activateDisplay(): void {
    this.currentIndex = INITIAL_PI_LENGTH;
    if (this.digitsElement) {
      this.digitsElement.textContent = PI_DIGITS.slice(0, this.currentIndex);
    }
    this.shownAt = Date.now();
    this.active = true;
  }

  public start(): void {
    this.ensureElements();
    if (this.fadeTimer !== null) {
      this.windowNode.clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }
    if (!this.active) {
      this.activateDisplay();
    }
    this.overlay?.classList.add("is-active");
    this.scheduleTimers();
  }

  public stop(force = false): void {
    if (!this.overlay || !this.active) {
      return;
    }
    if (force) {
      this.clearTimers();
      this.overlay.classList.remove("is-active");
      this.active = false;
      return;
    }

    const elapsed = Date.now() - this.shownAt;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

    this.fadeTimer = Number(
      this.windowNode.setTimeout(() => {
        this.overlay?.classList.remove("is-active");
        this.fadeTimer = Number(
          this.windowNode.setTimeout(() => {
            this.clearTimers();
            this.active = false;
          }, FADE_OUT_DURATION_MS),
        );
      }, remaining),
    );
  }

  public getIsActive(): boolean {
    return this.active;
  }
}

let defaultManager: PiLoaderManager | null = null;

export const getPiLoaderManager = (): PiLoaderManager => {
  if (!defaultManager) {
    defaultManager = new PiLoaderManager();
  }
  return defaultManager;
};

export const startPiLoader = (): void => {
  getPiLoaderManager().start();
};

export const stopPiLoader = (force = false): void => {
  getPiLoaderManager().stop(force);
};

const restorePreviousSession = (windowNode: Window, manager: PiLoaderManager): void => {
  try {
    if (windowNode.sessionStorage.getItem(STORAGE_KEY) === "1") {
      windowNode.sessionStorage.removeItem(STORAGE_KEY);
      manager.start();
      manager.stop();
    }
  } catch {
    // Ignore restricted storage
  }
};

interface NavigationContext {
  windowNode: Window;
  manager: PiLoaderManager;
}

const triggerLinkNavigation = (
  anchor: HTMLAnchorElement,
  event: MouseEvent,
  context: NavigationContext,
): void => {
  if (shouldInterceptNavigation(anchor, event, context.windowNode.location)) {
    try {
      context.windowNode.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore restricted storage
    }
    context.manager.start();
  }
};

export const setupGlobalPiLoader = (
  documentNode: Document = document,
  windowNode: Window = window,
): (() => void) => {
  const manager = getPiLoaderManager();
  restorePreviousSession(windowNode, manager);

  const handleClick = (event: MouseEvent): void => {
    const { target } = event;
    if (target instanceof Element) {
      const anchor = target.closest("a");
      if (anchor) {
        triggerLinkNavigation(anchor, event, { manager, windowNode });
      }
    }
  };

  const handlePageShow = (event: PageTransitionEvent): void => {
    if (event.persisted) {
      try {
        windowNode.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore restricted storage
      }
      manager.stop(true);
    }
  };

  documentNode.addEventListener("click", handleClick, { capture: true });
  windowNode.addEventListener("pageshow", handlePageShow);

  return (): void => {
    documentNode.removeEventListener("click", handleClick, { capture: true });
    windowNode.removeEventListener("pageshow", handlePageShow);
    manager.stop(true);
  };
};
