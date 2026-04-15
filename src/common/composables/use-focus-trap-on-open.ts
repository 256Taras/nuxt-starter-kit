import { ref, watch, nextTick } from "vue";
import type { Ref } from "vue";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

interface FocusTrapOnOpen {
  isOpen: Ref<boolean>;
  dialogRef: Ref<HTMLElement | null>;
}

/**
 * Manages focus for toggleable overlay elements (modals, dialogs).
 *
 * - When `isOpen` flips to `true`, the element referenced by `dialogRef`
 *   receives focus.
 * - Tab/Shift-Tab are trapped inside the dialog by cycling focus between
 *   its first and last focusable descendants.
 * - When `isOpen` flips back to `false`, focus is restored to whichever
 *   element was focused before the overlay opened.
 *
 * Usage:
 *   const { isOpen, dialogRef } = useFocusTrapOnOpen();
 */
export function useFocusTrapOnOpen(): FocusTrapOnOpen {
  const isOpen = ref(false);
  const dialogRef = ref<HTMLElement | null>(null);
  const previousFocus = ref<HTMLElement | null>(null);

  function handleTabKey(event: KeyboardEvent) {
    if (event.key !== "Tab" || !dialogRef.value) return;
    const focusable = Array.from(dialogRef.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const active = document.activeElement as HTMLElement | null;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  watch(isOpen, async (open) => {
    if (open) {
      previousFocus.value = (document.activeElement as HTMLElement) ?? null;
      await nextTick();
      dialogRef.value?.focus();
      dialogRef.value?.addEventListener("keydown", handleTabKey);
    } else {
      dialogRef.value?.removeEventListener("keydown", handleTabKey);
      previousFocus.value?.focus();
    }
  });

  return { isOpen, dialogRef };
}
