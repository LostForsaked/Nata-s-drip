package cl.duoc.natasdrip.dto;

import java.time.LocalDate;

public record UsuarioDto(
        Integer id,
        String run,
        String nombre,
        String apellidos,
        String correo,
        String telefono,
        LocalDate fechaNacimiento,
        String direccion,
        Integer idRol,
        String rol,
        Integer idComuna,
        String comuna,
        Integer idRegion,
        String region) {
}