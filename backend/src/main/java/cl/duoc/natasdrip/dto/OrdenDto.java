package cl.duoc.natasdrip.dto;

import java.time.LocalDateTime;
import java.util.List;

public record OrdenDto(
        Integer id,
        String numero,
        String estado,
        Integer usuarioId,
        ClienteDto cliente,
        DireccionDto direccion,
        List<ItemDto> items,
        Integer subtotal,
        Integer descuento,
        Integer total,
        String cupon,
        LocalDateTime fecha,
        LocalDateTime fechaPago,
        String capacidadPago) {

    public record ClienteDto(String nombre, String apellidos, String correo) {
    }

    public record DireccionDto(String calle, String departamento, String region, String comuna, String indicaciones) {
    }

    public record ItemDto(Integer productoId, String nombre, String imagen,
                          Integer precioUnitario, Integer cantidad, Integer subtotal) {
    }
}