# Awesome list
Awesomelist es una simple aplicación de lista de tareas.

## Características
Este proyecto pretende ser una simple aplicación para administrar tareas, más sin embargo pretende tener algunas características que aumenten la calidad de este proyecto.

### Proveedor de API
Se pretende que a través de un servidor proporcione una API para que se pueda consumir desde otro servicio, ya sea una aplicación de escritorioo una aplicación móvil.

### Registro de usuarios
A través de la API que se proporcionará, debe de contar con métodos para poder registrar y autenticar usuarios para poder obtener la información del usuario en cuestión.

### Estructura
Se pretende que inicialmente tenga una estructura simple pero con la oportunidad de agregar más características a la aplicación, no sólo una _lista de tareas_ sino también:

- Crear proyectos y agrupar las tareas.
- Colaboración en proyectos con otros usuarios registrados.
- Integración de otras API's para compartir documentos (Dropbox, Google Drive, OneDrive).

### Tecnologías
Se pretende crear los servicios con [Express.js](http://expressjs.com/es/) por la facilidad y escalabilidad que proporciona [Node.js](https://nodejs.org/es/).

Inicialmente para consumir los servicios una webapp utilizando [Vue.js](https://vuejs.org/) y que con estas mismas tecnologías web de parte del cliente, se puedan reutilizar en una aplicación de escritorio usando [Electron.js](https://electronjs.org/) o una aplicación móvil usando [Flutter](https://flutter.io/).

Por el fácil manejo de datos entre estas tecnologías se pretende usar NoSQL y como manejador de base de datos [MongoDB](https://www.mongodb.com/).

## Motivación
El principal objetivo para hacer esta aplicación es aprender las tecnologías mencionadas y la integración entre éstas para construir aplicaciones escalables y de fácil mantenimiento.