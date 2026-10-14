# Notas de mantenimiento

## 13 de octubre de 2026 — Desplegables de colecciones

Se recupera el comportamiento de expandir y contraer cada colección con un clic en su encabezado, y los controles para expandir o contraer todas. La selección de la lista principal se conserva al contraer.

El nombre vuelve a 13 px para evitar el tamaño predeterminado de los botones de Bootstrap. Cada grupo abierto muestra sus tareas dentro de un área fija de 180 px con overflow vertical. Pulsar una tarea de ese listado abre su detalle; los grupos vacíos muestran «Colección vacía».

Se agregan regresiones para el segundo clic, los controles generales, el filtrado del desplegable, apertura del detalle y grupos vacíos.

Validación: pasan las 100 pruebas unitarias, la compilación de producción y la revisión de estilo. Las pruebas anteriores del emulador siguen registradas en la entrega de reglas; este cambio no modifica permisos ni persistencia.

## 13 de octubre de 2026 — Reglas por propietario y perfiles privados

Se integraron las reglas publicadas compartidas por el usuario. Sus permisos anteriores permitían lectura pública de perfiles y acceso a tareas y grupos ajenos desde cualquier cuenta autenticada.

- Los perfiles de `/users/{uid}` solo se leen, crean y actualizan por su propietario.
- Tareas y grupos mantienen las comprobaciones de propietario y pertenencia del patrón de colecciones.
- Las rutas de listas antiguas y las rutas desconocidas quedan cerradas; los documentos existentes se conservan.
- Los formularios comprueban el correo localmente. Firebase Auth determina acceso, correos duplicados y recuperación, sin consultas públicas a perfiles.
- El control de correo conserva su plantilla Pug y sus clases visuales, refleja cambios del padre y no habilita el formulario con una validación aún desconocida.

Publicar el frontend actualizado antes de aplicar el archivo integrado `firebase/firestore.rules`. Los cambios todavía no se han publicado en el proyecto real.

Validación final: 96 pruebas unitarias en cinco suites y 19 casos de reglas en el emulador, todos correctos. Compilación de producción y revisión de estilo sin errores. La comprobación de los correos precargados usa Vue Formulate real, además de los casos de formatos inválidos, registro duplicado y fallos de Auth.

## 13 de octubre de 2026 — Colecciones con tareas directas

Se implementa la relación elegida: cada tarea tiene un `collectionId` propio o `null`. Los grupos y tareas mantienen sus documentos en `collections` y `todos`.

- El menú selecciona colecciones y muestra cuántas tareas contienen. Se retira la consulta a listas anidadas, que producía el mensaje de colección vacía aunque el grupo existiera.
- Crear un grupo lo selecciona; crear una tarea desde ese grupo asigna su ID.
- El detalle incorpora un selector BootstrapVue para mover tareas o dejarlas «Sin colección», conservando la composición y los estilos actuales.
- Crear dentro de un grupo y mover una tarea comprueban pertenencia y propietario mediante transacciones.
- Editar otros campos no sobrescribe la pertenencia con referencias antiguas.
- Los grupos distinguen carga, fallo recuperable y vacío. Los datos antiguos sin `collectionId` siguen apareciendo en Tareas.

Validación: 85 pruebas unitarias y 14 casos de reglas en el emulador. Las herramientas modernas de Firebase para los tests quedan aisladas; la aplicación conserva Firebase 7. El patrón, los comandos y la integración pendiente con reglas publicadas se documentan en `colecciones.md`.

Las reglas de tareas y agrupaciones se ampliaron posteriormente con los perfiles, como describe la entrada anterior. Los datos de listas antiguas no se borran ni se convierten automáticamente.

## 13 de octubre de 2026 — Pruebas y persistencia de tareas

La primera entrega incorpora pruebas unitarias compatibles con Vue 2 y corrige fallos al crear, actualizar y borrar tareas y colecciones.

- Una actualización fallida muestra el error sin anunciar éxito ni reproducir el sonido de tarea completada.
- Borrar desde la lista o el detalle espera el resultado; si falla, permite reintentar sin perder el contexto. Una operación pendiente no se duplica.
- Seleccionar otra tarea mientras una escritura está pendiente mantiene abierto su detalle al terminar la operación anterior.
- Crear una tarea o colección valida texto vacío y conserva el borrador cuando falla el guardado.
- El botón existente junto al nombre de colección ahora guarda. La colección se actualiza mediante su enlace de Vuexfire existente.
- Crear una tarea devuelve su identificador sin modificar el borrador recibido.
- Los filtros funcionan desde el estado inicial. Una respuesta de listas para una colección ausente ya no provoca una excepción.
- Cada instancia del módulo de tareas dispone de su propio estado.

Se conservan las plantillas Pug, Options API, componentes BootstrapVue/Vuesax y estilos CSS/SCSS. Durante escrituras pendientes, los controles afectados se bloquean temporalmente.

Las animaciones de entrada y salida del sidebar conservan sus clases originales. Animate.css ahora se importa desde la dependencia npm en vez de cargarse desde un CDN, para que sus estilos estén disponibles en el entorno local sin esa conexión externa.

Validación: las 34 pruebas iniciales mostraron 22 fallos antes de corregir el código. Después, pasan 39 pruebas en dos suites, incluida la simulación de errores y escrituras pendientes. La compilación de producción y el análisis de estilo pasan en Docker con Node 24.20.0. Los avisos existentes de Sass y tamaño de archivos siguen pendientes.

Cobertura de referencia: 63 % de sentencias y 62.15 % de líneas de los archivos seleccionados en `jest.config.js`. Las pruebas unitarias sustituyen Firebase y bloquean solicitudes HTTP inesperadas.

Siguiente entrega: inicio/carga del perfil y limpieza de sesión (M01 y M04), y validación remota de correo (M10). Después siguen edición del título/notas, fechas y liberación de listeners. El acceso real a Firebase y la revisión visual necesitan una configuración de desarrollo y datos de prueba.
# 14 de octubre de 2026 — Node 24 y despliegue en Vercel

Se declara `engines.node: 24.x` en el manifiesto y el lockfile, con `.nvmrc` para desarrollo local. Docker ya utilizaba Node 24.20.0. El comando de producción invoca Node con `--openssl-legacy-provider` para mantener compatible Webpack 4 fuera del contenedor.

`vercel.json` configura instalación reproducible con npm ci, compilación y salida dist, más las rutas de la SPA para recargar dashboard, login, signup y restore-password. El README incluye el ajuste de Node en Vercel y las variables de Firebase necesarias para compilar.

Validación: npm ci y npm run build completados en Windows con Node 24.20.0. Persisten los avisos existentes de Sass y tamaño del bundle. No se ha realizado un despliegue remoto. La compilación de Docker se detuvo tras demorarse la creación del contenedor; la validación se completó con Node local.

# 13 de octubre de 2026 — Selector de colecciones y barra de tareas

El selector del detalle abre un modal BootstrapVue con búsqueda sin distinguir mayúsculas o acentos, selección actual resaltada, opción Sin colección y lista con scroll. Se importa BModal localmente y se retira el plugin del select nativo. Carga y errores tienen estados propios; los movimientos pendientes bloquean controles y los errores permiten reintentar.

La barra superior permanece visible incluso sin tareas completadas: el botón se deshabilita cuando no hay ninguna. Al cambiar de categoría o colección se reinicia la vista de completadas para mostrar las tareas pendientes. Se conserva el panel y su estilo original.

Validación: 116 pruebas unitarias. En Edge se comprobó el modal, la búsqueda y la cancelación; también se verificó que cambiar de lista restaura la vista de pendientes y mantiene visible la barra. Los movimientos de datos se prueban de forma aislada.

# 13 de octubre de 2026 — Renombrar colecciones

El título grande de la colección, encima de «Nueva tarea», se edita al hacer clic, con Enter o salida del campo para guardar y Escape para cancelar. La edición conserva tamaño, colores e íconos; el nombre y toda la fila del menú lateral siguen seleccionando, expandiendo y contrayendo. Se valida el nombre y se conserva el borrador ante errores, bloqueando envíos duplicados mientras se guarda.

La transacción comprueba al propietario y actualiza únicamente nombre y fecha. Se sincroniza el título de la lista seleccionada. No se necesitan cambios en las reglas publicadas desde `firebase/firestore.rules`.

Validación: 114 pruebas unitarias y 20 pruebas de reglas en el emulador local; análisis de código sin errores. En Edge se comprobó que el clic abre y enfoca el campo y Escape cancela. El guardado se verificó mediante pruebas aisladas, sin renombrar datos reales desde la revisión visual.
