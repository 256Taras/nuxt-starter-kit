<script setup lang="ts">
import { computed } from "vue";
import { Label } from "#src/common/components/atoms/label";

const props = defineProps<{
  id: string;
  label: string;
  error?: string;
}>();

const errorId = computed(() => `${props.id}-error`);

// Kebab-case keys so callers can spread these directly into `v-bind="{ ...attrs, ...field }"`
// on the slotted input; Vue `v-bind="object"` uses keys literally as HTML attribute names.
const fieldProps = computed(() => ({
  "aria-describedby": props.error ? errorId.value : undefined,
  "aria-invalid": props.error ? true : undefined,
}));
</script>

<template>
  <div class="space-y-2">
    <Label :for="id">{{ label }}</Label>
    <slot v-bind="fieldProps" />
    <p
      v-if="error"
      :id="errorId"
      class="text-sm text-destructive"
    >
      {{ error }}
    </p>
  </div>
</template>
