<template lang="pug">
.xm-home-catalogs-fan-leaderboard.row.justify-center
  .fan-leaderboard
    nuxt-img(src="/v2/Home/shutterstock.svg", format="webp")

    .live-score.small-tags.light-green # live score
    .team-rivalries.small-tags # team rivalries
    .event-invites.small-tags.light-green # event invites
    .epic-games.small-tags # epic games
    .statistics.small-tags.light-green # statistics
    .news.small-tags # news
    .frame-people
      nuxt-img(
        v-for="(url, index) in frameAvatarUrls",
        :key="index",
        :src="url",
        format="webp",
        width="56",
        height="56"
      )
</template>

<script>
export default {
  name: 'XMHomeCatalogsFanLeaderboard',
  data() {
    return {
      frameAvatarUrls: [
        '/v2/Home/frame-person-1.png',
        '/v2/Home/frame-person-2.png',
        '/v2/Home/frame-person-3.png',
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.xm-home-catalogs-fan-leaderboard::v-deep {
  position: relative;

  // @include max-width(1000px) {
  //   zoom: 0.9;
  //   transform: translateY(-10%);
  // }

  // @include max-width(900px) {
  //   zoom: 0.8;
  //   transform: translateY(5%);
  // }

  // @include max-width(800px) {
  //   zoom: 0.7;
  //   transform: none;
  // }

  .small-tags {
    position: absolute;
    width: max-content;
    border-radius: 4px;
    padding: 14px 18px;
    backdrop-filter: blur(10px);
    text-align: center;

    font-size: 16px;
    line-height: 1.25;
    letter-spacing: -0.28px;

    background-color: rgba(white, 0.6);
    color: $secondary-dark;
    border: 1px solid rgba(white, 0.8);
    box-shadow: 0 6px 20px rgba(black, 0.13);

    &.light-green {
      background-color: rgba(12, 53, 62, 0.7);
      color: white;
      border-color: #385960;
    }
  }
  .news {
    top: 38%;
    right: -5%;
  }
  .live-score {
    top: 3%;
    left: -8%;
  }
  .event-invites {
    bottom: -1%;
    left: -4%;
  }
  .team-rivalries {
    top: 35%;
    left: -5%;
  }
  .epic-games {
    bottom: 11%;
    left: -20%;
  }
  .statistics {
    top: 10%;
    right: -5%;
  }

  .frame-people {
    position: absolute;
    bottom: -30%;
    right: -5%;
    padding: 8px;

    display: flex;
    flex-direction: column;
    gap: 8px;
    width: max-content;

    background-color: rgba(white, 0.4);
    border: 1px solid rgba(white, 0.6);
    box-shadow: 0 6px 20px rgba(black, 0.13);
    backdrop-filter: blur(10px);
    border-radius: 10px;
  }

  // red box text boxes placement end

  .fan-leaderboard {
    position: relative;

    img {
      border-radius: 12px;
    }
  }
  @media screen and (max-width: 1439px) {
    .fan-leaderboard {
      .small-tags {
        font-size: 14px;
        line-height: 1.1;
        padding: 12px 14px;
      }
      .frame-people {
        padding: 6px;
        img {
          width: 44px;
        }
      }
    }
  }

  @media screen and (max-width: 1023px) {
    .fan-leaderboard {
      .small-tags {
        font-size: 12px;
        padding: 10px 10px;
      }
      .frame-people {
        padding: 5px;
        right: 4%;
        bottom: -27%;
        img {
          width: 35px;
        }
      }
      .live-score {
        left: -7%;
        top: -6%;
      }
      .epic-games {
        left: -7%;
      }
      .team-rivalries {
        left: -2%;
      }
      .statistics {
        right: -3%;
      }
      .news {
        right: -2%;
      }
    }
  }
  @media screen and (max-width: 767px) {
    .fan-leaderboard {
      .small-tags {
        padding: 10px 12px;
      }
      .frame-people {
        img {
          width: 35px;
        }
      }
      .live-score {
        left: -5%;
      }
      .epic-games {
        left: -6%;
      }
      .team-rivalries {
        left: -2%;
      }
      .statistics {
        right: -3%;
      }
      .news {
        right: -2%;
      }
    }
  }
}
</style>
