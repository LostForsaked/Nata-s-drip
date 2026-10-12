
import { Link } from 'react-router-dom';
import { productosCatalogo } from '../utils/productos';
import { agregarAlCarritoGlobal } from '../utils/cardLogic';


function Productos() {
  const handleAgregar = (id, e) => {
    e.preventDefault();
    agregarAlCarritoGlobal(id, 1);
  };

  return (
    <main className="container my-5">
      <h2 className="text-center fw-bold mb-4 text-uppercase tracking-wide">
        PRODUCTOS
      </h2>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4" id="gridProductos">
        {productosCatalogo.map((prod) => (
          <div className="col" key={prod.id}>
            <div className="card h-100 border-0 shadow-sm text-center p-3 rounded-4">
              <Link to={`/detalles?id=${prod.id}`} className="text-decoration-none">
                <img 
                  src={prod.imagen} 
                  className="card-img-top rounded-3 mb-3 object-fit-cover" 
                  style={{ height: '180px' }} 
                  alt={prod.nombre} 
                />
                <h6 className="card-title fw-semibold text-dark mb-1">{prod.nombre}</h6>
              </Link>

              <p className="card-text fw-bold text-primary mb-3">
                ${prod.precio.toLocaleString('es-CL')}
              </p>

              <button 
                className="btn btn-outline-primary rounded-3 w-100 py-2 fw-semibold mt-auto"
                onClick={(e) => handleAgregar(prod.id, e)}
              >
                <i className="bi bi-cart-plus me-1"></i> Añadir
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Productos;