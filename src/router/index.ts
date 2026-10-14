import { NavigationGuard, RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Layout from "@/components/Layout.vue";
import Blank from "@/components/Blank.vue";
import NotFound from "@/components/NotFound.vue";

import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import Subject from "@/views/Subject.vue";
import { isPublished } from "@/content/publication";
import { getSubjectBySlug } from "@/content/selectors";
import { startPiLoader, stopPiLoader } from "@/utils/piLoader";

export const knownSubjectGuard: NavigationGuard = (to) => {
  const { subjectSlug } = to.params;
  if (typeof subjectSlug === "string" && isPublished(getSubjectBySlug(subjectSlug)?.status ?? "planned")) return Promise.resolve(true);

  return Promise.resolve({
    name: "NotFoundPage",
    params: { page: to.path.replace(/^\//u, "") },
  });
};

export const routeChildren: Array<RouteRecordRaw> = [
  {
    path: "",
    component: Home,
  },
  {
    path: "about",
    component: About,
  },
  {
    path: "subjects/:subjectSlug",
    component: Subject,
    beforeEnter: knownSubjectGuard,
  },
];
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/:lang(en|ja)",
        component: Blank,
        children: routeChildren,
      },
      {
        path: "",
        component: Blank,
        children: routeChildren,
      },
    ],
  },
  {
    path: "/:page(.*)",
    name: "NotFoundPage",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from) => {
  if (to.path !== from.path) {
    startPiLoader();
  }
});

router.afterEach(() => {
  stopPiLoader();
});

export default router;
