<template lang="pug">
XMModalLoader(
  v-if="isLoading",
  :title="isEditing ? 'Saving group...' : 'Creating group...'"
)
.xd-create-private-group.card(v-else, :class="[isEdit && 'editing']")
  .card-content
    .close(@click.prevent="$parent.close()"): img(
      :src="require('~/assets/images/explore-event/close-modal.svg')"
    )
    .step-1(v-if="step === 1")
      h3 {{ getStepOneTitle }}
      p.selected-users(v-if="!isOneToOne") {{ selectedUsers.length }}/{{ maxSelectUsers }}
      XAMessagesSearch.search-container(
        @input="filterAvailableUsers",
        :value.sync="search"
      )
      .hint(v-if="!isOneToOne")
        p Find members below or invite new friends once your group is created.
      .create-group(v-else-if="!isEditing", @click="fnSwitchMode")
        nuxt-img.icon(
          src="/v2/Messages/create-group.svg",
          width="24",
          height="24"
        )
        p Create group
      .content-wrapper
        XMUsersList(
          v-if="usersList.length",
          @scroll="fnHandleScrollList",
          :usersList="usersList",
          :onlineMembers="getOnlineMembers",
          :isAllowSelect="!isOneToOne || isEditing",
          :isAllowClick="true"
          :selectedUsers="selectedUsers",
          v-on:selectUser="fnSelectUser"
        )
        p.not-found(v-else-if="!isSearchingUsers") Nothing was found
        XALoader(v-if="isSearchingUsers")
      .content-actions(v-if="!isOneToOne || isEditing")
        b-button.is-uppercase(
          type="is-text",
          @click="fnHandleCancelFirstStep",
          expanded
        ) Cancel
        b-button.is-uppercase(
          @click="fnHandleSecondStep",
          type="is-primary",
          expanded,
          :disabled="isButtonCreateGroupNextDisabled"
        ) {{ isEditing ? 'Add' : 'Next' }}
    .step-2.flex-column(v-if="step === 2")
      .step-title.row.items-center
        h3 {{ getStepSecondTitle }}
        nuxt-img.icon(
          v-if="isEditing && !isEdit",
          @click="isEdit = true",
          src="/v2/Messages/pencil.svg",
          width="24",
          height="24"
        )
      .group-specifics.row.items-center
        XODefaultUploadAvatar(
          :avatar="avatarUrl",
          :isAllowEditing="isEdit",
          :avatarColors="getChannelColor",
          :name="avatarUrl ? '' : getChannelName",
          v-on:uploadAvatar="fnUploadAvatar",
          v-on:deleteAvatar="fnDeleteAvatar"
        )
        XAInput(
          v-if="!isEditing || isEdit",
          placeholder="Group name (required)",
          :value.sync="groupName"
        )
        p.group-specifics-name(v-else) {{ groupName }}
      .notifications.row.justify-between.items-center(
        @click.prevent="isNotifications = !isNotifications"
        v-if="isEditing && !isEdit"
      )
        p Notifications
        XASwitch(:value.sync="isNotifications")
      .selected-members
        p.members-count {{ selectedUsers.length }} Members
        b-button.button-manage-members(
          v-if="isEdit",
          type="is-white",
          outlined,
          expanded,
          @click="fnHandleManageMembers"
        )
          nuxt-img.icon(v-if="isManageMembers", src="/v2/Messages/plus.svg")
          | {{ isManageMembers ? 'Add members' : 'Manage members' }}
        .group-members.row.justify-between.items-center(v-if="isManageMembers")
          p.text-uppercase Group memebers
          p.group-members-count {{ selectedUsers.length }} / {{ maxSelectUsers }}
        XMUsersList(
          :usersList="getSecondStepUsersList",
          :onlineMembers="getOnlineMembers",
          :isAllowSelect="isEdit && isManageMembers",
          :isAllowClick="isManageMembers"
          :selectedUsers="selectedUsers",
          :enableGrouping="false",
          v-on:selectUser="fnSelectUser"
        )
      .content-actions(v-if="!isEditing || (isEditing && isEdit)")
        b-button.is-uppercase(
          type="is-text",
          @click="fnHandleCancelSecondStep",
          expanded
        ) {{ isEditing ? 'Cancel' : 'Back' }}
        b-button.button-create-group.is-uppercase(
          @click="fnHandleSubmit",
          type="is-primary",
          expanded,
          :disabled="isButtonCreateGroupDisabled"
        ) {{ isEditing ? 'Save' : 'Create' }}
</template>

<script>
import debounce from 'lodash/debounce'
import xor from 'lodash/xor'
import { mapGetters } from 'vuex'
import XAMessagesSearch from '~/components/atoms/Messages/Search'
import XMUsersList from '~/components/molecules/Messages/UsersList'
import XALoader from '~/components/atoms/Loader'
import XMModalLoader from '~/components/molecules/Messages/ModalLoader'
import XODefaultUploadAvatar from '~/components/organisms/Default/UploadAvatar'
import XAInput from '~/components/atoms/Messages/Input'
import XASwitch from '~/components/atoms/Forms/Switch'
import dialogs from '~/mixins/dialogs'

export default {
  name: 'XDPasswordUpdated',
  components: {
    XAMessagesSearch,
    XMUsersList,
    XALoader,
    XMModalLoader,
    XODefaultUploadAvatar,
    XAInput,
    XASwitch,
  },
  mixins: [dialogs],
  props: {
    details: {
      type: Object,
      required: false,
      default: () => {},
    },
    onCreate: {
      type: Function,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      step: 1,
      isSearchingUsers: false,
      isLoading: false,
      isManageMembers: false,
      isEdit: false,
      search: '',
      usersList: [],
      alreadyAddedUsersList: [],
      usersNext: null,
      usersCount: null,
      mode: '1-to-1',
      selectedUsers: [],
      maxSelectUsers: 50,
      isNotifications: false,
      groupName: '',
      avatarId: null,
    }
  },
  computed: {
    ...mapGetters({
      getOnlineMembers: 'app/getOnlineMembers',
    }),
    isOneToOne() {
      return this.mode === '1-to-1'
    },
    isButtonCreateGroupNextDisabled() {
      return !this.selectedUsers.length
    },
    isAvatarChanged() {
      return this.getChannelObjectID !== this.avatarId
    },
    isChannelNameChanged() {
      return this.getChannelName !== this.groupName
    },
    isMembersChanged() {
      return !!xor(
        this.getChannelJoiners.map((u) => u.id),
        this.selectedUsers.map((u) => u.id)
      ).length
    },
    isButtonCreateGroupDisabled() {
      return (
        !this.groupName ||
        this.isLoading ||
        !this.selectedUsers.length ||
        (this.isEditing &&
          !this.isAvatarChanged &&
          !this.isChannelNameChanged &&
          !this.isMembersChanged)
      )
    },
    isEditing() {
      return !!this.details?.id
    },
    getSecondStepUsersList() {
      return this.isEditing ? this.alreadyAddedUsersList : this.selectedUsers
    },
    getChannelId() {
      return this.details.id
    },
    getChannelName() {
      return this.details.name
    },
    getChannelObjectID() {
      return this.details.objectID || null
    },
    getChannelJoiners() {
      return this.details.joiners.map(({ User, ...rest }) => ({
        ...rest,
        ...User,
      }))
    },
    getChannelColor() {
      return this.details.channelColor
    },
    getStepOneTitle() {
      if (this.isEditing) {
        return 'Select memebers'
      } else if (this.isOneToOne) {
        return 'Start messaging'
      } else {
        return 'Select members'
      }
    },
    getStepSecondTitle() {
      if (this.isEdit) {
        return 'Edit group'
      } else if (this.isEditing) {
        return 'Group settings'
      } else {
        return 'Name group'
      }
    },
    avatarUrl() {
      return this.avatarId
        ? `https://api.dev.fx1.io/photos/0/${this.avatarId}.webp`
        : ''
    },
  },
  async mounted() {
    try {
      if (this.isEditing) {
        this.fnChangeStep(2)
        this.avatarId = this.getChannelObjectID
        this.groupName = this.getChannelName

        this.alreadyAddedUsersList = structuredClone(this.getChannelJoiners)
        this.selectedUsers = structuredClone(this.getChannelJoiners)
      }

      const { items, next, count } = await this.fnLoadUsers()

      this.usersList = items
      this.usersNext = next
      this.usersCount = count
    } catch (error) {}
  },
  methods: {
    async fnLoadUsers(params) {
      try {
        this.isSearchingUsers = true

        const {
          getAvailableUsersForPrivateEncryptedChannel: { items, next, count },
        } = await this.$api.getAvailableUsersForPrivateEncryptedChannel({
          group: null,
          ...params,
        })

        return {
          items,
          next,
          count,
        }
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 3000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      } finally {
        this.isSearchingUsers = false
      }
    },
    filterAvailableUsers: debounce(async function () {
      try {
        this.usersList = []

        const { items, next, count } = await this.fnLoadUsers({
          name: this.search,
        })

        this.usersList = items
        this.usersNext = next
        this.usersCount = count
      } catch (error) {
        this.$toast.error(error.message, {
          duration: 3000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      }
    }, 500),
    async fnSelectUser(user) {
      const findUser = this.selectedUsers.find((u) => u.id === user.id)

      if (this.isOneToOne && !this.isEditing) {
        await this.fnCreateGroup({
          name: 'Private Channel',
          userIDs: [user.id],
        })
      } else {
        if (this.selectedUsers.length >= this.maxSelectUsers && !findUser) {
          return this.$toast.error(
            "You're out of the limit of max members to invite",
            {
              duration: 3000,
              position: 'bottom-left',
              className: 'fx1-error',
              iconPack: 'mdi',
              icon: 'alert-circle-outline',
            }
          )
        }

        if (findUser) {
          this.selectedUsers = this.selectedUsers.filter(
            (u) => u.id !== user.id
          )
        } else {
          this.selectedUsers.push(user)
        }
      }
    },
    async fnHandleScrollList(e) {
      const bottomOfElement =
        e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight

      if (
        bottomOfElement &&
        !this.isSearchingUsers &&
        (this.usersCount ?? true)
      ) {
        const { items, next, count } = await this.fnLoadUsers({
          name: this.search,
          next: this.usersNext,
        })

        this.usersList.push(...items)
        this.usersNext = next
        this.usersCount = count
      }
    },
    fnChangeStep(step) {
      this.step = step
    },
    fnSwitchMode() {
      if (this.isEditing) {
        this.fnChangeStep(2)
      } else {
        this.mode = this.mode === 'create-group' ? '1-to-1' : 'create-group'

        if (this.mode === '1-to-1') {
          this.selectedUsers = []
        }
      }
    },
    fnHandleSecondStep() {
      this.fnChangeStep(2)

      if (this.isEditing) {
        this.alreadyAddedUsersList = this.selectedUsers
      }
    },
    fnHandleCancelFirstStep() {
      if (this.isEditing) {
        this.fnChangeStep(2)

        // Set previous data
        this.alreadyAddedUsersList = structuredClone(this.getChannelJoiners)
        this.selectedUsers = structuredClone(this.getChannelJoiners)
      } else {
        this.$parent.close()
      }
    },
    fnHandleCancelSecondStep() {
      if (this.isEditing) {
        if (this.isManageMembers) {
          this.isManageMembers = false

          // Set previous data on close manage members
          this.alreadyAddedUsersList = structuredClone(this.getChannelJoiners)
          this.selectedUsers = structuredClone(this.getChannelJoiners)
        } else if (this.isEdit) {
          this.isEdit = false
          this.isManageMembers = false

          // Set previous data on finally close
          this.avatarId = this.getChannelObjectID
          this.groupName = this.getChannelName
        }
      } else {
        this.fnChangeStep(1)
      }
    },
    fnHandleManageMembers() {
      if (this.isManageMembers) {
        this.fnChangeStep(1)
        this.mode = 'create-group'
      } else {
        this.isManageMembers = true
      }
    },
    fnUploadAvatar(e) {
      this.fnShowEditAvatarNewDialog(e, ({ id }) => {
        try {
          setTimeout(() => {
            this.avatarId = id
          }, 500)
        } catch (error) {
          this.$toast.error(error.message, {
            duration: 5000,
            position: 'bottom-left',
            className: 'fx1-error',
            iconPack: 'mdi',
            icon: 'alert-circle-outline',
          })
        }
      })
    },
    fnDeleteAvatar() {
      this.avatarId = null
    },
    async fnCreateGroup({ name, userIDs }) {
      try {
        this.isLoading = true

        const ChannelPhoto = {
          objectID: this.avatarId,
          objectType: 'Photo',
        }

        const { createPrivateEncryptedChannel } =
          await this.$api.createPrivateEncryptedChannel({
            input: {
              name,
              ChannelPhoto: this.avatarId && ChannelPhoto,
              userIDs,
            },
          })

        this.onCreate(createPrivateEncryptedChannel)

        this.$toast.success('Group successfully created', {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-success',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })

        this.$parent.close()
      } catch (error) {
        this.isLoading = false

        this.$toast.error(error.message, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      }
    },
    async fnUpdateGroup({ addedUserIDs, removedUserIDs }) {
      try {
        this.isLoading = true

        // TODO change group name and avatar

        if (this.isMembersChanged) {
          await this.$api.manageChannelMembers({
            channelID: this.getChannelId,
            addedUserIDs,
            removedUserIDs,
          })
        }

        this.onCreate()

        this.$toast.success('Group successfully saved', {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-success',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })

        this.$parent.close()
      } catch (error) {
        this.isLoading = false

        this.$toast.error(error.message, {
          duration: 5000,
          position: 'bottom-left',
          className: 'fx1-error',
          iconPack: 'mdi',
          icon: 'alert-circle-outline',
        })
      }
    },
    async fnHandleSubmit() {
      if (this.isEditing) {
        await this.fnUpdateGroup({
          addedUserIDs: this.selectedUsers.map((u) => u.id),
          removedUserIDs: this.getChannelJoiners.map((u) => u.id),
        })
      } else {
        await this.fnCreateGroup({
          name: this.groupName,
          userIDs: this.selectedUsers.map((u) => u.id),
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.xd-create-private-group::v-deep {
  background-color: $secondary_c;
  color: $white;
  padding: 40px 60px;
  .card-content {
    padding: 0;
    .close {
      position: absolute;
      right: 21px;
      top: 21px;
      cursor: pointer;
    }
    h3 {
      color: $white;
      font-weight: 700;
      font-size: 20px;
      line-height: 22px;
      letter-spacing: unset;
    }
    p {
      font-size: 16px;
      line-height: 20px;
    }
    .content-actions {
      display: flex;
      gap: 20px;
      margin-top: 24px;
      button {
        height: auto;
        padding: 12px;
        font-size: 14px;
        line-height: 18px;
      }
      .is-text {
        color: $white;
        text-decoration: none;
        &:hover,
        &:active,
        &:focus {
          color: hsl(0, 0%, 29%);
        }
      }
      .button-create-group {
        &:disabled {
          background-color: $arsenic;
          border-color: $arsenic;
          color: $spanish-gray;
        }
      }
    }
    .step-1 {
      .selected-users {
        margin-top: 8px;
      }
      .search-container {
        margin-top: 24px;
      }
      .hint {
        margin: 12px 0;
        p {
          color: rgba($white, 0.48);
          font-weight: 400;
          font-size: 14px;
          line-height: 22px;
        }
      }
      .create-group {
        display: flex;
        align-items: center;
        gap: 12px;
        cursor: pointer;
        margin: 24px 0;
        p {
          font-weight: 400;
          font-size: 16px;
        }
      }
      .content-wrapper {
        position: relative;
        height: 300px;
        margin-top: 28px;
        .not-found {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      }
    }
    .step-2 {
      .step-title {
        gap: 24px;
        img {
          cursor: pointer;
        }
      }
      .group-specifics {
        gap: 24px;
        margin-top: 24px;
        .xo-default-upload-avatar {
          .avatar {
            width: 100px;
            height: 100px;

            &:hover {
              .camera {
                background-color: rgba($black, 0.5);
              }
            }
            .camera {
              background-color: rgba($secondary, 0.5);
              transition: background-color 250ms ease, opacity 250ms ease;

              img {
                width: 50px;
                height: 50px;
              }
            }
          }
        }

        .xa-input {
          flex-grow: 1;
        }
        &-name {
          font-size: 20px;
        }
      }
      .notifications {
        background-color: $secondary;
        margin: 40px 0 8px 0;
        padding: 12px 16px;
        cursor: pointer;
        p {
          font-family: $tertiary-font;
        }
      }
      .selected-members {
        .members-count {
          margin: 32px 0 16px 0;
          color: $dark-white;
          font-size: 14px;
          text-transform: uppercase;
        }
        .button-manage-members {
          max-width: 206px;
          min-height: 44px;
          margin-bottom: 16px;
          padding: 12px 32px;
          font-size: 14px;
          line-height: 18px;
          &:hover,
          &:focus {
            background-color: unset;
            color: $white;
          }
          span {
            display: inline-flex;
            align-items: center;
            gap: 13px;
            img {
              width: 24px;
              height: 24px;
              margin: unset;
            }
          }
        }
        .group-members {
          margin: 24px 0 16px 0;
          p {
            color: $dark-white;
          }
          &-count {
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>
