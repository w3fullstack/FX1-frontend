<template lang="pug">
  #faq.token-faq-section.row
    .container.token-container.text-center
      h1 FAQ
      .top-margin-b
      .row.top-margin-a(v-for="(_, index) in Math.ceil(faqOptions.length / 2)")
        .col(:class="{'col-left': faqOptions[index * 2 + 1]}")
          FAQOption(:option="faqOptions[index * 2]")
        .col.col-right(v-if="faqOptions[index * 2 + 1]")
          FAQOption(:option="faqOptions[index * 2 + 1]")

      .top-margin-c

      .row.text-center
        .col
          .whatbox
            h1.token-h What are you waiting for?
            .top-margin-a
            .row
              .col.actions.text-right.btn-left
                a.button.is-primary(
                  href="https://app.uniswap.org/#/swap?outputCurrency=0x610C584F1275f0f7c982Af0aC7883Ff4Dba661Bd",
                  target="_blank"
                ) Buy $FX1
              .col.actions.text-left.btn-right
                a.button.is-primary(
                  href="https://www.dextools.io/app/en/ether/pair-explorer/0x87B958067FD665f3937de4439450B4950Eb68e15",
                  target="_blank"
                ) View Chart
      .top-margin-e
        span.address Contract Address:
          span 0x610C584F1275f0f7c982Af0aC7883Ff4Dba661Bd
</template>

<script>
import FAQOption from '~/components/atoms/Token/FAQOption.vue'

export default {
  name: 'FAQSection',
  components: {
    FAQOption
  },
  data() {
    return {
      faqOptions: [
        {
          title: "What is $FX1?",
          description: "FX1 is revolutionizing the way we watch, consume, and pay for live sports. By harnessing the power of Blockchain and A.I. technology, FX1 delivers an unparalleled and groundbreaking experience for consuming live sports like never before.",
        },
        {
          title: "Where I can buy $FX1?",
          description: "$FX1 will be available to trade on Uniswap, a leading decentralized exchange. See the section above for any help needed using Uniswap.",
        },

        {
          title: "What can I use $FX1 for?",
          description: "You’ll be able to use the token to purchase event room services, as well as build up your collection of NFT collectibles. Using $FX1 to purchase event room experiences will be available later in 2023 as we release those features to event rooms.",
        },
        {
          title: "Will you have staking available?",
          description: "No, traditional staking won’t be available however by holding our token you’ll be given the chance to access private event rooms and digital collectibles that you can add to your profile.",
        },

        {
          title: "Will I be able to watch sports on FX1?",
          description: "No, you won’t find the traditional video stream on FX1 for the games we offer. Instead, we provide a new experience built using A.I. and Blockchain technology.",
        },
        {
          title: "Can you tell me more about your Ambassador program?",
          description: "As an ambassador, you have a greater ability to earn when bringing over your community, and you’ll also be able to charge a ticket fee for access to event rooms you host.",
        },

        {
          title: "How do I connect with friends to watch sports on FX1?",
          description: "Simple, when you enter an event room for a game just click the button to create a private room and when provided with the share link just share with your friends or community.",
        },
      ]
    }
  },
  methods: {
    showAlertMessage() {
      this.$toast.info('$FX1 available to purchase mid to late April', {
        duration: 5000,
        position: 'bottom-left',
        className: 'fx1-success',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.token-faq-section::v-deep {
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 100px 0 150px;
  z-index: 2;

  .top-margin-a {
    margin-top: 25px;
  }

  .top-margin-b {
    margin-top: 50px;
  }

  .top-margin-c {
    margin-top: 150px;
  }

  .top-margin-d {
    margin-top: 10px;
  }

  .top-margin-e {
    margin-top: 30px;
  }

  .col-left {
    margin-right: 1%;
  }

  .col-right {
    margin-left: 1%;
  }

  .actions {
    margin: 12px;
  }

  .btn-left,
  .btn-right {
    a {
      width: 200px;
      height: 60px;
      border-radius: 8px;
    }
  }

  .btn-right {
    a {
      background-color: transparent;
      outline: 1px solid white;
    }
  }

  .whatbox {
    padding: 60px 0;
    background: linear-gradient(
        268.82deg,
        rgba(136, 107, 242, 0.8) 56.01%,
        rgba(136, 107, 242, 0) 122.21%
    );
    border-radius: 12px;
  }

  .address {
    margin-top: 30px;
  }

  // Mobile
  @include max-width(1021px) {
    .col {
      flex: none !important;
      width: 100% !important;
      margin: 0 !important;
    }

    padding: 50px 0 50px;

    h1.token-h {
      font-size: 20px;
      letter-spacing: 0.01em;
      font-weight: bold;
    }

    .top-margin-a {
      margin-top: 0 !important;
    }

    .top-margin-c {
      margin-top: 100px;
    }

    .faqbox {
      position: relative !important;
      display: flex;
      margin-bottom: 15px !important;
    }

    .whatbox {
      padding: 30px 0;
    }

    .actions.text-right,
    .actions.text-left {
      text-align: center !important;
    }

    .btn-left,
    .btn-right {
      max-width: 42% !important;
      height: 60px !important;

      a {
        margin: 0 !important;
        width: 100% !important;
        height: 60px !important;
      }
    }

    .btn-right,
    .btn-left {
      margin-left: 4% !important;
      margin-right: 4% !important;
      text-align: center !important;
    }

    .top-margin-c {
      margin-top: 35px !important;
    }

    .actions {
      text-align: center !important;
      margin-top: 25px !important;
    }
  }
}
</style>
