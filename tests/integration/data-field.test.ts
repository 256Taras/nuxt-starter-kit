import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { DataField } from "#src/common/components/molecules/data-field";

describe("<DataField>", () => {
  it("renders label and value", () => {
    const wrapper = mount(DataField, {
      props: { label: "Email" },
      slots: { default: "alice@example.com" },
    });
    expect(wrapper.text()).toContain("Email");
    expect(wrapper.text()).toContain("alice@example.com");
  });

  it("uses given label as the visible <span>", () => {
    const wrapper = mount(DataField, {
      props: { label: "Status" },
      slots: { default: "Active" },
    });
    expect(wrapper.html()).toMatch(/Status/);
  });
});
