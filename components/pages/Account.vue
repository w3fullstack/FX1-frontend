<template lang="pug">
.xp-account
  XOTabs
</template>

<script>
import XOTabs from '~/components/organisms/Account/Tabs'

export default {
  name: 'XPAccount',
  components: {
    XOTabs
  }
}
</script>

<style lang="scss" scoped>
.xp-account::v-deep {
  display: flex;
  flex-grow: 1;
  background-color: #08252c;
}
</style>
    