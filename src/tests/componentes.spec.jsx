
/** @vitest-environment jsdom */

import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Componente de lista de productos
function ListaProductos({ productos }) {
  if (productos.length === 0) {
    return <p>No hay productos disponibles</p>;
  }

  return (
    <ul>
      {productos.map((producto) => (
        <li key={producto.id}>{producto.nombre}</li>
      ))}
    </ul>
  );
}

// Componente botón que recibe props
function Boton({ texto, onClick }) {
  return <button onClick={onClick}>{texto}</button>;
}

// Componente formulario que maneja estado
function Formulario() {
  const [nombre, setNombre] = useState('');

  return (
    <form>
      <label htmlFor="nombre">Nombre</label>
      <input
        id="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <p>Nombre ingresado: {nombre || 'Ninguno'}</p>
    </form>
  );
}

// Componente con mensaje de error condicional
function MensajeError({ error }) {
  if (!error) return null;

  return <p role="alert">{error}</p>;
}

describe('Pruebas de componentes React', () => {
  it('renderiza todos los productos recibidos', () => {
    render(
      <ListaProductos
        productos={[
          { id: 1, nombre: 'Polera urbana' },
          { id: 2, nombre: 'Jeans negros' },
          { id: 3, nombre: 'Zapatillas' },
        ]}
      />
    );

    expect(screen.getByText('Polera urbana')).toBeTruthy();
    expect(screen.getByText('Jeans negros')).toBeTruthy();
    expect(screen.getByText('Zapatillas')).toBeTruthy();
  });

  it('muestra un mensaje cuando la lista está vacía', () => {
    render(<ListaProductos productos={[]} />);

    expect(
      screen.getByText('No hay productos disponibles')
    ).toBeTruthy();
  });

  it('recibe props y ejecuta el evento del botón', () => {
    const accion = vi.fn();

    render(<Boton texto="Agregar al carrito" onClick={accion} />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Agregar al carrito' })
    );

    expect(accion).toHaveBeenCalledTimes(1);
  });

  it('actualiza el estado cuando se escribe en el formulario', () => {
    render(<Formulario />);

    const campo = screen.getByLabelText('Nombre');

    fireEvent.change(campo, {
      target: { value: 'Natanael' },
    });

    expect(campo.value).toBe('Natanael');
    expect(
      screen.getByText('Nombre ingresado: Natanael')
    ).toBeTruthy();
  });

  it('muestra un error solamente cuando existe', () => {
    const { rerender } = render(<MensajeError error="" />);

    expect(screen.queryByRole('alert')).toBeNull();

    rerender(<MensajeError error="Debes completar el formulario" />);

    expect(
      screen.getByRole('alert').textContent
    ).toBe('Debes completar el formulario');
  });

  it('ejecuta el evento de cancelar', () => {
    const cancelar = vi.fn();

    render(<Boton texto="Cancelar" onClick={cancelar} />);

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(cancelar).toHaveBeenCalledTimes(1);
  });
});
