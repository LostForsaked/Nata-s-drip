// Convierten filas de MySQL (snake_case) a los objetos que usa el frontend (camelCase),
// con la misma forma que antes guardaba localStorage.

const iso = (fecha) => (fecha ? new Date(fecha).toISOString() : null);

export function precioFinal(precio, descuento) {
  return Math.round(Number(precio) * (1 - Number(descuento || 0) / 100));
}

export function mapCategoria(f) {
  return { id: f.id, nombre: f.nombre };
}

export function mapProducto(f) {
  return {
    id: f.id,
    codigo: f.codigo,
    nombre: f.nombre,
    descripcion: f.descripcion,
    imagen: f.imagen,
    precio: Number(f.precio),
    stock: f.stock,
    stockCritico: f.stock_critico ?? '', // '' = sin stock crítico (igual que antes)
    descuento: f.descuento,
    categoriaId: f.categoria_id,
    categoria: f.categoria_nombre ?? undefined,
  };
}

/** Usuario SIN contraseña: es lo único que sale del servidor. */
export function mapUsuario(f) {
  return {
    id: f.id,
    run: f.run ?? '',
    nombre: f.nombre,
    apellidos: f.apellidos,
    correo: f.correo,
    telefono: f.telefono,
    fechaNacimiento: f.fecha_nacimiento ? new Date(f.fecha_nacimiento).toISOString().slice(0, 10) : '',
    rol: f.rol,
    region: f.region,
    comuna: f.comuna,
    direccion: f.direccion,
  };
}

export function mapOrden(f, items = []) {
  return {
    id: f.id,
    numero: f.numero,
    estado: f.estado,
    usuarioId: f.usuario_id,
    cliente: { nombre: f.cliente_nombre, apellidos: f.cliente_apellidos, correo: f.cliente_correo },
    direccion: {
      calle: f.dir_calle,
      departamento: f.dir_departamento,
      region: f.dir_region,
      comuna: f.dir_comuna,
      indicaciones: f.dir_indicaciones,
    },
    items: items.map((i) => ({
      productoId: i.producto_id,
      nombre: i.nombre,
      imagen: i.imagen || '/img/Logo.jpg',
      precioUnitario: Number(i.precio_unitario),
      cantidad: i.cantidad,
      subtotal: Number(i.subtotal),
    })),
    subtotal: Number(f.subtotal),
    descuento: Number(f.descuento),
    total: Number(f.total),
    cupon: f.cupon,
    fecha: iso(f.fecha),
    fechaPago: iso(f.fecha_pago),
  };
}
