// Ruta no encontrada (404)
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  });
};

// Manejador global de errores
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // JSON mal formado en el cuerpo de la solicitud
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'El cuerpo de la solicitud no es un JSON válido'
    });
  }

  console.error('Error interno:', err.message);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
};

module.exports = { notFound, errorHandler };
