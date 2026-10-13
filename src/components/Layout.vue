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
import { defineComponent, onMounted, reactive } from "vue";

import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";

import { useI18nParam } from "@/i18n/utils";
import { useStore } from "@/store/index";

import AppHeader from "@/components/AppHeader.vue";
import Languages from "@/components/Languages.vue";
interface UserData {
  user: User | null;
}

export default defineComponent({
  name: "AppLayout",
  components: {
    AppHeader,
    Languages,
  },
  setup() {
    const store = useStore();
    const user = reactive<UserData>({ user: null });
    useI18nParam();

    onMounted(() => {
      auth.onAuthStateChanged((fbuser) => {
        if (fbuser) {
          console.log("authStateChanged:");
          user.user = fbuser;
          store.setUser(fbuser);
        } else {
          store.setUser(null);
        }
      });
    });

    return { user };
  },
});
</script>
