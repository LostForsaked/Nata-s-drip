# Base de datos MySQL de Nata's Drip

Antes todo (productos, usuarios, carrito, órdenes, sesión…) se guardaba en el
`localStorage` del navegador. Ahora vive en **MySQL** y el navegador solo habla
con un servidor (carpeta `server/`):

```
Navegador (React)  ──/api──▶  Servidor Express (Node)  ──SQL──▶  MySQL (natas_drip)
```

> Un navegador **no puede** conectarse directo a MySQL (expondría la contraseña
> de la base a cualquiera). Por eso existe el servidor intermedio.

## 1. Crear la base en MySQL Workbench

1. Abre **MySQL Workbench** y entra a tu conexión (ej. *Local instance MySQL*).
2. `File ▸ Open SQL Script…` → elige **`database/01_schema.sql`** → pulsa el rayo ⚡ (Execute).
   Crea la base `natas_drip` y las 9 tablas.
3. Repite con **`database/02_seed.sql`**: carga categorías, 12 productos, 4 usuarios y el cupón.
4. En el panel izquierdo, clic derecho en *Schemas* ▸ **Refresh All** y verás `natas_drip`.

Ver el diagrama: menú `Database ▸ Reverse Engineer…` → elige `natas_drip` → *Next* hasta el final.

`database/03_reset.sql` borra todas las tablas (úsalo solo para empezar de cero).

### Tablas

| Tabla | Reemplaza en localStorage | Contenido |
|---|---|---|
| `categorias` | `nd_categorias` | nombre único |
| `productos` | `nd_productos` | código único, precio, stock, stock crítico, descuento, categoría (FK) |
| `usuarios` | `nd_usuarios` | RUN/correo únicos, contraseña **cifrada (bcrypt)**, rol |
| `cupones` | constante `CUPON` | código y porcentaje |
| `sesiones` | `usuario_sesion`, `50off` | quién está logueado y su cupón (cookie httpOnly) |
| `carrito_items` | `mi_carrito` | producto y cantidad por sesión |
| `ordenes` | `nd_ordenes` | cliente, dirección, totales, estado |
| `orden_items` | `items` de cada orden | copia de nombre y precio al comprar |

## 2. Configurar la conexión

Copia `.env.example` como `.env` y escribe tu usuario y contraseña de MySQL:

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=natas_drip
```

(`.env` está en `.gitignore`: no se sube a Git.)

## 3. Ejecutar

```bash
npm install
npm run dev:all      # servidor API (3001) + web con Vite (5173)
```

Abre http://localhost:5173. Cuentas de prueba:

| Correo | Contraseña | Rol |
|---|---|---|
| admin@gmail.com | admin | Administrador |
| vendedor@gmail.com | 1234 | Vendedor |
| cliente@gmail.com | 1234 | Cliente |

Producción: `npm run build` y luego `npm start` (Express sirve la web y la API en el puerto 3001).

Alternativa sin Workbench: `npm run db:setup` ejecuta los dos scripts SQL desde la terminal.

## 4. Pruebas

```bash
npm test          # frontend (API falsa, no necesita MySQL)
npm run test:api  # API contra MySQL real; usa una base aparte: natas_drip_test
```

## Qué cambió en el código

* `src/data/db.js` ahora es un cliente de la API (mismos nombres, pero **async**: usar `await`).
* `src/data/useCargar.js` y `src/context/SesionContext.jsx`: cargan datos y sesión de forma asíncrona.
* `src/utils/cardLogic.js` y `pagos.js`: carrito, cupón y pagos pasan por la API.
* El **servidor calcula los precios, totales y stock** (el navegador ya no puede alterarlos).
* El pago descuenta stock dentro de una **transacción** con filas bloqueadas.
* `/admin` ahora exige iniciar sesión como Administrador/Vendedor (y el servidor valida cada petición).
