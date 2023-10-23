<template lang="pug">
  .faqbox(@click.prevent="expand()")
    .row
      .col-L.text-left
        p.token-p3 {{option.title}}
      .col-R.text-right
        img(
          src="~assets/images/Token/arrow-up.svg"
          alt="Close"
          v-if="isOpened"
        )
        img(
          src="~assets/images/Token/arrow-right.svg"
          alt="Open"
          v-if="!isOpened"
        )
      .row(v-if="isOpened")
        p.token-p.inner-text.text-left {{option.description}}
</template>

<script>
export default {
  name: 'FAQOption',
  props: {
    option: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      isOpened: false
    }
  },
  methods: {
    expand() {
      this.isOpened = !this.isOpened
    },
  }
}
</script>
<style lang="scss" scoped>
.faqbox {
  background-color: $secondary-dark;
  border-radius: 8px;
  border: 1px solid #557278;
  padding: 20px;
  cursor: pointer;

  .inner-text {
    border-top: 1px solid #557278;
    padding-top: 23px;
    margin-top: 12px;
  }

  img {
    padding-top: 4px;
  }

  > .row {
    width: 100%;
  }

  .col-L {
    max-width: 85%;
    min-width: 0;
    width: auto;
    flex: 10000 1 0%;
  }

  .col-R {
    max-width: 15%;
    min-width: 0;
    width: auto;
    flex: 10000 1 0%;
  }
}
</style>
