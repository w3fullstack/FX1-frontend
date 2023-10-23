<template lang="pug">
.xo-default-footer-navigation
  .row.desktop
    template(v-for="(navigation, index) in navigationList")
      .navigation-container
        p._title {{ navigation.title }}
        .links.flex-column
          nuxt-link.link(
            v-for="(link, index) in navigation.links",
            :key="index",
            :to="`/${link.url}`"
          )
            img(
              v-if="link.icon",
              :src="require(`~/assets/images/Default/${link.icon}.svg`)",
              :alt="link.label"
            ) 
            span {{ link.label }}

  //- .mobile
    .accordion(
      v-for="(navigation, index) in navigationList",
      :key="`${index}-mobile`"
    )
      .accordion-title.row.items-center.justify-between(
        @click.prevent="navigation.isOpen = !navigation.isOpen"
      )
        p._title {{ navigation.title }}
        ._icon: b-icon(:icon="navigation.isOpen ? 'chevron-up' : 'chevron-down'")

      transition(name="fade")
        .accordion-content(v-if="navigation.isOpen")
          nuxt-link.link(
            v-for="(link, index) in navigation.links",
            :key="index",
            :to="`/${link.url}`"
          )
            img(
              v-if="link.icon",
              :src="require(`~/assets/images/Default/${link.icon}.svg`)",
              :alt="link.label"
            ) 
            span {{ link.label }}
</template>

<script>
export default {
  name: 'XODefaultFooterNavigation',
  data() {
    return {
      navigationList: [
        {
          title: 'Product',
          links: [
            { label: 'Leagues & Clubs', url: 'explore' },
            { label: 'Customer Support', url: 'locker-room/fx-1-support/' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', url: 'about' },
            { label: 'Contact', url: 'contact' },
          ],
        },
        {
          title: 'Legal stuff',
          links: [
            { label: 'Terms', url: 'terms-conditions' },
            { label: 'Privacy', url: 'privacy' },
          ],
        },
        {
          title: 'Socials',
          links: [
            {
              label: 'Telegram',
              icon: 'telegram-footer',
              url: 'https://t.me/fx1_sports_portal',
            },
            {
              label: 'Twitter',
              icon: 'twitter-footer',
              url: 'https://twitter.com/FX1Sports',
            },
            {
              label: 'Medium',
              icon: 'medium-footer',
              url: 'https://medium.com/fx1sports',
            },
          ],
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.xo-default-footer-navigation::v-deep {
  .desktop {
    flex-flow: row;
    gap: 82px;
    .navigation-container {
      font-size: 16px;
      ._title {
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
        margin-bottom: 16px;
      }
      .links {
        gap: 16px;
        a {
          color: $white;
          font-weight: 300;
          line-height: 24px;
          display: flex;
          flex-flow: row;
          align-items: center;
          gap: 12px;
          img {
            width: 20px;
            height: 20px;
          }
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  // .mobile {
  //   display: none;
  //   @include max-width(767px) {
  //     display: block;
  //   }
  //   .accordion {
  //     margin-bottom: 10px;
  //     .accordion-title {
  //       margin-bottom: 10px;
  //     }
  //     .accordion-content {
  //       a,
  //       .link {
  //         font-size: 1.1429rem;
  //         font-weight: 300;
  //         line-height: 1.7143rem;
  //         letter-spacing: -0.28px;
  //         color: #839295;
  //         display: block;
  //         margin-bottom: 10px;
  //       }
  //     }
  //   }
  // }
  @media screen and (max-width: 1023px) {
    .desktop {
      justify-content: space-around;
    }
  }
  @media screen and (max-width: 767px) {
    .desktop {
      flex-flow: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 40px;
      .navigation-container {
        .links {
          flex-flow: row;
          gap: 30px;
        }
      }
    }
  }
}
</style>
