package cl.duoc.natasdrip.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "estado_orden")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EstadoOrden {

    @Id
    @Column(name = "id_estado")
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 30, unique = true)
    private String nombre;
}
