<template lang="pug">
.xm-messages-users-list
  ul(@scroll="emitScroll")
    li(v-for="(group, index) in groupUsers", :key="index")
      .list-group(v-if="enableGrouping")
        p {{ index.toUpperCase() }}
      XAUsersListItem(
        v-for="user in group",
        :key="user.id",
        @click="$emit('selectUser', user)",
        :user="user",
        :isAllowSelect="isAllowSelect",
        :isAllowClick="isAllowClick",
        :isSelected="isUserSelected(user.id)",
        :onlineMembers="onlineMembers"
      )
</template>

<script>
import XAUsersListItem from '~/components/atoms/Messages/UsersListItem'

export default {
  name: 'XMMessagesUsersList',
  components: {
    XAUsersListItem,
  },
  props: {
    usersList: {
      type: Array,
      required: true,
      default: () => [],
    },
    onlineMembers: {
      type: Array,
      required: false,
      default: () => [],
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
    enableGrouping: {
      type: Boolean,
      required: false,
      default: true,
    },
    selectedUsers: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  computed: {
    groupUsers() {
      return this.usersList.reduce((a, u) => {
        const letter = u.username.charAt(0)
        const keyStore = a[letter] || (a[letter] = [])

        keyStore.push(u)

        return a
      }, {})
    },
  },
  methods: {
    isUserSelected(id) {
      return this.selectedUsers.some((u) => u.id === id)
    },
    emitScroll(e) {
      this.$emit('scroll', e)
    },
  },
}
</script>

<style lang="scss" scoped>
.xm-messages-users-list::v-deep {
  ul {
    height: 300px;
    padding-right: 36px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background-color: $tertiary;
    }

    &::-webkit-scrollbar-thumb {
      background-color: $dark-electric-blue;
      border-radius: 10px;
    }

    li {
      .list-group {
        padding: 8px 0;
        border-bottom: 0.5px solid rgba($davys-grey, 0.65);

        p {
          color: rgba($bright-gray, 0.6);
        }
      }

      .xa-users-list-item {
        padding: 12px 0;
      }
    }
  }
}
</style>
