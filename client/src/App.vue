<template>

  <div id="app" class="wrapper">
    <header class="wrapper__header">
      <h1>Awesomelist</h1>
      <div class="username">
<<<<<<< HEAD
        <div class="image">
          <img src="./assets/images/user.png" alt="" srcset="">
        </div>
=======
        <div class="image"></div>
>>>>>>> 55873d6cb4a3f3829b1b5872682246e023bfc39b
        <span>Ángel Guerrero</span>
      </div>
    </header>

    <main class="wrapper__main">
      <aside class="main__aside-left"></aside>
      <div class="main__content">

        <!-- Section for create new todos -->
        <div id="todos">
          <form action="" class="form-task">
            <input class="input" type="text" name="" id="" placeholder="Todos">
          </form>

          <!-- Section for the pending todos -->
          <div id="todos__pending">
            <div class="tasks__wrapper">
              <label class="checkbox">
                <input type="checkbox">
                Learn Vue.js
              </label>
            </div>
          </div>

        </div> <!-- End todos__create -->

        <!-- Section for the completed todos -->
        <div id="todos__completed">
          <div class="tasks__wrapper">
            <label class="checkbox">
              <input type="checkbox" checked>
              Learn CSS3
            </label>
          </div>
          <div class="tasks__wrapper">
            <label class="checkbox">
              <input type="checkbox" checked>
              Learn Rails
            </label>
          </div>
          <div class="tasks__wrapper">
            <label class="checkbox">
              <input type="checkbox" checked>
              Learn C++
            </label>
          </div>

        </div>

      </div>
      <aside class="main__aside-right">
        <div class="menu">
<<<<<<< HEAD
          <div class="menu__list">Profile</div>
          <div class="menu__list">Account</div>
          <div class="menu__list">Settings</div>
          <div class="menu__list">Logout</div>
=======
          <div class="menu__list">Perfil</div>
          <div class="menu__list">Cuenta</div>
          <div class="menu__list">Configuración</div>
          <div class="menu__list">Cerrar sesión</div>
>>>>>>> 55873d6cb4a3f3829b1b5872682246e023bfc39b
        </div>
      </aside>
    </main>
  </div>

</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
  }
}
</script>

<style lang="scss">
@import '../node_modules/bulma/sass/utilities/_all.sass';
@import '../node_modules/bulma/sass/base/generic.sass';
@import "../node_modules/bulma/sass/elements/form.sass";

@import 'assets/scss/normalize.scss';

$wrapper-header-background-color: #54426B;
$main-aside-right-background-color: #373941;
$body-background-color-light: #E9F1F7;
$todos-background-color: #FAF9F4;

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to bottom, 
  $body-background-color-light,
  $body-background-color-light 80%,
  $wrapper-header-background-color 80%,
  $wrapper-header-background-color 20%,
  $wrapper-header-background-color 20%
  );
}

ul li {
  list-style-type: none;
}

.wrapper {
  width: 90%;
  height: 95%;
  display: flex;
  flex-direction: column;
  // box-shadow: 0px 0px 25px #aaaaaa;
}
.wrapper__header {
  min-height: 60px;
  background-color: $wrapper-header-background-color;
  color: #ffffff;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

h1 {
    margin: 0px 10px;
    padding: 0px 10px;
  }
}
.username {
  width: 300px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: space-around;
<<<<<<< HEAD

  border-left: 1px solid lighten($color: $wrapper-header-background-color, $amount: 5%);
  background-color: darken($color: $wrapper-header-background-color, $amount: 22%);

  &:hover {
    cursor: pointer;
=======
  border-left: 1px solid lighten($color: $wrapper-header-background-color, $amount: 5%);
  
  &:hover {
    cursor: pointer;
    background-color: #2043cf;
>>>>>>> 55873d6cb4a3f3829b1b5872682246e023bfc39b
  }

  .image {
    width: 50px;
    height: 50px;
    background-color: $main-aside-right-background-color;
    border-radius: 50%;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
}


/* Main */
.wrapper__main {
  background-color: #ffffff;
  flex-grow: 1;

  display: flex;

  .main__aside-left {
    background-color: rgb(19, 24, 26);
    width: 200px;
    display: none;
  }
  .main__content {
    flex-grow: 4;

  }
  .main__aside-right {
    width: 300px;
<<<<<<< HEAD
    background-color: $main-aside-right-background-color;
=======
    background-color: #373941;
>>>>>>> 55873d6cb4a3f3829b1b5872682246e023bfc39b
    border-left: 1px solid #e4e4e4;
    color: #ffffff;
  }
}

.menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  .menu__list {
<<<<<<< HEAD
    border-bottom: 1px solid lighten($color: $main-aside-right-background-color, $amount: 5%);
    padding: 10px 25px;
    &:hover {
      cursor: pointer;
      background-color: lighten($color: $main-aside-right-background-color, $amount: 10%);
=======
    border-bottom: 1px solid #494949;
    padding: 10px;
    &:hover {
      cursor: pointer;
      background-color: #2043cf;
      // background-color: lighten($color: $main-aside-right-background-color, $amount: 10%);
>>>>>>> 55873d6cb4a3f3829b1b5872682246e023bfc39b
    }
  }
}


/* Todos, Parent: main__content */

#todos {
  height: 50%;
  background-color: $todos-background-color;
}
.form-task {
  display: flex;
  align-items: flex-start;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 25px;
  padding-bottom: 10px;
}
.tasks__wrapper {
  padding: 10px;
  margin: 10px 0px;
  border: 1px solid #e4e4e4;
  border-radius: 5px;
  background-color: #ffffff;
}

#todos__pending {
  height: 100%;
  overflow-y: scroll;
  padding: 0px 10px;
}

#todos__completed {
  height: 50%;
  padding: 0px 10px;
  overflow-y: scroll;
  border-top: 1px solid #e4e4e4;
  // background-color: #2D3338;
  font-style: italic;
}
#todos__completed label {
  text-decoration: line-through;
  color: #b8b8b8;
}


/* Medias Queries */
@media screen and (max-width: 1100px) {
  .wrapper {
    width: 100%;
    height: 100%;
  }
}

@media screen and (max-width: 800px) {
  .main__aside-right {
    display: none;
  }
}
</style>
