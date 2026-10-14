# Notas de mantenimiento

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
