require('dotenv').config();
const app = require('./app');
const pool = require('./config/database');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = '0.0.0.0'; // Necesario para que sea accesible desde un contenedor

const server = app.listen(PORT, HOST, async () => {
  console.log(`ProductManager API escuchando en http://${HOST}:${PORT}`);

  // Comprueba la conexión al iniciar, sin detener el servidor si falla
  try {
    await pool.query('SELECT 1');
    console.log('Conexión con PostgreSQL establecida');
  } catch (err) {
    console.error(`No se pudo conectar con PostgreSQL (${process.env.DB_HOST}:${process.env.DB_PORT}): ${err.message}`);
    console.error('La API seguirá activa; revisa /health para ver el estado de la conexión.');
  }
});

// Cierre ordenado (docker stop envía SIGTERM)
const shutdown = (signal) => {
  console.log(`${signal} recibido, cerrando servidor...`);
  server.close(async () => {
    await pool.end().catch(() => {});
    process.exit(0);
  });
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
