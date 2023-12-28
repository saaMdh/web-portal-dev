<template>
  <div
    ref="targetEl"
    :style="`min-height:${fixedMinHeight ? fixedMinHeight : minHeight}px`"
  >
    <slot v-if="backendLoading || !shouldRender" name="skeleton"></slot>
    <slot v-else></slot>
  </div>
</template>
<script>
import { useIntersectionObserver } from "@vueuse/core";
import { ref, nextTick } from "vue";
import get from "lodash/get";

function onIdle(cb = () => {}) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb);
  } else {
    setTimeout(() => {
      nextTick(cb);
    }, 300);
  }
}

export default {
  props: {
    renderOnIdle: { type: Boolean, default: false },
    unrender: { type: Boolean, default: false },
    minHeight: { type: [Number, String], default: 0 },
    backendLoading: { type: Boolean, default: false },
    unrenderDelay: {
      type: Number,
      default: 10000
    },
    rootMargin: { type: String, default: "300px" }
  },
  emits: ["render", "unrender"],
  setup(props, { emit }) {
    const shouldRender = ref(false);
    const targetEl = ref();
    const fixedMinHeight = ref(0);
    let unrenderTimer;
    let renderTimer;
    const { stop } = useIntersectionObserver(
      targetEl,
      ([{ isIntersecting }]) => {
        if (isIntersecting) {
          // perhaps the user re-scrolled to a component that was set to unrender. In that case stop the unrendering timer
          clearTimeout(unrenderTimer);
          // if we're dealing underndering lets add a waiting period of 200ms before rendering.
          // if a component enters the viewport and also leaves it within 200ms it will not render at all.
          // this saves work and improves performance when user scrolls very fast
          if (props.unrender) {
            renderTimer = setTimeout(
              () => {
                emit("render", true);
                shouldRender.value = true;
              },
              props.unrender ? 200 : 0
            );
          } else {
            emit("render", true);
            shouldRender.value = true;
          }

          if (!props.unrender) {
            stop();
          }
        } else if (props.unrender) {
          // if the component was set to render, cancel that
          clearTimeout(renderTimer);
          unrenderTimer = setTimeout(() => {
            fixedMinHeight.value = get(
              targetEl,
              "value.clientHeight",
              props.minHeight
            );
            emit("unrender", true);
            shouldRender.value = false;
          }, props.unrenderDelay);
        }
      },
      {
        rootMargin: props.rootMargin
      }
    );
    if (props.renderOnIdle) {
      onIdle(() => {
        emit("render", true);
        shouldRender.value = true;
        if (!props.unrender) {
          stop();
        }
      });
    }
    return { targetEl, shouldRender, fixedMinHeight, stop };
  },
  beforeUnmount() {
    this.stop();
  }
};
</script>
