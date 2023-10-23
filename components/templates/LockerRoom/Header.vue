<template lang="pug">
.xt-locker-room-header.row(:class="{ 'scroll-header': isScrollHeader }")
  XMLockerRoomHeaderLeft
  XMLockerRoomHeaderCenter
  .right-header
    client-only: XMLockerRoomHeaderRight
</template>

<script>
import XMLockerRoomHeaderLeft from '~/components/molecules/LockerRoom/Header/Left.vue'
import XMLockerRoomHeaderCenter from '~/components/molecules/LockerRoom/Header/Center.vue'
import XMLockerRoomHeaderRight from '~/components/molecules/LockerRoom/Header/Right.vue'

export default {
  name: 'XTLockerRoomHeader',
  components: {
    XMLockerRoomHeaderLeft,
    XMLockerRoomHeaderCenter,
    XMLockerRoomHeaderRight,
  },
  data() {
    return {
      isScrollHeader: false,
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      // Get the Y-scroll position of the window
      const scrollTop = window.scrollY
      this.isScrollHeader = scrollTop > 100
    },
  },
}
</script>

<style lang="scss" scoped>
.xt-locker-room-header::v-deep {
  background-color: $secondary_b;
  height: 0;
  position: sticky;
  top: 0;
  left: 0;
  padding: 0 48px;
  z-index: 111;
  justify-content: space-between;
  &.scroll-header {
    background-color: $secondary_b;
    min-height: 80px;
  }
  @media screen and (max-width: 1439px) {
    padding: 0 20px;
  }
}

// .right-header {
//   margin-left: auto;
// }
</style>
