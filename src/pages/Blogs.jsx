import React from 'react';
import { Link } from 'react-router-dom';

const articulosBlog = [
  {
    id: 1,
    categoria: 'Noticia',
    badgeClass: 'bg-primary-subtle text-primary',
    titulo: 'Internet Made Us Do It',
    subtitulo: 'Presentamos nuestra nueva colección!!',
    imagen: '/img/poleraLobo.avif',
    textoBoton: 'Conocer más',
  },
  {
    id: 2,
    categoria: 'Historia',
    badgeClass: 'bg-success-subtle text-success',
    titulo: 'Vestirse también puede ser una forma de encontrar gente',
    subtitulo: "Parte del espíritu de Nata's Drip",
    imagen: '/img/Caso2.jpg',
    textoBoton: 'Leer historia',
  },
];

function Blogs() {
  return (
    <>
      <header className="container my-5 text-center text-md-start">
        <h1 className="fw-bold text-dark display-5">NOTICIAS IMPORTANTES</h1>
        <p className="text-muted lead mb-0">
          Descubre las novedades, datos curiosos e historias detrás de nuestra tienda.
        </p>
      </header>

      <main className="container mb-5">
        <div className="row g-4 justify-content-center">
          {articulosBlog.map((item) => (
            <div className="col-12 col-lg-10" key={item.id}>
              <div className="card shadow-sm border-0 rounded-4 overflow-hidden h-100 card-blog">
                <div className="row g-0 align-items-center">
                  
                  <div className="col-md-6 p-4 p-md-5">
                    <span className={`badge ${item.badgeClass} mb-2 fw-semibold px-3 py-2 rounded-pill`}>
                      {item.categoria}
                    </span>
                    <h2 className="card-title fw-bold text-dark mb-3">{item.titulo}</h2>
                    <p className="card-text text-secondary mb-4">
                      <strong>{item.subtitulo}</strong>
                    </p>
                    <Link to={`/blogs/${item.id}`} className="btn btn-outline-dark rounded-pill px-4 mt-3">
                      {item.textoBoton} <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                  </div>

                  <div className="col-md-6">
                    <img src={item.imagen} className="img-fluid w-100 object-fit-cover blog-img" alt={item.titulo} />
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Blogs;