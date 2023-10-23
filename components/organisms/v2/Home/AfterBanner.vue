<template lang="pug">
.xo-home-after-banner
  .deskop-after-banner 
    .feature-content
      .container.is-max-widescreen.row
        .sub-content 
          p.txt-subtitle.text-weight-regular Live game scores and progress updates
          p.txt-intro.text-weight-light Find our growing list of sports and follow along with live scores and game progress updates.
        .sub-content
          p.txt-subtitle.text-weight-regular Create private groups and invite your friends
          p.txt-intro.text-weight-light Engage with fans or create your own private groups and chat using text, audio and video.
    .img-feature-group 
      .container.is-max-widescreen.row
        .sub-group
          img.img-feature-1(src="~assets/images/v2/Home/feature-1.png")
          HomeAfterBannerProgressUpdates
        .sub-group
          HomeAfterBannerChatView
          HomeAfterBannerEncrypted
          HomeAfterBannerInvited
          HomeAfterBannerPrivateGroup

  .mobile-after-banner 
    .container.is-max-widescreen.banner-1 
      p.txt-subtitle.text-weight-regular Live game scores and progress updates
      p.txt-intro.text-weight-light Find our growing list of sports and follow along with live scores and game progress updates.
      .sub-group
        .feature-group 
          img.img-feature-1(src="~assets/images/v2/Home/feature-1.png")
          HomeAfterBannerProgressUpdates
    .banner-2 
      .container.is-max-widescreen
        p.txt-subtitle.text-weight-regular Create private groups and invite your friends
        p.txt-intro.text-weight-light Engage with fans or create your own private groups and chat using text, audio and video.
        .sub-group
          .feature-group
            HomeAfterBannerChatView
            HomeAfterBannerEncrypted
            HomeAfterBannerInvited
            HomeAfterBannerPrivateGroup
</template>

<script>
export default {
  name: 'XOHomeAfterBanner',
  components: {
    HomeAfterBannerProgressUpdates: () =>
      import('~/components/molecules/v2/Home/AfterBanner/ProgressUpdates.vue'),
    HomeAfterBannerInvited: () =>
      import('~/components/molecules/v2/Home/AfterBanner/Invited.vue'),
    HomeAfterBannerEncrypted: () =>
      import('~/components/molecules/v2/Home/AfterBanner/Encrypted.vue'),
    HomeAfterBannerChatView: () =>
      import('~/components/molecules/v2/Home/AfterBanner/ChatView.vue'),
    HomeAfterBannerPrivateGroup: () =>
      import('~/components/molecules/v2/Home/AfterBanner/PrivateGroup.vue'),
  },
}
</script>

<style lang="scss" scoped>
.xo-home-after-banner {
  margin-top: -400px;
  .mobile-after-banner {
    display: none;
  }

  .deskop-after-banner {
    .feature-content {
      .container {
        flex-flow: row;
        justify-content: space-between;
        gap: 102px;
        .sub-content {
          p.txt-intro {
            margin-top: 12px;
            opacity: 0.8;
          }
        }
      }
    }
    .img-feature-group {
      margin-top: 62px;
      padding-bottom: 110px;
      background: linear-gradient(0deg, #000 0%, rgba(0, 0, 0, 0) 71.01%),
        #08252c;
      .container {
        flex-flow: row;
        justify-content: space-between;
        gap: 102px;
        .sub-group {
          position: relative;
          .img-feature-1 {
            max-width: 380px;
            margin-left: 120px;
          }
        }
      }
    }
  }
  @media screen and (min-width: 1024px) and (max-width: 1215px) {
    .deskop-after-banner {
      .feature-content,
      .img-feature-group {
        .container {
          max-width: 1024px;
        }
      }
    }
  }
  @media screen and (max-width: 1439px) {
    margin-top: -430px;
    .deskop-after-banner {
      .feature-content {
        .container {
          gap: 84px;
        }
      }
      .img-feature-group {
        margin-top: 45px;
        .container {
          gap: 84px;
          .sub-group {
            .img-feature-1 {
              max-width: 348px;
              margin-left: 103px;
            }
          }
        }
      }
    }
  }

  @media screen and (max-width: 1023px) {
    .deskop-after-banner {
      .feature-content {
        .container {
          gap: 50px;
        }
      }
      .img-feature-group {
        margin-top: 50px;
        .container {
          gap: 50px;
          .sub-group {
            .img-feature-1 {
              max-width: 251px;
              margin-left: 50px;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 767px) {
    .deskop-after-banner {
      display: none;
    }
    .mobile-after-banner {
      display: block;
      margin-top: -480px;
      width: 100%;
      height: 100%;
      .banner-1 {
        display: flex;
        flex-flow: column;
        gap: 12px;
        width: 100%;
        .sub-group {
          width: 100%;
          display: flex;
          justify-content: center;
          .feature-group {
            margin-top: 18px;
            position: relative;
            width: 345px;
            .img-feature-1 {
              width: 279px;
              margin-left: 60px;
            }
          }
        }
      }
      .banner-2 {
        margin-top: 28px;
        background: linear-gradient(0deg, #000 0%, rgba(0, 0, 0, 0) 71.01%),
          #08252c;
        .container {
          padding-top: 130px;
          display: flex;
          flex-flow: column;
          gap: 12px;
          width: 100%;
          .sub-group {
            width: 100%;
            display: flex;
            justify-content: center;
            .feature-group {
              margin-top: 18px;
              position: relative;
              width: 345px;
              z-index: 1;
            }
          }
        }
      }
    }
  }
}
</style>
