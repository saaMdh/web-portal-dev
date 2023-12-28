<template>
  <div class="o-section-heading">
    <div class="d-flex align-center">
      <v-avatar style="width:30px;min-width:30px">
        <slot name="icon">
          <category-img v-if="category" size="28" :category="category" />
          <v-icon v-else size="28" :color="iconColor">{{ icon }}</v-icon>
        </slot>
      </v-avatar>
      <div
        class="px-2"
        :class="$vuetify.locale.rtl ? 'text-right' : 'text-left'"
      >
        <component :is="tag"><slot name="title"></slot></component>
      </div>
      <template v-if="showMore || category">
        <v-spacer></v-spacer>
        <v-btn
          :aria-label="$t('home.feed.showMore')"
          depressed
          size="small"
          class="px-1"
          color="primary"
          variant="outlined"
          :to="
            category
              ? {
                  name: 'search_category',
                  params: { category: category.slug, page: 1 }
                }
              : {
                  name: showMore.name,
                  params: showMore.params
                }
          "
        >
          {{ $t("home.feed.showMore") }}
        </v-btn>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: "mdi-information"
    },
    iconColor: {
      type: String,
      default: null
    },
    tag: {
      type: String,
      default: "h2"
    },
    showMore: {
      type: Object,
      default: null
    },
    category: {
      type: Object,
      default: null
    }
  }
};
</script>

<style lang="scss">
@import "~@/scss/responsive.scss";
.o-section-heading {
  align-items: center;
  @include isMobile {
    h1 {
      font-size: 1.2rem;
      font-weight: 300;
      line-height: 1;
    }
    h2 {
      font-size: 1.2rem;
      font-weight: 350;
      line-height: 1;
      letter-spacing: -0.8px;
    }

    h3 {
      font-size: 0.9rem;
      font-weight: 400;
    }
  }

  @include isDesktop {
    h1 {
      font-size: 1.3rem;
      font-weight: 300;
      line-height: 1;
    }

    h2 {
      font-size: 1.2rem;
      font-weight: 350;
      line-height: 1;
    }

    h3 {
      font-size: 1rem;
      font-weight: 400;
    }
  }
}
</style>
