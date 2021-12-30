# chat-TFG
Aplicación desarrollada para el proyecto de trabajo de fin de grado para la Escuela Superior de Ingeniería Informática, en la Universidad de Vigo.
``Autor: Daniel Gómez Rodríguez``
``Fecha: 25-12-2021``

## Descripción
Esta aplicación ofrece un servicio de mensajería instantánea, similar a WhatsApp o Telegram. El servidor provee tanto del servicio como de la interfaz, por lo que no es necesario instalar ninguna aplicación ni software para su uso (de cara al usuario final).

## Estructura de la aplicación
 1. **Módulo de API (En directorio: MVEN)**
Este módulo se encarga de gestionar las peticiones de un usuario, verifica su identidad, y permite el acceso a las salas de chat. 

2. **Módulo de Interfaz de Usuario (En directorio: VUE)**
Este módulo se encarga de proveer la interfaz de usuario a través de peticiones HTTP. 

	 - Dado que la aplicación no está todavía lista para implementarse en un entorno real, no se ha habilitado cara peticiones HTTPS, pero se realizará en un futuro.

Para detalles más específicos respecto a cada uno de esto módulos, lea el archivo README en cada uno de los directorios del proyecto.

- [Modulo de MVEN](https://github.com/dangr400/chat-TFG/tree/Proyecto-Principal/MVEN)
- [Modulo de VUE](https://github.com/dangr400/chat-TFG/tree/Proyecto-Principal/VUE)

## Instalación

> NOTA: para poder ejecutar esta aplicación es necesario tener instalado previamente NPM  (versión 6.14.14 o posterior)

###  **En entornos Linux/MacOS y Windows (consola)**

    # Para iniciar la API (partiendo del directorio raiz)
    cd MVEN
    npm install
    npm start
    # Para iniciar el frontend (partiendo del directorio raiz)
    cd VUE
    npm install
    npm run serve


