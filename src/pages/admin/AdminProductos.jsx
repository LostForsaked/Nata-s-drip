import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 1. IMPORTAS las funciones desde la carpeta utils
import { validarRequerido, validarPrecio, validarStock } from "../../utils/validaciones";
import { guardarProducto } from "../../utils/productos";

export default function AdminProductosNuevo() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 2. APLICAS las validaciones antes de guardar
    if (!validarRequerido(nombre)) {
      alert("El nombre del producto no puede estar vacío.");
      return;
    }

    if (!validarPrecio(precio)) {
      alert("El precio debe ser un número mayor a 0.");
      return;
    }

    if (!validarStock(stock)) {
      alert("El stock debe ser un número válido (0 o mayor).");
      return;
    }

    // Si todo pasa las validaciones, guardamos el producto
    const nuevoProducto = {
      codigo: "P013",
      nombre: nombre,
      precio: parseFloat(precio),
      stock: parseInt(stock, 10),
      categoria: "Poleras",
      imagen: "/img/poleraLobo.avif"
    };

    guardarProducto(nuevoProducto);
    alert("¡Producto guardado con éxito!");
    navigate('/admin/productos');
  };

  return (
    <div className="container my-5">
      <h2>Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input 
            type="text" 
            className="form-control" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input 
            type="number" 
            className="form-control" 
            value={precio} 
            onChange={(e) => setPrecio(e.target.value)} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input 
            type="number" 
            className="form-control" 
            value={stock} 
            onChange={(e) => setStock(e.target.value)} 
          />
        </div>

        <button type="submit" className="btn btn-success">Guardar Producto</button>
      </form>
    </div>
  );
}