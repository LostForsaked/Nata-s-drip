package cl.duoc.natasdrip.dto;

public record ProductoDto(
        Integer id,
        String codigo,
        String nombre,
        String descripcion,
        String imagen,
        Integer precio,
        Integer descuento,
        Integer precioFinal,
        Integer stock,
        Integer stockCritico,
        boolean critico,
        Integer idCategoria,
        String categoria) {
}