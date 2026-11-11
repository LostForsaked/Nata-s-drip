import { Navigate, Outlet } from 'react-router-dom';
import { useSesion } from '../context/SesionContext';
import Cargando from './Cargando';

export default function RutaProtegida({ roles }) {
  const { sesion, cargando } = useSesion();

  if (cargando) return <Cargando />;
  if (!sesion) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(sesion.rol)) return <Navigate to="/" replace />;

  return <Outlet />;
}
