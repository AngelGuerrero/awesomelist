# Colecciones de tareas

Decisión del 13 de octubre de 2026: relación directa colección → tareas. Cada tarea pertenece como máximo a una colección y puede quedar sin asignar.

## Modelo en Firestore

Una colección de la aplicación es un documento de agrupación. La colección física `collections` almacena esos documentos; la colección física `todos` sigue almacenando las tareas. Firestore crea esas colecciones al escribir documentos, como explica su [modelo de datos](https://firebase.google.com/docs/firestore/data-model).

| Documento | Campo | Tipo / regla |
| --- | --- | --- |
| `collections/{collectionId}` | `name` | Texto recortado, entre 1 y 200 caracteres. |
| | `userId` | UID del propietario; se obtiene de la sesión y no cambia. |
| | `created` | Timestamp de Firestore. |
| | `lastUpdated` | Timestamp o `null`. |
| `todos/{todoId}` | `createdBy` | UID del propietario; se obtiene de la sesión y no cambia. |
| | `collectionId` | ID de un documento propio de `collections`, o `null`. |
| | `title`, `done`, `created`, etc. | Campos existentes de la tarea. |

La pertenencia se guarda solo en `todos.collectionId`. El grupo no almacena una copia de las tareas ni un arreglo de sus identificadores. Mover una tarea consiste en actualizar una referencia; mantiene su documento, título, notas, flags y fecha de creación.

Las tareas antiguas que no tienen `collectionId` se interpretan como «Sin colección». Los documentos actuales de agrupación conservan sus IDs y `userId`. Las antiguas subcolecciones `collections/{id}/lists` dejan de consultarse en el frontend; no se eliminan ni se migran automáticamente. Si hay datos reales allí, hace falta revisarlos y respaldarlos antes de definir una conversión.

## Comportamiento del frontend

1. «Nueva colección» guarda el grupo y lo selecciona.
2. Pulsar una colección en el menú la selecciona para la lista principal y expande o contrae su vista de tareas. La lista principal respeta la vista de pendientes/completadas; el desplegable y su contador incluyen ambas. Cada desplegable tiene 180 px de altura y desplazamiento vertical. Los controles del encabezado expanden o contraen todos los grupos sin cambiar la selección.
3. Crear una tarea con un grupo seleccionado agrega su `collectionId` como texto.
4. En el detalle, el selector «Colección» permite mover una tarea a otro grupo o escoger «Sin colección».
5. «Tareas» sigue mostrando todas las tareas propias. «Mi día» e «Importante» conservan sus filtros y pueden reunir tareas de distintos grupos.
6. Pulsar una tarea del desplegable abre su detalle. Los grupos vacíos conservan el mensaje «Colección vacía». El nombre del grupo mantiene el tamaño original de 13 px.

Se mantienen Options API, Vuex, Pug, BootstrapVue/Vuesax, las variables SCSS y las animaciones existentes. El selector nuevo usa BootstrapVue con el mismo tamaño y composición de los controles actuales.

La carga de grupos distingue espera, error recuperable y resultado vacío. Durante un movimiento se bloquea el selector; si falla, se restaura el valor anterior. Un resultado tardío no cambia la selección de otra tarea.

## Escrituras y consistencia

- Crear un grupo valida el nombre y toma el propietario de la sesión, ignorando un `userId` enviado por el llamador.
- Crear una tarea asignada usa una transacción: lee el grupo, comprueba su propietario y escribe la tarea. Si el grupo desaparece o pertenece a otra persona, la operación falla.
- Mover una tarea usa una transacción: lee la tarea, verifica su propietario y el grupo de destino, y actualiza solo `collectionId` y `lastUpdated`.
- Dejar una tarea sin colección escribe `null`; conserva su documento.
- Las actualizaciones generales de título, nota o flags excluyen `collectionId`. Un snapshot antiguo del detalle no puede deshacer un movimiento reciente.
- Las suscripciones existentes de Vuefire/Vuexfire propagan los cambios a la lista, el contador y el detalle.

Las consultas iniciales siguen filtrando por propietario: `todos.where('createdBy', '==', uid)` y `collections.where('userId', '==', uid)`. El filtro por grupo se aplica sobre las tareas ya cargadas. No se necesita una consulta nueva ni un índice compuesto para este flujo. Si crece el volumen y se agrega paginación por grupo, habrá que revisar consultas e índices.

## Reglas de Firestore

`firebase/firestore.rules` contiene reglas propuestas y comprobadas para `/todos`, `/collections` y `/users`. Exigen sesión, propietario inmutable y una colección existente del mismo usuario para cada nueva asignación. Permiten leer y editar tareas antiguas sin referencia de grupo. Cada perfil se consulta y modifica solo por su UID propietario.

Las reglas de lectura se corresponden con las consultas por propietario: las reglas [no filtran resultados de una consulta insegura](https://firebase.google.com/docs/firestore/security/rules-query). Las consultas sin ese filtro se rechazan.

La eliminación de grupos queda bloqueada en esta propuesta: requiere definir antes cómo se liberan o trasladan sus tareas. El borrado de tareas propias sigue permitido.

### Integración con el proyecto real

La configuración `firebase.emulators.json` se usa explícitamente para pruebas. No se ha creado un `firebase.json` de despliegue ni publicado reglas desde este trabajo.

Se revisaron las reglas publicadas que compartió el usuario. Permitían lectura pública de perfiles y lectura/escritura de tareas, listas y grupos por cualquier usuario autenticado. La regla general `false` no anulaba esos permisos: las [coincidencias de reglas se combinan con OR](https://firebase.google.com/docs/rules/rules-behavior).

La versión integrada elimina esos permisos generales. `/users/{uid}` permite leer, crear y actualizar solo el perfil propio. Las rutas `/lists` y las listas anidadas quedan cerradas, porque el frontend actual ya no las utiliza; sus datos permanecen almacenados. Las rutas desconocidas se deniegan.

Para permitir perfiles privados, la validación de correo del frontend deja de consultar `/users` antes del acceso. Comprueba formato y longitud localmente; Firebase Auth decide credenciales válidas, registro duplicado y recuperación. La carga del perfil continúa usando `users/{uid}` después de autenticar. Las funciones antiguas de búsqueda global del store ya no se usan en los formularios y quedarían denegadas por estas reglas.

Para aplicar los cambios:

1. Publicar primero el frontend actualizado y comprobar acceso, registro y recuperación con datos de desarrollo.
2. Publicar el contenido completo de `firebase/firestore.rules` en el proyecto acordado. No conservar las reglas amplias antiguas junto a las nuevas, porque volverían a otorgar acceso.
3. Recargar los clientes antiguos y comprobar que cada usuario accede solo a sus datos.

La publicación del frontend y las reglas en el proyecto real sigue pendiente. La versión nueva está validada localmente con el emulador.

## Pruebas

Pruebas unitarias de reglas de negocio y componentes:

```bash
docker compose run --rm web npm run test:unit
docker compose run --rm web npm run test:unit:coverage
```

Pruebas de permisos contra Firestore real emulado:

```bash
docker compose --profile tools run --build --rm firestore-tests
```

Este servicio incluye Java 21 y usa exclusivamente `demo-awesomelist`, un proyecto de prueba local, con el emulador en `127.0.0.1:8180`. No requiere login, `.env.local` ni credenciales del proyecto real. La primera ejecución descarga el emulador; el volumen `firebase_cache` lo conserva. Las dependencias del emulador tienen su propio `package-lock.json` en `tests/firestore` y su propio volumen.

Se mantiene Firebase 7 en la aplicación. El SDK moderno y `@firebase/rules-unit-testing` están aislados en el paquete de pruebas; no se incorporan al frontend.

La validación de permisos usa la [biblioteca oficial de pruebas de reglas](https://firebase.google.com/docs/rules/unit-tests), que permite simular usuarios autenticados y anónimos.

Sin Docker, el script `npm run test:rules` requiere Node 24 y Java 21 disponibles localmente. Instala las herramientas aisladas, arranca el emulador, ejecuta los casos y lo detiene. Los logs del emulador se excluyen de Git.

Resultados del 13 de octubre de 2026: 100 pruebas unitarias en cinco suites, incluidos los controles de expandir/contraer, y 19 casos de reglas comprobados durante la integración de permisos. Incluyen correo local, operaciones de Firebase Auth y privacidad de perfiles. La compilación de producción y la revisión de estilo también pasan.
# Edición del nombre

Haz clic en el título grande de la colección, encima de «Nueva tarea», para editarlo en el mismo lugar. Enter o salir del campo guarda; Escape cancela. El nombre en el menú lateral conserva la acción de seleccionar, expandir y contraer. Se admiten entre 1 y 200 caracteres, quitando espacios al principio y al final.

La acción `renameCollection` comprueba la sesión y el propietario en una transacción de Firestore, y modifica únicamente `name` y `lastUpdated`. Las reglas existentes permiten esta actualización al propietario. Vuexfire actualiza el menú y el selector; el título de la lista seleccionada se sincroniza después de guardar. Un error mantiene el borrador disponible para reintentar y una operación pendiente bloquea envíos duplicados.
