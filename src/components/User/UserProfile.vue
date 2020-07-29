<template lang="pug">
  sidebar(id="profile__sidebar" ref="container")
    //- TODO: Add another div if some data
    //- doesn't load correctly
    .wrapper(class="bg-light w-100 h-100")
      .wraper__header
        .section__close
          b-icon(icon="X"
                @click="close"
                class="close-icon bg-light text-dark rounded h2 float-right mt-3 mr-3")

        .section__profile
          .profile__image
            img(src="@/assets/images/user.png" alt="user image")
          div.text-center
            b-spinner.m-3(v-if="!currentProfile")
            h1.profile__title(v-else class="h6 mt-2 text-center text-muted") {{ currentProfile.fullname }}

        b-list-group.section__links(class="mt-3")
          b-list-group-item(button class="bg-light border-0 rounded-0 d-flex align-items-center")
            b-icon(icon="person" variant="primary" class="h5 mb-0 mr-3")
            | Perfil
          b-list-group-item(button class="bg-light border-0 rounded-0 d-flex align-items-center")
            b-icon(icon="gear" class="h5 mb-0 mr-3")
            | Cuenta
          b-list-group-item(button
                            @click="signOut()"
                            class="bg-light border-0 rounded-0 d-flex align-items-center")
            b-icon(icon="box-arrow-left" variant="danger" class="h5 mb-0 mr-3")
            | Cerrar sesión

        .section__stadistics

</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Sidebar from '@/components/Layout/Sidebar'

export default {
  components: { Sidebar },

  computed: mapState('user', ['currentProfile']),

  methods: {
    ...mapMutations('ui', [
      'setSelectedComponent'
    ]),

    close () {
      this.$refs.container.close()
    },

    async signOut () {
      const getval = await this.$store.dispatch('user/signOut')

      if (getval.error) {
        console.log(`Something went wrong: ${getval.message}`)
        return
      }

      this.$router.replace('login')
    }
  }
}
</script>

<style lang="scss" scoped>
#profile__sidebar {
  background-color: $sidebar_bg_light;
  z-index: 10 !important;
}

.close-icon {
  cursor: pointer;
}

.section__profile {
  .profile__image {
    width: 100%;
    display: flex;
    img {
      width: 100%;
      max-width: 100px;
      margin: auto;
      border-radius: 50%;
    }
  }
}
</style>
