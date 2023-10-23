<template lang="pug">
.xd-email-confirmation.card(v-click-outside="() => $parent.close()")
  .card-content
    .close(@click.prevent="$parent.close()"): img(
      :src="require('~/assets/images/explore-event/close-modal.svg')"
    )
    h3 Email confirmation
    p.text-weight-regular Please confirm your email address by clicking the link we have just emailed to "{{ email }}"
    .actions
      b-button.is-uppercase(
        @click="fnSubmit",
        type="is-primary",
        expanded
      ) Ok
</template>

<script>
export default {
  name: 'XDPasswordUpdated',
	props: {
    email: { 
			type: String,
			default: '',
			require: true,
		},
		onSubmit: {
			type: Function,
			default: null,
		},
  },
	methods: {
		fnSubmit() {
			this.$parent.close()
			this.onSubmit()
		},
	}
}
</script>

<style lang="scss" scoped>
.xd-email-confirmation {
  background-color: $secondary;
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
      margin-bottom: 30px;
      font-weight: 700;
      font-size: 20px;
      line-height: 22px;
      letter-spacing: unset;
      color: $white;
      margin-bottom: 20px;
    }
    p {
      font-size: 16px;
      line-height: 20px;
    }
    .actions {
      margin-top: 24px;
      button {
        height: 40px;
        font-size: 14px;
        line-height: 18px;
      }
    }
  }
}
</style>
