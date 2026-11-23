package cl.duoc.natasdrip.repository;

import cl.duoc.natasdrip.model.Cupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CuponRepository extends JpaRepository<Cupon, Integer> {
    Optional<Cupon> findByCodigoIgnoreCase(String codigo);
}
