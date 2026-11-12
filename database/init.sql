-- ProductManager API - Inicialización de la base de datos
--
-- La base de datos "productmanager" se crea así:
--   * Con Docker: la imagen oficial de PostgreSQL la crea con POSTGRES_DB=productmanager
--     y ejecuta automáticamente los .sql de /docker-entrypoint-initdb.d.
--   * Localmente:  CREATE DATABASE productmanager;   (y luego conectarse a ella)
--
-- Este script es idempotente: se puede ejecutar más de una vez sin duplicar datos.

CREATE TABLE IF NOT EXISTS productos (
    id             SERIAL PRIMARY KEY,
    nombre         VARCHAR(100)  NOT NULL,
    descripcion    TEXT,
    precio         NUMERIC(10,2) NOT NULL CHECK (precio > 0),
    stock          INTEGER       NOT NULL DEFAULT 0 CHECK (stock >= 0),
    fecha_creacion TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Datos de ejemplo (solo si la tabla está vacía)
INSERT INTO productos (nombre, descripcion, precio, stock)
SELECT * FROM (VALUES
    ('Laptop Lenovo IdeaPad 3', 'Laptop de 15.6 pulgadas, 8 GB de RAM y 256 GB SSD', 549.99, 12),
    ('Mouse inalámbrico Logitech M170', 'Mouse óptico inalámbrico de 2.4 GHz', 14.50, 80),
    ('Teclado mecánico Redragon Kumara', 'Teclado mecánico retroiluminado en español', 39.90, 35)
) AS ejemplo(nombre, descripcion, precio, stock)
WHERE NOT EXISTS (SELECT 1 FROM productos);
