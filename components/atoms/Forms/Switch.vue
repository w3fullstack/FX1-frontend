<template lang="pug">
label.xa-switch
  input(type="checkbox", @change="emitCheckbox", v-model="currentValue")
  span.slider
</template>

<script>
export default {
  name: 'XASwitch',
  props: {
    value: {
      type: Boolean,
      required: true,
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
    emitCheckbox(e) {
      this.$emit('change', e)
    },
  },
}
</script>

<style lang="scss" scoped>
.xa-switch {
  display: inline-flex;
  align-items: center;
  position: relative;
  width: 40px;
  height: 24px;
  input {
    display: none;
    &:checked + .slider {
      background-color: $purples;
    }
    &:focus + .slider {
      box-shadow: 0 0 1px $purples;
    }
    &:checked + .slider {
      &::before {
        transform: translate(100%, -50%);
      }
    }
  }
  .slider {
    position: relative;
    width: 100%;
    height: 14px;
    background-color: $dark-white;
    border-radius: 34px;
    transition: background-color 400ms ease;
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      height: 20px;
      width: 20px;
      top: 50%;
      background-color: $white;
      border-radius: 50%;
      transform: translateY(-50%);
      transition: transform 400ms ease;
    }
  }
}
</style>