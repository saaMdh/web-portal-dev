import {
  enableAutoDestroy,
  resetAutoDestroyState,
  mount
} from "@vue/test-utils";
import Vuetify from "vuetify";
import { i18n } from "@/i18n";

import CityFieldFilter from "@/views/Search/components/FilterFields/CityFieldFilter.vue";
import cities16 from "../../../config/cities16.js";

const vuetify = new Vuetify();
const config = {
  i18n,
  vuetify,
  mocks: {
    $apollo: {
      queries: {
        cities: {
          loading: 0
        }
      }
    }
  }
};

const mountWithConfig = () => {
  let wrapper = mount(CityFieldFilter, config);
  wrapper.setData({ cities: cities16 });
  return wrapper;
};

enableAutoDestroy(afterEach);
afterAll(resetAutoDestroyState);

describe("🧪 Test: Search/FilterFields/CityFieldFilter.vue", () => {
  it("Default", async () => {
    const wrapper = await mountWithConfig();
    await wrapper.setProps({
      regionId: "alger-16"
    });
    const select = wrapper.vm.$refs.select;
    const input = wrapper.find('input[name="commune"]');

    expect(select.items.length).toEqual(cities16.length);
    expect(input.element.value).toContain("");
    wrapper.destroy();
  });

  it("Should wrapper emmit value when props changed", async () => {
    const wrapper = await mountWithConfig();

    await wrapper.setProps({
      regionId: "alger-16",
      value: ["alger-centre-556"]
    });
    expect(wrapper.emitted().cities).toEqual([[""], ["Alger centre"]]);

    await wrapper.setProps({
      value: []
    });

    expect(wrapper.emitted().cities).toEqual([[""], ["Alger centre"], [""]]);
    wrapper.destroy();
  });

  it("Should wrapper emmit processed value from props exp:['alger-centre-556', 'ain-benian-557'] => 'Alger centre - Ain benian'", async () => {
    const wrapper = await mountWithConfig();

    await wrapper.setProps({
      regionId: "alger-16",
      value: ["alger-centre-556", "ain-benian-557"]
    });
    expect(wrapper.emitted().cities).toEqual([
      [""],
      ["Alger centre - Ain benian"]
    ]);
    wrapper.destroy();
  });
});
