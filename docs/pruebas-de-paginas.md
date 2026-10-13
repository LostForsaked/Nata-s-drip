# Pruebas de páginas

Las pruebas automatizadas de humo están en `src/tests/paginas.spec.jsx`. Ejecuta
`npm test` para correrlas junto con el resto de pruebas del proyecto.

Cada ruta se abre con la aplicación y sus dependencias de enrutamiento reales.
La prueba comprueba que se renderice contenido y un encabezado (o la leyenda del
formulario de registro). Los datos iniciales se reinician antes de cada caso; se crea una
sesión de administrador para las rutas restringidas y órdenes de prueba para
las vistas de compra y boletas.

| Página | Ruta cubierta |
| --- | --- |
| Inicio | `/` |
| Productos | `/productos` |
| Categorías | `/categorias` |
| Ofertas | `/ofertas` |
| Detalle de producto | `/detalles?id=1` |
| Carrito | `/carrito` |
| Checkout | `/checkout` |
| Compra exitosa | `/compra-exitosa?orden=1` |
| Compra fallida | `/compra-fallida?orden=2` |
| Blogs | `/blogs` |
| Detalle de blog | `/blogs/1` |
| Contacto | `/contacto` |
| Inicio de sesión | `/login` |
| Registro | `/registro` |
| Nosotros | `/nosotros` |
| Admin: dashboard | `/admin` |
| Admin: productos | `/admin/productos` |
| Admin: productos críticos | `/admin/productos/criticos` |
| Admin: detalle de producto | `/admin/productos/1` |
| Admin: órdenes | `/admin/ordenes` |
| Admin: boleta | `/admin/ordenes/1` |
| Admin: perfil | `/admin/perfil` |
| Admin: crear producto | `/admin/productos/nuevo` |
| Admin: editar producto | `/admin/productos/1/editar` |
| Admin: categorías | `/admin/categorias` |
| Admin: usuarios | `/admin/usuarios` |
| Admin: nuevo usuario | `/admin/usuarios/nuevo` |
| Admin: reportes | `/admin/reportes` |
| Página no encontrada | `/ruta-inexistente` |
| Admin: vista pendiente (sin ruta) | Renderizado directo de `Pendiente` |

Estas son pruebas de renderizado y enrutamiento; no reemplazan pruebas de
interacción o validación específicas de cada formulario y flujo.
