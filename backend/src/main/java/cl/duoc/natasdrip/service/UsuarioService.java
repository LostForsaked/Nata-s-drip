package cl.duoc.natasdrip.service;

import cl.duoc.natasdrip.dto.PerfilRequest;
import cl.duoc.natasdrip.dto.RegistroRequest;
import cl.duoc.natasdrip.dto.RolDto;
import cl.duoc.natasdrip.dto.UsuarioDto;
import cl.duoc.natasdrip.dto.UsuarioRequest;
import cl.duoc.natasdrip.model.Comuna;
import cl.duoc.natasdrip.model.Region;
import cl.duoc.natasdrip.model.Rol;
import cl.duoc.natasdrip.model.Usuario;
import cl.duoc.natasdrip.repository.ComunaRepository;
import cl.duoc.natasdrip.repository.OrdenRepository;
import cl.duoc.natasdrip.repository.RolRepository;
import cl.duoc.natasdrip.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private static final String ROL_CLIENTE = "Cliente";

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ComunaRepository comunaRepository;
    private final OrdenRepository ordenRepository;
    private final PasswordEncoder passwordEncoder;


    @Transactional
    public Usuario registrar(RegistroRequest s) {
        String run = normalizarRun(s.run());
        String correo = normalizarCorreo(s.correo());
        validarUnicos(run, correo, null);

        Usuario usuario = new Usuario();
        usuario.setRun(run);
        usuario.setNombre(s.nombre().trim());
        usuario.setApellidos(s.apellidos().trim());
        usuario.setCorreo(correo);
        usuario.setPassword(passwordEncoder.encode(s.password()));
        usuario.setTelefono(limpiar(s.telefono()));
        usuario.setFechaNacimiento(s.fechaNacimiento());
        usuario.setDireccion(s.direccion().trim());
        usuario.setComuna(buscarComuna(s.idComuna()));
        usuario.setRol(rolRepository.findByNombre(ROL_CLIENTE).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Falta el rol Cliente en la base de datos")));
        return usuarioRepository.save(usuario);
    }


    @Transactional(readOnly = true)
    public UsuarioDto perfil(Integer idUsuario) {
        return aDto(buscar(idUsuario));
    }

    @Transactional
    public UsuarioDto actualizarPerfil(Integer idUsuario, PerfilRequest s) {
        Usuario usuario = buscar(idUsuario);
        usuario.setNombre(s.nombre().trim());
        usuario.setApellidos(s.apellidos().trim());
        usuario.setTelefono(limpiar(s.telefono()));
        usuario.setFechaNacimiento(s.fechaNacimiento());
        usuario.setDireccion(s.direccion().trim());
        usuario.setComuna(buscarComuna(s.idComuna()));
        return aDto(usuario);
    }


    @Transactional(readOnly = true)
    public List<UsuarioDto> listar() {
        return usuarioRepository.findAll(Sort.by("id")).stream().map(this::aDto).toList();
    }

    @Transactional(readOnly = true)
    public UsuarioDto obtener(Integer id) {
        return aDto(buscar(id));
    }

    @Transactional(readOnly = true)
    public List<RolDto> roles() {
        return rolRepository.findAll(Sort.by("id")).stream()
                .map(r -> new RolDto(r.getId(), r.getNombre()))
                .toList();
    }

    @Transactional
    public UsuarioDto crear(UsuarioRequest s) {
        if (s.password() == null || s.password().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria al crear un usuario");
        }
        String run = normalizarRun(s.run());
        String correo = normalizarCorreo(s.correo());
        validarUnicos(run, correo, null);

        Usuario usuario = new Usuario();
        copiar(usuario, s, run, correo);
        usuario.setPassword(passwordEncoder.encode(s.password()));
        return aDto(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioDto actualizar(Integer id, UsuarioRequest s) {
        Usuario usuario = buscar(id);
        String run = normalizarRun(s.run());
        String correo = normalizarCorreo(s.correo());
        validarUnicos(run, correo, id);

        copiar(usuario, s, run, correo);
        if (s.password() != null && !s.password().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(s.password()));
        }
        return aDto(usuario);
    }

    @Transactional
    public void eliminar(Integer id, Integer idSolicitante) {
        Usuario usuario = buscar(id);
        if (usuario.getId().equals(idSolicitante)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No puedes eliminar tu propia cuenta");
        }
        if (ordenRepository.existsByUsuarioId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "No se puede eliminar: el usuario tiene órdenes asociadas");
        }
        usuarioRepository.delete(usuario);
    }

    private void copiar(Usuario usuario, UsuarioRequest s, String run, String correo) {
        Rol rol = rolRepository.findById(s.idRol())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "El rol no existe"));
        usuario.setRun(run);
        usuario.setNombre(s.nombre().trim());
        usuario.setApellidos(s.apellidos().trim());
        usuario.setCorreo(correo);
        usuario.setTelefono(limpiar(s.telefono()));
        usuario.setFechaNacimiento(s.fechaNacimiento());
        usuario.setDireccion(s.direccion().trim());
        usuario.setComuna(buscarComuna(s.idComuna()));
        usuario.setRol(rol);
    }

    private void validarUnicos(String run, String correo, Integer idExcluido) {
        boolean runRepetido = idExcluido == null
                ? usuarioRepository.existsByRun(run)
                : usuarioRepository.existsByRunAndIdNot(run, idExcluido);
        if (runRepetido) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese RUN");
        }
        boolean correoRepetido = idExcluido == null
                ? usuarioRepository.existsByCorreoIgnoreCase(correo)
                : usuarioRepository.existsByCorreoIgnoreCaseAndIdNot(correo, idExcluido);
        if (correoRepetido) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
        }
    }

    private Usuario buscar(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario no existe"));
    }

    private Comuna buscarComuna(Integer idComuna) {
        return comunaRepository.findById(idComuna)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "La comuna no existe"));
    }

    private String normalizarRun(String run) {
        return run.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizarCorreo(String correo) {
        return correo.trim().toLowerCase(Locale.ROOT);
    }

    private String limpiar(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }

    private UsuarioDto aDto(Usuario u) {
        Comuna c = u.getComuna();
        Region r = c == null ? null : c.getRegion();
        return new UsuarioDto(
                u.getId(), u.getRun(), u.getNombre(), u.getApellidos(), u.getCorreo(),
                u.getTelefono(), u.getFechaNacimiento(), u.getDireccion(),
                u.getRol().getId(), u.getRol().getNombre(),
                c == null ? null : c.getId(), c == null ? null : c.getNombre(),
                r == null ? null : r.getId(), r == null ? null : r.getNombre());
    }
}