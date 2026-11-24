package cl.duoc.natasdrip.controller;

import cl.duoc.natasdrip.dto.CategoriaDto;
import cl.duoc.natasdrip.dto.CategoriaRequest;
import cl.duoc.natasdrip.service.CategoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public List<CategoriaDto> listar() {
        return categoriaService.listar();
    }

    @GetMapping("/{id}")
    public CategoriaDto obtener(@PathVariable Integer id) {
        return categoriaService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public CategoriaDto crear(@Valid @RequestBody CategoriaRequest solicitud) {
        return categoriaService.crear(solicitud);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public CategoriaDto actualizar(@PathVariable Integer id, @Valid @RequestBody CategoriaRequest solicitud) {
        return categoriaService.actualizar(id, solicitud);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public void eliminar(@PathVariable Integer id) {
        categoriaService.eliminar(id);
    }
}