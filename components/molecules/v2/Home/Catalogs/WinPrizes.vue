<template lang="pug">
.xm-home-catalogs-win-prizes
  .fight: nuxt-img(
    src="/v2/Home/host-live-fight.png",
    format="webp",
    width="182",
    height="120"
  )
  .stage: nuxt-img(src="/v2/Home/stadium.svg", format="webp")
  .winner.row: nuxt-img(src="/v2/Home/host-live-winner.jpg", format="webp")

  .microphone._icon.row.items-center.justify-center: nuxt-img(
    src="/v2/Home/broadcst-1.svg",
    width="61",
    height="61"
  )

  .battle._icon.row.items-center.justify-center: nuxt-img(
    src="/v2/Home/broadcst-2.svg",
    width="61",
    height="61"
  )

  .online-text.row.items-center.justify-center
    .row: nuxt-img(
      src="/v2/Home/participants-vector.svg",
      width="21",
      height="21"
    )
    p 1.4k online

  .level-up.row.items-center.justify-center
    ._icon2.row: nuxt-img(src="/v2/Home/medal.svg", width="32", height="32")
    .value
      p.text-weight-bold Level up!
      p.text-weight-light Your rank is upgraded
  .level-up-rank.row
</template>

<script>
export default {
  name: 'XMHomeCatalogsWinPrizes',
}
</script>

<style lang="scss" scoped>
.xm-home-catalogs-win-prizes::v-deep {
  position: relative;
  min-height: 270px;
  .img {
    height: auto;
    max-width: 100%;
    border-radius: 6%;
  }
  .fight {
    position: absolute;
    z-index: 2;
    bottom: 10%;
    left: -10%;
    img {
      border-radius: 12px;
      width: 238px;
    }
  }
  .stage {
    z-index: 1;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    margin-right: -50px;
    img {
      border-radius: 12px;
    }
  }
  .winner {
    position: absolute;
    z-index: 3;
    bottom: -32%;
    left: 43%;
    overflow: hidden;
    border-radius: 50%;
    img {
      width: 221px;
      height: 221px;
    }
  }
  ._icon {
    background-color: $black;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(black, 0.13);
    position: absolute;
    z-index: 4;
  }
  .microphone {
    top: 22%;
    left: -20%;
  }

  .battle {
    bottom: -10%;
    right: -6%;
  }
  .online-text {
    flex-flow: row;
    gap: 8px;
    box-shadow: 0 6px 20px rgba(black, 0.13);
    background-color: $primary;
    position: absolute;
    border-radius: 12px;
    z-index: 2;
    height: 40px;
    width: 134px;
    top: 10%;
    right: -30%;
    .row img {
      width: 24px;
    }
    p {
      color: white;
      font-weight: 300;
      font-size: 1rem;
    }
  }
  .level-up {
    flex-flow: row;
    gap: 10px;
    background-color: rgba($white, 0.8);
    width: 183px;
    height: 64px;
    border-radius: 6px;
    border: 1px solid $white;
    box-shadow: 0 6px 20px rgba(black, 0.13);
    backdrop-filter: blur(10px);
    z-index: 4;
    position: absolute;
    bottom: -27%;
    left: 6%;
    .value {
      color: $secondary_b;
      p.text-weight-bold {
        font-size: 14px;
      }
      p.text-weight-light {
        font-size: 10px;
      }
    }
  }
  .text-contents {
    position: absolute;
    bottom: 40px;
    right: -30px;
    width: 100%;
    div {
      background-color: $white;
      color: $secondary;
      font-weight: 300;
      padding: 12px 20px;
      max-width: max-content;
      border-radius: 5px;
      margin-top: 10px;
    }
  }
  @media screen and (max-width: 1439px) {
    .winner {
      bottom: 1%;
      left: 60%;
      img {
        max-width: 170px;
        max-height: 170px;
      }
    }
    .stage {
      margin-right: 0;
      img {
        width: 226px;
      }
    }
    .fight {
      bottom: 33%;
      left: 24%;
      img {
        width: 182px;
      }
    }
    .online-text {
      right: -12%;
      width: 103px;
      height: 30px;
      gap: 5px;
      top: 7%;
      .row img {
        width: 18px;
      }
      p {
        font-size: 0.85rem;
      }
    }
    .battle {
      right: -3%;
      bottom: 17%;
      img {
        width: 46px;
        height: 46px;
      }
    }
    .microphone {
      left: 18%;
      top: 15%;
      img {
        width: 46px;
        height: 46px;
      }
    }
    .level-up {
      bottom: 5%;
      left: 35%;
      width: 140px;
      height: 50px;
      .row img {
        width: 24px;
      }
      .value {
        p.text-weight-bold {
          font-size: 12px;
        }
        p.text-weight-light {
          font-size: 9px;
        }
      }
    }
  }
  @media screen and (max-width: 1215px) {
    .battle {
      right: -15%;
    }
    .level-up {
      left: 29%;
    }
  }
  @media screen and (max-width: 1023px) {
    .winner {
      bottom: 13%;
      left: 57%;
      img {
        max-width: 150px;
        max-height: 150px;
      }
    }
    .stage {
      img {
        width: 200px;
      }
    }
    .online-text {
      right: -22px;
      width: 90px;
      height: 26px;
      gap: 5px;
      .row img {
        width: 16px;
      }
      p {
        font-size: 0.75rem;
      }
    }
    .fight {
      bottom: 41%;
      left: 22%;
      img {
        width: 160px;
      }
    }
    .battle {
      bottom: 28%;
      right: -2px;
      img {
        width: 41px;
        height: 41px;
      }
    }
    .microphone {
      left: 15%;
      top: 13%;
      img {
        width: 41px;
        height: 41px;
      }
    }
    .level-up {
      bottom: 22%;
      left: 33%;
      width: 123px;
      height: 43px;
      gap: 5px;
      .row img {
        width: 20px;
      }
      .value {
        p.text-weight-bold {
          font-size: 10px;
        }
        p.text-weight-light {
          font-size: 8px;
        }
      }
    }
  }
  @media screen and (min-width: 768px) and (max-width: 960px) {
    .battle {
      right: -18px;
    }
  }
  @media screen and (max-width: 767px) {
    margin-right: -95px;
    .stage {
      img {
        width: 199px;
      }
    }
    .online-text {
      right: -8%;
      top: 37%;
    }
    .fight {
      bottom: 27%;
      left: -42%;
    }
    .winner {
      bottom: -6%;
      left: 7%;
    }
    .level-up {
      bottom: -2%;
      left: -43%;
    }
    .microphone {
      left: -53%;
      top: 21%;
    }
    .battle {
      bottom: 11%;
      right: 3%;
    }
  }
}
</style>
