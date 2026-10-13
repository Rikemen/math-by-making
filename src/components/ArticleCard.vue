<template>
  <article class="article-card">
    <a v-if="published" class="article-card__link" :href="article.href">
      <div class="article-card__badges">
        <PublicationStatusBadge :status="article.status" />
        <span v-if="article.isSummary" class="article-card__summary-badge">{{ $t("publication.summary") }}</span>
      </div>
      <h3 class="article-card__title">{{ article.title }}</h3>
      <p class="article-card__description">{{ article.description }}</p>
    </a>
    <div v-else class="article-card__body">
      <div class="article-card__badges">
        <PublicationStatusBadge :status="article.status" />
        <span v-if="article.isSummary" class="article-card__summary-badge">{{ $t("publication.summary") }}</span>
      </div>
      <h3 class="article-card__title">{{ article.title }}</h3>
      <p class="article-card__description">{{ article.description }}</p>
    </div>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

import PublicationStatusBadge from "@/components/PublicationStatusBadge.vue";
import { isPublished } from "@/content/publication";
import type { ArticleMeta } from "@/content/types";

export default defineComponent({
  name: "ArticleCard",
  components: {
    PublicationStatusBadge,
  },
  props: {
    article: {
      type: Object as PropType<ArticleMeta>,
      required: true,
    },
  },
  setup(props) {
    const published = computed(() => isPublished(props.article.status));

    return {
      published,
    };
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

.article-card__badges {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.article-card__badges :deep(.publication-badge) {
  margin-bottom: 0;
}

.article-card__summary-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-brand-300);
  border-radius: var(--radius-md);
  background: var(--color-brand-700);
  color: var(--color-surface);
  font-size: var(--font-size-sm);
  font-weight: 800;
  line-height: 1;
  padding: var(--space-2) var(--space-3);
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
