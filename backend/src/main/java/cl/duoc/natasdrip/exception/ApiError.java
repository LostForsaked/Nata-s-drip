package cl.duoc.natasdrip.exception;

import org.springframework.http.HttpStatus;

import java.time.Instant;
import java.util.Map;

public record ApiError(Instant timestamp, int status, String error, String mensaje, Map<String, String> campos) {

    public static ApiError de(HttpStatus estado, String mensaje, Map<String, String> campos) {
        return new ApiError(Instant.now(), estado.value(), estado.getReasonPhrase(), mensaje, campos);
    }
}