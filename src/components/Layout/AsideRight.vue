<template lang="pug">
  aside(class="aside__right"
        :class="{ mobile: mobile }"
        v-show="visible")
    .screen(v-show="mobile" @click="disappear()")
    .column.grow-1
      header.row
        i.icon-close(class="symb-icon fas fa-times fa-lg row-v-center" @click="disappear()")
        h3.title(class="grow-1 row-h-center") Aprender Erlang

      .duetime(class="container row-v-center")
        .duetime__content(class="grow-1")
          .duetime__title Due time
          .duetime__time
            p December 24, 2018

        el-dropdown
          i.el-icon-more(class="row-v-center")
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item set Due Time
            el-dropdown-item Notifications

      .description(class="container")
        .description__title Aprender Erlang
        .description__content
          p Estoy aprendiendo Erlang y es genial

</template>

<script>
import EventBus from '@/EventBus'

export default {
  name: 'AsideRight',

  props: {
    // Validate if the component
    // will be show it
    visible: {
      type: Boolean,
      required: true
    },

    // It is the size accord to the device
    mobile: {
      type: Boolean,
      required: true
    }
  },

  methods: {
    disappear () {
      EventBus.$emit('change-aside-right-state')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/partials/variables.scss';

.aside__right {
  width: $aside-right-width;
  min-width: $aside-right-width;
  padding: 5px;
  background-color: $aside-right-background-color;
  color: black;
  overflow-y: auto;
  position: absolute;
}

.container {
  padding: 10px;
  margin: 10px 0px;
  border: 1px solid #333333;
  background-color: white;
  border-radius: 5px;
  text-align: center;
}

.duetime {
  .duetime__time {
    color: orangered;
  }

  .el-icon-more {
    transform: rotate(90deg);
    height: 15px;
    padding: 10px;
    &:hover {
      cursor: pointer;
    }
  }
}

button {
  width: 100%;
}

.screen {
  position: fixed;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: white;
  opacity: 0.7;
}

.mobile {
  position: fixed;
  z-index: 10;
  top: 0;
  right: 0;
  height: 100%;
}

@media screen and (max-width: 425px) {
  .mobile {
    background-color: $aside-right-background-color;
    width: 100%;
    max-width: 100%;
  }
}
</style>
