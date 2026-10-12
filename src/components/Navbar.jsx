import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerCarrito } from '../utils/cardLogic';

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Función para calcular la cantidad total de productos en el carrito
  const actualizarContador = () => {
    const carrito = obtenerCarrito();
    const total = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    setTotalItems(total);
  };

  useEffect(() => {
    // Cargar al iniciar
    actualizarContador();

    // Escuchar eventos de actualización local y del navegador
    window.addEventListener("carritoActualizado", actualizarContador);
    window.addEventListener("storage", actualizarContador);
    
    return () => {
      window.removeEventListener("carritoActualizado", actualizarContador);
      window.removeEventListener("storage", actualizarContador);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        
        <Link className="navbar-brand" to="/">
          <img src="img/Logo.jpg" alt="Logo" width="50" className="rounded" />
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blogs">Blogs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contacto">Contacto</Link>
            </li>
          </ul>

          {/* Menú de usuario desplegable */}
          <ul className="navbar-nav me-3 mb-2 mb-lg-0">
            <li className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}>
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(!dropdownOpen);
                }}
                aria-expanded={dropdownOpen}
              >
                <i className="bi bi-person-circle fs-4"></i>
              </a>
              <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}>
                <li>
                  <Link className="dropdown-item" to="/login" onClick={() => setDropdownOpen(false)}>
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/registro" onClick={() => setDropdownOpen(false)}>
                    Registrarse
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Botón Carrito dinámico */}
          <Link to="/carrito" className="btn btn-outline-dark rounded-pill px-3 py-1 position-relative d-flex align-items-center gap-2 text-decoration-none">
            <i className="bi bi-cart3 fs-5"></i>
            <span className="fw-medium">Cart</span>
            <span className="badge bg-primary rounded-circle">{totalItems}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;