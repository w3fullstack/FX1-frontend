<template lang="pug">
.xo-home-what-is
  .container.is-max-widescreen
    h1 Who is FX1 Sports
    .who-is-container 
      .content-section.experience.flex-column.justify-start
        p.txt-subtitle-1.text-weight-bold A better experience
        p.txt-intro.text-weight-light The problem with sports betting platforms is how they’re not designed for the novice bettor using jargon or acronyms many don’t understand. They are also a zero-sum game in which you either win, or you loose.
      .content-section.new-way.flex-column.justify-start
        p.txt-subtitle-1.text-weight-bold A new way to bet
        p.txt-intro.text-weight-light Community leaderboards, medals, trophies and the ability to climb conferences. Throw in sports betting and you have a new sporting social experience that you’ll only find at FX1.
      .content-section.winning.flex-column.justify-start
        p.txt-subtitle-1.text-weight-bold The winning feeling
        p.txt-intro.text-weight-light We aim to completely revolutionize sports betting, placing a focus on fun and entertainment over profit and loss. We’re here to help provide you with that “winning feeling”, even when you loose.
        img.fxl-log(src="~assets/images/v2/Home/FX1_Logo-1.svg")
      .content-section.excitement.flex-column.justify-start 
        .txt-group 
          p.txt-subtitle-1.text-weight-bold More excitement
          p.txt-intro.text-weight-light Part of our vision at FX1 has always been to make sports more exciting for the common fan. Research shows that placing a bet on a sports game increases the likelihood of watching it, and makes it more exciting as well.
        .ball-img-group 
          img.football-img(
            src="~assets/images/v2/Home/excitement-football-img.png"
          )
          img.basketball-img(
            src="~assets/images/v2/Home/excitement-basketball-img.png"
          )
</template>
<script>
export default {
  name: 'XOHomeWhoIs',
}
</script>

<style lang="scss" scoped>
.xo-home-what-is::v-deep {
  background: $black;
  padding: 100px 0 0;
  position: relative;
  h1 {
    margin-bottom: 50px;
  }
  .who-is-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    grid-auto-flow: row;
    grid-auto-flow: row;
    grid-template-areas:
      'excitement experience new-way'
      'excitement winning winning';
    .content-section {
      position: relative;
      padding: 32px 40px;
      border-radius: 20px;
      gap: 24px;
      p.txt-subtitle-1 {
        letter-spacing: 0.84px;
      }
      p.txt-intro {
        line-height: 2.28rem;
        font-weight: 300;
      }
    }
    .excitement {
      grid-area: excitement;
      background: var(--accent-orange, #ffaf23);
      color: $dark-1;
      .txt-group {
        display: flex;
        flex-flow: column;
        gap: 24px;
      }
      .ball-img-group {
        position: relative;

        .football-img {
          width: 220px;
          margin-top: 100px;
          margin-left: 0px;
        }
        .basketball-img {
          position: absolute;
          bottom: -80px;
          right: -35px;
          left: unset;
        }
      }
      z-index: 11;
    }
    .experience {
      grid-area: experience;
      border: 1px solid rgba(white, 0.2);
      background: rgba(0, 0, 0, 0.01);
      box-shadow: 0px 1px 30px -5px rgba(227, 222, 255, 0.07) inset,
        0px 4px 18px 0px rgba(146, 156, 210, 0.1) inset,
        0px 98px 100px -48px rgba(170, 188, 204, 0.2) inset;
      backdrop-filter: blur(30px);
      z-index: 11;
    }
    .new-way {
      grid-area: new-way;
      background: var(--accent-purple-700, #4f3b98);
      box-shadow: 0px 2.10125px 6.01713px 0px rgba(79, 59, 152, 0.05),
        0px 5.34051px 16.31415px 0px rgba(79, 59, 152, 0.08),
        0px 10.5116px 33.00966px 0px rgba(79, 59, 152, 0.11),
        0px 19.51257px 60.26942px 0px rgba(79, 59, 152, 0.14),
        0px 38.73399px 108.73195px 0px rgba(79, 59, 152, 0.18),
        0px 96px 244px 0px rgba(79, 59, 152, 0.3);
      z-index: 11;
    }
    .winning {
      position: relative;
      grid-area: winning;
      gap: unset;
      justify-content: space-between;
      border: 1px solid rgba(white, 0.2);
      background: rgba(0, 0, 0, 0.01);
      box-shadow: 0px 1px 30px -5px rgba(227, 222, 255, 0.07) inset,
        0px 4px 18px 0px rgba(146, 156, 210, 0.1) inset,
        0px 98px 100px -48px rgba(170, 188, 204, 0.2) inset;
      backdrop-filter: blur(30px);
      z-index: 11;
      .fxl-log {
        position: absolute;
        bottom: 0;
        right: 0;
        border-bottom-right-radius: 20px;
        width: 453px;
      }
      .txt-intro {
        max-width: 405px;
      }
    }
  }

  @media screen and (max-width: 1439px) {
    padding: 80px 0 0;
    h1 {
      margin-bottom: 32px;
    }
    .who-is-container {
      gap: 12px;
      grid-template-columns: 1fr 1fr;
      grid-template-areas:
        'excitement experience'
        'excitement new-way'
        'winning winning';
      .content-section {
        gap: 20px;
        padding: 36px 28px;
      }
      .excitement {
        .ball-img-group {
          .football-img {
            margin-top: 85px;
            margin-left: 10px;
          }
          .basketball-img {
            left: 150px;
            right: unset;
          }
        }
      }
      .winning {
        .fxl-log {
          width: 540px;
        }
        .txt-intro {
          max-width: 405px;
        }
      }
    }
  }
  @media screen and (max-width: 1023px) {
    .who-is-container {
      grid-template-areas:
        'excitement excitement'
        'experience new-way'
        'winning winning';
      .excitement {
        flex-flow: row;
        .ball-img-group {
          min-width: 230px;
          .football-img {
            width: 190px;
            margin-right: 30px;
          }
          .basketball-img {
            left: unset;
            right: -45px;
            bottom: -78px;
            width: 150px;
          }
        }
      }
      .winning {
        .fxl-log {
          width: 330px;
        }
        .txt-intro {
          max-width: 430px;
        }
      }
    }
  }
  @media screen and (max-width: 767px) {
    padding: 50px 0 0;
    h1 {
      margin-bottom: 20px;
    }
    .who-is-container {
      grid-template-columns: 1fr;
      gap: 20px;
      grid-template-areas:
        'excitement'
        'experience'
        'new-way'
        'winning';
      .content-section {
        padding: 30px 20px;
        gap: 10px;
        p.txt-subtitle-1 {
          letter-spacing: 0.64px;
        }
      }
      .excitement {
        flex-flow: column;
        .ball-img-group {
          min-width: unset;
          max-width: 100%;
          .football-img {
            margin-top: 45px;
          }
          .basketball-img {
            right: unset;
            left: 130px;
          }
        }
      }
      .winning {
        padding-bottom: 140px;
        .fxl-log {
          width: 326px;
          margin-bottom: 15px;
        }
        .txt-intro {
          max-width: unset;
        }
      }
    }
  }
}
</style>
