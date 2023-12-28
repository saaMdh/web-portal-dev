<template>
  <div>
    <div v-if="$apollo.queries.services.loading">
      <v-skeleton-loader type="table"></v-skeleton-loader>
    </div>

    <v-card v-else variant="outlined" class="px-4">
      <v-row>
        <v-col cols="12" md="6">
          <service-categories-multiple-selector
            v-model="storePurchaseInput.categoryIds"
            class="pt-2"
            :categories="categories"
          ></service-categories-multiple-selector>
        </v-col>
        <v-col cols="12" md="6">
          <vv-field
            v-slot="{ field, errors }"
            name="duration"
            rules="required|min_value:1"
          >
            <service-duration-field
              v-bind="field"
              v-model="storePurchaseInput.duration"
              class="pt-2"
              dense
              :errors="errors"
            ></service-duration-field>
          </vv-field>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <title-with-helper
        :title="
          $t('purchase.store.purchaseForm.step1.fields.offer.offer.title')
        "
        :message="
          $t('purchase.store.purchaseForm.step1.fields.offer.offer.message')
        "
      ></title-with-helper>

      <v-item-group v-model="storePurchaseInput.serviceId" class="mx-2">
        <v-row density="compact">
          <v-col v-for="(header, i) in headers" :key="i" cols="12" md="3">
            <v-item v-slot="{ active, toggle }">
              <service-item
                :plan="header"
                :params="params"
                :bonuses="bonuses[i]"
                :index="i"
                :categories="getCategoriesIds"
                :duration="storePurchaseInput.duration"
                :active="active"
                @toggle="toggle"
              ></service-item>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </v-card>
  </div>
</template>

<script>
import gql from "graphql-tag";
import reduce from "lodash/reduce";
import uniqBy from "lodash/uniqBy";
import map from "lodash/map";

import ServiceItem from "../components/StorePriceComponents/ServiceItem.vue";
import TitleWithHelper from "../components/StorePriceComponents/TitleWithHelper.vue";
import ServiceDurationField from "../components/StorePriceComponents/ServiceDurationField.vue";
import ServiceCategoriesMultipleSelector from "../components/StorePriceComponents/ServiceCategoriesMultipleSelector.vue";

export default {
  components: {
    ServiceCategoriesMultipleSelector,
    ServiceItem,
    TitleWithHelper,
    ServiceDurationField
  },
  props: {
    modelValue: { type: Object, default: null },
    isAdmin: { type: Boolean, default: false }
  },

  data() {
    return {
      services: [],
      params: [],
      headers: [],
      categories: [],
      bonuses: []
    };
  },
  computed: {
    getCategoriesIds() {
      return this.storePurchaseInput.categoryIds.map(category => category.id);
    },
    storePurchaseInput: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  },

  apollo: {
    services: {
      query: gql`
        {
          services: storeServiceList {
            id
            type
            title
            code
            params {
              code
              title
              hidden
              valueType
              value
            }
            serviceCategoryGroups {
              categoryGroup {
                id
                title
                incompatibleCategories {
                  id
                  title
                }
              }
              defaultPrice
            }
            bonuses {
              type
              value
              serviceParameter {
                id
                code
                title
              }
              minDuration
              maxDuration
            }
          }
        }
      `,
      result({ data }) {
        if (data.services) {
          this.headers = map(data.services, s => {
            return { title: s.title, id: s.id };
          });

          this.bonuses = map(data.services, "bonuses");
          this.params = reduce(
            data.services,
            (acc, s) => {
              const p = map(s.params, p => ({
                label: p.title,
                code: p.code,
                hidden: p.hidden,
                valueType: p.valueType,
                values: [
                  {
                    value: null,
                    isImportant: false
                  }
                ]
              }));

              return [...acc, ...p];
            },
            []
          );

          this.params = uniqBy(this.params, "code");

          this.params = map(this.params, p => {
            const values = map(data.services, s => {
              const sp = s.params.find(pp => pp.code == p.code);
              if (sp)
                return {
                  value: sp.value,
                  isImportant: false
                };
              else return null;
            });

            return {
              ...p,
              values
            };
          });

          this.categories = reduce(
            data.services,
            (acc, s) => {
              const p = map(s.serviceCategoryGroups, p => ({
                id: p.categoryGroup.id,
                name: p.categoryGroup.title,
                incompatibleCategories: p.categoryGroup.incompatibleCategories
              }));

              return [...acc, ...p];
            },
            []
          );

          this.categories = uniqBy(this.categories, "id");
        }
      }
    }
  }
};
</script>

<style lang="scss"></style>
