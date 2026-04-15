import { describe, expect, it } from "vitest";
import { stripEmpty } from "#src/common/utils/objects/strip-empty";

describe("stripEmpty", () => {
  it("removes empty strings, null, and undefined", () => {
    expect(stripEmpty({ a: "", b: null, c: undefined, d: "x" })).toEqual({ d: "x" });
  });

  it("preserves zero, false, and non-empty strings", () => {
    expect(stripEmpty({ a: 0, b: false, c: "x" })).toEqual({ a: 0, b: false, c: "x" });
  });

  it("returns empty object when all values are empty", () => {
    expect(stripEmpty({ a: "", b: null })).toEqual({});
  });
});
