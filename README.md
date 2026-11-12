# ProductManager API

API REST para gestionar un inventario de productos mediante operaciones CRUD (Crear, Consultar, Actualizar y Eliminar). Desarrollada con **Node.js**, **Express** y **PostgreSQL**, y preparada para ejecutarse mediante **Docker** y **Docker Compose**.

---

# 1. Tecnologías utilizadas

- Node.js 22
- Express.js
- PostgreSQL 16
- Docker
- Docker Compose
- Postman

---

# 2. Requisitos previos

Para ejecutar el proyecto mediante Docker se necesita:

- Docker Desktop instalado y en ejecución.
- Docker Compose (incluido en Docker Desktop).
- Git para clonar el repositorio.
- Postman para probar los endpoints (opcional).

---
# 3. Estructura del proyecto

```text
ProductManager-API/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── app.js
│   └── server.js
│
├── database/
│   └── init.sql
│
├── postman/
│   └── ProductManager-API.postman_collection.json
│
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

---

# 4. Configuración de variables de entorno

Antes de iniciar los contenedores, es necesario crear el archivo `.env` a partir de la plantilla proporcionada.

En Linux o macOS:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Abrir el archivo `.env` y configurar los valores:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=productmanager
DB_USER=postgres
DB_PASSWORD=change_me
```

Cambiar `DB_PASSWORD` por una contraseña propia.

> **Importante:** El archivo `.env` contiene la configuración privada y no debe subirse al repositorio. El archivo `.env.example` funciona como plantilla y no contiene credenciales reales.

Al ejecutar Docker Compose, la configuración del servicio `api` establece automáticamente:

```env
DB_HOST=db
DB_PORT=5432
```

para permitir la comunicación interna con PostgreSQL.

---

# 5. Construcción e inicio de la aplicación

Ubicarse en la carpeta principal del proyecto, donde se encuentra el archivo `docker-compose.yml`.

## Construir las imágenes

```bash
docker compose build
```

## Iniciar los contenedores

```bash
docker compose up -d --build
```

Este comando construye la imagen de la API e inicia los servicios de aplicación y base de datos en segundo plano.

## Verificar los contenedores

```bash
docker compose ps
```

## Consultar logs

```bash
docker compose logs -f
```

La API estará disponible en:

```text
http://localhost:3000
```

---

# 6. Inicialización de la base de datos

La base de datos PostgreSQL se configura automáticamente mediante Docker Compose.

El archivo `database/init.sql` se monta en:

```text
/docker-entrypoint-initdb.d/init.sql
```

Cuando PostgreSQL inicializa un volumen de datos vacío, ejecuta automáticamente este archivo, creando la tabla `productos` e insertando registros de ejemplo.

Se utiliza un volumen persistente llamado:

```text
productmanager_data
```

Esto permite conservar los datos aunque se detengan o eliminen los contenedores.

> **Importante:** El archivo `init.sql` solamente se ejecuta automáticamente cuando se inicializa una base de datos nueva. Si el volumen ya contiene datos, no vuelve a ejecutarse.

Para reiniciar completamente la base de datos y volver a ejecutar el script de inicialización:

```bash
docker compose down -v
docker compose up -d --build
```

> **Advertencia:** El primer comando elimina también el volumen y todos los datos almacenados en PostgreSQL.

---

# 7. Operaciones CRUD

La API utiliza los siguientes endpoints:

| Método | Endpoint | Función |
|----------|----------|----------|
| GET | `/` | Verificar funcionamiento de la API |
| GET | `/health` | Comprobar conexión con PostgreSQL |
| POST | `/api/productos` | Registrar un producto |
| GET | `/api/productos` | Listar todos los productos |
| GET | `/api/productos/:id` | Consultar producto por ID |
| PUT | `/api/productos/:id` | Actualizar un producto |
| DELETE | `/api/productos/:id` | Eliminar un producto |

## Registrar un producto

**Método:** `POST`

**URL:**

```text
http://localhost:3000/api/productos
```

**Body (JSON):**

```json
{
  "nombre": "Monitor 24 pulgadas",
  "descripcion": "Monitor Full HD",
  "precio": 149.99,
  "stock": 20
}
```

---

## Consultar productos

**Método:** `GET`

```text
http://localhost:3000/api/productos
```

---

## Consultar un producto por ID

**Método:** `GET`

```text
http://localhost:3000/api/productos/1
```

---

## Actualizar un producto

**Método:** `PUT`

```text
http://localhost:3000/api/productos/1
```

**Body (JSON):**

```json
{
  "nombre": "Monitor Samsung 24 pulgadas",
  "descripcion": "Monitor Full HD actualizado",
  "precio": 179.99,
  "stock": 15
}
```

---

## Eliminar un producto

**Método:** `DELETE`

```text
http://localhost:3000/api/productos/1
```

---

# 8. Pruebas con Postman

El proyecto incluye una colección de solicitudes para comprobar el funcionamiento de la API.

Para utilizarla:

1. Abrir Postman.
2. Seleccionar la opción **Import**.
3. Seleccionar el archivo:

   ```text
   postman/ProductManager-API.postman_collection.json
   ```

4. Importar la colección.
5. Ejecutar las solicitudes para comprobar las operaciones CRUD y las respuestas de error.

---

# 9. Detención de los contenedores

## Detener y eliminar contenedores sin borrar datos

```bash
docker compose down
```

## Detener temporalmente los servicios

```bash
docker compose stop
```

## Volver a iniciar los servicios

```bash
docker compose start
```

---

# 10. Errores frecuentes y soluciones

## Error 1: DB_PASSWORD no está configurada

### Causa

No existe el archivo `.env` o la variable `DB_PASSWORD` está vacía.

### Solución

Crear el archivo `.env` copiando `.env.example` y configurar una contraseña válida.

---

## Error 2: El puerto 3000 ya está en uso

### Causa

Otra aplicación está utilizando el puerto 3000 de la computadora.

### Solución

Detener la aplicación que utiliza ese puerto o modificar el puerto externo en `docker-compose.yml`.

Por ejemplo:

```yaml
ports:
  - "3001:3000"
```

En ese caso, la API estará disponible en:

```text
http://localhost:3001
```

---

## Error 3: Los cambios en init.sql no se reflejan en PostgreSQL

### Causa

El volumen `productmanager_data` ya contiene una base de datos inicializada y PostgreSQL no vuelve a ejecutar automáticamente el script.

### Solución

Si se desea reiniciar la base de datos desde cero, ejecutar:

```bash
docker compose down -v
docker compose up -d --build
```

Esto eliminará los datos existentes y ejecutará nuevamente el archivo `init.sql`.

---

# 11. Ejecución local sin Docker (opcional)

También es posible ejecutar la aplicación directamente en el equipo.

## Requisitos

- Node.js 18 o superior.
- PostgreSQL 14 o superior.

## Instalar dependencias

```bash
npm install
```

Crear y configurar el archivo `.env` a partir de `.env.example`.

## Crear la base de datos

```bash
psql -U postgres -c "CREATE DATABASE productmanager;"
```

## Inicializar tablas y registros

```bash
psql -U postgres -d productmanager -f database/init.sql
```

## Iniciar la aplicación

```bash
npm start
```

La API estará disponible en:

```text
http://localhost:3000
```
