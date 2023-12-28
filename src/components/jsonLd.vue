<template>
  <div></div>
</template>
<script setup>
import {
  useSchemaOrg,
  defineProduct,
  defineBreadcrumb,
  defineListItem
} from "@unhead/schema-org";
import { onMounted } from "vue";

const props = defineProps({
  jsonld: {
    type: [Object, Array],
    require: true
  },
  type: {
    type: String,
    require: true
  }
});

const IDENTITIES = [
  { type: "product", action: defineProduct },
  { type: "breadcrumb", action: defineBreadcrumb },
  { type: "itemlist", action: defineListItem }
];

const getIdentity = type => {
  const identity = IDENTITIES.find(idn => idn.type === type);
  return identity ? identity.action : null;
};

const defineType = getIdentity(props.type);
onMounted(() => {
  useSchemaOrg([defineType(props.jsonld)]);
});
</script>
