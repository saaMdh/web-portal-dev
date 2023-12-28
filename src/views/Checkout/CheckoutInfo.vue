<template>
  <div>
    <!-- Chunk -->
    <v-card class="mb-4" elevation="1" rounded>
      <v-progress-linear
        :active="$apollo.queries.chunk.loading"
        indeterminate
        rounded
      ></v-progress-linear>
      <checkout-cart-chunk
        v-if="!!chunk"
        :key="chunk.id"
        :chunk="chunk"
        @update-chunk="v => updateChunk(v)"
      >
      </checkout-cart-chunk>
    </v-card>

    <!-- Form -->
    <vv-form ref="form">
      <v-row class="mb-4">
        <v-col cols="12" sm="12" md="6">
          <!-- Information user -->
          <v-card class="full-h" elevation="1" rounded>
            <v-card-text>
              <p class="text-h6 mb-4">{{ $t("checkout.info.title") }}</p>
              <vv-field
                v-slot="{ field, errors }"
                v-model="contactForm.name"
                name="contactName"
                rules="required"
              >
                <v-text-field
                  v-bind="field"
                  :model-value="contactForm.name"
                  :error-messages="errors"
                  hide-details="auto"
                  class="mb-4"
                  variant="outlined"
                  density="comfortable"
                  :label="$t('checkout.info.contactName')"
                ></v-text-field>
              </vv-field>

              <!-- Phones -->
              <div class="my-0 py-0">
                {{ $t("checkout.info.contactPhone") }}
              </div>
              <template v-if="userInfo.phones.length">
                <template v-for="a in userInfo.phones" :key="a.id">
                  <vv-field
                    v-slot="{ field, errors }"
                    v-model="contactForm.phones"
                    name="phones"
                    rules="required"
                    :value="a.phone"
                    type="checkbox"
                  >
                    <v-checkbox
                      v-bind="field"
                      :label="a.phone"
                      :value="a.phone"
                      :model-value="contactForm.phones"
                      hide-details
                      density="compact"
                      style="height: 30px"
                      :error="errors.length > 0"
                      class="my-0 py-0"
                    ></v-checkbox>
                  </vv-field>
                </template>
              </template>

              <div v-if="userInfo.phones.length">
                <v-btn
                  :aria-label="$t('checkout.info.managePhones')"
                  color="primary"
                  rounded
                  variant="elevated"
                  size="small"
                  class="mt-2 mb-4"
                  @click="phonesManager.active = true"
                >
                  <v-icon startsize="small">mdi-pencil</v-icon>
                  {{ $t("checkout.info.managePhones") }}
                </v-btn>
              </div>

              <vv-form
                v-if="userInfo.phones.length === 0"
                ref="formEmpty"
                @submit="addPhone(true)"
              >
                <div class="d-flex align-start">
                  <div class="flex-fill mt-2">
                    <vv-field
                      v-slot="{ errors, field }"
                      v-model="formEmpty.phone"
                      name="phone"
                      rules="required|phone"
                    >
                      <v-text-field
                        v-bind="field"
                        density="comfortable"
                        :model-value="formEmpty.phone"
                        variant="outlined"
                        :error-messages="errors"
                        :placeholder="$t('form.addNumber')"
                        prepend-inner-icon="mdi-phone"
                        hide-details="auto"
                        class="mb-3"
                        onkeypress="return (event.charCode >= 48 && event.charCode <=57) || event.charCode == 43"
                      >
                      </v-text-field>
                    </vv-field>
                  </div>
                </div>

                <div class="mb-4">
                  <v-btn
                    :aria-label="$t('form.add')"
                    color="primary"
                    type="submit"
                    variant="elevated"
                    :disabled="formEmpty.phone === ''"
                  >
                    <v-icon left>mdi-check</v-icon>
                    {{ $t("checkout.form.add") }}
                  </v-btn>
                </div>
              </vv-form>

              <!-- Custom promotional ads section -->
              <div v-if="showCustomAd">
                <ad-alert></ad-alert>
              </div>

              <!-- Address -->
              <div v-if="contactForm.locationType == 'ADDRESS'" key="address">
                <div class="mb-2">{{ $t("checkout.info.address") }}</div>
                <template v-if="userInfo.addresses.length">
                  <vv-field
                    v-slot="{ field, errors }"
                    v-model="contactForm.addressId"
                    name="address"
                    rules="required"
                  >
                    <v-radio-group
                      v-bind="field"
                      :model-value="contactForm.addressId"
                      :error-messages="errors"
                      mandatory
                      density="compact"
                      class="mt-0 mb-3"
                      hide-details="auto"
                    >
                      <v-radio
                        v-for="a in userInfo.addresses"
                        :key="a.id"
                        :label="a.region.name + ' ' + a.city.name"
                        :value="a.id"
                      ></v-radio>
                    </v-radio-group>
                  </vv-field>
                </template>

                <vv-form
                  v-if="userInfo.addresses.length === 0"
                  ref="formEmptyAddress"
                  @submit="addOrUpdateAddress(true)"
                >
                  <v-row dense class="mb-2">
                    <v-col cols="12" md="6">
                      <vv-field
                        v-slot="{ errors, field }"
                        v-model="formEmptyAdress.region"
                        name="region"
                        rules="required"
                      >
                        <region-field
                          v-bind="excludeValueField(field)"
                          :error-messages="errors"
                          :model-value="formEmptyAdress.region"
                          return-object
                          density="comfortable"
                          variant="outlined"
                          class="mb-1"
                          hide-details="auto"
                        ></region-field>
                      </vv-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <vv-field
                        v-slot="{ errors, field }"
                        v-model="formEmptyAdress.city"
                        name="city"
                        rules="required"
                      >
                        <city-field
                          v-bind="excludeValueField(field)"
                          :error-messages="errors"
                          :model-value="formEmptyAdress.city"
                          return-object
                          density="comfortable"
                          variant="outlined"
                          class="mb-1"
                          hide-details="auto"
                          :region-id="
                            formEmptyAdress.region
                              ? formEmptyAdress.region.id
                              : null
                          "
                        ></city-field>
                      </vv-field>
                    </v-col>
                    <v-col cols="12">
                      <vv-field
                        v-slot="{ errors, field }"
                        v-model="formEmptyAdress.address"
                        name="street-address"
                        rules="required"
                      >
                        <v-text-field
                          v-bind="field"
                          :model-value="formEmptyAdress.address"
                          density="comfortable"
                          variant="outlined"
                          prepend-inner-icon="mdi-map-marker"
                          name="address"
                          hide-details="auto"
                          autocomplete="shipping street-address"
                          :error-messages="errors"
                          :placeholder="$t('form.address')"
                        ></v-text-field>
                      </vv-field>
                    </v-col>
                  </v-row>
                </vv-form>
                <v-btn
                  v-if="userInfo.addresses.length === 0"
                  :aria-label="$t('form.addAddress')"
                  color="primary"
                  type="submit"
                  variant="elevated"
                  :disabled="
                    formEmptyAdress.address === '' ||
                    formEmptyAdress.region == null ||
                    formEmptyAdress.city == null
                  "
                  :loading="loading > 0"
                >
                  <v-icon left>mdi-check</v-icon>
                  {{ $t("checkout.form.addAddress") }}
                </v-btn>

                <v-btn
                  v-else
                  :aria-label="$t('checkout.info.manageAddresses')"
                  color="primary"
                  rounded
                  size="small"
                  variant="elevated"
                  @click="addressManager.active = true"
                >
                  <v-icon start size="small">mdi-pencil</v-icon>
                  {{ $t("checkout.info.manageAddresses") }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" sm="12" md="6">
          <!-- Location  -->
          <v-card
            v-if="chunk && !chunk.isSelfDelivery && chunk.loadProviders"
            id="providers"
            elevation="1"
            rounded
          >
            <v-card-text>
              <v-progress-linear
                :active="loadingProviders > 0"
                indeterminate
              ></v-progress-linear>
              <template v-if="!loadingProviders">
                <p class="text-h6 mb-4">{{ $t("checkout.cart.provider") }}</p>
                <div>{{ $t("checkout.cart.addressDelivery") }}</div>
                <vv-field
                  v-slot="{ errors, field }"
                  v-model="selected"
                  name="addressDelivery"
                  rules="required"
                  mode="passive"
                >
                  <v-radio-group
                    v-bind="field"
                    :model-value="selected"
                    :error-messages="errors"
                    class="mt-0"
                  >
                    <template v-if="noProviderAvailable">
                      <v-alert
                        v-if="userInfo.addresses.length"
                        type="warning"
                        variant="tonal"
                        density="compact"
                        class="mb-0 mt-3"
                        :class="
                          $vuetify.locale.rtl ? 'text-right' : 'text-left'
                        "
                      >
                        {{ $t(`checkout.cart.noProvider`) }}
                      </v-alert>

                      <v-alert
                        v-else
                        type="warning"
                        variant="tonal"
                        density="compact"
                        class="mb-0 mt-3"
                        :class="
                          $vuetify.locale.rtl ? 'text-right' : 'text-left'
                        "
                        icon="mdi-arrow-up"
                      >
                        {{ $t(`checkout.cart.noAddress`) }}
                      </v-alert>
                    </template>

                    <v-radio
                      v-for="a in availableProviders"
                      :key="a.provider.id"
                      :value="a.id"
                    >
                      <template #label>
                        <div
                          class="mt-3"
                          :class="
                            $vuetify.locale.rtl ? 'text-right' : 'text-left'
                          "
                        >
                          <h1 class="text-body-1">
                            {{ a.provider.name }}
                          </h1>

                          <div class="text-body-2">
                            <span>
                              {{ a.duration.min }} - {{ a.duration.max }}
                              {{
                                $t(`checkout.cart.duration.${a.duration.unit}`)
                              }}
                            </span>
                            &mdash;
                            <span dir="ltr" class="text-primary">{{
                              formatCurrency(a.deliveryPrice, false)
                            }}</span>
                            <span class="text-primary ms-2">
                              {{ $t(`announcement.priceUnit.UNIT`) }}</span
                            >
                          </div>
                        </div>
                      </template></v-radio
                    >
                  </v-radio-group>
                </vv-field>
                <template v-if="!noRelayPointAvailable">
                  <div>
                    {{ $t("checkout.cart.relayPointDelivery") }}
                  </div>

                  <vv-field
                    v-slot="{ errors, field }"
                    v-model="selected"
                    name="relayPointDelivery"
                    rules="required"
                    mode="passive"
                  >
                    <v-radio-group
                      v-if="userInfo.addresses.length"
                      v-bind="field"
                      :model-value="selected"
                      :error-messages="errors"
                      class="mt-0"
                    >
                      <v-radio
                        v-for="a in availableRelayPoints"
                        :key="a.id"
                        :value="a.id"
                      >
                        <template #label>
                          <div
                            class="mt-3"
                            :class="
                              $vuetify.locale.rtl ? 'text-right' : 'text-left'
                            "
                          >
                            <h1 class="text-body-1">
                              {{ a.relayPoint.region.name }} -
                              {{ a.relayPoint.city.name }} -
                              {{ a.provider.name }}
                            </h1>
                            <div class="text-body-2">
                              {{ a.relayPoint.address }}
                              <v-icon
                                size="small"
                                color="info"
                                icon="mdi-google-maps"
                                @click="openGoogleMap(a.relayPoint)"
                              ></v-icon>
                            </div>
                            <div class="text-body-2">
                              <span>
                                {{ a.duration.min }} - {{ a.duration.max }}
                                {{
                                  $t(
                                    `checkout.cart.duration.${a.duration.unit}`
                                  )
                                }}
                              </span>
                              &mdash;
                              <span dir="ltr" class="text-primary">{{
                                formatCurrency(a.deliveryPrice, false)
                              }}</span>
                              <span class="text-primary ms-2">
                                {{ $t(`announcement.priceUnit.UNIT`) }}</span
                              >
                            </div>
                          </div>
                        </template></v-radio
                      >
                    </v-radio-group>
                    <v-alert
                      v-else
                      type="warning"
                      variant="tonal"
                      density="compact"
                      class="mb-0 mt-3"
                      :class="$vuetify.locale.rtl ? 'text-right' : 'text-left'"
                      icon="mdi-arrow-up"
                    >
                      {{ $t(`checkout.cart.noAddress`) }}
                    </v-alert>
                  </vv-field>
                </template>
              </template>
            </v-card-text>
          </v-card>

          <v-card
            v-if="chunk"
            elevation="1"
            rounded
            :class="chunk.isSelfDelivery ? '' : 'mt-4'"
          >
            <v-card-text>
              <p class="text-h6 mb-2">{{ $t("checkout.info.note") }}</p>
              <v-textarea
                v-model="contactForm.note"
                rows="3"
                variant="outlined"
              ></v-textarea>
            </v-card-text>
          </v-card>

          <!--Checkout Confirm -->
          <checkout-confirm
            v-if="chunk"
            class="mt-4"
            :user-info="userInfo"
            :current-chunk="chunk"
            :provider-price="providerForm.deliveryPrice"
            :relay-point="providerForm.relayPoint"
            :loading="loading + loadingProviders"
            @auto-add="autoAdd()"
            @confirm="confirm()"
          ></checkout-confirm>
        </v-col>
      </v-row>
    </vv-form>

    <phones-manager-dialog
      v-if="phonesManager.active"
      v-model="phonesManager.active"
      :check-validation="false"
    ></phones-manager-dialog>

    <addresses-manager-dialog
      v-if="addressManager.active"
      v-model="addressManager.active"
      @refetch="refetch"
    ></addresses-manager-dialog>
  </div>
</template>

<script>
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import MessageBox from "@/mixins/MessageBox";

import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import CheckoutCartChunk from "./components/CheckoutCartChunk";
import CheckoutInfoForm from "./CheckoutInfoForm";
import CheckoutConfirm from "./CheckoutConfirm";
import gql from "graphql-tag";
import Queries from "./Checkout.graphql";
import AdAlert from "@/components/Promotion/AdAlert.vue";

import { defineAsyncComponent } from "vue";
import CheckoutAlertsMixin from "./mixins/CheckoutAlertsMixin";
import env from "@/utils/env.js";

const USER_INFO_QUERY = gql`
  {
    me {
      id
      displayName
      phones {
        id
        phone
        isValidated
        isPrimary
        isLocked
      }
      addresses {
        id
        region {
          id
          name
          slug
        }
        city {
          id
          name
          slug
        }
        address
      }
    }
  }
`;
export default {
  components: {
    CheckoutConfirm,
    CheckoutCartChunk,
    PhonesManagerDialog: defineAsyncComponent(() =>
      import(
        "@ouedkniss/web-ui-plugin/src/components/Dialog/PhonesManagerDialog.vue"
      )
    ),
    AddressesManagerDialog: defineAsyncComponent(() =>
      import(
        "@ouedkniss/web-ui-plugin/src/components/Dialog/AddressesManagerDialog.vue"
      )
    ),
    CityField: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Field/CityField.vue")
    ),
    RegionField: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Field/RegionField.vue")
    ),
    AdAlert
  },
  mixins: [MessageBox, CheckoutAlertsMixin],
  setup() {
    const { user } = useAuthFrame();

    return {
      user
    };
  },
  data() {
    return {
      formEmpty: {
        phone: ""
      },

      formEmptyAdress: {
        address: "",
        region: null,
        city: null
      },

      chunk: null,
      loading: 0,
      loadingProviders: 0,

      availableProviders: [],
      availableRelayPoints: [],

      phonesManager: {
        active: false
      },

      addressManager: {
        active: false
      },

      locationType: [
        { text: "Point relais", value: "relay-point" },
        { text: "Mes adresses", value: "address" }
      ],

      providerForm: CheckoutInfoForm.providerForm,

      contactForm: CheckoutInfoForm.contactForm,

      userInfo: {
        displayName: "",
        phones: [],
        addresses: []
      },

      watchAddress: false
    };
  },

  computed: {
    noProviderAvailable() {
      return !this.availableProviders.length;
    },
    noRelayPointAvailable() {
      return !this.availableRelayPoints.length;
    },
    showCustomAd() {
      return false;
      // return (
      //   env.VUE_APP_SHOW_CUSTOM_ADS &&
      //   parseInt(env.VUE_APP_SHOW_CUSTOM_ADS) === 1
      // );
    },
    selected: {
      get() {
        if (isEmpty(this.providerForm)) return null;
        return this.providerForm.id;
      },
      set(v) {
        if (
          this.availableProviders.length > 0 ||
          this.availableRelayPoints.length > 0
        ) {
          const selectedObj = [
            ...this.availableProviders,
            ...this.availableRelayPoints
          ].find(e => v === e.id);

          this.providerForm = selectedObj;
        }
      }
    }
  },

  watch: {
    userInfo: {
      deep: true,
      handler() {
        if (this.contactForm.name === "")
          this.contactForm.name = get(this.userInfo, "displayName");
        if (this.userInfo.addresses.length === 0)
          this.contactForm.addressId = null;
        else {
          const a = get(this.userInfo, "addresses[0]");
          if (a) this.contactForm.addressId = a.id;
        }
        if (!this.contactForm.phones.length) {
          const p = get(this.userInfo, "phones[0]");
          if (p) this.contactForm.phones = [p.phone];
        }
      }
    },

    chunk: {
      deep: true,
      handler() {
        this.providerForm.providerId = get(this.chunk, "provider.id", null);
        this.contactForm.note = get(this.chunk, "contact.note", "");
        if (this.userInfo.addresses.length === 0) {
          this.availableProviders = [];
          this.availableRelayPoints = [];
        }
        if (this.contactForm.addressId === null) return;
        if (this.watchAddress) {
          this.watchAddress = false;
          return;
        }
        if (!this.chunk.isSelfDelivery) this.submitAddress();
      }
    },

    "$cart.state.cart.items": {
      deep: true,
      handler() {
        this.$apollo.queries.chunk.refetch();
      }
    },

    // "contactForm.locationType": "submitContact",

    "contactForm.addressId"() {
      if (this.contactForm.addressId === null || this.chunk === null) return;
      if (!this.chunk.isSelfDelivery) {
        this.submitAddress();
        this.$apollo.queries.chunk.refetch();
        this.watchAddress = true;
      }
    },

    // "contactForm.relayPointId": "submitContact",

    "userInfo.addresses"() {
      if (this.userInfo.addresses.length === 0) {
        this.availableProviders = [];
        this.availableRelayPoints = [];
      }
    },

    "userInfo.phones"() {
      if (this.userInfo.phones.length === 0) this.contactForm.phones = [];
    }
  },

  apollo: {
    userInfoGet: {
      loadingKey: "loading",
      fetchPolicy: "network-only",
      query: USER_INFO_QUERY,
      manual: true,
      result({ data }) {
        this.userInfo.displayName = data.me.displayName;
        this.userInfo.phones = [...data.me.phones];
        this.userInfo.addresses = [...data.me.addresses];
      }
    },

    chunk: {
      manual: true,
      query: Queries.CheckoutChunk,
      fetchPolicy: "network-only",
      skip() {
        return isEmpty(this.$route.query.chunkId);
      },
      variables() {
        return {
          id: this.$route.query.chunkId
        };
      },
      result({ data, error }) {
        if (
          error &&
          error.gqlError &&
          error.gqlError.extensions.category === "validation"
        )
          this.$router.push({ name: "home" });
        this.chunk = data.chunk;
      }
    }
  },

  methods: {
    refetch() {
      if (this.contactForm.addressId === null || this.chunk === null) return;
      if (!this.chunk.isSelfDelivery) {
        this.submitAddress();
        this.$apollo.queries.chunk.refetch();
        this.watchAddress = true;
      }
    },
    cannotAutoAdd() {},
    async autoAdd() {
      var canContinue = true;
      if (this.userInfo.addresses.length === 0) {
        if (
          this.formEmptyAdress.address === "" ||
          this.formEmptyAdress.region == null ||
          this.formEmptyAdress.city == null
        )
          canContinue = false;
        if (!(await this.$refs.formEmptyAddress.validate()))
          canContinue = false;
      }
      if (this.userInfo.phones.length === 0) {
        if (this.formEmpty.phone === "") canContinue = false;
        if (!(await this.$refs.formEmpty.validate())) canContinue = false;
      }
      if (!canContinue) {
        return this.$alert({
          title: this.$t("checkout.alerts.fieldRequiredError.0"),
          message: this.$t("checkout.alerts.fieldRequiredError.1"),
          acceptButtonLabel: this.$t("_.close"),
          icon: "mdi-alert-circle-outline",
          iconColor: "warning"
        });
      }
      if (this.userInfo.phones.length === 0) {
        await this.addPhone();
      }
      if (this.userInfo.addresses.length === 0) {
        await this.addOrUpdateAddress();
      }
      await this.$apollo.queries.userInfoGet.refetch();
      if (!this.providerForm.id && !this.chunk.isSelfDelivery) {
        const el = document.querySelector("#providers");
        if (el) {
          window.scrollTo({ top: el.offsetTop - 5 });
          el.classList.add("providers-required");
        }
      } else {
        this.confirm();
      }
    },
    async addPhone(refetch = false) {
      if (!(await this.$refs.formEmpty.validate())) return;
      this.loading++;

      try {
        await this.$apollo.mutate({
          mutation: Queries.UserPhoneCreate,
          variables: {
            phoneNumber: this.formEmpty.phone
          }
        });
        this.formEmpty.phone = "";

        if (refetch) await this.$apollo.queries.userInfoGet.refetch();
      } catch (error) {
        await this.$alert({
          title: this.$t("@.error.0"),
          message: this.$t(
            error?.graphQLErrors[0]?.extensions?.category == "validation"
              ? "CORE/WRONG_PHONE_FORMAT"
              : "@.error.1"
          ),
          rejectButtonShow: false
        });
      }

      this.loading--;
    },

    async addOrUpdateAddress(refetch = false) {
      if (!(await this.$refs.formEmptyAddress.validate())) return;

      this.loading++;

      try {
        await this.$apollo.mutate({
          mutation: Queries.UserAddressCreate,
          variables: {
            address: {
              address: this.formEmptyAdress.address,
              regionId: this.formEmptyAdress.region.id,
              cityId: this.formEmptyAdress.city.id,
              lat: null,
              lng: null
            }
          }
        });

        this.formEmptyAdress.address = "";
        this.formEmptyAdress.region = null;
        this.formEmptyAdress.address = null;

        if (refetch) await this.$apollo.queries.userInfoGet.refetch();
      } catch (error) {
        await this.$alert({
          title: this.$t("error.0"),
          message: this.$t("error.1"),
          rejectButtonShow: false
        });
      }
      this.loading--;
    },
    async updateChunk(chunk) {
      this.loading++;
      this.providerForm = {};
      await this.$apollo.mutate({
        mutation: Queries.CartUpdateChunkItems,
        variables: {
          chunkId: chunk.id,
          items: { ...this.contactForm, locationType: undefined }
        }
      });
      this.loading--;
    },

    async submitAddress() {
      this.loadingProviders++;

      const {
        data: { providers }
      } = await this.$apollo.query({
        fetchPolicy: "network-only",
        query: Queries.cartGetAvailableProviders,
        skip() {
          return this.chunk === null || this.contactForm.addressId === null;
        },
        variables: {
          chunkId: this.chunk.id,
          addressId: this.contactForm.addressId
        }
      });

      this.availableProviders = providers;

      const {
        data: { relayPoints }
      } = await this.$apollo.query({
        fetchPolicy: "network-only",
        query: Queries.cartGetAvailableRelayPoints,
        skip() {
          return this.chunk === null || this.contactForm.addressId === null;
        },
        variables: {
          chunkId: this.chunk.id,
          addressId: this.contactForm.addressId
        }
      });
      this.availableRelayPoints = relayPoints;

      this.providerForm = {};

      this.loadingProviders--;
    },

    async submit() {
      const { valid: isValid } = await this.$refs.form.validate();
      if (!isValid) return;

      this.loading++;
      try {
        await this.$apollo.mutate({
          mutation: Queries.CartSetContact,
          variables: {
            chunkId: this.chunk.id,
            info: {
              ...this.contactForm,
              locationType: this.providerForm.relayPoint
                ? "RELAY_POINT"
                : "ADDRESS",
              providerId: !this.chunk.isSelfDelivery
                ? this.providerForm.providerId
                : undefined
            }
          }
        });
      } catch (error) {
        const errorString = error.toString();
        if (errorString.includes("DELIVERY/STOCK_OUT")) {
          await this.$alert({
            title: this.$t("checkout.info.error.0"),
            message: this.$t("checkout.info.error.1")
          });
        } else {
          await this.$alert({
            title: this.$t("@.error.0"),
            message: this.$t("@.error.1")
          });
        }
        this.$router.push({ name: "home" });
      }
      this.loading--;
    },
    async confirm() {
      if (
        this.contactForm.phones.length === 0 ||
        this.contactForm.addressId === null ||
        this.contactForm.name == ""
      ) {
        return this.$alert({
          title: this.$t("checkout.alerts.fieldRequiredError.0"),
          message: this.$t("checkout.alerts.fieldRequiredError.1"),
          acceptButtonLabel: this.$t("_.close"),
          icon: "mdi-alert-circle-outline",
          iconColor: "warning"
        });
      }
      if (!this.providerForm.id && !this.chunk.isSelfDelivery) {
        const el = document.querySelector("#providers");
        if (el) {
          window.scrollTo({ top: el.offsetTop - 5 });
          el.classList.add("providers-required");
          return this.$alert({
            title: this.$t("checkout.alerts.providerRequiredError.0"),
            message: this.$t("checkout.alerts.providerRequiredError.1"),
            acceptButtonLabel: this.$t("_.close"),
            icon: "mdi-alert-circle-outline",
            iconColor: "warning"
          });
        }
        return false;
      }
      this.loading++;
      try {
        await this.$apollo.mutate({
          mutation: Queries.CartSetContact,
          variables: {
            chunkId: this.chunk.id,
            info: {
              ...this.contactForm,
              providerId: !this.chunk.isSelfDelivery
                ? this.providerForm.id
                : undefined,
              addressId: this.contactForm.addressId
                ? this.contactForm.addressId
                : undefined,
              locationType: this.providerForm.relayPoint
                ? "RELAY_POINT"
                : "ADDRESS"
            }
          }
        });
        const order = await this.$cart.submitCart(this.chunk.id);
        await this.deliveryConfirmedAlert();

        if (window.fbq)
          this.chunk.items.forEach(item => {
            window.fbq("track", "Purchase", {
              value: item.itemPrice,
              currency: "DZD",
              content_type: "product",
              content_ids: item.announcement.id,
              content_category: item.announcement.category.slug
            });
          });

        this.goToPanel(order[0].id);
        this.$cart.fetchCart();
      } catch (error) {
        const errorString = error.toString();
        if (errorString.includes("DELIVERY/STOCK_OUT")) {
          await this.$alert({
            title: this.$t("checkout.info.error.0"),
            message: this.$t("checkout.info.error.1")
          });
        } else {
          await this.deliveryErrorAlert();
        }
      }
      this.reset();
      this.loading--;
    },
    reset() {
      CheckoutInfoForm.providerForm = {};
      CheckoutInfoForm.contactForm = {
        name: "",
        locationType: "ADDRESS",
        phones: [],
        addressId: null,
        note: ""
      };
    },

    goToPanel(orderId) {
      const url = `${env.VUE_APP_OUEDKNISS_PANEL}/u/delivery/order/${
        orderId || ""
      }`;
      window.location.href = url;
    },
    openGoogleMap(r) {
      const url = `https://www.google.com/maps?q=${r.lat},${r.lng}`;
      window.open(url, "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
.v-item--active {
  border: none !important;
}
.providers-required {
  border: 2px solid red;
  box-shadow: none !important;
}
</style>
