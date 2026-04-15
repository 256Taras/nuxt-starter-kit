# Code Snippets

Canonical patterns for common tasks. Copy, adapt, ship.

## Table of contents

- [Detail page — orchestrator](#detail-page--orchestrator)
- [Create form page](#create-form-page)
- [Edit form page](#edit-form-page)
- [List page with pagination](#list-page-with-pagination)
- [Mutation with form values](#mutation-with-form-values)
- [Feature button with hook](#feature-button-with-hook)
- [Query with TanStack](#query-with-tanstack)
- [Form field with schema](#form-field-with-schema)
- [Module `index.ts` public API](#module-indexts-public-api)

## Detail page — orchestrator

```vue
<script setup lang="ts">
import { definePageMeta } from "#imports";
import { useRouteId } from "#src/common/composables/use-route-id";
import { useBookingDetail } from "#src/modules/(bookings)/bookings";
import {
  CancelBookingButton,
  ConfirmBookingButton,
} from "#src/modules/(bookings)/bookings";
import { PayBookingButton } from "#src/modules/(bookings)/payments";
import {
  BackLink,
  PageHeader,
  DataField,
} from "#src/common/components/molecules";

definePageMeta({ layout: "default" });

const bookingId = useRouteId("bookings-id");
const { booking, isLoading, isError, error } = useBookingDetail(bookingId);
</script>

<template>
  <BackLink to="/bookings">Back to bookings</BackLink>

  <div v-if="isLoading">Loading...</div>
  <div v-else-if="isError">{{ error?.userMessage ?? "Failed to load" }}</div>

  <template v-else-if="booking">
    <PageHeader :title="`Booking ${booking.id}`" />
    <DataField label="Status">{{ booking.status }}</DataField>
    <div class="flex gap-2">
      <ConfirmBookingButton :booking="booking" />
      <PayBookingButton :booking="booking" />
      <CancelBookingButton :booking="booking" />
    </div>
  </template>
</template>
```

## Create form page

```vue
<script setup lang="ts">
import { useForm } from "vee-validate";
import { definePageMeta } from "#imports";
import {
  useCreateProviderMutation,
  ProviderFormSchema,
} from "#src/modules/(marketplace)/providers";
import type { ProviderFormValues } from "#src/modules/(marketplace)/providers";
import { useAppRouter } from "#src/common/routing/app-router";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import { Button, Input } from "#src/common/components/atoms";
import { BackLink, FormField } from "#src/common/components/molecules";

definePageMeta({ layout: "default" });

const { routes, pushTo } = useAppRouter();
const createMutation = useCreateProviderMutation();

const { handleSubmit, errors, defineField, meta } = useForm<ProviderFormValues>(
  {
    validationSchema: toTypeBoxResolver(ProviderFormSchema),
    initialValues: { name: "", description: "", logoUrl: "" },
  },
);

const [name, nameAttrs] = defineField("name");

const onSubmit = handleSubmit(async (values) => {
  const ok = await runWithToast(createMutation.mutateAsync, values, {
    success: "Provider created",
    error: "Failed to create provider",
  });
  if (ok) await pushTo.providers.list();
});
</script>
```

## Edit form page

Edit form hydrates from the detail query via a simple `watch + setValues`. No
composable needed.

```vue
<script setup lang="ts">
import { watch } from "vue";
import { useForm } from "vee-validate";
import {
  useProviderDetailQuery,
  useUpdateProviderMutation,
  ProviderFormSchema,
} from "#src/modules/(marketplace)/providers";
import type { ProviderFormValues } from "#src/modules/(marketplace)/providers";
import { useRouteId } from "#src/common/composables/use-route-id";
import { toTypeBoxResolver } from "#src/common/validation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";

const providerId = useRouteId("providers-id-edit");
const { data: provider } = useProviderDetailQuery(providerId);
const updateMutation = useUpdateProviderMutation();

const { handleSubmit, errors, defineField, meta, setValues } =
  useForm<ProviderFormValues>({
    validationSchema: toTypeBoxResolver(ProviderFormSchema),
    initialValues: { name: "", description: "", logoUrl: "" },
  });

watch(
  provider,
  (p) => {
    if (p)
      setValues({
        name: p.name,
        description: p.description ?? "",
        logoUrl: p.logoUrl ?? "",
      });
  },
  { immediate: true },
);

const onSubmit = handleSubmit(async (values) => {
  const ok = await runWithToast(
    updateMutation.mutateAsync,
    { id: providerId.value, values },
    { success: "Provider updated", error: "Failed to update provider" },
  );
});
</script>
```

## List page with pagination

```vue
<script setup lang="ts">
import { computed, ref } from "vue";
import { useProvidersListQuery } from "#src/modules/(marketplace)/providers";
import type { ProviderListItem } from "#src/modules/(marketplace)/providers";
import type { PaginationParams } from "#src/types";
import { Pagination, PageHeader } from "#src/common/components/molecules";

const paginationParams = ref<PaginationParams>({ page: 1, limit: 10 });
const { data: response, isLoading } = useProvidersListQuery(paginationParams);
const providers = computed<ProviderListItem[]>(
  () => (response.value?.data ?? []) as ProviderListItem[],
);

function setPage(page: number) {
  paginationParams.value = { ...paginationParams.value, page };
}
</script>

<template>
  <PageHeader title="Providers" />
  <div v-if="providers.length === 0">No providers yet.</div>
  <template v-else>
    <!-- table here -->
    <Pagination
      :page="response.meta.page"
      :total-pages="response.meta.pageCount"
      :has-next-page="response.meta.hasNextPage"
      :has-previous-page="response.meta.hasPreviousPage"
      @update:page="setPage"
    />
  </template>
</template>
```

## Mutation with form values

Mutation accepts form values. Serialization happens inside `mutationFn`.

```ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { postV1Providers } from "#src/common/api/sdk";
import { stripEmpty } from "#src/common/utils/objects/strip-empty";
import { PROVIDER_QUERY_KEYS } from "../../entity";
import type { ProviderFormValues } from "../../schemas/providers.schemas";

export function useCreateProviderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: ProviderFormValues) => {
      const body = {
        name: values.name,
        ...stripEmpty({
          description: values.description,
          logoUrl: values.logoUrl,
        }),
      };
      const { data } = await postV1Providers({ body, throwOnError: true });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROVIDER_QUERY_KEYS.lists() });
    },
  });
}
```

## Feature button with hook

Button self-checks visibility. Hook orchestrates mutation + toast.

```vue
<!-- features/cancel-booking/cancel-booking-button.vue -->
<script setup lang="ts">
import type { Booking } from "../../entity";
import { canCancel } from "../../entity";
import { useCancelBooking } from "./use-cancel-booking";
import { Button } from "#src/common/components/atoms/button";

const props = defineProps<{ booking: Booking }>();
const { trigger, isPending } = useCancelBooking(() => props.booking.id);
</script>

<template>
  <Button
    v-if="canCancel(booking)"
    variant="outline"
    :disabled="isPending"
    @click="trigger"
  >
    <span v-text="isPending ? 'Cancelling...' : 'Cancel booking'" />
  </Button>
</template>
```

```ts
// features/cancel-booking/use-cancel-booking.ts
import { toValue } from "vue";
import type { MaybeRefOrGetter } from "vue";
import { useCancelBookingMutation } from "./cancel-booking.mutation";
import { runWithToast } from "#src/common/utils/errors/run-with-toast";
import type { UUID } from "#src/types";

export function useCancelBooking(id: MaybeRefOrGetter<UUID>) {
  const mutation = useCancelBookingMutation();

  async function trigger(): Promise<boolean> {
    return await runWithToast(mutation.mutateAsync, toValue(id), {
      success: "Booking cancelled",
      error: "Failed to cancel booking",
    });
  }

  return { trigger, isPending: mutation.isPending };
}
```

## Query with TanStack

```ts
import { computed } from "vue";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { getV1BookingsByIdOptions } from "#src/common/api/sdk-queries";
import type { UUID } from "#src/types";

export function useBookingDetailQuery(id: Ref<UUID>) {
  return useQuery(
    computed(() => ({
      ...getV1BookingsByIdOptions({ path: { id: id.value } }),
      enabled: !!id.value,
    })),
  );
}
```

## Form field with schema

```vue
<FormField id="name" v-slot="field" label="Name" :error="errors.name">
  <Input
    id="name"
    v-model="name"
    v-bind="{ ...nameAttrs, ...field }"
    placeholder="Provider name"
  />
</FormField>
```

Spreading `field` onto the input is how `aria-describedby` and `aria-invalid`
flow through to screen readers.

## Module `index.ts` public API

```ts
// modules/(marketplace)/providers/index.ts
// Entity
export type { Provider, ProviderListItem } from "./entity";
export {
  canEdit,
  PROVIDER_QUERY_KEYS,
  useProvidersListQuery,
  useProviderDetailQuery,
} from "./entity";

// Schemas
export { ProviderFormSchema } from "./schemas/providers.schemas";
export type { ProviderFormValues } from "./schemas/providers.schemas";

// Features (add as you generate them)
export { CreateProviderForm } from "./features/create-provider";
export { EditProviderButton } from "./features/edit-provider";
export { DeleteProviderButton } from "./features/delete-provider";

// Mutations (only if callers need them directly; usually via feature components)
export {
  useCreateProviderMutation,
  useUpdateProviderMutation,
  useRemoveProviderMutation,
} from "./queries/providers.queries";
```

Never `export *`. Every name is listed explicitly.
