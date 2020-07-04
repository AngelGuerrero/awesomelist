<template>
  <div>
    <div
      v-for="collection in collections"
      :key="collection.id"
    >
      <div>
        <div>{{ collection.name }}</div>

        <div
          v-if="collection.lists"
          class="pl-3"
        >
          <div
            v-for="list in collection.lists"
            :key="list.id"
          >
            {{ list.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    // ListRecursive: () => import('@/components/ToDo/ToDoCollectionList')
  },

  props: {
    collections: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
