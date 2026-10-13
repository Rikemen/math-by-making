<template>
  <article class="subject-card" :class="{ 'subject-card--published': published }">
    <router-link v-if="published" class="subject-card__link" :to="localizedUrl(subject.href)">
      <PublicationStatusBadge :status="subject.status" />
      <h3 class="subject-card__title">{{ subject.title }}</h3>
      <p class="subject-card__description">{{ subject.description }}</p>
    </router-link>
    <div v-else class="subject-card__body">
      <PublicationStatusBadge :status="subject.status" />
      <h3 class="subject-card__title">{{ subject.title }}</h3>
      <p class="subject-card__description">{{ subject.description }}</p>
    </div>
  </article>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

import PublicationStatusBadge from "@/components/PublicationStatusBadge.vue";
import { isPublished } from "@/content/publication";
import type { SubjectMeta } from "@/content/types";
import { useLang } from "@/utils/utils";

export default defineComponent({
  name: "SubjectCard",
  components: {
    PublicationStatusBadge,
  },
  props: {
    subject: {
      type: Object as PropType<SubjectMeta>,
      required: true,
    },
  },
  setup(props) {
    const { localizedUrl } = useLang();
    const published = computed(() => isPublished(props.subject.status));

    return {
      localizedUrl,
      published,
    };
  },
});
</script>

<style scoped>
.subject-card {
  height: 100%;
  overflow: hidden;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.subject-card--published {
  border-color: var(--color-brand-300);
}

.subject-card__link,
.subject-card__body {
  display: block;
  height: 100%;
  padding: var(--space-6);
}

.subject-card__link {
  text-decoration: none;
}

.subject-card__link:hover {
  background: var(--color-brand-50);
}

.subject-card__title {
  margin-bottom: var(--space-3);
  color: var(--color-brand-900);
  font-size: var(--font-size-xl);
}

.subject-card__description {
  margin-bottom: 0;
  color: var(--color-text-muted);
}
</style>
