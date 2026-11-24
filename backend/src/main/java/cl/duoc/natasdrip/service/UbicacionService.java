package cl.duoc.natasdrip.service;

import cl.duoc.natasdrip.dto.ComunaDto;
import cl.duoc.natasdrip.dto.RegionDto;
import cl.duoc.natasdrip.repository.ComunaRepository;
import cl.duoc.natasdrip.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UbicacionService {

    private final RegionRepository regionRepository;
    private final ComunaRepository comunaRepository;

    @Transactional(readOnly = true)
    public List<RegionDto> regiones() {
        return regionRepository.findAll(Sort.by("id")).stream()
                .map(r -> new RegionDto(r.getId(), r.getNombre()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ComunaDto> comunas(Integer idRegion) {
        if (!regionRepository.existsById(idRegion)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "La región no existe");
        }
        return comunaRepository.findByRegionIdOrderByNombre(idRegion).stream()
                .map(c -> new ComunaDto(c.getId(), c.getNombre(), idRegion))
                .toList();
    }
}