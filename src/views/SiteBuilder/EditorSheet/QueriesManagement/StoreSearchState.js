import { reactive } from "vue";

export const QUERY_DEFAULT = {
  hasDelivery: false,
  regionId: null,
  cityId: null,
  categorySlug: null,
  page: 1
};

export default reactive({
  ...QUERY_DEFAULT
});
