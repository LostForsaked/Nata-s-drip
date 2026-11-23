package cl.duoc.natasdrip.repository;

import cl.duoc.natasdrip.model.Comuna;
import cl.duoc.natasdrip.model.EstadoOrden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComunaRepository extends JpaRepository<Comuna, Integer> {
    List<Comuna> findByRegionIdOrderByNombre(Integer idRegion);
}
