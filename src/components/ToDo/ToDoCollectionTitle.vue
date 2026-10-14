<template lang="pug">
.collection-title
  h1.h3(:style='{ color: list.accentColor }')
    input.collection-title__input(v-if='editing' ref='nameInput' v-model='editing.name' maxlength='200' :disabled='editing.saving' aria-label='Nombre de la colección' @keydown.enter.prevent='saveName' @keydown.esc.prevent='cancelEdit' @blur='saveName')
    span.collection-title__text(v-else role='button' tabindex='0' title='Editar nombre de la colección' @click='editName' @keydown.enter.prevent='editName' @keydown.space.prevent='editName') {{ list.title }}
  .text-danger.mb-2(v-if='editing && editing.error' role='alert') {{ editing.error }}
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    list: { type: Object, required: true }
  },

  data () {
    return { editing: null }
  },

  computed: {
    ...mapState('user', ['currentUser'])
  },

  watch: {
    'list.collectionId' () { this.editing = null },
    currentUser () { this.editing = null }
  },

  methods: {
    ...mapActions('todo', ['renameCollection']),

    async editName () {
      this.editing = { id: this.list.collectionId, name: this.list.title, originalName: this.list.title, saving: false, error: null }
      await this.$nextTick()
      if (!this.$refs.nameInput) return
      this.$refs.nameInput.focus()
      this.$refs.nameInput.select()
    },

    cancelEdit () {
      if (this.editing && !this.editing.saving) this.editing = null
    },

    async saveName () {
      const draft = this.editing
      if (!draft || draft.saving) return
      const name = draft.name.trim()
      if (!name || name.length > 200) {
        draft.error = 'El nombre debe tener entre 1 y 200 caracteres'
        return
      }
      if (name === draft.originalName) {
        this.editing = null
        return
      }
      draft.saving = true
      draft.error = null
      try {
        const result = await this.renameCollection({ id: draft.id, name })
        if (this.editing !== draft) return
        if (result.error) draft.error = result.message || 'No se pudo guardar el nombre. Inténtalo de nuevo.'
        else this.editing = null
      } catch (error) {
        if (this.editing === draft) draft.error = 'No se pudo guardar el nombre. Inténtalo de nuevo.'
      } finally {
        draft.saving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collection-title__text {
  cursor: text;
}

.collection-title__input {
  width: 100%;
  font: inherit;
  color: inherit;
  padding: 0;
  border: 0;
  border-bottom: 1px solid $header_bg_color;
  background: transparent;
}
</style>
