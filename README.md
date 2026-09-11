# Cinemas — Catálogo de Películas

Sitio web de catálogo de películas desarrollado con **HTML, CSS y JavaScript puro (Vanilla JS)**, sin frameworks ni backend. La información de las películas y estrenos se gestiona mediante archivos **JSON**, que son consumidos dinámicamente con `fetch()` para renderizar el contenido en pantalla.

## Características

- 🏠 **Página de inicio (Main.html)** con banner de bienvenida y estadísticas del catálogo.
- 🎞️ **Catálogo de películas** alimentado desde `Catalogo.json`, con:
  - Buscador en tiempo real por título, género o director.
  - Navegación rápida por letra (A-Z).
  - Película destacada de la semana.
  - Sistema de valoración por estrellas.
- 🆕 **Sección de Estrenos** alimentada desde `Estrenos.json`, con tarjeta destacada y línea de tiempo de lanzamientos.
- ✉️ **Formulario de contacto** con validaciones básicas (campos obligatorios, aceptación de política de privacidad) y sección de preguntas frecuentes (FAQ) desplegable.
- 🎨 **Diseño responsivo** con tipografías personalizadas (Google Fonts: Bebas Neue, Barlow, Barlow Condensed) y estilos modulares por sección.

## Estructura del proyecto

```
Proyecto Catalogo - RIJS/
├── HTML/
│   ├── Main.html          # Página de inicio
│   ├── Catalogo.html      # Catálogo de películas
│   ├── Estrenos.html      # Próximos estrenos
│   └── Contacto.html      # Formulario de contacto
├── CSS/
│   ├── Style.css          # Estilos generales
│   ├── Header.css         # Estilos de la barra de navegación
│   ├── Footer.css         # Estilos del pie de página
│   ├── Main.css           # Estilos de la página de inicio
│   ├── Catalogo.css       # Estilos del catálogo
│   └── Contacto.css       # Estilos del formulario de contacto
├── Javascript/
│   ├── Catalogo.js        # Lógica del catálogo (fetch, filtros, modal)
│   ├── Estrenos.js        # Lógica de la sección de estrenos
│   └── Contacto.js        # Lógica del formulario de contacto y FAQ
├── JSON/
│   ├── Catalogo.Json      # Datos de las películas del catálogo
│   └── Estrenos.json      # Datos de los próximos estrenos
└── IMG/
    └── cinta de video.png # Recurso gráfico del proyecto
```

## Tecnologías utilizadas

- **HTML5**
- **CSS3** (estilos modulares por sección)
- **JavaScript (Vanilla)**
- **JSON** como fuente de datos
- **Google Fonts**

## Cómo ejecutar

1. Clona o descarga el repositorio.
2. Abre la carpeta del proyecto y ejecuta `HTML/Main.html` en tu navegador (recomendado usar una extensión tipo *Live Server* para que las peticiones `fetch()` a los archivos JSON funcionen correctamente).
3. Navega entre las secciones: Inicio, Películas, Estrenos y Contacto desde la barra de navegación.

## Posibles mejoras futuras

- Migrar los datos de JSON estático a una API o base de datos real.
- Añadir un sistema de favoritos o "lista para ver más tarde".
- Implementar paginación o scroll infinito en el catálogo.
- Conectar el formulario de contacto a un servicio de envío de correos real.
