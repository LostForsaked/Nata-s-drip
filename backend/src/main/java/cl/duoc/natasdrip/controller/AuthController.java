package cl.duoc.natasdrip.controller;


import cl.duoc.natasdrip.dto.AuthResponse;
import cl.duoc.natasdrip.dto.LoginRequest;
import cl.duoc.natasdrip.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest solicitud) {
        return authService.login(solicitud);
    }
}
