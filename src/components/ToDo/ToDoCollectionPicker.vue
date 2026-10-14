<template lang="pug">
b-list-group.my-2
  b-list-group-item.p-2
    .d-flex.align-items-center.mb-2
      b-icon.picker__icon.mr-3(icon='files')
      span Colección
    b-button.picker__trigger.w-100.d-flex.align-items-center.justify-content-between.text-left(variant='light' :disabled='isMoving' aria-haspopup='dialog' :aria-controls='modalId' @click='openPicker')
      span.text-truncate {{ selectedName }}
      b-spinner.ml-2(v-if='isMoving' small label='Guardando colección')
      b-icon.picker__icon.ml-2(v-else icon='chevron-down')
    small.text-danger(v-if='collectionsError') No se pudieron cargar las colecciones.
    b-modal(:id='modalId' v-model='modalVisible' title='Cambiar colección' header-close-label='Cerrar' centered size='sm' :hide-header-close='isMoving' :no-close-on-backdrop='isMoving' :no-close-on-esc='isMoving' @shown='focusSearch' @hidden='clearSearch')
      p.text-muted.mb-3 Elige una colección para esta tarea.
      .picker__search.d-flex.align-items-center.mb-3
        b-icon.picker__icon.text-muted.mr-2(icon='search')
        input.picker__search-input.w-100(ref='searchInput' v-model='search' type='search' placeholder='Buscar colección' aria-label='Buscar colección' :disabled='isMoving')
      .text-center.py-4(v-if='collectionsLoading')
        b-spinner(small label='Cargando colecciones')
        span.ml-2 Cargando colecciones…
      .text-center.py-3(v-else-if='collectionsError' role='alert')
        p.text-danger No se pudieron cargar las colecciones.
        b-button(variant='outline-primary' size='sm' @click='retry') Reintentar
      .picker__options(v-else role='group' aria-label='Colecciones disponibles' :aria-busy='isMoving ? "true" : "false"')
        b-button.picker__option.w-100.d-flex.align-items-center.text-left.mb-1(v-for='option in filteredOptions' :key='option.value || "unassigned"' variant='light' :class='{ "picker__option--selected": option.value === selectedCollectionId }' :aria-pressed='option.value === selectedCollectionId' :disabled='isMoving || option.disabled' @click='moveToCollection(option.value)')
          b-icon.picker__icon.mr-3(:icon='option.value ? "files" : "folder"')
          span.text-truncate.flex-grow-1 {{ option.text }}
          b-icon.picker__icon.ml-2(v-if='option.value === selectedCollectionId' icon='check2')
        p.text-muted.text-center.py-3.mb-0(v-if='filteredOptions.length === 0' role='status') No hay colecciones que coincidan.
      p.text-danger.mt-3.mb-0(v-if='moveError' role='alert') {{ moveError }}
      template(#modal-footer)
        b-button(variant='outline-secondary' size='sm' :disabled='isMoving' @click='modalVisible = false') Cancelar
</template>

<script>
import { BModal } from 'bootstrap-vue'
import { mapState, mapActions } from 'vuex'

const searchable = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export default {
  components: { BModal },
  props: { todo: { type: Object, required: true } },
  data () {
    return { selectedCollectionId: null, isMoving: false, modalVisible: false, search: '', moveError: null }
  },
  computed: {
    ...mapState('todo', ['collections', 'collectionsLoading', 'collectionsError']),
    ...mapState('user', ['currentUser']),
    modalId () { return `task-collection-${this.todo.id}` },
    selectedName () {
      const option = this.options.find(option => option.value === this.selectedCollectionId)
      return option ? option.text : 'Sin colección'
    },
    options () {
      const options = [{ value: null, text: 'Sin colección' }]
      const currentId = this.todo.collectionId || null
      if (currentId && !this.collections.some(collection => collection.id === currentId)) {
        options.push({ value: currentId, text: 'Colección no disponible', disabled: true })
      }
      return options.concat(this.collections.map(collection => ({ value: collection.id, text: collection.name })))
    },
    filteredOptions () {
      const query = searchable(this.search.trim())
      return this.options.filter(option => searchable(option.text).includes(query))
    }
  },
  watch: {
    todo: {
      immediate: true,
      deep: true,
      handler (todo) { this.selectedCollectionId = todo.collectionId || null }
    },
    'todo.id' () {
      this.modalVisible = false
      this.moveError = null
      this.search = ''
    }
  },
  methods: {
    ...mapActions('todo', ['moveToDoToCollection', 'getCollections']),
    openPicker () {
      this.search = ''
      this.moveError = null
      this.modalVisible = true
    },
    focusSearch () { if (this.$refs.searchInput) this.$refs.searchInput.focus() },
    clearSearch () { this.search = '' },
    retry () { this.getCollections(this.currentUser ? this.currentUser.uid : null) },
    async moveToCollection (collectionId) {
      if (this.isMoving || this.collectionsLoading || this.collectionsError) return
      if (collectionId === (this.todo.collectionId || null)) {
        this.modalVisible = false
        return
      }
      const id = this.todo.id
      this.isMoving = true
      this.moveError = null
      try {
        const result = await this.moveToDoToCollection({ id, collectionId })
        if (this.todo.id !== id) return
        if (result.error) this.moveError = result.message || 'No se pudo cambiar la colección. Inténtalo de nuevo.'
        else {
          this.selectedCollectionId = collectionId
          this.modalVisible = false
        }
      } catch (error) {
        if (this.todo.id === id) this.moveError = 'No se pudo cambiar la colección. Inténtalo de nuevo.'
      } finally {
        this.isMoving = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.picker__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.picker__trigger {
  padding: 9px 12px;
  font-size: 13px;
  color: $text-color;
  background: white;
  border: 1px solid #d6dce2;
  border-radius: 4px;
  &:hover, &:focus {
    border-color: $header_bg_color;
    background: $sidebar_bg_light;
  }
}
.picker__search {
  padding: 10px 12px;
  border: 1px solid #d6dce2;
  border-radius: 4px;
  &:focus-within { border-color: $header_bg_color; }
}
.picker__search-input {
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  font-size: 14px;
}
.picker__options {
  max-height: 260px;
  overflow-y: auto;
}
.picker__option {
  padding: 12px;
  font-size: 14px;
  border: 1px solid transparent;
  background: white;
  &:hover { background: $sidebar_bg_light; }
}
.picker__option--selected {
  color: $header_bg_color;
  background: $header_bg_light;
  border-color: $header_bg_light;
}
</style>
