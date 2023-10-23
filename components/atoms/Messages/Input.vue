<template lang="pug">
.xa-input
  input(
    type="text",
    @input="emitInput",
    :placeholder="placeholder",
    v-model="currentValue"
  )
</template>

<script>
export default {
  name: 'XAInput',
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
      required: false,
    },
  },
  computed: {
    currentValue: {
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
.xa-input {
  position: relative;
  input {
    background-color: $secondary;
    width: 100%;
    padding: 16px;
    border: 1px solid $tertiary;
    border-radius: 4px;
    color: $white;
    font-size: 16px;
    line-height: 22px;
    &::placeholder {
      color: $grey-mute;
    }
  }
}
</style>