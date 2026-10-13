import { computed } from "vue";
import { useI18n } from "vue-i18n";

export const useLang = () => {
  const i18n = useI18n();
  const lang = computed(() => i18n.locale.value);
  const localizedUrl = (path: string) => {
    if (lang.value) {
      return `/${lang.value}${path}`;
    }
    return path;
  };

  return {
    lang,
    localizedUrl,
  };
};

export const sleep = (milliseconds: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, milliseconds);
  });
