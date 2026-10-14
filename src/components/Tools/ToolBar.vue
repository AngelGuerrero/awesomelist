<template lang="pug">
.toolbar
  .toolbar__container
    b-button.my-2.btn__bg(
      :disabled='!showCompletedToDos && !$store.getters["todo/thereAreCompletedToDos"]',
      :variant='showCompletedToDos ? "primary" : "outline-primary"',
      size='sm',
      @click='toggleCompletedToDos()') {{ `${this.showCompletedToDos ? "Ocultar" : "Mostrar"} tareas completadas` }}
</template>

<script>
export default {
  name: 'ToolBar',

  props: {
    showCompletedToDos: { type: Boolean, default: false }
  },

  methods: {
    toggleCompletedToDos () {
      this.$emit('toggleCompletedToDos', !this.showCompletedToDos)
    }
  }
}
</script>

<style lang="scss" scoped>
.toolbar {
  padding: 0.5rem;

  &__container {
    padding: 0 0.8rem;
    border-radius: 5px;
    box-shadow: 2px 3px 5px 0px rgba(202, 191, 191, 0.75);
  }
}
</style>
