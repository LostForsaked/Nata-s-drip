import {
  obtenerOrdenes, obtenerProductosCriticos, buscarProductoPorId, nombreCategoria,
} from '../../data/db';
import { resumenVentas, ventasPorProducto, ventasPorCategoria } from '../../utils/reportes';
import { formatoCLP } from '../../utils/formato';

function Tarjeta({ titulo, valor, clase }) {
  return (
    <div className="col-6 col-lg-3">
      <div className={`card text-white border-0 rounded-4 h-100 ${clase}`}>
        <div className="card-body">
          <div className="small">{titulo}</div>
          <div className="fs-3 fw-bold">{valor}</div>
        </div>
      </div>
    </div>
  );
}

export default function AdminReportes() {
  const ordenes = obtenerOrdenes();
  const resumen = resumenVentas(ordenes);
  const productos = ventasPorProducto(ordenes);
  const categorias = ventasPorCategoria(ordenes, (id) =>
    nombreCategoria(buscarProductoPorId(id)?.categoriaId)
  );

  return (
    <>
      <h1 className="fw-bold mb-4">Reportes</h1>

      <div className="row g-3 mb-4">
        <Tarjeta titulo="Total vendido" valor={formatoCLP(resumen.totalVendido)} clase="bg-primary" />
        <Tarjeta titulo="Compras pagadas" valor={resumen.cantidadPagadas} clase="bg-success" />
        <Tarjeta titulo="Ticket promedio" valor={formatoCLP(resumen.ticketPromedio)} clase="bg-info" />
        <Tarjeta titulo="Productos críticos" valor={obtenerProductosCriticos().length} clase="bg-warning" />
      </div>

      <p className="text-secondary">
        Pagos fallidos: <strong>{resumen.fallidas}</strong> · Pendientes: <strong>{resumen.pendientes}</strong>
      </p>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h2 className="h5 fw-bold">Productos más vendidos</h2>
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr><th>Producto</th><th>Unidades</th><th>Ingresos</th></tr>
              </thead>
              <tbody>
                {productos.slice(0, 10).map((p) => (
                  <tr key={p.productoId}>
                    <td>{p.nombre}</td><td>{p.unidades}</td><td>{formatoCLP(p.ingresos)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {productos.length === 0 && <p className="text-muted mb-0 mt-3">Aún no hay ventas.</p>}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h2 className="h5 fw-bold">Ingresos por categoría</h2>
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr><th>Categoría</th><th>Ingresos</th></tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.categoria}><td>{c.categoria}</td><td>{formatoCLP(c.ingresos)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}