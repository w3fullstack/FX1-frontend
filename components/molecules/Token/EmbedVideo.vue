<template lang="pug">
.wistia_responsive_padding(:class="{ whitepaper: isWhitepaper }")
  .wistia_responsive_wrapper
    .wistia_embed(:class="`wistia_async_${videoId} videoFoam=true autoPlay=muted`")
      .wistia_swatch
</template>
<script>
const VIDEO_ID = 'gbiajubmvv'

export default {
  props: {
    isWhitepaper: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      videoId: VIDEO_ID,
    }
  },
  mounted() {
    const recaptchaScript = document.createElement('script')
    recaptchaScript.setAttribute('src', `https://fast.wistia.com/embed/medias/${this.videoId}.jsonp`)
    recaptchaScript.setAttribute('src', 'https://fast.wistia.com/assets/external/E-v1.js')
    document.head.appendChild(recaptchaScript)
  },
}
</script>

<style lang="scss" scoped>
.wistia_responsive_padding {
  position: relative;
  padding: 56.25% 0 0 0;

  &.whitepaper {
    border: 1px solid #385960;
    border-radius: 5px;
    box-shadow: 0 25px 77px -10px rgba(255, 255, 255, 0.2);

    .wistia_responsive_wrapper {
      width: 99.9%;
      margin: 1px;
    }
  }

  .wistia_responsive_wrapper {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;

    .wistia_embed {
      position: relative;
      height: 100%;
      width: 100%;

      .wistia_swatch {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        overflow: hidden;
        opacity: 0;
        transition: opacity 200ms;
      }
    }
  }
}
</style>