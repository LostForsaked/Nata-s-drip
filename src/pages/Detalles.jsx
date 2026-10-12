import React, { useState } from 'react';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { obtenerProductos } from '../utils/productos';
import { agregarAlCarritoGlobal } from '../utils/cardLogic';

function Detalles() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const [cantidad, setCantidad] = useState(1);

  // 1. Obtener ID limpiando valores undefined, null o vacíos
  const rawId = searchParams.get('id') || params.id;
  const idValido = (rawId && rawId !== 'undefined' && rawId !== 'null') ? rawId : null;
  
  // 2. Cargar productos disponibles
  const productos = obtenerProductos();

  // 3. Buscar el producto de forma segura (por id o código)
  const producto = idValido
    ? (productos.find(
        (p) => String(p.id) === String(idValido) || String(p.codigo) === String(idValido)
      ) || productos[0])
    : productos[0];

  const handleAgregar = () => {
    if (!producto) return;
    const qty = parseInt(cantidad, 10) || 1;
    agregarAlCarritoGlobal(producto.id, qty);
  };

  if (!producto) {
    return (
      <main className="container my-5 text-center">
        <div className="card border-0 shadow-sm p-5 rounded-4">
          <i className="bi bi-exclamation-circle fs-1 text-warning mb-3"></i>
          <h3 className="fw-bold">No hay productos disponibles</h3>
          <p className="text-muted">Revisa que el catálogo esté sembrado correctamente.</p>
          <div>
            <Link to="/productos" className="btn btn-primary rounded-pill px-4">
              Ir a Productos
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container my-5">
      {/* Navegación Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/" className="text-decoration-none">Inicio</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/productos" className="text-decoration-none">Productos</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {producto.nombre || producto.titulo}
          </li>
        </ol>
      </nav>

      <div className="row g-5 align-items-center">
        {/* Imagen del Producto */}
        <div className="col-lg-6 text-center">
          <div className="p-3 border rounded-4 bg-light shadow-sm">
            <img 
              src={producto.imagen || producto.img} 
              className="img-fluid rounded object-fit-contain" 
              style={{ maxHeight: '380px' }} 
              alt={producto.nombre || producto.titulo} 
            />
          </div>
        </div>

        {/* Detalles e Información de Compra */}
        <div className="col-lg-6 d-flex flex-column justify-content-center">
          <h2 className="fw-bold text-dark mb-2">
            {producto.nombre || producto.titulo}
          </h2>

          <div className="h3 fw-bold text-primary mb-3">
            ${producto.precio ? producto.precio.toLocaleString('es-CL') : '0'}
          </div>
          
          <p className="text-muted mb-4">
            {producto.descripcion || "Polera de alta calidad con estampado exclusivo. 100% algodón."}
          </p>

          <div className="mb-4">
            <label htmlFor="quantitySelect" className="form-label fw-semibold">Cantidad:</label>
            <input 
              type="number" 
              id="quantitySelect" 
              className="form-control text-center fw-bold" 
              value={cantidad}
              min="1"
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: '100px' }}
            />
          </div>

          <button 
            className="btn btn-primary btn-lg rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            onClick={handleAgregar}
          >
            <i className="bi bi-cart-plus fs-5"></i>
            Añadir al Carrito
          </button>
        </div>
      </div>
    </main>
  );
}

export default Detalles;