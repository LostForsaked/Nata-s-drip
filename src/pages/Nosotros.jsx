import React from 'react';

function Nosotros() {
  return (
    <main className="nosotros-main my-5">
      <section className="nosotros-intro container mb-5">
        <h1 className="fw-bold mb-4">¿Quiénes somos?</h1>
        <p className="text-secondary lh-lg">
          <strong>Nata's Drip</strong> nació de una idea sencilla: ¿Por qué vestir como todos cuando puedes vestir algo que realmente te representa?<br /><br />
          Somos una tienda de ropa alternativa enfocada en personas que encuentran inspiración en la música, los videojuegos, el internet, los memes, el arte y todas esas pequeñas obsesiones que terminan convirtiéndose en parte de nuestra identidad. <br /><br />
          Nuestro proyecto comenzó entre amigos que compartían el gusto por las camisetas que tenían algo que decir. No queríamos crear otra tienda llena de diseños genéricos que simplemente siguieran una tendencia. Queríamos prendas capaces de representar gustos, comunidades y momentos que forman parte de la vida de quienes las usan. <br /><br />
          Así nació <strong>Nata's Drip.</strong> <br /><br />
          Porque una camiseta puede ser mucho más que una camiseta. <br /><br />
          Puede decir qué música escuchas. <br />
          Puede mostrar el videojuego que marcó una etapa de tu vida. <br />
          Puede representar un meme que llevas años repitiendo. <br />
          O simplemente puede ser una camiseta que viste y pensaste "Este soy yo".
        </p>
      </section>

      <section className="nosotros-mision container mb-5">
        <h2 className="fw-bold mb-3">Nuestra misión</h2>
        <p className="text-secondary lh-lg">
          Nuestra misión es ofrecer ropa alternativa que permita a cada persona expresar su personalidad, gustos e intereses a través de lo que viste. <br /><br />
          Buscamos crear una tienda accesible, diversa y cercana, donde diferentes comunidades puedan encontrar diseños con los que se sientan identificadas, sin tener que limitarse a las tendencias tradicionales de la moda. <br /><br />
          <h5 className="text-dark mt-3"><strong>Nata's Drip</strong></h5>
          <strong>Tu estilo. Tus referencias. Tu drip.</strong>
        </p>
      </section>

      <section className="nosotros-desarrolladores container text-center mb-5">
        <h2 className="fw-bold mb-4">Equipo de desarrollo</h2>
        <div className="row g-4 justify-content-center dev-cards">
          <div className="col-md-4">
            <article className="dev-card p-4 border rounded-4 shadow-sm bg-light h-100">
              <img src="img/Natanael.png" alt="Foto Natanael" width="100" className="rounded-circle mb-3 object-fit-cover" style={{ height: '100px' }} />
              <h3 className="h5 fw-bold text-dark">Natanael Figueroa</h3>
              <p className="text-muted small mb-0">Estudiante DUOC UC - Ingeniería en informática</p>
            </article>
          </div>
          <div className="col-md-4">
            <article className="dev-card p-4 border rounded-4 shadow-sm bg-light h-100">
              <img src="img/Ruben.jpeg" alt="Foto Ruben" width="100" className="rounded-circle mb-3 object-fit-cover" style={{ height: '100px' }} />
              <h3 className="h5 fw-bold text-dark">Rubén Arteaga</h3>
              <p className="text-muted small mb-0">Estudiante DUOC UC - Ingeniería en informática</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Nosotros;