package cl.duoc.natasdrip.controller;

import cl.duoc.natasdrip.dto.OrdenDto;
import cl.duoc.natasdrip.dto.PerfilRequest;
import cl.duoc.natasdrip.dto.UsuarioDto;
import cl.duoc.natasdrip.security.UsuarioActual;
import cl.duoc.natasdrip.service.OrdenService;
import cl.duoc.natasdrip.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/perfil")
@RequiredArgsConstructor
public class PerfilController {

    private final UsuarioService usuarioService;
    private final OrdenService ordenService;

    @GetMapping
    public UsuarioDto ver(@AuthenticationPrincipal Jwt jwt) {
        return usuarioService.perfil(UsuarioActual.id(jwt));
    }

    @PutMapping
    public UsuarioDto actualizar(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody PerfilRequest solicitud) {
        return usuarioService.actualizarPerfil(UsuarioActual.id(jwt), solicitud);
    }

    @GetMapping("/ordenes")
    public List<OrdenDto> misOrdenes(@AuthenticationPrincipal Jwt jwt) {
        return ordenService.delUsuario(UsuarioActual.id(jwt));
    }
}