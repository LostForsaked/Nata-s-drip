import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  buscarProductoPorId,
  obtenerCategorias,
  crearProducto,
  actualizarProducto,
} from '../../data/db';
import { validarProducto } from '../../utils/validaciones';

const IMAGEN_POR_DEFECTO = '/img/Logo.jpg';
const MAX_IMAGEN_KB = 300;

function datosIniciales(producto) {
  if (!producto) {
    return { codigo: '', nombre: '', descripcion: '', precio: '', stock: '', stockCritico: '', descuento: '', categoriaId: '', imagen: '' };
  }
  return {
    codigo: producto.codigo ?? '',
    nombre: producto.nombre ?? '',
    descripcion: producto.descripcion ?? '',
    precio: String(producto.precio ?? ''),
    stock: String(producto.stock ?? ''),
    stockCritico: producto.stockCritico === '' || producto.stockCritico == null ? '' : String(producto.stockCritico),
    descuento: Number(producto.descuento) > 0 ? String(producto.descuento) : '',
    categoriaId: String(producto.categoriaId ?? ''),
    imagen: producto.imagen ?? '',
  };
}

// El mismo formulario sirve para crear y para editar
function FormularioProducto({ producto }) {
  const navigate = useNavigate();
  const editando = producto !== null;

  const [datos, setDatos] = useState(() => datosIniciales(producto));
  const [tocados, setTocados] = useState({});
  const [intento, setIntento] = useState(false);
  const [errorImagen, setErrorImagen] = useState('');

  const errores = validarProducto(datos, producto?.id ?? null);
  const visible = (campo) => tocados[campo] || intento;
  const clase = (campo) => (visible(campo) ? (errores[campo] ? 'is-invalid' : 'is-valid') : '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTocados((prev) => ({ ...prev, [name]: true }));
  };

  const handleImagen = (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    if (!archivo.type.startsWith('image/')) {
      setErrorImagen('El archivo debe ser una imagen.');
      return;
    }
    if (archivo.size > MAX_IMAGEN_KB * 1024) {
      setErrorImagen(`La imagen debe pesar menos de ${MAX_IMAGEN_KB} KB.`);
      return;
    }
    const lector = new FileReader();
    lector.onload = () => {
      setErrorImagen('');
      setDatos((prev) => ({ ...prev, imagen: lector.result }));
    };
    lector.readAsDataURL(archivo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIntento(true);
    if (Object.keys(errores).length > 0) return;

    const payload = {
      codigo: datos.codigo.trim(),
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      stockCritico: datos.stockCritico.trim() === '' ? '' : Number(datos.stockCritico),
      descuento: datos.descuento.trim() === '' ? 0 : Number(datos.descuento),
      categoriaId: Number(datos.categoriaId),
      imagen: datos.imagen || IMAGEN_POR_DEFECTO,
    };

    if (editando) actualizarProducto(producto.id, payload);
    else crearProducto(payload);

    navigate('/admin/productos', {
      state: { mensaje: editando ? `Producto "${payload.nombre}" actualizado.` : `Producto "${payload.nombre}" creado.` },
    });
  };

  // Aviso en vivo cuando el stock ya está en nivel crítico
  const stockNum = Number(datos.stock);
  const criticoNum = Number(datos.stockCritico);
  const enNivelCritico =
    datos.stock.trim() !== '' && datos.stockCritico.trim() !== '' && !isNaN(stockNum) && !isNaN(criticoNum) && stockNum <= criticoNum;

  const campo = (id, label, { tipo = 'text', opcional = false, placeholder = '', ayuda = '', step } = {}) => (
    <div className="mb-3">
      <label htmlFor={id} className="form-label fw-semibold">
        {label} {opcional && <span className="text-muted fw-normal">(opcional)</span>}
      </label>
      <input
        id={id}
        name={id}
        type={tipo}
        step={step}
        className={`form-control ${clase(id)}`}
        value={datos[id]}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {ayuda && <div className="form-text">{ayuda}</div>}
      <div className="invalid-feedback">{errores[id]}</div>
    </div>
  );
    return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="fw-bold m-0">{editando ? 'Editar producto' : 'Nuevo producto'}</h1>
        <Link to="/admin/productos" className="btn btn-outline-secondary">
          <i className="bi bi-arrow-left me-1"></i> Volver
        </Link>
      </div>

      <form onSubmit={handleSubmit} noValidate className="card border-0 shadow-sm rounded-4 p-4" style={{ maxWidth: '850px' }}>
        <div className="row">
          <div className="col-md-4">{campo('codigo', 'Código', { placeholder: 'Ej: P013', ayuda: 'Mínimo 3 caracteres. Debe ser único.' })}</div>
          <div className="col-md-8">{campo('nombre', 'Nombre', { placeholder: 'Nombre del producto' })}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label fw-semibold">
            Descripción <span className="text-muted fw-normal">(opcional)</span>
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            className={`form-control ${clase('descripcion')}`}
            value={datos.descripcion}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <div className="form-text">{datos.descripcion.length}/500 caracteres</div>
          <div className="invalid-feedback">{errores.descripcion}</div>
        </div>

        <div className="row">
          <div className="col-md-4">{campo('precio', 'Precio', { tipo: 'number', step: 'any', placeholder: '0', ayuda: '0 = producto gratuito. Admite decimales.' })}</div>
          <div className="col-md-4">{campo('stock', 'Stock', { tipo: 'number', placeholder: '0', ayuda: 'Solo números enteros.' })}</div>
          <div className="col-md-4">{campo('stockCritico', 'Stock crítico', { tipo: 'number', opcional: true, placeholder: '5', ayuda: 'Alerta cuando el stock sea igual o menor.' })}</div>
        </div>

        {enNivelCritico && (
          <div className="alert alert-warning py-2">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Con este stock el producto quedará en <strong>nivel crítico</strong>.
          </div>
        )}

        <div className="row">
          <div className="col-md-8 mb-3">
            <label htmlFor="categoriaId" className="form-label fw-semibold">Categoría</label>
            <select
              id="categoriaId"
              name="categoriaId"
              className={`form-select ${clase('categoriaId')}`}
              value={datos.categoriaId}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">-- Selecciona la categoría --</option>
              {obtenerCategorias().map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <div className="invalid-feedback">{errores.categoriaId}</div>
          </div>
          <div className="col-md-4">{campo('descuento', 'Oferta (% dcto.)', { tipo: 'number', opcional: true, placeholder: '0', ayuda: '0 a 100. Si es mayor que 0, aparece en Ofertas.' })}</div>
        </div>

        <div className="mb-4">
          <label htmlFor="imagen" className="form-label fw-semibold">
            Imagen <span className="text-muted fw-normal">(opcional)</span>
          </label>
          <input id="imagen" type="file" accept="image/*" className={`form-control ${errorImagen ? 'is-invalid' : ''}`} onChange={handleImagen} />
          <div className="invalid-feedback">{errorImagen}</div>
          <div className="form-text">Máximo {MAX_IMAGEN_KB} KB. Si no subes una, se usa el logo de la tienda.</div>

          {datos.imagen && (
            <div className="mt-3 d-flex align-items-center gap-3">
              <img src={datos.imagen} alt="Vista previa" width="90" height="90" className="rounded border object-fit-cover" />
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setDatos((prev) => ({ ...prev, imagen: '' }))}>
                Quitar imagen
              </button>
            </div>
          )}
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success px-4">
            {editando ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
        </div>
      </form>
    </>
  );
}

export default function AdminProductoForm() {
  const { id } = useParams();
  const producto = id ? buscarProductoPorId(id) : null;

  if (id && !producto) {
    return (
      <>
        <h1 className="fw-bold mb-3">Producto no encontrado</h1>
        <Link to="/admin/productos" className="btn btn-outline-secondary">Volver a productos</Link>
      </>
    );
  }


  return <FormularioProducto key={producto?.id ?? 'nuevo'} producto={producto ?? null} />;
}