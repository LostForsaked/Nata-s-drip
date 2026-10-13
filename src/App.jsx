import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import RutaProtegida from "./components/RutaProtegida";

import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Ofertas from "./pages/Ofertas";
import Detalles from "./pages/Detalles";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import CompraExitosa from "./pages/CompraExitosa";
import CompraFallida from "./pages/CompraFallida";
import Blogs from "./pages/Blogs";
import DetalleBlog from "./pages/DetalleBlog";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Nosotros from "./pages/Nosotros";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminUsuariosNuevo from "./pages/admin/AdminUsuariosNuevo";
import AdminProductosCriticos from "./pages/admin/AdminProductosCriticos";
import AdminProductoDetalle from "./pages/admin/AdminProductoDetalle";
import AdminProductoForm from "./pages/admin/AdminProductoForm";

import AdminOrdenes from "./pages/admin/AdminOrdenes";
import AdminBoleta from "./pages/admin/AdminBoleta";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminReportes from "./pages/admin/AdminReportes";
import AdminPerfil from "./pages/admin/AdminPerfil";

// Layout de la tienda pública: Navbar + contenido de la ruta + Footer
function LayoutTienda() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

function NoEncontrado() {
  return (
    <main className="container my-5 text-center">
      <h1 className="display-4 fw-bold">404</h1>
      <p className="lead">La página que buscas no existe.</p>
      <Link to="/" className="btn btn-dark">Volver al inicio</Link>
    </main>
  );
}

export default function App() {
  return (
    <>
      <style>{`
        :root {
          --hot-bg-1: #150a0c;
          --hot-bg-2: #2a0f12;
          --hot-surface: rgba(34, 17, 17, 0.82);
          --hot-card: rgba(48, 18, 16, 0.8);
          --hot-orange: #ff8a3d;
          --hot-red: #ff4d4d;
          --hot-gold: #ffd166;
          --hot-cream: #fff5ee;
          --hot-border: rgba(255, 168, 97, 0.35);
        }

        body {
          background:
            radial-gradient(circle at top, rgba(255, 138, 61, 0.22), transparent 30%),
            radial-gradient(circle at bottom right, rgba(255, 77, 77, 0.15), transparent 30%),
            linear-gradient(135deg, var(--hot-bg-1) 0%, var(--hot-bg-2) 45%, #0d0b0e 100%);
          color: var(--hot-cream);
        }

        .navbar,
        footer,
        .admin-sidebar,
        .card,
        .list-group-item,
        .table,
        .modal-content,
        .dropdown-menu,
        .form-control,
        .form-select,
        .input-group-text,
        .accordion-item,
        .accordion-button {
          background: var(--hot-surface) !important;
          border-color: var(--hot-border) !important;
          color: var(--hot-cream) !important;
          box-shadow: 0 12px 30px rgba(255, 109, 45, 0.08);
        }

        .card,
        .list-group-item,
        .table,
        .modal-content,
        .dropdown-menu,
        .accordion-item {
          border-radius: 18px;
        }

        .btn,
        .btn-primary,
        .btn-dark,
        .btn-outline-dark,
        .btn-outline-light {
          background: linear-gradient(135deg, var(--hot-orange), var(--hot-red));
          border: none;
          color: white !important;
          box-shadow: 0 12px 24px rgba(255, 90, 45, 0.28);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn:hover,
        .btn-primary:hover,
        .btn-dark:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 28px rgba(255, 90, 45, 0.35);
        }

        .btn-outline-light,
        .btn-outline-dark {
          background: transparent;
          border: 1px solid rgba(255, 189, 116, 0.4);
          color: var(--hot-cream) !important;
        }

        .nav-link,
        .navbar-brand,
        a {
          color: #ffe7d2 !important;
          transition: color 0.2s ease, opacity 0.2s ease;
        }

        .nav-link:hover,
        .navbar-brand:hover,
        a:hover {
          color: var(--hot-gold) !important;
          text-decoration: none;
        }

        .form-control,
        .form-select,
        textarea {
          background: rgba(255, 255, 255, 0.03) !important;
          color: var(--hot-cream) !important;
          border: 1px solid rgba(255, 177, 116, 0.28);
        }

        .form-control::placeholder,
        textarea::placeholder {
          color: rgba(255, 245, 238, 0.56);
        }

        h1, h2, h3, h4, h5, h6,
        .display-1,
        .display-2,
        .display-3,
        .display-4,
        .display-5,
        .display-6 {
          color: #fffaf6 !important;
          text-shadow: 0 0 18px rgba(255, 130, 60, 0.18);
        }

        .card h6,
        .card .fw-semibold,
        .card .text-primary,
        .card .text-danger,
        .card .text-warning,
        .card .text-muted,
        .card p,
        .card small,
        .card span,
        .card .price,
        .card .badge {
          color: #fffaf5 !important;
        }

        .card .text-secondary,
        .card .text-muted {
          color: #ffd7a8 !important;
        }

        .card .text-primary {
          color: #ffd076 !important;
        }

        .card .text-danger {
          color: #ff9d7a !important;
        }

        .card .text-warning {
          color: #ffcf5a !important;
        }

        .table,
        .table th,
        .table td,
        .table thead th,
        .table tbody td,
        .table tfoot td,
        .table-responsive,
        .table-responsive th,
        .table-responsive td {
          color: #fffaf5 !important;
          background-color: rgba(21, 10, 12, 0.88) !important;
        }

        .table thead th,
        .table thead td,
        thead.table-light th,
        thead.table-light td {
          background: rgba(255, 143, 84, 0.18) !important;
          color: #fffaf5 !important;
        }

        .table tbody tr:hover td,
        .table tbody tr:hover th,
        .table-hover tbody tr:hover > * {
          background: rgba(255, 164, 96, 0.08) !important;
          color: #fffaf5 !important;
        }

        .table .text-muted,
        .table .text-secondary,
        .card .text-muted,
        .card .text-secondary {
          color: #ffd7a8 !important;
        }

        .btn-outline-primary {
          color: #fff4e8 !important;
          border-color: rgba(255, 176, 104, 0.7) !important;
          background: rgba(255, 136, 77, 0.12) !important;
        }

        .btn-outline-primary:hover {
          background: linear-gradient(135deg, var(--hot-orange), var(--hot-red)) !important;
          color: #fff !important;
          border-color: transparent !important;
        }

        p,
        li,
        .text-muted,
        small {
          color: rgba(255, 243, 232, 0.82) !important;
        }

        .badge,
        .bg-light,
        .bg-secondary {
          background: linear-gradient(135deg, rgba(255, 138, 61, 0.18), rgba(255, 77, 77, 0.2)) !important;
          color: #ffd8b5 !important;
          border: 1px solid rgba(255, 180, 96, 0.28);
        }

        .table > :not(caption) > * > * {
          border-bottom-color: rgba(255, 170, 100, 0.18);
        }

        .container,
        .container-fluid {
          position: relative;
        }
      `}</style>

      <BrowserRouter>
        <Routes>
          {/* ---------- Tienda (pública) ---------- */}
          <Route element={<LayoutTienda />}>
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/detalles" element={<Detalles />} />

            <Route path="/carrito" element={<Carrito />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/compra-exitosa" element={<CompraExitosa />} />
            <Route path="/compra-fallida" element={<CompraFallida />} />

            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<DetalleBlog />} />

            <Route path="/contacto" element={<Contacto />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route element={<RutaProtegida roles={["Cliente"]} />}>
              <Route path="/perfil" element={<AdminPerfil />} />
            </Route>
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />

            {/* Administrador y Vendedor: solo lectura */}
            <Route path="productos" element={<AdminProductos />} />
            <Route path="productos/criticos" element={<AdminProductosCriticos />} />
            <Route path="productos/:id" element={<AdminProductoDetalle />} />
            <Route path="ordenes" element={<AdminOrdenes />} />
            <Route path="ordenes/:id" element={<AdminBoleta />} />
            <Route path="perfil" element={<AdminPerfil />} />

            {/* Solo Administrador */}
            <Route element={<RutaProtegida roles={["Administrador"]} />}>
              <Route path="productos/nuevo" element={<AdminProductoForm />} />
              <Route path="productos/:id/editar" element={<AdminProductoForm />} />
              <Route path="categorias" element={<AdminCategorias />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuarios/nuevo" element={<AdminUsuariosNuevo />} />
              <Route path="reportes" element={<AdminReportes />} />
            </Route>
          </Route>

          <Route path="*" element={<NoEncontrado />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}