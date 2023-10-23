<template lang="pug">
.xm-home-catalogs-ambassador
  nuxt-img.bg-img(
    src="/v2/Home/ambassador/baseball-match.png",
    width="375",
    height="280",
    format="webp"
  )
  .row.items-center.justify-center.number-msg.txt-number-1 {{ number_1 }}
  .row.items-center.justify-center.number-msg.txt-number-2 {{ number_2 }}
  //- .emoji-icon.tada
  //-   nuxt-img(
  //-     src="/v2/Home/ambassador/tada-emoji.png"
  //-     width="32"
  //-     height="32"
  //-     format="webp"
  //-   )
  .emoji-icon.starstruck
    nuxt-img.stars-emoji(
      src="/v2/Home/star-struck.svg",
      width="61",
      height="61",
      format="webp"
    )

  .members-block
    p {{ membersCount }} members
    .avatars
      nuxt-img.avatar-img(
        v-for="(url, index) in avatarUrls",
        :key="index",
        :src="url",
        width="48",
        height="48",
        format="webp"
      )
</template>

<script>
export default {
  name: 'XMHomeCatalogsAmbassador',
  data() {
    return {
      membersCount: 736,
      number_1: 4.73,
      number_2: ' 103/100',
      avatarUrls: [
        '/v2/Home/ambassador/person-1.png',
        '/v2/Home/ambassador/person-2.png',
        '/v2/Home/ambassador/person-3.png',
        '/v2/Home/ambassador/person-4.png',
        '/v2/Home/ambassador/person-5.png',
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.xm-home-catalogs-ambassador {
  position: relative;
  .emoji-icon {
    background-color: rgba(black, 0.8);
    border: 1px solid rgba(white, 0.6);
    box-shadow: 0 6px 20px rgba(black, 0.13);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    position: absolute;

    // &.tada {
    //   top: 43%;
    //   left: 13%;
    // }
  }
  .starstruck {
    top: 7%;
    right: 15%;
  }
  .number-msg {
    flex-flow: row;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 6px 20px rgba(black, 0.13);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    position: absolute;

    font-size: 1.3rem;
    color: $secondary_b;
    font-weight: 400;
  }
  .txt-number-1 {
    top: 2%;
    left: -6%;
    width: 70px;
    height: 43px;
  }
  .txt-number-2 {
    top: 41%;
    right: 5%;
    width: 103px;
    height: 43px;
  }

  .members-block {
    position: absolute;
    bottom: -20%;
    left: -6%;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    width: max-content;
    padding: 8px;

    background-color: rgba(white, 0.2);
    border: 1px solid rgba(white, 0.4);
    box-shadow: 0 6px 20px rgba(black, 0.13);
    backdrop-filter: blur(10px);
    border-radius: 10px;

    p {
      font-weight: 500;
      font-size: 12px;
      line-height: 1.1;
      letter-spacing: -0.28px;
    }

    .avatars {
      display: flex;

      > *:not(:first-child) {
        margin-left: -20px;
      }
    }
  }

  img {
    display: block;
  }
  @media screen and (max-width: 1439px) {
    .bg-img {
      width: 346px;
      height: 258px;
    }
    .txt-number-1 {
      width: 64px;
      height: 40px;
    }
    .txt-number-2 {
      width: 95px;
      height: 40px;
      right: 19%;
    }
    .starstruck {
      top: 6%;
      right: 24%;
      .stars-emoji {
        width: 61px;
        height: 61px;
      }
    }
    .members-block {
      width: 158px;
      height: 83px;
      .avatar-img {
        width: 44px;
        height: 44px;
      }
    }
  }

  @media screen and (max-width: 1215px) {
    .starstruck {
      right: 3%;
    }
    .txt-number-2 {
      right: -3%;
    }
  }
  @media screen and (max-width: 1023px) {
    width: 317px;
    .bg-img {
      width: 283px;
      height: 265px;
    }
    .txt-number-1 {
      width: 52px;
      height: 32px;
      top: -7%;
      left: 5%;
    }
    .txt-number-2 {
      width: 78px;
      height: 32px;
      right: 1%;
      top: 28%;
    }
    .starstruck {
      top: 6%;
      right: 15%;
      .stars-emoji {
        width: 46px;
        height: 46px;
      }
    }
    .members-block {
      width: 132px;
      height: 62px;
      padding: 4px;
      gap: 4px;
      bottom: -11%;
      left: 5%;
      p {
        font-size: 10px;
      }
      .avatar-img {
        width: 36px;
        height: 36px;
      }
    }
    .number-msg {
      font-size: 1rem;
    }
  }
}
</style>
