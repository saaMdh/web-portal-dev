import AlignProp from "@/components/SiteBuilder/Props/AlignProp.vue";
import NumberProp from "@/components/SiteBuilder/Props/NumberProp.vue";
import SpaceStepProp from "@/components/SiteBuilder/Props/SpaceStepProp.vue";

export default {
  editableProps: [
    {
      icon: "mdi-format-size",
      label: "components.textContent.props.fontSize",
      key: "text.fontSize",
      field: SpaceStepProp
    },
    {
      key: "text.textAlign",
      icon: "mdi-format-align-left",
      label: "components.textContent.props.textAlign",
      field: AlignProp
    },
    {
      key: "text.buttonCount",
      icon: "mdi-cursor-default-click",
      label: "components.textContent.props.buttonCount",
      field: NumberProp,
      bind: {
        min: 0,
        max: 2
      }
    }
  ]
};
