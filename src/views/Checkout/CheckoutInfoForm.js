import { reactive } from "vue";

export const FormDefault = {
  providerForm: {},

  contactForm: {
    name: "",
    locationType: "ADDRESS",
    phones: [],
    addressId: null,
    note: ""
  }
};

export default reactive({
  ...FormDefault
});
