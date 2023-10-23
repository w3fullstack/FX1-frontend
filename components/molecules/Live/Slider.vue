<template lang="pug">
.xm-live-slider
  .row.justify-between
    .xm-live-slider-header
      .slider-title {{ name }}
    .actions.row(:class="`slider-${name}`")
      .btn-action.btn-prev.row.items-center.justify-center(
        @click.prevent="fnPreviousSlide()"
      ): img(
        :src="require('~/assets/images/slider/arrow-left.svg')"
      )
      .btn-action.btn-next.row.items-center.justify-center(
        @click.prevent="fnNextSlide()"
      ): img(
        :src="require('~/assets/images/slider/arrow-right.svg')"
      )
  hooper(
    v-if="showSlider",
    :settings="hooperSettings",
    style="height: auto; width: 100%",
    ref="slider"
  )
    slide(v-for="(slide, index) in slides", :key="index")
      XALiveEvent(
        :slide="slide",
        :upcoming="upcoming",
        @setUnsetReminder="slide.isReminded = !slide.isReminded"
      )
  .gradient-bg
</template>

<script>
import debounce from 'lodash/debounce'
import { Hooper, Slide } from 'hooper'
import 'hooper/dist/hooper.css'
import XALiveEvent from '~/components/atoms/Live/Event.vue'

export default {
  name: 'XMLiveSlider',
  components: {
    Hooper,
    Slide,
    XALiveEvent,
  },
  props: {
    name: { type: String, default: '-' },
    slides: { type: Array, default: () => [] },
    upcoming: { type: Boolean, default: () => false },
    nextId: { type: String, default: null },
    childStatus: { type: String, default: null },
  },
  data: () => {
    return {
      apiCallDataCount: 10,
      slideTracker: 0,
      countedSlides: 2,
      infiniteScroll: false,
      showButtons: true,
      showSlider: true,
      timeout: null,
      timer: null,
      itemsToSlide: 1,
    }
  },
  computed: {
    hooperSettings() {
      const hooperSettings = {
        trimWhiteSpace: true,
        wheelControl: false,
        itemsToShow: this.countedSlides,
        infiniteScroll: false,
        mouseDrag: false,
        itemsToSlide: this.itemsToSlide,
        breakpoints: {
          0: {
            mouseDrag: true,
          },
        },
      }
      return hooperSettings
    },
  },
  mounted() {
    this.calculateSlides()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    fnPreviousSlide() {
      if (this.$refs.slider?.currentSlide !== 0) {
        this.$refs.slider?.slidePrev()
      }
    },
    async fnNextSlide() {
      const currentSlide = Math.ceil(this.$refs.slider?.currentSlide + 1)

      if (currentSlide >= this.slides.length - currentSlide) {
        await this.$emit(
          'next-slider',
          this.childStatus,
          this.nextId,
          this.apiCallDataCount,
          false
        )

        this.$refs.slider?.slideTo(this.$refs.slider?.currentSlide + 1)
      } else {
        this.$refs.slider?.slideNext()
      }
    },
    calculateSlides() {
      const slideSize = window.innerWidth > 534 ? 254 + 24 : 164 + 16
      const sliderWidth = this.$refs.slider.$el?.clientWidth
      const slides = sliderWidth / slideSize
      this.countedSlides = slides
      this.showButtons = this.slides.length > slides
      this.showSlider = false
      this.$nextTick(() => {
        this.showSlider = true
      })
    },
    onResize: debounce(function () {
      this.calculateSlides()
    }, 100),
  },
}
</script>

<style lang="scss" scoped>
.xm-live-slider::v-deep {
  margin-right: -100px !important;
  margin-top: 12px;
  position: relative;
  .gradient-bg {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 445px;
    width: 130px;
    background: linear-gradient(270deg, #000 19.27%, rgba(0, 0, 0, 0) 100%);
  }

  @include max-width(1023px) {
    margin-top: 17px;
    margin-right: -40px !important;
  }
  @include max-width(767px) {
    margin-right: -30px !important;
  }
  @include max-width(420px) {
    margin-right: -20px !important;
  }

  .slider-title {
    margin-bottom: 20px;
    font-weight: 500;
    font-size: 18px;
    line-height: 20px;

    @include max-width(767px) {
      font-size: 16px;
      line-height: 18px;
    }
  }

  .xm-live-slider-header {
    min-height: 40px;
    width: auto !important;
  }

  .actions {
    margin-right: 135px;
    gap: 32px;
    @include max-width(534px) {
      margin-right: 0 !important;
    }

    .btn-action {
      height: 20px;
      border-radius: 50%;
      cursor: pointer;

      &.no-prev,
      &.no-next {
        background-color: transparent;
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    &.slider-1,
    &.slider-2,
    &.slider-3,
    &.slider-4 {
      display: none;
    }

    @include max-width(1440px) {
      &.slider-1,
      &.slider-2,
      &.slider-3 {
        display: none;
      }

      &.slider-4 {
        display: flex;
      }
    }

    @include max-width(1024px) {
      &.slider-1,
      &.slider-2 {
        display: none;
      }

      &.slider-3,
      &.slider-4 {
        display: flex;
      }
    }

    @include max-width(767px) {
      &.slider-1 {
        display: none;
      }

      &.slider-2,
      &.slider-3,
      &.slider-4 {
        display: flex;
      }
    }
  }

  .swiper-container {
    .swiper-wrapper {
      .swiper-slide {
        width: calc(100% / 3 - 30px);

        @include min-width(1441px) {
          width: calc(100% / 4 - 30px);
        }
      }
    }
  }

  .hooper {
    .hooper-list {
      .hooper-track {
        gap: 24px;
        .hooper-slide {
          width: 300px !important;
          @media screen and (max-width: 1439px) {
            width: 260px !important;
          }

          @media screen and (max-width: 534px) {
            .xa-live-slide {
              max-width: unset !important;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 800px) {
    .row {
      justify-content: flex-end;
      margin-right: 80px;
      .actions {
        margin: 0 !important;
        .btn-action {
          margin: 0;
        }
      }
    }
    .gradient-bg {
      right: -50px;
    }
  }

  @media screen and (max-width: 534px) {
    .row {
      margin-top: 20px;
      margin-right: 40px;
    }
    .gradient-bg {
      display: none;
    }
  }
}
</style>
