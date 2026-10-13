import { Navigate, Outlet } from 'react-router-dom';
import { obtenerSesion } from '../data/db';


export default function RutaProtegida({ roles }) {
  const sesion = obtenerSesion();

  if (!sesion) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(sesion.rol)) return <Navigate to="/" replace />;

  return <Outlet />;
}