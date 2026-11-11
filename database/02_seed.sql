-- =====================================================================
--  Nata's Drip  ·  Datos iniciales (los mismos que tenía db.js)
--  Ejecutar DESPUÉS de 01_schema.sql. Se puede repetir sin duplicar
--  (INSERT IGNORE respeta los IDs ya existentes).
-- =====================================================================
USE natas_drip;
SET NAMES utf8mb4;

-- Categorías ----------------------------------------------------------
INSERT IGNORE INTO categorias (id, nombre) VALUES
  (1, 'Memes'),
  (2, 'Bandas'),
  (3, 'Cine y series');

-- Productos (precio base 14.990, stock crítico 5) -------------------------
INSERT IGNORE INTO productos
  (id, codigo, nombre, descripcion, imagen, precio, stock, stock_critico, descuento, categoria_id) VALUES
  (1,  'P001', 'Afraid of Women',         'Polera negra con estampado de lobo',                       '/img/poleraLobo.avif',  14990, 20, 5,  0, 1),
  (2,  'P002', 'Polera Cat Meme',         'Polera negra de algodón con estampado de memes de gatos.', '/img/catmeme.png',      14990, 20, 5,  0, 1),
  (3,  'P003', 'Gato SixSeven',           'Meme - Gato Sixseven 2 - Polera',                          '/img/sixseven.webp',    14990, 20, 5, 20, 1),
  (4,  'P004', 'Autism',                  'Autism esqueleto AK - Esqueleto - Polera',                 '/img/autism.webp',      14990,  4, 5,  0, 1),
  (5,  'P005', 'The cat parade',          'My Chemical Romance - The Cat Parade - Polera',            '/img/catparade.webp',   14990, 20, 5,  0, 2),
  (6,  'P006', 'System of a down',        'System Of a Down - Vision Logo - Polera',                  '/img/soad.webp',        14990, 20, 5,  0, 2),
  (7,  'P007', 'Ride the lightning',      'Metallica - Ride The Lightning - Polera',                  '/img/metallica.webp',   14990, 20, 5, 15, 2),
  (8,  'P008', 'Bring me the horizon',    'Bring Me The Horizon - Rock - Polera',                     '/img/bmth.webp',        14990, 20, 5,  0, 2),
  (9,  'P009', 'Asking Alexandria',       'Asking Alexandria - Dead - Polera',                        '/img/aa.webp',          14990,  3, 5,  0, 2),
  (10, 'P010', 'Bullet for my valentine', 'Bullet For My Valentine - Skull Emo 2 - Polera',           '/img/bfmv.webp',        14990, 20, 5,  0, 2),
  (11, 'P011', 'The devil wears prada',   'The Devil Wears Prada - Gargoyle - Polera',                '/img/tdwp.webp',        14990, 20, 5,  0, 2),
  (12, 'P012', 'Vader samurai',           'Star Wars - Darth Vader Samurai - Polera',                 '/img/vader.webp',       14990, 20, 5, 10, 3);

-- Usuarios de prueba ---------------------------------------------------
--  Contraseñas (guardadas como hash bcrypt):
--    admin@gmail.com / admin2@gmail.com  ->  admin
--    vendedor@gmail.com / cliente@gmail.com -> 1234
INSERT IGNORE INTO usuarios
  (id, run, nombre, apellidos, correo, password_hash, telefono, rol, region, comuna, direccion) VALUES
  (1, '111111111', 'Admin',    'Nata',  'admin@gmail.com',    '$2b$10$/vKudt3LBoZbHervc3V9OeSM43abPi0zfOyTFfz5uNLXfShAH/jCK', '', 'Administrador', 'Región Metropolitana de Santiago', 'Santiago',   'Dirección de prueba 123'),
  (2, '123456785', 'Admin',    'Ruben', 'admin2@gmail.com',   '$2b$10$Asm6PAyesyfvZ1efyZ5ZYO.IOfSQTR/HFx8C8J7gkWbs/zpNjd6dm', '', 'Administrador', 'Región Metropolitana de Santiago', 'Santiago',   'Dirección de prueba 123'),
  (3, '222222222', 'Vendedor', 'Demo',  'vendedor@gmail.com', '$2b$10$KG2m8fa.ZeizY2/XXeiqLeO/b8tPycX82dYuLAFivnVqCrQy3iUIK', '', 'Vendedor',      'Región Metropolitana de Santiago', 'Providencia','Dirección de prueba 123'),
  (4, '152345674', 'Cliente',  'Demo',  'cliente@gmail.com',  '$2b$10$kYt.ymHDmsVpKEqXv/cZ9eav.oBVv8Y7tEzKLey3C9arBEzkTxPd.', '', 'Cliente',       'Región Metropolitana de Santiago', 'Ñuñoa',      'Dirección de prueba 123');

-- Cupón de descuento ------------------------------------------------------
INSERT IGNORE INTO cupones (codigo, porcentaje, activo) VALUES ('NATAS10', 10, 1);
