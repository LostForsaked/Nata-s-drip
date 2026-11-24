package cl.duoc.natasdrip.util;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PreciosTest {

    @Test
    void elDescuentoSeRedondeaAlPesoMasCercano() {
        // 15 % de 9.990 = 1.498,5 -> 1.499
        assertEquals(1499, Precios.descuentoDe(9990, 15));
    }

    @Test
    void elPrecioFinalRestaElDescuento() {
        assertEquals(11691, Precios.precioFinal(12990, 10));
    }

    @Test
    void sinDescuentoElPrecioNoCambia() {
        assertEquals(5000, Precios.precioFinal(5000, 0));
    }

    @Test
    void conDescuentoTotalElPrecioQuedaEnCero() {
        assertEquals(0, Precios.precioFinal(5000, 100));
    }
}