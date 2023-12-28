import BackgroundProp from "@/components/SiteBuilder/Props/BackgroundProp.vue";
import ThemeProp from "@/components/SiteBuilder/Props/ThemeProp.vue";
import SpaceStepProp from "@/components/SiteBuilder/Props/SpaceStepProp.vue";

export default [
  {
    icon: "mdi-invert-colors",
    key: "theme",
    label: "editorPropsDefault.theme",
    field: ThemeProp,
    active: false
  },
  {
    icon: "mdi-image",
    label: "editorPropsDefault.background",
    key: "background",
    field: BackgroundProp
  },
  {
    icon: "mdi-arrow-expand-horizontal",
    key: "width",
    label: "editorPropsDefault.width",
    field: SpaceStepProp,
    active: false,
    bind: {
      min: 0,
      max: 5
    }
  },
  {
    icon: "mdi-arrow-expand-vertical",
    key: "padding",
    label: "editorPropsDefault.padding",
    field: SpaceStepProp,
    active: false,
    bind: {
      min: 0,
      max: 9
    }
  },
  {
    icon: "mdi-format-align-middle",
    key: "margin",
    label: "editorPropsDefault.margin",
    field: SpaceStepProp,
    active: false,
    bind: {
      min: 0,
      max: 9
    }
  }
];
