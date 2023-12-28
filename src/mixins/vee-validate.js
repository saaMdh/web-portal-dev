export default {
  methods: {
    excludeValueField(field) {
      // issue when binding field prop with (v-select,v-autocomplete,v-combobox)
      // eslint-disable-next-line no-unused-vars
      const { value, ...res } = field;
      return res;
    }
  }
};
