<template>
  <div class="o-filter-drawer">
    <v-navigation-drawer
      v-model="active"
      fixed
      temporary
      transition="slide-y-transition"
      width="80%"
      :location="$vuetify.locale.rtl ? 'end' : 'start'"
      :close-on-click="false"
      :close-on-content-click="false"
      disable-route-watcher
      touchless
      @keydown.esc="active = false"
    >
      <full-screen-frame :loading="loading" color="primary" dark>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>{{ $t("search.filter.title") }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="active = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-toolbar>

        <v-divider></v-divider>
        <search-filters
          ref="filters"
          :key="category.id"
          :category="category"
          :filter="filter"
          @dirty="v => (isDirty = v)"
          @submit="v => $emit('submit', v)"
        ></search-filters>
      </full-screen-frame>
    </v-navigation-drawer>

    <v-fab-transition>
      <v-btn
        v-if="!active"
        v-bind="fabBind"
        :end="!$vuetify.locale.rtl"
        :start="$vuetify.locale.rtl"
        class="__trigger"
        color="primary"
        @click="(active = true), (isClicked = true)"
      >
        <v-icon class="__trigger_icone" size="small">mdi-tune</v-icon>
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
    </v-fab-transition>
  </div>
</template>

<script>
import FullScreenFrame from "@ouedkniss/web-ui-plugin/src/components/Misc/FullScreenFrame.vue";
import SearchFilters from "@/views/SiteBuilder/EditorSheet/QueriesManagement/SearchFilters.vue";

import { useStorage } from "@vueuse/core";
export default {

  components: { SearchFilters, FullScreenFrame },
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
      isDirty: false,
      isClicked: false
    };
  },
  computed: {
    fabBind() {
      const vbind = {
        fab: true,
        bottom: true,
        fixed: true
      };

      if (this.isDirty)
        return {
          ...vbind,
          color: "secondary"
        };
      else
        return {
          ...vbind,
          color: "secondary"
        };
    }
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
    this.isClicked = useStorage("_Fic", false);
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
    bottom: 64px;
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
    font-size: 0.6rem;
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
    top: 30%;
    right: 98.5%;
    transform: rotateZ(90deg);
    border-width: 5px;
    border-style: solid;
    border-color: rgb(var(--v-theme-primary)) transparent transparent
      transparent;
  }
  .__trigger_span_right::after {
    content: "";
    position: absolute;
    top: 30%;
    left: 99%;
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

.v-navigation-drawer__content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #5d5d5d;
  background-color: #5d5d5d;
}
.v-navigation-drawer__content::-webkit-scrollbar {
  width: 0px;
}
.v-navigation-drawer__content::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #424242;
  background-color: #424242;
}
</style>
