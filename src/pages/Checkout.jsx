import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {regionesComunas} from '../data/regiones';
import {obtenerSesion} from '../data/db';
import {detalleCarrito, calcularTotales, cuponGuardado, CUPON } from '../utils/cardLogic';
import {validarEnvio} from '../utils/validaciones';
import {verificarStock, crearOrdenPendiente, aprobarPago, rechazarPago} from '../utils/pagos';
import {formatoCLP, etiquetaPrecio} from '../utils/formato';

const DATOS_VACIOS = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  departamento: '',
  region: '',
  comuna: '',
  indicaciones: '',
};

//obtener datos de la sesion
function datosIniciales(){
  const s= obtenerSesion();
  if (!s) return DATOS_VACIOS;
  return {
    ...DATOS_VACIOS,
    nombre: s.nombre || '',
    apellidos: s.apellidos || '',
    correo: s.correo || '',
    calle: s.direccion || '',
    region: s.region || '',
    comuna: s.comuna || '',
  };
}

export default function Checkout() {
  const navigate = useNavigate();

  
  const [items] = useState(() => detalleCarrito());
  const [cuponAplicado] = useState(() => cuponGuardado());
  const [conSesion] = useState(() => obtenerSesion() !== null);

  const [datos, setDatos] = useState(datosIniciales);
  const [tocados, setTocados] = useState({});
  const [intento, setIntento] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [resultadoSimulado, setResultadoSimulado] = useState('aprobado');

  const errores = validarEnvio(datos);
  const totales = calcularTotales(items, cuponAplicado);
  const comunas = regionesComunas[datos.region] || [];

  const visible = (campo) => tocados[campo] || intento;
  const clase = (campo) => (visible(campo) ? (errores[campo] ? 'is-invalid' : 'is-valid') : '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => (name === 'region' ? { ...prev, region: value, comuna: '' } : { ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIntento(true);
    setErrorGeneral('');

    if (Object.values(errores).some(Boolean)) return;

    const problema = verificarStock(
      items.map((i) => ({ productoId: i.id, nombre: i.nombre, cantidad: i.cantidad }))
    );
    if (problema) {
      setErrorGeneral(problema);
      return;
    }

    const sesion = obtenerSesion();
    const orden = crearOrdenPendiente({
      cliente: {
        nombre: datos.nombre.trim(),
        apellidos: datos.apellidos.trim(),
        correo: datos.correo.trim(),
      },
      direccion: {
        calle: datos.calle.trim(),
        departamento: datos.departamento.trim(),
        region: datos.region,
        comuna: datos.comuna,
        indicaciones: datos.indicaciones.trim(),
      },
      items,
      totales,
      cuponAplicado,
      usuarioId: sesion?.id,
    });

    setProcesando(true);

    // Simula el tiempo que tarda la pasarela de pago
    setTimeout(() => {
      if (resultadoSimulado === 'aprobado') {
        const resultado = aprobarPago(orden.id);
        if (resultado.ok) {
          navigate(`/compra-exitosa?orden=${orden.id}`, { replace: true });
          return;
        }
      }
      rechazarPago(orden.id);
      navigate(`/compra-fallida?orden=${orden.id}`, { replace: true });
    }, 1500);
  };

  // Campos de texto reutilizables
  const campoTexto = (id, label, { tipo = 'text', opcional = false, placeholder = '' } = {}) => (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label} {opcional && <span className="text-muted fw-normal">(opcional)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={tipo}
        className={`form-control ${clase(id)}`}
        value={datos[id]}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <div className="invalid-feedback">{errores[id]}</div>
    </div>
  );

  if (items.length === 0) {
    return (
      <main className="container py-5 text-center">
        <div className="card border-0 shadow-sm rounded-4 p-5">
          <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
          <h4>No hay productos para pagar</h4>
          <p className="text-secondary">Agrega productos a tu carrito antes de continuar.</p>
          <div>
            <Link to="/productos" className="btn btn-primary rounded-pill">Ir a la tienda</Link>
          </div>
        </div>
      </main>
    );
  }
    return (
    <main className="container py-5">
      <h2 className="fw-bold mb-4">Finalizar compra</h2>

      <div className="row g-4">
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} noValidate className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold">Información del cliente</h5>
            {conSesion && (
              <p className="small text-muted">Completamos tus datos con la información de tu cuenta.</p>
            )}

            <div className="row">
              <div className="col-md-6">{campoTexto('nombre', 'Nombre')}</div>
              <div className="col-md-6">{campoTexto('apellidos', 'Apellidos')}</div>
            </div>
            {campoTexto('correo', 'Correo', { tipo: 'email', placeholder: 'tucorreo@gmail.com' })}

            <h5 className="fw-bold mt-3">Dirección de entrega</h5>
            <div className="row">
              <div className="col-md-8">{campoTexto('calle', 'Calle y número')}</div>
              <div className="col-md-4">{campoTexto('departamento', 'Departamento', { opcional: true, placeholder: 'Ej: 603' })}</div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="region" className="form-label fw-semibold">Región</label>
                <select
                  id="region"
                  name="region"
                  className={`form-select ${clase('region')}`}
                  value={datos.region}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">-- Selecciona la región --</option>
                  {Object.keys(regionesComunas).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errores.region}</div>
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="comuna" className="form-label fw-semibold">Comuna</label>
                <select
                  id="comuna"
                  name="comuna"
                  className={`form-select ${clase('comuna')}`}
                  value={datos.comuna}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={!datos.region}
                >
                  <option value="">-- Selecciona la comuna --</option>
                  {comunas.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="invalid-feedback">{errores.comuna}</div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="indicaciones" className="form-label fw-semibold">
                Indicaciones para la entrega <span className="text-muted fw-normal">(opcional)</span>
              </label>
              <textarea
                id="indicaciones"
                name="indicaciones"
                rows="3"
                className={`form-control ${clase('indicaciones')}`}
                placeholder="Ej: Entre calles, color del edificio, no tiene timbre."
                value={datos.indicaciones}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div className="invalid-feedback">{errores.indicaciones}</div>
            </div>

            
            <fieldset className="border rounded-3 p-3 mb-3 bg-light">
              <legend className="float-none w-auto px-2 fs-6 fw-semibold">Modo demostración</legend>
              <p className="small text-muted mb-2">
                No se procesa ningún pago real. Elige qué resultado quieres simular:
              </p>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="resultadoPago"
                  id="pagoAprobado"
                  checked={resultadoSimulado === 'aprobado'}
                  onChange={() => setResultadoSimulado('aprobado')}
                />
                <label className="form-check-label" htmlFor="pagoAprobado">Pago aprobado</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="resultadoPago"
                  id="pagoRechazado"
                  checked={resultadoSimulado === 'rechazado'}
                  onChange={() => setResultadoSimulado('rechazado')}
                />
                <label className="form-check-label" htmlFor="pagoRechazado">Pago rechazado</label>
              </div>
            </fieldset>

            {errorGeneral && <div className="alert alert-danger" role="alert">{errorGeneral}</div>}

            <button type="submit" className="btn btn-success btn-lg w-100" disabled={procesando}>
              {procesando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                  Procesando pago...
                </>
              ) : (
                `Pagar ahora ${formatoCLP(totales.total)}`
              )}
            </button>

            <Link to="/carrito" className={`btn btn-outline-secondary mt-2 ${procesando ? 'disabled' : ''}`}>
              Volver al carrito
            </Link>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Resumen de compra</h5>

            <ul className="list-unstyled mb-3">
              {items.map((i) => (
                <li key={i.id} className="d-flex justify-content-between small mb-2">
                  <span>{i.nombre} <span className="text-muted">x{i.cantidad}</span></span>
                  <span>{etiquetaPrecio(i.subtotal)}</span>
                </li>
              ))}
            </ul>

            <hr />
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <span>{formatoCLP(totales.subtotal)}</span>
            </div>
            {cuponAplicado && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Cupón {CUPON.codigo}</span>
                <span>-{formatoCLP(totales.descuento)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between fw-bold fs-4">
              <span>Total</span>
              <span className="text-primary">{formatoCLP(totales.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}