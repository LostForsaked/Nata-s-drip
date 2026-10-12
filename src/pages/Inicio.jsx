import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sembrarProductosIniciales, obtenerProductos } from '../utils/productos';
import { agregarAlCarritoGlobal } from '../utils/cardLogic';

function Inicio() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    sembrarProductosIniciales(); 

    const lista = obtenerProductos();
    setProductos(lista);
  }, []);

  return (
    <>
      <section className="container my-5">
        <div className="row align-items-center bg-light rounded-4 p-4 p-md-5 shadow-sm">
          
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h1 className="display-4 fw-bold text-dark mb-3">TIENDA ONLINE</h1>
            <p className="lead text-secondary mb-4">
              Descubre las últimas tendencias en streetwear y poleras exclusivas. Explora nuestro catálogo y encuentra las mejores ofertas con envíos a todo el país.
            </p>
            <Link to="/productos" className="btn btn-dark btn-lg px-4 py-3 rounded-3 fw-semibold shadow-sm">
              <i className="bi bi-bag-check me-2"></i> Ver productos
            </Link>
          </div>

          <div className="col-lg-6">
            <div id="heroCarousel" className="carousel slide shadow-sm rounded-4 overflow-hidden" data-bs-ride="carousel">
              
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>

              <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="3000">
                  <img src="img/catmeme.png" className="d-block w-100 object-fit-cover" style={{ height: '380px' }} alt="Producto destacado 1" />
                </div>
                <div className="carousel-item" data-bs-interval="3000">
                  <img src="img/vader.webp" className="d-block w-100 object-fit-cover" style={{ height: '380px' }} alt="Producto destacado 2" />
                </div>
                <div className="carousel-item" data-bs-interval="3000">
                  <img src="img/sixseven.webp" className="d-block w-100 object-fit-cover" style={{ height: '380px' }} alt="Producto destacado 3" />
                </div>
              </div>

              <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Anterior</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Siguiente</span>
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* Grid de Productos Dinámico */}
      <main className="container my-5">
        <h2 className="fw-bold mb-4">Catálogo Destacado</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {productos.map((producto) => (
            <div className="col" key={producto.codigo}>
              <div className="card h-100 border-0 shadow-sm rounded-4 p-3 d-flex flex-column">
                <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded-3 mb-3 object-fit-cover" style={{ height: '200px' }} />
                <h5 className="fw-bold text-dark">{producto.nombre}</h5>
                <p className="text-muted small mb-3">{producto.descripcion}</p>
                <div className="mt-auto">
                  <span className="fs-5 fw-bold text-primary d-block mb-2">${producto.precio.toLocaleString('es-CL')}</span>
                  <button 
                    className="btn btn-dark w-100 rounded-pill"
                    onClick={() => {
                      agregarAlCarritoGlobal(producto.id, 1);
                    }}
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 bg-light mt-5">
        <p className="text-muted mb-0">&copy; 2026 Nata's Drip</p>
      </footer>
    </>
  );
}

export default Inicio;