<template lang="pug">
.gifs(:style="isFullScreen && windowWidth < 427 ? styles : null")
  input.gifs-search(
    :value="search",
    type="text",
    placeholder="Search",
    @input="$emit('updateSearch', $event.target.value)"
  )
  .gifs-container(
    @scroll="handleGifsContainerScroll",
    ref="gifsContainerRef",
    :class="{ toggle: isFullScreen }"
  )
    .gifs-item(
      v-for="(item, index) in imagesToRender",
      :key="item.id + index",
      @click="handleClick(item)"
    )
      img(:src="item.images.fixed_height_small.webp", alt="gif")
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'GifsComponent',

  props: {
    search: {
      type: String,
      required: true,
    },
    fullScreen: { type: Boolean, default: false },
    styles: {
      type: Object,
      default: () => ({
        height: 'calc(100vh - 240px) !important',
      }),
    },
    activeNav: {
      type: String,
      required: true,
    },
    gifsToRender: {
      type: Array,
      required: true,
    },
    handleScroll: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      isFullScreen: false,
      windowWidth: null,
    }
  },
  computed: {
    ...mapGetters({
      recentGifs: 'chats/getRecentGifs',
      recentStickers: 'chats/getRecentStickers',
    }),
    recentImages() {
      switch (this.activeNav) {
        case 'GIF':
          return this.recentGifs
        case 'Sticker':
          return this.recentStickers
        default:
          return []
      }
    },
    imagesToRender() {
      if (this.search) {
        return this.gifsToRender
      }
      return [
        ...this.recentImages,
        ...this.gifsToRender.filter(
          (item) => !this.recentImages.some((ri) => ri.id === item.id)
        ),
      ]
    },
  },
  watch: {
    fullScreen: {
      deep: true,
      handler(value) {
        this.isFullScreen = value
      },
    },
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    ...mapActions({
      setRecentGifs: 'chats/setRecentGifs',
      setRecentStickers: 'chats/setRecentStickers',
    }),
    ...mapMutations('giphy', ['setSelectedGif']),
    handleGifsContainerScroll(e) {
      this.$emit('handleScroll', e)
    },
    handleClick(item) {
      this.setSelectedGif(item.images.fixed_height.webp)
      if (this.activeNav === 'GIF') this.setRecentGifs(item)
      else if (this.activeNav === 'Sticker') this.setRecentStickers(item)
    },
    onResize() {
      this.windowWidth = window.innerWidth
    },
  },
}
</script>

<style lang="scss">
.gifs {
  width: 100%;
  height: 100%;
  position: relative;

  @media screen and (min-width: 1400px) {
    height: 100% !important;
  }

  @media screen and (max-width: 767px) {
    height: 100% !important;
  }

  &-search {
    min-height: 36px !important;
    border: 1px solid #2a4e55;
    border-radius: 4px;
    width: 90%;
    margin: 21px;
    background-color: #0c353e;
    color: #94a6aa;
    font-weight: 400;
    font-size: 14px;
    line-height: 15px;
    padding: 0 8px;

    @media (min-width: 500px) and (max-width: 767px) {
      width: 94%;
    }
    @media (min-width: 375px) and (max-width: 500px) {
      width: 92%;
    }
  }

  &-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: 0 18px;
    height: 200px;

    overflow-y: scroll;
    @media screen and (max-width: 1400px) {
      height: 200px !important;
      width: 92%;
    }
    @media screen and (max-width: 767px) {
      height: 272px !important;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &::-webkit-scrollbar-track {
      display: none;
    }

    &::-webkit-scrollbar-thumb {
      display: none;
    }
  }

  .toggle {
    @media screen and (max-width: 500px) {
      height: 400px !important;
    }
  }

  &-item {
    & img {
      padding: 0 3px;
      width: 100px;
      height: 100px;
      object-fit: cover;
      cursor: pointer;
    }
  }
}
</style>
