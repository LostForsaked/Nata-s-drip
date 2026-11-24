package cl.duoc.natasdrip.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

public final class UsuarioActual {

    private UsuarioActual() {
    }

    public static Integer id(Jwt jwt) {
        Number uid = jwt.getClaim("uid");
        return uid.intValue();
    }

    public static boolean esPersonal(Authentication autenticacion) {
        return autenticacion.getAuthorities().stream().anyMatch(a ->
                a.getAuthority().equals("ROLE_ADMINISTRADOR") || a.getAuthority().equals("ROLE_VENDEDOR"));
    }
}