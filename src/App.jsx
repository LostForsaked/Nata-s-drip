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
import Pendiente from "./pages/admin/Pendiente";

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
        </Route>

        {/* ---------- Administración (Administrador y Vendedor) ---------- */}
        <Route element={<RutaProtegida roles={["Administrador", "Vendedor"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="ordenes" element={<Pendiente titulo="Órdenes y boletas" />} />
            <Route path="perfil" element={<Pendiente titulo="Mi perfil" />} />

            {/* Solo Administrador */}
            <Route element={<RutaProtegida roles={["Administrador"]} />}>
              <Route path="categorias" element={<Pendiente titulo="Categorías" />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuarios/nuevo" element={<AdminUsuariosNuevo />} />
              <Route path="reportes" element={<Pendiente titulo="Reportes" />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </BrowserRouter>
  );
}