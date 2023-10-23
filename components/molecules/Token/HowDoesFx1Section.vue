<template lang="pug">
.token-howDoesFX1-section.row
  .container.token-container.text-center
    h1 How does $FX1 work?
    .top-margin-a
    .row.for-desktop
      .col
        .box.b-1
          h2.token-h2-b Earn
          .paragraphs.top-margin-b
            p.token-p Share in a split of revenue generated when you invite your friends, family and community to FX1 to enjoy the experience of our live event rooms. Progress to become an Ambassador and earn the right to sell tickets to event rooms for additional opportunities to earn.
      .col
        .box.b-2
          h2.token-h2-b Use
          .paragraphs.top-margin-b
            p.token-p All purchases on FX1 will be made using the $FX1 token. You’ll be able to use it to purchase event room features, ensuring you only ever pay for what you consume. $FX1 can also be used to purchase digital collectibles, coming soon in 2023.
      .col
        .box.b-3
          h2.token-h2-b Hold
          .paragraphs.top-margin-b
            p.token-p You’re encouraged to build your bag of $FX1 given that doing so will give you special access to private event rooms hosted by sports stars and influences, as well as earning a range of digital collectibles that you can add to your profile.

    .row.for-tablet
      .col
        .box.b-1
          h2.token-h2-b Earn
          .paragraphs.top-margin-b
            p.token-p Share in a split of revenue generated when you invite your friends, family and community to FX1 to enjoy the experience of our live event rooms. Progress to become an Ambassador and earn the right to sell tickets to event rooms for additional opportunities to earn.
      .col
        .box.b-2
          h2.token-h2-b Use
          .paragraphs.top-margin-b
            p.token-p All purchases on FX1 will be made using the $FX1 token. You’ll be able to use it to purchase event room features, ensuring you only ever pay for what you consume. $FX1 can also be used to purchase digital collectibles, coming soon in 2023.
    .row.for-tablet
      .col
        .box.b-3
          h2.token-h2-b Hold
          .paragraphs.top-margin-b
            p.token-p You’re encouraged to build your bag of $FX1 given that doing so will give you special access to private event rooms hosted by sports stars and influences, as well as earning a range of digital collectibles that you can add to your profile.

    .row.top-margin-c
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
    span.address Contract Address:
      span 0x610C584F1275f0f7c982Af0aC7883Ff4Dba661Bd
</template>

<script>
export default {
  name: 'HowDoesFX1Section',
  methods: {
    showAlertMessage() {
      this.$toast.success('$FX1 available to purchase mid to late April', {
        duration: 5000,
        position: 'bottom-left',
        className: 'fx1-success',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.token-howDoesFX1-section::v-deep {
  width: auto;
  position: relative;
  overflow: hidden;
  padding: 150px 0;
  z-index: 2;


  .for-tablet {
    display: none;
  }

  .top-margin-a {
    margin-top: 80px;
  }

  .top-margin-b {
    margin-top: 20px;
  }

  .top-margin-c {
    margin-top: 40px;
  }

  .box {
    background-color: $secondary;
    padding: 30px 40px;
    min-height: 320px;
    border-radius: 20px;

    @include max-width(1600px) {
      min-height: 380px;
    }

    @include min-width(1024px) {
      height: 100%;
    }
  }

  .b-1 {
    margin-right: 30px;
  }

  .b-2 {
    margin-left: 15px;
    margin-right: 15px;
  }

  .b-3 {
    margin-left: 30px;
  }

  .actions {
    margin: 12px 12px 35px;
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

  // Tablet
  @include max-width(1023px) {
    .for-desktop {
      display: none;
    }
    .for-tablet {
      display: flex;
    }

    .box {
      margin-bottom: 15px;
      min-height: 340px !important;
    }

    .b-1 {
      width: 98%;
      margin-left: 0px;
      margin-right: 2%;
    }

    .b-2 {
      width: 98%;
      margin-left: 2%;
      margin-right: 0px;
    }

    .b-3 {
      width: 100%;
      margin-left: 0px;
      margin-right: 0px;
      min-height: 240px !important;
    }
  }

  // Mobile
  @include max-width(500px) {
    .for-desktop {
      display: flex;
    }
    .for-tablet {
      display: none;
    }

    padding: 50px 0 50px;

    .box {
      margin-bottom: 15px;
      min-height: auto !important;
    }

    .b-1,
    .b-2,
    .b-3 {
      margin-left: 0px;
      margin-right: 0px;
    }

    .actions.text-right,
    .actions.text-left {
      text-align: center !important;
    }

    .btn-left,
    .btn-right {
      max-width: 48% !important;
      height: 60px !important;
      a {
        margin: 0px !important;
        width: 100% !important;
        height: 60px !important;
      }
    }

    .btn-right {
      margin-left: 2% !important;
    }

    .btn-left {
      margin-right: 2% !important;
    }

    .top-margin-c {
      margin-top: 35px !important;
    }

    .actions {
      margin-top: 0px !important;
    }
    .address {
      display: inline-block;
      margin: 25px 0 0;
      span {
        margin-top: 5px;
      }
    }
  }
}
</style>
