import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { detalleCarrito } from '../utils/cardLogic';
import { obtenerSesion, cerrarSesion } from '../data/db';

function Navbar() {
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(0);
  const [total, setTotal] = useState(0);
  const [sesion, setSesion] = useState(() => obtenerSesion());
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const actualizar = () => {
      const items = detalleCarrito();
      setCantidad(items.reduce((acc, i) => acc + i.cantidad, 0));
      setTotal(items.reduce((acc, i) => acc + i.subtotal, 0));
      setSesion(obtenerSesion());
    };

    actualizar();
    window.addEventListener('carritoActualizado', actualizar);
    window.addEventListener('sesionActualizada', actualizar);
    window.addEventListener('dbActualizada', actualizar);
    window.addEventListener('storage', actualizar);

    return () => {
      window.removeEventListener('carritoActualizado', actualizar);
      window.removeEventListener('sesionActualizada', actualizar);
      window.removeEventListener('dbActualizada', actualizar);
      window.removeEventListener('storage', actualizar);
    };
  }, []);

  const cerrarMenu = () => {
    document.getElementById('navbarSupportedContent')?.classList.remove('show');
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    const texto = busqueda.trim();
    navigate(texto ? `/productos?q=${encodeURIComponent(texto)}` : '/productos');
    cerrarMenu();
  };

  const handleLogout = () => {
    cerrarSesion();
    cerrarMenu();
    navigate('/');
  };

  const claseLink = ({ isActive }) => 'nav-link' + (isActive ? ' active fw-semibold' : '');
  const esStaff = sesion && (sesion.rol === 'Administrador' || sesion.rol === 'Vendedor');
    return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary sticky-top shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src="/img/Logo.jpg" alt="Logo Nata's Drip" width="50" className="rounded" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink end className={claseLink} to="/" onClick={cerrarMenu}>Inicio</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/productos" onClick={cerrarMenu}>Productos</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/categorias" onClick={cerrarMenu}>Categorías</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/ofertas" onClick={cerrarMenu}>Ofertas</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/nosotros" onClick={cerrarMenu}>Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/blogs" onClick={cerrarMenu}>Blogs</NavLink></li>
            <li className="nav-item"><NavLink className={claseLink} to="/contacto" onClick={cerrarMenu}>Contacto</NavLink></li>
          </ul>

          {/* Buscador */}
          <form className="d-flex me-lg-3 mb-2 mb-lg-0" role="search" onSubmit={handleBuscar}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Buscar polera..."
              aria-label="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <button className="btn btn-outline-success" type="submit">Buscar</button>
          </form>

          {/* Menú de usuario  */}
          <ul className="navbar-nav me-lg-3 mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
              >
                <i className="bi bi-person-circle fs-4"></i>
                {sesion && <span className="small">{sesion.nombre}</span>}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                {!sesion && (
                  <>
                    <li><Link className="dropdown-item" to="/login" onClick={cerrarMenu}>Iniciar sesión</Link></li>
                    <li><Link className="dropdown-item" to="/registro" onClick={cerrarMenu}>Crear cuenta</Link></li>
                  </>
                )}
                {sesion && (
                  <>
                    <li><span className="dropdown-item-text text-muted small">{sesion.rol}</span></li>
                    {esStaff && (
                      <li><Link className="dropdown-item" to="/admin" onClick={cerrarMenu}>Panel de administración</Link></li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" type="button" onClick={handleLogout}>Cerrar sesión</button></li>
                  </>
                )}
              </ul>
            </li>
          </ul>

          {/* Carrito */}
          <Link
            to="/carrito"
            onClick={cerrarMenu}
            className="btn btn-success rounded-pill px-3 py-1 d-flex align-items-center gap-2 text-decoration-none"
          >
            <i className="bi bi-cart3 fs-5"></i>
            <span className="fw-medium">Carrito ${total.toLocaleString('es-CL')}</span>
            <span className="badge bg-light text-dark rounded-pill">{cantidad}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;