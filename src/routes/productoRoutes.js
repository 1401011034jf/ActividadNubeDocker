const express = require('express');
const controller = require('../controllers/productoController');

const router = express.Router();

router.post('/', controller.crearProducto);
router.get('/', controller.listarProductos);
router.get('/:id', controller.obtenerProducto);
router.put('/:id', controller.actualizarProducto);
router.delete('/:id', controller.eliminarProducto);

module.exports = router;
