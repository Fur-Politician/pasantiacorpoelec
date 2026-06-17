import React, { useState, useEffect } from 'react';
import './App.css'

/**
 * Landing Page principal de la plataforma Corpoelec.
 * Implementa un diseño moderno, navbar superior y slider central.
 */
function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Datos del slider (puedes reemplazar las URLs por assets locales)
  const slides = [
    {
      title: "Gestión Eficiente   de Materiales",
      description: "Optimización y control de inventario para la red eléctrica nacional.",
      image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Control de Asistencia Biométrico",
      description: "Seguimiento preciso del personal con geolocalización en tiempo real.",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200"
    },
    {
      title: "Seguridad y Auditoría",
      description: "Trazabilidad completa de cada acción realizada en el sistema.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=1200"
    }
  ];

  // Efecto para el cambio automático de imágenes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="landing-container">
      {/* Navbar Superior */}
      <nav className="navbar">
        <div className="navbar-left">
          <ul className="nav-links">
            <li><a href="#inicio" className="active">Inicio</a></li>
            <li><a href="#inventario">Inventario</a></li>
            <li><a href="#asistencia">Asistencia</a></li>
            <li><a href="#permisos">Permisos</a></li>
          </ul>
        </div>
        <div className="navbar-right">
          {/* Espacio para el logo de Corpoelec */}
          <div className="corpoelec-logo-placeholder">
            <span className="logo-text">CORPOELEC</span>
            <div className="red-accent-bar"></div>
          </div>
        </div>
      </nav>

      {/* Hero Section con Slider */}
      <header className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${slide.image})` }}
          >
            <div className="slide-content">
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-description">{slide.description}</p>
              <div className="button-group">
                <button className="btn-primary">Acceder al Sistema</button>
                <button className="btn-secondary">Consultar Guías</button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Indicadores del Slider */}
        <div className="slider-indicators">
          {slides.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </header>

      {/* Sección de Acceso Rápido */}
      <section className="features-grid">
        <div className="feature-card">
          <div className="icon-box blue-accent">📦</div>
          <h3>Materiales</h3>
          <p>Solicitud y retiro de insumos técnicos.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box red-accent">🕒</div>
          <h3>Asistencia</h3>
          <p>Registro de jornada laboral y guardias.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box grey-accent">📄</div>
          <h3>Permisos</h3>
          <p>Gestión de solicitudes y justificativos.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2023 CORPOELEC - Sistema de Gestión Interna. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
