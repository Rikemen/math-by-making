<template>
  <main v-if="subject" class="subject-page">
    <nav :aria-label="$t('subjectPage.breadcrumbLabel')">
      <router-link :to="localizedUrl('/')">{{ $t("subjectPage.home") }}</router-link>
    </nav>

    <header class="subject-page__header">
      <p class="subject-page__eyebrow">{{ $t("subjectPage.eyebrow") }}</p>
      <h1>{{ subject.title }}</h1>
      <p class="subject-page__description">{{ subject.description }}</p>
    </header>

    <section aria-labelledby="articles-title">
      <h2 id="articles-title">{{ $t("subjectPage.articlesTitle") }}</h2>
      <ul v-if="subjectArticles.length > 0" class="subject-page__articles">
        <li v-for="article in subjectArticles" :key="article.slug">
          <ArticleCard :article="article" />
        </li>
      </ul>
      <p v-else>{{ $t("subjectPage.empty") }}</p>
    </section>
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from "vue-router";

import ArticleCard from "@/components/ArticleCard.vue";
import { getArticlesBySubjectSlug, getSubjectBySlug } from "@/content/selectors";
import { useLang } from "@/utils/utils";

export default defineComponent({
  name: "SubjectPage",
  components: {
    ArticleCard,
  },
  setup() {
    const route = useRoute();
    const { localizedUrl } = useLang();
    const subjectSlug = computed(() => {
      if (typeof route.params.subjectSlug === "string") return route.params.subjectSlug;
      return "";
    });
    const subject = computed(() => getSubjectBySlug(subjectSlug.value));
    const subjectArticles = computed(() => getArticlesBySubjectSlug(subjectSlug.value));

    return {
      localizedUrl,
      subject,
      subjectArticles,
    };
  },
});
</script>

<style scoped>
.subject-page {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6) var(--space-12);
}

.subject-page nav {
  margin-bottom: var(--space-8);
  color: var(--color-brand-700);
  font-weight: 700;
}

.subject-page__header {
  max-width: 48rem;
  margin-bottom: var(--space-12);
}

.subject-page__eyebrow {
  color: var(--color-brand-700);
  font-size: var(--font-size-sm);
  font-weight: 800;
  letter-spacing: 0.08em;
}

.subject-page h1 {
  margin-bottom: var(--space-4);
  color: var(--color-brand-900);
  font-size: var(--font-size-4xl);
}

.subject-page__description {
  color: var(--color-text-muted);
  font-size: var(--font-size-lg);
}

.subject-page__articles {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  list-style: none;
  margin: var(--space-6) 0 0;
  padding: 0;
}

@media (max-width: 40rem) {
  .subject-page {
    padding: var(--space-6) var(--space-4) var(--space-8);
  }
}
</style>
