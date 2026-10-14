# Plan de mantenimiento de Awesomelist

Preparado el 12 de octubre de 2026.

## Objetivo y alcance

Recuperar el funcionamiento de la aplicación actual, agregar pruebas unitarias y dejar un entorno de desarrollo reproducible. Mantener Vue 2, Vuex, Vue Router 3, las plantillas Pug y la interfaz actual durante este trabajo. Docker permite actualizar Node de manera independiente al framework.

Las etapas siguientes son un plan de ejecución. Los hallazgos iniciales proceden de una revisión estática; los avances y las regresiones confirmadas se registran abajo y en `notas-mantenimiento.md`. La comprobación real de Firebase sigue pendiente.

## Orden de trabajo

### 0. Preparar y verificar el entorno

- [x] Preparar Docker con Node 24, npm y herramientas para dependencias nativas.
- [x] Versionar un único archivo de dependencias resueltas: `package-lock.json`.
- [x] Aislar las dependencias Linux en un volumen, conservar los archivos editables y documentar Sass/CSS.
- [x] Registrar el resultado de instalación, compilación y arranque del servidor en Docker.
- [ ] Crear `.env.local` a partir de `.env.example` con un proyecto Firebase de desarrollo.
- [ ] Registrar los flujos que funcionan y los síntomas observados con datos de prueba.
- [x] Ejecutar el análisis de estilo sin correcciones automáticas; separar deuda existente de cambios nuevos.

Criterio de salida: un checkout nuevo puede instalar, compilar y servir la aplicación con los pasos del README. Los flujos con Firebase deben comprobarse con una cuenta y datos de desarrollo.

### 1. Incorporar pruebas unitarias compatibles con Vue 2

Usar Jest y Vue Test Utils v1, con un transformador de componentes Vue 2 compatible con Jest, Babel y Pug. Fijar versiones después de validar su ejecución en Node 24. Evitar incorporar Vite o una migración de framework para instalar las pruebas.

- [x] Agregar `test:unit` y `test:unit:coverage`; una ejecución normal debe terminar sin modo interactivo.
- [x] Configurar alias `@`, transformación de `.vue`/Pug, entorno DOM y sustitución de imágenes, audio y estilos.
- [x] Crear estados nuevos de Vuex para cada prueba; no reutilizar el singleton global.
- [x] Sustituir Firebase, enlaces `$bind` y Vuexfire por dobles controlables en los casos cubiertos. Ninguna prueba unitaria debe acceder a la red, escribir datos ni requerir credenciales.
- [ ] Controlar fechas, temporizadores, reproducción de audio y resolución/rechazo de promesas.
- [ ] Empezar con getters, acciones de tareas y acciones de usuario; montar componentes solamente cuando aporte cobertura del comportamiento visible.
- [x] Documentar cómo ejecutar las pruebas localmente y dentro de Docker.

Criterio de salida: las pruebas se ejecutan sin Firebase y detectan tanto éxitos como errores de las operaciones críticas. Cada corrección posterior incorpora una regresión que falla antes del cambio y pasa después.

### 2. Corregir acceso, persistencia y estados de error

Implementar M01–M04 y M10 en cambios pequeños. Primero reproducir cada caso; después escribir su regresión y corregirlo. Separar los problemas de permisos/configuración Firebase de los errores del frontend.

Criterio de salida: la interfaz no anuncia éxitos cuando una escritura falla; el usuario puede recuperarse de errores de carga y no conserva datos de una sesión anterior.

### 3. Corregir edición, fechas e interacción

Implementar M05–M09 y revisar M11. Refactorizar solo lo necesario para probar las reglas: por ejemplo, extraer conversión de fechas o validación de títulos a funciones pequeñas. Evitar reorganizar todos los componentes a la vez.

Criterio de salida: las operaciones funcionan con datos vacíos, antiguos y recién creados; los componentes liberan sus suscripciones y temporizadores al salir.

### 4. Establecer controles de mantenimiento

- [ ] Automatizar instalación con `npm ci`, pruebas unitarias y compilación en integración continua.
- [ ] Conservar un reporte inicial de cobertura y aumentar la cobertura del código corregido. No imponer 100 % global ni usar snapshots como único criterio de corrección.
- [ ] Actualizar README y notas de cambios con síntomas resueltos, validación y limitaciones.
- [ ] Ejecutar una comprobación manual de acceso, creación, edición, filtros, borrado y salida de sesión con datos de desarrollo; incluir escritorio y pantalla pequeña.
- [ ] Revisar dependencias y sus avisos sin ejecutar actualizaciones masivas ni `npm audit fix --force`.

Criterio de salida: un cambio que rompe reglas cubiertas o la compilación queda detectado automáticamente; los flujos visuales y las integraciones también tienen un registro de validación manual.

## Hallazgos y pruebas de regresión propuestas

Prioridad alta: bloqueo de acceso, errores de persistencia o datos de sesión. Prioridad media: edición y presentación. Estado inicial de todos los casos: identificado por lectura del código, pendiente de reproducir.

Avance del 13 de octubre de 2026: M02, M03 y M08 corregidos y cubiertos con pruebas unitarias. M05 resuelto para crear tareas y colecciones; queda pendiente validar la edición del título. M01, M04, M06, M07 y M09–M12 siguen pendientes. La tabla conserva la evidencia original como referencia de cada problema.

| ID | Prioridad | Evidencia en el código actual | Resultado esperado y prueba |
| --- | --- | --- | --- |
| M01 | Alta | `src/main.js` espera `fetchUserProfile` antes de montar la aplicación. Esa acción rechaza la promesa ante un error, sin captura en el inicio. | Con lectura de perfil rechazada, la aplicación monta una vista recuperable y termina el estado de carga. Probar también perfil inexistente y registro cuya creación de perfil aún no termina. |
| M02 | Alta | `onToggleToDo`, `onToggleAddToMyDay` y `onToggleMarkAsImportant` en `ToDo.js` notifican éxito aunque `updateToDoById` devuelva un error. | Una escritura fallida muestra error, no confirma el cambio ni reproduce sonido de éxito. Cubrir las tres acciones con promesas resueltas y rechazadas. |
| M03 | Alta | `deleteToDoById` y `createNewToDoCollection` no esperan ni retornan la operación interna. `ToDoDetail.deleteToDo` cierra el panel inmediatamente. | El llamador puede esperar un resultado. Ante error conserva el contexto y permite reintentar; ante éxito finaliza. Probar también envíos repetidos durante una operación pendiente. |
| M04 | Alta | `signOut` limpia `currentUser` incluso cuando Firebase devuelve un error. No hay limpieza explícita del perfil, tareas, colecciones, panel seleccionado ni enlaces de Firestore al cambiar de usuario. | Si falla la salida, conservar una sesión coherente. Si tiene éxito, limpiar datos y enlaces. Probar usuario A → salida → usuario B, incluidas respuestas tardías de A. |
| M05 | Media | `ToDoCreate` permite títulos vacíos y depende directamente de `currentUser.uid`. La edición del título y creación de colección tampoco validan texto vacío. | Recortar texto, rechazar blancos, evitar errores sin usuario y conservar el texto si falla el guardado. Cubrir creación desde Tareas, Mi día e Importante. |
| M06 | Media | `onEditToDoNote` trata una nota vacía como cancelación. La vista usa `v-html` para un contenido que se edita y guarda como texto. | Permitir borrar una nota y mostrar su contenido como texto. Probar vacío, cancelación, texto igual y caracteres como `<` y `>`, incluyendo compatibilidad con notas existentes. |
| M07 | Media | `getUpdatedDifference` siempre toma la rama de `.seconds` cuando existe `lastUpdated`, aunque el valor pueda ser `Date`. Los getters ordenan con resta directa de `created`. El vencimiento se calcula por diferencia de horas respecto a medianoche. | Normalizar `Date` y Timestamp de Firestore antes de ordenar/formatear. Probar orden real, fechas ausentes, hoy/ayer/mañana y zona horaria. Definir que una tarea de hoy no está vencida antes de terminar el día. |
| M08 | Media | `currentList` comienza como una cadena, pero los getters esperan un objeto con `.filter`; el dashboard lo corrige posteriormente. `setListToCollection` no contempla una colección ausente. | El estado inicial es válido antes de montar el dashboard. Las listas vacías y respuestas tardías sobre colecciones ausentes no provocan errores. |
| M09 | Media | `listenWindowResize` registra manejadores sin limpieza. `Access.vue` mantiene EventBus, temporizadores y un ciclo asíncrono de fondos sin cancelación al destruirse. | Montar y desmontar no acumula listeners ni modifica componentes destruidos. Probar eliminación de listeners y cancelación con temporizadores controlados. Revisar también el cierre diferido del sidebar cuando se abre otro panel. |
| M10 | Alta | `EmailForm` interpreta `response.data === null` como correo inexistente incluso ante un error de consulta. Inicio de sesión y recuperación dependen de esa consulta adicional al perfil. | Distinguir error de red/permisos de resultado vacío. Reproducir una cuenta válida de Firebase Auth sin documento de perfil antes de decidir la corrección del flujo. Una respuesta antigua no debe validar un correo que ya cambió. |
| M11 | Media | Las listas de una colección se renderizan sin acción de selección. No aparece un flujo completo de creación de listas o pertenencia de tareas a esas listas. | Registrar esto como funcionalidad incompleta. Confirmar el comportamiento requerido antes de implementar un modelo de datos nuevo; no asumir que equivale al filtrado de Mi día/Importante. |
| M12 | Baja | La compilación en Docker emite avisos de APIs antiguas de Sass, `@import` e interpolación de nombres de colores en `helpers.scss`. También reporta imágenes y paquetes grandes. | Corregir advertencias de estilos en un cambio propio, comparando el CSS y la vista. Medir paquetes e imágenes antes de optimizarlos; la compilación actual sí termina correctamente. |

## Matriz mínima de pruebas

| Área | Casos mínimos |
| --- | --- |
| Getters de tareas | Estado inicial; vacío; completadas/pendientes; Mi día; Importante; orden por fecha; entrada no modificada. |
| Persistencia de tareas | Crear, actualizar y borrar: éxito, rechazo, operación pendiente y resultado retornado. |
| Acciones de categorías | Flags correctos; no alterar el objeto recibido; notificación y sonido solo tras éxito. |
| Usuario y autenticación | Perfil válido, ausente y fallido; estado de carga; salida exitosa/fallida; limpieza entre usuarios. |
| Creación y edición | Blancos; recorte; doble envío; error conserva borrador; vaciar nota; contenido tratado como texto. |
| Fechas | `Date`, Timestamp y ausencia; orden; creación/actualización; vencimiento por día. |
| Colecciones | Vacías; carga correcta/fallida; resultado esperable; respuesta de una colección que ya no existe. |
| UI y ciclo de vida | Categoría seleccionada; confirmación/cancelación de borrado; limpieza de listeners y temporizadores. |
| Acceso | Validación local; error remoto distinguible de correo inexistente; respuesta asíncrona obsoleta. |

Las pruebas unitarias no verifican reglas desplegadas de Firestore, entrega de correos, CSS real ni comportamiento completo del navegador. Esos puntos requieren comprobación de integración/manual con el entorno de desarrollo.

## Entregas sugeridas

1. Preparación: Docker, lockfile, instrucciones y este plan.
2. Infraestructura de pruebas y primeras reglas de tareas.
3. Inicio y sesión: M01, M04 y M10.
4. Persistencia y errores de tareas/colecciones: M02 y M03.
5. Edición y fechas: M05–M08.
6. Ciclo de vida, verificación visual, controles automáticos y cierre de documentación: M09 y etapa 4; registrar M12 como mantenimiento posterior de estilos y rendimiento.

M11 queda como decisión de producto pendiente. Cada entrega debe poder revisarse, probarse y revertirse de forma independiente. Evitar prometer fechas antes de reproducir los fallos y validar las dependencias de pruebas.

## Notas para una futura modernización

- La decisión actual es mantener Vue 2. Una migración de framework y Elm quedan fuera del trabajo de mantenimiento.
- Guardar la matriz anterior como contrato de comportamiento para cualquier migración futura.
- Vue CLI 3/Webpack 4 requieren una excepción temporal de OpenSSL con Node moderno. Revisar su retiro cuando se actualice el compilador; elevar Node no moderniza por sí solo esos paquetes.
- `legacy-peer-deps=true` permite resolver declaraciones antiguas de dependencias; no acredita compatibilidad. El lockfile y las verificaciones establecen qué combinación funciona.
- Antes de actualizar Vue, inventariar BootstrapVue, Vuesax, Vue Formulate, Vuefire/Vuexfire, Router, Vuex, Pug y Sass. Revisar una dependencia por cambio.
- Si se actualiza Firebase, conservar los identificadores, colecciones, campos y reglas existentes; documentar cualquier cambio de esquema por separado.
- Preferir límites pequeños entre reglas, Firebase y presentación cuando sean necesarios para una corrección. Esa separación facilitará futuras actualizaciones.
- Registrar decisiones con: problema, opciones, elección, impacto en datos, validación y condición para reconsiderarlas.

## Estado de validación de esta preparación

Comprobaciones realizadas el 12 de octubre de 2026:

| Comprobación | Resultado |
| --- | --- |
| `docker compose config --quiet` | Configuración válida. |
| `docker compose build` | Imagen creada con Node 24.20.0; `npm ci` terminó correctamente en Linux. |
| `docker compose run --rm web npm run build` | Compilación correcta, incluidos Pug y Sass. Generó JavaScript y CSS en `dist/`; avisos registrados en M12. |
| `docker compose run --rm web npm run lint -- --no-fix` | Terminó sin errores con la configuración actual. |
| Arranque de desarrollo y petición HTTP | Compilación correcta; HTTP 200 en `http://localhost:18080/`. El puerto 8080 ya estaba ocupado y se usó `APP_PORT=18080`. |
| Reutilización de dependencias | Un segundo comando reutilizó el volumen instalado sin repetir `npm ci`. |
| `git diff --check` | Sin errores de espacios en los cambios seguidos por Git. |

Versiones resueltas por el lockfile dentro de los rangos ya declarados: Vue y `vue-template-compiler` 2.7.16, Vue CLI 3.12.1, Webpack 4.47.0, Firebase 7.24.0, Sass 1.105.1 y sass-loader 7.1.0. No se modificaron esos rangos en `package.json`.

La instalación emitió avisos de paquetes antiguos y de scripts de instalación no aprobados por npm. La compilación y el servidor funcionaron con esta resolución; una nueva dependencia nativa puede requerir revisar su script de instalación además de contar con Python/Make/C++.

La respuesta HTTP comprueba que el servidor sirve el frontend, no que autenticación o Firestore funcionen. No se han configurado credenciales Firebase ni validado esos flujos.

## Primera entrega de mantenimiento — 13 de octubre de 2026

- Jest 29.7.0, Vue Test Utils 1.3.6 y `@vue/vue2-jest` 29.2.6, validados con Node 24.20.0 en Docker.
- Las 34 pruebas iniciales reprodujeron 22 fallos del código original. Tras las correcciones y cinco casos adicionales, pasan 39 pruebas en dos suites.
- M02: las acciones dejan de emitir éxito y sonido cuando la actualización devuelve un error.
- M03: borrado y creación de colecciones esperan la escritura y devuelven un resultado. Los componentes conservan su contexto ante errores y evitan repetir operaciones pendientes. Una escritura anterior no cierra el detalle de otra tarea seleccionada. El botón existente para guardar una colección ya ejecuta la acción.
- M05 parcial: creación de tareas y colecciones rechaza blancos, recorta el texto y conserva el borrador ante error; una tarea no se crea sin usuario.
- M08: el módulo de tareas usa una fábrica de estado con una lista inicial válida y descarta respuestas sobre colecciones ausentes.
- Crear tareas ya no agrega el identificador al objeto recibido del componente.
- La compilación y el análisis de estilo sin correcciones automáticas pasan. Los avisos de Sass y tamaño de paquetes de M12 permanecen registrados.
- Cobertura inicial de los archivos seleccionados: 63 % de sentencias y 62.15 % de líneas. No representa cobertura global de la aplicación.

Se mantienen Options API, Vuex, Pug, BootstrapVue, Vuesax y las reglas de estilos de los componentes. Se agregan estados temporales de bloqueo durante operaciones pendientes. La validación visual en navegador con Firebase sigue pendiente.
