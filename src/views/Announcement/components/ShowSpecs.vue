<template>
  <div>
    <section-heading icon="mdi-file-document" icon-color="primary">
      <template #title>{{ $t("announcement.description") }}</template>
    </section-heading>

    <v-card
      :elevation="loading > 0 ? 0 : 1"
      class="o-announ-specs mt-2"
      :class="{ '--show-more': showMore }"
    >
      <v-container>
        <div v-if="loading">
          <v-row v-for="x in 4" :key="x" no-gutters>
            <v-col cols="4">
              <v-skeleton-loader type="list-item"></v-skeleton-loader>
            </v-col>
            <v-col cols="8">
              <v-skeleton-loader type="list-item"></v-skeleton-loader>
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </div>
        <template v-else>
          <v-row dense>
            <v-col sm="3" cols="5" class="spec-name">
              {{ $t("announcement.id") }}
            </v-col>
            <v-col cols="7" sm="9">
              {{ announcement.id }}
            </v-col>
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <template v-if="announcement.createdAt">
              <v-col sm="3" cols="5" class="spec-name">
                {{ $t("announcement.date") }}
              </v-col>
              <v-col cols="7" sm="9">
                {{ formatDateTime(announcement.createdAt) }}
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
            </template>
            <template
              v-if="
                (announcement.viewCount && announcement.showAnalytics) ||
                (announcement.viewCount && showToOwner)
              "
            >
              <v-col sm="3" cols="5" class="spec-name">
                {{ $t("announcement.viewsCount") }}
              </v-col>
              <v-col cols="7" sm="9">
                {{ announcement.viewCount }}
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
            </template>

            <template v-if="announcement.reference">
              <v-col sm="3" cols="5" class="spec-name">
                {{ $t("_.ref") }}
              </v-col>
              <v-col cols="7" sm="9">
                {{ announcement.reference }}
              </v-col>
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
            </template>
          </v-row>
        </template>
        <template v-if="!loading && specs.length > 0">
          <v-row v-for="(item, index) in specs" :key="item.id" dense>
            <v-col
              :cols="isTravel && item.composed ? 12 : 5"
              sm="3"
              class="spec-name"
            >
              {{ isTravel ? item.label : item.specification.label }}
            </v-col>
            <v-col :cols="isTravel && item.composed ? 12 : 7" sm="9">
              <template v-if="isTravel && item.composed">
                <show-specs-travel-destination
                  :label="item.label"
                  :specs="item.items"
                ></show-specs-travel-destination>
              </template>
              <template v-else>
                <show-specs-values :item="item"></show-specs-values>
              </template>
            </v-col>
            <v-col v-if="index + 1 < specs.length" cols="12">
              <v-divider></v-divider>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-card>
    <v-card
      v-if="!loading && description.length > 0"
      class="o-announ-specs mt-2"
      elevation="1"
      :class="{ '--show-more': showMore }"
    >
      <v-container>
        <div
          ref="description"
          class="__description mb-2"
          :class="{ '--collapsed': trim && !showMore }"
        >
          <span class="text-subtitle-1 text-primary mt-1">
            {{ $t("_.description") }}
          </span>
          <div
            :class="isArabicChars(description) ? 'align-right' : 'align-left'"
          >
            {{ description }}
          </div>
        </div>
      </v-container>
      <template v-if="trim">
        <v-btn
          v-if="!showMore"
          :aria-label="$t('_.showMore')"
          variant="text"
          block
          @click="showMore = true"
        >
          {{ $t("_.showMore") }}
          <v-icon end>mdi-chevron-down</v-icon>
        </v-btn>
      </template>
    </v-card>
  </div>
</template>

<script>
import { useAuthFrame } from "@ouedkniss/web-ui-plugin/src/composables/useAuthFrame";
import each from "lodash/each";
import filter from "lodash/filter";
import sortBy from "lodash/sortBy";
import trim from "lodash/trim";
import map from "lodash/map";
import keyBy from "lodash/keyBy";
import isEmpty from "lodash/isEmpty";
import SectionHeading from "@/components/Content/SectionHeading.vue";
import { defineAsyncComponent } from "vue";
import { get } from "lodash";
export default {
  components: {
    ShowSpecsTravelDestination: defineAsyncComponent(() =>
      import("./ShowSpecsTravelDestination.vue")
    ),
    ShowSpecsValues: defineAsyncComponent(() => import("./ShowSpecsValues")),
    SectionHeading
  },

  setup() {
    const { user, scope } = useAuthFrame();

    return {
      user,
      scope
    };
  },

  props: {
    announcement: {
      type: Object,
      required: true
    },
    loading: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      showMore: false,
      trim: false
    };
  },

  computed: {
    specs() {
      if (this.isTravel) {
        const specsrows = [];

        each(this.announcement.specs, v => {
          if (v.value == "periode-99") return;

          if (v.specification.codename === "return_date") return;

          if (v.specification.codename.match(/_\d$/)) return;

          specsrows.push({
            valueText: v.valueText,
            codename: v.specification.codename,
            label: v.specification.label,
            items: [{ value: v.value[0], valueText: v.valueText[0] }]
          });
        });

        for (let i = 1; i < 6; i++) {
          const travelSpecs = filter(this.announcement.specs, cs =>
            cs.specification.codename.endsWith("_" + i)
          );
          specsrows.push({
            codename: "destination_" + i,
            label: "Destination " + i,
            composed: true,
            items: keyBy(
              map(travelSpecs, p => ({
                codename: p.specification.codename,
                label: p.specification.label,
                value: p.value[0],
                valueText: p.valueText[0]
              })),
              "codename"
            )
          });
        }

        const returnDateSpec = filter(
          this.announcement.specs,
          cs => cs.specification.codename === "return_date"
        );

        if (!returnDateSpec || returnDateSpec.length === 0)
          return filter(specsrows, s => !isEmpty(s.items));

        specsrows.push({
          codename: returnDateSpec[0].specification.codename,
          label: returnDateSpec[0].specification.label,
          items: [
            {
              value: returnDateSpec[0].value[0],
              valueText: returnDateSpec[0].valueText[0]
            }
          ],
          valueText: [returnDateSpec[0].valueText[0]]
        });
        return filter(specsrows, s => !isEmpty(s.items));
      } else {
        const orderedSpecs = sortBy(
          this.announcement.specs,
          s => s.specification.type
        ).reverse();
        return orderedSpecs.filter(s => s.valueText.length);
      }
    },

    description() {
      return trim(this.announcement.description);
    },
    isTravel() {
      return get(this.announcement, "category.slug", "").startsWith("voyages");
    },
    showToOwner() {
      return (
        this.user && this.user.id == get(this.announcement, "user.id", null)
      );
    }
  },

  mounted() {
    if (this.$refs.description) {
      this.trim = this.$refs.description.clientHeight > 300;
    }
  },
  methods: {
    isArabicChars(description) {
      var letters = /[\u0600-\u06FF]/;
      return letters.test(description);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/scss/responsive.scss";

.o-announ-specs {
  &:empty {
    display: none;
  }

  &.--show-more {
    .__description {
      max-height: 6000px;
    }
  }

  .__description {
    position: relative;
    transition: max-height 400ms ease-in-out;
    overflow: hidden;

    > div {
      white-space: pre-line;
      font-size: 1rem;
    }

    &.--collapsed {
      max-height: 300px;
    }
  }
}
.align-right {
  text-align: right;
}

.align.left {
  text-align: left;
}
.v-theme--light {
  .o-announ-specs .spec-name {
    color: #666;
  }
  .o-announ-specs .v-divider {
    border-color: rgba(0, 0, 0, 0.5) !important;
  }
}
.v-theme--dark {
  .o-announ-specs .spec-name {
    color: #fff;
  }
  .o-announ-specs .v-divider {
    border-color: #666;
  }
}
</style>
