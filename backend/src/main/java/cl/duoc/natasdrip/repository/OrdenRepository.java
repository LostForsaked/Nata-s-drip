package cl.duoc.natasdrip.repository;

import cl.duoc.natasdrip.model.Orden;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrdenRepository extends JpaRepository<Orden, Integer> {

    Optional<Orden> findByNumero(String numero);

    List<Orden> findByUsuarioIdOrderByFechaDesc(Integer idUsuario);
}
