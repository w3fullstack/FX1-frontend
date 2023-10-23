<template lang="pug">
.xo-account-delete
	.edit-panel
		.panel-title
			h3 Delete account
	.warning
			img(
				src="~assets/images/Account/info.svg"
			)
			p
				span This action is irreversible. 
				| Your account will be permanently deleted.
	.action
		b-button.is-uppercase(
			@click="fnDeleteAccountDialog()"
			type="is-white",
			outlined,
		) Delete account
</template>
		
<script>
import dialogs from '~/mixins/dialogs'

export default {
  name: 'XOAccountDelete',
  mixins: [dialogs]
}
</script>
	
<style lang="scss" scoped>
.xo-account-delete::v-deep {
  .warning {
    display: flex;
    align-items: center;
    gap: 12px;
		margin-top: 24px;
		p {
			span {
				color: $primary;
			}
		}
  }
	.action {
		margin-top: 24px;
	}
}
</style>