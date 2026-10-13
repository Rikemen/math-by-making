<template>
  <header class="app-header">
    <div class="app-header__inner">
      <router-link class="app-header__brand" :to="localizedUrl('/')" :aria-label="$t('header.homeLabel')">
        <span class="app-header__mark" aria-hidden="true">M²</span>
        <span>{{ $t("site.name") }}</span>
      </router-link>

      <nav class="app-header__nav" :aria-label="$t('header.primaryNavigation')">
        <router-link class="app-header__link" :to="localizedUrl('/')">{{ $t("header.home") }}</router-link>
        <router-link class="app-header__link" :to="localizedUrl('/#subjects')">{{ $t("header.subjects") }}</router-link>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useLang } from "@/utils/utils";

export default defineComponent({
  name: "AppHeader",
  setup() {
    const { localizedUrl } = useLang();

    return {
      localizedUrl,
    };
  },
});
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid var(--color-border);
  background: rgb(255 255 255 / 94%);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(0.75rem);
}

.app-header__inner {
  display: flex;
  min-height: var(--header-height);
  max-width: var(--content-max-width);
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  margin: 0 auto;
  padding: var(--space-3) var(--space-6);
}

.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-brand-900);
  font-size: var(--font-size-xl);
  font-weight: 800;
  text-decoration: none;
}

.app-header__mark {
  display: inline-grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: var(--radius-md);
  background: var(--color-brand-700);
  color: var(--color-surface);
  font-size: var(--font-size-lg);
  letter-spacing: -0.08em;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.app-header__link {
  border-radius: var(--radius-md);
  color: var(--color-brand-900);
  font-weight: 700;
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
}

.app-header__link:hover {
  background: var(--color-brand-50);
  color: var(--color-brand-700);
}

@media (max-width: 40rem) {
  .app-header__inner {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
  }

  .app-header__nav {
    width: 100%;
  }

  .app-header__link {
    flex: 1;
    text-align: center;
  }
}
</style>
