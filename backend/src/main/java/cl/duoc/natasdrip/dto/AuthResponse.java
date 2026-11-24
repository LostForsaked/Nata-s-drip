package cl.duoc.natasdrip.dto;

import cl.duoc.natasdrip.model.Usuario;

public record AuthResponse(String token, String tipo, long expiraEnMinutos, UsuarioResumen usuario) {
}
