<template>
  <main class="home">
    <LearningHero :guide-image-src="homeContent.guideImageSrc" />

    <section id="subjects" class="home__subjects" aria-labelledby="subjects-title">
      <h2 id="subjects-title">{{ $t("home.subjectsTitle") }}</h2>
      <p class="home__subjects-description">{{ $t("home.subjectsDescription") }}</p>
      <ul class="home__subject-grid">
        <li v-for="subject in subjects" :key="subject.slug">
          <SubjectCard :subject="subject" />
        </li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LearningHero from "@/components/LearningHero.vue";
import SubjectCard from "@/components/SubjectCard.vue";
import { homeContent } from "@/content/site";
import { subjects } from "@/content/subjects";

export default defineComponent({
  name: "HomePage",
  components: {
    LearningHero,
    SubjectCard,
  },
  setup() {
    return {
      homeContent,
      subjects,
    };
  },
});
</script>

<style scoped>
.home {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6) var(--space-12);
}

.home__subjects {
  padding-top: var(--space-12);
}

.home__subjects-description {
  max-width: 40rem;
  color: var(--color-text-muted);
}

.home__subject-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  list-style: none;
  margin: var(--space-8) 0 0;
  padding: 0;
}

@media (max-width: 40rem) {
  .home {
    padding: var(--space-4) var(--space-4) var(--space-8);
  }
}
</style>
