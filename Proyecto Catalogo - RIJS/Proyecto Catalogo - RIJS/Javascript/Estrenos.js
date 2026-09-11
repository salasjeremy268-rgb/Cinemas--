/* ══════════════════════════════════════════════════════
   Estrenos.js — Cinemas
   Alimentado por Estrenos.json
══════════════════════════════════════════════════════ */

let datos = null;

fetch('../JSON/Estrenos.json')
  .then(res => res.json())
  .then(json => {
    datos = json;
    renderDestacado();
    renderGrid('todos');
    renderTimeline();
    crearModal();
  });

/* ──────────────────────────────────────
   FEATURED (estreno de la semana)
────────────────────────────────────── */
function renderDestacado() {
  const d = datos.destacado;
  const wrap = document.querySelector('.featured-wrap');
  if (!wrap) return;

  wrap.innerHTML = `
    <div class="featured-card" onclick="abrirModal(datos.destacado)" style="cursor:pointer;">
      <div class="featured-poster">
        <span class="inicial">${d.titulo[0]}</span>
      </div>
      <div class="featured-info">
        <div class="featured-badge">
          <span class="badge-nuevo">Nuevo</span>
          <span class="badge-fecha">${d.fecha}</span>
        </div>
        <h3>${d.titulo}</h3>
        <div class="featured-meta">
          <span class="meta-item">${d.duracion}</span>
          <span class="meta-sep"></span>
          <span class="meta-item">${d.director}</span>
          <span class="meta-sep"></span>
          <span class="meta-item">${d.clasificacion}</span>
        </div>
        <p class="featured-desc">${d.sinopsis}</p>
        <div class="featured-generos">
          ${d.generos.map(g => `<span class="genero-tag">${g}</span>`).join('')}
        </div>
        <div class="featured-actions">
          <button class="btn-primario" onclick="event.stopPropagation(); abrirModal(datos.destacado)">▶ Ver tráiler</button>
        </div>
      </div>
    </div>
  `;
}

/* ──────────────────────────────────────
   GRID EN CARTELERA
────────────────────────────────────── */
function renderGrid(filtro) {
  const grid = document.getElementById('grid-estrenos');
  const items = filtro === 'todos'
    ? datos.enCartelera
    : datos.enCartelera.filter(e => e.categoria === filtro);

  grid.innerHTML = items.map((e, i) => `
    <div class="estreno-card" style="animation-delay:${i * 0.06}s" onclick="abrirModal(datos.enCartelera[${datos.enCartelera.indexOf(e)}])">
      <div class="estreno-poster">
        <span class="ribbon estreno-ribbon">Estreno</span>
        <span class="inicial">${e.titulo[0]}</span>
        <span class="icono">🎬</span>
      </div>
      <div class="estreno-info">
        <div class="estreno-fecha">${e.fecha}</div>
        <div class="estreno-titulo" title="${e.titulo}">${e.titulo}</div>
        <div class="estreno-genero">${e.genero}</div>
      </div>
    </div>
  `).join('');
}

/* ──────────────────────────────────────
   TIMELINE PRÓXIMAMENTE
────────────────────────────────────── */
function renderTimeline() {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;

  timeline.innerHTML = datos.proximamente.map((p, i) => `
    <div class="timeline-item" onclick="abrirModal(datos.proximamente[${i}])" style="cursor:pointer;">
      <div class="timeline-fecha">
        ${p.fecha}
        <span class="año">${p.anio}</span>
      </div>
      <div class="timeline-pelicula">
        <h4>${p.titulo}</h4>
        <p>${p.descripcion}</p>
        <div class="timeline-tags">
          ${p.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ──────────────────────────────────────
   FILTRO (botones del HTML)
────────────────────────────────────── */
function filtrar(cat, btn) {
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
  btn.classList.add('activo');
  renderGrid(cat);
}

/* ══════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════ */
function crearModal() {
  if (document.getElementById('modal-estreno')) return;

  const style = document.createElement('style');
  style.textContent = `
    #modal-estreno {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(6px);
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    #modal-estreno.visible { display: flex; }

    .modal-caja {
      background: #111;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      width: 100%;
      max-width: 780px;
      max-height: 88vh;
      overflow-y: auto;
      position: relative;
    }

    .modal-trailer {
      width: 100%;
      padding-top: 42%;
      position: relative;
      background: #000;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
    }
    .modal-trailer iframe {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      border: none;
    }

    .modal-cerrar {
      position: absolute;
      top: 12px; right: 12px;
      z-index: 10;
      background: rgba(0,0,0,0.7);
      border: 1px solid #333;
      color: #fff;
      width: 34px; height: 34px;
      border-radius: 50%;
      font-size: 16px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .modal-cerrar:hover { background: #e50914; border-color: #e50914; }

    .modal-body { padding: 24px 28px 32px; }

    .modal-titulo {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 26px;
      color: #fff;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }

    .modal-meta {
      display: flex; flex-wrap: wrap; gap: 8px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 12px;
      color: #777;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .modal-meta span { border: 1px solid #222; padding: 2px 10px; border-radius: 3px; }
    .modal-meta .rojo { border-color: #e50914; color: #e50914; }

    .modal-sinopsis {
      font-family: 'Barlow', sans-serif;
      font-size: 14px;
      line-height: 1.75;
      color: #bbb;
      margin-bottom: 20px;
    }

    .modal-btn-yt {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #e50914;
      color: #fff;
      border: none;
      border-radius: 3px;
      padding: 10px 22px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 13px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.2s;
    }
    .modal-btn-yt:hover { background: #b0070f; }

    .estreno-card { cursor: pointer; }
    .timeline-item:hover { background: rgba(229,9,20,0.04); }
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.id = 'modal-estreno';
  modal.innerHTML = `
    <div class="modal-caja">
      <button class="modal-cerrar" onclick="cerrarModal()">✕</button>
      <div class="modal-trailer" id="modal-trailer"></div>
      <div class="modal-body">
        <div class="modal-titulo" id="modal-titulo"></div>
        <div class="modal-meta" id="modal-meta"></div>
        <p class="modal-sinopsis" id="modal-sinopsis"></p>
        <a class="modal-btn-yt" id="modal-btn-yt" href="#" target="_blank" rel="noopener">▶ Ver en YouTube</a>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', e => { if (e.target === modal) cerrarModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarModal(); });
}

function abrirModal(p) {
  const modal = document.getElementById('modal-estreno');
  if (!modal) return;

  document.getElementById('modal-titulo').textContent = p.titulo;

  // Meta: género, director, duración, clasificacion
  const meta = [];
  if (p.genero)        meta.push(`<span class="rojo">${p.genero}</span>`);
  if (p.tags)          meta.push(`<span class="rojo">${p.tags.join(' · ')}</span>`);
  if (p.director)      meta.push(`<span>${p.director}</span>`);
  if (p.duracion)      meta.push(`<span>${p.duracion}</span>`);
  if (p.clasificacion) meta.push(`<span>${p.clasificacion}</span>`);
  if (p.fecha)         meta.push(`<span>${p.fecha}${p.anio ? ' ' + p.anio : ''}</span>`);
  document.getElementById('modal-meta').innerHTML = meta.join('');

  document.getElementById('modal-sinopsis').textContent = p.sinopsis || p.descripcion || '';

  // Tráiler embed
  const trailerEl = document.getElementById('modal-trailer');
  if (p.trailer) {
    trailerEl.innerHTML = `<iframe src="${p.trailer}?rel=0" allowfullscreen allow="autoplay; encrypted-media"></iframe>`;
    const ytUrl = p.trailer.replace('/embed/', '/watch?v=').replace(/\?.*/, '');
    document.getElementById('modal-btn-yt').href = ytUrl;
    document.getElementById('modal-btn-yt').style.display = 'inline-flex';
  } else {
    trailerEl.innerHTML = '';
    document.getElementById('modal-btn-yt').style.display = 'none';
  }

  modal.classList.add('visible');
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  const modal = document.getElementById('modal-estreno');
  modal.classList.remove('visible');
  document.body.style.overflow = '';
  document.getElementById('modal-trailer').innerHTML = '';
}