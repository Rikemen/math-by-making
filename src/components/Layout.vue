<template>
  <div class="layout">
    <AppHeader />
    <div class="layout__main">
      <router-view />
    </div>
    <footer class="layout__footer">
      <Languages />
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useI18nParam } from "@/i18n/utils";

import AppHeader from "@/components/AppHeader.vue";
import Languages from "@/components/Languages.vue";

export default defineComponent({
  name: "AppLayout",
  components: {
    AppHeader,
    Languages,
  },
  setup() {
    useI18nParam();
  },
});
</script>
