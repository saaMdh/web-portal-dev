<template>
  <div v-memo="[modelValue]">
    <div
      class="ok-overlay"
      :style="{ 'z-index': zIndex - 1, display }"
      @click="close"
    ></div>
    <nav
      class="ok-drawer"
      :style="{ 'z-index': zIndex, transform: `translateX(${translateX})` }"
      :class="'ok-drawer-' + position"
    >
      <slot v-if="modelValue"></slot>
    </nav>
  </div>
</template>

<script setup>
import { readonly, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useLocale } from "vuetify";
const { rtl } = useLocale();
const route = useRoute();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  width: {
    type: [String, Number]
  },
  location: {
    type: String,
    default: "start"
  },
  zIndex: {
    type: Number,
    default: 9999
  },
  closeOnRouteChange: {
    type: Boolean,
    default: true
  },
  blockPageScroll: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(["update:modelValue"]);

const width = readonly(ref(parseWidth(props.width)));
const position =
  (props.location === "start" && !rtl) || (props.location === "end" && rtl)
    ? "left"
    : "right";

const _PER = position === "left" ? "-100%" : "100%";

const translateX = ref(_PER);
const display = ref("none");

watch(
  () => props.modelValue,
  value => {
    toggle(value);
    if (props.blockPageScroll) {
      if (value)
        document.getElementsByTagName("html")[0].style.overflowY = "hidden";
      else document.getElementsByTagName("html")[0].style.overflowY = "scroll";
    }
  },
  { immediate: true }
);

watch(route, () => {
  if (props.closeOnRouteChange) close();
});

function toggle(value) {
  toggleOverlay(value);
  toggleDrawer(value);
}

function toggleDrawer(value) {
  if (value) translateX.value = "0%";
  else translateX.value = _PER;
}

function toggleOverlay(value) {
  display.value = value ? "block" : "none";
}

function close() {
  emit("update:modelValue", false);
}

function parseWidth(width) {
  if (typeof width === "number") return `${width}px`;
  else return width;
}
</script>
<style lang="scss">
.ok-overlay {
  position: absolute;
  display: none;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
.ok-drawer {
  position: fixed;
  top: 0;
  width: v-bind(width);
  height: 100%;
  background-color: rgb(var(--v-theme-surface));
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  transition: transform 0.2s ease;
}
.ok-drawer-left {
  left: 0px;
  transform: translateX(-100%);
}
.ok-drawer-right {
  right: 0px;
  transform: translateX(100%);
}
</style>
