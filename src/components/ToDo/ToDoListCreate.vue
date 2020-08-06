<template lang="pug">
  //- Modal
  vs-dialog(overflow-hidden
            prevent-close
            v-model="modalCreateNewList.show")
    template(#header)
      h6(class="font-weight-bolder text-primary") Nueva lista

    //- Default content
    div(class="w-100 h-100")
      formulate-form(@submit="createNewList()")
        formulate-input(type="text"
                        id="listname"
                        name="listname"
                        v-model="listname"
                        placeholder="Mi asombrosa lista"

                        @validation="validations = $event"
                        validation="bail|required|max:20"
                        :validation-messages="getCustomValidationMessages"
        )

    template(#footer)
      div
        b-button(variant="dark"
                size="sm"
                @click="setModalCreateNewList(false)") Cancelar
        b-button(v-if="!validations.hasErrors"
                size="sm"
                variant="primary"
                @click="createNewList"
                class="float-right") Crear lista
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data () {
    return {
      validations: {},

      listname: ''
    }
  },

  computed: {
    ...mapState('ui', [
      'modalCreateNewList'
    ]),

    getCustomValidationMessages () {
      return {
        required: 'El nombre de la lista es requerido.',
        max: context => `El nombre de la lista no debe rebasar los ${context.args[0]} carácteres de longitud.`
      }
    }
  },

  methods: {
    ...mapMutations('ui', [
      'setModalCreateNewList'
    ]),

    createNewList () {
      console.log('creating new list')
      console.log(`'${this.listname.trimRight()}'`)
    }
  }
}
</script>
