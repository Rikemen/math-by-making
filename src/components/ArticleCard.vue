<template>
  <article class="article-card">
    <a v-if="article.status === 'published'" class="article-card__link" :href="article.href">
      <h3 class="article-card__title">{{ article.title }}</h3>
      <p class="article-card__description">{{ article.description }}</p>
    </a>
    <div v-else class="article-card__body">
      <h3 class="article-card__title">{{ article.title }}</h3>
      <p class="article-card__description">{{ article.description }}</p>
    </div>
  </article>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import type { ArticleMeta } from "@/content/types";

export default defineComponent({
  name: "ArticleCard",
  props: {
    article: {
      type: Object as PropType<ArticleMeta>,
      required: true,
    },
  },
});
</script>

<style scoped>
.article-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.article-card__link,
.article-card__body {
  display: block;
  height: 100%;
  padding: var(--space-6);
}

.article-card__link {
  text-decoration: none;
}

.article-card__link:hover {
  background: var(--color-brand-50);
}

.article-card__title {
  margin-bottom: var(--space-3);
  color: var(--color-brand-900);
  font-size: var(--font-size-xl);
}

.article-card__description {
  margin-bottom: 0;
  color: var(--color-text-muted);
}
</style>
