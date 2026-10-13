import { formatoCLP, etiquetaPrecio } from '../utils/formato';

export default function ResumenOrden({ orden }) {
  const { cliente, direccion, items } = orden;

  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <h6 className="fw-bold">Cliente</h6>
          <p className="mb-0">{cliente.nombre} {cliente.apellidos}</p>
          <p className="mb-0 text-muted">{cliente.correo}</p>
        </div>
        <div className="col-md-6">
          <h6 className="fw-bold">Dirección de entrega</h6>
          <p className="mb-0">
            {direccion.calle}
            {direccion.departamento ? `, Depto ${direccion.departamento}` : ''}
          </p>
          <p className="mb-0 text-muted">{direccion.comuna}, {direccion.region}</p>
          {direccion.indicaciones && <p className="mb-0 small fst-italic">“{direccion.indicaciones}”</p>}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th className="text-end">Precio</th>
              <th className="text-center">Cantidad</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.productoId}>
                <td>
                  <img src={i.imagen} alt={i.nombre} width="48" height="48" className="rounded object-fit-cover" />
                </td>
                <td>{i.nombre}</td>
                <td className="text-end">{etiquetaPrecio(i.precioUnitario)}</td>
                <td className="text-center">{i.cantidad}</td>
                <td className="text-end">{etiquetaPrecio(i.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="text-end">Subtotal</td>
              <td className="text-end">{formatoCLP(orden.subtotal)}</td>
            </tr>
            {orden.descuento > 0 && (
              <tr className="text-success">
                <td colSpan="4" className="text-end">Cupón {orden.cupon}</td>
                <td className="text-end">-{formatoCLP(orden.descuento)}</td>
              </tr>
            )}
            <tr className="fw-bold fs-5">
              <td colSpan="4" className="text-end">Total</td>
              <td className="text-end">{formatoCLP(orden.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}