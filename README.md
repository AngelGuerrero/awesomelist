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

Webpack 4 requiere `--openssl-legacy-provider` con Node moderno. Docker lo configura mediante `NODE_OPTIONS`; el script `npm run build` lo aplica directamente para compilar también fuera de Docker, incluido Vercel. Es una medida temporal de compatibilidad. `.npmrc` activa `legacy-peer-deps` por las declaraciones antiguas de Vue CLI 3. Ambos puntos están registrados en el plan de mantenimiento.

## Despliegue en Vercel

El proyecto declara Node `24.x` en `package.json` y `.nvmrc` selecciona la misma versión mayor para desarrollo. Docker fija una versión concreta de Node 24. Vercel utiliza la versión 24.x disponible en su plataforma.

En el proyecto de Vercel, abre **Settings → Build and Deployment → Node.js Version**, selecciona **24.x** y guarda. `vercel.json` configura instalación con `npm ci`, compilación con `npm run build` y salida en `dist`.

Configura en Vercel las variables `VUE_APP_*` indicadas en `.env.example` para el entorno que desplegarás. Se incorporan al frontend durante la compilación. Después, desde la raíz del proyecto, puedes generar un despliegue de vista previa en Bash:

```bash
npx vercel
```

La configuración del proyecto está documentada en [las versiones de Node de Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions). Los cambios se aplican en un nuevo despliegue.

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

También puedes ejecutar los mismos scripts de npm después de `npm ci` sin Docker. El reporte de cobertura queda en `coverage/`; su vista HTML está en `coverage/lcov-report/index.html`. La cobertura corresponde a los archivos incluidos en `jest.config.js`, no a toda la aplicación. Los flujos de autenticación y la comprobación visual siguen en el plan.

## Agrupar tareas en colecciones

Crea un grupo con «Nueva colección», selecciónalo en el menú y agrega tareas. Para mover una tarea existente o dejarla sin grupo, usa «Colección» en su detalle. Una tarea pertenece como máximo a un grupo; «Mi día» e «Importante» siguen reuniendo tareas de cualquier colección.

El [patrón de colecciones](docs/colecciones.md) documenta el esquema de Firestore, las transacciones, la compatibilidad con datos antiguos y las reglas propuestas.

Prueba las reglas en el emulador local, sin credenciales reales:

```bash
docker compose --profile tools run --build --rm firestore-tests
```

El servicio adicional contiene Java 21 y las herramientas de Firebase aisladas del frontend. Su configuración usa `firebase.emulators.json` y el proyecto local `demo-awesomelist`. Las reglas ya incorporan perfiles privados por UID; aplica primero el frontend actualizado antes de publicarlas en Firebase, como indica el documento del patrón.

## Framework UI

Para los elementos de la interfaz de usuario se usa `Vue Bootstrap`: [https://bootstrap-vue.org/](https://bootstrap-vue.org/).

Cabe mencionar que no se están importando todos los elementos, se importa únicamente lo que se necesita, entonces se registra en el archivo: `main.js` y con ello se puede utilizar en cualquier componente de la aplicación Vue.js.
