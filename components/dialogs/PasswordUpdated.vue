<template lang="pug">
.xd-password-updated.card(v-click-outside="() => $parent.close()")
  .card-content
    .close(@click.prevent="$parent.close()"): img(
      :src="require('~/assets/images/explore-event/close-modal.svg')"
    )
    h3 Success
    p.text-weight-regular Your password is successfully updated.
    .actions
      b-button.is-uppercase(@click="$parent.close()", type="is-primary", expanded) Ok
</template>

<script>
export default {
  name: 'XDPasswordUpdated',
}
</script>
	
<style lang="scss" scoped>
.xd-password-updated {
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