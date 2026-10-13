<template>
  <span class="publication-badge" :class="`publication-badge--${status}`">
    {{ $t(labelKey) }}
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";

import { getPublicationLabelKey } from "@/content/publication";
import type { PublicationStatus } from "@/content/types";

export default defineComponent({
  name: "PublicationStatusBadge",
  props: {
    status: {
      type: String as PropType<PublicationStatus>,
      required: true,
    },
  },
  setup(props) {
    const labelKey = computed(() => getPublicationLabelKey(props.status));

    return {
      labelKey,
    };
  },
});
</script>

<style scoped>
.publication-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 800;
  line-height: 1;
  margin-bottom: var(--space-4);
  padding: var(--space-2) var(--space-3);
}

.publication-badge--published {
  border-color: var(--color-brand-300);
  background: var(--color-brand-50);
  color: var(--color-brand-700);
}

.publication-badge--planned {
  background: var(--color-surface-soft);
  color: var(--color-text-muted);
}
</style>
