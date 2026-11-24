package cl.duoc.natasdrip.controller;

import cl.duoc.natasdrip.dto.CuponDto;
import cl.duoc.natasdrip.service.CuponService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cupones")
@RequiredArgsConstructor
public class CuponController {

    private final CuponService cuponService;

    @GetMapping("/{codigo}")
    public CuponDto validar(@PathVariable String codigo) {
        return cuponService.validar(codigo);
    }
}