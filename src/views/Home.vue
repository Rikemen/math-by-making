<template>
  <main class="home">
    <LearningHero :guide-image-src="homeContent.guideImageSrc" />

    <section id="subjects" class="home__subjects" aria-labelledby="subjects-title">
      <h2 id="subjects-title">{{ $t("home.subjectsTitle") }}</h2>
      <p>{{ $t("home.linearAlgebra") }}</p>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import LearningHero from "@/components/LearningHero.vue";
import { homeContent } from "@/content/site";

export default defineComponent({
  name: "HomePage",
  components: {
    LearningHero,
  },
  setup() {
    return {
      homeContent,
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

@media (max-width: 40rem) {
  .home {
    padding: var(--space-4) var(--space-4) var(--space-8);
  }
}
</style>
