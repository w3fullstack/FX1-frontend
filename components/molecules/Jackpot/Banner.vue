<template lang="pug">
.token-banner.row
  .overlay
  .container.is-max-widescreen
    .content-middle.text-center
      h1.token-h1 The FX1 Jackpot
      h2.token-h2-c.grey-text Buy $FXI now to earn tickets for the upcoming Jackpot draw.
        <br class="break-line"/> The more tickets you buy and hold, the better chance you have to win.

      .margin-bottom-2
      .time-left
        .time-left-inner
          p.jackpot-p1 {{ timeLeft.days }}
          p.token-p.grey-text DAYS
        .time-left-inner
          p.jackpot-p1 {{ timeLeft.hours }}
          p.token-p.grey-text HOURS
        .time-left-inner
          p.jackpot-p1 :
          p.token-p.grey-text &nbsp
        .time-left-inner
          p.jackpot-p1 {{ timeLeft.minutes }}
          p.token-p.grey-text MINUTES
        .time-left-inner
          p.jackpot-p1 :
          p.token-p &nbsp
        .time-left-inner
          p.jackpot-p1 {{ timeLeft.seconds }}
          p.token-p.grey-text SECONDS
      .actions
        a.button.jackpot-button(
          href="https://app.uniswap.org/swap?outputCurrency=0xC5190E7FEC4d97a3a3b1aB42dfedac608e2d0793",
          target="_blank"
        ) Buy $FX1
</template>

<script>
import moment, { duration } from 'moment'
export default {
  name: 'TokenBanner',
  data() {
    return {
      timeLeft: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      timerInterval: null,
    }
  },
  mounted() {
    this.updateCountDown()
  },
  beforeDestroy() {
    clearInterval(this.timerInterval)
  },
  methods: {
    showAlertMessage() {
      this.$toast.success('$FX1 available to purchase mid to late April', {
        duration: 5000,
        position: 'bottom-left',
        className: 'fx1-success',
      })
    },
    updateCountDown() {
      this.timerInterval = setInterval(() => {
        // Countdown to 11th November 2023 12:00 AM PST
        const date1 = moment(1699430400000)
        const date2 = moment(new Date())

        // Get the duration between the two dates
        const durationDiff = duration(date1.diff(date2))
        // const days = date1.diff(date2, 'days')
        // const totalHours = date1.diff(date2, 'hours')

        // Extract hours, minutes, and seconds from the duration
        const days = durationDiff.days()
        const hours = durationDiff.hours()
        const minutes = durationDiff.minutes()
        const seconds = durationDiff.seconds()

        this.timeLeft = {
          days,
          hours,
          minutes,
          seconds,
        }
      }, 1000)
    },
  },
}
</script>
<style lang="scss" scoped>
.token-banner::v-deep {
  width: auto;
  position: relative;
  overflow: hidden;
  padding: 165px 0 130px;

  .token-h1 {
    -webkit-text-stroke: 0px;
    font-weight: 500 !important;
    text-shadow: none !important;
  }

  .overlay {
    top: 0%;
    position: absolute;
    background-image: url('~assets/images/Jackpot/gradient.png');
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 0;
    zoom: 1.1;
  }

  .content-middle {
    position: relative;
    z-index: 1;
    width: 100%;
    margin: auto;
    max-width: 962px;

    .actions {
      margin: 75px 0 25px;

      .button {
        width: 235px;
        height: 82px;
        text-transform: uppercase;
        margin-left: 10px;
        margin-right: 10px;
      }

      .button:last-child {
        background-color: $secondary;
      }
    }

    h2 {
      font-size: 1.5714rem;
      line-height: 2.4286rem;
      letter-spacing: -0.66px;
      max-width: 700px;
      margin: auto;
    }

    .launch-text {
      span {
        color: rgba($white, 0.8);
      }
    }
  }

  // RESPONSIVE

  @include max-width(1215px) {
    padding-bottom: 100px;

    .token-h1 {
      font-size: 80px;
      margin-bottom: 40px;
    }
    .token-h2-c {
      font-size: 18px !important;
      line-height: 53.28px;
    }
    .token-p {
      font-size: 14px !important;
    }

    .jackpot-p1 {
      font-size: 60px !important;
    }
  }

  @include max-width(870px) {
    .token-h1 {
      font-size: 60px;
      margin-bottom: 20px;
    }
  }

  @include max-width(600px) {
    padding-bottom: 75px;

    .token-h2-c {
      font-size: 14px !important;
      padding-left: 10px;
      padding-right: 10px;
    }
    .token-h1 {
      font-size: 50px;
    }
    .jackpot-p1 {
      font-size: 42px !important;
    }
    .token-p {
      font-size: 12px !important;
    }
    .time-left-inner {
      margin: 0 3px 0 3px;
    }
    .time-left-inner:first-child {
      margin: 0 20px 0 20px !important;
    }
    .break-line {
      display: none !important;
    }
    .margin-bottom-2 {
      margin-bottom: 50px;
    }
  }

  @include max-width(450px) {
    .token-h1 {
      font-size: 40px;
    }
  }

  @include max-width(356px) {
    .jackpot-p1 {
      font-size: 34px !important;
    }
    .token-h1 {
      font-size: 34px;
    }
    .token-p {
      font-size: 10px !important;
    }
  }
}
</style>
