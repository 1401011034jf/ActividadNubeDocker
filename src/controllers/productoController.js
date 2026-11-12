const pool = require('../config/database');

const COLUMNAS = 'id, nombre, descripcion, precio::float8 AS precio, stock, fecha_creacion';

// ---------- Validaciones ----------
const validarId = (valor) => /^[1-9]\d*$/.test(valor) && Number.isSafeInteger(Number(valor));

const validarProducto = (body) => {
  const errores = [];
  const { nombre, descripcion, precio, stock } = body || {};

  if (typeof nombre !== 'string' || nombre.trim() === '') {
    errores.push('El nombre es obligatorio y debe ser un texto no vacío');
  } else if (nombre.trim().length > 100) {
    errores.push('El nombre no puede superar los 100 caracteres');
  }

  if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
    errores.push('La descripción debe ser un texto');
  }

  if (typeof precio !== 'number' || !Number.isFinite(precio) || precio <= 0) {
    errores.push('El precio es obligatorio y debe ser un número mayor que cero');
  }

  if (typeof stock !== 'number' || !Number.isInteger(stock) || stock < 0) {
    errores.push('El stock es obligatorio y debe ser un número entero mayor o igual a cero');
  }

  return errores;
};

const respuestaIdInvalido = (res) =>
  res.status(400).json({
    success: false,
    message: 'El identificador debe ser un número entero positivo'
  });

// ---------- Controladores ----------
const crearProducto = async (req, res, next) => {
  try {
    const errores = validarProducto(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: errores });
    }

    const { nombre, descripcion, precio, stock } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUMNAS}`,
      [nombre.trim(), descripcion ?? null, precio, stock]
    );

    res.status(201).json({ success: true, message: 'Producto creado correctamente', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const listarProductos = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM productos ORDER BY id ASC`);
    res.status(200).json({
      success: true,
      message: 'Productos obtenidos correctamente',
      count: rows.length,
      data: rows
    });
  } catch (err) {
    next(err);
  }
};

const obtenerProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validarId(id)) return respuestaIdInvalido(res);

    const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM productos WHERE id = $1`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `No existe un producto con id ${id}` });
    }

    res.status(200).json({ success: true, message: 'Producto obtenido correctamente', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const actualizarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validarId(id)) return respuestaIdInvalido(res);

    const errores = validarProducto(req.body);
    if (errores.length > 0) {
      return res.status(400).json({ success: false, message: 'Datos inválidos', errors: errores });
    }

    const { nombre, descripcion, precio, stock } = req.body;
    const { rows } = await pool.query(
      `UPDATE productos
       SET nombre = $1, descripcion = $2, precio = $3, stock = $4
       WHERE id = $5
       RETURNING ${COLUMNAS}`,
      [nombre.trim(), descripcion ?? null, precio, stock, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `No existe un producto con id ${id}` });
    }

    res.status(200).json({ success: true, message: 'Producto actualizado correctamente', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const eliminarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validarId(id)) return respuestaIdInvalido(res);

    const { rows } = await pool.query(
      `DELETE FROM productos WHERE id = $1 RETURNING ${COLUMNAS}`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `No existe un producto con id ${id}` });
    }

    res.status(200).json({ success: true, message: 'Producto eliminado correctamente', data: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  crearProducto,
  listarProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto
};
