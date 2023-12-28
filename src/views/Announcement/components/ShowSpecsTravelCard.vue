<template>
  <v-card
    class="o-announ-specs-travel-card rounded-lg elevation-1"
    :class="{ '--show-more': showMore }"
  >
    <template v-if="specs.length > 0">
      <v-simple-table dense class="__specs">
        <tbody>
          <tr v-if="announcement.reference">
            <td class="__key">
              {{ $t("_.ref") }}
            </td>
            <td class="__value">
              <v-chip size="small" color="primary ">
                {{ announcement.reference }}
              </v-chip>
            </td>
          </tr>
          <tr v-for="(spec, index) in specs" :key="index">
            <th class="__key">
              {{ spec.label }}
            </th>
            <td class="__value ">
              <template v-if="spec.composed">
                <show-specs-travel-destination
                  :label="spec.label"
                  :specs="spec.items"
                ></show-specs-travel-destination>
              </template>
              <template v-else>
                <v-chip
                  v-for="(v, i) in spec.items"
                  :key="i"
                  size="small"
                  color="primary"
                >
                  {{ v.valueText }}
                </v-chip>
              </template>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </template>

    <template v-if="description.length > 0">
      <div
        ref="description"
        class="__description pa-4"
        :class="{ '--collapsed': trim && !showMore }"
      >
        <h1
          class="text-subtitle-1 font-weight-bold  text-primary-darken-1 mt-1"
        >
          {{ $t("_.description") }}
        </h1>
        <div>{{ description }}</div>
      </div>
    </template>

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

      <v-btn
        v-else
        :aria-label="$t('_.showLess')"
        variant="text"
        block
        @click="showMore = false"
      >
        {{ $t("_.showLess") }}
        <v-icon end>mdi-chevron-up</v-icon>
      </v-btn>
    </template>
  </v-card>
</template>

<script>
import each from "lodash/each";
import filter from "lodash/filter";
import trim from "lodash/trim";
import map from "lodash/map";
import keyBy from "lodash/keyBy";
import isEmpty from "lodash/isEmpty";
import ShowSpecsTravelDestination from "./ShowSpecsTravelDestination.vue";
export default {
  components: { ShowSpecsTravelDestination },

  props: {
    announcement: {
      type: Object,
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
      const specsrows = [];

      each(this.announcement.specs, v => {
        if (v.value == "periode-99") return;

        if (v.specification.codename === "return_date") return;

        if (v.specification.codename.match(/_\d$/)) return;

        specsrows.push({
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
        ]
      });

      return filter(specsrows, s => !isEmpty(s.items));
    },

    description() {
      return trim(this.announcement.description);
    }
  },

  mounted() {
    if (this.$refs.description) {
      this.trim = this.$refs.description.clientHeight > 300;
    }
  }
};
</script>

<style lang="scss">
@import "@/scss/responsive.scss";

.o-announ-specs-travel-card {
  &:empty {
    display: none;
  }

  &.--show-more {
    .__description {
      max-height: 1000px;
    }
  }

  .__specs {
    .__key {
      font-size: 1rem;
      font-weight: 300;
      width: 40%;

      @include isDesktop {
        width: 25%;
      }
    }
    .__value {
      display: flex;
      flex-wrap: wrap;
      gap: 4px * 2;
      align-items: center;
      height: auto;
      padding: 8px 0;

      .v-chip {
        font-size: 0.8rem;
      }
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
      &::after {
        .v-theme--dark & {
          background: linear-gradient(to top, #1e1e1e, transparent);
        }

        .v-theme--light & {
          background: linear-gradient(to top, white, transparent);
        }
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
    }
  }
}
</style>
