<template>
  <div class="top-navigation">
      <SfHeader
        title="Shopware PWA"
        active-sidebar="activeSidebar"
      >
        <template #logo>
          <nuxt-link to="/" class="sf-header__logo">
            <SfImage src="/img/logo.svg" alt="Shopware PWA" class="sf-header__logo-image"/>
          </nuxt-link>
        </template>
        <template #navigation>
          <nuxt-link to="/"
            ><SfHeaderNavigationItem>Home</SfHeaderNavigationItem></nuxt-link
          >
          <nuxt-link
            v-for="element in navigationElements"
            :key="element.id"
            :to="convertToSlug(element.name)"
          >
            <SfHeaderNavigationItem>{{ element.name }}</SfHeaderNavigationItem>
          </nuxt-link>
        </template>

        <template #header-icons="{accountIcon, wishlistIcon, cartIcon}">
          <div class="sf-header__icons">
            <SfCircleIcon
              v-if="accountIcon"
              :icon="accountIcon"
              icon-size="20px"
              icon-color="black"
              class="sf-header__icon"
              role="button"
              aria-label="account"
              :aria-pressed="activeIcon === 'account' ? 'true' : 'false'"
              :has-badge="isLoggedIn"
              @click="userIconClick"
            />
            <SfCircleIcon
              v-if="wishlistIcon"
              :icon="wishlistIcon"
              icon-size="20px"
              icon-color="black"
              class="sf-header__icon"
              :class="{
                'sf-header__icon--is-active': activeIcon === 'wishlist'
              }"
              role="button"
              aria-label="wishlist"
              :aria-pressed="activeIcon === 'wishlist' ? 'true' : 'false'"
              @click="$emit('click:wishlist')"
            />

            <div
              class="top-navigation__header-icon header-icons__cart cart-icon"
            >
              <SfCircleIcon
                v-if="cartIcon"
                :icon="cartIcon"
                icon-size="20px"
                icon-color="black"
                class="sf-header__icon"
                :class="{ 'sf-header__icon--is-active': activeIcon === 'cart' }"
                role="button"
                aria-label="cart"
                :aria-pressed="activeIcon === 'cart' ? 'true' : 'false'"
                :has-badge="count > 0"
                @click="toggleCart"
              >
                <template #badge>
                  <SfBadge class="cart-icon__badge">{{ count }}</SfBadge>
                </template>
              </SfCircleIcon>
            </div>
           </div>
        </template>
      </SfHeader>
      <SwLoginModal :is-open="isModalOpen" @close="isModalOpen = false" />
  </div>
</template>

<script>
import slugify from 'slugify' // TODO: remove after the navigation is fully implemented
import { getNavigation, getPage } from '@shopware-pwa/shopware-6-client'
import { SfHeader, SfCircleIcon, SfBadge, SfImage } from '@storefront-ui/vue'
import { useUser, useCart, useCartSidebar } from '@shopware-pwa/composables'
import SwLoginModal from './modals/SwLoginModal'

export default {
  components: { SfHeader, SfCircleIcon, SfBadge, SwLoginModal, SfImage },
  setup() {
    const { isLoggedIn, logout } = useUser()
    const { count } = useCart()
    const { toggle, isOpen } = useCartSidebar()
    return {
      isOpen,
      count,
      toggleCart: toggle,
      isLoggedIn,
      logout
    }
  },
  data() {
    return {
      navigationElements: [],
      activeSidebar: 'account',
      activeIcon: '',
      isModalOpen: false
    }
  },
  async mounted() {
    const { children } = await getNavigation({ depth: 1 })
    this.navigationElements = children
  },
  methods: {
    convertToSlug(name) { // temporary workaround; won't be useful once the pretty urls are received within navigation endpoint
      return (
        '/' +
        slugify(name, {
          remove: /and|[*+~.,()'"!:@]/g
        }).toLowerCase() + '/'
      )
    },
    async userIconClick() {
      if (this.isLoggedIn) this.$router.push("/account")
      else this.isModalOpen = true
    }
  }
}
</script>

<style lang="scss">
@import '~@storefront-ui/vue/styles.scss';
@import '~@storefront-ui/shared/styles/helpers/visibility';

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

.top-navigation {
  .cart-icon {
    position: relative;
    display: flex;

    &__badge {
      position: absolute;
      bottom: 2.2em;
      left: 2.8em;
      font-size: 0.6em;
      padding: 0.3em 0;
      border-radius: 100%;
      width: 2.2em;
      min-height: 2.2em;
    }
  }
  .sf-header__logo-image {
    height: 100%;
  }

  .sf-image img {
    height: 100%;
  }

  .sf-search-bar {
    visibility: hidden;
  }
}

</style>
