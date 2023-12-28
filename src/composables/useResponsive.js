import { computed } from "vue";
import { getCurrentInstance } from "vue";

export default () => {
  const vm = getCurrentInstance().appContext.config.globalProperties;

  const $isDesktop = computed(() => {
    return vm.$store.state.builder &&
      vm.$store.state.builder.editor.enable &&
      vm.$vuetify.display.mdAndUp.value
      ? !vm.$store.state.builder.editor.phone
      : vm.$vuetify.display.mdAndUp.value;
  });
  const $isMobile = computed(() => {
    return vm.$store.state.builder &&
      vm.$store.state.builder.editor.enable &&
      vm.$vuetify.display.mdAndUp.value
      ? vm.$store.state.builder.editor.phone
      : vm.$vuetify.display.smAndDown.value;
  });
  const $r = mapBind => {
    const bpOrder = ["xs", "sm", "md", "lg", "xl"];

    let bpSelected = bpOrder.find(bp => {
      if (vm.$vuetify.display[bp].value && bp in mapBind) return true;
      return false;
    });

    if (bpSelected === undefined) {
      const lastBp = bpOrder.reverse().find(bpKey => bpKey in mapBind);
      bpSelected = lastBp;
    }

    return mapBind[bpSelected];
  };
  const goTo = (targetOffset, options, animated = true) => {
    const duration = options?.duration || 1000;
    const offset = options?.offset || 0;
    const container = options?.container || window;
    const targetPosition = targetOffset - offset;
    let startingPosition = 0;
    if (options?.container) {
      const { y } = container.getBoundingClientRect();
      startingPosition = y;
    }
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
  };

  return {
    $isDesktop,
    $isMobile,
    $r,
    goTo
  };
};
