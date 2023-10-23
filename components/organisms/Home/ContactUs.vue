<template lang="pug">
.xo-home-contact-us
  .text-contents
    h3 Want to see your sport on FX1?
    p Are you a fan of a sport that you would like to see on FX1? Awesome! Simply get in touch and let us know what you would like to see.
    b-button(
      type="is-primary",
      tag="router-link",
      to="/contact"
    ) Contact Us
</template>

<script>
export default {
  name: 'XOHomeContactUs'
}
</script>

<style lang="scss" scoped>
.xo-home-contact-us::v-deep {
  background-color: #2a4e55;
  width: 100%;
  padding: 40px;
  display: flex;
  justify-content: center;

  @include max-width(767px) {
    padding: 50px 30px 30px;
  }

  ._icon {
    opacity: 0.2;
  }

  .text-contents {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 28px;
    max-width: 840px;

    h3 {
      font-size: 44px;
      line-height: 1.82;
      letter-spacing: -2.1px;

      // @include max-width(1023px) {
      //   font-size: 1.5714rem;
      //   line-height: 2.4286rem;
      // }
    }

    p {
      font-size: 18px;
      line-height: 1.56;
      letter-spacing: -0.28px;
      text-align: center;

      a {
        color: rgba($white, 0.8);
      }

      .contact-us {
        color: $primary !important;
      }
    }
  }

  .button {
    font-size: 14px;
    line-height: 1.29;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    border-radius: 5px;

    padding: 30px 70px;

    @include max-width(1023px) {
      padding: 24px 36px;
    }

    @include max-width(374px) {
      padding: 16px 36px;
      font-size: 16px;
      line-height: 1.125;
    }
  }
}
</style>
