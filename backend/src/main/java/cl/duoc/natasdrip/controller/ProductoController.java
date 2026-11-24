package cl.duoc.natasdrip.controller;

import cl.duoc.natasdrip.dto.ProductoDto;
import cl.duoc.natasdrip.dto.ProductoRequest;
import cl.duoc.natasdrip.service.ProductoService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public List<ProductoDto> listar(@RequestParam(required = false) Integer categoriaId,
                                    @RequestParam(defaultValue = "false") boolean ofertas) {
        return productoService.listar(categoriaId, ofertas);
    }

    @GetMapping("/criticos")
    public List<ProductoDto> criticos() {
        return productoService.criticos();
    }

    @GetMapping("/{id}")
    public ProductoDto obtener(@PathVariable Integer id) {
        return productoService.obtener(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ProductoDto crear(@Valid @RequestBody ProductoRequest solicitud) {
        return productoService.crear(solicitud);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ProductoDto actualizar(@PathVariable Integer id, @Valid @RequestBody ProductoRequest solicitud) {
        return productoService.actualizar(id, solicitud);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public void eliminar(@PathVariable Integer id) {
        productoService.eliminar(id);
    }
}