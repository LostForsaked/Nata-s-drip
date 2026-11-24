package cl.duoc.natasdrip.dto;

import cl.duoc.natasdrip.util.Reglas;
import cl.duoc.natasdrip.validation.RunValido;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UsuarioRequest(
        @NotBlank(message = "El RUN es obligatorio")
        @RunValido
        String run,

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
        String correo,

        @Size(min = 4, max = 10, message = "La contraseña debe tener entre 4 y 10 caracteres")
        String password,

        @Size(max = 15, message = "El teléfono admite hasta 15 caracteres")
        String telefono,

        @Past(message = "La fecha de nacimiento debe ser anterior a hoy")
        LocalDate fechaNacimiento,

        @NotBlank(message = "La dirección es obligatoria")
        @Size(max = 300, message = "La dirección admite hasta 300 caracteres")
        String direccion,

        @NotNull(message = "La comuna es obligatoria")
        Integer idComuna,

        @NotNull(message = "El rol es obligatorio")
        Integer idRol) {
}