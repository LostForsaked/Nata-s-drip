package cl.duoc.natasdrip.service;

import cl.duoc.natasdrip.dto.OrdenDto;
import cl.duoc.natasdrip.dto.OrdenRequest;
import cl.duoc.natasdrip.dto.OrdenRequest.ItemRequest;
import cl.duoc.natasdrip.model.Comuna;
import cl.duoc.natasdrip.model.Cupon;
import cl.duoc.natasdrip.model.DetalleOrden;
import cl.duoc.natasdrip.model.EstadoOrden;
import cl.duoc.natasdrip.model.Orden;
import cl.duoc.natasdrip.model.Producto;
import cl.duoc.natasdrip.repository.ComunaRepository;
import cl.duoc.natasdrip.repository.CuponRepository;
import cl.duoc.natasdrip.repository.EstadoOrdenRepository;
import cl.duoc.natasdrip.repository.OrdenRepository;
import cl.duoc.natasdrip.repository.ProductoRepository;
import cl.duoc.natasdrip.repository.UsuarioRepository;
import cl.duoc.natasdrip.util.Precios;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenService {

    public static final String PENDIENTE = "Pendiente de pago";
    public static final String PAGADA = "Pagada";
    public static final String FALLIDO = "Pago fallido";

    private final OrdenRepository ordenRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ComunaRepository comunaRepository;
    private final CuponRepository cuponRepository;
    private final EstadoOrdenRepository estadoRepository;


    @Transactional(readOnly = true)
    public List<OrdenDto> listar() {
        return ordenRepository.findAll(Sort.by("id")).stream().map(this::aDto).toList();
    }

    @Transactional(readOnly = true)
    public List<OrdenDto> delUsuario(Integer idUsuario) {
        return ordenRepository.findByUsuarioIdOrderByFechaDesc(idUsuario).stream().map(this::aDto).toList();
    }

    @Transactional(readOnly = true)
    public OrdenDto obtener(Integer id, Integer idUsuario, boolean esPersonal) {
        Orden orden = ordenRepository.findById(id).orElseThrow(this::noEncontrada);
        boolean esDueno = idUsuario != null && orden.getUsuario() != null
                && orden.getUsuario().getId().equals(idUsuario);
        if (!esPersonal && !esDueno) {
            throw noEncontrada();
        }
        return aDto(orden);
    }


    @Transactional
    public OrdenDto crear(OrdenRequest s, Integer idUsuario) {

        Map<Integer, Integer> pedido = new LinkedHashMap<>();
        for (ItemRequest item : s.items()) {
            pedido.merge(item.productoId(), item.cantidad(), Integer::sum);
        }

        Comuna comuna = comunaRepository.findById(s.direccion().idComuna())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "La comuna no existe"));

        Cupon cupon = null;
        if (s.cupon() != null && !s.cupon().isBlank()) {
            cupon = cuponRepository.findByCodigoIgnoreCase(s.cupon().trim())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El cupón no es válido"));
        }

        Orden orden = new Orden();
        int subtotal = 0;
        for (Map.Entry<Integer, Integer> linea : pedido.entrySet()) {
            Producto producto = productoRepository.findById(linea.getKey())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT,
                            "Uno de los productos ya no está disponible"));
            validarStock(producto, linea.getValue());


            int unitario = Precios.precioFinal(producto.getPrecio(), producto.getDescuento());
            int subtotalLinea = unitario * linea.getValue();

            DetalleOrden detalle = new DetalleOrden();
            detalle.setProducto(producto);
            detalle.setNombreProducto(producto.getNombre());
            detalle.setPrecioUnitario(unitario);
            detalle.setCantidad(linea.getValue());
            detalle.setSubtotal(subtotalLinea);
            orden.agregarDetalle(detalle);
            subtotal += subtotalLinea;
        }

        int descuento = cupon == null ? 0 : Precios.descuentoDe(subtotal, cupon.getPorcentaje());

        orden.setNumero("TMP-" + UUID.randomUUID().toString().substring(0, 12));
        orden.setEstado(estado(PENDIENTE));
        orden.setUsuario(idUsuario == null ? null : usuarioRepository.findById(idUsuario).orElse(null));
        orden.setClienteNombre(s.cliente().nombre().trim());
        orden.setClienteApellidos(s.cliente().apellidos().trim());
        orden.setClienteCorreo(s.cliente().correo().trim().toLowerCase());
        orden.setCalle(s.direccion().calle().trim());
        orden.setDepartamento(limpiar(s.direccion().departamento()));
        orden.setIndicaciones(limpiar(s.direccion().indicaciones()));
        orden.setComuna(comuna);
        orden.setCupon(cupon);
        orden.setSubtotal(subtotal);
        orden.setDescuento(descuento);
        orden.setTotal(subtotal - descuento);

        Orden guardada = ordenRepository.saveAndFlush(orden);

        String fecha = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        guardada.setNumero(String.format("ND-%s-%04d", fecha, guardada.getId()));
        return aDto(guardada);
    }

    @Transactional
    public OrdenDto pagar(Integer id, Integer idUsuario, String correo) {
        Orden orden = ordenRepository.findByIdForUpdate(id).orElseThrow(this::noEncontrada);
        verificarComprador(orden, idUsuario, correo);

        if (PAGADA.equals(orden.getEstado().getNombre())) {
            return aDto(orden);
        }

        List<DetalleOrden> detalles = orden.getDetalles();
        List<Integer> ids = detalles.stream().map(d -> d.getProducto().getId()).sorted().toList();
        Map<Integer, Producto> productos = productoRepository.findAllByIdForUpdate(ids).stream()
                .collect(Collectors.toMap(Producto::getId, Function.identity()));

        for (DetalleOrden detalle : detalles) {
            validarStock(productos.get(detalle.getProducto().getId()), detalle.getCantidad());
        }
        for (DetalleOrden detalle : detalles) {
            Producto producto = productos.get(detalle.getProducto().getId());
            producto.setStock(producto.getStock() - detalle.getCantidad());
        }

        orden.setEstado(estado(PAGADA));
        orden.setFechaPago(LocalDateTime.now());
        return aDto(orden);
    }

    @Transactional
    public OrdenDto rechazar(Integer id, Integer idUsuario, String correo) {
        Orden orden = ordenRepository.findByIdForUpdate(id).orElseThrow(this::noEncontrada);
        verificarComprador(orden, idUsuario, correo);
        if (!PAGADA.equals(orden.getEstado().getNombre())) {
            orden.setEstado(estado(FALLIDO));
        }
        return aDto(orden);
    }


    private void verificarComprador(Orden orden, Integer idUsuario, String correo) {
        boolean esDueno = idUsuario != null && orden.getUsuario() != null
                && orden.getUsuario().getId().equals(idUsuario);
        boolean correoCoincide = correo != null && correo.trim().equalsIgnoreCase(orden.getClienteCorreo());
        if (!esDueno && !correoCoincide) {
            throw noEncontrada();
        }
    }

    private void validarStock(Producto producto, int cantidad) {
        if (producto.getStock() < cantidad) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, String.format(
                    "Solo quedan %d unidades de \"%s\" (pediste %d)",
                    producto.getStock(), producto.getNombre(), cantidad));
        }
    }

    private EstadoOrden estado(String nombre) {
        return estadoRepository.findByNombre(nombre).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Falta el estado \"" + nombre + "\" en la base de datos"));
    }

    private ResponseStatusException noEncontrada() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada");
    }

    private String limpiar(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }

    private OrdenDto aDto(Orden o) {
        Comuna comuna = o.getComuna();
        List<OrdenDto.ItemDto> items = o.getDetalles().stream()
                .map(d -> new OrdenDto.ItemDto(
                        d.getProducto().getId(), d.getNombreProducto(), d.getProducto().getImagen(),
                        d.getPrecioUnitario(), d.getCantidad(), d.getSubtotal()))
                .toList();
        return new OrdenDto(
                o.getId(), o.getNumero(), o.getEstado().getNombre(),
                o.getUsuario() == null ? null : o.getUsuario().getId(),
                new OrdenDto.ClienteDto(o.getClienteNombre(), o.getClienteApellidos(), o.getClienteCorreo()),
                new OrdenDto.DireccionDto(o.getCalle(), o.getDepartamento(),
                        comuna.getRegion().getNombre(), comuna.getNombre(), o.getIndicaciones()),
                items, o.getSubtotal(), o.getDescuento(), o.getTotal(),
                o.getCupon() == null ? null : o.getCupon().getCodigo(),
                o.getFecha(), o.getFechaPago());
    }
}