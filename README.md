# Awesomelist

Este proyecto inició como un proyecto para aprender Vue y retar mis habilidades, y le he dado mantenimiento a la actual fecha ya que lo he utilizado diariamente como una herramienta de trabajo y organización.

La aplicación, una lista de tareas que al momento le hace falta muchas funcionalidades que estoy agregando y bugs que estoy corrigiendo.

## Desarrollo con Docker

El entorno de desarrollo usa Node `24.20.0`, npm y Linux. Incluye Python, Make y un compilador C++ para paquetes que necesiten compilar dependencias nativas. Sass, Bootstrap y los estilos se procesan mediante las herramientas npm del proyecto.

Necesitas Docker Desktop con contenedores Linux y Docker Compose. No hace falta instalar Node en tu computadora para esta ruta.

1. Copia `.env.example` a `.env.local` y completa la configuración de un proyecto Firebase de desarrollo.
2. Inicia la aplicación:

```sh
docker compose up --build
```

Abre [http://localhost:8080](http://localhost:8080). Los archivos del proyecto se comparten con el contenedor, de modo que editar Vue, Pug o Sass actualiza la aplicación. Las dependencias de Linux viven en su propio volumen y no se mezclan con `node_modules` de Windows. La configuración Firebase se lee desde `.env.local` al compilar; reinicia el servicio si la cambias. Estos valores se incorporan al frontend: no agregues claves privadas de servicio.

La instalación usa `package-lock.json` y `npm ci`. El primer arranque puede instalar nuevamente las dependencias para inicializar el volumen; los siguientes reutilizan la instalación mientras no cambien los manifiestos o Node.

### Comandos habituales

Con la aplicación iniciada, abre una terminal dentro del contenedor:

```sh
docker compose exec web sh
```

Compila la aplicación; el resultado queda en `dist/` en tu computadora:

```sh
docker compose run --rm web npm run build
```

Revisa estilo sin modificar archivos automáticamente:

```sh
docker compose run --rm web npm run lint -- --no-fix
```

Para agregar una dependencia, ejecuta este comando con el nombre real del paquete y versiona los cambios de `package.json` y `package-lock.json`:

```sh
docker compose run --rm web npm install nombre-del-paquete
```

Agrega `--save-dev` cuando sea una herramienta de desarrollo. Ejecuta instalaciones cuando no haya otro comando npm modificando el mismo volumen. Después de cambiar dependencias, recrea el servicio con `docker compose up --build --force-recreate`; el arranque vuelve a sincronizar el volumen con el lockfile.

Detén el entorno conservando las dependencias:

```sh
docker compose down
```

### Actualizar Node o cambiar el puerto

`NODE_VERSION` en el Dockerfile fija la versión predeterminada. Compose permite probar otra versión mediante `DOCKER_NODE_VERSION`. En Bash, incluido Git Bash en Windows:

```bash
export DOCKER_NODE_VERSION=24.20.0
docker compose build --pull
docker compose up --force-recreate
```

Para hacer permanente una actualización, cambia los valores predeterminados del Dockerfile y `compose.yaml`, verifica instalación/compilación/arranque y actualiza este README. `APP_PORT` permite cambiar el puerto local si 8080 está ocupado.

Por ejemplo, para usar el puerto 18080 en Bash:

```bash
APP_PORT=18080 docker compose up --build
```

En ese caso abre [http://localhost:18080](http://localhost:18080).

Webpack 4 utiliza `NODE_OPTIONS=--openssl-legacy-provider` con Node moderno. Es una medida temporal de compatibilidad del entorno de desarrollo. `.npmrc` activa `legacy-peer-deps` por las declaraciones antiguas de Vue CLI 3. Ambos puntos están registrados en el plan de mantenimiento.

## Desarrollo sin Docker

Usa Node `24.20.0` y npm. En Bash:

```bash
npm ci
NODE_OPTIONS=--openssl-legacy-provider npm run serve
```

El gestor de referencia es npm y se versiona `package-lock.json`. Conserva ese archivo al agregar o actualizar paquetes para que Docker y las instalaciones locales resuelvan las mismas versiones.

## Pruebas y mantenimiento

El [plan de mantenimiento](docs/mantenimiento.md) contiene las etapas, los hallazgos del código, la matriz de pruebas unitarias y las notas para futuras actualizaciones. Los cambios realizados se registran en las [notas de mantenimiento](docs/notas-mantenimiento.md).

Las pruebas usan Jest 29 y Vue Test Utils v1 para Vue 2, incluidas las plantillas Pug. Firebase se sustituye por dobles de prueba: no requieren `.env.local`, credenciales ni conexión con Firestore.

```sh
docker compose run --rm web npm run test:unit
docker compose run --rm web npm run test:unit:coverage
```

También puedes ejecutar los mismos scripts de npm después de `npm ci` sin Docker. El reporte de cobertura queda en `coverage/`; su vista HTML está en `coverage/lcov-report/index.html`. La cobertura corresponde a los archivos incluidos en `jest.config.js`, no a toda la aplicación. Las pruebas actuales cubren tareas y colecciones; los flujos de autenticación, las reglas de Firestore y la comprobación visual siguen en el plan.

## Framework UI

Para los elementos de la interfaz de usuario se usa `Vue Bootstrap`: [https://bootstrap-vue.org/](https://bootstrap-vue.org/).

Cabe mencionar que no se están importando todos los elementos, se importa únicamente lo que se necesita, entonces se registra en el archivo: `main.js` y con ello se puede utilizar en cualquier componente de la aplicación Vue.js.
