package cl.duoc.natasdrip.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PasswordRequest(
        @NotBlank(message = "La contraseña actual es obligatoria")
        String actual,

        @NotBlank(message = "La contraseña nueva es obligatoria")
        @Size(min = 4, max = 10, message = "La contraseña debe tener entre 4 y 10 caracteres")
        String nueva) {
}