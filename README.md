# Cliente: Aplicación web para consumir API Rest

Para la instalación de este cliente tipo: `Aplicación web`, se deben ejecutar las siguientes instrucciones.

## Configuración de proyecto e instalación de dependencias
```
npm install
```

### Compila y realiaza "hot-reloads" en modo desarrollo
```
npm run serve
```

### Compila y minifica archivos para producción
```
npm run build
```

### Checha y corrige errores en archivos
```
npm run lint
```

## Framework UI

Para los elementos de la interfaz de usuario se usa `element.js`: [https://element.eleme.io/#/es](https://element.eleme.io/#/es).

Cabe mencionar que no se están importando todos los elementos, se importa únicamente lo que se necesita, entonces se registra en el archivo: `main.js` y con ello se puede utilizar en cualquier componente de la aplicación Vue.js.