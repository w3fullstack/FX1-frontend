<template lang="pug">
.consumer-section.row
  .container.token-container
    .row.justify-between
      .col.consumer-option.left.all-other
        .coins
        .token-h2 2,000,000 $FXI
        h2.token-p.grey-text Shared between 5 winners
      .col.consumer-option-b.left.tablet
        .token-h2 2,000,000 $FXI
        h2.token-p.grey-text Shared between 5 winners
        .coins-b
      //- .col.consumer-option.right
      //-   .tickets
      //-   .token-h2 87,000
      //-   h2.token-p.grey-text Tickets in Circulation
</template>

<script>
export default {
  name: 'XTDefaultJackpotFooter',
}
</script>

<style lang="scss" scoped>
.consumer-section {
  position: relative;
  z-index: 99;

  .token-p {
    margin-top: 11%;
  }

  .token-h2 {
    font-weight: 300;
    color: white;
    font-size: 30px;
  }
  .row {
    align-items: center;
    @include max-width(500px) {
      flex-direction: column;
    }
  }
  .consumer-option,
  .consumer-option-b {
    margin-left: auto;
    margin-right: auto;
    max-width: 98% !important;
    height: 200px;
    padding: 40px 0px 40px 25%;
    border-radius: 20px;
    border: 1px solid white;
    box-shadow: 0px 98px 100px -48px #AABCCC33 inset;
    background-color: #08252C;
  }

  .consumer-option-b {
    padding: 32px 24px 32px 24px;
    text-align: center;
    position: relative;
  }

  .left {
    float: left !important;
    max-width: 49% !important;
  }

  .right {
    float: right !important;
    max-width: 49% !important;
  }

  .coins,
  .coins-b,
  .tickets {
    position: absolute;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    overflow: hidden;
    z-index: 999;
  }

  .coins {
    background-image: url('~assets/images/Jackpot/coins.png');
    height: 160%;
    top: -15%;
    left: -15%;
    zoom: 1.2;
  }
  .coins-b {
    background-image: url('~assets/images/Jackpot/coins.png');
    height: 160%;
    top: 0%;
    left: 0%;
    width: 100%;
    zoom: 0.9;
  }
  .tickets {
    background-image: url('~assets/images/Jackpot/tickets.png');
    height: 154%;
    top: -22%;
    left: 11%;
    zoom: 1.1;
  }
}

// RESPONSIVE
.consumer-section::v-deep {
  .tablet {
    display: none;
  }
  
  @include max-width(1600px) {
    .consumer-option {
      padding-left: 28%;
    }
    .coins {
      zoom: 1;
    }
  }
  @include max-width(1400px) {
    .consumer-option {
      padding-left: 26%;
    }
  }

  @include max-width(1200px) {
    .tablet {
      display: block;
    }
    .all-other {
      display: none;
    }
    .token-p {
      margin-top: 15px;
    }
    .consumer-option-b {
      height: 260px;
    }
  }

  @include max-width(767px) {
    .row {
      align-items: unset;
    }
    .consumer-option-b {
      max-width: 60% !important;
    }
  }

  @include max-width(539px) {
    .tablet {
      display: none;
    }
    .all-other {
      display: block;
    }
    .consumer-option {
      max-width: 100% !important;
      padding: 24px 16px 24px 50%;
      height: 108px;
    }
    .coins {
      top: -15%;
      left: -25%;
      zoom: 0.6;
    }
  }

  @include max-width(430px) {
    .consumer-option {
      padding: 24px 16px 24px 45%;
    }
    .coins {
      top: -15%;
      left: -29%;
      zoom: 0.5;
    }
  }

  @include max-width(355px) {
    .token-h2 {
      font-size: 16px !important;
    }
    .token-p {
      font-size: 12px !important;
    }
  }
}
</style>
