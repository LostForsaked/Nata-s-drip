package cl.duoc.natasdrip.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "comuna",
        uniqueConstraints = @UniqueConstraint(name = "uq_comuna", columnNames = {"id_region", "nombre"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Comuna {

    @Id
    @Column(name = "id_comuna")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_region", nullable = false)
    private Region region;

    @Column(name = "nombre", nullable = false, length = 80)
    private String nombre;

}
