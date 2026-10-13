

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, it, expect, afterEach } from 'vitest';

describe('Pruebas React con Vitest', () => {
  let container = null;
  let root = null;

  afterEach(() => {
    if (root) {
      act(() => root.unmount());
      root = null;
    }

    if (container) {
      container.remove();
      container = null;
    }
  });

  it('renderiza correctamente un botón', () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    root = createRoot(container);
    act(() => root.render(<button>Agregar al carrito</button>));

    expect(container.textContent).toContain('Agregar al carrito');
  });
});
