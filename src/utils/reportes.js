const PAGADA = 'Pagada';

export function resumenVentas(ordenes) {
  const pagadas = ordenes.filter((o) => o.estado === PAGADA);
  const totalVendido = pagadas.reduce((acc, o) => acc + Number(o.total), 0);
  return {
    cantidadPagadas: pagadas.length,
    totalVendido,
    ticketPromedio: pagadas.length ? Math.round(totalVendido / pagadas.length) : 0,
    fallidas: ordenes.filter((o) => o.estado === 'Pago fallido').length,
    pendientes: ordenes.filter((o) => o.estado === 'pendiente de pago').length,
  };
}


export function ventasPorProducto(ordenes) {
  const mapa = new Map();
  ordenes
    .filter((o) => o.estado === PAGADA)
    .forEach((o) =>
      o.items.forEach((i) => {
        const actual = mapa.get(i.productoId) ?? {
          productoId: i.productoId, nombre: i.nombre, unidades: 0, ingresos: 0,
        };
        actual.unidades += Number(i.cantidad);
        actual.ingresos += Number(i.subtotal);
        mapa.set(i.productoId, actual);
      })
    );
  return [...mapa.values()].sort((a, b) => b.unidades - a.unidades);
}


export function ventasPorCategoria(ordenes, nombreDeCategoria) {
  const acc = {};
  ventasPorProducto(ordenes).forEach((p) => {
    const cat = nombreDeCategoria(p.productoId);
    acc[cat] = (acc[cat] ?? 0) + p.ingresos;
  });
  return Object.entries(acc)
    .map(([categoria, ingresos]) => ({ categoria, ingresos }))
    .sort((a, b) => b.ingresos - a.ingresos);
}