import React, { useState, useEffect } from 'react';
import './App.css'
import RetiroMaterialesTable from './components/RetiroMaterialesTable';
import AdminPanel from './components/AdminPanel';
import MaterialAssignmentForm from './components/MaterialAssignmentForm';
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
  const [showAssignmentForm, setShowAssignmentForm] = useState(false); // Estado para mostrar el formulario de asignación
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
  const navigateTo = (e, targetView) => {
    if (e) e.preventDefault();
    if (!user && targetView !== 'inicio') {
      setShowLoginModal(true);
    } else {
      setView(targetView);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cedula: loginData.cedula,
          password: loginData.password
        })
      });

      // Verificamos si la respuesta es efectivamente JSON antes de parsear
      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const errorText = await response.text();
        throw new Error(`El servidor respondió con un formato no esperado (posible error interno): ${errorText.substring(0, 100)}...`);
      }

      if (response.ok && result.success) {
        setUser(result.user);
        setShowLoginModal(false);
        if (result.user.rol === 'Admin') {
          setView('admin');
        } else {
          setView('inicio');
        }
      } else {
        alert('Error de Acceso: ' + (result.message || 'Credenciales incorrectas'));
      }
    } catch (error) {
      console.error("Fallo en la comunicación con la API:", error);
      alert('Error de conexión: Asegúrate de que el servidor backend esté encendido (node server.js)');
    }
  };

  return (
    <div className="landing-container">
      {/* Navbar Superior */}
      <nav className="navbar">
        <div className="navbar-left">
          <ul className="nav-links">
            <li><a href="#" className={view === 'inicio' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setView('inicio'); }}>Inicio</a></li>
            <li><a href="#inventario" className={view === 'inventario' ? 'active' : ''} onClick={(e) => navigateTo(e, 'inventario')}>Inventario</a></li>
            <li><a href="#asistencia" className={view === 'asistencia' ? 'active' : ''} onClick={(e) => navigateTo(e, 'asistencia')}>Asistencia</a></li>
            <li><a href="#permisos" className={view === 'permisos' ? 'active' : ''} onClick={(e) => navigateTo(e, 'permisos')}>Permisos</a></li>
            {user?.rol === 'Admin' && (
              <li><a href="#" className={view === 'admin' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setView('admin'); }}>Gestion Admin</a></li>
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
              <div className="feature-card" onClick={(e) => navigateTo(e, 'inventario')}>
                <div className="icon-box blue-accent">📦</div>
                <h3>Materiales</h3>
                <p>Solicitud y retiro de insumos técnicos.</p>
              </div>
              <div className="feature-card" onClick={(e) => navigateTo(e, 'asistencia')}>
                <div className="icon-box red-accent">🕒</div>
                <h3>Asistencia</h3>
                <p>Registro de jornada laboral y guardias.</p>
              </div>
              <div className="feature-card" onClick={(e) => navigateTo(e, 'permisos')}>
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
            <div className="container mx-auto p-4">
                {!showAssignmentForm ? (
                    <>
                        <button className="mb-4 btn-primary bg-blue-600 hover:bg-blue-700" onClick={() => setShowAssignmentForm(true)}>+ Registrar Nueva Asignación</button>
                        <RetiroMaterialesTable />
                    </>
                ) : (
                    <MaterialAssignmentForm user={user} onCancel={() => setShowAssignmentForm(false)} onSaveSuccess={() => { setShowAssignmentForm(false); /* Aquí podrías recargar la tabla de materiales si fuera necesario */ }} />
                )}
            </div>
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
