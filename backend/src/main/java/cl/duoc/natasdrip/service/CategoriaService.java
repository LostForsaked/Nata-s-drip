package cl.duoc.natasdrip.service;

import cl.duoc.natasdrip.dto.CategoriaDto;
import cl.duoc.natasdrip.dto.CategoriaRequest;
import cl.duoc.natasdrip.model.Categoria;
import cl.duoc.natasdrip.repository.CategoriaRepository;
import cl.duoc.natasdrip.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    @Transactional(readOnly = true)
    public List<CategoriaDto> listar() {
        return categoriaRepository.findAll(Sort.by("nombre")).stream()
                .map(this::aDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoriaDto obtener(Integer id) {
        return aDto(buscar(id));
    }

    @Transactional
    public CategoriaDto crear(CategoriaRequest solicitud) {
        String nombre = solicitud.nombre().trim();
        if (categoriaRepository.existsByNombreIgnoreCase(nombre)) {
            throw nombreRepetido();
        }
        Categoria categoria = new Categoria();
        categoria.setNombre(nombre);
        return aDto(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaDto actualizar(Integer id, CategoriaRequest solicitud) {
        Categoria categoria = buscar(id);
        String nombre = solicitud.nombre().trim();
        if (categoriaRepository.existsByNombreIgnoreCaseAndIdNot(nombre, id)) {
            throw nombreRepetido();
        }
        categoria.setNombre(nombre);
        return aDto(categoria);
    }

    @Transactional
    public void eliminar(Integer id) {
        Categoria categoria = buscar(id);
        if (productoRepository.existsByCategoriaId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar: la categoría tiene productos asociados");
        }
        categoriaRepository.delete(categoria);
    }

    private Categoria buscar(Integer id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "La categoría no existe"));
    }

    private ResponseStatusException nombreRepetido() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una categoría con ese nombre");
    }

    private CategoriaDto aDto(Categoria categoria) {
        return new CategoriaDto(categoria.getId(), categoria.getNombre());
    }
}