import { useState, useEffect } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import TarjetaProducto from '../components/TarjetaProducto';
import { agregarAlCarritoGlobal } from '../utils/cardLogic';
import {
  obtenerProductos,
  buscarProductoPorId,
  nombreCategoria,
  esOferta,
  precioFinal,
} from '../data/db';
import { formatoCLP, etiquetaPrecio } from '../utils/formato';


function DetalleProducto({ producto }) {
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState(null);

  const stock = Number(producto.stock);
  const agotado = stock <= 0;
  const oferta = esOferta(producto);

  const relacionados = obtenerProductos()
    .filter((p) => String(p.categoriaId) === String(producto.categoriaId) && p.id !== producto.id)
    .slice(0, 4);

  const handleAgregar = () => {
    const resultado = agregarAlCarritoGlobal(producto.id, cantidad);
    if (!resultado.ok) {
      setMensaje({ tipo: 'danger', texto: 'Este producto no tiene stock disponible.' });
    } else if (resultado.limitadoPorStock) {
      setMensaje({
        tipo: 'warning',
        texto: 'Tu carrito ya tiene el máximo de unidades disponibles de este producto.',
      });
    } else {
      setMensaje({
        tipo: 'success',
        texto: `Añadiste ${cantidad} ${cantidad === 1 ? 'unidad' : 'unidades'} al carrito.`,
      });
    }
  };

  return (
    <main className="container my-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos" className="text-decoration-none">Productos</Link></li>
          <li className="breadcrumb-item">
            <Link to={`/categorias?cat=${producto.categoriaId}`} className="text-decoration-none">
              {nombreCategoria(producto.categoriaId)}
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-5 align-items-center">
        <div className="col-lg-6 text-center">
          <div className="p-3 border rounded-4 bg-light shadow-sm">
            <img
              src={producto.imagen}
              className="img-fluid rounded object-fit-contain"
              style={{ maxHeight: '380px' }}
              alt={producto.nombre}
            />
          </div>
        </div>

        <div className="col-lg-6 d-flex flex-column justify-content-center">
          <span className="badge text-bg-secondary align-self-start mb-2">
            {nombreCategoria(producto.categoriaId)}
          </span>
          <h2 className="fw-bold text-dark mb-2">{producto.nombre}</h2>

          <div className="h3 fw-bold mb-3">
            {oferta && (
              <span className="text-secondary text-decoration-line-through fs-5 me-2">
                {formatoCLP(producto.precio)}
              </span>
            )}
            <span className={oferta ? 'text-danger' : 'text-primary'}>
              {etiquetaPrecio(precioFinal(producto))}
            </span>
            {oferta && <span className="badge bg-danger ms-2 fs-6">-{producto.descuento}%</span>}
          </div>

          <p className="text-muted mb-3">
            {producto.descripcion || 'Polera de alta calidad con estampado exclusivo. 100% algodón.'}
          </p>

          <p className="mb-3">
            <small className="text-muted">Código: {producto.codigo}</small>
            <br />
            {agotado ? (
              <span className="text-danger fw-semibold">Agotado</span>
            ) : (
              <span className="text-success">Stock disponible: {stock}</span>
            )}
          </p>

          <div className="mb-4">
            <label htmlFor="quantitySelect" className="form-label fw-semibold">Cantidad:</label>
            <input
              type="number"
              id="quantitySelect"
              className="form-control text-center fw-bold"
              value={cantidad}
              min="1"
              max={stock}
              disabled={agotado}
              onChange={(e) => {
                const n = parseInt(e.target.value, 10) || 1;
                setCantidad(Math.min(Math.max(1, n), Math.max(1, stock)));
              }}
              style={{ width: '100px' }}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            disabled={agotado}
            onClick={handleAgregar}
          >
            <i className="bi bi-cart-plus fs-5"></i>
            {agotado ? 'Sin stock' : 'Añadir al carrito'}
          </button>

          {mensaje && (
            <div className={`alert alert-${mensaje.tipo} mt-3 mb-0 d-flex justify-content-between align-items-center`}>
              <span>{mensaje.texto}</span>
              {mensaje.tipo !== 'danger' && (
                <Link to="/carrito" className="alert-link ms-3">Ir al carrito</Link>
              )}
            </div>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="mt-5">
          <h3 className="fw-bold mb-3">También te puede interesar</h3>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {relacionados.map((p) => (
              <div className="col" key={p.id}>
                <TarjetaProducto producto={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Detalles() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const id = searchParams.get('id') || params.id;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const producto = id ? buscarProductoPorId(id) : null;

  if (!producto) {
    return (
      <main className="container my-5 text-center">
        <div className="card border-0 shadow-sm p-5 rounded-4">
          <i className="bi bi-exclamation-circle fs-1 text-warning mb-3"></i>
          <h3 className="fw-bold">Producto no encontrado</h3>
          <p className="text-muted">Es posible que ya no esté disponible.</p>
          <div>
            <Link to="/productos" className="btn btn-primary rounded-pill px-4">Ver todos los productos</Link>
          </div>
        </div>
      </main>
    );
  }

  return <DetalleProducto key={producto.id} producto={producto} />;
}

export default Detalles;