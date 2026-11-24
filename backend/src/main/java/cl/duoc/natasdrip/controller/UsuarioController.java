package cl.duoc.natasdrip.controller;

import cl.duoc.natasdrip.dto.RolDto;
import cl.duoc.natasdrip.dto.UsuarioDto;
import cl.duoc.natasdrip.dto.UsuarioRequest;
import cl.duoc.natasdrip.security.UsuarioActual;
import cl.duoc.natasdrip.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import cl.duoc.natasdrip.dto.OrdenDto;
import cl.duoc.natasdrip.service.OrdenService;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final OrdenService ordenService;

    @GetMapping("/roles")
    public List<RolDto> roles() {
        return usuarioService.roles();
    }

    @GetMapping("/usuarios")
    public List<UsuarioDto> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/usuarios/{id}")
    public UsuarioDto obtener(@PathVariable Integer id) {
        return usuarioService.obtener(id);
    }

    @GetMapping("/usuarios/{id}/ordenes")
    public List<OrdenDto> ordenesDe(@PathVariable Integer id) {
        return ordenService.delUsuario(id);
    }

    @PostMapping("/usuarios")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioDto crear(@Valid @RequestBody UsuarioRequest solicitud) {
        return usuarioService.crear(solicitud);
    }

    @PutMapping("/usuarios/{id}")
    public UsuarioDto actualizar(@PathVariable Integer id, @Valid @RequestBody UsuarioRequest solicitud) {
        return usuarioService.actualizar(id, solicitud);
    }

    @DeleteMapping("/usuarios/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id, @AuthenticationPrincipal Jwt jwt) {
        usuarioService.eliminar(id, UsuarioActual.id(jwt));
    }
}