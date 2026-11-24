package cl.duoc.natasdrip.service;

import cl.duoc.natasdrip.dto.CuponDto;
import cl.duoc.natasdrip.repository.CuponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class CuponService {

    private final CuponRepository cuponRepository;

    @Transactional(readOnly = true)
    public CuponDto validar(String codigo) {
        return cuponRepository.findByCodigoIgnoreCase(codigo.trim())
                .map(c -> new CuponDto(c.getCodigo(), c.getPorcentaje()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cupón inválido"));
    }
}