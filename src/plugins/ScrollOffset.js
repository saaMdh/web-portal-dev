if (typeof window.lastPageYOffset === "undefined") {
  window.lastPageYOffset = 0;
}

export default {
  install(app) {
    const scrollOffset = app.mixin({
      data: function() {
        return {
          scroll_offset: 0,
          isDown: false,
          isUp: false
        };
      }
    });

    window.addEventListener("scroll", () => {
      const scroll_offset = window.lastPageYOffset - window.pageYOffset;

      scrollOffset.scroll_offset = scroll_offset;
      scrollOffset.isDown = scroll_offset < 0;
      scrollOffset.isUp = scroll_offset > 0;

      window.lastPageYOffset = window.pageYOffset;
    });
    app.config.globalProperties.$scrollOffset = scrollOffset;
  }
};
