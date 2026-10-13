import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import TarjetaProducto from '../components/TarjetaProducto';
import { obtenerProductos, obtenerCategorias, esOferta } from '../data/db';

const SLIDES = [
  { img: '/img/catmeme.png', titulo: 'Nuevos lanzamientos', texto: 'Descubre las últimas poleras de la colección' },
  { img: '/img/vader.webp', titulo: 'Cine y series', texto: 'Estampados para fans de verdad' },
  { img: '/img/sixseven.webp', titulo: 'Ofertas activas', texto: 'Revisa los productos con descuento' },
];

function Inicio() {
  const productos = obtenerProductos();
  const categorias = obtenerCategorias();
  const ofertas = productos.filter(esOferta).slice(0, 4);
  const destacados = productos.slice(0, 8);

  return (
    <>
      {/* Hero */}
      <section className="container my-5">
        <div className="row align-items-center bg-light rounded-4 p-4 p-md-5 shadow-sm">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold text-dark mb-3">TIENDA ONLINE</h1>
            <p className="lead text-secondary mb-4">
              Descubre las últimas tendencias en streetwear y poleras exclusivas. Explora nuestro
              catálogo y encuentra las mejores ofertas con envíos a todo el país.
            </p>
            <Link to="/productos" className="btn btn-dark btn-lg px-4 py-3 rounded-3 fw-semibold shadow-sm">
              <i className="bi bi-bag-check me-2"></i> Ver productos
            </Link>
          </div>

          <div className="col-lg-6">
            <Carousel interval={3000} pause="hover" className="shadow-sm rounded-4 overflow-hidden">
              {SLIDES.map((s) => (
                <Carousel.Item key={s.titulo}>
                  <img
                    className="d-block w-100 object-fit-cover"
                    style={{ height: '380px' }}
                    src={s.img}
                    alt={s.titulo}
                  />
                  <Carousel.Caption className="bg-dark bg-opacity-50 rounded-3 pb-2">
                    <h5>{s.titulo}</h5>
                    <p className="mb-0 d-none d-md-block">{s.texto}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="container my-5">
        <h2 className="fw-bold mb-3">Categorías</h2>
        <div className="d-flex flex-wrap gap-2">
          {categorias.map((c) => (
            <Link key={c.id} to={`/categorias?cat=${c.id}`} className="btn btn-outline-dark rounded-pill px-4">
              {c.nombre}
            </Link>
          ))}
        </div>
      </section>

      {/* Ofertas */}
      {ofertas.length > 0 && (
        <section className="container my-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold m-0">Ofertas del momento</h2>
            <Link to="/ofertas">Ver todas</Link>
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {ofertas.map((p) => (
              <div className="col" key={p.id}>
                <TarjetaProducto producto={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catálogo destacado */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-bold m-0">Catálogo destacado</h2>
          <Link to="/productos">Ver todos</Link>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {destacados.map((p) => (
            <div className="col" key={p.id}>
              <TarjetaProducto producto={p} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Inicio;