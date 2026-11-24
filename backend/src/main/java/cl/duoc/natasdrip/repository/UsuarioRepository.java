package cl.duoc.natasdrip.repository;

import cl.duoc.natasdrip.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByCorreoIgnoreCase(String correo);

    boolean existsByCorreoIgnoreCase(String correo);

    boolean existsByCorreoIgnoreCaseAndIdNot(String correo, Integer id);

    boolean existsByRun(String run);

    boolean existsByRunAndIdNot(String run, Integer id);
}