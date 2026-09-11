/* ══════════════════════════════════════════════════════
   Catalogo.js — Cinemas
   Catálogo alimentado por Catalogo.json
   Modal de detalle al hacer clic en cada película
══════════════════════════════════════════════════════ */
 
/* ──────────────────────────────────────
   ESTADO GLOBAL
────────────────────────────────────── */
let todasLasPeliculas = [];   // array plano cargado desde el JSON
let letraActual   = 'TODAS';
let busquedaActual = '';
 
/* ──────────────────────────────────────
   CARGA DE DATOS (fetch al JSON)
────────────────────────────────────── */
fetch('../JSON/Catalogo.json')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo cargar Catalogo.json');
    return res.json();
  })
  .then(data => {
    // Ordenar alfabéticamente por título
    todasLasPeliculas = data.sort((a, b) => a.titulo.localeCompare(b.titulo));
    renderCatalogo();
    crearModal();
  })
  .catch(err => {
    console.error(err);
    document.getElementById('catalogo').innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#888;">
        <div style="font-size:48px;opacity:0.2;margin-bottom:12px;">⚠️</div>
        <p style="font-size:14px;letter-spacing:1px;">
          No se pudo cargar el catálogo. Asegúrate de que
          <strong style="color:#E5E5E5">Catalogo.json</strong> está en la carpeta JSON.
        </p>
      </div>`;
  });
 
/* ──────────────────────────────────────
   HELPERS
────────────────────────────────────── */
 
/** Devuelve las películas que corresponden al filtro actual */
function getPeliculasFiltradas() {
  return todasLasPeliculas.filter(p => {
    const matchLetra = letraActual === 'TODAS' || p.letra === letraActual;
    const q = busquedaActual.toLowerCase();
    const matchBusqueda = !q
      || p.titulo.toLowerCase().includes(q)
      || p.genero.toLowerCase().includes(q)
      || (p.director && p.director.toLowerCase().includes(q));
    return matchLetra && matchBusqueda;
  });
}
 
/** Agrupa un array plano de películas por su letra */
function agruparPorLetra(lista) {
  return lista.reduce((acc, p) => {
    const l = p.letra.toUpperCase();
    if (!acc[l]) acc[l] = [];
    acc[l].push(p);
    return acc;
  }, {});
}
 
/** Estrellas a partir del rating numérico */
function estrellas(rating) {
  const n = parseFloat(rating);
  const llenas = Math.round(n / 2);
  return '★'.repeat(llenas) + '☆'.repeat(5 - llenas);
}
 
/* ──────────────────────────────────────
   RENDER PRINCIPAL
────────────────────────────────────── */
function renderCatalogo() {
  const contenedor = document.getElementById('catalogo');
  if (!contenedor) return;
 
  contenedor.innerHTML = '';
 
  const filtradas = getPeliculasFiltradas();
  const grupos    = agruparPorLetra(filtradas);
  const letras    = Object.keys(grupos).sort();
 
  if (letras.length === 0) {
    contenedor.innerHTML = `
      <div style="text-align:center;padding:60px 20px;color:#888;">
        <div style="font-size:48px;opacity:0.15;margin-bottom:12px;">🎬</div>
        <p style="font-size:14px;letter-spacing:1px;">
          No se encontraron películas${busquedaActual
            ? ` para "<strong style="color:#E5E5E5">${busquedaActual}</strong>"`
            : ''}.
        </p>
      </div>`;
    actualizarDestacado(null);
    return;
  }
 
  letras.forEach(letra => {
    const items   = grupos[letra];
    const seccion = document.createElement('section');
    seccion.className = 'seccion-letra';
    seccion.id = 'letra-' + letra;
 
    seccion.innerHTML = `
      <div class="seccion-header">
        <span class="seccion-letra-badge">${letra}</span>
        <div class="seccion-linea"></div>
      </div>
      <div class="cards-grid">
        ${items.map(p => `
          <div class="card" data-id="${p.id}" data-titulo="${p.titulo}" title="Ver detalles de ${p.titulo}">
            <div class="card-poster-placeholder">
              <span class="inicial">${p.titulo[0]}</span>
              <span class="icono">🎬</span>
            </div>
            <div class="card-info">
              <div class="card-titulo">${p.titulo}</div>
              <div class="card-año">${p.anio}</div>
              <span class="card-genero">${p.genero}</span>
            </div>
            <div class="card-overlay-hint">Ver más ▸</div>
          </div>
        `).join('')}
      </div>
    `;
 
    contenedor.appendChild(seccion);
  });
 
  // Delegar el click de todas las cards
  contenedor.addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const id = parseInt(card.dataset.id, 10);
    const titulo = card.dataset.titulo;
    // Busca por id Y titulo para evitar colisiones
    const pelicula = todasLasPeliculas.find(p => p.id === id && p.titulo === titulo)
                  || todasLasPeliculas.find(p => p.titulo === titulo);
    if (pelicula) abrirModal(pelicula);
  }, { once: false });
 
  actualizarDestacado(filtradas[0] || null);
}
 
/* ──────────────────────────────────────
   ACTUALIZAR DESTACADO
────────────────────────────────────── */
function actualizarDestacado(pelicula) {
  const tituloEl = document.getElementById('destacado-titulo');
  const descEl   = document.getElementById('destacado-desc');
  const letraEl  = document.getElementById('destacado-letra');
  const tagEl    = document.getElementById('destacado-tag');
  if (!tituloEl) return;
 
  if (pelicula && letraActual !== 'TODAS') {
    tituloEl.textContent = pelicula.titulo;
    if (descEl)  descEl.textContent  = `${pelicula.genero} · ${pelicula.anio}`;
    if (letraEl) letraEl.textContent = pelicula.letra;
    if (tagEl)   tagEl.textContent   = '🎬 Letra ' + pelicula.letra;
  } else {
    tituloEl.textContent = 'Catálogo completo';
    if (descEl)  descEl.textContent  = 'Todas las películas de la A a la Z.';
    if (letraEl) letraEl.textContent = '★';
    if (tagEl)   tagEl.textContent   = '🎬 Todas las películas';
  }
}
 
/* ──────────────────────────────────────
   SELECCIONAR LETRA (botones ABC)
────────────────────────────────────── */
function irALetra(letra) {
  letraActual = letraActual === letra ? 'TODAS' : letra;
  busquedaActual = '';
 
  const buscador = document.getElementById('user-search');
  if (buscador) buscador.value = '';
 
  document.querySelectorAll('.letra-btn').forEach(b => {
    b.classList.toggle('activa', b.textContent.trim() === letraActual);
  });
 
  renderCatalogo();
}
 
/* ──────────────────────────────────────
   FILTRAR POR TEXTO
────────────────────────────────────── */
function filtrarCatalogo(valor) {
  busquedaActual = valor;
  if (valor.trim()) {
    letraActual = 'TODAS';
    document.querySelectorAll('.letra-btn').forEach(b => b.classList.remove('activa'));
  }
  renderCatalogo();
}
 
/* ══════════════════════════════════════════════════════
   MODAL DE DETALLE
══════════════════════════════════════════════════════ */
 
/** Inyecta el HTML del modal y sus estilos en el documento (solo una vez) */
function crearModal() {
  if (document.getElementById('modal-pelicula')) return;
 
  /* ── Estilos del modal ── */
  const style = document.createElement('style');
  style.textContent = `
    /* Overlay */
    #modal-pelicula {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(6px);
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: modalFadeIn 0.25s ease;
    }
    #modal-pelicula.visible {
      display: flex;
    }
    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to   { opacity: 1; transform: scale(1); }
    }
 
    /* Caja */
    .modal-caja {
      background: #111;
      border: 1px solid #2a2a2a;
      border-radius: 10px;
      width: 100%;
      max-width: 820px;
      max-height: 90vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 30px 80px rgba(0,0,0,0.8);
    }
 
    /* Cabecera con trailer embed */
    .modal-trailer-wrap {
      position: relative;
      width: 100%;
      padding-top: 42%; /* 21:9 aprox */
      background: #000;
      border-radius: 10px 10px 0 0;
      overflow: hidden;
    }
    .modal-trailer-wrap iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
    .modal-trailer-placeholder {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #555;
      font-size: 13px;
      letter-spacing: 1px;
      gap: 12px;
    }
    .modal-trailer-placeholder span { font-size: 48px; opacity: 0.15; }
 
    /* Botón cerrar */
    .modal-cerrar {
      position: absolute;
      top: 14px;
      right: 16px;
      background: rgba(0,0,0,0.7);
      border: 1px solid #333;
      color: #fff;
      font-size: 20px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: background 0.2s;
    }
    .modal-cerrar:hover { background: #e50914; border-color: #e50914; }
 
    /* Cuerpo */
    .modal-body {
      padding: 28px 32px 36px;
    }
 
    /* Cabecera info */
    .modal-head {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 20px;
    }
    .modal-inicial {
      width: 64px;
      height: 64px;
      min-width: 64px;
      background: #e50914;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 36px;
      color: #fff;
    }
    .modal-titulo-bloque h2 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 28px;
      letter-spacing: 1px;
      margin: 0 0 6px;
      color: #fff;
    }
    .modal-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      font-size: 12px;
    }
    .modal-badge {
      background: #1e1e1e;
      border: 1px solid #2e2e2e;
      color: #aaa;
      padding: 3px 10px;
      border-radius: 3px;
      font-family: 'Barlow Condensed', sans-serif;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .modal-badge.rojo { background: #1a0000; border-color: #e50914; color: #e50914; }
    .modal-rating {
      color: #f5c518;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
 
    /* Divider */
    .modal-divider {
      border: none;
      border-top: 1px solid #1f1f1f;
      margin: 18px 0;
    }
 
    /* Sinopsis */
    .modal-sinopsis {
      font-family: 'Barlow', sans-serif;
      font-size: 14px;
      line-height: 1.75;
      color: #ccc;
      margin-bottom: 22px;
    }
 
    /* Datos */
    .modal-datos {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 12px;
    }
    .modal-dato {
      background: #161616;
      border: 1px solid #222;
      border-radius: 6px;
      padding: 12px 14px;
    }
    .modal-dato-label {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #555;
      margin-bottom: 4px;
    }
    .modal-dato-valor {
      font-family: 'Barlow', sans-serif;
      font-size: 14px;
      color: #e5e5e5;
      font-weight: 500;
    }
 
    /* Botón trailer externo */
    .modal-btn-trailer {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-top: 22px;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 4px;
      padding: 10px 22px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 14px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .modal-btn-trailer:hover { background: #b0070f; }
 
    /* Hint en card */
    .card-overlay-hint {
      display: none;
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: rgba(229,9,20,0.85);
      color: #fff;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 12px;
      letter-spacing: 2px;
      text-align: center;
      padding: 6px;
      border-radius: 0 0 6px 6px;
      text-transform: uppercase;
    }
    .card { position: relative; cursor: pointer; }
    .card:hover .card-overlay-hint { display: block; }
 
    /* Scroll fino */
    .modal-caja::-webkit-scrollbar { width: 6px; }
    .modal-caja::-webkit-scrollbar-track { background: #111; }
    .modal-caja::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
 
    /* Responsive */
    @media (max-width: 600px) {
      .modal-body { padding: 20px 18px 28px; }
      .modal-head  { flex-direction: column; }
      .modal-datos { grid-template-columns: 1fr 1fr; }
    }
  `;
  document.head.appendChild(style);
 
  /* ── HTML del modal ── */
  const modal = document.createElement('div');
  modal.id = 'modal-pelicula';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="modal-caja" id="modal-caja">
      <button class="modal-cerrar" id="modal-cerrar" aria-label="Cerrar">✕</button>
 
      <div class="modal-trailer-wrap" id="modal-trailer-wrap">
        <div class="modal-trailer-placeholder">
          <span>🎬</span>
          Cargando tráiler…
        </div>
      </div>
 
      <div class="modal-body">
        <div class="modal-head">
          <div class="modal-inicial" id="modal-inicial"></div>
          <div class="modal-titulo-bloque">
            <h2 id="modal-titulo"></h2>
            <div class="modal-meta" id="modal-meta"></div>
          </div>
        </div>
 
        <hr class="modal-divider">
 
        <p class="modal-sinopsis" id="modal-sinopsis"></p>
 
        <div class="modal-datos" id="modal-datos"></div>
 
        <a class="modal-btn-trailer" id="modal-btn-youtube" href="#" target="_blank" rel="noopener">
          ▶ Ver en YouTube
        </a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
 
  /* ── Cerrar con botón o clic fuera ── */
  document.getElementById('modal-cerrar').addEventListener('click', cerrarModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) cerrarModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarModal();
  });
}
 
/** Convierte la URL watch de YouTube en una URL embed */
function youtubeEmbed(url) {
  if (!url) return null;
  // Ya es embed
  if (url.includes('/embed/')) return url;
  // watch?v= o youtu.be/
  const m = url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0` : null;
}
 
/** Abre el modal con los datos de la película */
function abrirModal(p) {
  const modal    = document.getElementById('modal-pelicula');
  const trailerW = document.getElementById('modal-trailer-wrap');
  const inicialEl = document.getElementById('modal-inicial');
  const tituloEl  = document.getElementById('modal-titulo');
  const metaEl    = document.getElementById('modal-meta');
  const sinopsisEl = document.getElementById('modal-sinopsis');
  const datosEl   = document.getElementById('modal-datos');
  const ytBtn     = document.getElementById('modal-btn-youtube');
 
  if (!modal) return;
 
  /* Inicial */
  inicialEl.textContent = p.titulo[0].toUpperCase();
 
  /* Título */
  tituloEl.textContent = p.titulo;
 
  /* Meta badges */
  metaEl.innerHTML = `
    <span class="modal-badge rojo">${p.genero}</span>
    <span class="modal-badge">${p.anio}</span>
    ${p.duracion     ? `<span class="modal-badge">${p.duracion}</span>` : ''}
    ${p.clasificacion ? `<span class="modal-badge">🔞 ${p.clasificacion}</span>` : ''}
    ${p.rating       ? `<span class="modal-rating">★ ${p.rating} / 10</span>` : ''}
  `;
 
  /* Sinopsis */
  sinopsisEl.textContent = p.sinopsis || 'Sin sinopsis disponible.';
 
  /* Datos adicionales */
  const campos = [
    { label: 'Director',       valor: p.director },
    { label: 'Año',            valor: p.anio },
    { label: 'Duración',       valor: p.duracion },
    { label: 'Clasificación',  valor: p.clasificacion },
    { label: 'Puntuación',     valor: p.rating ? `${p.rating} / 10  ${estrellas(p.rating)}` : null },
  ].filter(c => c.valor);
 
  datosEl.innerHTML = campos.map(c => `
    <div class="modal-dato">
      <div class="modal-dato-label">${c.label}</div>
      <div class="modal-dato-valor">${c.valor}</div>
    </div>
  `).join('');
 
  /* Tráiler embed */
  const embedUrl = youtubeEmbed(p.trailer);
  if (embedUrl) {
    trailerW.innerHTML = `<iframe src="${embedUrl}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
  } else {
    trailerW.innerHTML = `
      <div class="modal-trailer-placeholder">
        <span>🎬</span>
        Tráiler no disponible
      </div>`;
  }
 
  /* Botón YouTube externo */
  if (p.trailer) {
    ytBtn.href = p.trailer.replace('/embed/', '/watch?v=').replace('?autoplay=1&rel=0', '');
    ytBtn.style.display = 'inline-flex';
  } else {
    ytBtn.style.display = 'none';
  }
 
  /* Mostrar */
  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';
 
  // Scroll al inicio del modal
  document.getElementById('modal-caja').scrollTop = 0;
}
 
/** Cierra el modal y para el video */
function cerrarModal() {
  const modal    = document.getElementById('modal-pelicula');
  const trailerW = document.getElementById('modal-trailer-wrap');
  if (!modal) return;
 
  modal.classList.remove('visible');
  document.body.style.overflow = '';
 
  // Detener iframe para parar el audio
  trailerW.innerHTML = `
    <div class="modal-trailer-placeholder">
      <span>🎬</span>
    </div>`;
}