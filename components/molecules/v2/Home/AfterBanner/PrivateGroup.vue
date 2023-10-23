<template lang="pug">
.home-after-banner-private-group 
  .group-content(v-for="(data, index) in groupData")
    img(:src="require(`~/assets/images/v2/Home/${data.avatar}.svg`)")
    .content.flex-column 
      .row
        span.name {{ data.name }}
        span.time {{ data.time }}
      span.reply(v-if="data.reply") {{ data.reply }}
      span.txt-label {{ data.label }}
</template>
<script>
export default {
  name: 'HomeAfterBannerPrivateGroup',
  data() {
    return {
      groupData: [
        {
          avatar: 'avatar-2',
          name: 'Yankees fans',
          time: '25m',
          label: `It's impossible. I don't believe it this happened once again`,
          reply: 'You',
        },
        {
          avatar: 'avatar-3',
          name: 'DDlion',
          time: '25m',
          label: `It was a very tense game yesterday, I thought we wouldn't make it...`,
        },
        {
          avatar: 'avatar-4',
          name: 'MLS',
          time: '25m',
          label: `Have you seen Yankees' new team player? I guest it will be a...`,
          reply: 'PatrickM',
        },
        {
          avatar: 'avatar-5',
          name: 'Pat BDay',
          time: '25m',
          label: `Look like weather will be nice`,
          reply: 'Unicom',
        },
        {
          avatar: 'avatar-6',
          name: 'Red Sox fans',
          time: '25m',
          label: `I think number 10 will take the game`,
          reply: 'You',
        },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.home-after-banner-private-group {
  position: absolute;
  top: 37%;
  right: 2%;
  border-radius: 20px;
  border: 0.5px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 4px 4px 12px 0px rgba(0, 0, 0, 0.1),
    15px 17px 22px 0px rgba(0, 0, 0, 0.09),
    34px 38px 30px 0px rgba(0, 0, 0, 0.05),
    60px 67px 36px 0px rgba(0, 0, 0, 0.01), 94px 104px 39px 0px rgba(0, 0, 0, 0);
  backdrop-filter: blur(5px);
  width: 148px;
  padding: 14px;
  overflow: hidden;
  .group-content {
    display: flex;
    flex-flow: row;
    gap: 4.5px;
    align-items: flex-start;
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }

    img {
      width: 23px;
      height: 23px;
    }
    .content {
      flex-flow: column;
      gap: 3px;
      .row {
        flex-flow: row;
        align-items: center;
        justify-content: space-between;
        font-size: 6px;
        line-height: 1;
        .name {
          font-weight: 400;
        }
        .time {
          font-weight: 300;
          color: $dark-white;
        }
      }
      .reply {
        font-size: 6px;
        color: $warning;
      }
      .txt-label {
        font-size: 5px;
        font-weight: 200;
        color: $dark-white;
        line-height: 1.1;
      }
    }
  }
  @media screen and (max-width: 1439px) {
    width: 136px;
    height: 211px;
    top: 44%;
    right: -6%;
    .group-content {
      gap: 4px;
      img {
        width: 21px;
        height: 21px;
      }
    }
  }
  @media screen and (max-width: 1023px) {
    width: 100px;
    height: 156px;
    padding: 9px;
    top: 41%;
    right: 3%;
    .group-content {
      margin-bottom: 6px;
      img {
        width: 16px;
        height: 16px;
      }
    }
  }
  @media screen and (max-width: 767px) {
    width: 108px;
    height: 167px;
    top: 100px;
    right: 0;
  }
}
</style>
