<template lang="pug">
.xm-locker-room-header-right.row.items-center.justify-end(
  :class="isLoggedIn && 'is-logged-in'"
)
  template(v-if="isLoggedIn")
    .desktop-view.row.items-center
      //- XAMyLocation(v-if="$route.path !== '/error'")
      b-dropdown.user-menu(
        aria-role="list",
        position="is-bottom-left",
        append-to-body,
        :mobile-modal="false"
      )
        template(#trigger="{ active }")
          XAMyAvatar
        b-dropdown-item(aria-role="listitem")
          nuxt-link(to="/account/settings")
            .menu-section
              .link.marg-left My account
        b-dropdown-item(aria-role="listitem", @click="fnLogOut()")
          .menu-section
            img(src="~assets/images/Auth/logout-icon.svg")
            .logout.marg-left Log out

    .mobile-view
      .mobile-menu.row(@click.prevent="showMobileMenu = true")
        b-icon(icon="menu", custom-size="mdi-36px")
      XALoggedInMobileView(v-if="showMobileMenu")
  template(v-if="!isLoggedIn")
    .desktop-view.row.items-center
      //- XAMyLocation(v-if="$route.path !== '/error'")
      b-button.btn-signup(type="is-primary", tag="router-link", to="/signin") Sign In
      router-link.btn-signup-mobile(to="/signin"): img(
        src="~assets/images/v2/Home/signin-mobile.png"
      )

    .mobile-view
      .mobile-menu.row(@click.prevent="showMobileMenu = true")
        b-icon(icon="menu", custom-size="mdi-36px")
      XALoggedInMobileView(v-if="showMobileMenu")
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'XMLockerRoomHeaderRight',
  components: {
    XALockerRoomHeaderSearch: () =>
      import('~/components/atoms/LockerRoom/Header/Search'),
    XMLockerRoomHeaderNotifications: () =>
      import('~/components/molecules/LockerRoom/Header/Notifications'),
    // XAMyLocation: () =>
    //   import('~/components/atoms/MyLocation'),
    XAMyAvatar: () => import('~/components/atoms/MyAvatar'),
    XALoggedInMobileView: () =>
      import('~/components/molecules/LockerRoom/Header/LoggedInMobileView'),
  },
  data() {
    return {
      showMobileMenu: false,
    }
  },
  mounted() {
    // console.log("isLoggedIn: ", this.isLoggedIn);
    this.$root.$on('evtRtShowMobileMenu', (value) => {
      this.showMobileMenu = value
    })
  },
  methods: {
    ...mapActions({
      authLogOut: 'auth/authLogOut',
      clearAuthDetails: 'auth/clearAuthDetails',
    }),
    async fnLogOut() {
      this.$fireMess.unSubscribeToTopic({ topicName: this.userID })

      await this.authLogOut()
      const disconnect = this.$root.ChatSocket
        ? this.$root.ChatSocket.disconnect()
        : null

      await this.$router.push({
        path: '/',
      })

      await this.clearAuthDetails()
      this.$mixpanel.reset()

      return disconnect
    },
  },
}
</script>

<style lang="scss" scoped>
.menu-section {
  display: flex !important;
  align-items: center !important;
  .marg-left {
    margin-left: 10px;
  }
  .logout {
    color: $primary !important;
  }
  .link {
    color: $secondary !important;
  }
}
.xm-locker-room-header-right::v-deep {
  height: 100%;

  .desktop-view {
    // @include max-width(1023px) {
    //   display: none;
    // }

    .btn-signup {
      text-transform: uppercase;
      width: 106px;
      height: 42px;
      cursor: pointer;
      color: $white;
    }

    .btn-signup-mobile {
      display: none;
    }
  }

  .mobile-view {
    display: none;

    // @include max-width(1023px) {
    //   display: block;
    // }
  }
  @media screen and (max-width: 767px) {
    .desktop-view {
      .btn-signup {
        display: none;
      }
      .btn-signup-mobile {
        display: block;
        width: 44px;
        height: 44px;
      }
    }
  }
}
</style>
