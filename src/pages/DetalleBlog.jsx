import React from 'react';
import { Link, useParams } from 'react-router-dom';

const datosBlogs = {
  1: {
    categoria: 'Noticia',
    badgeClass: 'bg-primary-subtle text-primary',
    titulo: 'Internet Made Us Do It',
    imagen: '/img/poleraLobo.avif',
    resumen: "Nata's Drip presenta su nueva colección inspirada en la cultura de internet",
    contenido: (
      <>
        En Nata's Drip sabemos que internet nos ha dejado muchas cosas: buenas canciones, videojuegos,
        comunidades increíbles y una cantidad preocupante de memes. <br /><br />
        Por eso presentamos Internet Made Us Do It, nuestra nueva colección de camisetas inspirada en algunas de las referencias más reconocibles de la cultura digital. <br /><br />
        La colección combina diseños originales, humor y referencias que probablemente solo entenderán las personas correctas. <br /><br />
        Porque a veces una camiseta no necesita tener un significado profundo. <br /><br />
        A veces simplemente necesitas usar algo porque da risa.
      </>
    ),
    mostrarBotonProductos: true,
  },
  2: {
    categoria: 'Dato curioso',
    badgeClass: 'bg-primary-subtle text-primary',
    titulo: 'Vestirse también puede ser una forma de encontrar gente',
    imagen: '/img/Caso2.jpg',
    resumen: 'Cuando una referencia se convierte en una conversación',
    contenido: (
      <>
        Existe un fenómeno curioso: puedes caminar junto a cientos de personas sin conocer a ninguna. <br /><br />
        Pero basta con que alguien reconozca una referencia en tu camiseta para que exista una conexión inmediata. <br /><br />
        Una banda favorita. Un videojuego. Una película. Un meme demasiado específico. <br /><br />
        De repente, algo que parecía una simple prenda se convierte en una oportunidad para iniciar una conversación. <br /><br />
        En Nata's Drip nos gusta pensar que nuestros diseños pueden provocar precisamente eso. <br /><br />
        Tal vez nunca conozcas a la persona que reconoció tu camiseta. <br /><br />
        Pero durante unos segundos ambos sabrán que tienen algo en común.
      </>
    ),
    mostrarBotonProductos: false,
  },
};

function DetalleBlog() {
  const { id } = useParams();
  const blog = datosBlogs[id];

  if (!blog) {
    return (
      <div className="container my-5 text-center">
        <h2>Artículo no encontrado</h2>
        <Link to="/blogs" className="btn btn-dark mt-3">Volver a Blogs</Link>
      </div>
    );
  }

  return (
    <main className="container detalle-blog-main my-5">
      <article className="detalle-blog-content">
        <span className={`badge ${blog.badgeClass} mb-2 fw-semibold px-3 py-2 rounded-pill`}>
          {blog.categoria}
        </span>
        <h1 className="fw-bold text-dark mb-3">{blog.titulo}</h1>

        <img src={blog.imagen} alt={blog.titulo} className="img-fluid rounded-4 mb-4 blog-detalle-img" />

        <p className="text-primary fs-5">
          <strong>{blog.resumen}</strong>
        </p>

        <p className="text-secondary leading-relaxed mb-4">
          {blog.contenido}
        </p>

        <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-2">
          <Link to="/blogs" className="btn btn-outline-dark rounded-pill px-4">
            <i className="bi bi-arrow-left me-2"></i>Volver a Blogs
          </Link>

          {blog.mostrarBotonProductos && (
            <Link to="/productos" className="btn btn-outline-dark rounded-pill px-4">
              Conoce la colección <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          )}
        </div>
      </article>
    </main>
  );
}

export default DetalleBlog;