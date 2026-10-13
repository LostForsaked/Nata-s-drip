import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  detalleCarrito,
  cambiarCantidadCarrito,
  quitarDelCarrito,
  vaciarCarritoGlobal,
  cuponEsValido,
  cuponGuardado,
  guardarCupon,
  calcularTotales,
  CUPON,
} from '../utils/cardLogic';
import { esOferta } from '../data/db';
import { formatoCLP, etiquetaPrecio } from '../utils/formato';

export default function Carrito() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => detalleCarrito());
  const [cuponInput, setCuponInput] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(() => cuponGuardado());
  const [mensajeCupon, setMensajeCupon] = useState(null);

  const refrescar = () => setItems(detalleCarrito());

  const cambiar = (id, delta) => {
    cambiarCantidadCarrito(id, delta);
    refrescar();
  };

  const eliminar = (id) => {
    quitarDelCarrito(id);
    refrescar();
  };

  const vaciar = () => {
    vaciarCarritoGlobal(); // también borra el cupón guardado
    setCuponAplicado(false);
    setCuponInput('');
    setMensajeCupon(null);
    refrescar();
  };

  const aplicarCupon = (e) => {
    e.preventDefault();
    if (cuponEsValido(cuponInput)) {
      guardarCupon(true);
      setCuponAplicado(true);
      setMensajeCupon({ tipo: 'success', texto: `¡Cupón del ${CUPON.porcentaje}% aplicado!` });
    } else {
      guardarCupon(false);
      setCuponAplicado(false);
      setMensajeCupon({ tipo: 'danger', texto: 'Cupón inválido.' });
    }
  };

  const quitarCupon = () => {
    guardarCupon(false);
    setCuponAplicado(false);
    setCuponInput('');
    setMensajeCupon(null);
  };

  const { subtotal, descuento, total } = calcularTotales(items, cuponAplicado);

  // Productos cuyo stock bajó después de agregarlos al carrito
  const conProblemas = items.filter((i) => i.cantidad > Number(i.producto.stock));

  return (
    <main className="container my-5">
      <h2 className="fw-bold mb-4">Mi carrito de compras</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          {conProblemas.length > 0 && (
            <div className="alert alert-warning">
              Algunos productos superan el stock disponible ({conProblemas.map((i) => i.nombre).join(', ')}).
              Ajusta las cantidades para continuar.
            </div>
          )}

          {items.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-5 text-center">
              <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
              <h4>Tu carrito está vacío</h4>
              <p className="text-secondary">Revisa nuestro catálogo y encuentra tus favoritos.</p>
              <div>
                <Link to="/productos" className="btn btn-primary rounded-pill">Ir a la tienda</Link>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const stock = Number(item.producto.stock);
              return (
                <div key={item.id} className="card border-0 shadow-sm rounded-4 mb-3 p-3">
                  <div className="row align-items-center g-3">
                    <div className="col-3 col-sm-2 text-center">
                      <img
                        src={item.imagen}
                        className="img-fluid rounded-3"
                        style={{ maxHeight: '80px', objectFit: 'cover' }}
                        alt={item.nombre}
                      />
                    </div>

                    <div className="col-9 col-sm-4">
                      <Link to={`/detalles?id=${item.id}`} className="text-decoration-none text-dark">
                        <h6 className="fw-bold mb-1">{item.nombre}</h6>
                      </Link>
                      <span className="text-muted small">
                        {esOferta(item.producto) && (
                          <span className="text-decoration-line-through me-1">
                            {formatoCLP(item.producto.precio)}
                          </span>
                        )}
                        {etiquetaPrecio(item.precioUnitario)} c/u
                      </span>
                      <div className="small text-muted">Stock: {stock}</div>
                    </div>

                    <div className="col-6 col-sm-3 d-flex align-items-center justify-content-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-circle"
                        onClick={() => cambiar(item.id, -1)}
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <span className="fw-bold">{item.cantidad}</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary rounded-circle"
                        onClick={() => cambiar(item.id, 1)}
                        disabled={item.cantidad >= stock}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>

                    <div className="col-6 col-sm-3 text-end fw-bold text-primary">
                      {etiquetaPrecio(item.subtotal)}
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 ms-2"
                        onClick={() => eliminar(item.id)}
                        aria-label="Eliminar producto"
                      >
                        <i className="bi bi-x-circle fs-5"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4" style={{ position: 'sticky', top: '90px' }}>
            <h5 className="fw-bold mb-3">Resumen de compra</h5>

            <div className="d-flex justify-content-between mb-2 text-secondary">
              <span>Subtotal</span>
              <span>{formatoCLP(subtotal)}</span>
            </div>

            {cuponAplicado && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>
                  Cupón {CUPON.codigo} ({CUPON.porcentaje}%)
                  <button type="button" className="btn btn-link btn-sm text-danger p-0 ms-2" onClick={quitarCupon}>
                    Quitar
                  </button>
                </span>
                <span>-{formatoCLP(descuento)}</span>
              </div>
            )}

            <hr />

            <div className="d-flex justify-content-between mb-4">
              <span className="fs-5 fw-bold">TOTAL:</span>
              <span className="fs-4 fw-bold text-primary">{formatoCLP(total)}</span>
            </div>

            <form onSubmit={aplicarCupon} className="mb-3">
              <label className="form-label small text-muted">¿Tienes un cupón de descuento?</label>
              <div className="input-group">
                <input
                  type="text"
                  value={cuponInput}
                  onChange={(e) => setCuponInput(e.target.value)}
                  className="form-control"
                  placeholder={`Ej: ${CUPON.codigo}`}
                  disabled={items.length === 0}
                />
                <button className="btn btn-outline-secondary" type="submit" disabled={items.length === 0}>
                  Aplicar
                </button>
              </div>
              {mensajeCupon && (
                <small className={`d-block mt-1 text-${mensajeCupon.tipo}`}>{mensajeCupon.texto}</small>
              )}
            </form>

            <button
              type="button"
              className="btn btn-success btn-lg w-100 fw-bold py-3 mb-2"
              disabled={items.length === 0 || conProblemas.length > 0}
              onClick={() => navigate('/checkout')}
            >
              PAGAR AHORA
            </button>

            <button
              type="button"
              className="btn btn-link text-danger btn-sm text-decoration-none w-100"
              disabled={items.length === 0}
              onClick={vaciar}
            >
              <i className="bi bi-trash me-1"></i> Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}