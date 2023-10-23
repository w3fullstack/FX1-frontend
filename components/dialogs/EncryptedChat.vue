<template lang="pug">
.xd-encrypted-chat.card(v-click-outside="() => $parent.close()")
  .card-content
    .close(@click.prevent="$parent.close()"): img(
      :src="require('~/assets/images/explore-event/close-modal.svg')"
    )
    h3 You are encrypted!
    p.text-weight-regular
      | Only you and the people your chatting with can read your messages.
      | We use end-to-end encryption for your safety and privacy.
    .actions
      b-button.is-uppercase(@click="$parent.close()", type="is-primary", expanded) Got it
</template>

<script>
export default {
  name: 'XDEncryptedChat',
}
</script>
	
<style lang="scss" scoped>
.xd-encrypted-chat {
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