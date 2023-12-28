export default {
  Text: block => ({ type: "Content", layout: 0, attrs: block.attrs }),

  Media: block => ({ type: "Content", layout: 1, attrs: block.attrs }),

  ProductsBrowser: block => ({
    type: "AnnounBrowserBlock",
    layout: 0,
    attrs: block.attrs
  }),

  AnnounBrowser: block => ({
    type:
      block.layout == 0
        ? "AnnounBrowserBlock"
        : block.layout == 1
        ? "AnnounQueryListBlock"
        : "AnnounBrowserQuery",

    layout: 0,
    attrs: block.attrs
  }),

  Content: block => {
    if (block.layout === 1) return block;

    return block;
  }
};
