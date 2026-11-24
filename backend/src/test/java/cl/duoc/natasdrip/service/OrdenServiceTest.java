package cl.duoc.natasdrip.service;

import cl.duoc.natasdrip.dto.OrdenDto;
import cl.duoc.natasdrip.dto.OrdenRequest;
import cl.duoc.natasdrip.model.Comuna;
import cl.duoc.natasdrip.model.Cupon;
import cl.duoc.natasdrip.model.DetalleOrden;
import cl.duoc.natasdrip.model.EstadoOrden;
import cl.duoc.natasdrip.model.Orden;
import cl.duoc.natasdrip.model.Producto;
import cl.duoc.natasdrip.model.Region;
import cl.duoc.natasdrip.repository.ComunaRepository;
import cl.duoc.natasdrip.repository.CuponRepository;
import cl.duoc.natasdrip.repository.EstadoOrdenRepository;
import cl.duoc.natasdrip.repository.OrdenRepository;
import cl.duoc.natasdrip.repository.ProductoRepository;
import cl.duoc.natasdrip.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrdenServiceTest {

    private static final String CAPACIDAD_PAGO = "capacidad-secreta-de-prueba";

    @Mock
    OrdenRepository ordenRepository;
    @Mock
    ProductoRepository productoRepository;
    @Mock
    UsuarioRepository usuarioRepository;
    @Mock
    ComunaRepository comunaRepository;
    @Mock
    CuponRepository cuponRepository;
    @Mock
    EstadoOrdenRepository estadoRepository;

    @InjectMocks
    OrdenService servicio;



    private Producto producto(int id, int precio, int descuento, int stock) {
        Producto p = new Producto();
        p.setId(id);
        p.setCodigo("P00" + id);
        p.setNombre("Polera " + id);
        p.setPrecio(precio);
        p.setDescuento(descuento);
        p.setStock(stock);
        return p;
    }

    private Comuna comuna() {
        return new Comuna(1, new Region(1, "Región de Prueba"), "Comuna de Prueba");
    }

    private OrdenRequest solicitud(int productoId, int cantidad, String cupon) {
        return new OrdenRequest(
                new OrdenRequest.ClienteRequest("Ana", "Prueba", "ana@gmail.com"),
                new OrdenRequest.DireccionRequest("Calle 123", null, 1, null),
                List.of(new OrdenRequest.ItemRequest(productoId, cantidad)),
                cupon);
    }

    private Orden ordenPendiente(Producto producto, int cantidad) {
        Orden orden = new Orden();
        orden.setId(7);
        orden.setNumero("ND-20261124-0007");
        orden.setEstado(new EstadoOrden(1, "Pendiente de pago"));
        orden.setClienteNombre("Ana");
        orden.setClienteApellidos("Prueba");
        orden.setClienteCorreo("ana@gmail.com");
        orden.setCalle("Calle 123");
        orden.setComuna(comuna());
        orden.setSubtotal(10000 * cantidad);
        orden.setDescuento(0);
        orden.setTotal(10000 * cantidad);

        DetalleOrden detalle = new DetalleOrden();
        detalle.setProducto(producto);
        detalle.setNombreProducto(producto.getNombre());
        detalle.setPrecioUnitario(10000);
        detalle.setCantidad(cantidad);
        detalle.setSubtotal(10000 * cantidad);
        orden.agregarDetalle(detalle);
        return orden;
    }


    @Test
    void crearCalculaLosTotalesDesdeLaBaseYAplicaElCupon() {
        when(comunaRepository.findById(1)).thenReturn(Optional.of(comuna()));
        when(cuponRepository.findByCodigoIgnoreCase("NATAS10")).thenReturn(Optional.of(new Cupon(1, "NATAS10", 10)));
        // 10.000 con 10 % de descuento de producto = 9.000 por unidad
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto(1, 10000, 10, 5)));
        when(estadoRepository.findByNombre(OrdenService.PENDIENTE))
                .thenReturn(Optional.of(new EstadoOrden(1, "Pendiente de pago")));
        when(ordenRepository.saveAndFlush(any(Orden.class))).thenAnswer(inv -> {
            Orden o = inv.getArgument(0);
            o.setId(7);
            return o;
        });

        OrdenDto dto = servicio.crear(solicitud(1, 2, "NATAS10"), null);

        assertEquals(18000, dto.subtotal());
        assertEquals(1800, dto.descuento());
        assertEquals(16200, dto.total());
        assertEquals("Pendiente de pago", dto.estado());
        assertTrue(dto.numero().endsWith("-0007"));
        assertTrue(dto.capacidadPago() != null && !dto.capacidadPago().isBlank());
        assertNull(dto.usuarioId());
    }

    @Test
    void crearRechazaSiNoHayStockSuficiente() {
        when(comunaRepository.findById(1)).thenReturn(Optional.of(comuna()));
        when(productoRepository.findById(1)).thenReturn(Optional.of(producto(1, 10000, 0, 1)));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> servicio.crear(solicitud(1, 3, null), null));

        assertEquals(409, error.getStatusCode().value());
    }

    @Test
    void crearRechazaUnCuponInvalido() {
        when(comunaRepository.findById(1)).thenReturn(Optional.of(comuna()));
        when(cuponRepository.findByCodigoIgnoreCase("FALSO")).thenReturn(Optional.empty());

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> servicio.crear(solicitud(1, 1, "FALSO"), null));

        assertEquals(400, error.getStatusCode().value());
    }


    @Test
    void pagarDescuentaElStockYMarcaLaOrdenComoPagada() {
        Producto producto = producto(1, 10000, 0, 5);
        Orden orden = ordenPendiente(producto, 2);
        orden.setCapacidadPagoHash(OrdenService.hashCapacidad(CAPACIDAD_PAGO));
        when(ordenRepository.findByIdForUpdate(7)).thenReturn(Optional.of(orden));
        when(productoRepository.findAllByIdForUpdate(List.of(1))).thenReturn(List.of(producto));
        when(estadoRepository.findByNombre(OrdenService.PAGADA)).thenReturn(Optional.of(new EstadoOrden(2, "Pagada")));

        OrdenDto dto = servicio.pagar(7, null, false, CAPACIDAD_PAGO);

        assertEquals("Pagada", dto.estado());
        assertEquals(3, producto.getStock());
    }

    @Test
    void pagarDosVecesNoDescuentaElStockDosVeces() {
        Producto producto = producto(1, 10000, 0, 5);
        Orden orden = ordenPendiente(producto, 2);
        orden.setEstado(new EstadoOrden(2, "Pagada"));
        orden.setCapacidadPagoHash(OrdenService.hashCapacidad(CAPACIDAD_PAGO));
        when(ordenRepository.findByIdForUpdate(7)).thenReturn(Optional.of(orden));

        OrdenDto dto = servicio.pagar(7, null, false, CAPACIDAD_PAGO);

        assertEquals("Pagada", dto.estado());
        assertEquals(5, producto.getStock());
        verify(productoRepository, never()).findAllByIdForUpdate(any());
    }

    @Test
    void pagarFallaSiElStockSeAgotoEntreLaCreacionYElPago() {
        Producto producto = producto(1, 10000, 0, 1);
        Orden orden = ordenPendiente(producto, 2);
        orden.setCapacidadPagoHash(OrdenService.hashCapacidad(CAPACIDAD_PAGO));
        when(ordenRepository.findByIdForUpdate(7)).thenReturn(Optional.of(orden));
        when(productoRepository.findAllByIdForUpdate(List.of(1))).thenReturn(List.of(producto));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> servicio.pagar(7, null, false, CAPACIDAD_PAGO));

        assertEquals(409, error.getStatusCode().value());
        assertEquals(1, producto.getStock());
    }

    @Test
    void unInvitadoNoPuedePagarConUnTokenInvalido() {
        Producto producto = producto(1, 10000, 0, 5);
        when(ordenRepository.findByIdForUpdate(7)).thenReturn(Optional.of(ordenPendiente(producto, 2)));

        ResponseStatusException error = assertThrows(ResponseStatusException.class,
                () -> servicio.pagar(7, null, false, "token-invalido"));

        assertEquals(404, error.getStatusCode().value());
    }

    @Test
    void rechazarDejaLaOrdenComoPagoFallido() {
        Producto producto = producto(1, 10000, 0, 5);
        Orden orden = ordenPendiente(producto, 1);
        orden.setCapacidadPagoHash(OrdenService.hashCapacidad(CAPACIDAD_PAGO));
        when(ordenRepository.findByIdForUpdate(7)).thenReturn(Optional.of(orden));
        when(estadoRepository.findByNombre(OrdenService.FALLIDO)).thenReturn(Optional.of(new EstadoOrden(3, "Pago fallido")));

        OrdenDto dto = servicio.rechazar(7, null, false, CAPACIDAD_PAGO);

        assertEquals("Pago fallido", dto.estado());
        assertEquals(5, producto.getStock());
    }
}