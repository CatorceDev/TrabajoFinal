# 🐟 Lonja de Veracruz

Proyecto escolar para la clase de **Programación Web 2**, desarrollado para practicar la creación y el consumo de una API REST. Incluye una interfaz web para compradores, un panel de administración y un servidor que gestiona autenticación y datos mediante MariaDB.

## 🧰 Tecnologías

- **Cliente:** React, React Router y Vite.
- **Servidor:** Node.js, Express y Sequelize.
- **Base de datos:** MariaDB.
- **Autenticación:** contraseñas cifradas con bcrypt y tokens JWT.
- **Correo:** Nodemailer para enviar el enlace de confirmación de registro.
- **Documentos PDF:** jsPDF para generar tickets de pedido; la guía administrativa se sirve desde los recursos públicos del cliente.

## 🛒 Funcionalidades

- Registro de compradores con confirmación por correo e inicio de sesión.
- Catálogo de lotes con búsqueda y filtros para consultar la disponibilidad.
- Carrito y creación de pedidos. El checkout permite seleccionar un método de pago visual, pero no procesa cobros ni guarda datos de tarjetas.
- Consulta de pedidos y su estado; cada pedido puede generar un ticket PDF.
- Panel de administración con resumen, catálogo de especies y tipos, lotes, compradores y pedidos.
- Administración de estados de pedido, búsqueda y filtros en las listas.
- Edición del perfil propio (nombre, apellidos, correo, dirección y cambio de contraseña).
- Guía de uso del panel en [Client/public/guia-administrador.pdf](Client/public/guia-administrador.pdf), disponible también desde **Ver guía** en el panel.

## 📁 Estructura del proyecto

```text
Client/   Aplicación React
Server/   API REST, modelos y conexión a MariaDB
```

## ✅ Requisitos

- Node.js y npm.
- MariaDB en ejecución y una base de datos creada para el proyecto.
- Una cuenta/servidor SMTP configurado si se quiere probar el envío de correos de confirmación.

## ⚙️ Configuración

### 🖥️ Servidor

Desde la carpeta del servidor, crea un archivo `.env` a partir de la plantilla:

```powershell
cd Server
Copy-Item .env.example .env
```

En macOS o Linux puedes usar `cp .env.example .env`. Edita `Server/.env` con tus datos locales:

| Variable | Descripción |
| --- | --- |
| `DB_NAME` | Nombre de la base de datos MariaDB ya creada. |
| `DB_USER`, `DB_PASSWORD` | Usuario y contraseña de MariaDB. |
| `DB_HOST`, `DB_PORT` | Host y puerto de MariaDB (por ejemplo, `127.0.0.1` y `3306`). |
| `DB_DIALECT` | Dialecto de Sequelize; usa `mariadb`. |
| `JWTSECRET` | Clave privada para firmar los tokens JWT. Cámbiala por una clave segura. |
| `CORREO_HOST`, `CORREO_PORT` | Host y puerto del servidor SMTP. |
| `CORREO_USER`, `CORREO_PASS` | Credenciales SMTP para enviar confirmaciones. |

La plantilla también contiene `ADMIN_USER`, `ADMIN_PASSWORD`, `URL_BACKEND` y `PORT_BACKEND`; el servidor inicia en el puerto `2900` de forma predeterminada. No compartas ni subas tu archivo `.env`.

Instala dependencias e inicia el servidor:

```powershell
npm install
npm run dev
```

El servidor intenta conectarse a MariaDB y sincronizar los modelos al iniciar. La API queda disponible normalmente en `http://localhost:2900`.

### 🌐 Cliente

En otra terminal, desde la raíz del proyecto:

```powershell
cd Client
npm install
npm run dev
```

Vite muestra en la terminal la dirección local del cliente (normalmente `http://localhost:5173`). El cliente está configurado para comunicarse con la API en `http://localhost:2900`; el servidor también permite solicitudes desde `http://localhost:5173`.

## 🔌 Rutas de la API

Todas las respuestas y solicitudes de datos usan JSON, salvo que se indique lo contrario.

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| `GET` | `/` | Público | Mensaje de bienvenida de la API. |
| `POST` | `/api/auth/nuevo` | Público | Registra un comprador. Recibe `name`, `firstLastName`, `secondLastName`, `email`, `address`, `password` y `confirmPassword`. |
| `GET` | `/api/auth/confirmarInscripcion/:token` | Público | Confirma el registro con el token enviado por correo. |
| `POST` | `/api/auth/signin` | Público | Inicia sesión con `email` y `password`; devuelve un JWT. |
| `GET` | `/api/auth/session` | JWT requerido | Verifica la sesión actual. |
| `GET` | `/api/comprador` | JWT y rol administrador | Consulta la lista de compradores. |
| `GET` | `/api/comprador/:id` | JWT requerido | Consulta un comprador por su identificador. |
| `PUT` | `/api/comprador/profile` | JWT requerido | Actualiza los datos propios y, opcionalmente, la contraseña; un correo nuevo requiere confirmación. |
| `GET` | `/api/especies`, `/api/especies/:id` | JWT requerido | Consulta especies. |
| `POST`, `PUT`, `DELETE` | `/api/especies`, `/api/especies/:id` | JWT y rol administrador | Crea, actualiza o elimina especies. |
| `GET` | `/api/tipos`, `/api/tipos/:id` | JWT requerido | Consulta tipos de especie. |
| `POST`, `PUT`, `DELETE` | `/api/tipos`, `/api/tipos/:id` | JWT y rol administrador | Crea, actualiza o elimina tipos. |
| `GET` | `/api/lotes`, `/api/lotes/:id` | JWT requerido | Consulta lotes. |
| `POST`, `PUT`, `DELETE` | `/api/lotes`, `/api/lotes/:id` | JWT y rol administrador | Crea, actualiza o elimina lotes. |
| `GET` | `/api/compras`, `/api/compras/:id` | JWT requerido | Consulta pedidos; los compradores ven los propios y administración puede consultar todos. |
| `POST` | `/api/compras` | JWT requerido | Crea un pedido. |
| `PATCH` | `/api/compras/:id/estado` | JWT y rol administrador | Actualiza el estado de un pedido. |
| `DELETE` | `/api/compras/:id` | JWT requerido | Marca el pedido como cancelado; se valida que pertenezca al comprador o que la acción sea administrativa. |

Para las rutas protegidas, envía el token en el encabezado:

```http
Authorization: Bearer <token>
```

## ▶️ Scripts disponibles

- En `Client`: `npm run dev`, `npm run build`, `npm run lint` y `npm run preview`.
- En `Server`: `npm run dev` (reinicio con nodemon) y `npm start`.

## 🎓 Estado del proyecto

Este proyecto tiene fines educativos y se encuentra en desarrollo. Los métodos y niveles de acceso descritos corresponden a las rutas implementadas actualmente. La selección de método de pago en el cliente es solo visual: no existe procesamiento de pagos.
