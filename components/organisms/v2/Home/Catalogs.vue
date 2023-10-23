<template lang="pug">
.xo-home-section-catalogs
  .container.is-max-widescreen
    h1 Coming soon
    .catalogs-container
      .content-section.claim-medal.row
        .left-content.col 
          h2 Supercharged Sports Betting
          p.txt-intro.text-weight-light Live sports betting using regular currency or crypto that rewards you even when you lose. Earn medals and trophies as you climb conferences and make your way to the top.

        .right-content.col
          XMHomeCatalogsFanLeaderboard

      .content-section.help.row
        .left-content.col
          h2 The FX1 Edge
          p.txt-intro.text-weight-light The FX1 Edge is the help you have been looking for to supercharge your sports betting. Get access to newly undiscovered data that not even the professionals are aware of, or have access to.
      .content-section.analytics.row
        .left-content.col
          h2 Live Game Analytics
          p.txt-intro.text-weight-light We’re working to provide more than just real-time stats for live sports games. Our proprietary AI technology and time-based charts allow you to understand the game better than you ever have before.

      .content-section.peer-to-peer.row
        .left-content.col
          h2 Why Peer-to-Peer
          p.txt-intro.text-weight-light Peer-to-peer is the future of sports betting. Peer-to-peer is you betting against someone else, not the house or the bookie and comes with many benefits including lower fees and better odds.

        .right-content.col
          XMHomeCatalogsAmbassador
      .content-section.explore-events.row
        .left-content.col
          h2 An Interactive Experience
          p.txt-intro.text-weight-light Betting online is more fun with friends. We create a social experience delivering fun and entertainment using chat, audio and video. You can even create private groups and invite only your friends.

        .right-content.col
          XMHomeCatalogsWinPrizes
</template>

<script>
export default {
  name: 'XOHomeCatalogs',
  components: {
    XMHomeCatalogsFanLeaderboard: () =>
      import('~/components/molecules/v2/Home/Catalogs/FanLeaderBoard.vue'),
    XMHomeCatalogsWinPrizes: () =>
      import('~/components/molecules/v2/Home/Catalogs/WinPrizes.vue'),
    XMHomeCatalogsAmbassador: () =>
      import('~/components/molecules/v2/Home/Catalogs/Ambassador.vue'),
  },
}
</script>

<style lang="scss" scoped>
/* stylelint-disable no-descending-specificity */
.xo-home-section-catalogs::v-deep {
  background-image: url('~assets/images/v2/Home/circles-and-light-2.svg');
  background-repeat: no-repeat;
  background-position: left 0 bottom -120px;
  background-color: $black;
  padding: 65px 0 100px;
  h1 {
    margin-bottom: 50px;
  }
  .catalogs-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    grid-auto-flow: row;
    grid-template-areas:
      'claim-medal analytics'
      'claim-medal explore-events'
      'help explore-events'
      'peer-to-peer peer-to-peer';
    .content-section {
      position: relative;
      padding: 48px 64px;
      border-radius: 10px;
      gap: 75px;
      .left-content {
        h2 {
          margin-bottom: 28px;
        }
      }
    }

    .explore-events {
      grid-area: explore-events;
      border-image-source: linear-gradient(
        127.3deg,
        #ffffff 0.38%,
        rgba(255, 255, 255, 0) 59.4%
      );
      border: 1px solid rgba(white, 0.2);
      background: rgba(0, 0, 0, 0.01);
      box-shadow: 0px 1px 30px -5px rgba(227, 222, 255, 0.07) inset,
        0px 4px 18px 0px rgba(146, 156, 210, 0.1) inset,
        0px 98px 100px -48px rgba(170, 188, 204, 0.2) inset;
      backdrop-filter: blur(30px);
      flex-flow: column;
    }

    .claim-medal {
      z-index: 11;
      grid-area: claim-medal;
      border-image-source: linear-gradient(
        127.3deg,
        #ffffff 0.38%,
        rgba(255, 255, 255, 0) 59.4%
      );
      border: 1px solid rgba(white, 0.2);
      background: rgba(0, 0, 0, 0.01);
      box-shadow: 0px 1px 30px -5px rgba(227, 222, 255, 0.07) inset,
        0px 4px 18px 0px rgba(146, 156, 210, 0.1) inset,
        0px 98px 100px -48px rgba(170, 188, 204, 0.2) inset;
      backdrop-filter: blur(30px);
      flex-flow: column;
    }

    .analytics {
      grid-area: analytics;
      color: $secondary_b;
      background: var(--accent-orange, #ffaf23);
      box-shadow: 0px 1.06592px 2.80384px 0px rgba(255, 175, 35, 0.08),
        0px 2.47835px 6.51914px 0px rgba(255, 175, 35, 0.12),
        0px 4.45054px 11.70687px 0px rgba(255, 175, 35, 0.15),
        0px 7.38625px 19.42906px 0px rgba(255, 175, 35, 0.17),
        0px 12.1686px 32.00872px 0px rgba(255, 175, 35, 0.2),
        0px 21.26719px 55.94197px 0px rgba(255, 175, 35, 0.24),
        0px 46px 121px 0px rgba(255, 175, 35, 0.32);
    }

    .peer-to-peer {
      padding: 30px 60px;
      grid-area: peer-to-peer;
      border-image-source: linear-gradient(
        127.3deg,
        #ffffff 0.38%,
        rgba(255, 255, 255, 0) 59.4%
      );
      border: 1px solid rgba(white, 0.2);
      background: rgba(0, 0, 0, 0.01);
      box-shadow: 0px 1px 30px -5px rgba(227, 222, 255, 0.07) inset,
        0px 4px 18px 0px rgba(146, 156, 210, 0.1) inset,
        0px 98px 100px -48px rgba(170, 188, 204, 0.2) inset;
      backdrop-filter: blur(30px);
      flex-direction: row-reverse;
    }

    .help {
      grid-area: help;
      color: $white;
      background: var(--accent-purple-700, #4f3b98);
      box-shadow: 0px 1.4113px 3.95718px 0px rgba(79, 59, 152, 0.12),
        0px 3.39155px 9.50965px 0px rgba(79, 59, 152, 0.17),
        0px 6.38599px 17.90582px 0px rgba(79, 59, 152, 0.21),
        0px 11.39152px 31.94092px 0px rgba(79, 59, 152, 0.25),
        0px 21.30658px 59.74198px 0px rgba(79, 59, 152, 0.3),
        0px 51px 143px 0px rgba(79, 59, 152, 0.42);
    }
  }

  @media screen and (max-width: 1439px) {
    padding: 40px 0 80px;
    .container {
      h1 {
        margin-bottom: 35px;
      }
      .catalogs-container {
        gap: 14px;
        .content-section {
          padding: 36px 28px;
          gap: 40px;
          .left-content {
            h2 {
              margin-bottom: 20px;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 1023px) {
    .container {
      .catalogs-container {
        grid-template-areas:
          'claim-medal claim-medal'
          'analytics help'
          'explore-events explore-events'
          'peer-to-peer peer-to-peer';
        gap: 20px;
        .claim-medal,
        .explore-events {
          flex-flow: row;
          gap: 10px;
        }
      }
    }
  }
  @media screen and (min-width: 768px) and (max-width: 850px) {
    .container {
      .catalogs-container {
        .explore-events {
          .right-content {
            width: 350px;
          }
        }
      }
    }
  }
  @media screen and (max-width: 767px) {
    padding: 50px 0;
    .container {
      h1 {
        margin-bottom: 20px;
      }
      .catalogs-container {
        gap: 20px;
        grid-template-columns: 1fr;
        grid-template-areas:
          'claim-medal'
          'analytics'
          'explore-events'
          'help';
        .peer-to-peer {
          display: none;
        }
        .content-section {
          padding: 30px 20px;
          .left-content {
            h2 {
              margin-bottom: 10px;
            }
          }
        }
        .claim-medal {
          flex-flow: column;
          gap: 30px;
        }
        .explore-events {
          flex-flow: column;
          align-items: center;
        }
      }
    }
  }
}
</style>
