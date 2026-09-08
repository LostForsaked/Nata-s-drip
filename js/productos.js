//  Datos iniciales catálogo 
const catalogoInicial = [
  { id: 1, titulo: "Afraid of Women", precio: 14990, img: "img/poleraLobo.avif", descripcion: "Polera negra con estampado de lobo" },
  { id: 2, titulo: "Polera Cat Meme", precio: 14990, img: "img/catmeme.png", descripcion: "Polera negra de algodón con estampado de memes de gatos." },
  { id: 3, titulo: "Gato SixSeven", precio: 14990, img: "img/sixseven.webp", descripcion: "Meme - Gato Sixseven 2 - Polera" },
  { id: 4, titulo: "Autism", precio: 14990, img: "img/autism.webp", descripcion: "Autism esqueleto AK - Esqueleto - Polera" },
  { id: 5, titulo: "The cat parade", precio: 14990, img: "img/catparade.webp", descripcion: "My Chemical Romance - The Cat Parade - Polera" },
  { id: 6, titulo: "System of a down", precio: 14990, img: "img/soad.webp", descripcion: "System Of a Down - Vision Logo - Polera" },
  { id: 7, titulo: "Ride the lightning", precio: 14990, img: "img/metallica.webp", descripcion: "Metallica - Ride The Lightning - Polera" },
  { id: 8, titulo: "Bring me the horizon", precio: 14990, img: "img/bmth.webp", descripcion: "Bring Me The Horizon - Rock - Polera" },
  { id: 9, titulo: "Asking Alexandria", precio: 14990, img: "img/aa.webp", descripcion: "Asking Alexandria - Dead - Polera" },
  { id: 10, titulo: "Bullet for my valentine", precio: 14990, img: "img/bfmv.webp", descripcion: "Bullet For My Valentine - Skull Emo 2 - Polera" },
  { id: 11, titulo: "The devil wears prada", precio: 14990, img: "img/tdwp.webp", descripcion: "The Devil Wears Prada - Gargoyle - Polera" },
  { id: 12, titulo: "Vader samurai", precio: 14990, img: "img/vader.webp", descripcion: "Star Wars - Darth Vader Samurai - Polera" }
];

// Alias usado por la vista de la tienda (cardLogic.js, productosVista.js,
// detalleLogic.js y carritoLogic.js) para mostrar productos y manejar el carrito.
// Sin esta línea esas funciones lanzan "productosCatalogo is not defined" y
// la tienda (Home, Productos, Detalle, Carrito) queda en blanco.
const productosCatalogo = catalogoInicial;

//  Manejo de productos en localStorage 
function obtenerProductos() {
  const productos = localStorage.getItem("productos");
  return productos ? JSON.parse(productos) : [];
}

function guardarProducto(producto) {
  const productos = obtenerProductos();
  productos.push(producto);
  localStorage.setItem("productos", JSON.stringify(productos));
}

function actualizarProducto(codigo, datosActualizados) {
  let productos = obtenerProductos();
  productos = productos.map(p => p.codigo === codigo ? { ...p, ...datosActualizados } : p);
  localStorage.setItem("productos", JSON.stringify(productos));
}

function eliminarProducto(codigo) {
  let productos = obtenerProductos();
  productos = productos.filter(p => p.codigo !== codigo);
  localStorage.setItem("productos", JSON.stringify(productos));
}

function buscarProductoPorCodigo(codigo) {
  const productos = obtenerProductos();
  return productos.find(p => p.codigo === codigo);
}

//  Siembra inicial: convierte el catálogo estático en productos completos 
function sembrarProductosIniciales() {
  const productosExistentes = obtenerProductos();

  if (productosExistentes.length === 0) {
    const productosSembrados = catalogoInicial.map(item => ({
      codigo: "P" + String(item.id).padStart(3, "0"), // Ej: P001, P002...
      nombre: item.titulo,
      descripcion: item.descripcion,
      precio: item.precio,
      stock: 20,
      stockCritico: 5,
      categoria: "Poleras",
      imagen: item.img
    }));

    localStorage.setItem("productos", JSON.stringify(productosSembrados));
  }
}
