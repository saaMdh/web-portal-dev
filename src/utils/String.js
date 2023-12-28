export function mutate() {
  Object.defineProperty(String.prototype, "slugify", {
    value: function () {
      return this.valueOf()
        .replace(/^\s+|\s+$/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }
  });
  Object.defineProperty(String.prototype, "unslugify", {
    value: function () {
      return this.valueOf().replace(/-/g, " ");
    }
  });
}

export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
