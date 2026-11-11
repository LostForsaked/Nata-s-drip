-- =====================================================================
--  Nata's Drip  ·  Esquema de base de datos (MySQL 8 / MariaDB 10.5+)
--
--  Cómo ejecutarlo en MySQL Workbench:
--    1) Abre una conexión (por ejemplo "Local instance MySQL").
--    2) File > Open SQL Script...  y elige este archivo.
--    3) Pulsa el rayo (Execute) o Ctrl+Shift+Enter.
--
--  Es seguro ejecutarlo varias veces: usa CREATE ... IF NOT EXISTS y
--  NO borra datos. Para borrar todo y empezar de cero usa 03_reset.sql.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS natas_drip
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE natas_drip;
SET NAMES utf8mb4;

-- ---------------------------------------------------------------------
--  CATEGORIAS  (antes: localStorage "nd_categorias")
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
  id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nombre  VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categorias_nombre (nombre)       -- sin distinguir mayúsculas
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
--  PRODUCTOS  (antes: localStorage "nd_productos")
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id             INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  codigo         VARCHAR(20)      NOT NULL,
  nombre         VARCHAR(100)     NOT NULL,
  descripcion    VARCHAR(500)     NOT NULL DEFAULT '',
  imagen         MEDIUMTEXT       NOT NULL,       -- ruta (/img/x.webp) o data-URL
  precio         DECIMAL(12,2)    NOT NULL,
  stock          INT UNSIGNED     NOT NULL DEFAULT 0,
  stock_critico  INT UNSIGNED     NULL,            -- NULL = sin alerta
  descuento      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  categoria_id   INT UNSIGNED     NOT NULL,
  creado_en      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_productos_codigo (codigo),
  KEY ix_productos_categoria (categoria_id),
  CONSTRAINT ck_productos_precio    CHECK (precio >= 0),
  CONSTRAINT ck_productos_descuento CHECK (descuento BETWEEN 0 AND 100),
  CONSTRAINT fk_productos_categoria FOREIGN KEY (categoria_id)
    REFERENCES categorias (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
--  USUARIOS  (antes: localStorage "nd_usuarios")
--  La contraseña se guarda como hash bcrypt, nunca en texto plano.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  run              VARCHAR(9)   NULL,
  nombre           VARCHAR(50)  NOT NULL,
  apellidos        VARCHAR(100) NOT NULL DEFAULT '',
  correo           VARCHAR(100) NOT NULL,
  password_hash    VARCHAR(255) NOT NULL,
  telefono         VARCHAR(20)  NOT NULL DEFAULT '',
  fecha_nacimiento DATE         NULL,
  rol              ENUM('Administrador','Vendedor','Cliente') NOT NULL DEFAULT 'Cliente',
  region           VARCHAR(100) NOT NULL DEFAULT '',
  comuna           VARCHAR(100) NOT NULL DEFAULT '',
  direccion        VARCHAR(300) NOT NULL DEFAULT '',
  creado_en        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_usuarios_correo (correo),
  UNIQUE KEY uq_usuarios_run (run)               -- varios NULL permitidos
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
--  CUPONES  (antes: constante CUPON en cardLogic.js)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cupones (
  codigo      VARCHAR(20)      NOT NULL,
  porcentaje  TINYINT UNSIGNED NOT NULL,
  activo      TINYINT(1)       NOT NULL DEFAULT 1,
  PRIMARY KEY (codigo),
  CONSTRAINT ck_cupones_porcentaje CHECK (porcentaje BETWEEN 1 AND 100)
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
--  SESIONES  (antes: localStorage "usuario_sesion" y "50off")
--  El navegador solo guarda una cookie httpOnly con un token aleatorio;
--  aquí se guarda su hash SHA-256, el usuario logueado y el cupón.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sesiones (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  token_hash    CHAR(64)        NOT NULL,
  usuario_id    INT UNSIGNED    NULL,              -- NULL = visitante sin login
  cupon_codigo  VARCHAR(20)     NULL,
  creado_en     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ultimo_acceso DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expira_en     DATETIME        NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sesiones_token (token_hash),
  KEY ix_sesiones_expira (expira_en),
  CONSTRAINT fk_sesiones_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_sesiones_cupon FOREIGN KEY (cupon_codigo)
    REFERENCES cupones (codigo) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
--  CARRITO_ITEMS  (antes: localStorage "mi_carrito")
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS carrito_items (
  sesion_id    BIGINT UNSIGNED NOT NULL,
  producto_id  INT UNSIGNED    NOT NULL,
  cantidad     INT UNSIGNED    NOT NULL,
  creado_en    DATETIME(3)     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),   -- mantiene el orden en que se agregó
  PRIMARY KEY (sesion_id, producto_id),
  KEY ix_carrito_producto (producto_id),
  CONSTRAINT ck_carrito_cantidad CHECK (cantidad > 0),
  CONSTRAINT fk_carrito_sesion FOREIGN KEY (sesion_id)
    REFERENCES sesiones (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_carrito_producto FOREIGN KEY (producto_id)
    REFERENCES productos (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
--  ORDENES  (antes: localStorage "nd_ordenes")
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ordenes (
  id                INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  numero            VARCHAR(30)     NOT NULL,       -- ND-AAAAMMDD-0001
  usuario_id        INT UNSIGNED    NULL,           -- NULL = compra como invitado
  sesion_id         BIGINT UNSIGNED NULL,           -- quien hizo la compra (para ver su boleta)
  estado            ENUM('pendiente de pago','Pagada','Pago fallido')
                    NOT NULL DEFAULT 'pendiente de pago',
  cliente_nombre    VARCHAR(50)     NOT NULL,
  cliente_apellidos VARCHAR(100)    NOT NULL,
  cliente_correo    VARCHAR(100)    NOT NULL,
  dir_calle         VARCHAR(300)    NOT NULL,
  dir_departamento  VARCHAR(20)     NOT NULL DEFAULT '',
  dir_region        VARCHAR(100)    NOT NULL,
  dir_comuna        VARCHAR(100)    NOT NULL,
  dir_indicaciones  VARCHAR(300)    NOT NULL DEFAULT '',
  subtotal          DECIMAL(12,2)   NOT NULL,
  descuento         DECIMAL(12,2)   NOT NULL DEFAULT 0,
  total             DECIMAL(12,2)   NOT NULL,
  cupon             VARCHAR(20)     NULL,           -- copia del código usado
  fecha             DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_pago        DATETIME        NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ordenes_numero (numero),
  KEY ix_ordenes_usuario (usuario_id),
  KEY ix_ordenes_sesion (sesion_id),
  KEY ix_ordenes_estado_fecha (estado, fecha),
  CONSTRAINT fk_ordenes_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_ordenes_sesion FOREIGN KEY (sesion_id)
    REFERENCES sesiones (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;

-- ---------------------------------------------------------------------
--  ORDEN_ITEMS  (antes: arreglo "items" dentro de cada orden)
--  nombre y precio_unitario son una copia del momento de la compra:
--  la boleta no cambia aunque después se edite o elimine el producto.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orden_items (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  orden_id        INT UNSIGNED  NOT NULL,
  producto_id     INT UNSIGNED  NULL,               -- NULL si el producto se eliminó
  nombre          VARCHAR(100)  NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  cantidad        INT UNSIGNED  NOT NULL,
  subtotal        DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id),
  KEY ix_orden_items_orden (orden_id),
  KEY ix_orden_items_producto (producto_id),
  CONSTRAINT ck_orden_items_cantidad CHECK (cantidad > 0),
  CONSTRAINT fk_orden_items_orden FOREIGN KEY (orden_id)
    REFERENCES ordenes (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_orden_items_producto FOREIGN KEY (producto_id)
    REFERENCES productos (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB;
