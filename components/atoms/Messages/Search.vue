<template lang="pug">
.xa-messages-search
  nuxt-img.icon(src="/v2/Messages/search.svg", width="20", height="20")
  input(
    @input="emitInput",
    type="text",
    :placeholder="placeholder",
    v-model="searchValue"
  )
</template>

<script>
export default {
  name: 'XAMessagesSearch',
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'Search',
    },
  },
  computed: {
    searchValue: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('update:value', value)
      },
    },
  },
  methods: {
    emitInput(e) {
      this.$emit('input', e)
    },
  },
}
</script>

<style lang="scss" scoped>
.xa-messages-search {
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    left: 14px;
    transform: translateY(-50%);
  }

  input {
    background-color: $secondary;
    padding: 8px 12px;
    padding-left: 44px;

    height: 44px;
    width: 100%;

    border: 1px solid $tertiary;
    border-radius: 4px;

    color: $grey-mute;
    font-size: 14px;

    &::placeholder {
      opacity: 0.8;
      color: $grey-mute;
    }
  }
}
</style>
