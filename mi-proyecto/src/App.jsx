import React, { useState, useEffect } from 'react';
import './App.css'
import RetiroMaterialesTable from '../../RetiroMaterialesTable';
import AdminPanel from './components/AdminPanel';
// Importación de activos locales
import imgMateriales from './assets/materiales.jpg';
import imgAsistencia from './assets/asistencia.jpg';
import imgSeguridad from './assets/seguridad.jpg';
import logoCorpoelec from './assets/logo_corpoelec.png'; // Asumiendo que es un .png

/**
 * Landing Page principal de la plataforma Corpoelec.
 * Implementa un diseño moderno, navbar superior y slider central.
 */
function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [view, setView] = useState('inicio'); // inicio, login, inventario, asistencia, permisos
  const [user, setUser] = useState(null); // Almacena datos del usuario logueado
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [loginData, setLoginData] = useState({
    cedula: '',
    password: '',
    nombre: '',
    apellido: ''
  });

  // Datos del slider (puedes reemplazar las URLs por assets locales)
  const slides = [
    {
      title: "Control Seguro y Optimizado de Materiales",
      description: "Optimización y control de inventario para la red eléctrica nacional.",
      image: imgMateriales
    },
    {
      title: "Control de Asistencia",
      description: "Seguimiento preciso del personal.",
      image: imgAsistencia
    },
    {
      title: "Seguridad y Auditoría",
      description: "Trazabilidad completa de cada acción realizada en el sistema.",
      image: imgSeguridad
    }
  ];

  // Efecto para el cambio automático de imágenes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Función para manejar el acceso a secciones protegidas
  const navigateTo = (targetView) => {
    if (!user && targetView !== 'inicio') {
      setShowLoginModal(true);
    } else {
      setView(targetView);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Validación segura contra inyección (componente controlado)
    // Credenciales de administrador solicitadas
    if (loginData.cedula === '0000000' && loginData.password === '123') {
      setUser({
        id: 1, // Cambiado para coincidir con el ID real en la DB (Auto-increment 1)
        nombre: loginData.nombre || 'Admin',
        cedula: loginData.cedula,
        rol: 'Admin' // Coincidencia exacta con el ENUM de la base de datos
      });
      setShowLoginModal(false);
      alert('Bienvenido, Administrador');
    } else {
      alert('Credenciales no válidas para el sistema.');
    }
  };

  return (
    <div className="landing-container">
      {/* Navbar Superior */}
      <nav className="navbar">
        <div className="navbar-left">
          <ul className="nav-links">
            <li><a href="#inicio" className={view === 'inicio' ? 'active' : ''} onClick={() => setView('inicio')}>Inicio</a></li>
            <li><a href="#inventario" className={view === 'inventario' ? 'active' : ''} onClick={() => navigateTo('inventario')}>Inventario</a></li>
            <li><a href="#asistencia" className={view === 'asistencia' ? 'active' : ''} onClick={() => navigateTo('asistencia')}>Asistencia</a></li>
            <li><a href="#permisos" className={view === 'permisos' ? 'active' : ''} onClick={() => navigateTo('permisos')}>Permisos</a></li>
            {user?.rol === 'Admin' && (
              <li><a href="#admin" className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}>Gestion Admin</a></li>
            )}
          </ul>
        </div>
        <div className="navbar-right">
          <div className="navbar-actions">
            {user ? (
              <div className="user-info">
                <span className="user-name">{user.nombre}</span>
                <button className="btn-logout" onClick={() => { setUser(null); setView('inicio'); }}>Cerrar Sesión</button>
              </div>
            ) : (
              <button className="btn-navbar-login" onClick={() => setShowLoginModal(true)}>Acceso</button>
            )}
            <img src={logoCorpoelec} alt="Logo Corpoelec" className="corpoelec-logo" />
          </div>
        </div>
      </nav>

      <main className="main-content">
        {view === 'inicio' && (
          <>
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
                    {!user && (
                      <button className="btn-primary" onClick={() => setShowLoginModal(true)}>
                        Iniciar Sesión
                      </button>
                    )}
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
              <div className="feature-card" onClick={() => navigateTo('inventario')}>
                <div className="icon-box blue-accent">📦</div>
                <h3>Materiales</h3>
                <p>Solicitud y retiro de insumos técnicos.</p>
              </div>
              <div className="feature-card" onClick={() => navigateTo('asistencia')}>
                <div className="icon-box red-accent">🕒</div>
                <h3>Asistencia</h3>
                <p>Registro de jornada laboral y guardias.</p>
              </div>
              <div className="feature-card" onClick={() => navigateTo('permisos')}>
                <div className="icon-box grey-accent">📄</div>
                <h3>Permisos</h3>
                <p>Gestión de solicitudes y justificativos.</p>
              </div>
            </section>
          </>
        )}

        {/* Modal de Inicio de Sesión */}
        {showLoginModal && (
          <div className="modal-overlay">
            <div className="login-modal animate-fade-in">
              <div className="modal-header">
                <h3>Acceso Administrativo</h3>
                <button className="close-x" onClick={() => setShowLoginModal(false)}>&times;</button>
              </div>
              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" value={loginData.nombre} onChange={(e) => setLoginData({...loginData, nombre: e.target.value})} placeholder="Ej: Juan" />
                  </div>
                  <div className="form-group">
                    <label>Apellido</label>
                    <input type="text" value={loginData.apellido} onChange={(e) => setLoginData({...loginData, apellido: e.target.value})} placeholder="Ej: Pérez" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Cédula de Identidad</label>
                  <input type="text" required value={loginData.cedula} onChange={(e) => setLoginData({...loginData, cedula: e.target.value})} placeholder="0000000" />
                </div>
                <div className="form-group">
                  <label>Contraseña</label>
                  <input type="password" required value={loginData.password} onChange={(e) => setLoginData({...loginData, password: e.target.value})} placeholder="123" />
                </div>
                <button type="submit" className="btn-login">Verificar Credenciales</button>
              </form>
            </div>
          </div>
        )}

        {view === 'inventario' && user && (
          <section className="inventory-section animate-fade-in">
            <RetiroMaterialesTable />
          </section>
        )}

        {view === 'admin' && user?.rol === 'Admin' && (
          <AdminPanel currentAdmin={user} />
        )}

        {(view === 'asistencia' || view === 'permisos') && user && (
          <div className="placeholder-view">
            <h2>Módulo de {view.charAt(0).toUpperCase() + view.slice(1)}</h2>
            <p>Contenido en desarrollo con la misma línea estética.</p>
            <button className="btn-primary" onClick={() => setView('inicio')}>Volver al Inicio</button>
          </div>
        )}
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} CORPOELEC - Sistema de Gestión Interna. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default App
