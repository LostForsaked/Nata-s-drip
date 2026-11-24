package cl.duoc.natasdrip.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orden")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Integer id;

    @Column(name = "numero", nullable = false, length = 20, unique = true)
    private String numero;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;

    @Column(name = "cliente_nombre", nullable = false, length = 50)
    private String clienteNombre;

    @Column(name = "cliente_apellidos", nullable = false, length = 100)
    private String clienteApellidos;

    @Column(name = "cliente_correo", nullable = false, length = 100)
    private String clienteCorreo;

    @Column(name = "capacidad_pago_hash", length = 64)
    private String capacidadPagoHash;

    @Column(name = "calle", nullable = false, length = 150)
    private String calle;

    @Column(name = "departamento", length = 30)
    private String departamento;

    @Column(name = "indicaciones", length = 300)
    private String indicaciones;

    @Column(name = "subtotal", nullable = false)
    private Integer subtotal;

    @Column(name = "descuento", nullable = false)
    private Integer descuento = 0;

    @Column(name = "total", nullable = false)
    private Integer total;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_estado", nullable = false)
    private EstadoOrden estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_comuna", nullable = false)
    private Comuna comuna;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_cupon")
    private Cupon cupon;

    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleOrden> detalles = new ArrayList<>();

    @PrePersist
    void alCrear(){
        if (fecha == null) {
            fecha = LocalDateTime.now();
        }
    }

    public void agregarDetalle(DetalleOrden detalle) {
        detalle.setOrden(this);
        detalles.add(detalle);
    }
}
