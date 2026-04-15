---
name: vee-validate-typebox-patterns
description:
  Form validation patterns — vee-validate with TypeBox schemas and custom
  resolver.
globs:
  - "src/modules/**/model/*.schemas.ts"
  - "src/common/validation/**/*.ts"
  - "src/app/pages/**/*.vue"
allowed-tools: Read, Write, Edit, Grep, Glob
---

# vee-validate + TypeBox Patterns

## Schema Definition

```typescript
import { Type } from "@sinclair/typebox";
import { EmailSchema, PasswordSchema } from "#src/common/validation";

export const SignInFormSchema = Type.Object({
  email: EmailSchema,
  password: PasswordSchema,
});

export type SignInFormValues = Static<typeof SignInFormSchema>;
```

## Built-in Schemas

From src/common/validation/form-rules.ts:

- EmailSchema — format: "email"
- PasswordSchema — minLength: 6, pattern: letter + number

## Form Usage

```vue
<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypeBoxResolver } from "#src/common/validation";

const { handleSubmit, defineField, errors } = useForm<SignInFormValues>({
  validationSchema: toTypeBoxResolver(SignInFormSchema),
});

const [email, emailAttrs] = defineField("email");
const onSubmit = handleSubmit(async (values) => {
  await authStore.signIn(values);
});
</script>
```

## Anti-patterns

- Inline validation rules in components
- Using vee-validate without TypeBox
- Not using defineField
- Missing error display
