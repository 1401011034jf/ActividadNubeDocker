const express = require('express');
const pool = require('./config/database');
const productoRoutes = require('./routes/productoRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());

// Verifica que la API está funcionando
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ProductManager API funcionando correctamente',
    version: '1.0.0'
  });
});

// Estado de la aplicación y de la conexión con PostgreSQL
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      success: true,
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Health check fallido:', err.message);
    res.status(503).json({
      success: false,
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/api/productos', productoRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
