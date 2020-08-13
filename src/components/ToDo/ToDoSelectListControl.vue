<template lang="pug">
  //- To Do: Mostrar únicamente si se está en el modo de seleccionar las tareas
  #selectListControl
    .close
      .close__icon
        b-icon(icon="x")
    .content(class="mt-2")
      b-form(inline class="justify-content-between")
        label(class="mr-sm-2" for="inline-form-custom-select-pref") Mover a
        b-form-select(class="w-50" :options="options")
        b-button(variant="primary" size="sm") Aplicar

</template>

<script>
export default {
  data () {
    return {
      options: [
        { value: null, text: 'Selecciona una lista' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
#selectListControl {
  width: 100%;
  border-top: 1px solid lightgray;
  background-color: white;

  position: fixed;
  z-index: 8;
  bottom: 0;
  left: 0;

  .content {
    max-width: 600px;
    padding: 15px;
    margin: auto;
  }
}

.close__icon {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin: 6px;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
