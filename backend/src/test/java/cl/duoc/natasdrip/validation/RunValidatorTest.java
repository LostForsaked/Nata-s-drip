package cl.duoc.natasdrip.validation;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RunValidatorTest {

    private final RunValidator validador = new RunValidator();

    @Test
    void aceptaRunsConDigitoVerificadorCorrecto() {
        assertTrue(validador.isValid("123456785", null));
        assertTrue(validador.isValid("187654327", null));
        assertTrue(validador.isValid("111111111", null));
    }

    @Test
    void aceptaDigitoVerificadorKYCeroEnCualquierCaja() {
        assertTrue(validador.isValid("10000013K", null));
        assertTrue(validador.isValid("10000013k", null));
        assertTrue(validador.isValid("100000040", null));
    }

    @Test
    void rechazaUnDigitoVerificadorIncorrecto() {
        assertFalse(validador.isValid("123456786", null));
    }

    @Test
    void rechazaPuntosYGuion() {
        assertFalse(validador.isValid("12.345.678-5", null));
    }

    @Test
    void rechazaLargosYCaracteresInvalidos() {
        assertFalse(validador.isValid("12345", null));
        assertFalse(validador.isValid("1234567890", null));
        assertFalse(validador.isValid("abcdefghi", null));
    }

    @Test
    void losValoresVaciosLosExigeNotBlank() {
        assertTrue(validador.isValid(null, null));
        assertTrue(validador.isValid("  ", null));
    }
}