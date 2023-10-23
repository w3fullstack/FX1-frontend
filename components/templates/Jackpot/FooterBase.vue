<template lang="pug">
.xo-default-footer-navigation
  .container
    .row
      .col.flex-none
        .logo: img(
          src="~assets/images/logo.svg",
          width="96",
          height="40",
          alt="FX1"
        )
        .gap
        XODefaultFooterGetAppDark
      .col(v-for="(navigation, index) in desktopNavigation")
        .navigation-container
          h4._title {{ navigation.title }}
          .links
            nuxt-link.link(
              :to="`${link.url}`",
              v-if="navigation.title != 'Socials'"
              v-for="(link, index) in navigation.links",
              :key="index"
            ) {{ link.label }}
            a.d-flex(
              v-if="navigation.title == 'Socials'"
              v-for="(link, index) in navigation.links"
              :href="link.url"
              target="_blank"
            )
              img(
                :src="require(`~/assets/images/Default/${link.icon}.svg`)",
                width="18"
                height="18"
                :alt="link.alt"
                v-if="link.icon"
                style="margin-right: 10px"
              )
              p {{ link.label }}
            

    .mobile
      .accordion(
        v-for="(navigation, index) in mobileNavigation",
        :key="`${index}-mobile`"
      )
        .accordion-title.row.items-center.justify-between(
          @click.prevent="navigation.isOpen = !navigation.isOpen"
        )
          h4._title {{ navigation.title }}
          ._icon: b-icon(
            :icon="navigation.isOpen ? 'chevron-up' : 'chevron-down'"
          )

        transition(name="fade")
          .accordion-content(v-if="navigation.isOpen")
            nuxt-link.link(
              :to="`${link.url}`",
              v-for="(link, index) in navigation.links",
              :key="`${index}-l`"
            ) {{ link.label }}
</template>

<script>
export default {
  name: 'XODefaultFooterNavigation',
  components: {
    XODefaultFooterGetAppDark: () =>
      import('~/components/organisms/Default/Footer/GetAppDark')
  },
  data() {
    return {
      desktopNavigation: [
        {
          title: 'Product',
          links: [
            { label: 'Leagues & Clubs', url: '/explore' },
            { label: 'Customer Support', url: '/locker-room/fx-1-support/' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', url: '/about' },
            { label: 'Contact', url: '/contact' },
          ],
        },
        {
          title: 'Legal stuff',
          links: [
            { label: 'Terms', url: '/terms-conditions' },
            { label: 'Privacy', url: '/privacy' },
          ],
        },
        {
          title: 'Socials',
          links: [
            { label: 'Telegram', url: 'https://t.me/fx1_sports_portal', icon: 'telegram-footer', alt: 'telegram-footer' },
            { label: 'Twitter', url: 'https://twitter.com/FX1Sports', icon: 'twitter-footer', alt: 'twitter-footer' },
            { label: 'Medium', url: 'https://medium.com/fx1sports', icon: 'medium-footer', alt: 'medium-footer' },
          ],
        },
      ],
      mobileNavigation: [
        {
          title: 'Product',
          links: [
            { label: 'Leagues & Clubs', url: '/explore' },
            { label: 'Customer Support', url: '/locker-room/fx-1-support/' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', url: '/about' },
            { label: 'Contact', url: '/contact' },
          ],
        },
        {
          title: 'Legal stuff',
          links: [
            { label: 'Terms', url: '/terms-conditions' },
            { label: 'Privacy', url: '/privacy' },
          ],
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.xo-default-footer-navigation::v-deep {
  padding: 40px 0 30px;

  .container {
    padding-left: 5%;
    padding-right: 5%;
    margin-left: 5%;
    margin-right: 5%;
    max-width: 100%;
  }
  .flex-none {
    flex: none !important;
    margin-right: 200px;
  }

  .d-flex {
    display: flex !important;
  }

  .d-inline-block {
    display: inline-block;
  }

  .gap {
    margin-bottom: 25px;
  }

  .navigation-container {
    ._title {
      margin-bottom: 16px;
    }

    .links {
      .link, a {
        display: flex;
        font-size: 1.1429rem;
        font-weight: 300;
        line-height: 1.7143rem;
        letter-spacing: -0.28px;
        color: #839295;
        display: block;
        margin-bottom: 16px;
      }
    }
  }

  .desktop {
    @include max-width(767px) {
      display: none;
    }
  }

  .mobile {
    display: none;

    @include max-width(767px) {
      display: block;
    }

    .accordion {
      margin-bottom: 10px;

      .accordion-title {
        margin-bottom: 10px;
      }

      .accordion-content {
        a,
        .link {
          font-size: 1.1429rem;
          font-weight: 300;
          line-height: 1.7143rem;
          letter-spacing: -0.28px;
          color: #839295;
          display: block;
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
