import { TypeCompiler } from "@sinclair/typebox/compiler";
import type { TObject, TProperties } from "@sinclair/typebox";
import type { TypeCheck } from "@sinclair/typebox/compiler";

const compiledCache = new WeakMap<TObject, TypeCheck<TObject>>();

function getCompiled<T extends TProperties>(schema: TObject<T>): TypeCheck<TObject<T>> {
  let compiled = compiledCache.get(schema);
  if (!compiled) {
    compiled = TypeCompiler.Compile(schema);
    compiledCache.set(schema, compiled);
  }
  return compiled as TypeCheck<TObject<T>>;
}

function formatError(error: { path: string; message: string }): { field: string; message: string } {
  const field = error.path.replace(/^\//, "");

  if (error.message.includes("format")) {
    return { field, message: "Invalid format" };
  }
  if (error.message.includes("pattern")) {
    return { field, message: "Must contain at least one letter and one number" };
  }

  const minLengthMatch = error.message.match(/length (\d+)/);
  if (minLengthMatch) {
    const min = minLengthMatch[1];
    return { field, message: min === "1" ? "Required" : `Must be at least ${min} characters` };
  }

  return { field, message: error.message };
}

export function toTypeBoxResolver<T extends TProperties>(schema: TObject<T>) {
  const compiled = getCompiled(schema);

  return (values: Record<string, unknown>) => {
    const errors: Record<string, string> = {};

    if (compiled.Check(values)) {
      return { values, errors: {} };
    }

    for (const error of compiled.Errors(values)) {
      const { field, message } = formatError(error);
      if (field && !errors[field]) {
        errors[field] = message;
      }
    }

    return { values, errors };
  };
}
