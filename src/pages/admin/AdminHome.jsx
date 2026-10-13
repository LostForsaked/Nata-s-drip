import { obtenerSesion } from '../../data/db';

export default function AdminHome() {
  const sesion = obtenerSesion();

  return (
    <>
      <header className="mb-4">
        <h1 className="fw-bold text-dark">¡Hola, {sesion?.nombre}!</h1>
      </header>

      <section className="card border-0 shadow-sm p-4 rounded-4">
        <p className="lead mb-0 text-secondary">
          Bienvenido al panel de administración de <strong>Nata's Drip</strong>.
          Desde el menú lateral puedes gestionar los productos, órdenes y usuarios de la tienda.
        </p>
      </section>
    </>
  );
}