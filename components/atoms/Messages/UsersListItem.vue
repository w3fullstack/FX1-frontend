<template lang="pug">
.xa-users-list-item(@click.prevent="fnHandleClick")
  input(
		v-if="isAllowSelect"
    type="checkbox",
    :id="getUserId",
    v-model="isSelected",
    :value="getUserId"
  )
  label(:for="getUserId")
  .xa-users-list-item-avatar(:class="[getIsUserOnline ? 'online' : '']")
    img(
      v-if="getUserAvatar && getUserAvatar.PhotoURL",
      :src="getUserAvatar.PhotoURL"
    )
    .xa-users-list-item-default-avatar(v-else) {{ getUserName.charAt(0).toUpperCase() }}
  span {{ getUserName }}
</template>

<script>
export default {
  name: 'XAUsersListItem',
  props: {
    user: {
      type: Object,
      required: true,
      default: () => {},
    },
		isAllowSelect: {
			type: Boolean,
			required: false,
			default: true,
		},
    isAllowClick: {
      type: Boolean,
      required: false,
      default: false,
    },
    isSelected: {
      type: Boolean,
      required: true,
      default: false,
    },
    onlineMembers: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    getUserId() {
      return this.user?.id || ''
    },
    getUserName() {
      return this.user?.username || ''
    },
    getUserAvatar() {
      return this.user?.Avatar || {}
    },
    getIsUserOnline() {
      return this.onlineMembers.find((m) => m.User.id === this.getUserId)
    }
  },
	methods: {
		fnHandleClick() {
      this.isAllowClick && this.$emit('click', this.user)	
		}
	},
}
</script>

<style lang="scss" scoped>
.xa-users-list-item {
  display: flex;
  align-items: center;
	cursor: pointer;
  input[type='checkbox'] + label {
    display: block;
		margin-right: 12px;
    cursor: pointer;
  }
  input[type='checkbox'] {
    display: none;
  }
  input[type='checkbox'] + label:before {
    content: '';
    width: 24px;
    height: 24px;
    border: 2px solid #94a6aa;
    border-radius: 5px;
    display: inline-block;
    vertical-align: bottom;
    color: transparent;
    transition: 0.2s;
  }
  input[type='checkbox'] + label:active:before {
    transform: scale(0);
  }
  input[type='checkbox']:checked + label:before {
    background-color: $primary;
    border-color: $primary;
    color: $white;
    background-image: url('~/assets/images/v2/Messages/checked.svg');
    background-repeat: no-repeat;
    background-position: center;
  }
  &-avatar {
    display: flex;
    position: relative;
    margin-right: 12px;
    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
    }
  }
  &-default-avatar {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $primary;
    border-radius: 50%;
    font-weight: 300;
		font-size: 13px;
		line-height: 16px;
    text-transform: uppercase;
  }
  .online::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    bottom: -3px;
    right: -2px;
    background-color: #2ddc1e;
    border-radius: 50%;
    border: 3px solid $secondary-dark;
  }
  span {
		color: $white;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
  }
}
</style>