
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Pruebas React con Vitest', () => {
  it('renderiza correctamente un botón', () => {
    render(<button>Agregar al carrito</button>);
    expect(screen.getByRole('button', { name: 'Agregar al carrito' })).toBeTruthy();
  });
});
