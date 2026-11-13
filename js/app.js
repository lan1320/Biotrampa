'use strict';
/* BioTrampa 1.4 - JS clásico (sin módulos) para poder abrir index.html directamente. */
const $ = s => document.querySelector(s);
/* ---------- Íconos (trazos al estilo de Obsidian/Lucide, dibujados aquí: sin internet) ---------- */
const IC = {
  folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  folderPlus: '<path d="M12 10v6"/><path d="M9 13h6"/><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  search: '<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.3-4.3"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  panel: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  share: '<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="m16 6-4-4-4 4"/><path d="M12 2v13"/>',
  sort: '<path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/>',
  fold: '<path d="m7 20 5-5 5 5"/><path d="m7 4 5 5 5-5"/>',
  updown: '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
  filter: '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  chart: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  sheet: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/><path d="M18 8h.01"/><path d="M8 12h.01"/><path d="M12 12h.01"/><path d="M16 12h.01"/><path d="M7 16h10"/>',
  cap: '<path d="M21.42 10.92a1 1 0 0 0-.02-1.84L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.83l8.57 3.91a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  left: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  right: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 17a5 5 0 0 0 0-10v10z"/>',
  image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>',
  cam: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>', // 1.4.10: título Estaciones
  ind: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>', // 1.4.10: Individuos (barra y visor)
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  chevL: '<path d="m15 18-6-6 6-6"/>',
  chevR: '<path d="m9 18 6-6-6-6"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6"/><path d="M12 17h.01"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  pen: '<path d="M4 20l4-1L19 8l-3-3L5 16l-1 4z"/><path d="m14 7 3 3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',
  trash: '<path d="M5 7h14M7 7l1 13h8l1-13M10 7V4h4v3"/>', erase: '<path d="M20 20H9l-5-5L14 5l6 6-9 9"/><path d="m8 11 6 6"/>', move: '<path d="M12 3v18M3 12h18M12 3 9.5 5.5M12 3l2.5 2.5M12 21l-2.5-2.5M12 21l2.5-2.5M3 12l2.5-2.5M3 12l2.5 2.5M21 12l-2.5-2.5M21 12l-2.5 2.5"/>', crop: '<path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4"/>',
  split: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 3v18"/>',
  clip: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 11.5h6M9 15h6"/>'
};
const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;
document.querySelectorAll('[data-ic]').forEach(e => { e.innerHTML = icon(e.dataset.ic); });
const ROOT = 'Clasificadas', REG = '.biotrampa.json'; let GH = 'Fantasmas';
const DEF = [], SCI = {}; // 1.4.13: sin especies de ejemplo; solo Fantasmas (GH), que no es una especie
const SEX = ['', 'Macho', 'Hembra', 'Desconocido'], AGE = ['', 'Adulto', 'Juvenil', 'Cría', 'Desconocido'];
const BEH = ['Alimentándose', 'Caminando', 'Corriendo', 'Descansando', 'Mirando a la cámara', 'Olfateando', 'Bebiendo', 'Interacción social'];
const LETTERS = 'ABDEGIJKOQSTVWXYZ'; // F, H, U, N, C, R, M, L y P están reservadas
// Lista de ejemplo para empezar sin escribir todo (mamíferos y aves frecuentes en cámaras trampa del noreste de México)
const NE_LIST = [['Venado cola blanca', 'Odocoileus virginianus'], ['Pecarí de collar', 'Pecari tajacu'], ['Coyote', 'Canis latrans'], ['Zorra gris', 'Urocyon cinereoargenteus'], ['Gato montés', 'Lynx rufus'], ['Puma', 'Puma concolor'],
  ['Oso negro', 'Ursus americanus'], ['Mapache', 'Procyon lotor'], ['Coatí', 'Nasua narica'], ['Cacomixtle', 'Bassariscus astutus'], ['Tlacuache', 'Didelphis virginiana'], ['Armadillo', 'Dasypus novemcinctus'],
  ['Zorrillo de espalda blanca', 'Conepatus leuconotus'], ['Zorrillo listado', 'Mephitis macroura'], ['Tejón', 'Taxidea taxus'], ['Jaguarundi', 'Herpailurus yagouaroundi'], ['Ocelote', 'Leopardus pardalis'],
  ['Liebre cola negra', 'Lepus californicus'], ['Conejo serrano', 'Sylvilagus floridanus'], ['Ardilla de las rocas', 'Otospermophilus variegatus'], ['Guajolote silvestre', 'Meleagris gallopavo'],
  ['Correcaminos', 'Geococcyx californianus'], ['Codorniz cotuí', 'Colinus virginianus'], ['Aves (otras)', ''], ['Ganado', 'Bos taurus'], ['Perro doméstico', 'Canis familiaris'], ['Personas', 'Homo sapiens'], ['Otros animales', ''], ['Sin identificar', '']];
const ls = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
GH = ls('bt_gh', 'Fantasmas');
const S = { srcs: [], pending: [], proj: null, mapCfg: null, stations: {}, presets: ls('bt_presets', []), revMode: false, rate: [], empty: null, ro: false, busy: false, items: [], view: [], sig: null, cur: null, act: null, multi: new Set(), cats: ls('bt_cats', DEF), keys: ls('bt_keys', {}), sci: Object.assign({}, SCI, ls('bt_sci', {})), offsets: {},
  f: { q: '', st: 'all', cat: 'all', dn: 'all', moon: 'all', src: null }, reg: {}, hist: [], redo: [], groups: new Map(), sort: ls('bt_sort', 'date'), burst: ls('bt_burst', 10),
  spSort: ls('bt_spsort', 'keys'), created: ls('bt_created', {}), used: ls('bt_used', {}), split: new Set(ls('bt_split', [])), vkeep: ls('bt_vkeep', {}), kf: null };
const folder = c => c.trim().replace(/[\\/:*?"<>|.]/g, '').replace(/\s+/g, '_');
function toast(m, ms = 4000, undoBtn = false) { // undoBtn: muestra un botón "Deshacer" dentro del aviso
  const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toast.t);
  if (undoBtn && S.hist.length) { const b = document.createElement('button'); b.textContent = 'Deshacer'; b.className = 'tundo'; b.onclick = e => { e.stopPropagation(); t.hidden = true; locked(undo); }; t.appendChild(b); ms = Math.max(ms, 6000); }
  if (ms) toast.t = setTimeout(() => t.hidden = true, ms);
}
/* ---------- Animaciones de entrada y salida de ventanas ----------
   Se vigila el atributo "hidden": al mostrarse, la ventana se dibuja invisible (.bt-pre) y se anima desde el cuadro siguiente;
   al ocultarse, la lógica de la app ya la da por cerrada, pero .bt-out la deja verse mientras se desvanece. */
const MOTION = !matchMedia('(prefers-reduced-motion: reduce)').matches;
function animIn(el) { clearTimeout(el._btT); el.classList.remove('bt-out'); el.classList.add('bt-pre'); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('bt-pre'))); }
function animOut(el) { el.classList.remove('bt-pre'); el.classList.add('bt-out'); clearTimeout(el._btT); el._btT = setTimeout(() => el.classList.remove('bt-out'), 240); }
function watchAnim(els) { if (!MOTION) return; const mo = new MutationObserver(ms => { for (const m of ms) { const el = m.target, was = m.oldValue !== null; if (was === el.hidden) continue; el.hidden ? animOut(el) : animIn(el); } });
  els.forEach(el => { mo.observe(el, { attributes: true, attributeFilter: ['hidden'], attributeOldValue: true }); el.addEventListener('animationend', e => { if (e.target === el && el.hidden) el.classList.remove('bt-out'); }); }); }
const pad = n => String(n).padStart(2, '0');
const ymd = d => { d = new Date(d); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }; // fecha LOCAL (no UTC)
const hms = d => { d = new Date(d); return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; };
const norm = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); // sin acentos ni mayúsculas
const relPath = it => [...it.parts, it.name].join('/'); // ruta dentro de la carpeta de su estación
const pathOf = it => (it.src ? it.src.label + '/' : '') + relPath(it); // estación/ruta (única en todo el proyecto)
const srcOf = it => (it.src ? it.src.label : '') + '|' + (it.origParts || it.parts).join('/'); // carpeta de origen (cámara)
const station = it => it.src ? (it.src.pair || it.src.label) : '(sin estación)'; // cada carpeta agregada es una estación (o la mitad de un par de cámaras)
const camOf = it => it.src ? it.src.label : ''; // la cámara (carpeta) de la foto
const catsTxt = it => S.blind ? (it.bl ? 'a ciegas: ' + it.bl : 'sin respuesta a ciegas') : (allCats(it).join(' + ') || 'pendiente'); // en la revisión a ciegas no se muestra la clasificación
const allCats = it => it.cat ? [it.cat, ...(it.extras || []).map(x => x.cat)] : [];
const hasCat = (it, c) => it.cat === c || (it.extras || []).some(x => x.cat === c);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------- Tema ---------- */
// Sin elección guardada se sigue el modo del sistema (y cambia con él); al pulsar el botón se recuerda lo elegido
function setTheme(t, keep = true) { document.documentElement.dataset.theme = t; const dark = t === 'dark'; document.querySelectorAll('.themebtn').forEach(b => { b.innerHTML = '<i class="ic">' + icon(dark ? 'sun' : 'moon') + '</i>'; b.title = dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'; b.setAttribute('aria-label', b.title); }); if (keep) sv('bt_theme', t); }
const sysDark = matchMedia('(prefers-color-scheme:dark)');
setTheme(ls('bt_theme', sysDark.matches ? 'dark' : 'light'), false);
sysDark.addEventListener('change', e => { if (!ls('bt_theme', null)) setTheme(e.matches ? 'dark' : 'light', false); });
document.querySelectorAll('.themebtn').forEach(b => b.onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));

/* ---------- EXIF (JPEG): fecha, modelo, GPS ---------- */
function exif(buf) {
  const v = new DataView(buf), r = {};
  try {
    if (v.getUint16(0) !== 0xFFD8) return r;
    let o = 2;
    while (o < v.byteLength - 10) {
      const m = v.getUint16(o);
      if (m === 0xFFE1 && v.getUint32(o + 4) === 0x45786966) { tiff(v, o + 10, r); break; }
      if ((m & 0xFF00) !== 0xFF00) break;
      o += 2 + v.getUint16(o + 2);
    }
  } catch (e) {}
  return r;
}
function tiff(v, t, r) {
  const le = v.getUint16(t) === 0x4949, u16 = p => v.getUint16(p, le), u32 = p => v.getUint32(p, le);
  const ifd = off => { const m = {}, p = t + off, n = u16(p);
    for (let i = 0; i < n; i++) { const e = p + 2 + i * 12, ty = u16(e + 2), c = u32(e + 4), sz = ([0, 1, 1, 2, 4, 8][ty] || 0) * c; m[u16(e)] = { c, o: sz > 4 ? t + u32(e + 8) : e + 8 }; }
    return m; };
  // muchas cámaras rellenan el texto con bytes nulos: se quitan para que no lleguen al CSV
  const str = d => { let s = ''; for (let i = 0; i < d.c; i++) s += String.fromCharCode(v.getUint8(d.o + i)); return s.replace(/\0/g, ' ').trim(); };
  const rat = (d, i) => u32(d.o + i * 8) / (u32(d.o + i * 8 + 4) || 1);
  const i0 = ifd(u32(t + 4));
  if (i0[0x110]) r.model = str(i0[0x110]) || undefined;
  if (i0[0x8769]) { const e = ifd(u32(i0[0x8769].o)), d = e[0x9003] || e[0x9004];
    if (d) { const m = str(d).match(/(\d{4}):(\d\d):(\d\d) (\d\d:\d\d:\d\d)/); if (m) { r.date = `${m[1]}-${m[2]}-${m[3]}`; r.time = m[4]; } } }
  if (i0[0x8825]) { const g = ifd(u32(i0[0x8825].o));
    if (g[2] && g[4]) { const cv = d => rat(d, 0) + rat(d, 1) / 60 + rat(d, 2) / 3600;
      let la = cv(g[2]), lo = cv(g[4]);
      if (g[1] && str(g[1]) === 'S') la = -la; if (g[3] && str(g[3]) === 'W') lo = -lo;
      if (isFinite(la) && isFinite(lo) && (la || lo)) { r.lat = la.toFixed(6); r.lon = lo.toFixed(6); } } }
}
async function loadMeta(it) {
  if (it.meta) return it.meta;
  try {
    const f = await it.h.getFile(); it.size = f.size; it.mod = f.lastModified; if (!it.origMod && !it.cat) it.origMod = f.lastModified;
    it.meta = /jpe?g$/i.test(it.name) ? exif(await f.slice(0, 262144).arrayBuffer()) : isVideo(it.name) ? await videoMeta(f) : {};
  } catch (e) { it.meta = {}; }
  return it.meta;
}
const modOf = it => it.origMod || it.mod; // fecha de modificación ORIGINAL (antes de clasificar)
// Fecha de grabación de videos MP4/MOV: caja "mvhd" (segundos desde 1904, UTC según el estándar)
async function videoMeta(f) {
  const r = {}, look = async (a, b) => { const v = new DataView(await f.slice(a, b).arrayBuffer());
    for (let i = 4; i < v.byteLength - 24; i++) if (v.getUint32(i) === 0x6d766864) { const ver = v.getUint8(i + 4), secs = ver === 1 ? v.getUint32(i + 12) * 4294967296 + v.getUint32(i + 16) : v.getUint32(i + 8); return secs; } return 0; };
  try { let secs = await look(0, Math.min(f.size, 4e6)); if (!secs && f.size > 4e6) secs = await look(f.size - 4e6, f.size);
    if (secs > 2082844800 + 946684800) { const d = new Date((secs - 2082844800) * 1000); r.date = ymd(d); r.time = hms(d); r.video = true; } } catch (e) {}
  return r;
}
async function loadAllMeta(list) {
  let i = 0, n = 0; const tot = list.length;
  const worker = async () => { while (i < tot) { const it = list[i++]; await loadMeta(it); if (++n % 40 === 0) toast(`Leyendo fechas de captura… ${n}/${tot}`, 0); } };
  await Promise.all([worker(), worker(), worker(), worker()]);
}
const needMeta = () => S.sort === 'date' || S.burst || S.f.dn !== 'all' || S.f.st === 'susp';
async function prepare(force) { if (!S.items.length || !(force || needMeta())) return; if (S.items.every(i => i.meta)) return; await loadAllMeta(S.items); $('#toast').hidden = true; }

/* ---------- Hora de captura y corrección del reloj por estación ---------- */
const offOf = it => S.offsets[camOf(it)] || 0; // segundos (corrección de la hora de cada cámara)
const capTs = it => it.meta && it.meta.date ? Date.parse(it.meta.date + 'T' + it.meta.time) : NaN; // hora EXIF (local)
const fixTs = it => capTs(it) + offOf(it) * 1000; // hora corregida
const offTxt = s => s ? (s < 0 ? 'restar ' : 'sumar ') + fmtOff(s).slice(1) : ''; // para CSV (sin + inicial, que Excel tomaría como fórmula)
const fmtOff = s => { if (!s) return ''; const a = Math.abs(s), h = Math.floor(a / 3600), m = Math.floor(a % 3600 / 60), x = a % 60; return (s < 0 ? '−' : '+') + `${pad(h)}:${pad(m)}:${pad(x)}`; };
/* Salida y puesta del sol (sin internet), con la posición GPS de la foto o de su estación.
   La hora de la cámara se interpreta en la zona horaria de esta computadora. */
const RAD = Math.PI / 180;
function sunTimes(ts, lat, lon) {
  const d = new Date(ts), J0 = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12) / 864e5 + 2440587.5;
  const n = Math.round(J0 - 2451545 + 0.0008), Js = n - lon / 360, M = (357.5291 + 0.98560028 * Js) % 360;
  const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD), L = (M + C + 180 + 102.9372) % 360;
  const Jt = 2451545 + Js + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * L * RAD), dec = Math.asin(Math.sin(L * RAD) * Math.sin(23.4397 * RAD));
  const cw = (Math.sin(-0.833 * RAD) - Math.sin(lat * RAD) * Math.sin(dec)) / (Math.cos(lat * RAD) * Math.cos(dec));
  if (cw < -1 || cw > 1) return null; const w = Math.acos(cw) / RAD / 360, ms = j => (j - 2440587.5) * 864e5;
  return { rise: ms(Jt - w), set: ms(Jt + w) };
}
function coordsOf(it) {
  if (it.meta && it.meta.lat) return [+it.meta.lat, +it.meta.lon];
  const st = S.stations[station(it)]; if (st && st.lat !== '' && st.lat != null && st.lon !== '' && st.lon != null && isFinite(+st.lat) && isFinite(+st.lon)) return [+st.lat, +st.lon];
  return null;
}
function sunOf(it) { const t = fixTs(it), c = coordsOf(it); if (isNaN(t) || !c) return null; return sunTimes(t, c[0], c[1]); }
// Periodo: crepúsculo = desde 1 h antes hasta 1 h después de la salida o la puesta del sol. Sin GPS: horario fijo aproximado.
function period(it) {
  const t = fixTs(it); if (isNaN(t)) return null; const s = sunOf(it), H = 3600e3;
  if (s) { if (Math.abs(t - s.rise) <= H || Math.abs(t - s.set) <= H) return 'crep'; return t > s.rise && t < s.set ? 'day' : 'night'; }
  const h = new Date(t).getHours(); return h >= 6 && h < 8 || h >= 18 && h < 20 ? 'crep' : h >= 8 && h < 18 ? 'day' : 'night';
}
const PER = { day: 'día', crep: 'crepúsculo', night: 'noche' };
const isNight = it => { const p = period(it); return p === null ? null : p === 'night'; };
// Fase lunar por fecha (algoritmo astronómico simple; luna nueva de referencia: 6 ene 2000)
function moonOf(ts) {
  const syn = 29.530588853, age = (((ts / 864e5 + 2440587.5 - 2451550.1) % syn) + syn) % syn, ill = Math.round((1 - Math.cos(2 * Math.PI * age / syn)) / 2 * 100);
  const names = ['Luna nueva', 'Creciente', 'Cuarto creciente', 'Gibosa creciente', 'Luna llena', 'Gibosa menguante', 'Cuarto menguante', 'Menguante'];
  return { name: names[Math.floor((age / syn) * 8 + 0.5) % 8], ill, age: +age.toFixed(1) };
}
// Fechas sospechosas: cámara mal configurada (antes de 2005, en el futuro o fuera de las fechas de instalación y retiro)
const badDate = it => { const t = fixTs(it); return !isNaN(t) && (new Date(t).getFullYear() < 2005 || t > Date.now() + 864e5); };
const goodTs = it => !isNaN(capTs(it)) && !badDate(it); // fecha utilizable para análisis
function suspect(it) {
  const t = fixTs(it); if (isNaN(t)) return false; if (badDate(it)) return true;
  const st = S.stations[station(it)]; if (st) { if (st.start && ymd(t) < st.start) return true; if (st.end && ymd(t) > st.end) return true; }
  return false;
}

// Clave de orden: fecha EXIF; si no existe, la fecha de modificación (solo para ordenar, nunca se exporta como captura)
const dkey = it => it.meta && it.meta.date ? it.meta.date + ' ' + it.meta.time : (modOf(it) ? new Date(modOf(it) - new Date().getTimezoneOffset() * 60000).toISOString().replace('T', ' ').slice(0, 19) : '~');
function buildGroups() {
  S.groups = new Map(); if (!S.burst) return; const thr = S.burst * 1000; let cur = [];
  const flush = () => { if (cur.length > 1) cur.forEach(i => S.groups.set(i, cur)); cur = []; };
  // misma ráfaga = misma carpeta de origen (cámara) + mismo modelo + pocos segundos de diferencia
  for (const it of S.view) { const l = cur[cur.length - 1], d = l ? capTs(it) - capTs(l) : NaN;
    if (l && !S.split.has(skey(it)) && d >= 0 && d <= thr && srcOf(l) === srcOf(it) && (!l.meta.model || !it.meta.model || l.meta.model === it.meta.model)) cur.push(it); else { flush(); cur = [it]; } }
  flush();
}
const groupOf = it => S.groups.get(it) || [it];
// Ráfagas separadas a mano: la foto marcada empieza una ráfaga nueva (clave estable aunque la foto se mueva al clasificarla)
const skey = it => camOf(it) + '|' + (it.origName || it.name);
function splitBurst(items) { items.forEach(i => S.split.add(skey(i))); sv('bt_split', [...S.split]); S.sig = null; applyFilters(); }

/* ---------- Teclas de especie: 1-9 para las primeras nueve, letras para las demás ---------- */
function keyOf(c) {
  if (c === GH) return 'F'; const i = S.cats.indexOf(c); if (i < 0) return ''; if (i < 9) return String(i + 1);
  if (S.keys[c] && !S.cats.slice(0, 9).includes(c)) return S.keys[c];
  const used = new Set(S.cats.slice(9).map(x => S.keys[x]).filter(Boolean)); let k = 0;
  for (const x of S.cats.slice(9)) { if (S.keys[x]) continue; while (k < LETTERS.length && used.has(LETTERS[k])) k++; if (x === c) return LETTERS[k] || ''; k++; }
  return '';
}
const catByKey = k => [GH, ...S.cats].find(c => keyOf(c) === k);

/* ---------- Candado: una sola operación con archivos a la vez ---------- */
// Evita que un doble clic, una tecla mantenida o dos teclas rápidas muevan la misma foto dos veces a la vez.
async function locked(fn) {
  if (S.busy) { toast('Espera: todavía se está moviendo una foto…', 1500); return; }
  S.busy = true; const t = setTimeout(() => toast('Moviendo…', 0), 1500); // solo se avisa si tarda de verdad (disco lento o tarjeta SD)
  try { return await fn(); } finally { clearTimeout(t); S.busy = false; }
}

/* ---------- Deshacer: cada paso guarda [foto, especie anterior, especies adicionales anteriores] ---------- */
const updUndo = () => { $('#undo').disabled = !S.hist.length; $('#redo').disabled = !S.redo.length; };
function pushHist(ch) { if (S.undoing || !ch.length) return; S.hist.push(ch); if (S.hist.length > 100) S.hist.shift(); S.redo = []; updUndo(); } // una acción nueva borra lo que se podía rehacer
const snap = it => [it, it.cat, (it.extras || []).map(x => x.cat)];
// Devuelve cada foto al estado guardado y regresa el estado que tenían (para poder rehacer o volver a deshacer)
async function restore(op, word) {
  const valid = c => c === GH || S.cats.includes(c); let skipped = 0; const bad = [], inv = [];
  S.undoing = true;
  try {
    for (const [it, prev, px] of op) {
      const before = snap(it);
      try {
        if (prev) { if (!valid(prev)) { skipped++; continue; } if (it.cat !== prev) await classifyOne(it, prev); await setExtras(it, (px || []).filter(valid)); }
        else if (it.cat) await unclassifyOne(it);
        inv.push(before); if (op.length > 1) saveReg();
      } catch (e) { bad.push(`${it.name}: ${e.message}`); }
    }
  } finally { S.undoing = false; }
  saveReg(); applyFilters(op.map(x => x[0]));
  if (!$('#lb').hidden && S.view.includes(op[0][0])) show(op[0][0]); else if (S.cur) show(S.cur);
  toast(bad.length ? `No se pudo ${word.toLowerCase()} todo: ${bad[0]}` : skipped ? `${word === 'Deshacer' ? 'Deshecho' : 'Rehecho'}, pero ${skipped} foto(s) no se restauraron porque su categoría ya no existe.` : (word === 'Deshacer' ? 'Deshecho.' : 'Rehecho.'), bad.length ? 8000 : 2500);
  return inv;
}
async function undo() { if (S.blind) return toast('En la revisión a ciegas no se usa Deshacer: vuelve a elegir la especie o pulsa U.', 4000); const op = S.hist.pop(); updUndo(); if (!op) return toast('No hay nada que deshacer.'); const inv = await restore(op, 'Deshacer'); if (inv.length) S.redo.push(inv); updUndo(); }
async function redo() { if (S.blind) return; const op = S.redo.pop(); updUndo(); if (!op) return toast('No hay nada que rehacer.'); const inv = await restore(op, 'Rehacer'); if (inv.length) S.hist.push(inv); updUndo(); }
$('#undo').onclick = () => locked(undo); $('#redo').onclick = () => locked(redo);

/* ---------- Estaciones y proyectos ----------
   Cada carpeta agregada es UNA estación (todo lo que tiene dentro, con sus subcarpetas, pertenece a ella).
   Las fotos clasificadas se mueven a <carpeta de la estación>/Clasificadas/<Especie>/: nunca salen de su carpeta.
   Cada carpeta guarda su propio registro (.biotrampa.json): nombre de la estación, sus datos, corrección de hora y datos de cada foto.
   El proyecto (grupo de carpetas, nombre y mapa) se recuerda en este navegador. */
async function readJson(dir, name) { try { return JSON.parse(await (await (await dir.getFileHandle(name)).getFile()).text()); } catch (e) { return null; } }
const projName = () => S.proj ? S.proj.name : (S.srcs[0] ? S.srcs[0].label : 'BioTrampa');
async function loadSrcReg(src) {
  src.reg = {}; src.regExists = false; if (!src.h || !src.h.getFileHandle) return;
  let j = await readJson(src.h, REG);
  if (!j) { j = await readJson(src.h, REG + '.tmp'); if (j) { src.regTmp = true; console.info('Registro recuperado de ' + REG + '.tmp en ' + src.name); } } // se cerró mientras se creaba
  if (!j) { // migración desde la versión 0.2 (Clasificadas/.biotrampa.json)
    try { const v1 = await readJson(await src.h.getDirectoryHandle(ROOT), REG); if (v1 && v1.files) { j = { files: {} }; for (const [k, v] of Object.entries(v1.files)) j.files[ROOT + '/' + k] = v; } } catch (e) {}
  } else src.regExists = true;
  if (!j) return;
  src.reg = j.files || {}; if (j.nombre) src.label = String(j.nombre);
  let st = j.estacion || null, off = j.hora || 0; // versiones anteriores: datos por subcarpeta; si solo había una, se adopta
  if (!st && j.stations) { const v = Object.values(j.stations); if (v.length === 1) st = v[0]; }
  if (!off && j.offsets) { const v = Object.values(j.offsets); if (v.length === 1) off = v[0]; }
  src._st = st; src._off = off; if (j.mapa && !S.mapCfg) S.mapCfg = { b: j.mapa.b || null, m: j.mapa.m || {} };
  if (j.sci) { Object.assign(S.sci, j.sci); sv('bt_sci', S.sci); }
  if (j.par) src.pair = String(j.par); // cámara en par: comparte estación con otra carpeta
}
let regRun = null, regAgain = false;
function saveReg() { // en segundo plano, en orden y sin escrituras simultáneas (registro de cada carpeta y proyecto)
  if (S.ro || !S.srcs.length) return;
  if (regRun) { regAgain = true; return regRun; }
  regRun = (async () => { do { regAgain = false; for (const src of S.srcs) await writeReg(src); await saveIndFiles(); await saveProj(); } while (regAgain); regRun = null; })();
  return regRun;
}
function regEntry(it) {
  const e = {};
  if (it.cat && it.parts[0] === ROOT) { e.o = it.origParts ? [...it.origParts, it.origName].join('/') : null; e.m = it.origMod || null; e.c = it.cls || ''; }
  if (it.extras && it.extras.length) { // copias de versiones anteriores (archivo) y, desde la 1.0, especies adicionales solo anotadas (sin archivo)
    const cp = it.extras.filter(x => x.parts).map(x => ({ p: [...x.parts, x.name].join('/'), c: x.cat })), tg = it.extras.filter(x => !x.parts).map(x => x.cat);
    if (cp.length) e.x = cp; if (tg.length) e.xt = tg; }
  if (it.note) e.n = it.note;
  const obs = {}; for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (o && Object.values(o).some(v => v !== '' && v != null)) obs[c] = o; } // también flanco, calidad, rosetas… del individuo
  if (Object.keys(obs).length) e.obs = obs;
  if (it.rev) { e.rv = 1; if (it.revWhy) e.rw = it.revWhy; } if (it.ver) { e.vf = it.ver; if (it.verBy) e.vb = it.verBy; }
  if (it.bl) { e.bl = it.bl; if (it.bb) e.bb = it.bb; if (it.br) e.br = it.br; } // doble revisión a ciegas
  return Object.keys(e).length ? e : null;
}
async function writeReg(src) {
  if (!src.h || !src.h.getFileHandle) return;
  const files = {}; for (const it of S.items) { if (it.src !== src) continue; const e = regEntry(it); if (e) files[relPath(it)] = e; }
  const sci = {}; for (const c of [GH, ...S.cats]) if (S.sci[c]) sci[c] = S.sci[c];
  const st = S.stations[src.pair || src.label], off = S.offsets[src.label] || 0;
  if (!Object.keys(files).length && !st && !off && !src.pair && src.label === src.name && !src.regExists) return;
  try {
    const data = JSON.stringify({ version: 3, nota: 'Registro de BioTrampa de esta estación: nombre, datos de la estación, corrección de hora y, por foto, origen, especies adicionales, datos de la observación y marcas de revisión. No lo borres.', nombre: src.label, carpeta: src.name, par: src.pair || null, estacion: st || null, hora: off, sci, files }, null, 1);
    if (src.regExists && data === src.regLast) return; // sin cambios en esta estación: no se reescribe (con muchas estaciones, cada clic escribía todos los registros)
    // Chrome escribe en un archivo aparte y lo cambia al cerrar, así que un registro que ya existe nunca queda a medias.
    // Pero crear uno nuevo deja un archivo vacío hasta terminar: la primera vez se escribe en .tmp y luego se renombra.
    const fresh = !src.regExists || !(await exists(src.h, REG).catch(() => false));
    const fh = await src.h.getFileHandle(fresh ? REG + '.tmp' : REG, { create: true }), w = await fh.createWritable();
    await w.write(data); await w.close();
    if (fresh) { if (typeof fh.move === 'function') await fh.move(REG); else { const w2 = await (await src.h.getFileHandle(REG, { create: true })).createWritable(); await w2.write(data); await w2.close(); try { await src.h.removeEntry(REG + '.tmp'); } catch (e) {} } }
    if (src.regTmp && !fresh) { try { await src.h.removeEntry(REG + '.tmp'); } catch (e) {} } src.regTmp = false; // ya recuperado: se borra la copia temporal
    src.regExists = true; src.regLast = data;
  } catch (e) { console.warn('No se pudo guardar el registro de BioTrampa en ' + src.name, e);
    if (!src.regWarned) { src.regWarned = true; toast(`No se pudo guardar el registro de «${src.label}» (${e.message}). Sin él se pierde la carpeta de origen de las fotos clasificadas: revisa el espacio libre y el permiso de la carpeta.`, 12000); } }
}
// IndexedDB: proyectos guardados (identificadores de carpetas que Chrome deja recordar) e imagen del mapa
const idb = (mode, fn) => new Promise((res, rej) => { const r = indexedDB.open('biotrampa', 1); r.onupgradeneeded = () => r.result.createObjectStore('h'); r.onerror = () => rej(r.error);
  r.onsuccess = () => { const tx = r.result.transaction('h', mode), q = fn(tx.objectStore('h')); tx.oncomplete = () => { r.result.close(); res(q && q.result); }; tx.onerror = () => { r.result.close(); rej(tx.error); }; }; });
const idbGet = k => idb('readonly', s => s.get(k)).catch(() => null), idbPut = (k, v) => idb('readwrite', s => s.put(v, k)).catch(() => {});
async function saveProj() {
  if (S.ro || !S.proj) return;
  const handles = [...S.srcs.map(s => s.h), ...S.pending.map(p => p.h)].filter(Boolean);
  const prev = (await idbGet('proj:' + S.proj.id)) || {};
  await idbPut('proj:' + S.proj.id, { id: S.proj.id, name: S.proj.name, handles, mapCfg: S.mapCfg || null, last: S.lastSeen || prev.last || null, sp: spState() });
  const list0 = (await idbGet('projects')) || [], list = list0.filter(p => p.id !== S.proj.id), oldE = list0.find(p => p.id === S.proj.id); const old = oldE || {}, tot = S.items.length, dn = S.items.filter(i => i.cat).length; // si faltan permisos, se conserva el avance anterior
  const cnt = new Map(); for (const it of S.items) for (const c of allCats(it)) if (c !== GH) cnt.set(c, (cnt.get(c) || 0) + 1);
  const top = S.pending.length && old.top ? old.top : [...cnt].sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]); // especies más vistas, para la pantalla de inicio
  const pics = []; // 3 miniaturas ya guardadas en la caché (primero fotos con animal) para el mosaico del inicio
  for (const it of [...S.items.filter(i => i.cat && i.cat !== GH).reverse(), ...S.items]) { if (pics.length === 3) break; if (!it.tk || isVideo(it.name)) continue; const b = await tget(it.tk); if (b && !pics.includes(b)) pics.push(b); }
  list.unshift({ id: S.proj.id, name: S.proj.name, n: handles.length, t: Date.now(), tot: S.pending.length && old.tot ? old.tot : tot, done: S.pending.length && old.tot ? old.done : dn, top, last: S.lastSeen || old.last || null, pics: pics.length ? pics : old.pics || [] });
  await idbPut('projects', list); await idbPut('lastProj', S.proj.id);
}
const uniqLabel = (l, except) => { let k = 1, x = l; while (S.srcs.some(s => s !== except && norm(s.label) === norm(x))) x = `${l} (${++k})`; return x; };
// 1.4.13: cada proyecto guarda su propia lista de especies (con teclas, nombres científicos y especies con individuos).
// Los proyectos de antes no la tenían: usan la lista que había al estrenar la 1.4.13 (se guarda una sola vez).
if (!ls('bt_sp_legacy', null)) sv('bt_sp_legacy', { cats: S.cats, sci: S.sci, keys: S.keys, created: S.created, used: S.used });
const spState = () => ({ cats: S.cats, sci: S.sci, keys: S.keys, created: S.created, used: S.used, indSp: S.indSp });
function setSpecies(p) { // proyecto nuevo: setSpecies({ indSp: [] }) = sin especies (solo Fantasmas) y ninguna marcada para individuos
  S.cats = [...(p.cats || [])]; S.sci = Object.assign({}, p.sci); S.keys = Object.assign({}, p.keys); S.created = Object.assign({}, p.created); S.used = Object.assign({}, p.used); S.indSp = [...(p.indSp || S.indSp || [])];
  sv('bt_cats', S.cats); sv('bt_sci', S.sci); sv('bt_keys', S.keys); sv('bt_created', S.created); sv('bt_used', S.used); sv('bt_indsp', S.indSp); renderSide();
}
function resetAll() {
  closeLb(); S.srcs = []; S.pending = []; S.items = []; S.multi.clear(); S.f.src = null; S.f.cat = 'all'; S.empty = null; S.rate = []; S.stations = {}; S.offsets = {}; S.mapCfg = null; S.proj = null; S.ind = { list: {}, act: 0 }; S.indDirty = false; resetThumbs();
}
async function loadSource(h) { // lee una carpeta como estación y suma sus fotos
  const src = { h, name: h.name, label: h.name, reg: {} };
  await loadSrcReg(src); await loadIndFile(src); const want = src.label; src.label = uniqLabel(src.label);
  if (src._st) S.stations[src.pair || src.label] = src._st; if (src._off) S.offsets[src.label] = src._off; delete src._st; delete src._off;
  toast(`Leyendo «${src.label}»…`, 0); const before = S.items.length;
  try { await scan(h, [], src); } catch (e) { S.items = S.items.filter(i => i.src !== src); throw e; } // sin fotos huérfanas si falla a la mitad
  attachCopies(src); S.srcs.push(src);
  if (want !== src.label) toast(`Ya había una estación llamada «${want}»; esta se llamará «${src.label}». Puedes cambiarle el nombre en Proyecto.`, 8000);
  return S.items.length - before;
}
async function sameOrNested(h) { // la misma carpeta, una que la contiene o una que está dentro: contaría fotos dos veces
  for (const s of [...S.srcs, ...S.pending]) { if (!s.h || !s.h.isSameEntry) continue;
    try { if (await s.h.isSameEntry(h)) return `«${s.label || s.h.name}» ya está en el proyecto.`;
      if (s.h.resolve && h.resolve) { if (await h.resolve(s.h)) return `Esa carpeta contiene a la estación «${s.label || s.h.name}». Agrega cada cámara por separado.`; if (await s.h.resolve(h)) return `Esa carpeta está dentro de la estación «${s.label || s.h.name}».`; } } catch (e) {} }
  return '';
}
async function addStation() {
  if (S.busy) return toast('Espera a que termine de moverse la foto.');
  if (!window.showDirectoryPicker) { $('#pick').click(); return; }
  const h = await pickFolder(); if (h) return addHandle(h);
}
async function pickFolder() {
  try { return await showDirectoryPicker({ mode: 'readwrite', id: 'biotrampa' }); }
  catch (e) { toast(e.name === 'AbortError' ? 'No se agregó ninguna carpeta (se canceló o no se concedió el permiso de edición).'
    : /system|sistema|blocked|SecurityError|NotAllowed/i.test(e.name + ' ' + e.message) ? 'Chrome no deja usar carpetas del sistema completas (Escritorio, Documentos, Descargas). Elige una subcarpeta, por ejemplo la de la tarjeta de la cámara.' : 'No se pudo abrir la carpeta: ' + e.message, 8000); return null; }
}
async function addCamTo(id) { // «Agregar cámara» del inicio: primero se elige la carpeta (Chrome lo pide justo después del clic) y luego se abre el proyecto
  if (!window.showDirectoryPicker) return addStation(); const h = await pickFolder(); if (!h) return;
  await openProject(id); addHandle(h);
}
async function addHandle(h, quiet) { // agrega una carpeta ya elegida (con el selector o arrastrándola) como estación
  const dup = await sameOrNested(h); if (dup) { toast(dup, 7000); return 0; }
  try {
    if (regRun) await regRun; if (S.ro) resetAll(); S.ro = false;
    const isNew = !S.proj; if (isNew) { setSpecies({ indSp: [] }); S.ind = { list: {}, act: 0 }; } // 1.4.13: proyecto nuevo sin las especies ni los individuos del anterior
    if (!S.proj) S.proj = { id: Date.now().toString(36), name: `Muestreo ${ymd(Date.now())}` }; // el nombre se cambia en el asistente o en el menú del proyecto
    const indBefore = new Set(Object.keys(S.ind.list)), n = await loadSource(h);
    if (!n) { const s0 = S.srcs.pop(); delete S.stations[s0.label]; delete S.offsets[s0.label]; if (!S.srcs.length && !S.pending.length) S.proj = null; $('#toast').hidden = true; renderProjMenu(); applyFilters();
      toast(`«${h.name}» no tiene fotos ni videos (también se revisaron sus subcarpetas), así que no se agregó. Elige la carpeta de la tarjeta de la cámara.`, 8000); return 0; }
    const lbl = S.srcs[S.srcs.length - 1].label; pruneIndFrom(indBefore, S.srcs[S.srcs.length - 1]);
    await saveProj(); await afterScan(quiet ? '' : `«${lbl}» agregada: ${n} archivo(s). ${S.srcs.length > 1 ? `El proyecto tiene ${S.srcs.length} estaciones.` : 'Agrega las demás cámaras con el «+» de Estaciones o arrastrándolas a la ventana.'}`);
    if (isNew) openWizard(); else if (ls('bt_autost', true)) await autoFillStation(lbl);
    return n;
  } catch (e) { toast('No se pudo leer la carpeta: ' + e.message, 8000); return 0; }
}
/* Datos de la estación tomados de sus fotos: primera y última fecha, y promedio del GPS. Solo llena lo que falta. */
async function autoFillStation(lbl, silent) {
  const l = S.items.filter(i => station(i) === lbl); if (!l.length) return false;
  if (l.some(i => !i.meta)) { await loadAllMeta(l.filter(i => !i.meta)); $('#toast').hidden = true; }
  const st = { ...(S.stations[lbl] || {}) }, t = photoDates(lbl), g = photoGps(lbl), ch = [];
  if (t && !st.start && !st.end) { [st.start, st.end] = t; ch.push('fechas'); }
  if (g && !(st.lat && st.lon)) { st.lat = g[0].toFixed(6); st.lon = g[1].toFixed(6); ch.push('GPS'); }
  if (!ch.length) return false;
  S.stations[lbl] = st; saveReg(); if (!$('#sum').hidden) renderSummary();
  if (!silent) toast(`«${lbl}»: se llenaron ${ch.join(' y ')} con sus fotos. Revísalos en Resumen → Estaciones o con … junto a la estación.`, 6000);
  return true;
}
/* Asistente al crear un proyecto: nombre, lista de especies y datos automáticos de las estaciones */
function openWizard() {
  if (!S.proj) return; $('#pj_n').value = S.proj.name; $('#pj_auto').checked = ls('bt_autost', true);
  $('#pj_sp').innerHTML = `<option value="keep">Empezar vacía (solo Fantasmas)</option><option value="imp">Importar una lista (.json)…</option>`; // 1.4.13: sin lista de ejemplo
  openOver('#pjdlg'); setTimeout(() => { $('#pj_n').focus(); $('#pj_n').select(); }, 0);
}
$('#pj_n').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#pj_ok').click(); } });
$('#pj_ok').onclick = async () => {
  const nm = $('#pj_n').value.trim(); if (nm && S.proj) { S.proj.name = nm; renderProjMenu(); }
  sv('bt_autost', $('#pj_auto').checked); $('#autost').checked = $('#pj_auto').checked; const sp = $('#pj_sp').value;
  closeOver(); await saveProj(); renderHome();
  if (sp === 'ne') loadExampleList(true); else if (sp === 'imp') spImport();
  if ($('#pj_auto').checked) { let n = 0; for (const s of S.srcs) if (await autoFillStation(s.pair || s.label, true)) n++; if (n) toast(`Se llenaron las fechas y el GPS de ${n} estación(es) con sus fotos. Puedes corregirlos en Resumen → Estaciones.`, 6000); }
};
// Arrastrar carpetas a la ventana: cada una se agrega como estación
let dragN = 0;
const isFolderDrag = e => e.dataTransfer && [...e.dataTransfer.items || []].some(i => i.kind === 'file');
addEventListener('dragenter', e => { if (!isFolderDrag(e) || !window.showDirectoryPicker) return; dragN++; $('#dropov').hidden = false; });
addEventListener('dragleave', () => { if (--dragN <= 0) { dragN = 0; $('#dropov').hidden = true; } });
addEventListener('dragover', e => { if (isFolderDrag(e)) e.preventDefault(); });
addEventListener('drop', async e => {
  if (!isFolderDrag(e)) return; e.preventDefault(); dragN = 0; $('#dropov').hidden = true;
  if (!window.showDirectoryPicker) return toast('Este navegador no permite agregar carpetas arrastrándolas. Usa Chrome o Edge.', 5000);
  if (S.busy) return toast('Espera a que termine de moverse la foto.');
  const hs = (await Promise.all([...e.dataTransfer.items].filter(i => i.kind === 'file' && i.getAsFileSystemHandle).map(i => i.getAsFileSystemHandle().catch(() => null)))).filter(Boolean);
  const dirs = hs.filter(h => h.kind === 'directory'); if (!dirs.length) return toast('Arrastra carpetas (la de cada cámara), no fotos sueltas.', 5000);
  let ok = 0, tot = 0;
  for (const h of dirs) { let p = 'prompt'; try { p = await h.requestPermission({ mode: 'readwrite' }); } catch (x) {}
    if (p !== 'granted') { toast(`No se concedió el permiso de edición para «${h.name}».`, 5000); continue; }
    const n = await addHandle(h, dirs.length > 1); if (n) { ok++; tot += n; } }
  if (dirs.length > 1) toast(`${ok} de ${dirs.length} carpeta(s) agregada(s) como estación: ${tot} archivo(s).`, 6000);
});
async function openProject(id, open) { // open: abrir en el visor la foto donde te quedaste
  if (S.busy) return toast('Espera a que termine de moverse la foto.');
  const rec = await idbGet('proj:' + id); if (!rec) return toast('No se encontró ese proyecto en este navegador.', 5000);
  if (regRun) await regRun; await saveProj(); resetAll(); S.ro = false; S.proj = { id: rec.id, name: rec.name }; S.mapCfg = rec.mapCfg || null;
  setSpecies(rec.sp || Object.assign({ indSp: S.indSp }, ls('bt_sp_legacy', {}))); // 1.4.13: la lista de especies de este proyecto
  const lost = [];
  for (const h of rec.handles || []) {
    let p = 'prompt'; try { p = await h.queryPermission({ mode: 'readwrite' }); if (p !== 'granted') p = await h.requestPermission({ mode: 'readwrite' }); } catch (e) { p = 'prompt'; }
    if (p === 'granted') { try { await loadSource(h); } catch (e) { lost.push(h.name); } } else S.pending.push({ h, label: h.name });
  }
  await saveProj();
  await afterScan(`Proyecto «${rec.name}»: ${S.srcs.length} estación(es), ${S.items.length} archivo(s).${S.pending.length ? ` Falta dar permiso a ${S.pending.length}.` : ''}${lost.length ? ` No se encontraron: ${lost.join(', ')} (¿se movieron o borraron?).` : ''}`);
  if (rec.last) continueAt(rec.last, open);
}
function continueAt(last, open) { // vuelve a la estación y la foto donde te quedaste
  const it = S.items.find(i => station(i) === last.st && relPath(i) === last.p) || S.items.find(i => station(i) === last.st && i.origName === last.o);
  if (!it) return; S.lastSeen = last;
  if (S.srcs.length > 1) { S.f.src = it.src.label; applyFilters(); }
  if (open && S.view.includes(it)) return show(it);
  requestAnimationFrame(() => { const head = groupOf(it)[0], card = $(`#grid .card[data-id="${head.id}"]`); if (!card) return;
    card.scrollIntoView({ block: 'center' }); card.classList.add('here'); setTimeout(() => card.classList.remove('here'), 2600); });
  toast(`Seguiste donde te quedaste: ${station(it)} · ${it.origName || it.name}.`, 5000);
}
let lastT = null;
function noteSeen(it) { S.lastSeen = { st: station(it), p: relPath(it), o: it.origName || it.name, n: S.view.indexOf(it) + 1 }; clearTimeout(lastT); lastT = setTimeout(() => saveProj(), 1500); }
async function grantPending(i) { // Chrome pide un clic por carpeta para dar permiso
  const p = S.pending[i]; if (!p) return;
  try { if ((await p.h.requestPermission({ mode: 'readwrite' })) !== 'granted') return toast(`No se concedió el permiso para «${p.label}».`, 5000);
    S.pending.splice(i, 1); const n = await loadSource(p.h); await saveProj(); afterScan(`«${p.label}» lista: ${n} archivo(s).`); }
  catch (e) { toast(`No se pudo abrir «${p.label}»: ${e.message}`, 7000); }
}
function renderPending() {
  const b = $('#pend'); b.hidden = !S.pending.length; if (!S.pending.length) return;
  b.innerHTML = `<span>Chrome necesita tu permiso para abrir ${S.pending.length === 1 ? 'esta estación' : 'estas estaciones'} del proyecto:</span> ` + (S.pending.length > 1 ? '<button class="main" data-all="1" title="Chrome mostrará un aviso por carpeta, uno tras otro">Dar permiso a todas</button> ' : '') + S.pending.map((p, i) => `<button data-i="${i}" title="Dar permiso para leer y mover fotos en esta carpeta">${esc(p.label)}</button>`).join(' ');
  b.querySelectorAll('button[data-i]').forEach(x => x.onclick = () => grantPending(+x.dataset.i));
  const all = b.querySelector('[data-all]'); if (all) all.onclick = grantAll;
}
async function grantAll() { // Chrome pide confirmar cada carpeta; se piden seguidas. Si Chrome exige otro clic, quedan los botones de las que falten.
  const list = [...S.pending]; let ok = 0, tot = 0;
  for (const p of list) { let r = 'prompt'; try { r = await p.h.requestPermission({ mode: 'readwrite' }); } catch (e) { break; }
    if (r !== 'granted') continue; S.pending = S.pending.filter(x => x !== p); try { tot += await loadSource(p.h); ok++; } catch (e) {} }
  await saveProj(); await afterScan(ok ? `${ok} estación(es) abiertas: ${tot} archivo(s).${S.pending.length ? ` Faltan ${S.pending.length}: pulsa su botón.` : ''}` : 'Chrome no concedió el permiso. Pulsa el botón de cada estación.');
}
async function renameStation(src) {
  const nn = (prompt(`Nombre de la estación (la carpeta «${src.name}» no se renombra):`, src.label) || '').trim().replace(/\s+/g, ' ');
  if (!nn || nn === src.label) return; if (S.srcs.some(s => s !== src && norm(s.label) === norm(nn))) return toast('Ya hay una estación con ese nombre.', 4000);
  const old = src.label; src.label = nn;
  for (const o of [S.stations, S.offsets, S.vkeep]) if (old in o) { o[nn] = o[old]; delete o[old]; } sv('bt_vkeep', S.vkeep);
  for (const k of [...S.split]) if (k.startsWith(old + '|')) { S.split.delete(k); S.split.add(nn + k.slice(old.length)); } sv('bt_split', [...S.split]); // ráfagas separadas a mano
  if (S.f.src === old) S.f.src = nn; S.sig = null; saveReg(); applyFilters(); renderProjMenu(); if (!$('#sum').hidden) renderSummary(); toast(`Estación renombrada: «${nn}».`, 3000);
}
function removeStation(src) {
  const n = S.items.filter(i => i.src === src).length;
  if (!confirm(`¿Quitar «${src.label}» del proyecto? Sus ${n} archivo(s) no se tocan: solo dejan de mostrarse aquí. Puedes volver a agregarla cuando quieras.`)) return;
  S.items = S.items.filter(i => i.src !== src); S.srcs = S.srcs.filter(s => s !== src); if (!S.srcs.some(s => (s.pair || s.label) === (src.pair || src.label))) delete S.stations[src.pair || src.label]; delete S.offsets[src.label];
  if (S.f.src === src.label) S.f.src = null; S.multi.clear(); S.hist = []; S.redo = []; updUndo(); if (S.cur && S.cur.src === src) closeLb(); S.sig = null; saveProj(); applyFilters(); renderProjMenu(); toast(`«${src.label}» quitada del proyecto.`, 3000);
}
async function newProject() {
  if (S.srcs.length && !confirm('¿Empezar un proyecto nuevo? El actual queda guardado y lo puedes reabrir desde Proyecto.')) return;
  if (regRun) await regRun; await saveProj(); resetAll(); setSpecies({ indSp: [] }); afterScan(''); renderProjMenu(); toast('Proyecto nuevo: agrega la carpeta de cada estación.', 4000);
}
async function renderProjMenu() {
  const box = $('#projbox'); if (!box) return; const saved = ((await idbGet('projects')) || []).filter(p => !S.proj || p.id !== S.proj.id);
  $('#projname').textContent = S.proj ? S.proj.name : 'BioTrampa'; document.title = S.proj ? `BioTrampa · ${S.proj.name}` : 'BioTrampa'; $('#projbtn').title = S.proj ? `Proyecto «${S.proj.name}»: ${S.srcs.length} estación(es). Clic para ver sus estaciones, renombrarlas o abrir otro proyecto.` : 'Proyectos guardados';
  box.innerHTML = (S.proj ? `<label>Nombre del proyecto <input id="pj_name" value="${esc(S.proj.name)}"></label>` : '<p class="hint tiny">Agrega la carpeta de cada cámara o estación. El grupo se guarda como un proyecto que puedes reabrir.</p>')
    + `<div class="pjst"><b>Estaciones (${S.srcs.length})</b>${S.srcs.map((s, i) => { const l = S.items.filter(it => it.src === s), d = l.filter(it => it.cat).length, pc = l.length ? Math.round(d / l.length * 100) : 0;
      return `<div class="pjrow"><span class="cn" title="Carpeta: ${esc(s.name)}">${esc(s.label)}${s.label !== s.name ? ` <small>(${esc(s.name)})</small>` : ''}</span><small title="${d} de ${l.length} clasificadas">${pc} %</small><span class="pjbar"><i style="width:${pc}%"></i></span><button class="lnk2" data-ren="${i}">Renombrar</button><button class="lnk2" data-pair="${i}" title="Cámaras en par: dos carpetas que cuentan como una sola estación">${s.pair ? 'Par: ' + esc(s.pair) : 'Par…'}</button><button class="lnk2" data-rem="${i}">Quitar</button></div>`; }).join('')}`
    + S.pending.map((p, i) => `<div class="pjrow"><span class="cn">${esc(p.label)} <small>(sin permiso)</small></span><button class="lnk2" data-gr="${i}">Dar permiso</button></div>`).join('') + '</div>'
    + `<button id="pj_add" class="main">Agregar estación…</button>`
    + (S.ro ? '' : `<div class="pjsaved"><b>Proyectos guardados</b>${saved.length ? saved.map(p => `<div class="pjrow"><button class="lnk2 pjopen" data-open="${p.id}">${esc(p.name)}</button><small>${p.n} est.</small><button class="lnk2" data-forget="${p.id}" title="Solo lo quita de esta lista; no toca ninguna carpeta">Olvidar</button></div>`).join('') : '<p class="hint tiny">Ninguno más.</p>'}${S.proj ? '<button id="pj_new" class="lnk2">Nuevo proyecto</button>' : ''}</div>`);
  if ($('#pj_name')) $('#pj_name').onchange = e => { const v = e.target.value.trim(); if (!v) { e.target.value = S.proj.name; return; } S.proj.name = v; $('#projname').textContent = v; document.title = `BioTrampa · ${v}`; saveProj(); updTitle(); };
  $('#pj_add').onclick = () => { closePops(); addStation(); };
  box.querySelectorAll('[data-ren]').forEach(b => b.onclick = () => renameStation(S.srcs[+b.dataset.ren]));
  box.querySelectorAll('[data-rem]').forEach(b => b.onclick = () => removeStation(S.srcs[+b.dataset.rem]));
  box.querySelectorAll('[data-pair]').forEach(b => b.onclick = () => setPair(S.srcs[+b.dataset.pair]));
  box.querySelectorAll('[data-gr]').forEach(b => b.onclick = () => grantPending(+b.dataset.gr));
  box.querySelectorAll('[data-open]').forEach(b => b.onclick = () => { closePops(); openProject(b.dataset.open); });
  box.querySelectorAll('[data-forget]').forEach(b => b.onclick = async () => { const id = b.dataset.forget; await idbPut('projects', ((await idbGet('projects')) || []).filter(p => p.id !== id)); try { await idb('readwrite', s => s.delete('proj:' + id)); } catch (e) {} renderProjMenu(); });
  if ($('#pj_new')) $('#pj_new').onclick = () => { closePops(); newProject(); };
}
let homeUrls = [];
const fmtN = n => n.toLocaleString('es-MX'), ago = t => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'hace un momento' : m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : `hace ${Math.round(m / 1440)} día${m < 2160 ? '' : 's'}`; };
async function renderHome() { // inicio: saludo, el último proyecto en grande y los demás como tarjetas (la primera, «Nuevo proyecto»)
  const box = $('#homelist'); if (!box) return; const list = S.ro ? [] : ((await idbGet('projects')) || []);
  const hr = new Date().getHours(); $('#hgreet').textContent = hr >= 5 && hr < 12 ? 'Buenos días' : hr >= 12 && hr < 19 ? 'Buenas tardes' : 'Buenas noches';
  homeUrls.forEach(u => URL.revokeObjectURL(u)); homeUrls = [];
  const mos = p => '<div class="mos">' + [0, 1, 2].map(i => { const b = p.pics && p.pics[i]; if (!(b instanceof Blob)) return '<i></i>'; const u = URL.createObjectURL(b); homeUrls.push(u); return `<i style="background-image:url('${u}')"></i>`; }).join('') + '</div>';
  const pct = p => p.tot ? Math.round(p.done / p.tot * 100) : 0, nEst = p => `${p.n} ${p.n === 1 ? 'estación' : 'estaciones'}`;
  const forget = async p => { if (!confirm(`¿Quitar «${p.name}» de la lista? Sus carpetas y fotos no se tocan.`)) return; await idbPut('projects', ((await idbGet('projects')) || []).filter(x => x.id !== p.id)); try { await idb('readwrite', s => s.delete('proj:' + p.id)); } catch (e) {} renderHome(); renderProjMenu(); };
  const [last, ...rest] = list, hl = $('#hlast'); hl.hidden = !last; hl.textContent = '';
  if (last) {
    hl.innerHTML = mos(last) + `<div class="hinfo"><p class="mu"></p><h2></h2><p class="mu"></p><div class="hbar"><i style="width:${pct(last)}%"></i></div><div class="hrow"><button class="main hgo"></button><button class="hadd">Agregar cámara</button><span class="sp"></span><button class="lnk2 hforget" title="Quitar de esta lista (no toca ninguna carpeta)">Olvidar</button></div></div>`;
    const ps = hl.querySelectorAll('.hinfo p'); ps[0].textContent = 'Seguiste ' + ago(last.t); hl.querySelector('h2').textContent = last.name;
    ps[1].textContent = nEst(last) + (last.tot != null ? ` · te faltan ${fmtN(last.tot - last.done)} de ${fmtN(last.tot)} fotos` : '');
    const go = hl.querySelector('.hgo'); go.innerHTML = esc(last.last && last.last.n ? `Continuar en la foto ${last.last.n}` : pct(last) === 100 ? 'Abrir' : 'Continuar') + '<i class="ic">' + icon('right') + '</i>';
    go.onclick = () => openProject(last.id); /* 1.4.12: ya no abre la foto en grande; la galería va a la foto donde te quedaste */ hl.querySelector('.hadd').onclick = () => addCamTo(last.id); hl.querySelector('.hforget').onclick = () => forget(last); }
  box.querySelectorAll('.pc').forEach(x => x.remove());
  for (const p of rest) { const c = document.createElement('div'); c.className = 'pc'; c.tabIndex = 0; c.setAttribute('role', 'button');
    c.innerHTML = mos(p) + '<div><h3></h3><p></p></div><div class="hbar"><i></i></div><div class="ft"><span></span><b></b></div><button class="lnk2 hforget" title="Quitar de esta lista (no toca ninguna carpeta)">Olvidar</button>';
    c.querySelector('h3').textContent = p.name; c.querySelector('p').textContent = nEst(p) + ' · ' + (p.top && p.top.length ? p.top.join(', ') : 'sin clasificar');
    c.querySelector('.hbar i').style.width = pct(p) + '%'; c.querySelector('.ft span').textContent = p.tot != null ? `${fmtN(p.done)} de ${fmtN(p.tot)} fotos` : ''; c.querySelector('.ft b').textContent = pct(p) + '%';
    c.onclick = e => { if (e.target.closest('.hforget')) return forget(p); openProject(p.id); }; c.onkeydown = e => { if (e.key === 'Enter' && e.target === c) openProject(p.id); };
    box.appendChild(c); }
}
$('#open2').onclick = () => { if (S.proj && !S.items.length) resetAll(); addStation(); }; // «Nuevo proyecto»
$('#htour').onclick = () => startTour('main'); $('#hset').onclick = () => openOver('#setdlg');
$('#projbtn').addEventListener('click', () => renderProjMenu());

/* ---------- Escanear ---------- */
function catFor(parts) {
  if (parts[0] !== ROOT || !parts[1]) return null; const fn = parts[1];
  return folder(GH).toLowerCase() === fn.toLowerCase() ? GH : (S.cats.find(c => folder(c).toLowerCase() === fn.toLowerCase()) || fn.replace(/_/g, ' '));
}
const REFD = 'Referencias de individuos'; // 1.4.15: imágenes de referencia importadas (no son fotos del proyecto)
const isPhoto = n => /\.(jpe?g|png|mp4|mov|m4v|webm|avi)$/i.test(n) && !n.startsWith('._'); // fotos y videos; ._ = archivos ocultos que macOS crea en tarjetas SD
const isVideo = n => /\.(mp4|mov|m4v|webm|avi)$/i.test(n);
function newItem(n, h, dir, parts, src, extra) {
  const cat = catFor(parts), r = (src.reg && src.reg[[...parts, n].join('/')]) || null, o = r && r.o ? r.o.split('/') : null;
  return { name: n, h, dir, parts, src, cat, size: 0, cls: (r && r.c) || '', origMod: (r && r.m) || null, note: (r && r.n) || '', obs: (r && r.obs) || {}, rev: !!(r && r.rv), revWhy: (r && r.rw) || '', ver: (r && r.vf) || '', verBy: (r && r.vb) || '', bl: (r && r.bl) || '', bb: (r && r.bb) || '', br: (r && r.br) || '',
    extras: cat && r && Array.isArray(r.xt) ? r.xt.filter(c => c && c !== cat).map(c => ({ cat: c })) : [], _x: r && r.x,
    origParts: cat ? (o ? o.slice(0, -1) : null) : parts, origName: cat ? (o ? o[o.length - 1] : n) : n, ...extra };
}
async function scan(dir, parts, src) {
  for await (const [name, h] of dir.entries()) {
    if (h.kind === 'directory') { if (!(name === REFD && !parts.length)) await scan(h, parts.concat(name), src); } // 1.4.15: la carpeta de referencias no se lee como fotos
    else if (isPhoto(name)) { S.items.push(newItem(name, h, dir, parts, src)); if (S.items.length % 200 === 0) toast(`Leyendo «${src.label}»… ${S.items.length} fotos`, 0); }
  }
}
function attachCopies(src) { // las copias de especies adicionales no son fotos nuevas: se unen a su foto principal (dentro de la misma estación)
  const mine = S.items.filter(i => i.src === src), byPath = new Map(mine.map(i => [relPath(i), i])), drop = new Set();
  for (const it of mine) { if (!it._x) continue;
    for (const x of it._x) { const c = byPath.get(x.p); if (c && c !== it && !c._x) { it.extras.push({ cat: x.c, h: c.h, dir: c.dir, name: c.name, parts: c.parts }); drop.add(c); } }
    delete it._x; }
  if (drop.size) S.items = S.items.filter(i => !drop.has(i));
}
async function afterScan(msg) {
  S.items.forEach(i => allCats(i).forEach(c => { if (c !== GH && !S.cats.includes(c)) S.cats.push(c); }));
  syncIndCatalog(); // los «ID del individuo» ya escritos entran al catálogo
  sv('bt_cats', S.cats);
  S.items.sort((a, b) => a.src.label.localeCompare(b.src.label) || a.parts.join('/').localeCompare(b.parts.join('/')) || a.name.localeCompare(b.name, undefined, { numeric: true }));
  S.hist = []; S.redo = []; S.sig = null; updUndo(); renderPending(); renderProjMenu(); if (!S.items.length) renderHome();
  if (msg) toast(msg, 6000); else if (msg !== '') { const nv = S.items.filter(i => isVideo(i.name)).length; toast(S.items.length ? `${S.items.length} fotografías encontradas${nv ? ` (incluye ${nv} video${nv > 1 ? 's' : ''})` : ''}.` : 'Las estaciones no contienen fotos ni videos.', 5000); }
  applyFilters();
  if (needMeta()) { await prepare(); applyFilters(); }
}
$('#open').onclick = addStation;
if (!window.showDirectoryPicker) { // alternativa de solo lectura (Firefox, Safari, etc.): cada carpeta elegida se suma como estación
  const inp = Object.assign(document.createElement('input'), { type: 'file', id: 'pick', webkitdirectory: true, hidden: true });
  document.body.appendChild(inp);
  inp.onchange = () => { S.ro = true; const first = inp.files[0]; if (!first) return; const name = first.webkitRelativePath.split('/')[0] || 'carpeta';
    const src = { h: null, name, label: uniqLabel(name), reg: {} }; S.srcs.push(src);
    for (const f of inp.files) if (isPhoto(f.name)) { const p = f.webkitRelativePath.split('/').slice(1, -1); S.items.push(newItem(f.name, { getFile: async () => f }, null, p, src, { size: f.size })); }
    inp.value = ''; afterScan(`«${src.label}» agregada (solo lectura).`); };
  const w = $('#warn'); w.hidden = false;
  w.innerHTML = '<b>Modo solo lectura: este navegador no permite modificar carpetas.</b>Puedes ver las fotos, etiquetarlas y exportar el CSV, pero las fotos <u>no</u> se moverán a sus carpetas y lo que hagas no se guarda al cerrar. Para usar BioTrampa completo, abre este mismo archivo (index.html) con <b style="display:inline">Google Chrome</b> o <b style="display:inline">Microsoft Edge</b>: clic derecho → Abrir con → Chrome.';
} else { renderHome(); }

/* ---------- Miniaturas (carga perezosa, con límite de concurrencia y caché) ---------- */
const NCPU = navigator.hardwareConcurrency || 4, TMAX = Math.max(2, Math.min(6, NCPU - 1)), NW = Math.max(1, Math.min(3, NCPU - 1)); // miniaturas a la vez y procesos de miniaturas, según los núcleos del equipo
let rzOn = false; // true mientras se arrastra el borde del panel
const q = []; let running = 0, thumbs = new WeakMap(), thumbUrls = [];
function resetThumbs() { thumbUrls.forEach(u => URL.revokeObjectURL(u)); thumbUrls = []; thumbs = new WeakMap(); pre.forEach(dropPre); pre = []; }
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { io.unobserve(e.target); q.push(e.target); pump(); } }), { root: $('#gal'), rootMargin: '300px' });
function nearView(img, g) { const r = img.getBoundingClientRect(); g = g || $('#gal').getBoundingClientRect(); return r.bottom > g.top - 400 && r.top < g.bottom + 400; }
function pump() { // primero las miniaturas que se acaban de ver; las que ya quedaron lejos esperan a volver a verse
  if (rzOn) return; // mientras se cambia el ancho del panel no se generan miniaturas (se reanuda al soltar)
  let g = null; // 1.4.12: el borde de la galería se mide una sola vez por tanda, no una vez por miniatura
  while (running < TMAX && q.length) { const img = q.pop(); if (!img.isConnected) continue; if (!nearView(img, g || (g = $('#gal').getBoundingClientRect()))) { io.observe(img); continue; }
    running++; thumb(img).finally(() => { running--; pump(); }); } }
function badThumb(img) { img.alt = 'No se pudo leer'; img.parentNode.classList.add('err'); img.parentNode.title = 'No se pudo leer la imagen (archivo dañado o no es una foto)'; }
/* Las miniaturas se generan en un hilo aparte para que la galería no se trabe; si el navegador no lo permite, se hacen aquí */
const WCODE = `self.onmessage = async e => { const { id, file, w, fit } = e.data; try {
  let bmp;
  if (fit) { bmp = await createImageBitmap(file); const k = Math.min(1, fit[0] / bmp.width, fit[1] / bmp.height); if (k > .85) { bmp.close(); return self.postMessage({ id, same: true }); }
    const b2 = await createImageBitmap(bmp, { resizeWidth: Math.round(bmp.width * k), resizeHeight: Math.round(bmp.height * k), resizeQuality: 'high' }); bmp.close(); bmp = b2; }
  else bmp = await createImageBitmap(file, { resizeWidth: w, resizeQuality: 'medium' });
  const c = new OffscreenCanvas(bmp.width, bmp.height); c.getContext('2d').drawImage(bmp, 0, 0); bmp.close();
  self.postMessage({ id, b: await c.convertToBlob({ type: 'image/jpeg', quality: fit ? .92 : .72 }) });
} catch (err) { self.postMessage({ id, err: String(err && err.message || err) }); } };`;
let wOk = typeof OffscreenCanvas !== 'undefined', wId = 0; const wWait = new Map(), WK = {};
function worker(kind) { // 'thumb' o 'view': dos hilos para que las miniaturas no retrasen el visor
  if (WK[kind] || !wOk) return WK[kind] || null;
  try { const wk = new Worker(URL.createObjectURL(new Blob([WCODE], { type: 'text/javascript' })));
    wk.onmessage = e => { const r = wWait.get(e.data.id); if (!r) return; wWait.delete(e.data.id); e.data.err ? r[1](new Error(e.data.err)) : r[0](e.data); };
    wk.onerror = () => { wOk = false; for (const k in WK) delete WK[k]; wWait.forEach(r => r[1](new Error('worker'))); wWait.clear(); };
    WK[kind] = wk; } catch (e) { wOk = false; }
  return WK[kind] || null;
}
let wRR = 0;
const wJob = (kind, msg) => { const wk = worker(kind === 'thumb' ? 'thumb' + (wRR++ % NW) : kind); if (!wk) return Promise.reject(new Error('worker')); return new Promise((res, rej) => { const id = ++wId; wWait.set(id, [res, rej]); wk.postMessage({ id, ...msg }); }); };
function thumbBlob(f) { return wJob('thumb', { file: f, w: 280 }).then(d => d.b).catch(e => e.message === 'worker' ? thumbBlobMain(f) : Promise.reject(e)); }
/* Versión del tamaño de la pantalla para el visor: se dibuja al instante; la foto completa se carga solo al hacer zoom o con la lupa */
function fitSize() { const r = $('.imgwrap').getBoundingClientRect(), d = Math.max(1, devicePixelRatio || 1); return [Math.ceil(Math.max(r.width, 600) * d), Math.ceil(Math.max(r.height, 400) * d)]; }
async function screenUrl(f) { try { const d = await wJob('view', { file: f, fit: fitSize() }); return d.b ? URL.createObjectURL(d.b) : null; } catch (e) { return null; } }
async function thumbBlobMain(f) {
  const bmp = await createImageBitmap(f, { resizeWidth: 280, resizeQuality: 'low' });
  const c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height; c.getContext('2d').drawImage(bmp, 0, 0); bmp.close();
  return new Promise((r, j) => c.toBlob(b => b ? r(b) : j(new Error('miniatura')), 'image/jpeg', .7));
}
/* Caché de miniaturas en el navegador (IndexedDB): la segunda vez que abres una carpeta, o al volver a abrir el proyecto, salen al instante.
   Se guardan con el nombre original, el tamaño y la fecha de la foto: si la foto cambia, se vuelve a generar. Nunca se escribe nada en tus carpetas. */
let tdbP = null;
function tdb() { return tdbP || (tdbP = new Promise(res => { try { const r = indexedDB.open('bt_thumbs', 1); r.onupgradeneeded = () => r.result.createObjectStore('t');
  r.onsuccess = () => { const d = r.result; try { const c = d.transaction('t').objectStore('t').count(); c.onsuccess = () => { if (c.result > 40000) try { d.transaction('t', 'readwrite').objectStore('t').clear(); } catch (e) {} }; } catch (e) {} res(d); }; r.onerror = r.onblocked = () => res(null); } catch (e) { res(null); } })); }
async function tget(k) { const d = await tdb(); if (!d) return null; return new Promise(res => { try { const q = d.transaction('t').objectStore('t').get(k); q.onsuccess = () => res(q.result || null); q.onerror = () => res(null); } catch (e) { res(null); } }); }
function tput(k, b) { tdb().then(d => { if (d) try { d.transaction('t', 'readwrite').objectStore('t').put(b, k); } catch (e) {} }); }
const tkey = it => it.tk || (it.tk = [it.src.label, ...(it.origParts || it.parts), it.origName || it.name, it.size, it.mod].join('|'));
/* Miniatura que la propia cámara guarda dentro de la foto (EXIF): se lee en milisegundos y sirve de vista previa mientras se genera la buena */
async function exifThumb(f) {
  try { const dv = new DataView(await f.slice(0, 65536).arrayBuffer()); if (dv.getUint16(0) !== 0xFFD8) return null;
    for (let o = 2; o + 4 < dv.byteLength;) { const m = dv.getUint16(o), len = dv.getUint16(o + 2);
      if (m === 0xFFE1 && dv.getUint32(o + 4) === 0x45786966) { const t = o + 10, le = dv.getUint16(t) === 0x4949, g16 = p => dv.getUint16(p, le), g32 = p => dv.getUint32(p, le);
        const i0 = t + g32(t + 4), i1o = g32(i0 + 2 + g16(i0) * 12); if (!i1o) return null; const i1 = t + i1o; let off = 0, ln = 0;
        for (let k = 0, n = g16(i1); k < n; k++) { const e = i1 + 2 + k * 12, tag = g16(e); if (tag === 0x201) off = g32(e + 8); if (tag === 0x202) ln = g32(e + 8); }
        return off && ln && t + off + ln <= dv.byteLength ? new Blob([dv.buffer.slice(t + off, t + off + ln)], { type: 'image/jpeg' }) : null; }
      if ((m & 0xFF00) !== 0xFF00 || m === 0xFFDA) return null; o += 2 + len; }
  } catch (e) {} return null; }
async function thumb(img) {
  const it = S.items[img.dataset.id]; if (!it || !img.isConnected) return;
  const c0 = thumbs.get(it); if (c0) { if (c0 === 'err') badThumb(img); else img.src = c0; return; }
  try {
    const f = await it.h.getFile(); it.size = f.size; it.mod = f.lastModified;
    let url;
    if (!isVideo(it.name)) { const k = tkey(it); let b = await tget(k);
      if (!b) { const lo = await exifThumb(f); if (lo && img.isConnected && !img.src) { const u = URL.createObjectURL(lo); thumbUrls.push(u); img.src = u; img.classList.add('lo'); }
        b = await thumbBlob(f); tput(k, b); }
      url = URL.createObjectURL(b); thumbs.set(it, url); thumbUrls.push(url); if (img.isConnected) { img.src = url; img.classList.remove('lo'); } return; }
    const bmp = await videoFrame(f), c = document.createElement('canvas'); c.width = bmp.width; c.height = bmp.height; c.getContext('2d').drawImage(bmp, 0, 0); bmp.close(); url = await new Promise(r => c.toBlob(b => r(URL.createObjectURL(b)), 'image/jpeg', .7)); // video
    thumbs.set(it, url); thumbUrls.push(url); if (img.isConnected) img.src = url;
  } catch (e) { thumbs.set(it, 'err'); badThumb(img); if (isVideo(it.name)) { img.parentNode.classList.add('novid'); img.parentNode.title = 'Video sin vista previa (el navegador no puede leer este formato)'; } }
}
function videoFrame(f) { // un cuadro del video como miniatura
  return new Promise((res, rej) => { const v = document.createElement('video'), url = URL.createObjectURL(f), end = e => { URL.revokeObjectURL(url); clearTimeout(t); e ? rej(e) : 0; };
    const t = setTimeout(() => end(new Error('tiempo agotado')), 8000); v.muted = true; v.preload = 'auto'; v.src = url;
    v.onloadedmetadata = () => { v.currentTime = Math.min(1, (v.duration || 2) / 2); };
    v.onseeked = () => { const w = 280, h = Math.round(w * (v.videoHeight || 3) / (v.videoWidth || 4)), c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(v, 0, 0, w, h); end(); createImageBitmap(c).then(res, rej); };
    v.onerror = () => end(new Error('formato no compatible')); });
}

/* ---------- Filtros y galería ---------- */
// Texto donde busca la lupa: ruta, nombre original, nota, especies, comportamiento, ID del individuo y motivo de revisión
const searchText = it => norm([pathOf(it), it.origName, it.note, it.revWhy, ...allCats(it), ...Object.values(it.obs || {}).flatMap(o => [o.beh, o.id])].filter(Boolean).join(' | '));
const moonCls = it => { if (!it.meta || !it.meta.date) return null; const il = moonOf(fixTs(it)).ill; return il < 25 ? 'dark' : il > 75 ? 'full' : 'mid'; };
function applyFilters(changed) { // changed: fotos que cambiaron (solo se actualizan sus tarjetas)
  const { q, st, cat, dn, src, moon } = S.f, ql = norm(q).trim();
  S.items.forEach((it, i) => it.id = i);
  S.view = S.items.filter(it => (!ql || searchText(it).includes(ql))
    && (st === 'all' || (st === 'pending' ? !it.cat : st === 'done' ? !!it.cat : st === 'rev' ? it.rev : st === 'unver' ? (!!it.cat && !it.ver) : st === 'susp' ? suspect(it) : st === 'empty' ? !!(S.empty && S.empty.has(it) && !it.cat) : true))
    && (cat === 'all' || (cat === '__pending' ? !it.cat : cat === '__done' ? !!it.cat : hasCat(it, cat)))
    && (dn === 'all' || period(it) === dn) && (moon === 'all' || moonCls(it) === moon) && (!src || station(it) === src));
  // siempre agrupadas por estación
  if (S.sort === 'date' || S.burst) S.view.sort((a, b) => { const sa = station(a), sb = station(b); if (sa !== sb) return sa.localeCompare(sb); const x = dkey(a), y = dkey(b); return x < y ? -1 : x > y ? 1 : a.id - b.id; });
  buildGroups();
  // Si las tarjetas visibles no cambian, solo se actualizan sus etiquetas (rápido con miles de fotos)
  const sig = S.view.map(i => { const g = S.groups.get(i); return g && g[0] !== i ? '' : i.id + (g ? 'x' + g.length : ''); }).join(',');
  if (sig === S.sig && $('#grid').children.length) refreshCards(changed); else { S.sig = sig; renderGrid(); }
  renderSide(); updTitle(); renderChips(); if (!$('#pind').hidden) renderIndPane();
}
/* Encabezado de la galería: estación (o proyecto), número de fotos y fechas */
function updTitle() {
  const cl = S.f.cat === '__pending' ? 'Pendientes' : S.f.cat === '__done' ? 'Clasificadas' : S.f.cat !== 'all' ? S.f.cat : '';
  $('#vtitle').textContent = S.f.src || (S.srcs.length === 1 ? station(S.items[0] || { src: S.srcs[0] }) : S.srcs.length ? 'Todas las estaciones' : projName());
  let a = Infinity, b = -Infinity; for (const it of S.view) if (goodTs(it)) { const x = fixTs(it); if (x < a) a = x; if (x > b) b = x; }
  const M = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'], d1 = new Date(a), d2 = new Date(b), sy = d1.getFullYear() === d2.getFullYear();
  const range = a <= b ? `${d1.getDate()} ${M[d1.getMonth()]}${sy ? '' : ' ' + d1.getFullYear()} – ${d2.getDate()} ${M[d2.getMonth()]} ${d2.getFullYear()}` : '';
  $('#vsub').textContent = [cl, `${fmtN(S.view.length)} ${S.view.length === 1 ? 'foto' : 'fotos'}`, range].filter(Boolean).join(' · ');
}
/* Pestañas de filtro (Todas, Pendientes, Clasificadas, Marcadas, Probablemente vacías) con su número de fotos */
const FT = { all: () => true, pending: i => !i.cat, done: i => !!i.cat, rev: i => i.rev, empty: i => !!(S.empty && S.empty.has(i) && !i.cat) };
function renderChips() {
  const base = S.f.src ? S.items.filter(i => station(i) === S.f.src) : S.items;
  $('#ftabs').querySelectorAll('button[data-st]').forEach(b => { const k = b.dataset.st, on = S.f.st === k; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.querySelector('b').textContent = k === 'empty' && !S.empty ? '' : fmtN(base.filter(FT[k]).length); });
  $('#viewbtn').textContent = `${S.burst ? 'Ráfagas agrupadas' : 'Sin agrupar ráfagas'} · ${S.sort === 'date' ? 'por fecha de captura' : 'por nombre de archivo'}`;
}
$('#ftabs').addEventListener('click', async e => { const b = e.target.closest('button[data-st]'); if (!b) return; const k = b.dataset.st, again = S.f.st === k; S.f.st = k; $('#st').value = 'all';
  if (k === 'empty' && !again) await findEmpty(); updFilt(); applyFilters(); $('#gal').scrollTop = 0; });
function cardState(d, it) {
  const isDone = i => S.blind ? !!i.bl : !!i.cat, g = S.groups.get(it), done = g ? g.every(isDone) : isDone(it), per = period(it);
  d.className = 'card ' + (done ? ((S.blind ? it.bl : it.cat) === GH ? 'done fant' : 'done') : '') + (S.multi.has(it) ? ' sel' : '') + (S.kf === it ? ' kf' : '') + (thumbs.get(it) === 'err' ? ' err' : '') + (per === 'night' ? ' night' : per === 'crep' ? ' crep' : '') + (it.note ? ' noted' : '') + (it.rev ? ' flag' : '') + (it.ver ? ' ver' : '') + (isVideo(it.name) ? ' vid' : '');
  if (!d.classList.contains('err')) d.title = (S.srcs.length > 1 ? station(it) + ' · ' : '') + it.name + (g ? ` (ráfaga de ${g.length})` : '') + (done ? '' : ' (pendiente)') + (per ? ' · ' + PER[per] : '') + (it.rev ? ' · marcada para revisar' : '') + (it.ver ? ' · verificada' : '') + (it.note ? ' · nota: ' + it.note : '');
  const t = d.querySelector('.tag'); t.title = done ? 'Clic para quitar la clasificación' : 'Pendiente';
  t.textContent = done ? (S.blind ? it.bl : allCats(it).join(' + ') + (it.tagOnly ? ' (sin mover)' : '')) : '';
}
function refreshCards(only) { // only: actualizar solo las tarjetas de esas fotos (rápido con miles)
  const ds = only ? [...new Set(only.map(i => groupOf(i)[0]))].map(h => $(`#grid .card[data-id="${h.id}"]`)).filter(Boolean) : $('#grid').querySelectorAll('.card');
  for (const d of ds) cardState(d, S.items[d.dataset.id]); renderMulti(); updHeads(); }
function updHeads() { // conteos de los títulos de estación en la galería
  const hs = $('#grid').querySelectorAll('.ghead'); if (!hs.length) return; const stN = new Map(); for (const it of S.view) { const v = stN.get(station(it)) || [0, 0]; v[0]++; if (it.cat) v[1]++; stN.set(station(it), v); }
  hs.forEach(hd => { const [n, dn] = stN.get(hd.dataset.src) || [0, 0]; hd.children[1].textContent = `${n} ${n === 1 ? 'archivo' : 'archivos'} · ${dn} ${dn === 1 ? 'clasificado' : 'clasificados'}`; }); }
function renderGrid() {
  const g = $('#grid'); g.textContent = ''; $('#empty').hidden = S.items.length > 0; document.body.classList.toggle('home', !S.items.length); // sin fotos: pantalla de inicio (sin barra lateral)
  /* Las tarjetas van en bloques de 60: el navegador solo acomoda los bloques visibles, así que cambiar el ancho
     del panel o de la ventana no obliga a recalcular miles de miniaturas a la vez */
  const gs = getComputedStyle($('#gal')), frag = document.createDocumentFragment(), CH = 60, th = TH.v, gw = Math.max(200, $('#gal').clientWidth - parseFloat(gs.paddingLeft) - parseFloat(gs.paddingRight));
  const cols = Math.max(1, Math.floor((gw + 16) / (th + 16))), cw = (gw - 16 * (cols - 1)) / cols, estH = Math.ceil(CH / cols) * (cw * .75 + 16) - 16; // 1.4.12: misma medida que el CSS (huecos de 16 px), para que la galería no dé saltos al subir y bajar
  let chunk = null, nIn = 0, lastSt = null; const heads = S.srcs.length > 1 && !S.f.src, stN = new Map();
  if (heads) for (const it of S.view) { const v = stN.get(station(it)) || [0, 0]; v[0]++; if (it.cat) v[1]++; stN.set(station(it), v); }
  for (const it of S.view) {
    const gr = S.groups.get(it); if (gr && gr[0] !== it) continue;
    if (heads && station(it) !== lastSt) { lastSt = station(it); const [n, dn] = stN.get(lastSt), hd = document.createElement('div'); hd.className = 'ghead'; hd.dataset.src = lastSt;
      hd.innerHTML = '<b></b><span></span><button class="lnk2">Ver solo esta estación</button>'; hd.children[0].textContent = lastSt; hd.children[1].textContent = `${n} ${n === 1 ? 'archivo' : 'archivos'} · ${dn} ${dn === 1 ? 'clasificado' : 'clasificados'}`; frag.appendChild(hd); chunk = null; }
    if (!chunk || nIn === CH) { chunk = document.createElement('div'); chunk.className = 'gchunk'; chunk.style.containIntrinsicSize = `auto ${Math.round(estH)}px`; frag.appendChild(chunk); nIn = 0; }
    nIn++;
    const d = document.createElement('div'); d.dataset.id = it.id;
    d.innerHTML = '<img alt="" decoding="async" draggable="false"><span class="tag"></span><span class="nm"></span>' + (gr ? '<span class="cnt"></span>' : '');
    d.querySelector('.nm').textContent = it.name; if (gr) d.querySelector('.cnt').textContent = gr.length;
    cardState(d, it);
    const img = d.querySelector('img'); img.dataset.id = it.id; io.observe(img);
    chunk.appendChild(d);
  }
  g.appendChild(frag); renderMulti(); renderGFilter();
}
function renderGFilter() { // aviso arriba de la galería cuando se ve una sola estación
  const b = $('#gfilter'); const on = !!S.f.src && S.srcs.length > 1; b.hidden = !on; if (!on) return;
  const n = S.items.filter(i => station(i) === S.f.src).length;
  b.innerHTML = 'Solo la estación <b></b> <span></span> <button class="lnk2">Ver todas las estaciones</button>'; b.querySelector('b').textContent = S.f.src; b.querySelector('span').textContent = `(${n} ${n === 1 ? 'archivo' : 'archivos'})`;
  b.querySelector('button').onclick = () => { S.f.src = null; applyFilters(); };
}
$('#grid').onclick = e => {
  const hd = e.target.closest('.ghead'); if (hd) { if (e.target.closest('button')) { S.f.src = hd.dataset.src; applyFilters(); $('#gal').scrollTop = 0; } return; }
  const c = e.target.closest('.card'); if (!c) return; const it = S.items[c.dataset.id];
  const g = groupOf(it);
  if (e.shiftKey && S.anchor && S.view.includes(S.anchor)) { // Shift+clic: selecciona todas las fotos entre la anterior y esta
    const a = S.view.indexOf(S.anchor), b = S.view.indexOf(it); for (let i = Math.min(a, b); i <= Math.max(a, b); i++) S.multi.add(S.view[i]); g.forEach(i => S.multi.add(i)); refreshCards(); return; }
  S.anchor = it; setKf(it, false);
  if (e.target.closest('.tag') && g.every(i => S.blind ? i.bl : i.cat) && !e.ctrlKey && !e.metaKey && !S.multi.size) { locked(() => unclassify(g, g.length > 1)); return; }
  if (e.ctrlKey || e.metaKey || S.multi.size) { const has = S.multi.has(it); g.forEach(i => has ? S.multi.delete(i) : S.multi.add(i)); c.classList.toggle('sel'); renderMulti(); }
  else show(it);
};
/* 1.4.12: seleccionar varias fotos manteniendo el clic (como en la galería del teléfono).
   Mantener el clic quieto sobre una foto la selecciona; al arrastrar se seleccionan todas las fotos entre la primera y la que está debajo
   del ratón. Si empiezas sobre una foto ya seleccionada, arrastrar las quita. Cerca del borde de arriba o de abajo la galería se desplaza sola. */
let gsel = null, gselNoClick = false;
$('#grid').addEventListener('pointerdown', e => {
  if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.metaKey || e.pointerType === 'touch') return;
  const c = e.target.closest('.card'); if (!c || e.target.closest('.tag')) return; const it = groupOf(S.items[c.dataset.id])[0];
  gsel = { it, x: e.clientX, y: e.clientY, px: e.clientX, py: e.clientY, on: false, add: !S.multi.has(it), base: new Set(S.multi), heads: null, a: -1, b: -1, vy: 0, raf: 0, t: setTimeout(gselStart, 450) };
});
function gselStart() { if (!gsel || gsel.on) return; clearTimeout(gsel.t); gsel.on = true; gsel.heads = S.view.filter(i => groupOf(i)[0] === i); gsel.a = gsel.heads.indexOf(gsel.it);
  document.body.classList.add('gsel'); S.anchor = gsel.it; gselTo(gsel.it); }
function gselTo(it) {
  const h = gsel.heads, b = h.indexOf(it); if (gsel.a < 0 || b < 0 || b === gsel.b) return; const ob = gsel.b < 0 ? b : gsel.b; gsel.b = b;
  const lo = Math.min(gsel.a, b, ob), hi = Math.max(gsel.a, b, ob), r0 = Math.min(gsel.a, b), r1 = Math.max(gsel.a, b), ch = [];
  for (let i = lo; i <= hi; i++) { const inR = i >= r0 && i <= r1; for (const x of groupOf(h[i])) { if (inR ? gsel.add : gsel.base.has(x)) S.multi.add(x); else S.multi.delete(x); } ch.push(h[i]); }
  refreshCards(ch); // solo las tarjetas que cambiaron (rápido con miles)
}
function gselHit() { const el = document.elementFromPoint(gsel.px, gsel.py), c = el && el.closest('#grid .card'); if (c) gselTo(groupOf(S.items[c.dataset.id])[0]); }
function gselScroll() { if (!gsel || !gsel.vy) { if (gsel) gsel.raf = 0; return; } $('#gal').scrollTop += gsel.vy; gselHit(); gsel.raf = requestAnimationFrame(gselScroll); }
addEventListener('pointermove', e => {
  if (!gsel) return; gsel.px = e.clientX; gsel.py = e.clientY;
  if (!gsel.on) { if (Math.hypot(e.clientX - gsel.x, e.clientY - gsel.y) < 8) return; gselStart(); }
  e.preventDefault(); gselHit();
  const r = $('#gal').getBoundingClientRect(), m = 60; gsel.vy = e.clientY < r.top + m ? -Math.ceil((r.top + m - e.clientY) / 3) : e.clientY > r.bottom - m ? Math.ceil((e.clientY - r.bottom + m) / 3) : 0;
  if (gsel.vy && !gsel.raf) gsel.raf = requestAnimationFrame(gselScroll);
});
function gselEnd() { if (!gsel) return; const g = gsel; gsel = null; clearTimeout(g.t); cancelAnimationFrame(g.raf);
  if (!g.on) return; document.body.classList.remove('gsel'); gselNoClick = true; setTimeout(() => gselNoClick = false, 0); renderMulti(); }
addEventListener('pointerup', gselEnd); addEventListener('pointercancel', gselEnd); addEventListener('blur', gselEnd);
$('#grid').addEventListener('click', e => { if (gselNoClick) { e.stopPropagation(); e.preventDefault(); } }, true); // soltar no abre la foto
// Clic derecho en una miniatura: clasificar sin abrir el visor (la ráfaga completa o la selección)
$('#grid').oncontextmenu = e => {
  const c = e.target.closest('.card'); if (!c || !S.srcs.length) return; e.preventDefault(); const it = S.items[c.dataset.id];
  spMenu(e.clientX, e.clientY, S.multi.has(it) ? [...S.multi] : groupOf(it), it);
};
function spMenu(x, y, items, it) { // menú de especies para clasificar sin abrir el visor (miniatura o tira de la ráfaga)
  closeMenu(); const m = document.createElement('div'); m.id = 'cmenu'; m.className = 'spmenu'; const g = groupOf(it), whole = items.length === g.length && items.every(i => g.includes(i));
  const head = document.createElement('div'); head.className = 'cmh'; head.textContent = items.length > 1 ? `${items.length} fotos` : (it.origName || it.name); m.appendChild(head);
  const add = (t, f, cls) => { const b = document.createElement('button'); b.innerHTML = t; if (cls) b.className = cls; b.onclick = () => { closeMenu(); f(); }; m.appendChild(b); };
  for (const sp of [...S.cats, GH]) { const k = keyOf(sp); add(`<kbd>${esc(k || '')}</kbd>${esc(sp)}`, () => locked(() => classify(items, sp, whole)), sp === GH ? 'gh' : ''); }
  m.appendChild(document.createElement('hr'));
  if (items.some(i => i.cat)) add('Quitar la clasificación', () => locked(() => unclassify(items, whole)));
  const allRev = items.every(i => i.rev); add(allRev ? 'Quitar la marca de revisión' : 'Marcar para revisar', () => { items.forEach(i => { i.rev = !allRev; if (allRev) i.revWhy = ''; }); saveReg(); refreshCards(); renderChips(); if (S.cur) show(S.cur); toast(allRev ? 'Marca de revisión quitada.' : `${items.length} foto(s) marcada(s) para revisar.`, 2500); });
  if (g.length > 1) add(items.length === 1 && g[0] !== it ? 'Separar la ráfaga desde esta foto' : 'Separar esta ráfaga en fotos sueltas', () => splitBurst(items.length === 1 && g[0] !== it ? [it] : g.slice(1)));
  add('Abrir en grande', () => show(it));
  document.body.appendChild(m); m.style.left = Math.max(8, Math.min(x, innerWidth - m.offsetWidth - 8)) + 'px'; m.style.top = Math.max(8, Math.min(y, innerHeight - m.offsetHeight - 8)) + 'px';
}
/* Galería con teclado: flechas para moverse, Enter para abrir, teclas de especie para clasificar la foto marcada (o la selección) */
function setKf(it, scroll = true) {
  const prev = S.kf; S.kf = it; for (const x of [prev, it]) { if (!x) continue; const h = groupOf(x)[0], d = $(`#grid .card[data-id="${h.id}"]`); if (d) d.classList.toggle('kf', S.kf === x || S.kf === h); }
  if (it && scroll) { const d = $(`#grid .card[data-id="${groupOf(it)[0].id}"]`); if (d) d.scrollIntoView({ block: 'nearest' }); }
}
function gridMove(key) {
  const heads = S.view.filter(i => groupOf(i)[0] === i); if (!heads.length) return; const cur = S.kf ? groupOf(S.kf)[0] : null; let i = heads.indexOf(cur);
  if (i < 0) return setKf(heads[0]);
  const card = $(`#grid .card[data-id="${cur.id}"]`), gc = card && card.parentElement, cols = gc ? getComputedStyle(gc).gridTemplateColumns.split(' ').length : 1;
  i += key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : key === 'ArrowDown' ? cols : -cols; setKf(heads[Math.max(0, Math.min(heads.length - 1, i))]);
}
function catBtn(c) {
  const d = document.createElement('div'); d.className = 'cat' + (c === GH ? ' gh' : '') + (S.f.cat === c ? ' on' : ''); d.dataset.cat = c; d.tabIndex = 0; d.setAttribute('role', 'button');
  if (c !== GH && S.spSort === 'keys') d.classList.add('mv'); // arrastrar solo en el orden de las teclas
  d.innerHTML = '<kbd></kbd><span class="cn"></span><b></b><button class="dots" title="Opciones: renombrar, eliminar, tecla, nombre científico" aria-label="Opciones">…</button>';
  d.children[0].textContent = keyOf(c); d.children[1].textContent = c; d.title = (S.sci[c] ? S.sci[c] + ' · ' : '') + 'Clic: ver sus fotos (otro clic: ver todas)' + (c !== GH && S.spSort === 'keys' ? ' · Arrastra para cambiar el orden y la tecla' : '') + ' · Clic derecho o …: más opciones';
  d.children[2].textContent = (S.counts && S.counts.get(c)) || 0; return d;
}
function renderSide() {
  // conteos de especies y estaciones en una sola pasada (rápido con miles de fotos)
  S.counts = new Map(); S.stCount = new Map();
  for (const it of S.items) { const st = station(it), v = S.stCount.get(st) || [0, 0]; v[1]++; if (it.cat) v[0]++; S.stCount.set(st, v);
    if (!S.f.src || st === S.f.src) for (const c of allCats(it)) S.counts.set(c, (S.counts.get(c) || 0) + 1); } // con una estación elegida, las especies y el avance son de esa estación
  const box = $('#cats'); box.textContent = '';
  [...sortedCats(), GH].forEach(c => box.appendChild(catBtn(c))); // Fantasmas al final: no es una especie
  $('#sortlbl').textContent = S.spSort === 'keys' ? '' : SPSORT[S.spSort];
  const base = S.f.src ? S.items.filter(i => station(i) === S.f.src) : S.items, done = base.filter(i => i.cat).length, n = base.length;
  $('#bar').style.width = n ? (done / n * 100) + '%' : '0';
  $('.progl span').textContent = S.f.src ? 'Avance de la estación' : 'Avance del proyecto'; $('#progtxt').textContent = n ? `${fmtN(done)} de ${fmtN(n)}` : '';
  $('.prog').title = n ? `${n - done} pendientes · ${done} clasificadas · ${Math.floor(done / n * 100)} %${S.f.src ? ` en «${S.f.src}»` : ''}` : '';
  $('#reveta').textContent = n ? eta(n - done).replace(/^ · /, '') : (S.srcs.length ? 'Las estaciones no tienen fotos ni videos' : '');
  if (S.revMode) { const cl = S.items.filter(i => i.cat), v = cl.filter(i => i.ver).length; $('#revcnt').hidden = false; $('#revcnt').textContent = `Revisor: ${v} verificadas · ${cl.length - v} por verificar`; } else $('#revcnt').hidden = true;
  const ns = S.stCount.size; $('#projsub').textContent = ns ? `${ns} ${ns === 1 ? 'estación' : 'estaciones'} · ${fmtN(S.items.length)} fotos` : ''; // 1.4.10: debajo del nombre del proyecto
  renderStations(); renderKeys();
}
/* Orden de la lista de especies del panel. Las teclas no cambian: cada especie conserva la suya. */
const SPSORT = { keys: 'Orden de las teclas (arrastrar para cambiar)', az: 'Alfabético (A-Z)', za: 'Alfabético (Z-A)', new: 'Más recientes primero', old: 'Orden de creación', most: 'Más fotos primero', least: 'Menos fotos primero', used: 'Usadas recientemente' };
function sortedCats() {
  const l = [...S.cats], n = c => (S.counts && S.counts.get(c)) || 0, cr = c => S.created[c] || (S.cats.indexOf(c) + 1), u = c => S.used[c] || 0;
  const by = { az: (a, b) => a.localeCompare(b, 'es'), za: (a, b) => b.localeCompare(a, 'es'), new: (a, b) => cr(b) - cr(a), old: (a, b) => cr(a) - cr(b), most: (a, b) => n(b) - n(a) || a.localeCompare(b, 'es'), least: (a, b) => n(a) - n(b) || a.localeCompare(b, 'es'), used: (a, b) => u(b) - u(a) || S.cats.indexOf(a) - S.cats.indexOf(b) }[S.spSort];
  return by ? l.sort(by) : l;
}
function menuAt(btn, ops) { // menú pequeño debajo de un botón: [[texto, función, título, marcado]]
  closeMenu(); const m = document.createElement('div'); m.id = 'cmenu';
  ops.forEach(o => { if (!o) { m.appendChild(document.createElement('hr')); return; } const [t, f, ti, chk] = o, b = document.createElement('button'); b.textContent = t; if (ti) b.title = ti; if (chk !== undefined) b.className = chk ? 'chk' : 'unchk'; b.onclick = () => { closeMenu(); f(); }; m.appendChild(b); });
  document.body.appendChild(m); const r = btn.getBoundingClientRect(); m.style.left = Math.max(8, Math.min(r.left, innerWidth - m.offsetWidth - 8)) + 'px'; m.style.top = Math.min(r.bottom + 4, innerHeight - m.offsetHeight - 8) + 'px'; return m;
}
// «…» de Especies: importar, exportar, ordenar y plegar
$('#spmore').onclick = e => { e.stopPropagation(); if (closeMenu()) return; menuAt(e.currentTarget, [['Importar lista de especies (.json)…', spImport, 'Carga una lista exportada por BioTrampa'], ['Cargar la lista de ejemplo: fauna del noreste de México', () => loadExampleList(false), `${NE_LIST.length} especies con su nombre científico`], ['Exportar la lista de especies', () => spExport(), 'Nombres, nombres científicos y teclas, para compartirla'], null,
  ...Object.entries(SPSORT).map(([k, t]) => [t, () => { S.spSort = k; sv('bt_spsort', k); renderSide(); if (k !== 'keys') toast('Las teclas de cada especie no cambian; solo cambia cómo se ve la lista. Para cambiar teclas vuelve a «Orden de las teclas» y arrastra.', 5000); }, '', S.spSort === k]), null, ['Plegar o desplegar todo', foldAll]]); };
const foldAll = () => { const secs = [...document.querySelectorAll('#sfiles .fsec')], close = secs.some(s => !s.classList.contains('closed')); secs.forEach(s => { s.classList.toggle('closed', close); folds[s.dataset.fold] = close; }); sv('bt_fold', folds); indSync(); };
function renderStations() { // avance por estación (primer nivel de carpetas)
  const m = S.stCount;
  const box = $('#stations'); box.textContent = '';
  for (const [s, [d, t]] of [...m].sort((a, b) => a[0].localeCompare(b[0]))) {
    const b = document.createElement('button'); b.className = 'stn' + (S.f.src === s ? ' on' : ''); b.dataset.src = s;
    b.innerHTML = '<span class="cn"></span><b></b><span class="dots sdots" title="Datos de la estación (coordenadas, fechas, cámara)">…</span>'; b.children[0].textContent = s; b.children[1].textContent = `${fmtN(d)} / ${fmtN(t)}`;
    const st = S.stations[s]; b.title = `${d} clasificadas de ${t} · Clic: ver solo esta estación · … o clic derecho: datos de la estación` + (st && st.start ? `\nInstalada ${st.start}${st.end ? ', retirada ' + st.end : ''}` : '\nSin datos de instalación'); box.appendChild(b);
  }
}
$('#stations').onclick = e => { const b = e.target.closest('.stn'); if (!b) return; if (e.target.closest('.sdots')) { e.stopPropagation(); return openStation(b.dataset.src); } if (!$('#lb').hidden) closeLb(); S.f.src = S.f.src === b.dataset.src ? null : b.dataset.src; applyFilters(); $('#gal').scrollTop = 0; };
$('#stations').oncontextmenu = e => { const b = e.target.closest('.stn'); if (!b) return; e.preventDefault(); openStation(b.dataset.src); };
$('aside').onclick = e => {
  const d = e.target.closest('.dots'); if (d) { e.stopPropagation(); catMenu(d, d.closest('.cat').dataset.cat); return; }
  const b = e.target.closest('.cat'); if (!b || b.dataset.cat === undefined) return; if (!$('#lb').hidden) closeLb(); // 1.4.16: los botones de Individuos (ficha, dudosas…) no son filtros: antes dejaban la galería vacía S.f.cat = S.f.cat === b.dataset.cat ? 'all' : b.dataset.cat; applyFilters(); $('#gal').scrollTop = 0; // otro clic en lo mismo: ver todas
};
$('aside').oncontextmenu = e => { const b = e.target.closest('.cat'), c = b && b.dataset.cat;
  if (c && (c === GH || S.cats.includes(c))) { e.preventDefault(); e.stopPropagation(); catMenu(b, c); } };
$('aside').onkeydown = e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('cat')) { e.preventDefault(); e.target.click(); } };
// arrastrar para reordenar especies (el orden decide las teclas 1-9)
// Arrastre con eventos del ratón (más fiable que el arrastrar-y-soltar nativo del navegador)
let dragCat = null, dragStart = null, dropAt = null, noClick = false;
$('#cats').addEventListener('pointerdown', e => {
  const d = e.target.closest('.cat'); if (!d || e.button !== 0 || e.target.closest('.dots') || d.dataset.cat === GH || !d.classList.contains('mv')) return;
  dragStart = { cat: d.dataset.cat, y: e.clientY, id: e.pointerId };
});
addEventListener('pointermove', e => {
  if (!dragStart) return;
  if (!dragCat) { if (Math.abs(e.clientY - dragStart.y) < 6) return; dragCat = dragStart.cat; document.body.classList.add('drag'); const el = $(`#cats .cat[data-cat="${CSS.escape(dragCat)}"]`); if (el) el.classList.add('dragging'); }
  e.preventDefault();
  const rows = [...document.querySelectorAll('#cats .cat.mv')]; let target = null, after = false;
  for (const r of rows) { const b = r.getBoundingClientRect(); if (e.clientY < b.top + b.height / 2) { target = r; break; } }
  if (!target && rows.length) { target = rows[rows.length - 1]; after = true; }
  document.querySelectorAll('#cats .dropb,#cats .dropa').forEach(x => x.classList.remove('dropb', 'dropa'));
  if (target) target.classList.add(after ? 'dropa' : 'dropb');
  dropAt = target ? { cat: target.dataset.cat, after } : null;
  const sb = $('#sfiles'), as = sb.getBoundingClientRect(); if (e.clientY < as.top + 30) sb.scrollTop -= 10; else if (e.clientY > as.bottom - 30) sb.scrollTop += 10; // desplaza el panel al acercarse al borde
});
function catDragEnd(commit) {
  const c = dragCat, t = dropAt; dragStart = null;
  if (!c) return;
  dragCat = null; dropAt = null; noClick = true; setTimeout(() => noClick = false, 0); if (!rzOn) document.body.classList.remove('drag');
  document.querySelectorAll('#cats .dragging,#cats .dropb,#cats .dropa').forEach(x => x.classList.remove('dragging', 'dropb', 'dropa'));
  if (!commit) return renderSide();
  if (t && t.cat !== c) { S.cats.splice(S.cats.indexOf(c), 1); S.cats.splice(S.cats.indexOf(t.cat) + (t.after ? 1 : 0), 0, c); sv('bt_cats', S.cats); toast(`"${c}" ahora usa la tecla ${keyOf(c) || '—'}.`, 2500); if (S.cur) show(S.cur); }
  renderSide();
}
addEventListener('pointerup', () => catDragEnd(true)); addEventListener('pointercancel', () => catDragEnd(false)); addEventListener('blur', () => catDragEnd(false));
addEventListener('pointermove', e => { if (dragCat && e.buttons === 0) catDragEnd(false); }, true);
$('#cats').addEventListener('click', e => { if (noClick) { e.stopPropagation(); e.preventDefault(); } }, true); // soltar no cuenta como clic
function closeMenu() { const m = $('#cmenu'); if (!m) return false; m.id = ''; // pierde el id al instante: un menú nuevo puede abrirse mientras este se desvanece
  if (!MOTION) { m.remove(); return true; } m.classList.add('bt-out'); m.addEventListener('animationend', () => m.remove()); setTimeout(() => m.remove(), 200); return true; }
function closePops(except) { let c = false; document.querySelectorAll('.popbox').forEach(p => { if (p !== except && !p.hidden) { p.hidden = true; p.previousElementSibling.setAttribute('aria-expanded', false); c = true; } }); return c; }
document.querySelectorAll('.pop > button').forEach(b => b.onclick = e => { e.stopPropagation(); const box = b.nextElementSibling; closePops(box); box.hidden = !box.hidden; b.setAttribute('aria-expanded', !box.hidden); });
document.querySelectorAll('.popbox').forEach(p => p.onclick = e => e.stopPropagation());
document.addEventListener('click', () => { closeMenu(); closePops(); });
function catMenu(btn, c) {
  closeMenu(); const m = document.createElement('div'); m.id = 'cmenu';
  const ops = [['Renombrar', () => locked(() => renameCat(c))], ['Nombre científico', () => setSci(c)]];
  if (S.cats.indexOf(c) >= 9) ops.push(['Cambiar tecla', () => setKey(c)]);
  ops.push(['Eliminar', () => locked(() => deleteCat(c))]);
  ops.forEach(([t, f]) => { const b = document.createElement('button'); b.textContent = t; if (t === 'Eliminar') b.className = 'danger'; b.onclick = () => { closeMenu(); f(); }; m.appendChild(b); });
  document.body.appendChild(m); const r = btn.getBoundingClientRect();
  m.style.left = Math.max(8, Math.min(r.left, innerWidth - m.offsetWidth - 8)) + 'px'; m.style.top = Math.min(r.bottom + 2, innerHeight - m.offsetHeight - 8) + 'px';
}
function setSci(c) {
  const v = prompt(`Nombre científico de "${c}" (déjalo vacío para quitarlo):`, S.sci[c] || ''); if (v === null) return;
  if (v.trim()) S.sci[c] = v.trim().replace(/\s+/g, ' '); else delete S.sci[c]; sv('bt_sci', S.sci); saveReg(); renderSide(); toast(v.trim() ? `"${c}" = ${S.sci[c]}` : 'Nombre científico quitado.');
}
function setKey(c) {
  const v = (prompt(`Letra para "${c}". Disponibles: ${LETTERS.split('').join(' ')}`, keyOf(c)) || '').trim().toUpperCase(); if (!v) return;
  if (!LETTERS.includes(v) || v.length !== 1) return toast('Esa letra no está disponible (F, H, U, N, C, R, M y L ya tienen función).');
  const other = [GH, ...S.cats].find(x => x !== c && keyOf(x) === v); if (other) { delete S.keys[other]; if (S.cats.indexOf(other) >= 9) S.keys[other] = keyOf(c); }
  S.keys[c] = v; sv('bt_keys', S.keys); renderSide(); if (S.cur) show(S.cur); toast(`"${c}" ahora usa la tecla ${v}.`);
}
$('#sort').value = S.sort; $('#burst').value = String(S.burst);
$('#evint').value = String(evMin()); $('#evint').onchange = e => { sv('bt_ev', +e.target.value); e.target.blur(); if (!$('#sum').hidden) renderSummary(); toast(+e.target.value ? `Eventos independientes: fotos de la misma especie y estación separadas por menos de ${e.target.value} min cuentan como un evento.` : 'Cada foto contará como un evento.', 5000); };
$('#sort').onchange = async e => { S.sort = e.target.value; sv('bt_sort', S.sort); e.target.blur(); await prepare(); applyFilters(); };
$('#burst').onchange = async e => { S.burst = +e.target.value; sv('bt_burst', S.burst); e.target.blur();
  if (S.burst && S.sort !== 'date') { S.sort = 'date'; $('#sort').value = 'date'; sv('bt_sort', 'date'); }
  await prepare(); applyFilters(); };
function updFilt() { const n = (S.f.st === 'unver' || S.f.st === 'susp' ? 1 : 0) + (S.f.dn !== 'all' ? 1 : 0) + (S.f.moon !== 'all' ? 1 : 0); const b = $('#filtbtn'), c = b.querySelector('.fcount'); c.textContent = n; c.hidden = !n; b.classList.toggle('act', n > 0); b.title = n ? `Filtros (${n} activo${n > 1 ? 's' : ''})` : 'Filtros: mostrar (pendientes, para revisar, sospechosas…), día/crepúsculo/noche y fase lunar'; }
$('#fclear').onclick = () => { S.f.q = ''; S.f.st = 'all'; S.f.dn = 'all'; S.f.moon = 'all'; $('#q').value = ''; $('#st').value = 'all'; $('#dn').value = 'all'; $('#moonf').value = 'all'; updFilt(); applyFilters(); closePops(); };
$('#dn').onchange = async e => { S.f.dn = e.target.value; e.target.blur(); updFilt(); await prepare(); applyFilters(); };
$('#moonf').onchange = async e => { S.f.moon = e.target.value; e.target.blur(); updFilt(); if (S.f.moon !== 'all') await prepare(true); applyFilters(); };
let qT = null; $('#q').oninput = e => { clearTimeout(qT); qT = setTimeout(() => { S.f.q = e.target.value; updFilt(); applyFilters(); }, 120); };
$('#q').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); if (S.view[0]) show(S.view[0]); } else if (e.key === 'Escape') { e.stopPropagation(); $('#q').blur(); } };
$('#st').onchange = async e => { S.f.st = e.target.value; e.target.blur(); updFilt(); if (S.f.st === 'empty') await findEmpty(); if (S.f.st === 'susp') await prepare(); applyFilters(); };
// Al abrir el embudo, cada opción muestra cuántas fotos hay (con la estación elegida)
$('#filtbtn').addEventListener('click', () => { if ($('#filtbox').hidden) return; const base = S.f.src ? S.items.filter(i => station(i) === S.f.src) : S.items, has = base.some(i => i.meta);
  const cnt = { all: base.length, pending: base.filter(i => !i.cat).length, done: base.filter(i => i.cat).length, rev: base.filter(i => i.rev).length, unver: base.filter(i => i.cat && !i.ver).length, susp: has ? base.filter(suspect).length : null, empty: S.empty ? base.filter(i => S.empty.has(i) && !i.cat).length : null };
  $('#st').querySelectorAll('option').forEach(o => { const t = o.textContent.replace(/ \(\d+\)$/, ''); o.textContent = cnt[o.value] == null || o.value === 'all' ? t : `${t} (${cnt[o.value]})`; });
  const pc = { all: base.length }; if (has) for (const i of base) { const p = period(i); if (p) pc[p] = (pc[p] || 0) + 1; }
  $('#dn').querySelectorAll('option').forEach(o => { const t = o.textContent.replace(/ \(\d+\)$/, ''); o.textContent = has || o.value === 'all' ? `${t} (${pc[o.value] || 0})` : t; }); });
/* Tamaño de las miniaturas: Ctrl (o Cmd) + rueda del ratón sobre la galería; en el trackpad, el gesto de pellizcar. Se recuerda. */
const TH = { v: Math.max(200, Math.min(360, +ls('bt_size', 200) || 200)), min: 200, max: 360 };
$('#grid').style.setProperty('--th', TH.v + 'px');
$('#gal').addEventListener('wheel', e => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault();
  const v = Math.max(TH.min, Math.min(TH.max, Math.round(TH.v * (e.deltaY < 0 ? 1.08 : 1 / 1.08)))); if (v === TH.v) return toast(`Miniaturas al ${v === TH.max ? 'máximo' : 'mínimo'}.`, 700);
  TH.v = v; $('#grid').style.setProperty('--th', v + 'px'); sv('bt_size', v); toast(`Miniaturas: ${v} px (Ctrl + rueda)`, 700); }, { passive: false });
$('#autohide').checked = ls('bt_autohide', true); $('#autohide').onchange = e => sv('bt_autohide', e.target.checked);
function addSpecies(raw) { // crea una especie; devuelve su nombre o null (si ya existe, devuelve la existente)
  const v = (raw || '').trim().replace(/\s+/g, ' '); if (!v) return null; if (!folder(v)) { toast('Escribe un nombre válido (sin \\ / : * ? " < > |).'); return null; }
  if (v.toLowerCase() === GH.toLowerCase()) return GH; const ex = S.cats.find(c => folder(c).toLowerCase() === folder(v).toLowerCase()); if (ex) return ex;
  S.cats.push(v); S.created[v] = Date.now(); sv('bt_created', S.created); sv('bt_cats', S.cats); renderSide(); return v;
}
$('#addlink').onclick = () => openNewSp(null); // misma ventana que en el visor (sin clasificar ninguna foto)
/* Secciones plegables de la barra (se recuerda) */
const folds = ls('bt_fold', {});
const indSync = () => { const c = $('.fsec[data-fold=ind]').classList.contains('closed'); $('#pind').hidden = c; if (!c && typeof renderIndPane === 'function') renderIndPane(); }; // Individuos solo se calcula desplegado
document.querySelectorAll('.fsec').forEach(sec => { const k = sec.dataset.fold; sec.classList.toggle('closed', folds[k] ?? false);
  const h = sec.querySelector('h2.fold'), tg = () => { sec.classList.toggle('closed'); folds[k] = sec.classList.contains('closed'); sv('bt_fold', folds); indSync(); };
  h.onclick = tg; h.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg(); } }; });
indSync();
$('#setbtn').onclick = () => openOver('#setdlg');
// Ajustes que se guardan en este navegador; "Restablecer" vuelve a los valores de fábrica (no toca fotos, especies ni proyectos)
$('#autost').checked = ls('bt_autost', true); $('#autost').onchange = e => sv('bt_autost', e.target.checked);
$('#bspeed').value = String(ls('bt_bspeed', 330)); $('#bspeed').onchange = e => { sv('bt_bspeed', +e.target.value); e.target.blur(); };
$('#bloop').checked = ls('bt_bloop', false); $('#bloop').onchange = e => sv('bt_bloop', e.target.checked);
$('#setreset').onclick = () => { if (!confirm('¿Volver a los ajustes de fábrica? No se tocan fotos, especies, proyectos ni datos de estaciones.')) return;
  ['bt_adv', 'bt_autost', 'bt_bspeed', 'bt_bloop', 'bt_ev', 'bt_sort', 'bt_burst', 'bt_obs', 'bt_focus', 'bt_size', 'bt_autohide', 'bt_spsort', 'bt_lupesz'].forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
  try { localStorage.removeItem('bt_confirm'); } catch (e) {} toast('Ajustes restablecidos. Se recarga la página…', 2000); setTimeout(() => location.reload(), 900); };
for (const [id, k] of [['proj', 'bt_proj'], ['cam', 'bt_cam']]) { $('#' + id).value = ls(k, ''); $('#' + id).oninput = e => sv(k, e.target.value); }

/* ---------- Tabla de atajos (en Opciones y con la tecla ?) ---------- */
let keySig = '';
function renderKeys(force) {
  const sig = [GH, ...S.cats].map(c => c + keyOf(c)).join('|'); if (!force && sig === keySig) return; keySig = sig;
  const rows = [['', 'En el visor'], ['← →', 'Foto anterior / siguiente'], ['Espacio', 'Siguiente foto pendiente'], ['Shift+Espacio', 'Pendiente anterior'],
    ['1-9 y letras', 'Clasificar en la especie (ver lista)'], ['Shift+tecla', 'Añadir o quitar una especie adicional (se anota; la foto no se copia)'],
    ['F', GH], ['U', 'Desmarcar'], ['R', 'Repetir especie y datos de la foto anterior'], ['M', 'Marcar o desmarcar para revisar'], ['↑ ↓', 'Más / menos individuos'], ['N', 'Escribir una nota'],
    ['C (mantener)', 'Ver la foto anterior de la misma cámara'], ['P', 'Reproducir la ráfaga (fotos seguidas de la misma cámara)'], ['/', 'Buscar o crear especie (cuando la lista está a la derecha)'], ['L', 'Lupa'], ['H', 'Solo foto'], ['+ − 0', 'Zoom (también rueda del ratón y doble clic)'],
    [', .', 'Video: cuadro anterior / siguiente'], ['Enter', 'Verificar la foto (modo revisor)'], ['Retroceso', 'Rechazar la clasificación y marcarla para revisar (modo revisor)'], ['Esc', 'Volver a la galería'],
    ['', 'En la galería'], ['Flechas', 'Moverse entre las miniaturas'], ['Enter', 'Abrir la miniatura marcada'], ['1-9, letras y F', 'Clasificar la miniatura marcada (o las seleccionadas)'], ['Ctrl/Cmd+A', 'Seleccionar todas las visibles'], ['Ctrl/Cmd + rueda', 'Cambiar el tamaño de las miniaturas (en el trackpad, pellizcar)'],
    ['Ctrl/Cmd+clic', 'Seleccionar varias miniaturas'], ['Shift+clic', 'Seleccionar todas entre la anterior y esta'], ['Clic derecho', 'Clasificar, marcar o separar una ráfaga sin abrir el visor'],
    ['', 'En todas partes'], ['Ctrl/Cmd+Z', 'Deshacer'], ['Ctrl/Cmd+Shift+Z', 'Rehacer'], ['?', 'Esta ayuda']];
  const sp = [GH, ...S.cats].map(c => [keyOf(c) || '—', c]);
  const html = '<table><tbody>' + rows.map(([k, v]) => k ? `<tr><td><kbd>${esc(k)}</kbd></td><td>${esc(v)}</td></tr>` : `<tr><td colspan="2"><b>${esc(v)}</b></td></tr>`).join('') + '</tbody></table>'
    + '<h3>Teclas de especies</h3><table><tbody>' + sp.map(([k, v]) => `<tr><td><kbd>${esc(k)}</kbd></td><td>${esc(v)}</td></tr>`).join('') + '</tbody></table>'
    + '<p class="hint tiny">Ctrl/Cmd/Alt + tecla nunca clasifican. Para cambiar cuáles especies usan 1-9, arrástralas en el panel (con el orden «Orden de las teclas»).</p>';
  document.querySelectorAll('.keytable').forEach(k => k.innerHTML = html);
}
const openOver = id => { const o = $(id); if (o.hidden) o._ret = document.activeElement; o.hidden = false; }, closeOver = all => { // cierra solo la ventana de arriba (p. ej. Editar estación sin cerrar el Resumen); all = true cierra todas
  const open = [...document.querySelectorAll('.over')].filter(o => !o.hidden); if (!open.length) return false; (all === true ? open : open.slice(-1)).forEach(o => { o.hidden = true; if (o.contains(document.activeElement)) document.activeElement.blur(); const r = o._ret; o._ret = null; if (r && r.isConnected && r !== document.body && !r.closest('[hidden]')) r.focus({ preventScroll: true }); }); return true; };
['#ns_name', '#ns_sci'].forEach(id => $(id).addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); $('#ns_ok').click(); } }));
$('#ns_cancel').onclick = () => closeOver();
$('#helpbtn').onclick = () => { renderKeys(true); openOver('#help'); };
$('#helpprint').onclick = () => { document.body.classList.add('printhelp'); print(); setTimeout(() => document.body.classList.remove('printhelp'), 500); };
document.querySelectorAll('.pclose').forEach(b => b.onclick = () => closeOver());
document.querySelectorAll('.over').forEach(o => o.onclick = e => { if (e.target === o) closeOver(); });

/* ---------- Visor ---------- */
let bigUrl = null, pre = []; // pre = fotos precargadas [{it, url}]
$('#big').onerror = () => { if ($('#big').getAttribute('src')) $('#lbmsg').textContent = 'No se puede mostrar: el archivo está dañado o no es una foto.'; };
async function urlFor(it) { // { url: foto completa, surl: versión de pantalla (o null) }, ya decodificada para no trabar la pantalla
  const p = pre.find(x => x.it === it && x.h === it.h); if (p) { pre = pre.filter(x => x !== p); await p.ready; if (p.url) return { url: p.url, surl: p.surl }; }
  const f = await it.h.getFile(), url = URL.createObjectURL(f), surl = await screenUrl(f), im = new Image(); im.src = surl || url; await im.decode().catch(() => {}); return { url, surl };
}
function dropPre(o) { if (o.url) URL.revokeObjectURL(o.url); if (o.surl) URL.revokeObjectURL(o.surl); }
function useFull() { // cambia a la foto completa (zoom, lupa o ventana más grande) sin congelar: primero la decodifica
  const im = $('#big'); if (!bigSUrl || !bigUrl || cmpUrl || im.getAttribute('src') !== bigSUrl || fullLoading) return;
  const want = bigUrl, d = new Image(); fullLoading = true; d.src = want;
  d.decode().catch(() => {}).then(() => { fullLoading = false; if (bigUrl === want && im.getAttribute('src') === bigSUrl && !cmpUrl) im.src = want; });
}
let bigSUrl = null, fullLoading = false;
function preload(list) { // precarga la foto siguiente y la anterior para que el visor cambie al instante
  for (const it of list) { if (!it || pre.some(x => x.it === it)) continue;
    const e = { it, h: it.h, url: null, surl: null, im: null }; pre.push(e); while (pre.length > 3) dropPre(pre.shift());
    e.ready = it.h.getFile().then(async f => { e.url = URL.createObjectURL(f); e.surl = await screenUrl(f); e.im = new Image(); e.im.src = e.surl || e.url; return e.im.decode().catch(() => {}); }).catch(() => { pre = pre.filter(x => x !== e); }); }
}
async function jpegCut(it) { // un JPG completo termina con la marca FF D9; si falta al final, el archivo está cortado (tarjeta retirada a mitad de escritura, copia incompleta…)
  if (!/\.jpe?g$/i.test(it.name)) return false;
  try { const f = await it.h.getFile(); if (f.size < 4) return true; const b = new Uint8Array(await f.slice(Math.max(0, f.size - 4096)).arrayBuffer()); for (let i = b.length - 2; i >= 0; i--) if (b[i] === 0xFF && b[i + 1] === 0xD9) return false; return true; } catch (e) { return false; }
}
function setViewer(on) { // la galería y el visor comparten el área de trabajo
  const was = document.body.classList.contains('viewer');
  if (on && !was && innerWidth > 760 && $('#autohide').checked && !document.body.classList.contains('noside')) { S.sideAuto = true; setSide(false, false); } // la foto ocupa todo: la barra lateral sobra
  else if (!on && was && S.sideAuto) { S.sideAuto = false; setSide(true, false); }
  document.body.classList.toggle('viewer', on);
}
async function show(it) {
  const same = S.cur === it, prevSt = S.cur ? station(S.cur) : null; S.cur = it; if (!same) obsTemp = null; closePops(); $('#lb').hidden = false; endCompare(); setViewer(true);
  if (!same) noteSeen(it);
  if (!same) { $('#lbmsg').textContent = 'Cargando…'; V.z = 1; V.x = V.y = 0; const vk = S.vkeep[station(it)]; if (vk) { V.b = vk[0]; V.c = vk[1]; } else if (prevSt && S.vkeep[prevSt]) { V.b = V.c = 1; } $('#bri').value = V.b; $('#con').value = V.c; $('#vkeep').checked = !!vk; applyV(); S.act = it.cat; S.shownAt = performance.now(); }
  if (!hasCat(it, S.act)) S.act = it.cat;
  $('#lb').classList.toggle('focus', focusOn);
  const i = S.view.indexOf(it), g = groupOf(it);
  const pv = S.view.filter(x => S.blind ? !x.bl : S.revMode ? x.cat && !x.ver : !x.cat), pi = pv.indexOf(it);
  const pend = S.revMode ? (pi >= 0 ? `por verificar ${pi + 1} de ${pv.length}` : `${pv.length} por verificar`) : pi >= 0 ? `pendiente ${pi + 1} de ${pv.length}` : `${pv.length} pendiente${pv.length === 1 ? '' : 's'} en esta vista`;
  $('#lbtitle').innerHTML = `<b>${esc(it.name)}</b> · ${i + 1} de ${S.view.length}`; // 1.4.22: solo nombre y posición
  $('#lbtitle').title = g.length > 1 ? `Ráfaga de ${g.length}: se clasifican juntas` : '';
  $('#vtM').classList.toggle('on', !!it.rev);
  const bb = $('#lbburst'); bb.hidden = g.length < 2; if (g.length > 1) bb.textContent = `Ráfaga · ${g.indexOf(it) + 1} de ${g.length}`;
  $('#fbar').textContent = [it.origName || it.name, catsTxt(it), pi >= 0 ? `pendiente ${pi + 1} de ${pv.length}` : `${pv.length} pendientes`].join(' · ');
  const vid = isVideo(it.name); $('#big').hidden = vid; $('#bigv').hidden = !vid; if (vid) setLupe(false, true);
  if (!same || !(vid ? $('#bigv').getAttribute('src') : $('#big').getAttribute('src'))) {
    try { const u = vid ? { url: URL.createObjectURL(await it.h.getFile()), surl: null } : await urlFor(it), url = u.url;
      if (S.cur !== it) { URL.revokeObjectURL(url); if (u.surl) URL.revokeObjectURL(u.surl); return; }
      if (bigUrl) URL.revokeObjectURL(bigUrl); if (bigSUrl) URL.revokeObjectURL(bigSUrl); bigUrl = url; bigSUrl = u.surl; fullLoading = false;
      if (vid) { $('#big').removeAttribute('src'); $('#bigv').src = url; $('#lbmsg').textContent = /\.avi$/i.test(it.name) ? 'Chrome no reproduce videos AVI; puedes clasificarlo igual.' : ''; }
      else { $('#bigv').removeAttribute('src'); $('#big').src = bigSUrl || bigUrl; $('#lbmsg').textContent = ''; jpegCut(it).then(cut => { if (cut && S.cur === it && !$('#lbmsg').textContent) $('#lbmsg').textContent = 'Esta foto parece incompleta (el archivo termina antes de tiempo): se muestra solo la parte que se pudo leer.'; }); if (V.z > 1 || lupeOn) useFull(); if (!burstPlay && !matchMedia('(prefers-reduced-motion: reduce)').matches) $('#big').animate([{ opacity: .55 }, { opacity: 1 }], { duration: 150, easing: 'ease-out' }); } }
    catch (e) { $('#big').removeAttribute('src'); $('#lbmsg').textContent = 'No se pudo leer: ' + e.message; }
  }
  preload([S.view[i + 1], S.view[i - 1]].filter(x => x && !isVideo(x.name)));
  renderPresets(it); if (!ls('bt_tour2', false) && $('#tour').hidden) setTimeout(() => startTour('viewer'), 400);
  const m = await loadMeta(it); if (S.cur !== it) return;
  const fm = x => x || 'desconocido', off = offOf(it), per = period(it), sun = sunOf(it), moon = m.date ? moonOf(fixTs(it)) : null;
  const orig = it.origParts ? [...(it.origParts.length ? it.origParts : ['(raíz)']), it.origName].join('/') : '';
  const cap = m.date ? m.date + ' ' + m.time + (off ? ` → corregida ${ymd(fixTs(it))} ${hms(fixTs(it))} (${fmtOff(off)})` : '') + (per ? ' · ' + PER[per] : '') + (m.video ? ' (metadatos del video)' : '') : 'desconocida';
  // línea corta siempre visible; el resto en "Detalles"
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'], ft = new Date(fixTs(it));
  const short = [m.date ? `${ft.getDate()} ${MES[ft.getMonth()]} ${ft.getFullYear()} · ${pad(ft.getHours())}:${pad(ft.getMinutes())}${off ? ' (corregida)' : ''}` : 'Sin fecha de captura', per ? PER[per] : '', it.rev ? '⚑ para revisar' : '', it.ver ? '✓ verificada' + (it.verBy ? ' por ' + it.verBy : '') : ''].filter(Boolean);
  $('#info').textContent = short.join(' · ');
  if (suspect(it)) { const b = document.createElement('button'); b.className = 'warnlink'; b.textContent = '⚠ fecha sospechosa: corregir la hora de esta cámara…'; b.title = 'La fecha es anterior a 2005, está en el futuro o cae fuera de las fechas de la estación'; b.onclick = () => $('#fixtime').click(); $('#info').append(' · ', b); }
  $('#det').innerHTML = ''; [['Captura', cap], ['Modificado', modOf(it) ? new Date(modOf(it)).toLocaleString() : 'desconocido'], ['Cámara', fm(m.model)], ['GPS', m.lat ? m.lat + ', ' + m.lon : 'desconocido'], ['Sol', sun ? `sale ${hms(sun.rise).slice(0, 5)}, se pone ${hms(sun.set).slice(0, 5)}` : (m.date ? 'sin GPS (día/noche aproximado)' : 'desconocido')], ['Luna', moon ? `${moon.name} (${moon.ill} % iluminada)` : 'desconocida'], ['Carpeta', it.parts.join('/') || '(raíz)'], ...(it.cat && orig ? [['Origen', orig]] : [])]
    .forEach(([k, v]) => { const d = document.createElement('div'); d.className = 'm'; d.innerHTML = '<dt></dt><dd></dd>'; d.children[0].textContent = k; d.children[1].textContent = v; $('#det').appendChild(d); });
  renderObs(it);
  // Fila de especies con su tecla, siempre a la vista; las que no caben en 2 renglones pasan a «Más especies» (tecla /)
  const row = $('#lbcats'), list = $('#lbslist'), more = $('#lbmore'); row.textContent = ''; // «Más especies» vive al final de la fila list.textContent = ''; if (!same) $('#lbq').value = '';
  catCnt = new Map(); for (const x of S.items) if (station(x) === station(it)) for (const c of allCats(x)) catCnt.set(c, (catCnt.get(c) || 0) + 1);
  const mk = c => { const b = document.createElement('button'), k = keyOf(c), extra = (it.extras || []).some(x => x.cat === c);
    b.innerHTML = '<kbd></kbd><span></span>'; b.children[0].textContent = k || ''; b.children[1].textContent = c; b.dataset.cat = c;
    b.className = (c === GH ? 'gh ' : '') + ((S.blind ? it.bl === c : it.cat === c) ? 'on' : extra && !S.blind ? 'on2' : '');
    b.title = c + (S.sci[c] ? ` (${S.sci[c]})` : '') + (k ? ` · tecla ${k}` : '') + ' · ' + (it.cat === c ? 'Especie principal. Clic para quitar la clasificación (U)' : extra ? 'Especie adicional. Clic para quitarla' : 'Clic: clasificar · Shift+clic: añadir como especie adicional');
    b.onclick = e => { closePops(); if (S.blind) return it.bl === c ? unclassifyCur() : classifyCur(c); if (it.cat === c) unclassifyCur(); else if (extra || e.shiftKey) toggleExtraCur(c); else classifyCur(c); }; return b; };
  for (const c of [...S.cats, GH]) { row.appendChild(mk(c)); const r = mk(c); r.classList.add('srow'); list.appendChild(r); }
  row.appendChild(more); fitCats();
}
let catCnt = new Map();
function fitCats() { // máximo 2 renglones: se esconden primero las menos usadas en esta estación (nunca Fantasmas ni las de esta foto)
  const row = $('#lbcats'), more = $('#lbmore'), btns = [...row.querySelectorAll(':scope > button[data-cat]')]; if (!btns.length) return; // el buscador también vive dentro de la fila
  btns.forEach(b => b.hidden = false);
  const label = () => { const n = btns.filter(b => b.hidden).length; $('#lbmorebtn').innerHTML = (n ? `Más especies · ${n}` : 'Buscar o crear') + '<kbd>/</kbd>'; };
  const order = btns.filter(b => b.dataset.cat !== GH && !/\bon2?\b/.test(b.className)).sort((a, b) => (catCnt.get(a.dataset.cat) || 0) - (catCnt.get(b.dataset.cat) || 0) || S.cats.indexOf(b.dataset.cat) - S.cats.indexOf(a.dataset.cat));
  label(); const h = btns[0].offsetHeight;
  for (const b of order) { if (more.offsetTop - row.offsetTop < h * 1.8) break; b.hidden = true; label(); } // la fila baja al encogerse: se mide cada vez
  $('#lbslist').querySelectorAll('.srow').forEach(r => r.classList.toggle('vis', !row.querySelector(`:scope > button[data-cat="${CSS.escape(r.dataset.cat)}"]`).hidden));
  filterLbq();
}
function openNewSp(it) {
  $('#ns_name').value = ''; $('#ns_sci').value = ''; $('#ns_hint').textContent = it ? 'La foto que estás viendo se clasificará en esta especie.' : 'Se añade a la lista con la siguiente tecla libre.'; openOver('#nsdlg'); setTimeout(() => $('#ns_name').focus(), 0);
  $('#ns_ok').onclick = () => { const name = $('#ns_name').value, sci = $('#ns_sci').value.trim().replace(/\s+/g, ' ');
    if (!name.trim()) { toast('Escribe el nombre de la especie.', 2500); return $('#ns_name').focus(); }
    const had = S.cats.length, v = addSpecies(name); if (!v) return $('#ns_name').focus();
    if (sci && v !== GH && !S.sci[v]) { S.sci[v] = sci; sv('bt_sci', S.sci); saveReg(); }
    closeOver(); if (S.cats.length > had) toast(`"${v}" creada con la tecla ${keyOf(v) || '(ninguna libre)'}.`, 2500); else toast(`"${v}" ya existía; se usó esa especie.`, 2500);
    if (it && S.cur === it) classifyCur(v); else renderSide(); };
}
function filterLbq() { // sin texto: las especies que no caben en la fila; con texto: todas las que coinciden (nombre o nombre científico)
  const raw = $('#lbq').value.trim(), q = norm(raw); let n = 0;
  $('#lbslist').querySelectorAll('.srow').forEach(r => { const ok = q ? norm(r.dataset.cat).includes(q) || norm(S.sci[r.dataset.cat]).includes(q) : !r.classList.contains('vis'); r.hidden = !ok; r.classList.remove('act'); if (ok) n++; });
  const f = $('#lbslist .srow:not([hidden])'); if (f) f.classList.add('act');
  const none = $('#lbsnone'); none.hidden = n > 0;
  if (!n) { none.textContent = raw ? 'Ninguna coincide. ' : 'Todas tus especies están en la fila. Escribe para crear una nueva.'; if (raw) { const b = document.createElement('button'); b.textContent = `Crear «${raw}» (Enter)`; b.onclick = () => newSpFromSearch(); none.appendChild(b); } } }
function newSpFromSearch() { const raw = $('#lbq').value.trim(); if (!raw || !S.cur) return; $('#lbq').value = ''; closePops(); $('#lbq').blur(); openNewSp(S.cur); $('#ns_name').value = raw; }
$('#lbq').oninput = filterLbq;
$('#lbq').onkeydown = e => { e.stopPropagation(); const rows = [...$('#lbslist').querySelectorAll('.srow:not([hidden])')], i = rows.findIndex(r => r.classList.contains('act'));
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (!rows.length) return; const nx = rows[(i + (e.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length]; rows.forEach(r => r.classList.remove('act')); nx.classList.add('act'); nx.scrollIntoView({ block: 'nearest' }); }
  else if (e.key === 'Enter') { e.preventDefault(); const r = rows[i] || rows[0]; if (r) { $('#lbq').value = ''; $('#lbq').blur(); r.click(); } else newSpFromSearch(); }
  else if (e.key === 'Escape') { $('#lbq').value = ''; $('#lbq').blur(); closePops(); } };
$('#lbmorebtn').addEventListener('click', () => { if (!$('#lbside').hidden) { filterLbq(); setTimeout(() => $('#lbq').focus(), 0); } });
new ResizeObserver(() => { if (!$('#lb').hidden) fitCats(); }).observe($('.lbstage')); // la ventana, la barra lateral o el panel Observación cambian el ancho
// Reproducir la ráfaga (tecla P): pasa sus fotos a unas 3 por segundo y vuelve a la primera
let burstPlay = null;
function burstSeq(it) { const g = groupOf(it); if (g.length > 1) return g;
  if (!goodTs(it)) return [it]; const same = S.view.filter(x => srcOf(x) === srcOf(it) && goodTs(x) && !isVideo(x.name)).sort((a, b) => fixTs(a) - fixTs(b)); // sin agrupar ráfagas: fotos seguidas de la misma cámara (≤ 10 s)
  let i = same.indexOf(it), a = i, b = i; while (a > 0 && fixTs(same[a]) - fixTs(same[a - 1]) <= 10000) a--; while (b < same.length - 1 && fixTs(same[b + 1]) - fixTs(same[b]) <= 10000) b++; return same.slice(a, b + 1); }
function stopBurst() { if (!burstPlay) return; clearTimeout(burstPlay.t); const f = burstPlay.first; burstPlay = null; $('#lb').classList.remove('playing'); if (S.cur !== f && !$('#lb').hidden) show(f); }
let burstPrep = false;
async function playBurst() {
  if (burstPlay) return stopBurst(); const it = S.cur; if (!it || burstPrep) return;
  if (groupOf(it).length < 2) { // sin agrupar ráfagas hace falta la fecha de las fotos vecinas de la misma cámara, que solo se lee al verlas: se leen ahora (±20 fotos)
    const same = S.view.filter(x => srcOf(x) === srcOf(it) && !isVideo(x.name)), i = same.indexOf(it), near = same.slice(Math.max(0, i - 20), i + 21).filter(x => !x.meta);
    if (near.length) { burstPrep = true; try { await Promise.all(near.map(x => loadMeta(x).catch(() => null))); } finally { burstPrep = false; } if (S.cur !== it || burstPlay || $('#lb').hidden) return; } }
  const seq = burstSeq(it);
  if (seq.length < 2) return toast('Esta foto no tiene fotos seguidas de la misma cámara para reproducir.', 3000);
  const ms = +ls('bt_bspeed', 330), loop = ls('bt_bloop', false);
  preload(seq.slice(0, 3)); burstPlay = { first: it, i: 0, seq }; $('#lb').classList.add('playing'); toast(`Reproduciendo la ráfaga (${seq.length} fotos)${loop ? ' en bucle' : ''}… P o cualquier tecla para detener.`, 2500);
  const tick = () => { if (!burstPlay) return; const bp = burstPlay; if (bp.i >= bp.seq.length) { if (!loop) return stopBurst(); bp.i = 0; } show(bp.seq[bp.i]); preload([bp.seq[bp.i + 1] || bp.seq[0], bp.seq[bp.i + 2]].filter(Boolean)); bp.i++; bp.t = setTimeout(tick, ms); };
  tick();
}
function closeLb() { if (burstPlay) { clearTimeout(burstPlay.t); burstPlay = null; $('#lb').classList.remove('playing'); }
  const was = S.cur; $('#lb').hidden = true; S.cur = null; setViewer(false); endCompare(); setLupe(false, true); $('#bigv').pause();
  if (was && S.view.includes(was)) { setKf(was); } $('#gal').focus({ preventScroll: true });
  const old = [bigUrl, bigSUrl].filter(Boolean); bigUrl = null; bigSUrl = null;
  setTimeout(() => { if ($('#lb').hidden) { $('#big').removeAttribute('src'); $('#bigv').removeAttribute('src'); } old.forEach(u => URL.revokeObjectURL(u)); }, MOTION ? 220 : 0); } // la foto se queda mientras el visor se desvanece
const step = d => { const i = S.view.indexOf(S.cur) + d; if (S.view[i]) show(S.view[i]); };
function stepPending(d) { // siguiente/anterior foto pendiente (sin especie); en modo revisor: siguiente clasificada sin verificar
  const ok = S.blind ? x => !x.bl : S.revMode ? x => x.cat && !x.ver : x => !x.cat;
  const i = S.view.indexOf(S.cur); for (let k = i + d; k >= 0 && k < S.view.length; k += d) if (ok(S.view[k])) return show(S.view[k]);
  toast(S.revMode ? 'No hay más fotos clasificadas sin verificar en esa dirección.' : d > 0 ? 'No hay más fotos pendientes hacia adelante.' : 'No hay fotos pendientes hacia atrás.', 2500);
}
$('#lbclose').onclick = e => { e.stopPropagation(); closeLb(); }; $('#prev').onclick = () => step(-1); $('#next').onclick = () => step(1);
// Barra de herramientas del visor: los mismos atajos, a la vista
$('#vtools').onclick = e => { const b = e.target.closest('button[data-vt]'); if (!b || !S.cur) return; const k = b.dataset.vt;
  if (k === 'C') { cmpUrl ? endCompare() : startCompare(); } else if (k === 'R') repeatPrev(); else if (k === 'M') toggleRev(); else if (k === 'L') setLupe(!lupeOn); else if (k === 'P') playBurst(); else if (k === 'H') setFocus(true); b.blur(); };
// Solo foto: la barra con la especie y el avance aparece al mover el ratón
let fbT = null; $('#lb').addEventListener('pointermove', () => { if (!focusOn) return; $('#lb').classList.add('mv'); clearTimeout(fbT); fbT = setTimeout(() => $('#lb').classList.remove('mv'), 1500); });

/* ---------- Datos de la observación: individuos, sexo, edad, comportamiento y nota ---------- */
function obsOf(it, c) { it.obs = it.obs || {}; return it.obs[c] = it.obs[c] || {}; }
let obsTemp = null; // null = automático; true/false = lo que el usuario eligió para esta foto (botón Datos o tecla N)
const hasData = it => !!it.note || Object.values(it.obs || {}).some(o => o.sex || o.age || o.beh || o.id || o.fl || o.q);
$('#obsbtn').onclick = () => { const on = $('#obs').hidden; sv('bt_obs', on); obsTemp = on; if (S.cur) renderObs(S.cur); }; // el botón siempre abre o cierra
const SEXIC = { Macho: '<circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M15 4h5v5"/>', Hembra: '<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>', Desconocido: '<path d="M9 9a3 3 0 1 1 4 2.8c-.6.3-1 .9-1 1.6V15"/><circle cx="12" cy="19" r=".6" fill="currentColor"/>' };
function renderObs(it) {
  const box = $('#obsf'), cnt = $('#cnt'), nb = $('#obsn'), cats = allCats(it); box.textContent = ''; cnt.textContent = ''; nb.textContent = '';
  const open = obsTemp ?? ls('bt_obs', null) ?? (S.items.some(hasData) || hasData(it) || indOn(it.cat)); // lo último que eligió el usuario manda; si nunca eligió: abierto si el proyecto ya usa datos de observación o si la especie se identifica por individuo
  $('#obs').hidden = !open; $('#obsbtn').classList.toggle('on', open); $('#obsbtn').setAttribute('aria-expanded', open);
  $('#obsbtn').title = 'Observación: sexo, edad, comportamiento, nota y datos de la foto' + (hasData(it) ? ' (esta foto tiene datos)' : '');
  $('#obsbtn').classList.toggle('has', hasData(it));
  const ic = [S.act, ...cats].find(indOn), io = ic && it.obs && it.obs[ic]; $('#idbtn').hidden = !ic; $('#idbtn').onclick = () => openIdent(it, ic); // botón de huella: directo a Identificar individuo
  $('#idbtn').lastChild.textContent = io && io.id ? io.id : io && io.ns ? 'No se sabe' : 'Individuo';
  const mk = (tag, props, kids = []) => { const e = Object.assign(document.createElement(tag), props); kids.forEach(k => e.appendChild(k)); return e; };
  const sec = (lbl, ...kids) => mk('div', { className: 'osec' }, [mk('p', { className: 'ok', textContent: lbl }), ...kids]);
  if (cats.length) {
    const o = obsOf(it, S.act || it.cat);
    const name = cats.length > 1 ? mk('span', { className: 'chips' }, cats.map(c => { const b = mk('button', { textContent: c, className: c === S.act ? 'on' : '', title: 'Elegir a qué especie se aplican los datos' }); b.onclick = () => { S.act = c; renderObs(it); }; return b; })) : mk('span', { className: 'oname', textContent: cats[0] });
    const minus = mk('button', { textContent: '−', title: 'Menos individuos (↓)' }), plus = mk('button', { textContent: '+', title: 'Más individuos (↑)' });
    minus.onclick = () => countStep(-1); plus.onclick = () => countStep(1);
    cnt.append(sec('Especie', name), sec('Individuos', mk('span', { className: 'ocount' }, [minus, mk('b', { textContent: o.n || '—' }), plus])));
    const opts = (list, key, cls, fill) => mk('div', { className: 'oopts ' + cls }, list.filter(Boolean).map(v => { const b = mk('button', { title: v, className: o[key] === v ? 'on' : '' }); fill(b, v); // un clic elige; otro clic en el mismo lo quita
      b.onclick = () => { o[key] = o[key] === v ? '' : v; if (!o[key]) delete o[key]; saveReg(); renderObs(it); }; return b; }));
    box.appendChild(sec('Sexo', opts(SEX, 'sex', 'c3', (b, v) => { b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true">${SEXIC[v]}</svg>`; b.setAttribute('aria-label', v); })));
    box.appendChild(sec('Edad', opts(AGE, 'age', 'c4', (b, v) => { b.textContent = v === 'Desconocido' ? 'No sé' : v; })));
    const vals = new Set(BEH); S.items.forEach(i => Object.values(i.obs || {}).forEach(x => x.beh && vals.add(x.beh))); // los comportamientos que ya escribiste también salen como botón
    const chips = mk('div', { className: 'ochips' }, [...vals].map(v => { const b = mk('button', { textContent: v, className: o.beh === v ? 'on' : '' }); b.onclick = () => { o.beh = o.beh === v ? '' : v; if (!o.beh) delete o.beh; saveReg(); renderObs(it); }; return b; }));
    const add = mk('button', { textContent: '+ Otro', className: 'add', title: 'Escribir otro comportamiento' });
    add.onclick = () => { const inp = mk('input', { placeholder: 'escribe y Enter…', className: 'obeh' }); add.replaceWith(inp); inp.focus();
      const done = ok => { const v = inp.value.trim(); if (ok && v) { o.beh = v; saveReg(); } renderObs(it); };
      inp.onkeydown = e => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); done(e.key === 'Enter'); } }; inp.onblur = () => done(true); };
    chips.appendChild(add); box.appendChild(sec('Comportamiento', chips));
  }
  const note = mk('textarea', { id: 'note', value: it.note || '', placeholder: 'Escribe algo sobre esta foto…', rows: 2 });
  note.onchange = () => { it.note = note.value.trim(); saveReg(); refreshCards(); }; note.onkeydown = e => { if ((e.key === 'Enter' && !e.shiftKey) || e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (e.key === 'Escape') note.value = it.note || ''; note.blur(); } };
  nb.appendChild(sec('Nota (N)', note));
  if (it.rev) { const rw = mk('input', { value: it.revWhy || '', placeholder: 'p. ej. ¿ocelote o tigrillo?' }); rw.onchange = () => { it.revWhy = rw.value.trim(); saveReg(); }; // sale en el CSV
    rw.onkeydown = e => { if (e.key === 'Enter' || e.key === 'Escape') { e.stopPropagation(); rw.blur(); } }; nb.appendChild(sec('Motivo de la revisión', rw)); }
  $('#presetbtn').hidden = !cats.length; $('#presetbtn').onclick = () => savePreset(it);
}
function countStep(d) {
  const it = S.cur; if (!it) return; if (!it.cat) return toast('Primero asigna una especie.', 2000);
  const o = obsOf(it, S.act || it.cat), v = (o.n || 0) + d; o.n = v >= 1 ? Math.min(v, 999) : undefined; if (!o.n) delete o.n;
  saveReg(); renderObs(it);
}

/* ---------- Datos rápidos, repetir, revisar y verificar ---------- */
function renderPresets(it) {
  const box = $('#presets'); box.textContent = ''; box.hidden = !S.presets.length; if (!S.presets.length) return;
  const l = document.createElement('span'); l.textContent = 'Datos rápidos:'; box.appendChild(l);
  S.presets.forEach((p, i) => { const b = document.createElement('button'); b.textContent = p.name; b.title = 'Aplicar a esta foto · clic derecho: eliminar';
    b.onclick = () => applyData(S.cur, p, 'Dato rápido'); b.oncontextmenu = e => { e.preventDefault(); if (confirm(`¿Eliminar el dato rápido "${p.name}"?`)) { S.presets.splice(i, 1); sv('bt_presets', S.presets); renderPresets(S.cur); } }; box.appendChild(b); });
}
const cleanObs = o => { const r = {}; for (const [c, v] of Object.entries(o || {})) { const x = {}; for (const k of ['n', 'sex', 'age', 'beh']) if (v[k]) x[k] = v[k]; if (Object.keys(x).length) r[c] = x; } return r; };
function savePreset(it) {
  if (!it || !it.cat) return; const o = (it.obs && it.obs[it.cat]) || {};
  const def = [allCats(it).join(' + '), o.n ? o.n + ' ind.' : '', o.sex, o.age, o.beh].filter(Boolean).join(' · ');
  const name = prompt('Nombre del dato rápido (se aplicará con un clic):', def); if (!name || !name.trim()) return;
  S.presets.push({ name: name.trim(), cat: it.cat, extras: (it.extras || []).map(x => x.cat), obs: cleanObs(it.obs) }); sv('bt_presets', S.presets); renderPresets(it); toast(`Dato rápido "${name.trim()}" guardado; aparece debajo de los botones de especie.`, 4000);
}
// Aplica especie(s) y datos a la foto actual (dato rápido o repetir la foto anterior)
function applyData(it, d, label) {
  if (!it || !d || !d.cat) return; if (S.blind) return toast('En la revisión a ciegas no se usan datos rápidos ni «Repetir».', 3000);
  const valid = c => c === GH || S.cats.includes(c); if (!valid(d.cat)) return toast(`La especie "${d.cat}" ya no existe.`, 4000);
  return locked(async () => {
    const s = snap(it), idx = S.view.indexOf(it), nxt = S.view[idx + 1] || S.view[idx - 1];
    try { if (it.cat !== d.cat) await classifyOne(it, d.cat); await setExtras(it, (d.extras || []).filter(valid));
      for (const [c, v] of Object.entries(cleanObs(d.obs))) if (hasCat(it, c)) { const keep = Object.assign({}, it.obs && it.obs[c]); for (const k of ['n', 'sex', 'age', 'beh']) delete keep[k]; it.obs[c] = Object.assign(keep, v); } } // conserva lo del individuo (código, lado, zonas, rosetas…)
    catch (e) { console.warn(e); return toast(`No se pudo aplicar: ${e.message}`, 8000); }
    pushHist([s]); saveReg(); S.rate.push([Date.now(), 1]); applyFilters([it]);
    if ($('#adv').checked && nxt && S.view.includes(nxt)) show(nxt); else if (S.view.includes(it)) show(it); else closeLb();
    const o = cleanObs(d.obs)[d.cat] || {}, det = [o.n ? o.n + ' ind.' : '', o.sex, o.age, o.beh].filter(Boolean).join(', ');
    toast(`${label}: ${allCats(it).join(' + ')}${det ? ` (${det})` : ''} aplicado a ${it.name}.`, 3500, true);
  });
}
function repeatPrev() {
  const it = S.cur; if (!it) return; const i = S.view.indexOf(it); let p = null;
  for (let k = i - 1; k >= 0; k--) if (S.view[k].cat) { p = S.view[k]; break; }
  if (!p) return toast('No hay una foto clasificada antes de esta para copiar sus datos.', 3000);
  applyData(it, { cat: p.cat, extras: (p.extras || []).map(x => x.cat), obs: p.obs }, 'Repetido de ' + p.name);
}
function toggleRev() {
  const it = S.cur; if (!it) return; it.rev = !it.rev; if (!it.rev) it.revWhy = ''; saveReg(); refreshCards(); renderChips(); show(it);
  toast(it.rev ? 'Marcada para revisar. Escribe el motivo en Observación; todas las marcadas están en la pestaña Marcadas de la galería.' : 'Marca de revisión quitada.', 3500);
}
function rejectCur() { // modo revisor: la clasificación no convence; se marca para revisar con el motivo y se pasa a la siguiente
  const it = S.cur; if (!it || !it.cat) return toast('Solo se rechazan fotos ya clasificadas.', 2500);
  const why = prompt(`¿Por qué no es "${allCats(it).join(' + ')}"? (queda marcada para revisar con este motivo)`, ''); if (why === null) return;
  const who = $('#reviewer').value.trim(); it.rev = true; it.revWhy = `Rechazada${who ? ' por ' + who : ''}: ${why.trim() || 'sin motivo'}`; it.ver = ''; it.verBy = '';
  saveReg(); refreshCards(); renderChips(); renderSide(); toast('Rechazada y marcada para revisar.', 2500); stepPending(1);
}
$('#burstbtn').onclick = () => { closePops(); playBurst(); }; $('#lbburst').onclick = () => playBurst(); $('#repbtn').onclick = () => { closePops(); repeatPrev(); };
$('#reviewer').value = ls('bt_rev', ''); $('#reviewer').oninput = e => sv('bt_rev', e.target.value.trim());
function setRevMode(on) { S.revMode = on; $('#revmode').textContent = 'Modo revisor: ' + (on ? 'activado' : 'desactivado'); document.body.classList.toggle('revmode', on);
  toast(on ? 'Modo revisor: Espacio va a la siguiente foto clasificada sin verificar; Enter la verifica y Retroceso la rechaza.' : 'Modo revisor desactivado.', 5000); renderSide(); if (S.cur) show(S.cur); }
$('#revmode').onclick = () => { closePops(); setRevMode(!S.revMode); };
function verifyCur() {
  const it = S.cur; if (!it) return; if (!it.cat) return toast('Solo se verifican fotos ya clasificadas.', 2500);
  if (it.ver) { it.ver = ''; it.verBy = ''; Object.values(it.obs || {}).forEach(o => delete o.iv); saveReg(); refreshCards(); show(it); return toast('Verificación quitada.', 2500); }
  let who = $('#reviewer').value.trim(); if (!who) { who = (prompt('¿Quién revisa? (se guarda en el registro y en el CSV)') || '').trim(); if (who) { $('#reviewer').value = who; sv('bt_rev', who); } }
  it.ver = ymd(Date.now()); it.verBy = who; for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (o && o.id) { o.iv = who || 'sí'; delete o.dud; } } saveReg(); refreshCards(); renderSide(); toast(`Verificada${who ? ' por ' + who : ''}.`, 2000); stepPending(1);
}
// Lupa: amplía la zona bajo el cursor sin hacer zoom a toda la foto
let lupeOn = false;
function setLupe(on, quiet) { lupeOn = on && !(S.cur && isVideo(S.cur.name)); $('#lupechk').checked = lupeOn; $('#lupe').hidden = true; wrap.classList.toggle('lupe', lupeOn); if (!quiet) toast(lupeOn ? 'Lupa activada: pasa el ratón sobre la foto (L para quitarla). Su tamaño se cambia en el menú Imagen.' : 'Lupa desactivada.', 2500); }
$('#lupechk').onchange = e => { setLupe(e.target.checked); e.target.blur(); };
let lupeR = +ls('bt_lupesz', 110); $('#lupesz').value = lupeR; document.documentElement.style.setProperty('--lz', lupeR * 2 + 'px');
$('#lupesz').oninput = e => { lupeR = +e.target.value; sv('bt_lupesz', lupeR); document.documentElement.style.setProperty('--lz', lupeR * 2 + 'px'); };
document.querySelector('.imgwrap').addEventListener('pointermove', e => {
  const L = $('#lupe'), im = $('#big'); if (!lupeOn || im.hidden || !im.getAttribute('src')) { L.hidden = true; return; }
  const r = im.getBoundingClientRect(), w = wrap.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, Z = 3, R = lupeR;
  if (x < 0 || y < 0 || x > r.width || y > r.height) { L.hidden = true; return; }
  L.hidden = false; L.style.left = (e.clientX - w.left - R) + 'px'; L.style.top = (e.clientY - w.top - R) + 'px';
  useFull(); L.style.backgroundImage = `url("${cmpUrl ? im.src : bigUrl || im.src}")`; L.style.backgroundSize = `${r.width * Z}px ${r.height * Z}px`; L.style.backgroundPosition = `${-(x * Z - R)}px ${-(y * Z - R)}px`; L.style.filter = im.style.filter;
});
document.querySelector('.imgwrap').addEventListener('pointerleave', () => { $('#lupe').hidden = true; });
// Tiempo estimado según el ritmo de esta sesión
function eta(pend) {
  const now = Date.now(), r = S.rate.filter(x => now - x[0] < 20 * 60e3); if (!pend || r.length < 3) return '';
  const photos = r.slice(1).reduce((a, x) => a + x[1], 0), secs = (r[r.length - 1][0] - r[0][0]) / 1000 / photos; if (!isFinite(secs) || secs <= 0) return '';
  const min = Math.round(pend * secs / 60); return ` · ≈ ${min < 1 ? 'menos de 1 min' : min > 90 ? (min / 60).toFixed(1) + ' h' : min + ' min'} restantes a tu ritmo`;
}

/* ---------- Fotos probablemente vacías (sin IA): se comparan con el fondo típico de su cámara ---------- */
// Para cada cámara (y por separado día a color / noche infrarroja) se calcula el "fondo" como la mediana de sus fotos
// en baja resolución. Una foto casi igual a ese fondo probablemente no tiene animal. Es solo una sugerencia: tú confirmas.
const EMPTY_FRAC = 0.008; // fracción mínima de la imagen que debe cambiar para considerar que hay algo
async function smallGray(it) {
  if (it.sg) return it.sg;
  const W = 48, H = 36, bmp = await createImageBitmap(await it.h.getFile(), { resizeWidth: W, resizeHeight: H, resizeQuality: 'medium' });
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(bmp, 0, 0); bmp.close();
  const d = x.getImageData(0, 0, W, H).data, g = new Float32Array(W * H); let col = 0;
  for (let i = 0; i < W * H; i++) { const r = d[i * 4], gg = d[i * 4 + 1], b = d[i * 4 + 2]; g[i] = 0.299 * r + 0.587 * gg + 0.114 * b; col += Math.abs(r - gg) + Math.abs(gg - b); }
  let m = 0; for (const v of g) m += v; m /= g.length; let sd = 0; for (const v of g) sd += (v - m) ** 2; sd = Math.sqrt(sd / g.length) || 1;
  for (let i = 0; i < g.length; i++) g[i] = (g[i] - m) / sd; // normalizada: no importan los cambios de brillo
  return it.sg = { g, ir: col / (W * H) < 8 };
}
async function findEmpty() {
  const list = S.items.filter(i => !isVideo(i.name)); let n = 0; const groups = new Map();
  let next = 0; const one = async () => { while (next < list.length) { const it = list[next++]; // 4 a la vez
    try { const sg = await smallGray(it), k = srcOf(it) + (sg.ir ? '|noche' : '|día'); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(it); } catch (e) {}
    if (++n % 25 === 0) toast(`Buscando fotos probablemente vacías… ${n}/${list.length}`, 0); } };
  await Promise.all([one(), one(), one(), one()]);
  S.empty = new Set(); let used = 0, few = 0;
  for (const g of groups.values()) {
    if (g.length < 5) { few += g.length; continue; } used += g.length; const L = g[0].sg.g.length, bg = new Float32Array(L), tmp = new Float32Array(g.length);
    for (let p = 0; p < L; p++) { for (let i = 0; i < g.length; i++) tmp[i] = g[i].sg.g[p]; const srt = Array.from(tmp).sort((a, b) => a - b); bg[p] = srt[srt.length >> 1]; }
    for (const it of g) { let ch = 0; const v = it.sg.g; for (let p = 0; p < L; p++) if (Math.abs(v[p] - bg[p]) > 0.9) ch++; it.chg = ch / L; if (it.chg < EMPTY_FRAC) S.empty.add(it); }
  }
  $('#toast').hidden = true;
  const pend = [...S.empty].filter(i => !i.cat).length;
  toastAct(`${pend} foto(s) pendiente(s) probablemente vacía(s) entre ${used} analizadas.${few ? ` ${few} foto(s) no se analizaron: su cámara tiene menos de 5 fotos (de día o de noche).` : ''} Revísalas antes de mandarlas a ${GH}.`, pend ? 'Revisarlas una por una' : '', () => {
    S.f.st = 'empty'; $('#st').value = 'all'; updFilt(); applyFilters(); const f = S.view.find(i => !i.cat); if (f) { show(f); toast(`Pulsa F si está vacía (${GH}) o Espacio para pasar a la siguiente.`, 5000); } }, 12000);
}

/* ---------- Comparar con la foto anterior de la misma cámara (mantener C) ---------- */
let cmpUrl = null;
async function startCompare() {
  const it = S.cur; if (!it || cmpUrl) return;
  const same = S.items.filter(x => srcOf(x) === srcOf(it)).sort((a, b) => a.origName.localeCompare(b.origName, undefined, { numeric: true }));
  const prev = same[same.indexOf(it) - 1]; if (!prev) return toast('No hay una foto anterior de esta cámara.', 2000);
  try { cmpUrl = URL.createObjectURL(await prev.h.getFile()); $('#big').src = cmpUrl; const m = $('#cmpmsg'); m.textContent = 'Anterior: ' + prev.origName; m.hidden = false; } catch (e) { cmpUrl = null; }
}
function endCompare() { if (!cmpUrl) return; URL.revokeObjectURL(cmpUrl); cmpUrl = null; $('#cmpmsg').hidden = true; if (bigUrl) { $('#big').src = bigSUrl || bigUrl; if (V.z > 1 || lupeOn) useFull(); } }

/* ---------- Teclado ---------- */
document.addEventListener('keydown', e => {
  if (!$('#tour').hidden) { if (e.key === 'Escape') endTour(); else if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); tourGo(1); } else if (e.key === 'ArrowLeft') tourGo(-1); return; }
  if (e.key === 'Escape' && (closeMenu() || closePops() || closeOver())) { if (document.activeElement && document.activeElement.closest && document.activeElement.closest('.popbox')) document.activeElement.blur(); return; }
  const typing = /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName), ctl = (e.ctrlKey || e.metaKey) && !e.altKey, anyOver = [...document.querySelectorAll('.over')].some(o => !o.hidden), lk = e.key.toLowerCase();
  if (ctl && !typing && (lk === 'z' || lk === 'y')) { e.preventDefault(); if (!e.repeat) locked(lk === 'y' || e.shiftKey ? redo : undo); return; }
  if (ctl && !typing && lk === 'a' && $('#lb').hidden && !anyOver && S.view.length) { e.preventDefault(); selectAll(); return; }
  if (typing || e.ctrlKey || e.metaKey || e.altKey) return; // Cmd+F, Ctrl+1, etc. son del navegador: nunca clasifican
  if (e.key === '?') { e.preventDefault(); renderKeys(true); openOver('#help'); return; }
  if (anyOver) return;
  if ($('#lb').hidden) return galleryKey(e);
  if (burstPlay) { e.preventDefault(); if (e.key.toUpperCase() === 'P' || e.key === 'Escape') { stopBurst(); return; } stopBurst(); return; } // cualquier tecla detiene la ráfaga
  if (e.key === '/') { e.preventDefault(); if ($('#lbside').hidden) $('#lbmorebtn').click(); else $('#lbq').focus(); return; } // buscar o crear especie
  const k = e.key.length === 1 ? e.key.toUpperCase() : e.key, dg = /^(Digit|Numpad)([1-9])$/.exec(e.code);
  if ((e.key === ',' || e.key === '.') && !$('#bigv').hidden) { e.preventDefault(); const v = $('#bigv'); v.pause(); v.currentTime = Math.max(0, v.currentTime + (e.key === '.' ? 1 : -1) / 30); return; } // video: cuadro a cuadro
  if (e.key === 'Escape') { if (focusOn) setFocus(false); else closeLb(); }
  else if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
  else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); countStep(e.key === 'ArrowUp' ? 1 : -1); }
  else if (e.key === '+' || e.key === '=') zoomTo(V.z * 1.3, 0, 0); else if (e.key === '-') zoomTo(V.z / 1.3, 0, 0); else if (e.key === '0' && !e.shiftKey) zoomTo(1, 0, 0);
  else if (e.repeat) { if (e.key === ' ') e.preventDefault(); return; } // mantener una tecla no repite acciones
  else if (e.key === ' ') { e.preventDefault(); stepPending(e.shiftKey ? -1 : 1); }
  else if (performance.now() - (S.shownAt || 0) < 120) return; // recién cambió la foto: no clasificar algo que aún no se ve
  else if (e.key === 'Enter' && S.revMode) { e.preventDefault(); verifyCur(); }
  else if (e.key === 'Backspace' && S.revMode) { e.preventDefault(); rejectCur(); }
  else if (k === 'M') toggleRev();
  else if (k === 'R') repeatPrev();
  else if (k === 'L') setLupe(!lupeOn);
  else if (k === 'H') setFocus(!focusOn);
  else if (k === 'U') unclassifyCur();
  else if (k === 'N') { e.preventDefault(); if ($('#obs').hidden) { obsTemp = true; renderObs(S.cur); } const n = $('#note'); if (n) n.focus(); }
  else if (k === 'C') startCompare();
  else if (k === 'P') playBurst();
  else { const c = dg ? S.cats[dg[2] - 1] : (/^[A-Z]$/.test(k) ? catByKey(k) : null); if (!c) return;
    if (e.shiftKey) toggleExtraCur(c); else classifyCur(c); }
});
function galleryKey(e) { // teclas en la galería (con el visor cerrado)
  if (!S.items.length) return; const btn = document.activeElement && document.activeElement.tagName === 'BUTTON';
  if (/^Arrow/.test(e.key)) { if (!S.view.length || (btn && !document.activeElement.closest('#grid'))) return; e.preventDefault(); gridMove(e.key); return; }
  if (e.key === 'Enter') { if (btn) return; if (S.kf && S.view.includes(S.kf)) { e.preventDefault(); show(S.kf); } return; }
  if (e.key === 'Escape') { if (S.multi.size) { S.multi.clear(); refreshCards(); } return; }
  if (e.repeat || e.key === ' ') return;
  const items = S.multi.size ? [...S.multi] : S.kf && S.view.includes(S.kf) ? groupOf(S.kf) : null; if (!items) return;
  const k = e.key.length === 1 ? e.key.toUpperCase() : e.key, dg = /^(Digit|Numpad)([1-9])$/.exec(e.code), whole = !S.multi.size;
  const heads = S.view.filter(i => groupOf(i)[0] === i), nx = S.kf ? heads[heads.indexOf(groupOf(S.kf)[0]) + 1] : null;
  if (k === 'U') { e.preventDefault(); return locked(() => unclassify(items, whole)); }
  if (k === 'M') { e.preventDefault(); const all = items.every(i => i.rev); items.forEach(i => { i.rev = !all; if (all) i.revWhy = ''; }); saveReg(); refreshCards(); renderChips(); return toast(all ? 'Marca de revisión quitada.' : `${items.length} foto(s) marcada(s) para revisar.`, 2000); }
  if (e.shiftKey) return;
  const c = dg ? S.cats[dg[2] - 1] : (/^[A-Z]$/.test(k) ? catByKey(k) : null); if (!c) return; e.preventDefault();
  locked(async () => { await classify(items, c, whole); if (whole && $('#adv').checked && nx && S.view.includes(nx)) setKf(nx); else if (S.kf && !S.view.includes(S.kf) && nx && S.view.includes(nx)) setKf(nx); });
}
function selectAll() { S.view.forEach(i => S.multi.add(i)); refreshCards(); toast(`${S.multi.size} fotos seleccionadas. Pulsa la tecla de una especie o usa la barra de abajo. Esc cancela.`, 3500); }
$('#selall').onclick = () => { closePops(); selectAll(); };
document.addEventListener('keyup', e => { if (e.key.toLowerCase() === 'c') endCompare(); });
addEventListener('blur', endCompare);

/* ---------- Modo solo foto (oculta todo salvo la imagen) ---------- */
let focusOn = ls('bt_focus', false);
function setFocus(on) { focusOn = on; $('#lb').classList.toggle('focus', on); sv('bt_focus', on); setTimeout(() => { applyV(); if (on && !$('#lb').hidden) useFull(); }, 0); } // a pantalla completa se usa la foto con toda su resolución
$('#focus').onclick = () => { closePops(); setFocus(true); }; $('#unfocus').onclick = () => setFocus(false);

/* ---------- Zoom, brillo y contraste del visor ---------- */
const V = { z: 1, x: 0, y: 0, b: 1, c: 1 };
function applyV() {
  const im = $('#big').hidden ? $('#bigv') : $('#big'), mx = Math.max(0, (V.z - 1) * im.clientWidth / 2), my = Math.max(0, (V.z - 1) * im.clientHeight / 2);
  V.x = Math.max(-mx, Math.min(mx, V.x)); V.y = Math.max(-my, Math.min(my, V.y));
  im.style.transform = `translate(${V.x}px,${V.y}px) scale(${V.z})`; im.style.filter = V.b == 1 && V.c == 1 ? '' : `brightness(${V.b}) contrast(${V.c})`; im.style.cursor = V.z > 1 ? 'grab' : 'default'; if (V.z > 1) useFull();
}
function zoomTo(z, cx, cy) { z = Math.max(1, Math.min(8, z)); const k = z / V.z; V.x = cx - (cx - V.x) * k; V.y = cy - (cy - V.y) * k; V.z = z; if (z === 1) V.x = V.y = 0; applyV(); }
const wrap = document.querySelector('.imgwrap'), big = $('#big'); let drag = null;
const rel = e => { const r = wrap.getBoundingClientRect(); return [e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)]; };
wrap.addEventListener('wheel', e => { e.preventDefault(); const [cx, cy] = rel(e); zoomTo(V.z * (e.deltaY < 0 ? 1.2 : 1 / 1.2), cx, cy); }, { passive: false });
big.ondragstart = e => e.preventDefault();
big.onpointerdown = e => { if (V.z <= 1) return; e.preventDefault(); big.setPointerCapture(e.pointerId); drag = { x: e.clientX - V.x, y: e.clientY - V.y }; big.style.cursor = 'grabbing'; };
big.onpointermove = e => { if (drag) { V.x = e.clientX - drag.x; V.y = e.clientY - drag.y; applyV(); } };
big.onpointerup = big.onpointercancel = () => { drag = null; applyV(); };
big.ondblclick = e => { if (V.z > 1) zoomTo(1, 0, 0); else { const [cx, cy] = rel(e); zoomTo(3, cx, cy); } };
$('#zin').onclick = () => zoomTo(V.z * 1.3, 0, 0); $('#zout').onclick = () => zoomTo(V.z / 1.3, 0, 0);
$('#bri').oninput = e => { V.b = +e.target.value; applyV(); }; $('#con').oninput = e => { V.c = +e.target.value; applyV(); };
$('#bri').onchange = $('#con').onchange = e => { e.target.blur(); keepV(); };
$('#vreset').onclick = () => { V.b = V.c = 1; $('#bri').value = $('#con').value = 1; zoomTo(1, 0, 0); keepV(); };
// Recordar brillo y contraste por estación (las fotos infrarrojas de una cámara suelen necesitar el mismo ajuste)
function keepV() { if (!S.cur || !$('#vkeep').checked) return; S.vkeep[station(S.cur)] = [V.b, V.c]; sv('bt_vkeep', S.vkeep); }
$('#vkeep').onchange = e => { if (!S.cur) return; const st = station(S.cur); if (e.target.checked) S.vkeep[st] = [V.b, V.c]; else delete S.vkeep[st]; sv('bt_vkeep', S.vkeep);
  toast(e.target.checked ? `El brillo y el contraste se aplicarán a todas las fotos de «${st}».` : `«${st}» ya no recuerda el brillo.`, 3500); };
// Ajuste automático: lleva el brillo medio de la foto a un valor cómodo y estira el contraste si la foto es plana
$('#vauto').onclick = () => { const im = $('#big'); if (im.hidden || !im.naturalWidth) return;
  try { const c = document.createElement('canvas'), W = 96, H = Math.max(1, Math.round(96 * im.naturalHeight / im.naturalWidth)); c.width = W; c.height = H; const x = c.getContext('2d'); x.drawImage(im, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H).data; let s = 0, s2 = 0; const n = W * H; for (let i = 0; i < d.length; i += 4) { const l = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255; s += l; s2 += l * l; }
    const m = s / n, sd = Math.sqrt(Math.max(0, s2 / n - m * m)); V.b = +Math.max(0.5, Math.min(3, 0.45 / Math.max(0.05, m))).toFixed(2); V.c = +Math.max(1, Math.min(1.8, 0.2 / Math.max(0.05, sd))).toFixed(2);
    if (V.c < 1) V.c = 1; $('#bri').value = V.b; $('#con').value = V.c; applyV(); keepV(); toast(`Ajuste automático: brillo ${V.b}, contraste ${V.c}.`, 2000); } catch (e) { toast('No se pudo calcular el ajuste de esta foto.', 2500); } };
big.addEventListener('load', applyV);

/* ---------- Corregir la hora de la cámara (se escribe la hora real de una foto) ---------- */
$('#fixtime').onclick = async () => { closePops();
  const it = S.cur; if (!it) return; const m = await loadMeta(it), st = camOf(it);
  if (!m.date) return toast('Esta foto no tiene fecha EXIF; elige una foto de la misma cámara que sí la tenga.', 6000);
  const cur = fixTs(it), v = prompt(`Estación "${st}".\nHora en la foto (EXIF): ${m.date} ${m.time}\n\nEscribe la hora REAL en que se tomó esta foto (AAAA-MM-DD HH:MM:SS).\nDéjalo vacío para quitar la corrección.`, `${ymd(cur)} ${hms(cur)}`);
  if (v === null) return;
  if (!v.trim()) { delete S.offsets[st]; saveReg(); applyFilters(); show(it); return toast(`Corrección de hora quitada en "${st}".`); }
  const mm = v.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/); if (!mm) return toast('Formato no válido. Ejemplo: 2026-03-10 06:15:00', 6000);
  const real = new Date(+mm[1], mm[2] - 1, +mm[3], +mm[4], +mm[5], +(mm[6] || 0)).getTime(), off = Math.round((real - capTs(it)) / 1000);
  const n = S.items.filter(i => camOf(i) === st).length;
  const ex = S.items.find(i => camOf(i) === st && i !== it && !isNaN(capTs(i))), f2 = t => `${ymd(t)} ${hms(t)}`;
  if (!confirm(`La cámara de "${st}" va ${fmtOff(off) || '+00:00:00'} respecto a la hora real.\n\nEjemplos:\n· ${it.origName || it.name}: ${f2(capTs(it))} → ${f2(real)}${ex ? `\n· ${ex.origName || ex.name}: ${f2(capTs(ex))} → ${f2(capTs(ex) + off * 1000)}` : ''}\n\nSe aplicará a sus ${n} fotos en el CSV y el resumen (las fotos no se modifican). ¿Continuar?`)) return;
  if (off) S.offsets[st] = off; else delete S.offsets[st]; saveReg(); applyFilters(); show(it); toast(`Hora corregida en "${st}": ${fmtOff(off) || 'sin desfase'}.`, 5000);
};

/* ---------- Clasificar y mover físicamente ---------- */
function classifyCur(cat) { const cur = S.cur; if (!cur) return; const g = groupOf(cur); return locked(() => classify(g.length > 1 ? g.filter(i => i === cur || !(S.blind ? i.bl : i.cat)) : [cur], cat, g.length > 1)); }
function unclassifyCur() { const cur = S.cur; if (S.blind) return cur && cur.bl ? locked(() => unclassify([cur])) : undefined; if (!cur || !cur.cat) return; const g = groupOf(cur).filter(i => i.cat === cur.cat); return locked(() => unclassify(g, g.length > 1)); }
async function subdir(dir, names) { for (const n of names) dir = await dir.getDirectoryHandle(n, { create: true }); return dir; }
async function exists(dir, n) { try { await dir.getFileHandle(n); return true; } catch (e) { if (e.name === 'NotFoundError' || e.name === 'TypeMismatchError') return e.name === 'TypeMismatchError'; throw e; } }
async function uniqueName(dir, n) {
  if (!(await exists(dir, n))) return n;
  const p = n.lastIndexOf('.'), base = p > 0 ? n.slice(0, p) : n, ext = p > 0 ? n.slice(p) : '';
  for (let k = 1; k < 10000; k++) { const c = `${base}_${k}${ext}`; if (!(await exists(dir, c))) return c; }
  throw new Error('No se encontró un nombre libre');
}
const PROTECTED = 'el archivo está protegido (solo lectura, bloqueado o tarjeta protegida); no se movió';
// Mueve el archivo de `it` (foto o copia) a destDir con el nombre baseName (o baseName_1…). Nunca sobrescribe, duplica ni pierde.
async function relocate(it, destDir, destParts, baseName) {
  const srcDir = it.dir, srcName = it.name, h = it.h; // copia local: otra operación no puede cambiarlos a mitad
  const f0 = await h.getFile(), size = f0.size;
  if (!it.origMod && !it.cat) it.origMod = f0.lastModified;
  const name = await uniqueName(destDir, baseName); // move() sobrescribe si el nombre existe: por eso se busca uno libre antes
  let moveErr = null;
  if (typeof h.move === 'function') {
    try { await h.move(destDir, name); } catch (e) { moveErr = e; }
    const [src, dst] = await Promise.all([exists(srcDir, srcName), exists(destDir, name)]);
    if (src) it.h = await srcDir.getFileHandle(srcName); // tras un move() fallido el identificador puede quedar apuntando al destino
    if (src && dst) { // el navegador copió pero no pudo borrar el original
      if (moveErr || (await (await destDir.getFileHandle(name)).getFile()).size === size) { try { await destDir.removeEntry(name); } catch (e) {} }
      throw new Error(PROTECTED);
    }
    if (dst) { const nh = await destDir.getFileHandle(name), chk = await nh.getFile();
      if (chk.size !== size) throw new Error(`la foto movida no coincide en tamaño; revisa ${destParts.join('/')}/${name}`);
      Object.assign(it, { h: nh, dir: destDir, name, parts: destParts, mod: chk.lastModified }); return; }
    if (!src) throw new Error('no se encontró la foto en su carpeta (¿se movió o borró fuera de BioTrampa?)');
    if (moveErr) console.info('move() no disponible, se copia:', moveErr.name);
  }
  // Alternativa (navegadores sin move): copiar, verificar y borrar el original; si algo falla, se deshace la copia
  const nh = await destDir.getFileHandle(name, { create: true });
  try { const w = await nh.createWritable(); await w.write(f0); await w.close(); if ((await nh.getFile()).size !== size) throw new Error('la copia no coincide con el original; el original no se tocó'); }
  catch (e) { try { await destDir.removeEntry(name); } catch (x) {} throw e; }
  try { await srcDir.removeEntry(srcName); } catch (e) { try { await destDir.removeEntry(name); } catch (x) {} throw new Error(PROTECTED); }
  Object.assign(it, { h: nh, dir: destDir, name, parts: destParts, mod: (await nh.getFile()).lastModified });
}
const subCache = new WeakMap(); // carpeta de la estación → { 'Clasificadas/Coyote': carpeta }: evita pedirle al disco la misma carpeta en cada foto
async function moveItem(it, cat) { const fn = folder(cat), key = ROOT + '/' + fn; let m = subCache.get(it.src.h); if (!m) subCache.set(it.src.h, m = new Map()); // Clasificadas/ dentro de la carpeta de SU estación
  for (let intento = 0; ; intento++) {
    try { let d = m.get(key); if (!d) m.set(key, d = await subdir(it.src.h, [ROOT, fn])); return await relocate(it, d, [ROOT, fn], it.name); }
    catch (e) { m.delete(key); if (intento || (e.name !== 'NotFoundError' && e.name !== 'InvalidStateError')) throw e; } // la carpeta cambió fuera de BioTrampa: se vuelve a pedir una vez
  } }
/* 1.4.14: las fotos con individuo van a una subcarpeta: Clasificadas/<Especie>/<Individuo>/ (p. ej. Clasificadas/Jaguar/JAG-001/).
   Al quitar el individuo vuelven a Clasificadas/<Especie>/. La subcarpeta vacía se borra (solo si de verdad está vacía). */
const indOf = it => { const o = it.cat && it.cat !== GH && it.obs && it.obs[it.cat]; return o && o.id ? folder(o.id) : ''; };
async function dropEmptyInd(src, ps) { if (ps.length !== 3 || ps[0] !== ROOT) return; try { let d = src.h; for (const n of ps.slice(0, 2)) d = await d.getDirectoryHandle(n); await d.removeEntry(ps[2]); } catch (e) {} } // sin «recursive»: si tiene algo dentro, no se borra
async function indFolder(it) {
  if (!it.cat || it.tagOnly || noMove() || it.parts[0] !== ROOT) return;
  const want = [ROOT, folder(it.cat), ...(indOf(it) ? [indOf(it)] : [])], old = it.parts; if (old.join('/') === want.join('/')) return;
  await relocate(it, await subdir(it.src.h, want), want, it.name); await dropEmptyInd(it.src, old);
}
async function indFolders(items) { // tras asignar, quitar o unir individuos
  const bad = []; for (const it of new Set(items)) { try { await indFolder(it); } catch (e) { bad.push(`${it.name}: ${e.message}`); } }
  saveReg(); if (bad.length) toast(`No se pudo mover a la carpeta del individuo: ${bad[0]}`, 8000); return !bad.length;
}
async function moveBack(it) { // devuelve la foto a su carpeta y nombre originales (o a la principal si no se conocen); nunca se borra una foto
  const parts = it.origParts || [], name = it.origName || it.name; let last;
  for (const ps of parts.length ? [parts, []] : [[]]) {
    try { await relocate(it, await subdir(it.src.h, ps), ps, name); return; }
    catch (e) { last = e; if (e.message === PROTECTED) break; }
  }
  throw last;
}
/* Especies adicionales (desde la 1.0): la foto se queda en la carpeta de su especie principal y la otra especie solo se ANOTA
   en el registro y en el CSV. No se crean copias. Las copias hechas por versiones anteriores se siguen reconociendo y,
   al quitar esa especie, se borra solo la copia (nunca la foto principal). */
async function addCopy(it, cat) { if (!hasCat(it, cat)) it.extras.push({ cat }); }
async function dropCopy(it, x) { // copia de una versión anterior: se borra SOLO si la foto principal sigue existiendo con el mismo tamaño
  if (x.h) { const main = await it.h.getFile(), cp = await x.h.getFile().catch(() => null);
    if (cp) { if (cp.size !== main.size) throw new Error(`la copia en ${x.parts.join('/')} no coincide con la foto; no se borró`); await x.dir.removeEntry(x.name); } }
  it.extras = it.extras.filter(y => y !== x);
}
async function setExtras(it, cats) {
  for (const x of [...(it.extras || [])]) if (!cats.includes(x.cat)) await dropCopy(it, x);
  for (const c of cats) if (c !== it.cat && !hasCat(it, c)) await addCopy(it, c);
}
async function classifyOne(it, cat) {
  await loadMeta(it);
  const x = (it.extras || []).find(y => y.cat === cat); if (x) await dropCopy(it, x); // pasa de adicional a principal
  const old = it.parts; if (noMove()) it.tagOnly = true; else { await moveItem(it, cat); it.tagOnly = false; await dropEmptyInd(it.src, old); }
  if (it.cat && it.obs && it.obs[it.cat] && !(it.obs[cat] && Object.keys(it.obs[cat]).length)) { it.obs[cat] = it.obs[it.cat]; delete it.obs[it.cat]; } // los datos pasan a la nueva especie
  it.cat = cat; it.cls = ymd(Date.now()); if (indOf(it)) await indFolder(it); // 1.4.14: con individuo, a su subcarpeta
}
async function unclassifyOne(it) {
  for (const x of [...(it.extras || [])]) await dropCopy(it, x);
  const old = it.parts; if (!noMove() && it.parts[0] === ROOT) { await moveBack(it); await dropEmptyInd(it.src, old); }
  it.cat = null; it.tagOnly = false; it.cls = '';
}
function toggleExtraCur(cat) {
  const it = S.cur; if (!it) return; if (S.blind) return toast('En la revisión a ciegas solo se elige la especie principal.', 3000);
  if (!it.cat) return classifyCur(cat); // sin especie todavía: se clasifica normalmente
  if (it.cat === cat) return toast(`"${cat}" ya es la especie principal de esta foto.`, 2500);
  return locked(async () => {
    const s = snap(it), had = (it.extras || []).find(x => x.cat === cat);
    try { if (had) await dropCopy(it, had); else await addCopy(it, cat); }
    catch (e) { console.warn(e); return toast(`No se pudo ${had ? 'quitar' : 'añadir'} "${cat}": ${e.message}`, 8000); }
    if (!had) { S.act = cat; }
    pushHist([s]); saveReg(); applyFilters([it]); show(it);
    toast(had ? `"${cat}" quitada de esta foto${had.h ? ' (se borró la copia de la versión anterior)' : ''}.` : `"${cat}" anotada como especie adicional. La foto se queda en ${folder(it.cat)}; en el CSV sale una fila por especie.`, 3500, true);
  });
}
async function classify(items, cat, silent) {
  if (!S.srcs.length) return; if (S.blind && !S.blindOff) return blindSet(items, cat); const touched = [...items, ...S.multi]; // tarjetas a actualizar (también las seleccionadas)
  items = items.filter(i => i.cat !== cat); if (!items.length) return;
  if (items.length >= 5 && !silent && !confirm(`¿Clasificar ${items.length} fotografías como "${cat}"${noMove() ? '' : ' y moverlas a su carpeta'}?`)) return; // con pocas fotos no se pregunta: se puede deshacer
  if (items.length === 1 && $('#confirm').checked && !confirm(`¿Clasificar "${items[0].name}" como "${cat}"?`)) return;
  const cur = S.cur, idx = S.view.indexOf(cur), ix = items.map(i => S.view.indexOf(i)).concat(idx).filter(i => i >= 0), nxt = cur ? (S.view[Math.max(...ix) + 1] || S.view[Math.min(...ix) - 1]) : null;
  let ok = 0; const bad = [], ch = [], stB = new Map();
  for (const it of items) { const st = station(it); if (!stB.has(st)) stB.set(st, S.items.filter(i => station(i) === st && !i.cat).length); }
  for (const it of items) {
    const s = snap(it);
    try { await classifyOne(it, cat); ok++; ch.push(s); if (items.length > 1) saveReg(); } // en lotes se guarda el registro sobre la marcha: si se cierra a mitad, no se pierde el origen de las ya movidas
    catch (e) { bad.push(`${it.name}: ${e.name === 'NotAllowedError' ? 'sin permiso de escritura (vuelve a abrir la carpeta y concede el permiso)' : e.message}`); }
  }
  pushHist(ch); if (ch.length) { saveReg(); if (!S.undoing) { S.used[cat] = Date.now(); sv('bt_used', S.used); } }
  S.multi.clear(); applyFilters(touched);
  if (S.cur) { if (!$('#adv').checked && S.view.includes(cur)) show(cur); else if (ok && nxt && S.view.includes(nxt) && nxt !== cur) show(nxt); else if (S.view.includes(cur)) show(cur); else closeLb(); }
  if (ok && !S.undoing) S.rate.push([Date.now(), ok]);
  toast(bad.length ? `${ok ? ok + ' movida(s). ' : ''}Fallaron ${bad.length}: ${bad[0]}` : `${ok} fotografía(s) → ${cat}${items.every(i => i.tagOnly) ? ' (solo etiquetada, sin mover)' : ''}`, bad.length ? 9000 : 2500, !bad.length && !S.undoing);
  if (bad.length) console.warn(bad);
  if (!bad.length && !S.undoing) for (const [st, before] of stB) { if (!before || S.items.some(i => station(i) === st && !i.cat)) continue; stationDone(st); break; }
}
function stationDone(st) { // aviso al terminar de clasificar una estación, con botón para ir a la siguiente que tenga pendientes
  const l = S.items.filter(i => station(i) === st), sp = new Set(l.flatMap(i => allCats(i)).filter(c => c !== GH));
  const next = S.srcs.map(s => s.label).find(x => x !== st && S.items.some(i => station(i) === x && !i.cat));
  toastAct(`«${st}» terminada: ${l.length} ${l.length === 1 ? 'archivo' : 'archivos'}, ${sp.size} ${sp.size === 1 ? 'especie' : 'especies'}.${next ? '' : ' ¡Ya no quedan pendientes en el proyecto!'}`, next ? `Ir a ${next}` : '', () => {
    S.f.src = next; applyFilters(); const first = S.view.find(i => !i.cat); if (!$('#lb').hidden && first) show(first); else { closeLb(); $('#gal').scrollTop = 0; } }, 12000);
}
function toastAct(m, label, fn, ms = 8000) { toast(m, ms); if (!label) return; const t = $('#toast'), b = document.createElement('button'); b.textContent = label; b.className = 'tundo'; b.onclick = e => { e.stopPropagation(); t.hidden = true; fn(); }; t.appendChild(b); }
function renderMulti() {
  const m = $('#multi'); m.hidden = !S.multi.size; if (m.hidden) return;
  $('#mcount').textContent = S.multi.size + ' seleccionadas:'; const b = $('#mbtns'); b.textContent = '';
  const u = document.createElement('button'); u.textContent = 'Desmarcar'; u.onclick = () => locked(() => unclassify([...S.multi])); b.appendChild(u);
  [GH, ...S.cats].forEach(c => { const x = document.createElement('button'); x.textContent = c; x.onclick = () => locked(() => classify([...S.multi], c)); b.appendChild(x); });
}
$('#mclear').title = 'Cancelar la selección'; $('#mclear').onclick = () => { S.multi.clear(); refreshCards(); };

/* ---------- Desmarcar, renombrar y eliminar categorías (todas, incluida Fantasmas) ---------- */
async function dropFolder(c) { // solo borra la carpeta si está vacía (removeEntry sin recursivo falla si tiene archivos)
  let any = false; for (const src of S.srcs) { try { const r = await src.h.getDirectoryHandle(ROOT); await r.removeEntry(folder(c)); any = true; } catch (e) {} } return any;
}
async function unclassify(items, silent) {
  if (S.blind && !S.blindOff) return blindSet(items, null); const touched = [...items, ...S.multi]; items = items.filter(i => i.cat); if (!items.length || !S.srcs.length) return;
  if (items.length >= 5 && !silent && !confirm(`¿Quitar la clasificación de ${items.length} fotografías${S.ro ? '' : ' y devolverlas a su carpeta original'}?`)) return;
  if (items.length === 1 && $('#confirm').checked && !confirm(`¿Quitar la clasificación de "${items[0].name}"?`)) return;
  const cur = S.cur, idx = S.view.indexOf(cur), nxt = cur ? (S.view[idx + 1] || S.view[idx - 1]) : null; let ok = 0; const bad = [], ch = [];
  for (const it of items) { const s = snap(it); try { await unclassifyOne(it); ok++; ch.push(s); if (items.length > 1) saveReg(); } catch (e) { bad.push(`${it.name}: ${e.message}`); } }
  pushHist(ch); if (ch.length) saveReg();
  S.multi.clear(); applyFilters(touched);
  if (S.cur) { if (S.view.includes(cur)) show(cur); else if (nxt && S.view.includes(nxt)) show(nxt); else closeLb(); }
  toast(bad.length ? `Fallaron ${bad.length}: ${bad[0]}` : `${ok} fotografía(s) desmarcada(s)${S.ro ? '' : ' y devuelta(s) a su carpeta'}.`, bad.length ? 9000 : 3000, !bad.length && !S.undoing);
}
async function renameCat(old) {
  const nn = (prompt(`Nuevo nombre para "${old}":`, old) || '').trim().replace(/\s+/g, ' ');
  if (!nn || nn === old) return;
  if (!folder(nn)) return toast('Escribe un nombre válido (sin \\ / : * ? " < > |).');
  if ([GH, ...S.cats].some(c => c !== old && folder(c).toLowerCase() === folder(nn).toLowerCase())) return toast('Ya existe una categoría con ese nombre de carpeta.');
  const its = S.items.filter(i => hasCat(i, old)), same = folder(nn).toLowerCase() === folder(old).toLowerCase();
  if (its.length && !noMove() && !same && !confirm(`Se moverán ${its.length} fotografía(s) de "${folder(old)}" a "${folder(nn)}". ¿Continuar?`)) return;
  let ok = 0; const bad = [];
  for (const it of its) { try {
    if (it.cat === old) { const op = it.parts; if (!noMove() && !same && it.parts[0] === ROOT) { await moveItem(it, nn); await dropEmptyInd(it.src, op); } it.cat = nn; }
    for (const x of it.extras.filter(y => y.cat === old)) { if (!noMove() && !same && x.h) { const fn = folder(nn); await relocate(x, await subdir(it.src.h, [ROOT, fn]), [ROOT, fn], x.name); } x.cat = nn; }
    if (it.obs && it.obs[old]) { it.obs[nn] = it.obs[old]; delete it.obs[old]; }
    if (!same && it.cat === nn && indOf(it)) await indFolder(it); // 1.4.14: sigue en la subcarpeta de su individuo
    ok++; saveReg(); } catch (e) { bad.push(`${it.name}: ${e.message}`); } }
  const left = S.items.some(x => hasCat(x, old));
  if (old === GH) { if (!left) { GH = nn; sv('bt_gh', nn); } else if (ok && !S.cats.includes(nn)) S.cats.push(nn); }
  else { if (!S.cats.includes(nn) && (ok || !its.length)) S.cats.splice(S.cats.indexOf(old) + 1, 0, nn); if (!left) S.cats.splice(S.cats.indexOf(old), 1); }
  if (S.sci[old] && !left) { S.sci[nn] = S.sci[old]; delete S.sci[old]; sv('bt_sci', S.sci); }
  if (S.keys[old] && !left) { S.keys[nn] = S.keys[old]; delete S.keys[old]; sv('bt_keys', S.keys); }
  if (!left) { if (!noMove() && !same) await dropFolder(old); if (S.f.cat === old) S.f.cat = nn; }
  saveReg(); sv('bt_cats', S.cats); S.multi.clear(); applyFilters(); if (S.cur) show(S.cur);
  toast(bad.length ? `Fallaron ${bad.length}; "${old}" se conserva con esas fotos. ${bad[0]}` : `Renombrada a "${nn}"${(same || noMove()) && !S.ro ? ' (las carpetas en disco conservan su nombre)' : ''}.`, bad.length ? 9000 : 3000);
}
async function deleteCat(c) {
  const main = S.items.filter(i => i.cat === c), extra = S.items.filter(i => i.cat !== c && hasCat(i, c));
  if (main.length || extra.length) {
    if (!confirm(`"${c}" tiene ${main.length} fotografía(s)${extra.length ? ` y está anotada como especie adicional en ${extra.length}` : ''}. No se borrará ninguna foto: las fotos volverán a su carpeta original como pendientes${extra.length ? ', la anotación adicional se quita (y las copias de versiones anteriores, si las hay)' : ''} y la categoría se eliminará. ¿Continuar?`)) return;
    let bad = 0;
    for (const it of main) { try { await unclassifyOne(it); saveReg(); } catch (e) { bad++; } }
    for (const it of extra) { try { for (const x of it.extras.filter(y => y.cat === c)) await dropCopy(it, x); } catch (e) { bad++; } }
    saveReg();
    if (bad) { applyFilters(); return toast(`No se pudieron devolver ${bad} fotografía(s); la categoría se conserva.`, 8000); }
  } else if (!confirm(`¿Eliminar la categoría "${c}"? Si su carpeta está vacía, también se borrará del disco.`)) return;
  const gone = S.ro ? false : await dropFolder(c);
  if (c !== GH) { S.cats = S.cats.filter(x => x !== c); sv('bt_cats', S.cats); } // Fantasmas se conserva como botón y su carpeta se recrea al usarla
  if (S.f.cat === c) S.f.cat = 'all'; S.multi.clear(); applyFilters(); if (S.cur) show(S.cur);
  toast(c === GH ? 'Carpeta de Fantasmas limpiada; el botón se conserva y la carpeta se recreará cuando la uses.' : `Categoría eliminada${gone ? ' y su carpeta vacía borrada' : ''}.`, 5000);
}

/* ---------- Exportar CSV (UTF-8 con BOM para Excel): una fila por especie ---------- */
const COLS = ['Proyecto', 'Estación', 'ID cámara', 'Nombre del archivo', 'Nombre original', 'Tipo de archivo', 'Especie o categoría', 'Nombre científico', 'Tipo', 'Número de individuos', 'Sexo', 'Edad', 'Comportamiento', 'ID del individuo', 'Nota',
  'Fecha de captura (EXIF)', 'Hora de captura (EXIF)', 'Corrección de hora', 'Fecha corregida', 'Hora corregida', 'Periodo (día, crepúsculo, noche)', 'Salida del sol', 'Puesta del sol', 'Fase lunar', 'Iluminación lunar (%)', 'Fecha sospechosa',
  'Fecha de modificación del archivo', 'Latitud', 'Longitud', 'Modelo de cámara', 'Estación (carpeta)', 'Carpeta de origen', 'Carpeta de destino', 'Fecha de clasificación', 'Estado', 'Para revisar', 'Motivo de revisión', 'Verificada', 'Verificada por',
  'Flanco', 'Calidad de la foto', 'Foto de referencia', 'Identificación dudosa', 'No se puede identificar', 'Identificado por', 'Fecha de identificación', 'Identificación verificada por', 'Cámara (carpeta)', 'Respuesta a ciegas', 'Revisor a ciegas', 'Rosetas que coinciden'];
const cesc = v => { v = v == null ? '' : String(v).replace(/\0/g, '');
  if (/^[=+@\t\r]/.test(v) || /^-(?!\d)/.test(v)) v = "'" + v; // evita que Excel lo tome como fórmula
  return /[",\n\r;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
const csvBlob = rows => new Blob(['\ufeff' + rows.map(r => r.map(cesc).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
function download(blob, name) { const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name }); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000); }
async function exportMainCsv() {
  if (!S.items.length) return toast('Abre una carpeta primero.');
  const list = S.items.filter(i => i.cat || $('#expPend').checked);
  if (!list.length) return toast('No hay fotografías clasificadas para exportar.');
  const rows = [COLS], seen = new Set();
  for (const [n, it] of list.entries()) {
    if (n % 25 === 0) toast(`Preparando registro… ${n}/${list.length}`, 0);
    const k = pathOf(it); if (seen.has(k)) continue; seen.add(k);
    const m = await loadMeta(it), mod = modOf(it), off = offOf(it), ft = fixTs(it), per = period(it), sun = sunOf(it), moon = m.date ? moonOf(ft) : null;
    const origin = it.origParts ? [it.src.name, ...it.origParts].join('/') : '';
    const row = (cat, typ, dest) => { const o = (it.obs && it.obs[cat]) || {};
      return [$('#proj').value || projName(), station(it), it.src.pair ? camOf(it) : (S.stations[station(it)] || {}).cam || (S.srcs.length > 1 ? '' : $('#cam').value), it.name, it.origParts ? it.origName : '', isVideo(it.name) ? 'Video' : 'Foto', cat || '', cat ? S.sci[cat] || '' : '', typ, o.n || '', o.sex || '', o.age || '', o.beh || '', o.id || '', it.note || '',
        m.date, m.time, offTxt(off), m.date ? ymd(ft) : '', m.date ? hms(ft) : '', per ? PER[per] : '', sun ? hms(sun.rise).slice(0, 5) : '', sun ? hms(sun.set).slice(0, 5) : '', moon ? moon.name : '', moon ? moon.ill : '', suspect(it) ? 'Sí' : '',
        mod ? ymd(mod) : '', m.lat, m.lon, m.model, station(it), origin, dest, it.cls, it.cat ? (it.tagOnly ? 'Etiquetada (sin mover)' : 'Clasificada') : 'Pendiente', it.rev ? 'Sí' : '', it.rev ? it.revWhy || '' : '', it.ver || '', it.verBy || '',
        FL[o.fl] || '', QL[o.q] || '', o.ref ? 'Sí' : '', o.dud ? 'Sí' : '', o.ns ? 'Sí' : '', o.ib || '', o.if || '', o.iv || '', camOf(it), it.bl || '', it.bb || '', o.rc || '']; };
    rows.push(row(it.cat, it.cat ? 'Principal' : '', it.cat ? (it.parts[0] === ROOT ? it.parts.join('/') : '') : ''));
    for (const x of it.extras || []) rows.push(row(x.cat, x.parts ? 'Adicional (copia)' : 'Adicional', x.parts ? x.parts.join('/') : ''));
  }
  download(csvBlob(rows), `biotrampa_registro_${ymd(Date.now())}.csv`);
  const r = rows.slice(1), iD = COLS.indexOf('Fecha de captura (EXIF)'), iL = COLS.indexOf('Latitud'); toast(`Registro exportado: ${r.length} filas (${seen.size} fotos). Sin fecha EXIF: ${r.filter(x => !x[iD]).length}. Sin GPS: ${r.filter(x => !x[iL]).length}.`, 8000);
}

/* ---------- Resumen: avance y resultados de toda la carpeta ---------- */
let sumData = null;
async function openSummary() {
  if (!S.items.length) return toast('Abre una carpeta primero.');
  await prepare(true); renderSummary(); openOver('#sum');
}
$('#sumbtn').onclick = openSummary;
/* ---------- Estaciones: datos, días-trampa (esfuerzo) y editor ---------- */
const DAY = 864e5;
function photoGps(name) { const g = S.items.filter(i => station(i) === name && i.meta && i.meta.lat); if (!g.length) return null; return [g.reduce((a, i) => a + +i.meta.lat, 0) / g.length, g.reduce((a, i) => a + +i.meta.lon, 0) / g.length]; } // promedio del GPS de sus fotos
function photoDates(name) { const t = S.items.filter(i => station(i) === name && goodTs(i)).map(fixTs); if (!t.length) return null; let a = t[0], b = t[0]; for (const x of t) { if (x < a) a = x; if (x > b) b = x; } return [ymd(a), ymd(b)]; } // primera y última foto
const isoDay = t => new Date(t).toISOString().slice(0, 10); // fecha AAAA-MM-DD de un Date.parse('AAAA-MM-DD') (medianoche UTC)
const dayList = (a, b) => { const r = []; for (let t = Date.parse(a), e = Date.parse(b); t <= e && r.length < 20000; t += DAY) r.push(isoDay(t)); return r; }; // días de a a b, inclusive
function downSet(name) { const r = new Set(), st = S.stations[name]; for (const p of (st && st.down) || []) if (p.a && p.b) dayList(p.a, p.b).forEach(d => r.add(d)); return r; } // días en que la cámara no funcionó
const offsOf = s => { const cs = S.srcs.filter(x => (x.pair || x.label) === s); return cs.map(x => S.offsets[x.label] ? (cs.length > 1 ? x.label + ': ' : '') + fmtOff(S.offsets[x.label]) : '').filter(Boolean).join(', '); }; // corrección de hora de sus cámaras
function trapDays(name) { // días-trampa: de la instalación al retiro (inclusive) menos los días sin funcionar; sin fechas, se estima con la primera y la última foto
  const st = S.stations[name]; let start, end, est = false;
  if (st && st.start && st.end) { start = st.start; end = st.end; }
  else { const t = photoDates(name); if (!t) return { days: 0, est: true, down: 0 }; start = st && st.start || t[0]; end = st && st.end || t[1]; est = true; }
  const dn = downSet(name), all = dayList(start, end), down = all.filter(d => dn.has(d)).length;
  return { days: all.length - down, est, start, end, down };
}
function stCoords(name) { const st = S.stations[name]; if (st && st.lat !== '' && st.lat != null && isFinite(+st.lat) && isFinite(+st.lon) && st.lon !== '') return [+st.lat, +st.lon, false];
  const g = photoGps(name); return g ? [g[0], g[1], true] : null; }
let stEditing = null, stFromSum = false;
async function openStation(name) {
  if (!S.srcs.length) return; stEditing = name; stFromSum = !$('#sum').hidden; await prepare(true); const st = S.stations[name] || {};
  $('#stdlgt').textContent = 'Estación: ' + name;
  for (const [id, k] of [['st_lat', 'lat'], ['st_lon', 'lon'], ['st_start', 'start'], ['st_end', 'end'], ['st_cam', 'cam'], ['st_h', 'h'], ['st_bait', 'bait'], ['st_notes', 'notes']]) $('#' + id).value = st[k] == null ? '' : st[k];
  renderDownList(st.down || []);
  openOver('#stdlg'); $('#st_lat').focus();
}
$('#st_gps').onclick = () => { const g = photoGps(stEditing); if (!g) return toast('Las fotos de esta estación no tienen GPS.', 3000);
  $('#st_lat').value = g[0].toFixed(6); $('#st_lon').value = g[1].toFixed(6); };
$('#st_dates').onclick = () => { const t = photoDates(stEditing); if (!t) return toast('Las fotos de esta estación no tienen fecha.', 3000);
  [$('#st_start').value, $('#st_end').value] = t; };
$('#st_save').onclick = () => {
  const v = id => $('#' + id).value.trim(), lat = v('st_lat'), lon = v('st_lon');
  if (lat && (!isFinite(+lat) || Math.abs(+lat) > 90)) return toast('Latitud no válida (entre -90 y 90, en grados decimales).', 4000);
  if (lon && (!isFinite(+lon) || Math.abs(+lon) > 180)) return toast('Longitud no válida (entre -180 y 180, en grados decimales).', 4000);
  if (v('st_start') && v('st_end') && v('st_end') < v('st_start')) return toast('La fecha de retiro es anterior a la de instalación.', 4000);
  const down = readDownList(); if (!down) return; // readDownList avisa si un periodo no es válido
  const st = { lat, lon, start: v('st_start'), end: v('st_end'), cam: v('st_cam'), h: v('st_h'), bait: v('st_bait'), notes: v('st_notes') }; if (down.length) st.down = down;
  if (Object.values(st).some(Boolean)) S.stations[stEditing] = st; else delete S.stations[stEditing];
  saveReg(); closeOver(); applyFilters(); toast(`Datos de la estación "${stEditing}" guardados.`, 3000); if (stFromSum) openSummary();
};

/* ---------- Eventos independientes ---------- */
function evMin() { return +ls('bt_ev', 30); } // minutos entre eventos independientes (0 = cada foto cuenta)
function buildEvents(items) { // por especie y estación: fotos separadas por menos de N minutos forman un evento; individuos = máximo visto en una sola foto (1 si no se anotó)
  const G = new Map(), gap = evMin() * 60000, out = [], nOf = (it, c) => (it.obs && it.obs[c] && +it.obs[c].n) || 1;
  for (const it of items) for (const c of allCats(it)) { if (c === GH) continue; const k = c + '\u0001' + station(it); if (!G.has(k)) G.set(k, []); G.get(k).push(it); }
  for (const [k, l] of G) { const [c, st] = k.split('\u0001'); let ev = null;
    for (const it of l.filter(goodTs).sort((a, b) => fixTs(a) - fixTs(b))) { const t = fixTs(it), n = nOf(it, c);
      if (ev && gap && t - ev.last <= gap) { ev.last = t; ev.n = Math.max(ev.n, n); ev.photos++; } else { ev = { c, st, t, last: t, n, photos: 1, it }; out.push(ev); } }
    for (const it of l.filter(i => !goodTs(i))) out.push({ c, st, t: NaN, last: NaN, n: nOf(it, c), photos: 1, it, nodate: true }); }
  return out;
}

/* ---------- Resumen ---------- */
const sumF = { only: false };
const SUMM = [['f', 'Fotos'], ['e', 'Eventos'], ['i', 'Individuos'], ['r', 'Abundancia relativa']];
function renderSummary() {
  const filtered = S.view.length < S.items.length, only = sumF.only && filtered, its = only ? S.view : S.items;
  const stations = [...new Set(its.map(station))].sort(), cats = S.cats.filter(c => its.some(i => hasCat(i, c)));
  const evs = buildEvents(its), done = its.filter(i => i.cat).length, ghN = its.filter(i => hasCat(i, GH)).length;
  const ts = its.filter(goodTs).map(fixTs), first = ts.length ? Math.min(...ts) : null, last = ts.length ? Math.max(...ts) : null;
  const td = Object.fromEntries(stations.map(s => [s, trapDays(s)])), tdTot = stations.reduce((a, s) => a + td[s].days, 0);
  const M = { f: {}, e: {}, i: {} }; for (const c of cats) { M.f[c] = {}; M.e[c] = {}; M.i[c] = {}; }
  for (const it of its) for (const c of allCats(it)) if (M.f[c]) { const s = station(it); M.f[c][s] = (M.f[c][s] || 0) + 1; }
  for (const e of evs) if (M.e[e.c]) { M.e[e.c][e.st] = (M.e[e.c][e.st] || 0) + 1; M.i[e.c][e.st] = (M.i[e.c][e.st] || 0) + e.n; }
  const tot = (m, c) => Object.values(M[m][c]).reduce((a, b) => a + b, 0), colTot = (m, s) => cats.reduce((a, c) => a + (M[m][c][s] || 0), 0);
  const val = (m, c, s) => { // c = null: todas las especies; s = null: todas las estaciones
    if (m === 'r') { const ev = c ? (s ? M.e[c][s] || 0 : tot('e', c)) : (s ? colTot('e', s) : evs.length); const d = s ? td[s].days : tdTot; return d ? ev / d * 100 : null; }
    return c ? (s ? M[m][c][s] || 0 : tot(m, c)) : (s ? colTot(m, s) : cats.reduce((a, x) => a + tot(m, x), 0)); };
  sumData = { stations, cats, val, td, tdTot, evs, its };
  const fmt = (m, v) => m === 'r' ? (v == null ? '<span class="mu">—</span>' : v.toFixed(1)) : (v ? v : '<span class="mu">—</span>');
  const tdLbl = s => `<br><small class="mu">${td[s].days} d${td[s].est ? '*' : ''}</small>`;
  const spLbl = c => `${esc(c)}${S.sci[c] ? `<br><i class="mu">${esc(S.sci[c])}</i>` : ''}`;
  const rot = ls('bt_sumrot', false), sel = ls('bt_summ', 'e'), folds = ls('bt_sumfold', {});
  const table = m => { const R = m === 'r';
    if (!rot) return `<table class="st"><thead><tr><th>Especie</th>${stations.map(s => `<th>${esc(s)}${R ? tdLbl(s) : ''}</th>`).join('')}<th>Total${R ? `<br><small class="mu">${tdTot} d</small>` : ''}</th></tr></thead><tbody>`
      + cats.map(c => `<tr><td>${spLbl(c)}</td>${stations.map(s => `<td>${fmt(m, val(m, c, s))}</td>`).join('')}<td>${fmt(m, val(m, c, null))}</td></tr>`).join('')
      + `<tr class="tot"><td>Todas las especies</td>${stations.map(s => `<td>${fmt(m, val(m, null, s))}</td>`).join('')}<td>${fmt(m, val(m, null, null))}</td></tr></tbody></table>`;
    return `<table class="st"><thead><tr><th>Estación</th>${cats.map(c => `<th>${esc(c)}</th>`).join('')}<th>Todas</th></tr></thead><tbody>`
      + stations.map(s => `<tr><td>${esc(s)}${R ? tdLbl(s) : ''}</td>${cats.map(c => `<td>${fmt(m, val(m, c, s))}</td>`).join('')}<td>${fmt(m, val(m, null, s))}</td></tr>`).join('')
      + `<tr class="tot"><td>Total${R ? `<br><small class="mu">${tdTot} d</small>` : ''}</td>${cats.map(c => `<td>${fmt(m, val(m, c, null))}</td>`).join('')}<td>${fmt(m, val(m, null, null))}</td></tr></tbody></table>`; };
  const nodate = evs.filter(e => e.nodate).length, ev = evMin();
  const warn = { susp: its.filter(suspect).length, nodate: its.filter(i => isNaN(capTs(i))).length, rev: its.filter(i => i.rev).length, nost: stations.filter(s => !(S.stations[s] && S.stations[s].start && S.stations[s].end)).length };
  const sec = (id, title, tip, body) => `<details class="ssec" id="${id}"${folds[id] ? '' : ' open'}><summary title="${esc(tip)}">${title}</summary>${body}</details>`;
  const pct = its.length ? Math.floor(done / its.length * 100) : 0;
  let h = `<div class="printhead"><h1>${esc(projName())}</h1><p>Resumen de cámaras trampa · ${stations.length} estación(es)${first ? ` · del ${ymd(first)} al ${ymd(last)}` : ''} · generado el ${ymd(Date.now())} con BioTrampa</p></div>`
    + `<div class="bignums"><div><b>${cats.length}</b><span>especies</span></div><div><b>${evs.length}</b><span>eventos independientes</span></div><div><b>${tdTot}</b><span>días-trampa</span></div><div><b>${pct} %</b><span>clasificado</span></div></div>`
    + `<p class="sumhead"><b>${esc(projName())}</b>${only ? ' (solo las fotos filtradas)' : ''} · ${its.length} fotos · ${done} clasificadas · ${its.length - done} pendientes · ${stations.length} estación(es)${first ? ` · ${ymd(first)} a ${ymd(last)}` : ''}</p>`
    + `<p class="hint tiny">${esc(GH)} (disparos sin fauna): ${ghN} foto(s)${its.length ? `, ${Math.round(ghN / its.length * 100)} % de las fotos` : ''}.</p>`
    + `<label class="chk sumonly noprint" title="${filtered ? 'Usa solo las fotos que dejan ver los filtros (embudo, especie o estación)' : 'Activa un filtro (embudo, especie o estación) para resumir solo una parte'}"><input type="checkbox" id="sumonly"${only ? ' checked' : ''}${filtered ? '' : ' disabled'}> Resumir solo las fotos que muestran los filtros (${S.view.length} de ${S.items.length})</label>`;
  const w = []; if (warn.susp) w.push(`<button class="lnk2" data-show="susp"><b>${warn.susp}</b> foto(s) con fecha sospechosa (cámara mal configurada o fuera de las fechas de la estación): verlas</button>`); if (warn.nodate) w.push(`<b>${warn.nodate}</b> sin fecha de captura${nodate ? ` (${nodate} evento(s) sin fecha cuentan por separado)` : ''}`);
  if (warn.rev) w.push(`<button class="lnk2" data-show="rev"><b>${warn.rev}</b> marcada(s) para revisar: verlas</button>`); if (warn.nost) w.push(`<button class="lnk2" data-go="ss-st"><b>${warn.nost}</b> estación(es) sin fechas de instalación y retiro (los días-trampa se estiman con las fotos): completarlas</button>`);
  if (w.length) h += `<div class="warnbox noprint">${w.map(x => `<div>${x}</div>`).join('')}</div>`;
  h += `<nav class="sumnav noprint"><button class="lnk2" data-go="ss-tab">Especies y estaciones</button> · <button class="lnk2" data-go="ss-act">Actividad</button> · <button class="lnk2" data-go="ss-st">Estaciones</button> · <button class="lnk2" data-go="ss-fun">Funcionamiento</button> · <button class="lnk2" data-go="ss-acu">Acumulación</button> · <button class="lnk2" data-go="ss-tras">Traslape</button> · <button class="lnk2" data-go="ss-ind">Individuos</button></nav>`;
  h += sec('ss-tab', 'Especies y estaciones', 'Fotos, eventos independientes, individuos y abundancia relativa de cada especie en cada estación',
    `<div class="mbar noprint"><div class="seg" id="mseg">${SUMM.map(([k, t]) => `<button data-m="${k}" class="${k === sel ? 'on' : ''}">${t}</button>`).join('')}</div><label class="chk"><input type="checkbox" id="mrot"${rot ? ' checked' : ''}> Estaciones en filas</label></div>`
    + `<div id="mtabs">${SUMM.map(([k, t]) => `<div class="mt" data-m="${k}"${k === sel ? '' : ' hidden'}><p class="ptitle">${t}${k === 'r' ? ' (eventos por cada 100 días-trampa)' : ''}</p><div class="tw">${table(k)}</div></div>`).join('')}</div>`
    + `<p class="hint tiny">${ev ? `<b>Evento</b>: fotos de la misma especie en la misma estación separadas por menos de ${ev} min` : '<b>Evento</b>: cada foto cuenta por separado'} (se cambia en Ajustes). <b>Individuos</b>: el máximo visto en una sola foto de cada evento; si no se anotó, cuenta 1. <b>Abundancia relativa</b>: eventos por cada 100 días-trampa.${stations.some(s => td[s].est) ? ' * días-trampa estimados con la primera y la última foto.' : ''}</p>`);
  h += sec('ss-act', 'Horas de actividad', 'Eventos independientes por hora del día (hora corregida)', `<label class="sm noprint">Especie <select id="sumsp"><option value="">Todas las especies</option>${cats.map(c => `<option>${esc(c)}</option>`).join('')}</select></label><div id="actchart"></div>`);
  const stRows = stations.map((s, i) => { const l = S.items.filter(it => station(it) === s), c = stCoords(s), st = S.stations[s] || {}, dc = l.filter(it => it.cat).length;
    const inp = (k, type, ph) => `<input class="sti" id="si-${i}-${k}" data-st="${esc(s)}" data-k="${k}" type="${type}" value="${esc(st[k] == null ? '' : st[k])}"${ph ? ` placeholder="${esc(ph)}"` : ''}>`;
    return `<tr><td>${esc(s)}</td><td>${l.length}</td><td>${dc} (${l.length ? Math.round(dc / l.length * 100) : 0} %)</td><td>${inp('start', 'date')}</td><td>${inp('end', 'date')}</td><td>${td[s].days ? td[s].days + (td[s].est ? '*' : '') : '—'}</td>`
      + `<td>${inp('lat', 'text', c && c[2] ? c[0].toFixed(5) + ' (GPS)' : '')}</td><td>${inp('lon', 'text', c && c[2] ? c[1].toFixed(5) + ' (GPS)' : '')}</td><td>${inp('cam', 'text', '')}</td><td>${esc(offsOf(s)) || '—'}</td>`
      + `<td><button class="stedit" data-st="${esc(s)}" title="Altura, cebo y notas">Más…</button></td></tr>`; }).join('');
  h += sec('ss-st', 'Estaciones', 'Fechas, coordenadas y cámara de cada estación. Se escriben directamente en la tabla y se guardan solas.',
    `<div class="stbtns noprint"><button id="st_alld" title="Para las estaciones sin fechas, usa la primera y la última foto">Fechas de las fotos donde falten</button><button id="st_allg" title="Para las estaciones sin coordenadas, usa el promedio del GPS de sus fotos">GPS de las fotos donde falte</button><button id="st_imp" title="Cargar un CSV con columnas: estación, latitud, longitud, instalación, retiro, cámara, altura, cebo, notas">Importar estaciones (CSV)</button><button id="st_tpl" class="lnk2">Descargar plantilla</button></div>`
    + `<div class="tw"><table class="st sttab"><thead><tr><th>Estación</th><th>Fotos</th><th>Clasificadas</th><th>Instalación</th><th>Retiro</th><th>Días-trampa</th><th>Latitud</th><th>Longitud</th><th>Cámara</th><th>Corrección de hora</th><th></th></tr></thead><tbody>${stRows}</tbody></table></div>`
    + `<p class="hint tiny">Los cambios se guardan solos. Con las fechas de instalación y retiro se calculan los días-trampa; nada de esto modifica las fotos.</p>`);
  h += extraSummary(); // funcionamiento de las cámaras, acumulación, traslape e individuos
  const sc = $('#sum').scrollTop; $('#sumbody').innerHTML = h; $('#sum').scrollTop = sc;
  $('#sumsp').onchange = () => drawActivity($('#sumsp').value); drawActivity(''); bindExtraSummary();
  document.querySelectorAll('#sumbody details.ssec').forEach(d => d.ontoggle = () => { const f = ls('bt_sumfold', {}); f[d.id] = !d.open; sv('bt_sumfold', f); });
  document.querySelectorAll('#sumbody [data-go]').forEach(b => b.onclick = () => { const d = $('#' + b.dataset.go); d.open = true; d.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
  document.querySelectorAll('#sumbody [data-show]').forEach(b => b.onclick = () => { closeOver(true); closeLb(); S.f.st = b.dataset.show; $('#st').value = S.f.st === 'susp' ? 'susp' : 'all'; updFilt(); applyFilters(); $('#gal').scrollTop = 0; });
  $('#mseg').onclick = e => { const b = e.target.closest('button'); if (!b) return; sv('bt_summ', b.dataset.m); document.querySelectorAll('#mseg button').forEach(x => x.classList.toggle('on', x === b)); document.querySelectorAll('#mtabs .mt').forEach(x => x.hidden = x.dataset.m !== b.dataset.m); };
  $('#mrot').onchange = e => { sv('bt_sumrot', e.target.checked); renderSummary(); };
  $('#sumonly').onchange = e => { sumF.only = e.target.checked; renderSummary(); };
  document.querySelectorAll('.stedit').forEach(b => b.onclick = () => openStation(b.dataset.st));
  $('#st_alld').onclick = () => { let n = 0; for (const s of stations) { const st = S.stations[s] || {}; if (st.start && st.end) continue; const t = photoDates(s); if (!t) continue;
    S.stations[s] = { ...st, start: st.start || t[0], end: st.end || t[1] }; n++; } saveReg(); renderSummary(); toast(n ? `Fechas completadas en ${n} estación(es) con la primera y la última foto.` : 'No hay estaciones sin fechas (o sus fotos no tienen fecha).', 4000); };
  $('#st_allg').onclick = () => { let n = 0; for (const s of stations) { const st = S.stations[s] || {}; if (st.lat && st.lon) continue; const g = photoGps(s); if (!g) continue;
    S.stations[s] = { ...st, lat: g[0].toFixed(6), lon: g[1].toFixed(6) }; n++; } saveReg(); renderSummary(); toast(n ? `Coordenadas completadas en ${n} estación(es) con el GPS de sus fotos.` : 'No hay estaciones sin coordenadas con fotos que tengan GPS.', 4000); };
  $('#st_imp').onclick = () => $('#filest').click();
  $('#st_tpl').onclick = () => download(csvBlob([ST_COLS, ...stations.map(s => { const st = S.stations[s] || {}; return [s, st.lat || '', st.lon || '', st.start || '', st.end || '', st.cam || '', st.h || '', st.bait || '', st.notes || '']; })]), 'biotrampa_estaciones.csv');
}
const ST_COLS = ['Estación', 'Latitud', 'Longitud', 'Instalación', 'Retiro', 'Cámara', 'Altura (cm)', 'Cebo', 'Notas'];
// Edición directa en la tabla de estaciones: se valida, se guarda y se vuelve a calcular sin perder el lugar
$('#sumbody').addEventListener('change', e => {
  const t = e.target; if (!t.classList || !t.classList.contains('sti')) return;
  const s = t.dataset.st, k = t.dataset.k, v = t.value.trim(), st = { ...(S.stations[s] || {}) };
  if ((k === 'lat' && v && (!isFinite(+v) || Math.abs(+v) > 90)) || (k === 'lon' && v && (!isFinite(+v) || Math.abs(+v) > 180))) { t.value = st[k] || ''; return toast(k === 'lat' ? 'Latitud no válida (entre -90 y 90, en grados decimales).' : 'Longitud no válida (entre -180 y 180, en grados decimales).', 4000); }
  const nst = { ...st, [k]: v }; if (nst.start && nst.end && nst.end < nst.start) { t.value = st[k] || ''; return toast('La fecha de retiro es anterior a la de instalación.', 4000); }
  if (Object.values(nst).some(Boolean)) S.stations[s] = nst; else delete S.stations[s];
  saveReg(); setTimeout(() => { const id = document.activeElement && document.activeElement.id; renderSummary(); if (id && document.getElementById(id)) document.getElementById(id).focus(); }, 0);
});
// Importar estaciones desde un CSV (de Excel o de la libreta de campo); solo se actualizan las estaciones que existen en la carpeta
const parseDay = v => { v = (v || '').trim(); let m; if ((m = v.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${pad(+m[2])}-${pad(+m[3])}`;
  if ((m = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/))) { const y = m[3].length === 2 ? '20' + m[3] : m[3]; return `${y}-${pad(+m[2])}-${pad(+m[1])}`; } return ''; };
$('#filest').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return; const rows = parseCsv(await f.text()); if (rows.length < 2) return toast('El archivo no tiene filas de estaciones.', 4000);
  const H = rows[0].map(norm), col = (...ks) => H.findIndex(h => ks.some(k => h.startsWith(k)));
  const ix = { s: col('estacion', 'station', 'sitio', 'camara trampa'), lat: col('lat'), lon: col('lon', 'long'), start: col('instal', 'inicio', 'start', 'fecha de instal'), end: col('retiro', 'fin', 'end', 'fecha de retiro'), cam: col('camara', 'camera', 'modelo'), h: col('altura', 'height'), bait: col('cebo', 'bait', 'atrayente'), notes: col('nota', 'comentario', 'notes', 'observ') };
  if (ix.s < 0) return toast('No encontré la columna "Estación" en el CSV. Descarga la plantilla para ver el formato.', 6000);
  if (ix.cam === ix.s) ix.cam = -1;
  const known = new Map([...new Set(S.items.map(station))].map(s => [norm(s), s])); let ok = 0; const miss = [], bad = [];
  for (const r of rows.slice(1)) { const name = (r[ix.s] || '').trim(); if (!name) continue; const s = known.get(norm(name)); if (!s) { miss.push(name); continue; }
    const g = k => ix[k] >= 0 ? (r[ix[k]] || '').trim() : undefined, st = { ...(S.stations[s] || {}) };
    for (const k of ['lat', 'lon']) { const v = g(k); if (v === undefined || v === '') continue; const n = +v.replace(',', '.'); if (isFinite(n) && Math.abs(n) <= (k === 'lat' ? 90 : 180)) st[k] = String(n); else bad.push(`${name}: ${k === 'lat' ? 'latitud' : 'longitud'} "${v}"`); }
    for (const k of ['start', 'end']) { const v = g(k); if (!v) continue; const d = parseDay(v); if (d) st[k] = d; else bad.push(`${name}: fecha "${v}"`); }
    for (const k of ['cam', 'h', 'notes']) { const v = g(k); if (v) st[k] = v; }
    const b = g('bait'); if (b) st.bait = /^(s|y|1|true)/i.test(norm(b)) ? 'Sí' : /^(n|0|false)/i.test(norm(b)) ? 'No' : st.bait;
    if (st.start && st.end && st.end < st.start) { bad.push(`${name}: retiro antes de la instalación`); continue; }
    S.stations[s] = st; ok++; }
  saveReg(); if (!$('#sum').hidden) renderSummary(); applyFilters();
  toast(`Estaciones importadas: ${ok}.${miss.length ? ` No están en esta carpeta: ${miss.slice(0, 5).join(', ')}${miss.length > 5 ? '…' : ''}.` : ''}${bad.length ? ` Datos no válidos (se ignoraron): ${bad.slice(0, 3).join('; ')}${bad.length > 3 ? '…' : ''}.` : ''}`, 10000);
};
function drawActivity(c) {
  const l = sumData.evs.filter(e => (c ? e.c === c : true) && !isNaN(e.t)), hrs = new Array(24).fill(0), per = { day: 0, crep: 0, night: 0 };
  l.forEach(e => { hrs[new Date(e.t).getHours()]++; const p = period(e.it); if (p) per[p]++; }); const mx = Math.max(1, ...hrs), W = 720, H = 200, bw = W / 24;
  const hf = ts => { const d = new Date(ts); return d.getHours() + d.getMinutes() / 60; }, suns = l.map(e => sunOf(e.it)).filter(Boolean);
  const rise = suns.length ? suns.reduce((a, s) => a + hf(s.rise), 0) / suns.length : 6, set = suns.length ? suns.reduce((a, s) => a + hf(s.set), 0) / suns.length : 19, hm = x => `${pad(Math.floor(x))}:${pad(Math.round(x % 1 * 60) % 60)}`;
  let s = `<svg viewBox="0 0 ${W} ${H + 34}" role="img" aria-label="Eventos por hora del día"><rect x="0" y="0" width="${bw * rise}" height="${H}" class="nightbg"/><rect x="${bw * set}" y="0" width="${bw * (24 - set)}" height="${H}" class="nightbg"/>`;
  hrs.forEach((v, i) => { const bh = v / mx * (H - 18); s += `<rect x="${i * bw + 3}" y="${H - bh}" width="${bw - 6}" height="${bh}" class="bar"><title>${pad(i)}:00–${pad(i)}:59 · ${v} evento(s)</title></rect>${v ? `<text x="${i * bw + bw / 2}" y="${H - bh - 4}" class="v">${v}</text>` : ''}`; });
  for (let i = 0; i < 24; i += 3) s += `<text x="${i * bw}" y="${H + 16}" class="ax"${i ? '' : ' style="text-anchor:start"'}>${pad(i)}:00</text>`;
  const t = l.length || 1;
  s += `<line x1="0" y1="${H}" x2="${W}" y2="${H}" class="base"/></svg><p class="hint tiny">${l.length} evento(s) con fecha · <b>día ${Math.round(per.day / t * 100)} %</b> · <b>crepúsculo ${Math.round(per.crep / t * 100)} %</b> · <b>noche ${Math.round(per.night / t * 100)} %</b>. `
    + (suns.length ? `Zona sombreada: noche, entre la puesta (${hm(set)}) y la salida del sol (${hm(rise)}) promedio de estos registros.` : 'Zona sombreada: noche aproximada (19:00 a 6:00); escribe las coordenadas de las estaciones para usar la salida y puesta del sol reales.') + '</p>';
  $('#actchart').innerHTML = s;
}
// Tablas del resumen: un CSV por tabla dentro de un .zip
const csvText = rows => '﻿' + rows.map(r => r.map(cesc).join(',')).join('\r\n') + '\r\n';
$('#sumcsv').onclick = () => { if (!sumData) return; const { stations, cats, val, td, tdTot, evs } = sumData, nm = { f: 'fotos', e: 'eventos', i: 'individuos', r: 'abundancia_relativa' };
  const f2 = (m, v) => m === 'r' ? (v == null ? '' : v.toFixed(2)) : v;
  const files = SUMM.map(([m, t]) => [`${nm[m]}.csv`, csvText([[t + (m === 'r' ? ' (eventos por 100 días-trampa)' : '') + ` · eventos separados por ${evMin()} min`], ['Especie', 'Nombre científico', ...stations, 'Total'], ...cats.map(c => [c, S.sci[c] || '', ...stations.map(s => f2(m, val(m, c, s))), f2(m, val(m, c, null))]), ['Todas las especies', '', ...stations.map(s => f2(m, val(m, null, s))), f2(m, val(m, null, null))], ...(m === 'r' ? [['Días-trampa', '', ...stations.map(s => td[s].days + (td[s].est ? ' (estimado)' : '')), tdTot]] : [])])]);
  files.push(['lista_de_eventos.csv', csvText([['Estación', 'Especie', 'Nombre científico', 'Inicio', 'Fin', 'Fotos', 'Individuos (máximo en una foto)'], ...evs.slice().sort((a, b) => a.st.localeCompare(b.st) || a.c.localeCompare(b.c) || (a.t || 0) - (b.t || 0)).map(e => [e.st, e.c, S.sci[e.c] || '', isNaN(e.t) ? 'sin fecha' : `${ymd(e.t)} ${hms(e.t)}`, isNaN(e.last) ? '' : `${ymd(e.last)} ${hms(e.last)}`, e.photos, e.n])])]);
  const hr = Array.from({ length: 24 }, (_, h) => [`${pad(h)}:00`, ...cats.map(c => evs.filter(e => e.c === c && !isNaN(e.t) && new Date(e.t).getHours() === h).length), evs.filter(e => !isNaN(e.t) && new Date(e.t).getHours() === h).length]);
  files.push(['actividad_por_hora.csv', csvText([['Hora', ...cats, 'Todas'], ...hr])]);
  files.push(['estaciones.csv', csvText([[...ST_COLS, 'Días-trampa', 'Corrección de hora'], ...stations.map(s => { const st = S.stations[s] || {}; return [s, st.lat || '', st.lon || '', st.start || '', st.end || '', st.cam || '', st.h || '', st.bait || '', st.notes || '', td[s].days + (td[s].est ? ' (estimado)' : ''), offTxt(S.offsets[s])]; })])]);
  download(zipStore(files), `biotrampa_resumen_${ymd(Date.now())}.zip`); toast(`Tablas guardadas: ${files.length} archivos CSV en un .zip.`, 4000); };

/* ---------- Menú Exportar ---------- */
const xRun = f => () => { closePops(); f(); };
$('#x_csv').onclick = xRun(exportMainCsv); $('#x_rt').onclick = xRun(exportRecordTable); $('#x_dp').onclick = xRun(exportCamtrapDP); $('#x_merge').onclick = xRun(() => $('#filecsv').click()); $('#x_kml').onclick = xRun(exportKml);
// Antes de exportar para análisis: avisar si faltan datos de estaciones que esos formatos necesitan
async function missingOk(what, need) {
  await prepare(true); const sts = [...new Set(S.items.map(station))], miss = [];
  for (const s of sts) { const st = S.stations[s] || {}, f = []; if (need.includes('fechas') && !(st.start && st.end)) f.push('fechas de instalación y retiro'); if (need.includes('gps') && !stCoords(s)) f.push('coordenadas'); if (f.length) miss.push(`· ${s}: sin ${f.join(' ni ')}`); }
  if (!miss.length) return true;
  return confirm(`${what}: a ${miss.length} estación(es) les faltan datos.\n${miss.slice(0, 8).join('\n')}${miss.length > 8 ? '\n…' : ''}\n\nSin fechas se estiman con la primera y la última foto. Puedes completarlas en Resumen → Estaciones.\n\n¿Exportar de todos modos?`);
}
async function exportKml() { // estaciones para Google Earth (sin internet: solo el archivo)
  if (!S.items.length) return toast('Abre una carpeta primero.'); await prepare(true);
  const sts = [...new Set(S.items.map(station))].sort(), pts = sts.map(s => ({ s, c: stCoords(s) })).filter(p => p.c), x = v => esc(v).replace(/'/g, '&apos;');
  if (!pts.length) return toast('Ninguna estación tiene coordenadas: escríbelas en Resumen → Estaciones o usa el GPS de sus fotos.', 6000);
  const pl = pts.map(({ s, c }) => { const sp = S.cats.filter(k => S.items.some(i => station(i) === s && hasCat(i, k))), td = trapDays(s);
    return `<Placemark><name>${x(s)}</name><description>${x(`${sp.length} especie(s): ${sp.join(', ') || '—'}. ${td.days} días-trampa${td.start ? ` (${td.start} a ${td.end})` : ''}.`)}</description><Point><coordinates>${c[1].toFixed(6)},${c[0].toFixed(6)},0</coordinates></Point></Placemark>`; }).join('\n');
  download(new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>${x(projName())}</name>\n${pl}\n</Document></kml>\n`], { type: 'application/vnd.google-earth.kml+xml' }), `estaciones_${depId(projName())}.kml`);
  toast(`KML con ${pts.length} estación(es)${pts.length < sts.length ? `; ${sts.length - pts.length} sin coordenadas no se incluyeron` : ''}. Ábrelo con Google Earth o QGIS.`, 6000);
}
$('#x_dh').onclick = () => { const sp = $('#x_sp').value, occ = +$('#x_occ').value; closePops(); exportDetHist(sp, occ); };
$('#export').addEventListener('click', () => { const cur = $('#x_sp').value, cats = S.cats.filter(c => S.items.some(i => hasCat(i, c)));
  $('#x_sp').innerHTML = cats.length ? cats.map(c => `<option${c === cur ? ' selected' : ''}>${esc(c)}</option>`).join('') : '<option value="">(sin especies clasificadas)</option>'; });
/* ---------- Exportes para análisis (sin servidor) ---------- */
const isoLocal = ts => { const d = new Date(ts), o = -d.getTimezoneOffset(), sg = o >= 0 ? '+' : '-', a = Math.abs(o); return `${ymd(d)}T${hms(d)}${sg}${pad(Math.floor(a / 60))}:${pad(a % 60)}`; };
const plainCsv = rows => rows.map(r => r.map(v => { v = v == null ? '' : String(v); return /[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',')).join('\r\n') + '\r\n';
const depId = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9_-]+/g, '_');
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function zipStore(files) { // .zip sin compresión, hecho a mano (sin librerías)
  const enc = new TextEncoder(), parts = [], cen = []; let off = 0;
  for (const [name, text] of files) { const nb = enc.encode(name), data = typeof text === 'string' ? enc.encode(text) : text; // 1.4.15: también imágenes (Uint8Array) let c = 0xFFFFFFFF; for (const x of data) c = CRC[(c ^ x) & 255] ^ (c >>> 8); c = (c ^ 0xFFFFFFFF) >>> 0;
    const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint32(14, c, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nb.length, true);
    const ch = new DataView(new ArrayBuffer(46)); ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true); ch.setUint32(16, c, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, nb.length, true); ch.setUint32(42, off, true);
    parts.push(h.buffer, nb, data); cen.push(ch.buffer, nb); off += 30 + nb.length + data.length; }
  const cs = cen.reduce((a, x) => a + (x.byteLength || x.length), 0), e = new DataView(new ArrayBuffer(22)); e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cs, true); e.setUint32(16, off, true);
  return new Blob([...parts, ...cen, e.buffer], { type: 'application/zip' });
}
const LIFE = { 'Adulto': 'adult', 'Juvenil': 'subadult', 'Cría': 'juvenile' }, SEXV = { 'Macho': 'male', 'Hembra': 'female' };
async function exportCamtrapDP() {
  if (!S.items.length) return toast('Abre una carpeta primero.'); if (!(await missingOk('Camtrap DP', ['fechas', 'gps']))) return; const stations = [...new Set(S.items.map(station))].sort(), BASE = 'https://raw.githubusercontent.com/tdwg/camtrap-dp/1.0/';
  const dep = [['deploymentID', 'locationID', 'locationName', 'latitude', 'longitude', 'deploymentStart', 'deploymentEnd', 'cameraID', 'cameraModel', 'cameraHeight', 'baitUse', 'deploymentComments']];
  for (const s of stations) { const st = S.stations[s] || {}, c = stCoords(s), t = trapDays(s);
    dep.push([depId(s), depId(s), s, c ? c[0].toFixed(6) : '', c ? c[1].toFixed(6) : '', t.start ? isoLocal(Date.parse(t.start + 'T00:00:00')) : '', t.end ? isoLocal(Date.parse(t.end + 'T23:59:59')) : '', st.cam || '', st.cam || '', st.h ? (+st.h / 100).toFixed(2) : '', st.bait === 'Sí' ? 'true' : st.bait === 'No' ? 'false' : '', [st.notes, t.est ? 'Fechas estimadas con la primera y la última foto' : ''].filter(Boolean).join('. ')]); }
  const med = [['mediaID', 'deploymentID', 'captureMethod', 'timestamp', 'filePath', 'filePublic', 'fileName', 'fileMediatype', 'mediaComments']];
  const obs = [['observationID', 'deploymentID', 'mediaID', 'eventStart', 'eventEnd', 'observationLevel', 'observationType', 'scientificName', 'count', 'lifeStage', 'sex', 'behavior', 'individualID', 'classificationMethod', 'classifiedBy', 'classificationTimestamp', 'observationComments']];
  let nm = 0, no = 0, notime = 0; const taxa = new Map();
  for (const it of S.items) { const id = 'm' + (++nm), dId = depId(station(it)), t = isNaN(capTs(it)) ? '' : isoLocal(fixTs(it)); if (!t) notime++;
    const ext = it.name.split('.').pop().toLowerCase(), mt = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', mp4: 'video/mp4', m4v: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', avi: 'video/x-msvideo' }[ext] || '';
    med.push([id, dId, 'activityDetection', t, pathOf(it), 'false', it.name, mt, it.note || '']);
    for (const c of allCats(it)) { const o = (it.obs && it.obs[c]) || {}, sci = S.sci[c] || '', type = c === GH ? 'blank' : sci ? 'animal' : /sin identificar/i.test(c) ? 'unknown' : 'animal'; if (sci) taxa.set(sci, c);
      obs.push(['o' + (++no), dId, id, t, t, 'media', type, c === GH ? '' : sci, c === GH ? '' : o.n || '', LIFE[o.age] || '', SEXV[o.sex] || '', o.beh || '', o.id || '', 'human', it.verBy || '', it.cls ? isoLocal(Date.parse(it.cls + 'T12:00:00')) : '', c === GH ? '' : c]); } }
  const pkg = { profile: BASE + 'camtrap-dp-profile.json', name: depId(projName()).toLowerCase(), title: $('#proj').value || projName(), created: new Date().toISOString(), contributors: [{ title: $('#reviewer').value || 'BioTrampa', role: 'contributor' }],
    project: { title: $('#proj').value || projName(), samplingDesign: 'opportunistic', captureMethod: ['activityDetection'], individualAnimals: S.items.some(i => Object.values(i.obs || {}).some(o => o.id)), observationLevel: ['media'] },
    taxonomic: [...taxa].map(([sci, c]) => ({ scientificName: sci, vernacularNames: { spa: c } })),
    resources: [['deployments', 'deployments-table-schema.json'], ['media', 'media-table-schema.json'], ['observations', 'observations-table-schema.json']].map(([n, sc]) => ({ name: n, path: n + '.csv', profile: 'tabular-data-resource', format: 'csv', mediatype: 'text/csv', encoding: 'utf-8', schema: BASE + sc })) };
  download(zipStore([['datapackage.json', JSON.stringify(pkg, null, 2)], ['deployments.csv', plainCsv(dep)], ['media.csv', plainCsv(med)], ['observations.csv', plainCsv(obs)]]), `camtrapdp_${depId(projName())}_${ymd(Date.now())}.zip`);
  const miss = dep.slice(1).filter(r => !r[3] || !r[5] || !r[6]).length;
  toast(`Camtrap DP exportado: ${stations.length} estaciones, ${nm} archivos, ${no} observaciones.${miss ? ` Ojo: ${miss} estación(es) sin coordenadas o fechas (complétalas con Editar).` : ''}${notime ? ` ${notime} archivo(s) sin fecha.` : ''}`, 9000);
}
async function exportRecordTable() {
  if (!S.items.length) return toast('Abre una carpeta primero.'); await prepare(true); const rows = [['Station', 'Camera', 'Species', 'ScientificName', 'DateTimeOriginal', 'Date', 'Time', 'Directory', 'FileName', 'Individuals', 'Period']];
  for (const it of S.items) { if (isNaN(capTs(it))) continue; const t = fixTs(it), p = period(it);
    for (const c of allCats(it)) { if (c === GH) continue; const o = (it.obs && it.obs[c]) || {}; rows.push([station(it), camOf(it), c, S.sci[c] || '', `${ymd(t)} ${hms(t)}`, ymd(t), hms(t), [it.src.name, ...it.parts].join('/'), it.name, o.n || '', p ? PER[p] : '']); } }
  download(csvBlob(rows), `registros_camtrapR_${ymd(Date.now())}.csv`); toast(`Tabla de registros: ${rows.length - 1} registros (solo fotos con fecha).`, 5000);
}
async function exportDetHist(sp, occ) {
  if (!sp) return toast('No hay especies para exportar.', 3000); if (!(await missingOk('Historia de detección', ['fechas']))) return;
  const stations = [...new Set(S.items.map(station))].sort(), td = Object.fromEntries(stations.map(s => [s, trapDays(s)])), ok = stations.filter(s => td[s].start && td[s].end);
  if (!ok.length) return toast('Se necesitan fechas (de instalación y retiro o de las fotos) para la historia de detección.', 5000);
  const t0 = Math.min(...ok.map(s => Date.parse(td[s].start))), t1 = Math.max(...ok.map(s => Date.parse(td[s].end))), nOcc = Math.ceil((Math.round((t1 - t0) / DAY) + 1) / occ);
  const head = ['Estación', ...Array.from({ length: nOcc }, (_, k) => `O${k + 1} (${isoDay(t0 + k * occ * DAY)})`)], rows = [head];
  for (const s of stations) { if (!td[s].start) { rows.push([s, ...new Array(nOcc).fill('NA')]); continue; }
    const a = Date.parse(td[s].start), b = Date.parse(td[s].end), dn = downSet(s), det = new Set(S.items.filter(i => station(i) === s && hasCat(i, sp) && goodTs(i) && !suspect(i)).map(i => Math.floor((Date.parse(ymd(fixTs(i))) - t0) / DAY / occ)));
    rows.push([s, ...Array.from({ length: nOcc }, (_, k) => { let op = 0; for (let j = 0; j < occ; j++) { const t = t0 + (k * occ + j) * DAY; if (t >= a && t <= b && !dn.has(isoDay(t))) op++; } return op ? (det.has(k) ? 1 : 0) : 'NA'; })]); } // NA: la cámara no funcionó en toda la ocasión
  download(csvBlob(rows), `historia_deteccion_${depId(sp)}_${occ}d_${ymd(Date.now())}.csv`); toast(`Historia de detección de ${sp}: ${stations.length} estaciones × ${nOcc} ocasiones de ${occ} día(s).`, 6000);
}
// Unir CSV exportados por varias personas (sin filas repetidas)
function parseCsv(t) { t = t.replace(/^﻿/, ''); const rows = []; let r = [], f = '', q = false; const l1 = t.split('\n')[0], D = (l1.split(';').length > l1.split(',').length) ? ';' : ','; // Excel en español separa con ;
  for (let i = 0; i < t.length; i++) { const ch = t[i]; if (q) { if (ch === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
    else if (ch === '"') q = true; else if (ch === D) { r.push(f); f = ''; } else if (ch === '\n') { r.push(f.replace(/\r$/, '')); rows.push(r); r = []; f = ''; } else f += ch; }
  if (f || r.length) { r.push(f.replace(/\r$/, '')); rows.push(r); } return rows.filter(x => x.length > 1 || x[0]); }
$('#filecsv').onchange = async e => {
  const files = [...e.target.files]; e.target.value = ''; if (files.length < 1) return;
  const head = [], data = [], per = []; for (const f of files) { const rows = parseCsv(await f.text()); if (!rows.length) continue; const h = rows[0]; h.forEach(c => { if (!head.includes(c)) head.push(c); });
    const sc = h.indexOf('Especie o categoría'), sps = new Set(); for (const r of rows.slice(1)) { const o = { 'Archivo de origen': f.name }; h.forEach((c, i) => o[c] = r[i] || ''); data.push(o); if (sc >= 0 && r[sc]) sps.add(r[sc]); }
    per.push({ n: f.name, rows: rows.length - 1, sps }); }
  // Vista previa: filas por archivo y especies que se escriben casi igual (p. ej. "Zorra gris" y "zorra Gris") para que se unifiquen antes
  const all = new Map(); per.forEach(p => p.sps.forEach(s => { const k = norm(s).replace(/\s+/g, ' ').trim(); if (!all.has(k)) all.set(k, new Set()); all.get(k).add(s); }));
  const near = [...all.values()].filter(v => v.size > 1).map(v => [...v].join(' / ')), only = [...all.entries()].filter(([k]) => per.filter(p => [...p.sps].some(s => norm(s).replace(/\s+/g, ' ').trim() === k)).length === 1 && per.length > 1).map(([, v]) => [...v][0]);
  if (!confirm(`Se unirán ${files.length} archivo(s):\n${per.map(p => `· ${p.n}: ${p.rows} fila(s)`).join('\n')}${near.length ? `\n\nEspecies escritas distinto (quedarán separadas): ${near.slice(0, 6).join('; ')}` : ''}${only.length ? `\n\nEspecies que solo aparecen en un archivo: ${only.slice(0, 8).join(', ')}${only.length > 8 ? '…' : ''}` : ''}\n\n¿Continuar?`)) return;
  const KEY = ['Nombre original', 'Carpeta de origen', 'Fecha de captura (EXIF)', 'Hora de captura (EXIF)', 'Especie o categoría'], seen = new Set(), out = [[...head, 'Archivo de origen']]; let dup = 0;
  for (const o of data) { const k = KEY.every(c => head.includes(c)) ? KEY.map(c => o[c]).join('|') : head.map(c => o[c]).join('|'); if (seen.has(k)) { dup++; continue; } seen.add(k); out.push([...head.map(c => o[c] || ''), o['Archivo de origen']]); }
  download(csvBlob(out), `biotrampa_registros_unidos_${ymd(Date.now())}.csv`); toast(`Registros unidos: ${out.length - 1} filas de ${files.length} archivo(s); ${dup} fila(s) repetida(s) omitida(s).`, 8000);
};

/* ---------- Lista de especies compartible ---------- */
const spExport = () => { download(new Blob([JSON.stringify({ app: 'BioTrampa', tipo: 'lista de especies', fantasmas: GH, especies: S.cats.map(c => ({ nombre: c, cientifico: S.sci[c] || '', tecla: keyOf(c) })) }, null, 2)], { type: 'application/json' }), 'biotrampa_especies.json'); toast('Lista de especies exportada. Compártela para que todos usen los mismos nombres.', 4000); };
const spImport = () => $('#fileimp').click();
function loadExampleList(quiet) { // se agregan las que falten, al final; las que ya tienes conservan su lugar y su tecla
  if (!quiet && !confirm(`Se agregarán las especies de la lista de ejemplo que no tengas (${NE_LIST.length} en total, con su nombre científico). Las que ya tienes se conservan con sus teclas. ¿Continuar?`)) return;
  let n = 0; for (const [c, sci] of NE_LIST) { const ex = S.cats.find(x => folder(x).toLowerCase() === folder(c).toLowerCase()); if (!ex) { S.cats.push(c); S.created[c] = Date.now() + n; n++; } if (sci && !S.sci[ex || c]) S.sci[ex || c] = sci; }
  sv('bt_cats', S.cats); sv('bt_sci', S.sci); sv('bt_created', S.created); saveReg(); renderSide(); if (S.cur) show(S.cur);
  toast(n ? `Lista de ejemplo: ${n} especie(s) nuevas. Ahora tienes ${S.cats.length}. Las de la décima en adelante usan letras.` : 'Ya tenías todas las especies de la lista de ejemplo.', 6000);
}
$('#fileimp').onchange = async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; let j; try { j = JSON.parse(await f.text()); } catch (x) { return toast('El archivo no es una lista de especies válida.', 4000); }
  const list = (j.especies || []).filter(x => x && x.nombre && folder(x.nombre)); if (!list.length) return toast('El archivo no tiene especies.', 4000);
  if (!confirm(`Se cargarán ${list.length} especies en el orden del archivo (con sus nombres científicos y teclas). Las especies que ya tienes y no están en la lista se conservan al final. ¿Continuar?`)) return;
  const names = list.map(x => x.nombre.trim()), rest = S.cats.filter(c => !names.some(n => folder(n).toLowerCase() === folder(c).toLowerCase()));
  S.cats = [...names.filter(n => n.toLowerCase() !== GH.toLowerCase()), ...rest]; for (const x of list) { if (x.cientifico) S.sci[x.nombre.trim()] = x.cientifico; if (x.tecla && /^[A-Z]$/.test(x.tecla) && LETTERS.includes(x.tecla)) S.keys[x.nombre.trim()] = x.tecla; }
  sv('bt_cats', S.cats); sv('bt_sci', S.sci); sv('bt_keys', S.keys); saveReg(); renderSide(); if (S.cur) show(S.cur); toast(`Lista cargada: ${S.cats.length} especies.`, 4000); };

// Imprimir el resumen con portada y gráficas; en la ventana de impresión se puede elegir «Guardar como PDF»
$('#sumprint').onclick = () => { const ds = [...document.querySelectorAll('#sumbody details.ssec')], was = ds.map(d => d.open); ds.forEach(d => d.open = true); document.body.classList.add('printsum'); print(); setTimeout(() => { document.body.classList.remove('printsum'); ds.forEach((d, k) => { if (d.isConnected) d.open = was[k]; }); }, 500); };
renderSide();

/* ---------- Tutorial guiado ---------- */
const TOUR = {
  main: [
    [null, 'Bienvenida a BioTrampa', 'Un recorrido corto por la pantalla. Avanza con Siguiente o la flecha →; sal con Esc. Hay más recorridos (clasificar rápido, el visor, resumen y exportar) en el botón <b>Tutorial</b>.'],
    ['#open2', 'Nuevo proyecto', 'Elige la carpeta de <b>una cámara o estación</b>: todo lo que tenga dentro es de esa estación. También puedes <b>arrastrar las carpetas</b> a la ventana. Chrome pide permiso para editar: es necesario para mover las fotos a <b>Clasificadas/Especie</b>, dentro de su propia carpeta.'],
    ['#hlast', 'Tu último proyecto', '<b>Continuar</b> lleva la galería a la foto donde te quedaste. <b>Agregar cámara</b> suma otra estación a ese proyecto. Tus demás proyectos están abajo, con su avance.'],
    ['#projbtn', 'Proyecto', 'Clic en el nombre para ver sus estaciones (renombrar, cámaras en par, quitar) o abrir otro proyecto.'],
    ['#stbox', 'Estaciones', 'Clic en una para ver solo sus fotos; el <b>+</b> agrega otra cámara. Con <b>…</b> o clic derecho escribes sus datos: coordenadas, fechas de instalación y retiro (para los días-trampa), cámara, altura y cebo.'],
    ['#cats', 'Especies', 'Cada una con su tecla. Clic para ver sus fotos. Con el orden «Orden de las teclas» puedes <b>arrastrar</b> para cambiar cuáles usan 1-9. Con <b>…</b> o clic derecho: renombrar, nombre científico, tecla o eliminar. El <b>…</b> del título importa, exporta u ordena la lista.'],
    ['.sfoot', 'Avance y herramientas', 'Cuántas fotos llevas y el tiempo restante a tu ritmo. Abajo: tutorial, <b>atajos de teclado</b> (también con ?), modo oscuro y <b>ajustes</b>.'],
    ['#vhead', 'Buscar, filtrar, resumen y exportar', 'Busca por nombre, especie, nota o ID. <b>Filtrar</b> tiene la hora (día, crepúsculo, noche), la fase lunar y otros estados. <b>Resumen</b> y <b>Exportar</b> están a la derecha.'],
    ['#ftabs', 'Pestañas', 'Todas, pendientes, clasificadas, marcadas para revisar, con cuántas hay. A la derecha cambias el orden y las ráfagas.'],
    ['#gal', 'Galería', 'Clic en una foto para abrirla. Con el teclado: <b>flechas</b> para moverte, <b>Enter</b> para abrir y la <b>tecla de la especie</b> para clasificar sin abrirla. Clic derecho: clasificar, marcar o separar una ráfaga. El tamaño se cambia con <b>Ctrl + rueda</b>.'],
    [null, '¡Listo!', 'Al abrir una foto por primera vez verás el recorrido del visor. Si te pierdes, pulsa <b>?</b> para ver los atajos.']],
  classify: [
    [null, 'Clasificar rápido', 'Tres maneras de clasificar miles de fotos sin perder tiempo.'],
    ['#gal', '1. Desde la galería', 'Muévete con las <b>flechas</b> y pulsa la <b>tecla de la especie</b> (1-9, letras, F para Fantasmas). Ctrl/Cmd+A selecciona todas las visibles y una tecla las clasifica juntas.'],
    ['#ftabs', '2. Solo lo que falta', 'Abre la pestaña <b>Pendientes</b>. En el visor, <b>Espacio</b> salta a la siguiente pendiente.'],
    ['#viewbtn', '3. Ráfagas', 'Con las ráfagas agrupadas, las fotos seguidas de la misma cámara se clasifican juntas. Clic derecho en una miniatura separa una ráfaga mal agrupada.']], // 1.4.12: se quitó el paso de «Probablemente vacías»
  viewer: [
    [null, 'El visor', 'Aquí clasificas una foto a la vez. <b>‹ Galería</b> o Esc te regresan.'],
    ['#lbcats', 'Clasificar', 'Clic en la especie o su tecla. La foto se mueve a <b>Clasificadas/Especie</b>. <b>Shift+tecla</b> anota una especie adicional (la foto no se copia). <b>Espacio</b>: siguiente pendiente.'],
    ['#lbmore', 'Más especies', 'Si tu lista no cabe, aquí están las demás (tecla <b>/</b>): escribe, elige con las flechas y Enter clasifica. Si no existe, la <b>creas</b> desde aquí.'],
    ['#vtools', 'Comparar y marcar', '<b>Comparar</b> con la foto anterior de la cámara (mantén C) y <b>marcar</b> para revisar (M). Deshacer está a la izquierda.'],
    ['#imgbtn', 'Imagen', 'Zoom, brillo y contraste, <b>ajuste automático</b> para fotos oscuras o infrarrojas, <b>recordarlo para toda la estación</b> y la lupa (L).'],
    ['#morebtn', 'Más opciones', 'Reproducir la ráfaga (P), solo foto (H), modo revisor (Enter verifica, Retroceso rechaza) y corregir la hora de la cámara.'],
    ['#obsbtn', 'Observación', 'Individuos (↑ ↓), sexo, edad, comportamiento, ID del individuo, nota (N) y los datos de la foto. <b>R</b> repite los datos de la foto anterior; <b>Guardar como dato rápido</b> crea un botón para repetir la combinación.']],
  results: [
    ['#sumbtn', 'Resumen', 'Especies, eventos independientes, días-trampa y abundancia relativa por estación, horas de actividad y la tabla de estaciones (las fechas y coordenadas se escriben ahí mismo). Se imprime o se guarda en PDF con portada.'],
    ['#export', 'Exportar', 'El <b>registro completo</b> para Excel, la tabla para <b>camtrapR</b>, <b>Camtrap DP</b> (GBIF, Agouti), <b>historias de detección</b> para modelos de ocupación, las estaciones para <b>Google Earth</b> (KML) y <b>unir registros</b> de varias personas.'],
    ['#setbtn', 'Ajustes', 'Eventos independientes (30 min por defecto), datos del proyecto que se copian al CSV e incluir pendientes al exportar.']]
};
let tour = null;
function startTour(kind) {
  closeOver(true); closePops(); const steps = TOUR[kind].filter(([sel]) => { if (!sel) return true; const el = $(sel); if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !el.closest('[hidden]'); });
  tour = { kind, steps, i: 0 }; $('#tour').hidden = false; tourShow();
}
function tourRect(el) { /* parte visible del elemento, recortada a su panel con scroll y a la ventana */
  const r = el.getBoundingClientRect(), sc = el.closest('aside,#gal'), c = sc && sc !== el ? sc.getBoundingClientRect() : { top: 0, bottom: innerHeight, left: 0, right: innerWidth };
  const top = Math.max(r.top, c.top, 0), bottom = Math.min(r.bottom, c.bottom, innerHeight);
  return { left: r.left, right: r.right, width: r.width, top, bottom: Math.max(top, bottom), height: Math.max(0, bottom - top) };
}
function tourShow(scroll = true) {
  const [sel, title, txt] = tour.steps[tour.i], hole = $('#tourhole'), box = $('#tourbox');
  if (sel && scroll) $(sel).scrollIntoView({ block: 'nearest', inline: 'nearest' });
  $('#tourtxt').innerHTML = `<h3>${title}</h3><p>${txt}</p>`; $('#tourn').textContent = `${tour.i + 1} de ${tour.steps.length}`;
  $('#tourprev').disabled = tour.i === 0; $('#tournext').textContent = tour.i === tour.steps.length - 1 ? 'Terminar' : 'Siguiente';
  if (sel) { const r = tourRect($(sel)), m = 6; Object.assign(hole.style, { left: r.left - m + 'px', top: r.top - m + 'px', width: r.width + 2 * m + 'px', height: Math.min(r.height, innerHeight - 20) + 2 * m + 'px', display: 'block' });
    const bw = Math.min(380, innerWidth - 24), below = r.bottom + 16 + 200 < innerHeight, left = Math.max(12, Math.min(r.left, innerWidth - bw - 12));
    Object.assign(box.style, { left: left + 'px', top: (below ? r.bottom + 14 : Math.max(12, r.top - 14 - box.offsetHeight)) + 'px', transform: 'none', width: bw + 'px' }); }
  else { hole.style.display = 'none'; Object.assign(box.style, { left: '50%', top: '30%', transform: 'translateX(-50%)', width: Math.min(440, innerWidth - 24) + 'px' }); }
  if (sel && !(r => r.bottom + 16 + 200 < innerHeight)(tourRect($(sel)))) requestAnimationFrame(() => { const r = tourRect($(sel)); box.style.top = Math.max(12, r.top - 14 - box.offsetHeight) + 'px'; });
}
function tourGo(d) { if (!tour) return; const n = tour.i + d; if (n < 0) return; if (n >= tour.steps.length) return endTour(); tour.i = n; tourShow(); }
function endTour() { if (!tour) return; if (tour.kind === 'main' || tour.kind === 'viewer') sv(tour.kind === 'main' ? 'bt_tour1' : 'bt_tour2', true); $('#tour').hidden = true; tour = null; }
$('#tournext').onclick = () => tourGo(1); $('#tourprev').onclick = () => tourGo(-1); $('#tourskip').onclick = endTour;
document.querySelectorAll('#tourmenu [data-tour]').forEach(b => b.onclick = () => { closePops(); const k = b.dataset.tour; if (k === 'viewer' && $('#lb').hidden) { const f = S.view[0]; if (!f) return toast('Agrega una estación para ver el visor.', 3000); show(f); setTimeout(() => startTour('viewer'), 450); } else startTour(k); });
addEventListener('resize', () => { if (tour) tourShow(false); });
/* Durante el tutorial se puede desplazar el panel lateral o la galería con la rueda o el trackpad */
$('#tour').addEventListener('wheel', e => {
  if (!tour) return; e.preventDefault();
  let el = document.elementsFromPoint(e.clientX, e.clientY).find(x => !x.closest('#tour'));
  while (el && el !== document.body) { const cs = getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight) break; el = el.parentElement; }
  if (!el || el === document.body) { const s = tour.steps[tour.i][0]; el = s && $(s) ? $(s).closest('aside,#gal') : $('aside'); }
  if (el) el.scrollBy({ top: e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY, left: e.deltaX });
}, { passive: false });
document.addEventListener('scroll', () => { if (tour) requestAnimationFrame(() => tour && tourShow(false)); }, true);
if (!ls('bt_tour1', false)) setTimeout(() => { if ($('#tour').hidden) startTour('main'); }, 700);

/* ---------- Mover o solo etiquetar ---------- */
const noMove = () => S.ro; // las fotos siempre se mueven, salvo en modo solo lectura
$('#adv').checked = ls('bt_adv', true);
$('#adv').onchange = e => { sv('bt_adv', e.target.checked); e.target.blur(); toast(e.target.checked ? 'Al clasificar pasarás a la siguiente foto.' : 'Al clasificar te quedarás en la misma foto.', 4000); };
// Chrome pregunta antes de salir si se está moviendo una foto o guardando el registro (el registro podría quedar sin el origen de esa foto), o si hay etiquetas sin guardar (solo lectura)
addEventListener('beforeunload', e => { if (S.busy || regRun || S.items.some(i => i.tagOnly)) { e.preventDefault(); e.returnValue = ''; } });

/* 1.4.12: con el ratón no queda el borde morado en el último botón pulsado; vuelve al usar Tab (teclado) */
addEventListener('pointerdown', () => document.body.classList.add('mouse'), true);
addEventListener('keydown', e => { if (e.key === 'Tab') document.body.classList.remove('mouse'); }, true);
/* ---------- Panel lateral: ocultar/mostrar y cambiar ancho (arrastrando el borde) ---------- */
const root = $('aside'), rz = $('#rz'); // --sw vive en el panel: cambiarlo no recalcula los estilos de toda la página
root.style.setProperty('--sw', ls('bt_sw', 280) + 'px');
function setSide(on, keep = true) { if (keep) S.sideAuto = false; /* lo que tú decides con el botón se respeta */ document.body.classList.toggle('noside', !on); $('#side').setAttribute('aria-expanded', on); if (keep) sv('bt_side', on); if (!$('#lb').hidden) setTimeout(useFull, 0); }
setSide(innerWidth > 760 && ls('bt_side', true), false);
$('#side').onclick = () => setSide(document.body.classList.contains('noside')); $('#side2').onclick = () => setSide(true);
let wide = innerWidth > 760; // al estrechar la ventana el panel se pliega solo (sin cambiar la preferencia guardada)
addEventListener('resize', () => { const w = innerWidth > 760; if (w !== wide) { wide = w; setSide(w && ls('bt_side', true), false); } });
const swNow = () => parseInt(getComputedStyle(root).getPropertyValue('--sw')) || 280;
/* Cambiar el ancho del panel: un cambio por cuadro como máximo; la galería se mantiene anclada a la foto que estabas viendo
   (sin saltos hacia arriba o abajo) y, mientras dura el arrastre, no se generan miniaturas ni se procesan efectos de las tarjetas. */
let rzAnchor = null;
function galAnchor() { // la primera tarjeta visible arriba de la galería (sin recorrer las miles de tarjetas)
  const g = $('#gal').getBoundingClientRect();
  for (const dy of [12, 40, 80, 140]) for (const dx of [20, 80, 160]) { const el = document.elementFromPoint(g.left + dx, g.top + dy), c = el && el.closest && el.closest('#grid .card'); if (c) return { c, off: c.getBoundingClientRect().top - g.top }; }
  return null; }
rz.onpointerdown = e => { if (e.button !== 0) return; e.preventDefault(); try { rz.setPointerCapture(e.pointerId); } catch (x) {} rzOn = true; rzAnchor = galAnchor(); document.body.classList.add('drag', 'rzdrag'); rz.classList.add('on'); };
let rzX = null; rz.onpointermove = e => { if (!rz.hasPointerCapture(e.pointerId)) return; const go = rzX === null; rzX = e.clientX;
  if (go) requestAnimationFrame(() => { const v = Math.max(220, Math.min(520, Math.round(rzX - root.getBoundingClientRect().left))); rzX = null; if (v === swNow()) return; root.style.setProperty('--sw', v + 'px');
    if (rzAnchor && rzAnchor.c.isConnected) { const gal = $('#gal'), d = rzAnchor.c.getBoundingClientRect().top - gal.getBoundingClientRect().top - rzAnchor.off; if (Math.abs(d) >= 1) gal.scrollTop += d; } }); };
/* El arrastre SIEMPRE termina: al soltar, si el navegador pierde el ratón (soltar fuera de la ventana, cambiar de ventana, un menú del sistema, Esc)
   o si llega un movimiento sin el botón apretado. Antes, si se perdía el «soltar», la galería se quedaba sin responder a los clics. */
function rzEnd() { document.body.classList.remove('rzdrag'); if (!dragCat) document.body.classList.remove('drag'); rz.classList.remove('on'); if (!rzOn) return; rzOn = false; rzAnchor = null; rzX = null; sv('bt_sw', swNow()); pump(); }
rz.onpointerup = rz.onpointercancel = rz.onlostpointercapture = rzEnd;
addEventListener('pointerup', rzEnd, true); addEventListener('pointercancel', rzEnd, true); addEventListener('blur', rzEnd); addEventListener('contextmenu', rzEnd, true);
document.addEventListener('visibilitychange', rzEnd); document.addEventListener('mouseleave', e => { if (rzOn && !e.buttons) rzEnd(); });
addEventListener('pointermove', e => { if (rzOn && e.buttons === 0) rzEnd(); }, true);
addEventListener('keydown', e => { if (rzOn && e.key === 'Escape') rzEnd(); }, true);
addEventListener('pointerdown', e => { if (e.target !== rz && (rzOn || document.body.classList.contains('rzdrag'))) rzEnd(); }, true); // último recurso: cualquier clic destraba
rz.ondblclick = () => { root.style.setProperty('--sw', '280px'); sv('bt_sw', 280); };
addEventListener('resize', () => { if (!$('#lb').hidden) useFull(); });
watchAnim(document.querySelectorAll('#lb, .over, .popbox, #toast, #multi'));
// Estado inicial de la pantalla (sin proyecto abierto)
setViewer(false); updTitle(); renderChips();

/* ---------- Prueba (abre index.html#test y mira la consola) ----------
   Mueve una foto FALSA a Clasificadas/Coyote y la devuelve, dentro del almacenamiento privado del navegador. No toca tus carpetas. */
async function selfCheck() {
  const root = await navigator.storage.getDirectory(), n = 'bt_prueba', fail = [];
  try { await root.removeEntry(n, { recursive: true }); } catch (e) {}
  try {
    const top = await root.getDirectoryHandle(n, { create: true }), d = await top.getDirectoryHandle('DCIM', { create: true });
    const fh = await d.getFileHandle('IMG_1.JPG', { create: true }), w = await fh.createWritable(); await w.write(new Uint8Array(1234)); await w.close();
    const it = newItem('IMG_1.JPG', fh, d, ['DCIM'], { h: top, name: n, label: n, reg: {} });
    await moveItem(it, 'Coyote'); if (it.parts.join('/') !== ROOT + '/Coyote' || (await it.h.getFile()).size !== 1234 || await exists(d, 'IMG_1.JPG')) fail.push('clasificar (mover a Clasificadas/Coyote)');
    await moveBack(it); if (it.parts.join('/') !== 'DCIM' || it.name !== 'IMG_1.JPG' || (await it.h.getFile()).size !== 1234) fail.push('desmarcar (volver a DCIM)');
    { // mismo nombre en dos carpetas: no se pisan en Clasificadas/Coyote y cada una vuelve a la suya
      const d2 = await d.getDirectoryHandle('B', { create: true }), f2 = await d2.getFileHandle('IMG_1.JPG', { create: true }), w2 = await f2.createWritable(); await w2.write(new Uint8Array(999)); await w2.close();
      const it2 = newItem('IMG_1.JPG', f2, d2, ['DCIM', 'B'], it.src);
      await moveItem(it, 'Coyote'); await moveItem(it2, 'Coyote');
      if (it2.name !== 'IMG_1_1.JPG' || (await it.h.getFile()).size !== 1234 || (await it2.h.getFile()).size !== 999) fail.push('nombres repetidos en Clasificadas');
      await moveBack(it2); await moveBack(it);
      if (it.parts.join('/') !== 'DCIM' || it2.parts.join('/') !== 'DCIM/B' || it2.name !== 'IMG_1.JPG' || (await it2.h.getFile()).size !== 999) fail.push('nombres repetidos: volver cada una a su carpeta'); }
    { // fila de especies del visor: 40 especies falsas caben en 2 renglones y el resto se cuenta en «Más especies»
      const lb = $('#lb'), row = $('#lbcats'), more = $('#lbmore'), mp = more.parentNode, mn = more.nextSibling, was = lb.hidden, keep = [...row.childNodes]; lb.hidden = false; row.textContent = '';
      for (let i = 0; i < 40; i++) { const b = document.createElement('button'); b.dataset.cat = 'x' + i; b.innerHTML = `<kbd>1</kbd><span>Especie de prueba ${i}</span>`; row.appendChild(b); }
      row.appendChild(more); fitCats(); const vis = [...row.querySelectorAll(':scope > button')].filter(b => !b.hidden), lines = new Set([...vis, more].map(b => b.offsetTop)).size;
      if (lines > 2 || !$('#lbmorebtn').textContent.includes('· ' + (40 - vis.length))) fail.push(`fila de especies (${lines} renglones, ${$('#lbmorebtn').textContent})`);
      row.textContent = ''; keep.forEach(k => row.appendChild(k)); mp.insertBefore(more, mn); lb.hidden = was; }
  } catch (e) { fail.push('error: ' + e.message); }
  try { await root.removeEntry(n, { recursive: true }); } catch (e) {}
  console[fail.length ? 'error' : 'info']('selfCheck: ' + (fail.length ? 'FALLA ' + fail.join('; ') : 'todo bien (mover y devolver)'));
  return fail;
}
