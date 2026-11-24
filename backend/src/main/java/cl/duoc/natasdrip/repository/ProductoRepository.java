package cl.duoc.natasdrip.repository;

import cl.duoc.natasdrip.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto,Integer> {

    boolean existsByCodigoIgnoreCase(String codigo);

    boolean existsByCategoriaId(Integer idCategoria);

    List<Producto> findByCategoriaId(Integer idCategoria);

    @Query("select p from Producto p where p.stockCritico is not null and p.stock <= p.stockCritico")
    List<Producto> findCriticos();
}
