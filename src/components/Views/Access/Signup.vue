<template lang="pug">
  div
    h3 signup
    formulate-form
      formulate-input(type="text"
                      name="username"
                      label="Nombre de usuario o email"
                      placeholder="micorreo@email.com"
                      )
      formulate-input(type="password"
                      name="password"
                      label="Contraseña"
                      placeholder="*******"
                      )
      formulate-input(type="password"
                      name="password"
                      label="Confirmar contraseña"
                      placeholder="*******"
                      )
      formulate-input(type="submit"
                      :label="getPageTitle"
                      input-class="btn btn-primary btn-block btn-sm mt-3"
                      )
</template>
