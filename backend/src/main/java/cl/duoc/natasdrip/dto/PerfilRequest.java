package cl.duoc.natasdrip.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record PerfilRequest(
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 50, message = "El nombre admite hasta 50 caracteres")
        String nombre,

        @NotBlank(message = "Los apellidos son obligatorios")
        @Size(max = 100, message = "Los apellidos admiten hasta 100 caracteres")
        String apellidos,

        @Size(max = 15, message = "El teléfono admite hasta 15 caracteres")
        String telefono,

        @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
        LocalDate fechaNacimiento,

        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 300, message = "La dirección admite hasta 300 caracteres")
        String direccion,

        @NotNull(message = "La comuna es obligatoria")
        Integer idComuna) {
}