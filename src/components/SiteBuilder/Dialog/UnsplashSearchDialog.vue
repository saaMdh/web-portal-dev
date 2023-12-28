<template>
  <v-dialog
    v-model="active"
    content-class="s-unsplash-search-dialog"
    max-width="600"
  >
    <v-card min-height="400">
      <v-toolbar>
        <v-text-field
          v-model="search"
          solo
          flat
          hide-details
          :loading="loading > 0"
          :label="$t('components.unsplashSearchDialog.search')"
          clearable
          class="mx-2"
          density="comfortable"
        ></v-text-field>

        <v-btn text @click="$emit('update:modelValue', false)">
          {{ $t("components.unsplashSearchDialog.end") }}
        </v-btn>
      </v-toolbar>

      <swiper
        v-if="pages.length > 0"
        v-slot="{ item }"
        :items="pages"
        :space-between="32"
        navigation
        pagination
      >
        <div class="__page">
          <v-card
            v-for="(image, index) in item"
            :key="index"
            hover
            @click="select(image)"
          >
            <v-img :src="image.thumb" :aspect-ratio="1">
              <div class="__thumb">
                <v-avatar
                  v-if="selection === image"
                  color="primary"
                  class="__selected"
                  size="32"
                >
                  <v-icon size="small"> mdi-check </v-icon>
                </v-avatar>

                <a
                  v-if="image.authorUrl"
                  :href="image.authorUrl"
                  class="__caption"
                  target="_blank"
                  @click.stop
                >
                  {{ image.author }}
                </a>
              </div>
            </v-img>
          </v-card>
        </div>
      </swiper>
    </v-card>
  </v-dialog>
</template>

<script>
import chunk from "lodash/chunk";
import gql from "graphql-tag";
import { defineAsyncComponent } from "vue";

export default {
  components: {
    Swiper: defineAsyncComponent(() =>
      import("@ouedkniss/web-ui-plugin/src/components/Swiper/Swiper.vue")
    )
  },

  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: 0,
      search: "",
      selection: null,
      thumbs: []
    };
  },

  apollo: {
    unsplashSearch: {
      loadingKey: "loading",
      debounce: 400,
      manual: true,
      query: gql`
        query ($q: String, $count: Int = 30) {
          unsplashSearch(q: $q, count: $count) {
            id
            thumb
            full
            createdAt
            updatedAt
            altDescription
            author
            authorUrl
          }
        }
      `,
      variables() {
        return {
          q: this.search
        };
      },
      skip() {
        return !this.search;
      },
      result({ data }) {
        this.thumbs = data.unsplashSearch;
      }
    }
  },

  computed: {
    pages() {
      return chunk(this.thumbs, 9);
    },

    active: {
      get() {
        return this.modelValue;
      },
      set(v) {
        this.$emit("update:modelValue", v);
      }
    }
  },

  methods: {
    select(item) {
      if (item.id) {
        this.trackDownload(item.id);
      }

      this.selection = item;

      this.$emit("select", item);
    },

    trackDownload(itemId) {
      this.$apollo.mutate({
        mutation: gql`
          mutation ($id: ID!) {
            unsplashTrackDownload(id: $id)
          }
        `,
        variables: {
          id: itemId
        }
      });
    }
  }
};
</script>

<style lang="scss">
.s-unsplash-search-dialog {
  .__page {
    display: grid;
    grid-template-columns: repeat(3, minmax(30%, 1fr));
    grid-gap: 16px;
    padding: 4px * 4;

    .v-card {
      line-height: 0;
    }

    .__thumb {
      display: flex;
      flex-direction: column;
      height: 100%;
      box-sizing: border-box;
      justify-content: flex-end;

      .__selected {
        position: absolute;
        right: 4px;
        top: 4px;
      }

      .__caption {
        background: rgba(black, 0.75);
        padding: 4px;
        color: white;
        font-size: 13px;
        text-transform: capitalize;
        text-decoration: none;
        line-height: 1;
      }
    }
  }
}
</style>
