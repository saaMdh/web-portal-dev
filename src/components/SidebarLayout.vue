<template>
  <div
    class="o-dual-layout"
    :class="{ '--reverse': reverse, '--fluid': fluid }"
  >
    <div class="__content">
      <slot></slot>
    </div>
    <div
      v-if="!disableSideBar"
      ref="sidebar"
      class="__sidebar d-none d-md-block d-lg-block"
    >
      <slot name="sidebar" :width="sidebarWidth"></slot>
    </div>
  </div>
</template>

<script>
import get from "lodash/get";

export default {
  props: {
    reverse: {
      type: Boolean,
      default: false
    },

    fluid: {
      type: Boolean,
      default: false
    },

    disableSideBar: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      sidebarWidth: 0
    };
  },
  created() {
    window.addEventListener("resize", this.handleWindowResize);
  },
  mounted() {
    this.sidebarWidth = get(this.$refs, "sidebar.clientWidth", 0);
  },

  updated() {
    this.sidebarWidth = get(this.$refs, "sidebar.clientWidth", 0);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleWindowResize); // quite important to remove the event listener.
  },

  methods: {
    handleWindowResize() {
      this.sidebarWidth = get(this.$refs, "sidebar.clientWidth", 0);
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive.scss";

.o-dual-layout {
  --sidebar-padding: 16px;
  --sidebar-width: 300px;
  --sidebar-max-width: 300px;

  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--sidebar-padding);

  &.--fluid {
    --sidebar-width: 23vw;
  }

  @include isDesktop {
    flex-direction: row;
    width: 100%;

    &.--reverse {
      flex-direction: row-reverse;
    }
  }

  & > .__content {
    position: relative;
    width: 100%;

    @include isDesktop {
      width: calc(100% - var(--sidebar-width) - var(--sidebar-padding));
      flex-grow: 1;
    }
  }

  & > .__sidebar {
    @include isDesktop {
      width: var(--sidebar-width);
      max-width: var(--sidebar-max-width);
      flex-shrink: 0;
    }

    &:empty {
      display: none;
    }
  }
}
</style>
