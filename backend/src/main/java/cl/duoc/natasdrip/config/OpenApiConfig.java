package cl.duoc.natasdrip.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Nata's Drip API",
                version = "v1",
                description = "API REST de la tienda Nata's Drip: catálogo, usuarios, órdenes y pagos simulados. "
                        + "Los roles son Administrador, Vendedor y Cliente. "
                        + "Inicia sesión en /api/v1/auth/login y pega el token en Authorize."),
        security = @SecurityRequirement(name = "bearerAuth"))
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT")
public class OpenApiConfig {
}