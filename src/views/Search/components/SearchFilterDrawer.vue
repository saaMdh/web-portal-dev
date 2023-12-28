<template>
  <div
    ref="filterDrawer"
    v-intersect="onIntersect"
    class="o-filter-drawer"
    :style="$vuetify.locale.rtl ? 'text-align:left' : 'text-align:right'"
  >
    <Teleport to="#insider-drawer">
      <ok-drawer
        v-model="active"
        class="o-filter-drawer__drawer"
        :width="
          $r({
            xl: '350px',
            lg: '350px',
            md: '350px',
            sm: '350px',
            xs: '90%'
          })
        "
        location="start"
        block-page-scroll
        :z-index="2000"
      >
        <search-filters
          ref="filters"
          :category="category"
          :filter="filter"
          @submit="v => submit(v)"
          @regions="v => $emit('regions', v)"
          @cities="v => $emit('cities', v)"
          @close="active = false"
        ></search-filters>
      </ok-drawer>
    </Teleport>
    <v-btn
      v-if="!active && isVisible"
      :aria-label="$t('search.filter.filterTooltip')"
      style="position: fixed"
      :style="{
        'margin-left': $vuetify.locale.rtl ? '0' : '-54px',
        'margin-right': $vuetify.locale.rtl ? '-54px' : '0',
        bottom: $isDesktop ? '5px' : '64px',
        'z-index': 200
      }"
      icon
      size="large"
      class="__trigger"
      color="primary"
      @click="showFilter()"
    >
      <v-icon class="__trigger_icone">mdi-tune</v-icon>
      <span class="filter-text">{{ $t("search.filter.icon") }}</span>
      <span
        v-if="!isClicked"
        class="__trigger_span"
        :class="{
          __trigger_span_left: $vuetify.locale.rtl,
          __trigger_span_right: !$vuetify.locale.rtl
        }"
        color="primary"
      >
        {{ $t("search.filter.filterTooltip") }}</span
      >
    </v-btn>
  </div>
</template>

<script>
import SearchFilters from "./SearchFilters.vue";
import { useStorage } from "@vueuse/core";
import hotkeys from "hotkeys-js";
import okDrawer from "@/components/uiKit/drawer";
export default {
  components: { okDrawer, SearchFilters },
  inject: ["activeSearchFilter"],

  props: {
    category: {
      type: Object,
      required: true
    },
    filter: {
      type: Object,
      required: true
    },
    loading: {
      type: Number,
      default: 0
    },
    openfilter: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      active: false,
      isVisible: false,
      isClicked: false
    };
  },
  watch: {
    openfilter(bool) {
      this.active = bool;
    },
    active(bool) {
      if (bool == false) this.$emit("close", bool);
      this.activeSearchFilter.value = bool;
    },
    activeSearchFilter: {
      handler(bool) {
        this.active = bool.value;
      },
      deep: true
    }
  },
  mounted() {
    hotkeys("esc", this.close);
    this.isClicked = useStorage("_Fic", false);
  },
  beforeUnmount() {
    hotkeys.unbind("esc", this.close);
  },
  deactivated() {
    this.close();
  },
  methods: {
    showFilter() {
      this.active = true;
      this.isClicked = true;
    },
    onIntersect(entries, observer, isIntersecting) {
      if (
        !isIntersecting.trackVisibility &&
        this.$refs.filterDrawer.getBoundingClientRect().top <= 0
      )
        this.isVisible = true;
      else this.isVisible = false;
    },
    submit(v) {
      this.active = false;
      this.$emit("submit", v);
    },
    close() {
      this.active = false;
    }
  }
};
</script>

<style lang="scss">
.o-filter-drawer {
  .v-btn__content {
    display: flex;
    flex-direction: column;
  }
  .__trigger {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
  .filter-text {
    font-size: 12px;
    text-transform: initial;
    margin-top: -4px;
  }
  .v-text-field--outlined,
  .v-text-field--solo {
    border-radius: 0;
  }

  .__trigger_span {
    position: absolute;
    padding: 0.1rem 1rem;
    font-size: 0.8rem;
    white-space: nowrap;
    text-transform: capitalize;
    color: #fff;
    border-radius: 15px;
    background-color: rgb(var(--v-theme-primary));
    pointer-events: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    transition: all 0.2s ease-in-out;
  }
  .__trigger_span_left {
    margin-left: 10px;
    left: 100%;
    animation: __trigger_icone_move_left 1s infinite;
  }
  .__trigger_span_right {
    right: 100%;
    margin-right: 10px;
    animation: __trigger_icone_move_right 1s infinite;
  }
  .__trigger_span_left::after {
    content: "";
    position: absolute;
    top: 35%;
    right: 100%;
    transform: rotateZ(90deg);
    border-width: 5px;
    border-style: solid;
    border-color: rgb(var(--v-theme-primary)) transparent transparent
      transparent;
  }
  .__trigger_span_right::after {
    content: "";
    position: absolute;
    top: 35%;
    left: 100%;
    transform: rotateZ(-90deg);
    border-width: 5px;
    border-style: solid;
    border-color: rgb(var(--v-theme-primary)) transparent transparent
      transparent;
  }

  @keyframes __trigger_icone_move_right {
    0% {
      margin-right: 20px;
    }
    50% {
      margin-right: 10px;
    }
    100% {
      margin-right: 20px;
    }
  }
  @keyframes __trigger_icone_move_left {
    0% {
      margin-left: 20px;
    }
    50% {
      margin-left: 10px;
    }
    100% {
      margin-left: 20px;
    }
  }
}
</style>
