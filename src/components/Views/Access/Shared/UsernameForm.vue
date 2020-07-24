<template lang="pug">
  div
    pre {{ $data }}
    formulate-input(
      type="text"
      name="username"
      id="input__username"
      placeholder="santiago1010"

      label="Nombre de usuario"
      :label-class="getLabelClass"

      :input-class="getInputClasses"

      :help-class="getHelpClass"

      validation="bail|required|min:5|max:10"
      @validation="performValidation($event)"
      :validation-messages="getValidationMessages"
      :errors-class="['errors-class']"
      error-behavior="live"
    )
</template>

<script>
export default {
  data () {
    return {
      validations: null,

      classes: {
        input: 'text-danger'
      }
    }
  },

  computed: {
    getLabelClass () {
      return ['text-success']
    },

    getHelpText () {
      return 'Nombre de usuario ya registrado'
    },
    getHelpClass () {
      return 'text-danger'
    },

    getInputClasses: () => (context, classes) => {
      console.log(classes)
      const newclasses = ['border-success'].concat(classes)
      console.log(newclasses)
      return newclasses
    },

    getValidationMessages () {
      return {
        required: 'El nombre de usuario es requerido'
      }
    }
  },

  methods: {
    performValidation (e) {
      this.validations = e
    }

  }
}
</script>

<style lang="scss">
$error-color: rgb(255, 71, 71);

.errors-class {
  padding: 0;
  list-style-type: none;
  color: $error-color;
}
</style>
