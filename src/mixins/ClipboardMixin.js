export default {
  methods: {
    // TODO: Make a fallback for unsupported browser
    copyToClipboard(data) {
      return navigator.clipboard.writeText(data);
    }
  }
};
