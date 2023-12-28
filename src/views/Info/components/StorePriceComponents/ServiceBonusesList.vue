<template>
  <v-list dense>
    <v-list-item v-for="(bonuse, i) in bonuses" :key="i">
      <template #prepend>
        <v-icon color="primary">mdi-gift</v-icon>
      </template>
      <span>
        <v-list-item-title>
          {{
            bonuse.type == "SERVICE_PARAMETER"
              ? bonuse.value + " " + bonuse.serviceParameter.title
              : $t(
                  "purchase.store.purchaseForm.step1.fields.offer.offredMonth",
                  {
                    n: bonuse.value
                  }
                )
          }}
        </v-list-item-title>
      </span>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  props: {
    bonuses: { type: Array, default: null }
  }
};
</script>
