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
                        placeholder="Escribe el nombre de la lista"

                        @validation="validations = $event"
                        validation="bail|required|max:20"
                        :validation-messages="getCustomValidationMessages"
        )

    template(#footer)
      div(class="d-flex row-v-center justify-content-between")
        vs-button(dark
                  transparent
                  @click="setModalCreateNewList(false)") Cancelar

        vs-button(primary
                  transparent
                  :disabled="validations.hasErrors"
                  @click="createNewList") Crear lista
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
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

    ...mapState('user', [
      'currentUser'
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

    ...mapActions('todo', [
      'saveNewList'
    ]),

    async createNewList () {
      console.log(`'${this.listname.trim()}'`)

      const list = {
        title: this.listname.trim(),
        created: new Date(),
        lastUpdated: new Date(),
        userId: this.currentUser.uid
      }

      const getval = await this.saveNewList(list)

      if (getval.error) return

      this.listname = ''
      this.setModalCreateNewList(false)
    }
  }
}
</script>
