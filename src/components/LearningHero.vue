<template>
  <section class="learning-hero" aria-labelledby="home-title">
    <div class="learning-hero__copy">
      <p class="learning-hero__eyebrow">{{ $t("home.eyebrow") }}</p>
      <h1 id="home-title" class="learning-hero__title">{{ $t("home.title") }}</h1>
      <p class="learning-hero__tagline">{{ $t("home.tagline") }}</p>
      <p class="learning-hero__description">{{ $t("home.description") }}</p>
      <router-link class="learning-hero__cta" :to="localizedUrl('/subjects/linear-algebra')">
        {{ $t("home.cta") }}
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useLang } from "@/utils/utils";

export default defineComponent({
  name: "LearningHero",
  setup() {
    const { localizedUrl } = useLang();

    return {
      localizedUrl,
    };
  },
});
</script>

<style scoped>
.learning-hero {
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-brand-50) 100%);
  box-shadow: var(--shadow-sm);
  padding: clamp(var(--space-8), 8vw, 5rem);
}

.learning-hero__copy {
  max-width: 42rem;
}

.learning-hero__eyebrow {
  color: var(--color-brand-700);
  font-size: var(--font-size-sm);
  font-weight: 800;
  letter-spacing: 0.08em;
}

.learning-hero__title {
  margin-bottom: var(--space-3);
  color: var(--color-brand-900);
  font-size: var(--font-size-4xl);
  line-height: 1.08;
}

.learning-hero__tagline {
  margin-bottom: var(--space-4);
  color: var(--color-brand-700);
  font-size: var(--font-size-2xl);
  font-weight: 800;
}

.learning-hero__description {
  max-width: 36rem;
  margin-bottom: var(--space-6);
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
}

.learning-hero__cta {
  display: inline-flex;
  min-height: 3rem;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--color-brand-700);
  color: var(--color-surface);
  font-weight: 800;
  padding: var(--space-3) var(--space-6);
  text-decoration: none;
}

.learning-hero__cta:hover {
  background: var(--color-brand-900);
}
</style>
