<template lang="pug">
.xo-tabs
  XTAccountBreadcrumbs(:getRouterName="getRouterName")
  XMTabsList(:getRouterName="getRouterName")
  XMTabsContent
</template>

<script>
import XMTabsList from '~/components/molecules/Account/Tabs/List'
import XMTabsContent from '~/components/molecules/Account/Tabs/Content'
import XTAccountBreadcrumbs from '~/components/templates/Account/Breadcrumbs'

export default {
  name: 'XOAccountTabs',
  components: {
    XMTabsList,
    XMTabsContent,
    XTAccountBreadcrumbs,
  },
  methods: {
    getRouterName(name) {
      const names = {
        'account': 'My Account',
        'account-settings': 'Account Settings',
        'account-linked-accounts': 'Linked Accounts',
      }

      return names[name]
    },
  },
}
</script>

<style lang="scss" scoped>
.xo-tabs::v-deep {
  display: flex;
  width: 100%;
  @include max-width(768px) {
    flex-direction: column;
  }
}
</style>