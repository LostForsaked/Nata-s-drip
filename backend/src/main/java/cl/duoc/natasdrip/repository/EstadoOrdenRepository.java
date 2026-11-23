package cl.duoc.natasdrip.repository;

import cl.duoc.natasdrip.model.EstadoOrden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstadoOrdenRepository extends JpaRepository<EstadoOrden, Integer> {
    Optional<EstadoOrden> findByNombre(String nombre);
}
