<template lang="pug">
  #selectListControl
    .close.border(@click="toggleMoveToDoListActive")
      .close__icon
        b-icon(icon="x")
    .content
      b-form(inline class="justify-content-between")
        label(class="mr-sm-2" for="inline-form-custom-select-pref") Mover a
        b-form-select(class="w-50" :options="options")
        b-button(variant="primary" size="sm") Aplicar
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      options: [
        { value: null, text: 'Selecciona una lista' }
      ]
    }
  },

  computed: {
    ...mapState('ui', [
      'moveToDoToList'
    ])
  },

  methods: {
    ...mapMutations('ui', [
      'toggleMoveToDoListActive'
    ])
  }
}
</script>

<style lang="scss" scoped>
#selectListControl {
  width: 100%;
  height: $selectListControlHeight;
  border-top: 1px solid lightgray;
  background-color: white;

  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  z-index: 8;
  bottom: 0;
  left: 0;

  .content {
    width: 50%;
    max-width: 600px;
  }
}

.close {
  position: absolute;
  top: 7px;
  right: 7px;
}

.close__icon {
  cursor: pointer;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  // margin: 6px;
  background-color: black;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
