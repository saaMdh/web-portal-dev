<template>
  <full-screen-frame>
    <!-- eslint-disable-next-line vue/no-useless-template-attributes -->
    <template #title class="o-publish__toolbar">
      <v-btn :aria-label="$t('_.cancel')" icon @click="$emit('cancel')">
        <v-icon>{{
          $vuetify.locale.rtl ? "mdi-arrow-right" : "mdi-arrow-left"
        }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title>{{ t("titleForm") }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="$isDesktop">
        <v-btn
          :aria-label="$t('publish.publish')"
          color="primary"
          @click.stop="submit"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </template>
    </template>

    <div class="px-4 pt-4 pb-0 o-publish__content">
      <vv-form ref="form">
        <vv-field
          v-if="displayTitle"
          v-slot="{ field, errors }"
          rules="required"
        >
          <v-text-field
            v-bind="field"
            ref="title"
            v-model="form.title"
            :error-messages="errors"
            :label="categoryTitleLabel"
            filled
          ></v-text-field>
        </vv-field>

        <template v-if="$apollo.queries.specifications.loading > 0">
          <div class="d-flex justify-center align-center">
            <v-progress-circular
              color="primary"
              size="64"
              width="3"
              indeterminate
            ></v-progress-circular>
          </div>
        </template>
        <template v-else>
          <div v-if="form.category && specifications.length > 0">
            <div v-for="(item, index) in specifications" :key="index">
              <spec-list-item
                :key="item.specification.codename"
                v-model="specsModel"
                :spec="item"
                :category="form.category"
              ></spec-list-item>
            </div></div
        ></template>

        <v-row dense>
          <v-col :cols="priceUnitList.length > 1 ? 6 : 12">
            <vv-field v-slot="{ field, errors }" rules="float">
              <v-text-field
                v-bind="field"
                v-model.number="form.price"
                :suffix="unitText"
                :error-messages="errors"
                type="number"
                :label="$t('publish.price')"
                filled
                dense
              ></v-text-field>
            </vv-field>
          </v-col>
          <v-col v-if="priceUnitList.length > 1" cols="6">
            <vv-field v-slot="{ field, errors }" rules="required">
              <v-select
                v-bind="field"
                v-model="form.priceUnit"
                :error-messages="errors"
                :items="priceUnitList"
                class="pr-2 pb-0"
                filled
                dense
                :label="$t('publish.priceType')"
              ></v-select>
            </vv-field>
          </v-col>
        </v-row>

        <vv-field v-slot="{ field, errors }" rules="required">
          <region-field
            v-bind="field"
            v-model="form.regionIds"
            :error-messages="errors"
            filled
          ></region-field>
        </vv-field>

        <vv-field
          v-if="form.regionIds"
          v-slot="{ field, errors }"
          rules="required"
        >
          <city-field
            v-bind="field"
            v-model="form.cityIds"
            :error-messages="errors"
            filled
            :region-id="form.regionIds ? form.regionIds : null"
          ></city-field>
        </vv-field>

        <v-card class="v-card--rounded mb-6">
          <v-card-text>
            <label>{{ $t("checkout.info.contactPhone") }}</label>
            <vv-field
              v-slot="{ field, errors }"
              :rules="{ 'publish.phone': phoneRequired }"
            >
              <div class="v-checkbox-phones">
                <v-checkbox
                  v-for="a in phones"
                  v-bind="field"
                  :key="a.id"
                  v-model="form.phoneIds"
                  :label="a.phone"
                  :model-value="a.id"
                  hide-details
                  class="mt-0"
                  :error-messages="errors"
                ></v-checkbox>
              </div>
            </vv-field>

            <v-btn
              :aria-label="$t('checkout.info.managePhones')"
              variant="text"
              size="small"
              class="mt-5"
              @click="phonesManager.active = true"
            >
              <v-icon startsize="small">mdi-pencil</v-icon>
              {{ $t("checkout.info.managePhones") }}
            </v-btn>

            <phones-manager-dialog
              v-model="phonesManager.active"
              :check-validation="true"
            ></phones-manager-dialog>
          </v-card-text>
        </v-card>
      </vv-form>
    </div>

    <div class="text-center">
      <v-btn
        :aria-label="$t('publish.publish')"
        color="primary"
        class="mb-5"
        @click.stop="submit"
      >
        <v-icon>mdi-check </v-icon>
        {{ $t("publish.publish") }}
      </v-btn>
    </div>
  </full-screen-frame>
</template>

<script>
import gql from "graphql-tag";
import filter from "lodash/filter";
import map from "lodash/map";
import get from "lodash/get";
import some from "lodash/some";

import CityField from "@ouedkniss/web-ui-plugin/src/components/Field/CityField.vue";
import RegionField from "@ouedkniss/web-ui-plugin/src/components/Field/RegionField.vue";
import PhonesManagerDialog from "@ouedkniss/web-ui-plugin/src/components/Dialog/PhonesManagerDialog.vue";
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";

import SpecListItem from "./FilterFields/SpecListItem.vue";

import PublishStore from "./PublishStore";

import Queries from "./Queries.graphql";

import { localize, extend } from "vee-validate";
import FullScreenFrame from "@ouedkniss/web-ui-plugin/src/components/Misc/FullScreenFrame.vue";
import { useI18n } from "vue-i18n";

localize({
  fr: {
    messages: {
      "publish.phone": "Au moins un champ doit être sélectionné"
    }
  },
  ar: {
    messages: {
      "publish.phone": "يجب اختيار حقل واحد على الأقل"
    }
  },
  en: {
    messages: {
      "publish.phone": "At least one field must be selected"
    }
  }
});

extend("publish.phone", {
  computesRequired: true,
  validate: v => v.length > 0
});

const PHONE_QUERY = gql`
  {
    me {
      id
      phones {
        id
        phone
        phoneExt
        isValidated
        isLocked
        lineType
      }
    }
  }
`;

const CATEGORIES_WITHOUT_TITLE = [
  "telephones",
  "automobiles",
  "vehicules",
  "immobilier"
];

export default {
  components: {
    SpecListItem,
    RegionField,
    CityField,
    PhonesManagerDialog,
    FullScreenFrame
  },
  setup() {
    const { user } = useAuthFrame();
    const { t } = useI18n({
      messages: {
        fr: {
          titleForm: "Détails de l'annonce"
        },
        ar: {
          titleForm: "تفاصيل الاعلان"
        },
        en: {
          titleForm: "Details of the ad"
        }
      }
    });
    return {
      user,
      t
    };
  },

  data() {
    return {
      phonesManager: {
        active: false
      },

      form: PublishStore,

      specsModel: {},

      specifications: {},

      phones: [],

      categoryGet: null,

      phoneRequired: false
    };
  },

  apollo: {
    userPhoneGet: {
      query: PHONE_QUERY,
      manual: true,
      skip() {
        return this.form.category === null;
      },
      result({ data }) {
        if (this.form.category.slug === "automobiles") {
          this.phones = [
            ...filter(
              data.me.phones,
              s => s.isValidated && s.lineType === "MOBILE"
            )
          ];
        } else {
          this.phones = [...filter(data.me.phones, s => s.isValidated)];
        }
        const p = this.phones[0];
        if (p) this.form.phoneIds = [p.id];
      }
    },
    specifications: {
      manual: true,
      fetchPolicy: "network-only",
      query: Queries.CategoryGetSpecs,
      skip() {
        return this.form.category === null;
      },
      variables() {
        return {
          id: this.form.category.id
        };
      },
      result({ data }) {
        if (!data.categoryGet) return;

        if (this.form.category.slug === "automobiles") {
          this.phoneRequired = true;
        } else {
          this.phoneRequired = false;
        }

        this.specifications = filter(
          data.categoryGet.specifications,
          s => s.quickAnnouncementEnabled && s.specification.class !== "SEARCH"
        );
        this.categoryGet = data.categoryGet;
      }
    }
  },
  computed: {
    displayTitle() {
      return this.form.parentSlug !== null
        ? !some(CATEGORIES_WITHOUT_TITLE, s => s === this.form.parentSlug)
        : true;
    },

    categoryTitleLabel() {
      switch (this.form.parentSlug) {
        case "emploi_demandes":
          return this.$t(`publish.title.JOB_DEMANDES`);

        case "emploi_offres":
          return this.$t(`publish.title.JOB_OFFERS`);

        default:
          return this.$t(`publish.title.NOT_JOB`);
      }
    },

    priceUnitList() {
      if (!this.categoryGet) return [];

      return this.categoryGet.priceUnits
        .filter(v => v !== "UNIT")
        .map(v => ({
          text: this.$t(`announcement.priceUnit.${v}`),
          value: v
        }));
    },

    unitText() {
      const count = get(this.categoryGet, "priceUnits.length", 0);

      if (count > 2) return null;

      const priceUnit = get(this.categoryGet, "priceUnits[0]", null);

      if (!priceUnit) return null;

      return this.$t(`announcement.priceUnit.${priceUnit}`);
    }
  },

  watch: {
    categoryGet() {
      const priceUnit = get(this.categoryGet, "priceUnits[0]", null);
      this.form.priceUnit = priceUnit;
    }
  },

  methods: {
    async submit() {
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return;

      this.form.specifications = map(this.specsModel, (value, key) => ({
        codename: key,
        value: value
      }));

      this.$emit("submit");
    },

    reset() {
      this.specsModel = {};
      this.form.title = "";
      this.form.price = null;
      this.form.cityIds = null;
      this.form.regionIds = null;
      this.form.specifications = [];
      this.form.medias = [];
      this.form.defaultMedia = null;
      this.form.priceType = null;
      this.form.phoneIds = [];
      this.form.priceUnit = "UNIT";

      this.$refs.form.resetForm();
    }
  }
};
</script>

<style>
.v-checkbox-phones {
  max-height: 150px;
  overflow-y: auto;
}
</style>
