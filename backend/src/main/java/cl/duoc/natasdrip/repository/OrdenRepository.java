package cl.duoc.natasdrip.repository;

import cl.duoc.natasdrip.model.Orden;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrdenRepository extends JpaRepository<Orden, Integer> {

    Optional<Orden> findByNumero(String numero);

    List<Orden> findByUsuarioIdOrderByFechaDesc(Integer idUsuario);

    boolean existsByUsuarioId(Integer idUsuario);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select o from Orden o where o.id = :id")
    Optional<Orden> findByIdForUpdate(@Param("id") Integer id);
}