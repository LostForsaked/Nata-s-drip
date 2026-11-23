package cl.duoc.natasdrip.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "producto")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer id;

    @Column(name = "codigo", nullable = false, length = 10, unique = true)
    private String codigo;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @Column(name = "imagen", length = 200)
    private String imagen = "/img/Logo.jpg";

    @Column(name = "precio", nullable = false)
    private Integer precio;

    @Column(name = "stock", nullable = false)
    private Integer stock = 0;

    @Column(name = "stock_critico")
    private Integer stockCritico;

    @Column(name = "descuento", nullable = false)
    private Integer descuento = 0;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;
}
