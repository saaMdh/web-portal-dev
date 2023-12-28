import { reactive } from "vue";

export const FormDefault = {
  parentSlug: null,
  category: null,
  title: "",
  price: null,
  medias: [],
  defaultMedia: null,
  priceType: null,
  specifications: [],
  phoneIds: [],
  priceUnit: "UNIT",
  duration: 10,
  cityIds: null,
  regionIds: null
};

export default reactive({
  ...FormDefault
});
