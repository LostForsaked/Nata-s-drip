package cl.duoc.natasdrip.dto;

import cl.duoc.natasdrip.util.Reglas;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record OrdenRequest(
        @NotNull(message = "Los datos del cliente son obligatorios") @Valid ClienteRequest cliente,
        @NotNull(message = "La dirección de envío es obligatoria") @Valid DireccionRequest direccion,
        @NotEmpty(message = "El carrito está vacío") List<@Valid ItemRequest> items,
        String cupon) {

    public record ClienteRequest(
            @NotBlank(message = "El nombre es obligatorio")
            @Size(max = 50, message = "El nombre admite hasta 50 caracteres")
            String nombre,

            @NotBlank(message = "Los apellidos son obligatorios")
            @Size(max = 100, message = "Los apellidos admiten hasta 100 caracteres")
            String apellidos,

            @NotBlank(message = "El correo es obligatorio")
            @Size(max = 100, message = "El correo admite hasta 100 caracteres")
            @Pattern(regexp = Reglas.CORREO_PERMITIDO,
                    message = "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com")
            String correo) {
    }

    public record DireccionRequest(
            @NotBlank(message = "La calle es obligatoria")
            @Size(max = 300, message = "La calle admite hasta 300 caracteres")
            String calle,

            @Size(max = 20, message = "El departamento admite hasta 20 caracteres")
            String departamento,

            @NotNull(message = "La comuna es obligatoria")
            Integer idComuna,

            @Size(max = 300, message = "Las indicaciones admiten hasta 300 caracteres")
            String indicaciones) {
    }

    public record ItemRequest(
            @NotNull(message = "El producto es obligatorio")
            Integer productoId,

            @NotNull(message = "La cantidad es obligatoria")
            @Min(value = 1, message = "La cantidad mínima es 1")
            Integer cantidad) {
    }
}