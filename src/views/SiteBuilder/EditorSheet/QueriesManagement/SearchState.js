import { reactive } from "vue";

export const QUERY_DEFAULT = {
  keywords: null,
  origin: null,
  delivery: null,
  regionIds: [],
  cityIds: [],
  priceRange: [],
  hasPrice: "false",
  connected: false,
  exchange: "false",
  hasPictures: "false",
  model: {},
  categorySlug: null,
  priceUnit: null,
  page: 1,
  fetchActiveCategory: true,
  category: {}
};

export default reactive({
  ...QUERY_DEFAULT
});
