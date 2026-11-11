-- =====================================================================
--  ¡CUIDADO! Borra TODAS las tablas de Nata's Drip y sus datos.
--  Después vuelve a ejecutar 01_schema.sql y 02_seed.sql.
-- =====================================================================
USE natas_drip;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS orden_items;
DROP TABLE IF EXISTS ordenes;
DROP TABLE IF EXISTS carrito_items;
DROP TABLE IF EXISTS sesiones;
DROP TABLE IF EXISTS cupones;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
SET FOREIGN_KEY_CHECKS = 1;
