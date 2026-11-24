package cl.duoc.natasdrip.service;

import cl.duoc.natasdrip.dto.AuthResponse;
import cl.duoc.natasdrip.dto.LoginRequest;
import cl.duoc.natasdrip.dto.RegistroRequest;
import cl.duoc.natasdrip.dto.UsuarioResumen;
import cl.duoc.natasdrip.model.Usuario;
import cl.duoc.natasdrip.repository.UsuarioRepository;
import cl.duoc.natasdrip.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final UsuarioService usuarioService;

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest solicitud) {
        Usuario usuario = usuarioRepository.findByCorreoIgnoreCase(solicitud.correo().trim())
                .filter(u -> passwordEncoder.matches(solicitud.password(), u.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos"));
        return respuesta(usuario);
    }

    @Transactional
    public AuthResponse registrar(RegistroRequest solicitud) {
        return respuesta(usuarioService.registrar(solicitud));
    }

    private AuthResponse respuesta(Usuario usuario) {
        UsuarioResumen resumen = new UsuarioResumen(
                usuario.getId(), usuario.getNombre(), usuario.getApellidos(),
                usuario.getCorreo(), usuario.getRol().getNombre());
        return new AuthResponse(jwtService.generar(usuario), "Bearer",
                jwtService.getExpiracionMinutos(), resumen);
    }
}