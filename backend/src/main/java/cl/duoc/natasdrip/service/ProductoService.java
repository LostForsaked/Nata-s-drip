package cl.duoc.natasdrip.service;

import cl.duoc.natasdrip.dto.ProductoDto;
import cl.duoc.natasdrip.dto.ProductoRequest;
import cl.duoc.natasdrip.model.Categoria;
import cl.duoc.natasdrip.model.Producto;
import cl.duoc.natasdrip.repository.CategoriaRepository;
import cl.duoc.natasdrip.repository.DetalleOrdenRepository;
import cl.duoc.natasdrip.repository.ProductoRepository;
import cl.duoc.natasdrip.util.Precios;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private static final String IMAGEN_POR_DEFECTO = "/img/Logo.jpg";

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final DetalleOrdenRepository detalleOrdenRepository;

    @Transactional(readOnly = true)
    public List<ProductoDto> listar(Integer idCategoria, boolean soloOfertas) {
        List<Producto> productos;
        if (idCategoria != null) {
            productos = productoRepository.findByCategoriaIdOrderById(idCategoria);
        } else if (soloOfertas) {
            productos = productoRepository.findByDescuentoGreaterThanOrderById(0);
        } else {
            productos = productoRepository.findAll(Sort.by("id"));
        }
        return productos.stream().map(this::aDto).toList();
    }

    @Transactional(readOnly = true)
    public ProductoDto obtener(Integer id) {
        return aDto(buscar(id));
    }

    @Transactional(readOnly = true)
    public List<ProductoDto> criticos() {
        return productoRepository.findCriticos().stream().map(this::aDto).toList();
    }

    @Transactional
    public ProductoDto crear(ProductoRequest solicitud) {
        String codigo = normalizarCodigo(solicitud.codigo());
        if (productoRepository.existsByCodigoIgnoreCase(codigo)) {
            throw codigoRepetido();
        }
        Producto producto = new Producto();
        copiar(producto, solicitud, codigo);
        return aDto(productoRepository.save(producto));
    }

    @Transactional
    public ProductoDto actualizar(Integer id, ProductoRequest solicitud) {
        Producto producto = buscar(id);
        String codigo = normalizarCodigo(solicitud.codigo());
        if (productoRepository.existsByCodigoIgnoreCaseAndIdNot(codigo, id)) {
            throw codigoRepetido();
        }
        copiar(producto, solicitud, codigo);
        return aDto(producto);
    }

    @Transactional
    public void eliminar(Integer id) {
        Producto producto = buscar(id);
        if (detalleOrdenRepository.existsByProductoId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar: el producto tiene ventas asociadas");
        }
        productoRepository.delete(producto);
    }

    private void copiar(Producto producto, ProductoRequest s, String codigo) {
        Categoria categoria = categoriaRepository.findById(s.idCategoria())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoría no existe"));
        producto.setCodigo(codigo);
        producto.setNombre(s.nombre().trim());
        producto.setDescripcion(s.descripcion() == null ? null : s.descripcion().trim());
        producto.setImagen(s.imagen() == null || s.imagen().isBlank() ? IMAGEN_POR_DEFECTO : s.imagen().trim());
        producto.setPrecio(s.precio());
        producto.setDescuento(s.descuento() == null ? 0 : s.descuento());
        producto.setStock(s.stock());
        producto.setStockCritico(s.stockCritico());
        producto.setCategoria(categoria);
    }

    private String normalizarCodigo(String codigo) {
        return codigo.trim().toUpperCase(Locale.ROOT);
    }

    private Producto buscar(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El producto no existe"));
    }

    private ResponseStatusException codigoRepetido() {
        return new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un producto con ese código");
    }

    private ProductoDto aDto(Producto p) {
        boolean critico = p.getStockCritico() != null && p.getStock() <= p.getStockCritico();
        return new ProductoDto(
                p.getId(), p.getCodigo(), p.getNombre(), p.getDescripcion(), p.getImagen(),
                p.getPrecio(), p.getDescuento(), Precios.precioFinal(p.getPrecio(), p.getDescuento()),
                p.getStock(), p.getStockCritico(), critico,
                p.getCategoria().getId(), p.getCategoria().getNombre());
    }
}