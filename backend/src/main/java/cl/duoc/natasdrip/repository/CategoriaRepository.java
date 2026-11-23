package cl.duoc.natasdrip.repository;

import cl.duoc.natasdrip.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer>{
    boolean existsByNombreIgnoreCase(String nombre);
}
