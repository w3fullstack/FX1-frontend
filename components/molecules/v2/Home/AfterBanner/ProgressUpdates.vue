<template lang="pug">
.home-after-banner-progress.flex-column
  .group(v-for="(group, index) in progressData")
    .row 
      .icon-img
        img(
          v-if="group.icon",
          :src="require(`~/assets/images/v2/Home/${group.icon}.svg`)"
        ) 
        .dot(v-else)
        .vertical-line
      .detail.flex-column(:class="{ 'hight-light': group.light }") 
        span.epic(v-if="group.epic") {{ group.epic }}
        span.light(v-if="group.light") {{ group.light }}
        span.txt-label {{ group.label }}
        span.txt-time {{ group.time }}
</template>
<script>
export default {
  name: 'HomeAfterBannerProgressUpdates',
  data() {
    return {
      progressData: [
        {
          epic: 'EPIC',
          time: '12:23:12',
          label: 'New game excitement level!',
          icon: 'fluent-emoji_star-struck',
        },
        {
          time: '12:23:01',
          label: 'Wilmer Flores flied out to RF.',
          icon: 'team-icon',
        },
        {
          time: '12:23:12',
          label: 'Reached on error',
          icon: 'fluent-emoji-fire',
          light: 'HIGHLIGHT',
        },
        {
          time: '12:20:01',
          label: 'Single to SS.Sandoval to 2B.',
        },
        {
          time: '12:23:12',
          label: 'Wilmer Flores flied out to RF.',
          icon: 'team-icon',
          light: 'HIGHLIGHT',
        },
        {
          time: '12:23:01',
          label: 'Wilmer Flores flied out to RF.',
          icon: 'team-icon',
        },
        {
          epic: 'EPIC',
          time: '12:23:12',
          label: 'New game excitement level!',
          icon: 'fluent-emoji_star-struck',
        },
      ],
    }
  },
}
</script>
<style scoped lang="scss">
.home-after-banner-progress {
  position: absolute;
  top: 15%;
  left: -1%;
  border-radius: 20px;
  padding: 18px 12px;
  border-radius: 20px;
  border: 0.5px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 5px 6px 18px 0px rgba(0, 0, 0, 0.1),
    22px 24px 32px 0px rgba(0, 0, 0, 0.09),
    49px 53px 43px 0px rgba(0, 0, 0, 0.05),
    87px 94px 51px 0px rgba(0, 0, 0, 0.01),
    136px 147px 56px 0px rgba(0, 0, 0, 0);
  backdrop-filter: blur(5px);
  flex-wrap: nowrap;
  overflow: hidden;
  width: 181px;
  height: 297px;
  .group {
    padding-bottom: 12px;
    &:last-child {
      padding-bottom: 0;
    }
    .row {
      flex-flow: row;
      align-items: stretch;
      gap: 4.5px;
      .txt-label {
        font-size: 8px;
        line-height: 1.2;
        font-weight: 300;
      }
      .light {
        font-size: 7px;
        line-height: 1;
        font-weight: 100;
      }
      .epic {
        font-size: 7px;
        line-height: 1;
        font-weight: 300;
        background: $primary;
        border-radius: 8px;
        padding: 2px;
        width: fit-content;
      }
      .txt-time {
        font-size: 7px;
        line-height: 1;
        font-weight: 300;
        color: $grey-mute;
      }
      img {
        width: 14px;
        height: 14px;
      }
      .dot {
        min-width: 8px;
        min-height: 8px;
        border-radius: 50%;
        background: $police-blue;
      }
      .icon-img {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: flex-start;
        width: 14px;
        .vertical-line {
          width: 1px;
          flex: 1;
          min-height: 100%;
          background: $police-blue;
        }
      }
      .detail {
        gap: 4.5px;
        &.hight-light {
          background: #6046bf;
          border-radius: 6px;
          padding: 4px;
          flex: 1;
        }
      }
    }
  }
  @media screen and (max-width: 1439px) {
    width: 167px;
    height: 272px;
  }
  @media screen and (max-width: 1023px) {
    width: 123px;
    height: 200px;
    top: 36%;
    left: 0%;
  }
  @media screen and (max-width: 767px) {
    width: 127px;
    height: 207px;
    left: 0px;
    top: 85px;
  }
}
</style>
