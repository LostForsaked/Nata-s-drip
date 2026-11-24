package cl.duoc.natasdrip.repository;

import cl.duoc.natasdrip.model.Producto;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    boolean existsByCodigoIgnoreCase(String codigo);

    boolean existsByCodigoIgnoreCaseAndIdNot(String codigo, Integer id);

    boolean existsByCategoriaId(Integer idCategoria);

    List<Producto> findByCategoriaIdOrderById(Integer idCategoria);

    List<Producto> findByDescuentoGreaterThanOrderById(Integer descuento);

    @Query("select p from Producto p where p.stockCritico is not null and p.stock <= p.stockCritico order by p.id")
    List<Producto> findCriticos();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Producto p where p.id in :ids order by p.id")
    List<Producto> findAllByIdForUpdate(@Param("ids") Collection<Integer> ids);
}