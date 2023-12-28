<template>
  <div
    v-once
    :style="{
      margin,
      height,
      background: `rgba(${
        $vuetify.theme.current.dark ? '255, 255, 255' : '120, 120, 120'
      }, 0.12)`,
      borderRadius: '5px'
    }"
  ></div>
</template>
<script setup>
import { ref } from "vue";
const props = defineProps({
  target: {
    type: String,
    default: "AnnouncementMini"
  },
  margin: {
    type: String,
    default: "0"
  }
});
const height = ref("");
switch (props.target) {
  case "Announcement":
    height.value = "590px";
    break;
  case "AnnouncementMini":
    height.value = "270px";
    break;
  case "Store":
    height.value = "420px";
    break;
  case "DesktopAnnouncementStore":
    height.value = "400px";
    break;
  case "MobileAnnouncementStore":
    height.value = "470px";
    break;
  case "DesktopCarouselAnnouncementStore":
    height.value = "360px";
    break;
  case "MobileCarouselAnnouncementStore":
    height.value = "480px";
    break;
}
</script>
