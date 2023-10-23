<template lang="pug">
picker(
  :data="emojiIndex",
  :showCategories="false",
  :showPreview="false",
  @select="onEmojiSelect",
  :pickerStyles="isFullScreen && windowWidth < 427 ? pickerStyles : null"
)
</template>

<script>
import data from 'emoji-mart-vue-fast/data/all.json'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import 'emoji-mart-vue-fast/css/emoji-mart.css'

const emojiIndex = new EmojiIndex(data)

export default {
  name: 'EmojiPicker',
  components: {
    Picker,
  },
  props: {
    pickerStyles: {
      type: Object,
      default: () => ({
        height: 'calc(100vh - 240px) !important',
      }),
    },
    fullScreen: { type: Boolean, default: false },
  },
  data() {
    return {
      emojiIndex,
      isFullScreen: false,
      windowWidth: null,
    }
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
    onEmojiSelect(emoji) {
      this.$emit('updateMessage', emoji.native)
    },
    onResize() {
      this.windowWidth = window.innerWidth
    },
  },
}
</script>

<style lang="scss" scoped>
.emoji-mart {
  background-color: transparent !important;
  width: 100% !important;
  height: 350px !important;
  border: none !important;

  &::v-deep {
    .emoji-mart-category {
      &-label {
        display: none;
      }
    }
  }
}
</style>
