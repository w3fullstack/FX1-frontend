<template lang="pug">
.invite-modal
  img.invite-modal__close(
    @click="fnDecline",
    :src="require('~/assets/images/explore-event/close-modal.svg')"
  )
  h4.invite-modal__title You are invited!
  p.invite-modal__desc To join {{ getName }} group.
  b-button(type="is-primary", @click="fnJoinGroup", :disabled="isLoading") Join
  b-button.invite-modal__decline(type="button", @click="fnDecline", :disabled="isLoading")
    span Decline
</template>

<script>
export default {
  name: 'XDInviteMessagesMember',
  props: {
    details: {
      type: Object,
      required: true,
      default: () => {},
    },
    onAction: {
      type: Function,
      required: false,
      default: () => {},
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    getGroup() {
      return this.details.group
    },
    getName() {
      return this.details.name
    },
    getChannelID() {
      return this.getGroup.split(':')[1]
    },
  },
  methods: {
    async fnJoinGroup() {
      try {
        this.isLoading = true

        await this.$api.acceptPrivateEncryptedChannelInvitation({
          channelID: this.getChannelID,
        })

        this.$toast.success(`You're successfully joined to group ${this.getName}`, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-success',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } catch (error) {
        if (error.message.startsWith('You\'ve already responded to this invitation.')) {
          return this.$toast.error('You\'ve already responded to this invitation.', {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-error',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        }

        this.$toast.error(error.message, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } finally {
        this.$parent.close()
        this.onAction()

        this.isLoading = false
      } 
    },
    async fnDecline() {
      try {
        this.isLoading = true

        await this.$api.declinePrivateEncryptedChannelInvitation({
          channelID: this.getChannelID,
        })

        this.$toast.success('You\'re successfully declined invitation', {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-success',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } catch (error) {
        if (error.message.startsWith('You\'ve already responded to this invitation.')) {
          return this.$toast.error('You\'ve already responded to this invitation.', {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-error',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        }

        this.$toast.error(error.message, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } finally {
        this.$parent.close()
        this.onAction()

        this.isLoading = false
      }
    },
  },
}
</script>

<style scoped lang="scss">
.invite-modal {
  position: relative;
  background-color: $secondary;
  padding: 40px 60px 60px;
  display: grid;
  gap: 24px;
  color: #ffffff;
  font-family: 'Rotunda', sans-serif;
  font-style: normal;

  &__close {
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 16px;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    line-height: normal;
  }

  button {
    height: 40px;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  &__desc {
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.5px;
  }

  &__decline {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    border: 1px solid #ffffff;
    &:disabled {
      opacity: .5;
      pointer-events: none;
    }
  }
}
</style>
