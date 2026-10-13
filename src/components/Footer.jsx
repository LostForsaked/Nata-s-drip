import {Link} from 'react-router-dom';

export default function Footer(){
    return (
        <footer className="bg-dark text-white-50 text-center py-4 mt-5">
            <div className="container">
                <p className='mb-2'>
                    <Link to="/nosotros" className="text-white-50 mx-2">Nosotros</Link>
                    <Link to="/blogs" className='text-white-50 mx-2'>Blogs</Link>
                    <Link to="/contacto" className='text-white-50 mx-2'>Contacto</Link>
                </p>
                <p className="mb-0 small">&copy; {new Date().getFullYear()} Nata's Drip. Todos los derechos
                     reservados.</p>
            </div>
        </footer>
    );
}