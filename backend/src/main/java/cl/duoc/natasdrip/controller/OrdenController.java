package cl.duoc.natasdrip.controller;

import cl.duoc.natasdrip.dto.OrdenDto;
import cl.duoc.natasdrip.dto.OrdenRequest;
import cl.duoc.natasdrip.dto.PagoRequest;
import cl.duoc.natasdrip.security.UsuarioActual;
import cl.duoc.natasdrip.service.OrdenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/ordenes")
@RequiredArgsConstructor
public class OrdenController {

    private final OrdenService ordenService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR','VENDEDOR')")
    public List<OrdenDto> listar() {
        return ordenService.listar();
    }

    @GetMapping("/{id}")
    public OrdenDto obtener(@PathVariable Integer id, @AuthenticationPrincipal Jwt jwt, Authentication autenticacion) {
        return ordenService.obtener(id, UsuarioActual.id(jwt), UsuarioActual.esPersonal(autenticacion));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrdenDto crear(@Valid @RequestBody OrdenRequest solicitud, @AuthenticationPrincipal Jwt jwt) {
        return ordenService.crear(solicitud, idOpcional(jwt));
    }

    @PostMapping("/{id}/pagar")
    public OrdenDto pagar(@PathVariable Integer id,
                          @RequestBody(required = false) PagoRequest solicitud,
                          @AuthenticationPrincipal Jwt jwt) {
        return ordenService.pagar(id, idOpcional(jwt), correoDe(solicitud));
    }

    @PostMapping("/{id}/rechazar")
    public OrdenDto rechazar(@PathVariable Integer id,
                             @RequestBody(required = false) PagoRequest solicitud,
                             @AuthenticationPrincipal Jwt jwt) {
        return ordenService.rechazar(id, idOpcional(jwt), correoDe(solicitud));
    }

    private Integer idOpcional(Jwt jwt) {
        return jwt == null ? null : UsuarioActual.id(jwt);
    }

    private String correoDe(PagoRequest solicitud) {
        return solicitud == null ? null : solicitud.correo();
    }
}