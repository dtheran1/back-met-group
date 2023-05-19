# Proyecto Backend MetGroup

Este proyecto es el backend de una aplicación que es consumida por un frontend separado. A continuación, se proporciona una guía de configuración y uso para el proyecto backend.

## Configuración del entorno

1. Clona este repositorio en tu máquina local:

```
git clone https://github.com/dtheran1/back-met-group
```

2. Instala las dependencias del proyecto:
```
npm install
```

## Uso del proyecto

1. Inicia el servidor del proyecto backend:

```
npm start
```

2. El servidor estará disponible en la dirección y puerto configurados. Asegúrate de que el servidor esté funcionando correctamente y aceptando solicitudes.

## Endpoints de la API
 * `'/register'`: Permite a los usuarios registrarse proporcionando un nombre de usuario y una contraseña. El usuario se almacena en la matriz `registeredUsers`.

* `/auth`: Permite a los usuarios iniciar sesión proporcionando un nombre de usuario y una contraseña. Si se encuentran las credenciales válidas, se genera un token JWT para la autenticación posterior.

* `/store/:name`: (POST, GET y DELETE): Permite crear una nueva tienda y obtener información sobre una tienda existente utilizando el nombre de la tienda como parámetro, tambien permite eliminar una tienda utilizando el nombre de la tienda.

* `/stores`: (GET): Devuelve una lista de todas las tiendas en la base de datos.

* `/item/:name`: (POST, GET, PUT y DELETE): Permite agregar, obtener, actualizar y eliminar elementos de una tienda utilizando el nombre del elemento como parámetro.

* `/items`:  (GET): Devuelve una lista de todos los elementos de la base de datos.

## Descripción de los puntos principales del código:

1. Importaciones de módulos: El código importa los módulos necesarios para el funcionamiento del servidor, como Express, CORS, y JSON Web Token (JWT).

2. Configuración básica del servidor: Se crea una instancia de la aplicación Express y se configuran middleware como express.json() para analizar los datos enviados en formato JSON y cors() para habilitar el intercambio de recursos entre dominios.

3. Base de datos simulada: Se define una matriz llamada db que actúa como una base de datos simulada. Contiene información sobre diferentes tiendas y sus elementos.

4. Usuarios registrados: También se define una matriz llamada registeredUsers para almacenar información sobre los usuarios registrados en la aplicación.

5. Middleware de verificación de token: Se define un middleware llamado verifyToken que se utiliza como middleware en el endpoint /stores. Este middleware verifica la autenticidad del token JWT proporcionado en la solicitud.

6. Configuración del servidor: El servidor se inicia en el puerto 3001.