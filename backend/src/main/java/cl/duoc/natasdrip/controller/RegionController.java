package cl.duoc.natasdrip.controller;

import cl.duoc.natasdrip.dto.ComunaDto;
import cl.duoc.natasdrip.dto.RegionDto;
import cl.duoc.natasdrip.service.UbicacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/regiones")
@RequiredArgsConstructor
public class RegionController {

    private final UbicacionService ubicacionService;

    @GetMapping
    public List<RegionDto> regiones() {
        return ubicacionService.regiones();
    }

    @GetMapping("/{id}/comunas")
    public List<ComunaDto> comunas(@PathVariable Integer id) {
        return ubicacionService.comunas(id);
    }
}