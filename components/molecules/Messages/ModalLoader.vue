<template lang="pug">
.xm-modal-loader
  XALoader(:size="36")
  p(v-if="title") {{ title }}
</template>

<script>
import XALoader from '~/components/atoms/Loader'

export default {
  name: 'XMModalLoader',
	components: {
		XALoader
	},
  props: {
    title: {
      type: String,
      required: false,
      default: '',
    }
  }
}
</script>

<style lang="scss" scoped>
.xm-modal-loader::v-deep {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: fit-content;
  background-color: $secondary_c;
  margin: 0 auto;
  padding: 16px 20px;
  border-radius: 10px;
  .xa-loader {
    position: relative;
    border: 5px solid $white;
    border-bottom-color: transparent;
  }
  p {
    color: $white;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
  }
}
</style>
