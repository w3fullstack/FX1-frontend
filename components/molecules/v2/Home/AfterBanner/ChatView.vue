<template lang="pug">
.home-after-banner-chat-view 
  .chat-content(v-for="(chat, index) in chatData")
    img(:src="require(`~/assets/images/v2/Home/${chat.avatar}.svg`)")
    .content
      .row 
        .name {{ chat.name }}
        .date {{ chat.date }}
      .flex-column(v-if="chat.reply")
        .reply-name {{ chat.reply.name }}
        .reply-label {{ chat.reply.label }}
      .txt-label {{ chat.label }}
      .arrow-left
</template>
<script>
export default {
  name: 'HomeAfterBannerChatView',
  data() {
    return {
      chatData: [
        {
          avatar: 'avatar-7',
          name: 'Jakob Schleifer',
          date: '9:21 am, 08/22/2022',
          label: 'This season Jack shows his best play',
        },
        {
          avatar: 'avatar-1',
          name: 'Brandon Kenter',
          date: '9:21 am, 08/22/2022',
          label:
            'Cannot believe it is happening! Have you heard about the latest news??',
        },
        {
          avatar: 'avatar-8',
          name: 'Rayna Curtis',
          date: '9:21 am, 08/22/2022',
          label:
            'Fantastic! With John Roberston liverpool has more chances to win!',
          reply: {
            name: 'Brandon Kenter',
            label: 'Cannot believe it is happening! Have you...',
          },
        },
      ],
    }
  },
}
</script>
<style lang="scss" scoped>
.home-after-banner-chat-view {
  width: 257px;
  margin-top: 30px;
  margin-right: 80px;
  margin-left: unset;
  .chat-content {
    display: flex;
    flex-flow: row;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
    img {
      width: 24px;
      height: 24px;
    }
    .content {
      background: $secondary;
      flex: 1;
      border-top-right-radius: 10px;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      padding: 10px;
      position: relative;
      .row {
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
        font-size: 10px;
        line-height: 1.1;
        margin-bottom: 8px;
        font-weight: 400;
        .name {
          color: $warning;
        }
        .date {
          color: $dark-white;
        }
      }
      .flex-column {
        flex-flow: column;
        font-size: 9px;
        line-height: 1.1;
        gap: 6px;
        border-left: solid 2px $white;
        padding-left: 6px;
        .reply-name {
          color: $purples;
          font-weight: 400;
        }
        .reply-label {
          color: $dark-white;
          font-weight: 300;
        }
      }
      .txt-label {
        font-size: 11px;
        font-weight: 300;
        line-height: 1;
      }
    }
    .arrow-left {
      position: absolute;
      top: 0;
      left: -4%;
      width: 0;
      height: 0;
      border-top: 10px solid $secondary;
      border-right: 10px solid $secondary;
      border-left: 10px solid transparent;
      border-bottom: 10px solid transparent;
    }
  }
  @media screen and (max-width: 1439px) {
    width: 237px;
    height: 230px;
    margin-top: 45px;
    margin-right: 60px;
    .chat-content {
      gap: 8px;
      margin-bottom: 8.5px;
      img {
        width: 21px;
        height: 21px;
      }
      .content {
        padding: 8px;
        .row {
          font-size: 8px;
          margin-bottom: 6px;
        }
        .flex-column {
          font-size: 7px;
          gap: 4px;
          padding-left: 4px;
        }
        .txt-label {
          font-size: 9px;
        }
      }
    }
  }
  @media screen and (max-width: 1023px) {
    width: 175px;
    height: 170px;
    margin-top: 25px;
    margin-right: 60px;
    .chat-content {
      gap: 6px;
      margin-bottom: 6.5px;
      img {
        width: 16px;
        height: 16px;
      }
      .content {
        padding: 6px;
        .row {
          font-size: 6px;
          margin-bottom: 4px;
        }
        .flex-column {
          font-size: 5px;
          gap: 2px;
          padding-left: 2px;
        }
        .txt-label {
          font-size: 7px;
        }
      }
    }
  }
  @media screen and (max-width: 767px) {
    width: 187px;
    height: 182px;
    margin-top: 35px;
    margin-left: 100px;
    margin-right: unset;
    position: relative;
  }
}
</style>
