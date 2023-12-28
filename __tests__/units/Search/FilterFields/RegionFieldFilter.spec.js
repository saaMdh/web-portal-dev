import {
  enableAutoDestroy,
  resetAutoDestroyState,
  mount
} from "@vue/test-utils";
import Vuetify from "vuetify";
import { i18n } from "@/i18n";

import RegionFieldFilter from "@/views/Search/components/FilterFields/RegionFieldFilter.vue";
import regions from "../../../config/regions.js";

const vuetify = new Vuetify();
const config = {
  i18n,
  vuetify,
  mocks: {
    $apollo: {
      queries: {
        regions: {
          loading: 0
        }
      }
    }
  }
};

const mountWithConfig = () => {
  let wrapper = mount(RegionFieldFilter, config);
  wrapper.setData({ regions });
  return wrapper;
};

enableAutoDestroy(afterEach);
afterAll(resetAutoDestroyState);

describe("🧪 Test: Search/FilterFields/RegionFieldFilter.vue", () => {
  it("Default", async () => {
    const wrapper = await mountWithConfig();

    const select = wrapper.vm.$refs.select;
    const input = wrapper.find('input[name="wilaya"]');

    expect(select.items.length).toEqual(regions.length);
    expect(input.element.value).toContain("");
    wrapper.destroy();
  });

  it("Should wrapper emmit value when props changed", async () => {
    const wrapper = await mountWithConfig();

    await wrapper.setProps({
      value: ["alger-16"]
    });
    expect(wrapper.emitted().regions).toEqual([[""], ["Alger"]]);

    await wrapper.setProps({
      value: []
    });

    expect(wrapper.emitted().regions).toEqual([[""], ["Alger"], [""]]);
    wrapper.destroy();
  });

  it("Should wrapper emmit processed value from props exp:['alger-16', 'blida-9'] => 'Alger - Blida'", async () => {
    const wrapper = await mountWithConfig();

    await wrapper.setProps({
      value: ["alger-16", "blida-9", "sidi-bel-abbes-22"]
    });
    expect(wrapper.emitted().regions).toEqual([
      [""],
      ["Alger - Blida - Sidi bel abbes"]
    ]);
    wrapper.destroy();
  });
});
