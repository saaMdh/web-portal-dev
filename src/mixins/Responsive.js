export default {
  computed: {
    $isDesktop() {
      return this.$store.state.builder &&
        this.$store.state.builder.editor.enable &&
        this.$vuetify.display.mdAndUp
        ? !this.$store.state.builder.editor.phone
        : this.$vuetify.display.mdAndUp;
    },
    $isMobile() {
      return this.$store.state.builder &&
        this.$store.state.builder.editor.enable &&
        this.$vuetify.display.mdAndUp
        ? this.$store.state.builder.editor.phone
        : this.$vuetify.display.smAndDown;
    }
  },

  methods: {
    $r(mapBind) {
      const bpOrder = ["xs", "sm", "md", "lg", "xl"];

      let bpSelected = bpOrder.find(bp => {
        if (this.$vuetify.display[bp] && bp in mapBind) return true;
        return false;
      });

      if (bpSelected === undefined) {
        const lastBp = bpOrder.reverse().find(bpKey => bpKey in mapBind);
        bpSelected = lastBp;
      }

      return mapBind[bpSelected];
    },
    goTo(targetOffset, options, animated = true) {
      const duration = options?.duration || 1000;
      const offset = options?.offset || 0;
      const container = options?.container || window;
      const targetPosition = targetOffset - offset;
      const startingPosition = container.scrollY;
      const distance = targetPosition - startingPosition;
      const startTime = performance.now();

      function scrollAnimation(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeInOutQuad = t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

        container.scrollTo(
          0,
          startingPosition + distance * easeInOutQuad(progress)
        );

        if (progress < 1) {
          requestAnimationFrame(scrollAnimation);
        }
      }

      if (!animated) container.scrollTo(0, distance);
      else requestAnimationFrame(scrollAnimation);
    }
  }
};
