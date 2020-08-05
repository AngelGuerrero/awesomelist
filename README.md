# Awesomelist

Este proyecto inició como un proyecto para aprender Vue y retar mis habilidades, y le he dado mantenimiento a la actual fecha ya que lo he utilizado diariamente como una herramienta de trabajo y organización.

La aplicación es ello precisamente, una lista de tareas que al momento le hace falta muchas funcionalidades que estoy agregando y bugs que estoy corrigiendo.

La aplicación guarda la información no sensible en firebase, específicamente firestore, y para el ingreso se utiliza el medio de autenticación de firebase de correo y contraseña, **la contraseña no se almacena en firestore**.

## Instalación de dependencias

```
npm install
```

### Inicia el proyecto en modo desarrollo

```
npm run serve
```

### Compila y minifica archivos para producción

```
npm run build
```

### Verifica errores en archivos

```
npm run lint
```

## Framework UI

Para los elementos de la interfaz de usuario se usa `Vue Bootstrap`: [https://bootstrap-vue.org/](https://bootstrap-vue.org/).

Cabe mencionar que no se están importando todos los elementos, se importa únicamente lo que se necesita, entonces se registra en el archivo: `main.js` y con ello se puede utilizar en cualquier componente de la aplicación Vue.js.
