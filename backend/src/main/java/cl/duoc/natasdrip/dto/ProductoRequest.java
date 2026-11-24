package cl.duoc.natasdrip.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProductoRequest(
        @NotBlank(message = "El código es obligatorio")
        @Size(min = 3, max = 10, message = "El código debe tener entre 3 y 10 caracteres")
        String codigo,

        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 100, message = "El nombre admite hasta 100 caracteres")
        String nombre,

        @Size(max = 500, message = "La descripción admite hasta 500 caracteres")
        String descripcion,

        @Size(max = 200, message = "La ruta de la imagen admite hasta 200 caracteres")
        String imagen,

        @NotNull(message = "El precio es obligatorio")
        @Min(value = 0, message = "El precio no puede ser menor a 0")
        Integer precio,

        @Min(value = 0, message = "El descuento debe estar entre 0 y 100")
        @Max(value = 100, message = "El descuento debe estar entre 0 y 100")
        Integer descuento,

        @NotNull(message = "El stock es obligatorio")
        @Min(value = 0, message = "El stock no puede ser menor a 0")
        Integer stock,

        @Min(value = 0, message = "El stock crítico no puede ser menor a 0")
        Integer stockCritico,

        @NotNull(message = "La categoría es obligatoria")
        Integer idCategoria) {
}