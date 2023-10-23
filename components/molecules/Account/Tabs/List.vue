<template lang="pug">
.xm-account-tabs-list(v-show="isShowList")
  ul
    li(v-for="route in routes", :key="route.name")
      router-link(:to="route.path") {{ route.name }}
  .divider
  ul
    li
      router-link(to="/terms-conditions") Terms & Conditions
    li
      router-link(to="/privacy") Privacy Policy
    li
      router-link(to="/contact") Contact Us
  .divider
  .logout(@click.prevent="fnLogOut()")
    p Log out
    img(src="~assets/images/Auth/logout-icon.svg")
</template>

<script>
import { mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'XMAccountTabsList',
	props: {
    getRouterName: {
			type: Function,
			default: null 
		},
  },
  computed: {
    isShowList() {
      return this.$route.path === '/account'
    },
    routes() {
      const routes = cloneDeep(this.$router.options.routes)
      return routes
        .find((r) => r.name === 'account')
        .children.map((r) => {
          r.path = `/account/${r.path}`
          r.name = this.getRouterName(r.name) || r.name
          return r
        })
        .reverse()
    },
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
.xm-account-tabs-list::v-deep {
	position: sticky;
  width: 100%;
	height: fit-content;
  max-width: 244px;
	top: 60px;
  padding: 40px 28px;
  @include min-width(769px) {
    display: block !important;
  }
  @include max-width(768px) {
    max-width: unset;
		padding: 24px 0;
  }
  .divider {
    width: 100%;
    height: 1px;
    background-color: $tertiary;
    margin: 32px 0;
		@include max-width(768px) {
			margin: 24px 20px;
		}
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 20px;

    li {
      a {
        display: inline-block;
        width: 100%;
        padding: 12px 20px;
        color: #ffffff;
        &.active {
          background-color: $tertiary;
          border-radius: 2px;
        }
      }
    }
  }
  .logout {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 0 20px;
    cursor: pointer;
    p {
      color: $primary;
      font-size: 16px;
    }
  }
}
</style>
