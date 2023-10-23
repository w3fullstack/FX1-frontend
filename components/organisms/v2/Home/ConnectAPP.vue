<template lang="pug">
.get-app-connect-container(v-if="$route.path != '/error'")
  .container.is-max-widescreen
    .get-app-connect.flex-column
      p.txt-title.text-weight-regular Get App
      p.txt-intro.text-weight-light We worked hard building our app to ensure you'll love using it
      .app-logo.row
        a(
          href="https://apps.apple.com/us/app/fx1/id1626034650",
          target="_blank"
        ): img(
          src="~assets/images/v2/Home/appstore.svg",
          alt="App Store"
        )
        a(
          href="https://play.google.com/store/apps/details?id=io.fx1.sports",
          target="_blank"
        ): img(
          src="~assets/images/v2/Home/googleplay.svg",
          alt="Playstore"
        )
      .happy-smile-img 
        img.happy-smiling(src="~assets/images/v2/Home/happy-young.png")
</template>
<script>
export default {
  name: 'XOConnectAPP',
}
</script>
<style scoped lang="scss">
.get-app-connect-container {
  background: $black;
  padding-top: 80px;
  padding-bottom: 130px;
  position: relative;
  .container {
    .get-app-connect {
      border-radius: 10px;
      background: linear-gradient(
          276deg,
          #3416a3 2.92%,
          rgba(41, 14, 139, 0) 69.22%
        ),
        #4f3b98;
      box-shadow: 0px 1.4113px 3.95718px 0px rgba(79, 59, 152, 0.12),
        0px 3.39155px 9.50965px 0px rgba(79, 59, 152, 0.17),
        0px 6.38599px 17.90582px 0px rgba(79, 59, 152, 0.21),
        0px 11.39152px 31.94092px 0px rgba(79, 59, 152, 0.25),
        0px 21.30658px 59.74198px 0px rgba(79, 59, 152, 0.3),
        0px 51px 143px 0px rgba(79, 59, 152, 0.42);
      padding: 45px 80px 75px;
      gap: 12px;
      .happy-smile-img {
        .happy-smiling {
          position: absolute;
          right: -10%;
          bottom: 0;
        }
      }
      p.txt-intro {
        max-width: 382px;
        letter-spacing: 0.18px;
        z-index: 1;
      }
      .app-logo {
        margin-top: 28px;
        gap: 32px;
        z-index: 1;
        img {
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }

  @media screen and (max-width: 1439px) {
    padding: 55px 0;
    .container {
      .get-app-connect {
        padding: 65px 40px;
        .happy-smile-img {
          .happy-smiling {
            width: 635px;
            right: -4%;
          }
        }

        p.txt-title {
          letter-spacing: 0.36px;
        }
        .app-logo {
          margin-top: 18px;
          a {
            img {
              width: 152px;
              height: 44px;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 1023px) {
    .container {
      .get-app-connect {
        padding: 46px 40px;
        p.txt-intro {
          max-width: 284px;
        }
        .app-logo {
          flex-flow: column;
          gap: 12px;
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    padding: 145px 0 50px;
    .container {
      .get-app-connect {
        padding: 30px 20px 0;
        justify-content: flex-start;
        overflow: hidden;
        .happy-smile-img {
          width: 431px;
          .happy-smiling {
            position: unset;
            margin-bottom: -7px;
            margin-left: -68px;
          }
        }
        p.txt-title {
          letter-spacing: 0.28 px;
        }
        p.txt-intro {
          max-width: 100%;
        }
        .app-logo {
          margin-top: 8px;
          flex-flow: row;
          gap: 20px;
          a {
            img {
              width: 110px;
              height: 40px;
            }
          }
        }
      }
    }
  }
}
</style>
