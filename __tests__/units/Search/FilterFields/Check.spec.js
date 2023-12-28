import {
  enableAutoDestroy,
  resetAutoDestroyState,
  mount
} from "@vue/test-utils";
import Vuetify from "vuetify";
import Check from "@/views/Search/components/FilterFields/Check.vue";

const vuetify = new Vuetify();
let wrapper = mount(Check, {
  vuetify
});

enableAutoDestroy(afterEach);
afterAll(resetAutoDestroyState);

describe("🧪 Test: Search/FilterFields/Check.vue", () => {
  it("Default", async () => {
    const label = wrapper.find("label");
    const input = wrapper.find('input[type="checkbox"]');

    expect(label.text()).toContain("");
    expect(input.element.checked).toBeFalsy();
  });

  it("Should render label", async () => {
    await wrapper.setProps({
      label: "label-test"
    });
    const label = wrapper.find("label");
    expect(label.text()).toContain("label-test");
  });

  it("Should check/uncheck the checkbox when props is true/false", async () => {
    const input = wrapper.find('input[type="checkbox"]');
    await wrapper.setProps({
      value: "true"
    });
    expect(input.element.checked).toBeTruthy();

    await wrapper.setProps({
      value: "false"
    });
    expect(input.element.checked).toBeFalsy();
    wrapper.destroy();
  });

  it("Should emit when the checkbox is check/uncheck", async () => {
    const wrapper = mount(Check, {
      vuetify
    });
    const input = wrapper.find('input[type="checkbox"]');

    await input.setChecked(true);
    expect(wrapper.emitted().input).toEqual([["false"], ["true"]]);

    await input.setChecked(false);
    expect(wrapper.emitted().input).toEqual([["false"], ["true"], ["false"]]);
    wrapper.destroy();
  });

  it("Should emit when the props is is true/false", async () => {
    const wrapper = mount(Check, {
      vuetify
    });
    await wrapper.setProps({
      value: "true"
    });

    expect(wrapper.emitted().input).toEqual([["false"], ["true"]]);

    await wrapper.setProps({
      value: "false"
    });

    expect(wrapper.emitted().input).toEqual([["false"], ["true"], ["false"]]);
    wrapper.destroy();
  });
});
