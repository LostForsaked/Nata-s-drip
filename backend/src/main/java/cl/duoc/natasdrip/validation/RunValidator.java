package cl.duoc.natasdrip.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.Locale;
import java.util.regex.Pattern;

public class RunValidator implements ConstraintValidator<RunValido, String> {


    private static final Pattern FORMATO = Pattern.compile("^[0-9]{6,8}[0-9K]$");

    @Override
    public boolean isValid(String run, ConstraintValidatorContext contexto) {
        if (run == null || run.isBlank()) {
            return true;
        }
        String limpio = run.trim().toUpperCase(Locale.ROOT);
        if (!FORMATO.matcher(limpio).matches()) {
            return false;
        }
        String cuerpo = limpio.substring(0, limpio.length() - 1);
        char dv = limpio.charAt(limpio.length() - 1);

        int suma = 0;
        int multiplo = 2;
        for (int i = cuerpo.length() - 1; i >= 0; i--) {
            suma += (cuerpo.charAt(i) - '0') * multiplo;
            multiplo = multiplo == 7 ? 2 : multiplo + 1;
        }
        int resto = 11 - (suma % 11);
        char esperado = resto == 11 ? '0' : resto == 10 ? 'K' : (char) ('0' + resto);
        return dv == esperado;
    }
}