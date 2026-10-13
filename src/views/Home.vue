<template>
  <main class="home">
    <section aria-labelledby="home-title">
      <p>{{ $t("home.eyebrow") }}</p>
      <h1 id="home-title">{{ $t("home.title") }}</h1>
      <p>{{ $t("home.tagline") }}</p>
      <p>{{ $t("home.description") }}</p>
    </section>

    <section id="subjects" aria-labelledby="subjects-title">
      <h2 id="subjects-title">{{ $t("home.subjectsTitle") }}</h2>
      <p>{{ $t("home.linearAlgebra") }}</p>
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomePage",
});
</script>
