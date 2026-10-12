
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/Navbar";

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

import AdminHome from "./pages/admin/AdminHome";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import AdminUsuariosNuevo from "./pages/admin/AdminUsuariosNuevo";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/detalles" element={<Detalles />} />

        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route
          path="/compra-exitosa"
          element={<CompraExitosa />}
        />
        <Route
          path="/compra-fallida"
          element={<CompraFallida />}
        />

        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<DetalleBlog />} />

        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nosotros" element={<Nosotros />} />

        <Route path="/admin" element={<AdminHome />} />
        <Route
          path="/admin/productos"
          element={<AdminProductos />}
        />
        <Route
          path="/admin/usuarios"
          element={<AdminUsuarios />}
        />
        <Route
          path="/admin/usuarios/nuevo"
          element={<AdminUsuariosNuevo />}
        />
      </Routes>
    </BrowserRouter>
  );
}
