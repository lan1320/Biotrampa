'use strict';
/* BioTrampa 1.3 (pantalla de identificar rehecha en la 1.4.9; lápiz, cola, importar y exportar referencias en la 1.4.15; comparar, ficha e impresión rehechos en la 1.4.17) - Identificación de individuos por sus marcas (jaguar, ocelote, tigrillo…).
   Todo manual y en tu computadora: catálogo, flanco y calidad de cada foto, comparación lado a lado con zoom sincronizado,
   candidatos ordenados por estación, distancia y fecha, y zonas de rosetas encerradas en un recuadro que se comparan al mismo tamaño.
   El catálogo se guarda en cada carpeta del proyecto (.biotrampa_individuos.json); los datos de cada foto, en su registro. */
const INDF = '.biotrampa_individuos.json';
const FL = { I: 'Izquierdo', D: 'Derecho', A: 'Ambos', N: 'No se ve' }, QL = { B: 'Buena', R: 'Regular', M: 'Mala' };
S.ind = { list: {}, act: 0 }; S.indSp = ls('bt_indsp', []); // 1.4.13: ninguna especie marcada de fábrica (antes Jaguar)
const indOn = c => !!c && c !== GH && S.indSp.some(x => norm(x) === norm(c));
const indPrefix = c => (norm(c).replace(/[^a-z]/g, '').slice(0, 3) || 'ind').toUpperCase();
function indTouch() { S.ind.act = Date.now(); S.indDirty = true; }
function newIndId(c) { const p = indPrefix(c); let k = 1; while (S.ind.list[`${p}-${pad(k)}`]) k++; return `${p}-${pad(k)}`; }
function ensureInd(id, c) { if (id && !S.ind.list[id]) { S.ind.list[id] = { sp: c || '', nombre: '', sexo: '', marcas: '', notas: '', creado: ymd(Date.now()) }; indTouch(); } }
function syncIndCatalog() { for (const it of S.items) for (const [c, o] of Object.entries(it.obs || {})) if (o && o.id && hasCat(it, c)) ensureInd(o.id, c); }
function indPhotos(id) { const r = []; for (const it of S.items) for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (o && o.id === id) r.push({ it, c, o }); } return r; }
const refFirst = (a, b) => (b.o.ref || b.ext ? 1 : 0) - (a.o.ref || a.ext ? 1 : 0) || 'BRM'.indexOf(a.o.q || 'R') - 'BRM'.indexOf(b.o.q || 'R');
const flOk = (fl, pf) => !fl || fl === 'N' || !pf || pf === 'A' || fl === 'A' || fl === pf; // fotos comparables: el mismo lado (o una con ambos, o sin lado anotado)
function km(a, b) { const dLa = (b[0] - a[0]) * RAD, dLo = (b[1] - a[1]) * RAD, x = Math.sin(dLa / 2) ** 2 + Math.cos(a[0] * RAD) * Math.cos(b[0] * RAD) * Math.sin(dLo / 2) ** 2; return 2 * 6371 * Math.asin(Math.sqrt(x)); }

/* ---------- Catálogo en las carpetas ---------- */
// 1.4.13: al agregar una carpeta, de su catálogo solo entran los individuos que tienen fotos en ella (no los de otro proyecto que usó la misma carpeta)
function pruneIndFrom(before, src) { const used = new Set(); for (const it of S.items) if (it.src === src) for (const o of Object.values(it.obs || {})) if (o && o.id) used.add(o.id);
  let n = 0; for (const k of Object.keys(S.ind.list)) if (!before.has(k) && !used.has(k)) { delete S.ind.list[k]; n++; } if (n) S.indDirty = true; }
async function loadIndFile(src) {
  if (!src.h || !src.h.getFileHandle) return;
  const j = await readJson(src.h, INDF);
  if (!j || !j.list) { if (Object.keys(S.ind.list).length) S.indDirty = true; return; } // carpeta nueva: recibirá el catálogo al guardar
  if ((j.act || 0) > (S.ind.act || 0)) { const mine = S.ind.list; S.ind = { list: { ...j.list }, act: j.act }; for (const [k, v] of Object.entries(mine)) if (!S.ind.list[k]) { S.ind.list[k] = v; S.indDirty = true; } }
  else for (const [k, v] of Object.entries(j.list)) if (!S.ind.list[k]) { S.ind.list[k] = v; S.indDirty = true; } // se juntan: nunca se pierde un individuo
  if (Array.isArray(j.especies) && !ls('bt_indsp', null)) S.indSp = j.especies;
}
async function saveIndFiles() {
  if (!S.indDirty || S.ro) return; S.indDirty = false;
  const data = JSON.stringify({ app: 'BioTrampa', tipo: 'catalogo de individuos', nota: 'Catálogo de individuos de BioTrampa (hay una copia en cada estación del proyecto). No lo borres.', especies: S.indSp, act: S.ind.act, list: S.ind.list }, null, 1);
  for (const src of S.srcs) { if (!src.h || !src.h.getFileHandle) continue;
    try { const w = await (await src.h.getFileHandle(INDF, { create: true })).createWritable(); await w.write(data); await w.close(); } catch (e) { console.warn('No se pudo guardar el catálogo de individuos en ' + src.name, e); } }
}
function mergeCatalog(j) { // junta un catálogo (de un respaldo o de otra persona) sin reemplazar los individuos que ya tienes
  const list = j.individuos && !Array.isArray(j.individuos) && !j.individuos.list ? j.individuos : (j.list || (j.individuos && j.individuos.list) || {});
  let add = 0, same = 0, fill = 0;
  for (const [k, v] of Object.entries(list)) { const mine = S.ind.list[k];
    if (!mine) { S.ind.list[k] = v; add++; continue; } same++;
    for (const f of ['sp', 'nombre', 'sexo', 'marcas', 'notas']) if (!mine[f] && v[f]) { mine[f] = v[f]; fill++; } // completa lo vacío (p. ej. un individuo recreado solo con su código)
    if (!(mine.merges || []).length && (v.merges || []).length) { mine.merges = v.merges; fill++; } }
  if (fill && !add) indTouch();
  const sp = j.especies || (j.individuos && j.individuos.especies); if (Array.isArray(sp)) { for (const c of sp) if (!indOn(c)) S.indSp.push(c); sv('bt_indsp', S.indSp); }
  if (add) indTouch(); return { add, same };
}

/* ---------- Identificar (1.4.9): tres pasos, con todos los controles en la columna derecha ----------
   1 lado, claridad y la foto más clara de la ráfaga · 2 encerrar la zona de una parte del cuerpo · 3 comparar con los candidatos y decidir.
   Las rosetas se calcan una vez con el lápiz en la foto del catálogo (o en la tuya si será referencia) y al comparar se marca ✓ / ✗ en cada una. */
const IDV = { v: { l: { z: 1, x: 0, y: 0 }, r: { z: 1, x: 0, y: 0 } }, pen: { l: false, r: false }, er: { l: false, r: false }, eye: true, m: [], hist: { l: [], r: [] }, redo: { l: [], r: [] }, hov: 'l' }, idUrls = { l: null, r: null };
const resetView = side => { for (const s of side ? [side] : ['l', 'r']) IDV.v[s] = { z: 1, x: 0, y: 0 }; }; // 1.4.15: cada foto con su propio zoom
const PARTS = ['cabeza', 'hombro', 'costado', 'cadera', 'pata', 'cola'], zoneOf = (o, p) => o && (o.zn || []).find(z => z.p === p);
const TROK = 3; // cuántas rosetas deben coincidir para no quedar como dudosa (1.4.15: ya no hay máximo de rosetas calcadas)
const TRC = ['#ffd400', '#00e0ff', '#ffffff', '#ff5ab4', '#6b4fd8']; // colores del trazo
const SEXS = { Macho: '♂', Hembra: '♀' };
function candidates(it, c, fl) { // mismo lado primero, los que tienen avisos al final, luego misma estación, distancia y fecha; con avisos de velocidad imposible y sexo distinto
  const myS = station(it), myC = stCoords(myS), t = goodTs(it) ? fixTs(it) : NaN, my = it.obs && it.obs[c], mySex = my && SEXS[my.sex] ? my.sex : '', out = [];
  for (const [id, rec] of Object.entries(S.ind.list)) {
    if (norm(rec.sp) !== norm(c) || (my && my.id === id && indPhotos(id).length === 1 && !(rec.refs || []).length)) continue;
    const ph = [...indPhotos(id).filter(p => p.it !== it), ...extRefs(id)], same = ph.filter(p => flOk(fl, p.o.fl)); // 1.4.15: con sus referencias importadas
    let dmin = Infinity, sameSt = 0, tmin = Infinity, fast = null; const sx = {};
    for (const p of ph) { const s2 = station(p.it); if (s2 === myS) sameSt++; const c2 = stCoords(s2), d = myC && c2 ? km(myC, c2) : NaN; if (isFinite(d)) dmin = Math.min(dmin, d);
      const t2 = goodTs(p.it) ? fixTs(p.it) : NaN; if (!isNaN(t) && !isNaN(t2)) { tmin = Math.min(tmin, Math.abs(t - t2)); const h = Math.max(Math.abs(t - t2) / 36e5, 1 / 60); if (s2 !== myS && d > 1 && d / h > 5 && (!fast || h < fast.h)) fast = { d, h }; }
      if (SEXS[p.o.sex]) sx[p.o.sex] = (sx[p.o.sex] || 0) + 1; }
    const sex = SEXS[rec.sexo] ? rec.sexo : Object.keys(sx).sort((a, b) => sx[b] - sx[a])[0] || '';
    const other = (fl === 'I' || fl === 'D') && !same.length && ph.some(p => p.o.fl === (fl === 'I' ? 'D' : 'I'));
    out.push({ id, rec, ph, same, sameSt, dmin, tmin, other, fast, sex, sexOff: !!(mySex && sex && mySex !== sex), tr: ph.some(p => (p.o.tr || []).length) });
  }
  return out.sort((a, b) => (b.same.length > 0) - (a.same.length > 0) || (!!(a.fast || a.sexOff)) - (!!(b.fast || b.sexOff)) || (b.sameSt > 0) - (a.sameSt > 0) || a.dmin - b.dmin || a.tmin - b.tmin || a.id.localeCompare(b.id));
}
const bestPhotos = (k, fl, zp) => (k.same.length ? k.same : fl && fl !== 'N' ? [] : k.ph).slice().sort((a, b) => !!(b.o.tr || []).length - !!(a.o.tr || []).length || !!zoneOf(b.o, zp) - !!zoneOf(a.o, zp) || refFirst(a, b));
async function openIdent(it, c, mode) {
  Object.assign(IDV, { c, id: null, p: null, drawing: null, pen: { l: false, r: false }, er: { l: false, r: false }, m: [], zp: null, full: true, step: 3, menu: null, more: false, cmp: false, mode: mode || 'pend', hist: { l: [], r: [] }, redo: { l: [], r: [] } }); resetView();
  IDV.g = groupOf(it).filter(x => hasCat(x, c)); if (!IDV.g.includes(it)) IDV.g.unshift(it);
  $('#idv_burstc').checked = IDV.g.length > 1; $('#idv_burstl').hidden = IDV.g.length < 2; $('#idv_burstl').lastChild.textContent = ` Toda la ráfaga (${IDV.g.length})`; $('#idv_burstl').title = 'Al confirmar el individuo, también se asigna a las otras fotos de la ráfaga que no tengan uno';
  for (const k of ['lb', 'lc', 'rb', 'rc']) $('#idv_' + k).value = 1;
  $('#idv_warn').hidden = true; $('#idv_nf').hidden = true; $('#idv_s3').classList.remove('nfon'); openOver('#idv'); setStep(3); await setLeft(it, true); // 1.4.18: una sola columna, sin pasos
}
async function setLeft(it, first) { // la foto que se identifica (al abrir, o al elegir otra de la ráfaga)
  if (IDV.flg && IDV.o) { delete IDV.o.fl; saveReg(); } IDV.flg = false; // 1.4.18: el lado propuesto (como la anterior) solo se guarda al confirmarlo
  IDV.it = it; IDV.o = obsOf(it, IDV.c); renderQueue(); if (!IDV.o.fl && IDV.lastFl) { IDV.o.fl = IDV.lastFl; IDV.flg = true; } IDV.menu = !IDV.o.fl ? 'fl' : !IDV.o.q ? 'q' : null; IDV.pen.l = false; IDV.zm = false; $('#idv_dud').checked = !!IDV.o.dud; $('#idv_warn').hidden = true;
  if (first) { const zs = (IDV.o.zn || []).map(z => z.p); IDV.zp = zs.find(p => PARTS.includes(p)) || null; }
  $('#idv_sub').textContent = `${IDV.c} · ${it.origName || it.name} · ${station(it)}${it.meta && it.meta.date ? ' · ' + it.meta.date + (it.meta.time ? ', ' + it.meta.time.slice(0, 5) : '') : ''}`;
  $('#idv_lcap').textContent = 'Esta foto · ' + (it.origName || it.name);
  idCmp(false); renderParts(); renderBurst(); idSeg(); renderCands(true); await loadSide('l', it); // 1.4.19: la foto se ve completa; se compara al tocar un candidato
}
function idCmp(on) { IDV.cmp = on; $('#idv_r').hidden = !on; $('#idv_stage').classList.toggle('two', on); requestAnimationFrame(() => { layoutId(); drawZones('l'); drawZones('r'); }); }
function renderBurst() {
  const box = $('#idv_bst'); box.textContent = ''; $('#idv_bstw').hidden = IDV.g.length < 2;
  for (const x of IDV.g) { const b = document.createElement('button'), im = document.createElement('img'); b.className = x === IDV.it ? 'on' : ''; b.title = (x.origName || x.name) + (x.obs && x.obs[IDV.c] && x.obs[IDV.c].q ? ' · ' + QL[x.obs[IDV.c].q].toLowerCase() : '');
    im.alt = ''; im.dataset.id = x.id; b.appendChild(im); b.onclick = () => { if (x !== IDV.it) setLeft(x); }; box.appendChild(b); thumb(im); }
}
const FLK = { I: 'I', D: 'D', A: 'A', N: 'N' }, QLK = { B: '1', R: '2', M: '3' };
function idSeg() { // 1.4.18: lado y claridad son un recuadro; al tocarlo sale una ventanita con las opciones (no mueve lo de abajo)
  for (const [key, map, kk] of [['fl', FL, FLK], ['q', QL, QLK]]) { const bx = $(`#idv_${key}b`), mn = $('#idv_' + key), v = IDV.o[key], open = IDV.menu === key;
    bx.innerHTML = v ? `<span>${map[v]}</span>${key === 'fl' && IDV.flg ? '<small>como la anterior</small>' : ''}<kbd>${kk[v]}</kbd>` : '<span class="ph">Elegir…</span>'; bx.classList.toggle('open', open); bx.setAttribute('aria-expanded', open);
    bx.onclick = () => { IDV.menu = open ? null : key; idSeg(); };
    mn.hidden = !open; mn.textContent = '';
    if (open) for (const [k, t] of Object.entries(map)) { const b = document.createElement('button'); b.className = 'cat' + (v === k ? ' on' : ''); b.innerHTML = `<kbd>${kk[k]}</kbd><span class="cn">${t}</span>${key === 'fl' && k === IDV.lastFl ? '<b>como la anterior</b>' : ''}`; b.onclick = () => idSet(key, k); mn.appendChild(b); } }
}
function idSet(key, k) { const was = !!(IDV.o.fl && IDV.o.q), chg = IDV.o[key] !== k; IDV.o[key] = k; IDV.flg = false; if (key === 'fl') IDV.lastFl = k;
  IDV.menu = key === 'fl' && !IDV.o.q ? 'q' : null; saveReg(); idSeg(); $('#idv_warn').hidden = true;
  if (!was || (key === 'fl' && chg)) renderCands(true); else renderVerdict(); }
function idMove(d) { const l = IDV.cands || [], i = l.findIndex(k => k.id === IDV.id), k = l[Math.max(0, Math.min(l.length - 1, i + d))]; if (!k || k.id === IDV.id) return;
  if (l.indexOf(k) >= 4) IDV.more = true; setPick(k.id, bestPhotos(k, IDV.o.fl, IDV.zp)[0] || null); renderCands(); }
const PNAME = p => p[0].toUpperCase() + p.slice(1);
function renderParts() { // paso 2: qué parte se encierra y las zonas que ya tiene esta foto
  const g = $('#idv_parts'); if (!g) return; const has = p => !!zoneOf(IDV.o, p); g.textContent = ''; // 1.4.18: ya no hay paso de zonas
  for (const p of PARTS) { const b = document.createElement('button'); b.textContent = PNAME(p) + (has(p) ? ' ✓' : ''); b.className = IDV.zp === p ? 'on' : ''; b.title = has(p) ? 'Ya está encerrada: arrastra otro recuadro para cambiarla' : 'Arrastra un recuadro sobre esta parte';
    b.onclick = () => { IDV.zp = p; IDV.zm = true; IDV.pen.l = IDV.er.l = false; renderParts(); drawZones('l'); idHint(); }; g.appendChild(b); }
  const box = $('#idv_zones'), zs = IDV.o.zn || []; box.textContent = ''; $('#idv_zw').hidden = !IDV.zm && !zs.length; // 1.4.20: recuadro de una parte del cuerpo
  for (const z of zs) { const d = document.createElement('div'); d.className = 'idzone'; d.innerHTML = `<i></i>${esc(PNAME(z.p))}<button title="Quitar este recuadro" aria-label="Quitar este recuadro"><i class="ic">${icon('trash')}</i></button>`;
    d.querySelector('button').onclick = () => { IDV.o.zn = zs.filter(x => x !== z); if (!IDV.o.zn.length) delete IDV.o.zn; saveReg(); renderParts(); drawZones('l'); idHint(); }; box.appendChild(d); }
}
function renderTog() { // paso 3: ver una zona (las dos fotos agrandadas al mismo tamaño) o las fotos completas
  return; const g = $('#idv_tog'), zs = (IDV.o.zn || []).filter(z => PARTS.includes(z.p) || z.p); // 1.4.15: Lan pidió que las fotos no se acerquen solas a la zona
  for (const p of [...zs.map(z => z.p), null]) { const b = document.createElement('button'); b.textContent = p ? PNAME(p) : 'Completas'; b.className = (p ? !IDV.full && IDV.zp === p : IDV.full) ? 'on' : '';
    b.onclick = () => { IDV.full = !p; if (p) IDV.zp = p; resetView(); renderTog(); renderCands(); layoutId(); drawZones('l'); drawZones('r'); idHint(); }; g.appendChild(b); }
}
function setStep() { // 1.4.18: ya no hay pasos; siempre las dos fotos y la columna completa
  IDV.step = 3; resetView(); IDV.drawing = null; IDV.pen = { l: false, r: false }; IDV.er = { l: false, r: false }; $('#idv_nf').hidden = true; $('#idv_s3').classList.remove('nfon');
  IDV.full = true;
  idHint(); requestAnimationFrame(() => { layoutId(); drawZones('l'); drawZones('r'); });
}
function sideObs(side) { return side === 'l' ? IDV.o : IDV.p && IDV.p.o; }
const needZone = side => side === 'l' ? !!IDV.zm && !!IDV.zp : IDV.step === 3 && !IDV.full && !!(IDV.zp && IDV.p && !zoneOf(IDV.p.o, IDV.zp)); // dónde arrastrar dibuja un recuadro
function idHint() {
  for (const side of ['l', 'r']) { const o = sideObs(side), n = ((o && o.tr) || []).length, h = $(`#idv_${side}hint`), P = IDV.zp; if (!n) IDV.er[side] = false;
    h.textContent = IDV.er[side] ? 'Toca una roseta para borrarla' : IDV.pen[side] ? `Dibuja alrededor de cada roseta (al soltar se cierra) · ${n} calcada(s)${n < TROK ? `, mínimo ${TROK}` : ''}` : o && needZone(side) ? `Arrastra un recuadro sobre ${P === 'pata' || P === 'cola' || P === 'cabeza' || P === 'cadera' ? 'la' : 'el'} ${P}${side === 'l' && zoneOf(o, P) ? ' (cambia la que ya tiene)' : side === 'r' ? ' en esta foto del catálogo' : ''}`
      : side === 'r' && IDV.p && !n ? 'Sin rosetas calcadas: toca el lápiz para calcarlas una vez' : '';
    h.hidden = !h.textContent;
    const tb = $(`#idv_${side} .idtools`); tb.hidden = !o; tb.querySelector('[data-t=pen]').classList.toggle('on', IDV.pen[side]); tb.querySelector('[data-t=undo]').disabled = !IDV.hist[side].length; tb.querySelector('[data-t=redo]').disabled = !IDV.redo[side].length; tb.querySelector('[data-t=erase]').classList.toggle('on', IDV.er[side]); tb.querySelector('[data-t=erase]').disabled = !n; tb.querySelector('[data-t=eye]').classList.toggle('on', IDV.eye); tb.querySelector('[data-t=zone]')?.classList.toggle('on', !!IDV.zm);
    $('#idv_' + side).classList.toggle('pen', IDV.pen[side] || (o && needZone(side))); $('#idv_' + side).classList.toggle('erase', IDV.er[side]); }
  const c = $('#idv_s2cnt'); if (c) { const n = ((IDV.o && IDV.o.tr) || []).length; c.textContent = n ? `${n} roseta(s) calcada(s) en esta foto.${n < TROK ? ` Para un individuo nuevo hacen falta al menos ${TROK}.` : ''}` : `Ninguna todavía. Es opcional para comparar, pero si resulta ser un individuo nuevo necesitas al menos ${TROK} (es la foto con rosetas que se entrega).`; }
}
async function loadSide(side, item) {
  const box = $('#idv_' + side), img = box.querySelector('img'), tok = IDV['t' + side] = (IDV['t' + side] || 0) + 1; // si se pide otra foto mientras carga, gana la última
  if (idUrls[side]) URL.revokeObjectURL(idUrls[side]); idUrls[side] = null; img.removeAttribute('src'); box.classList.toggle('empty', !item);
  if (item) { try { const u = URL.createObjectURL(await item.h.getFile()); if (tok !== IDV['t' + side]) return URL.revokeObjectURL(u); idUrls[side] = u; img.src = u; await img.decode().catch(() => {}); } catch (e) { toast('No se pudo leer la foto: ' + e.message, 4000); } }
  if (tok !== IDV['t' + side]) return; layoutId(); drawZones(side); idHint();
}
function layoutId() { // con una parte elegida, cada foto se agranda hasta que esa zona llena el recuadro: así da igual si el animal estaba cerca o lejos
  for (const side of ['l', 'r']) { const box = $('#idv_' + side), img = box.querySelector('img'), inn = box.querySelector('.idin'), W = img.naturalWidth, H = img.naturalHeight;
    if (!W || !img.getAttribute('src')) { inn.style.width = inn.style.height = '0px'; continue; }
    const bw = box.clientWidth, bh = box.clientHeight, z = null, V = IDV.v[side]; // 1.4.15: sin acercarse a la zona
    const k = z ? Math.min(bw / z.w, bh / z.h) * .92 : Math.min(bw / W, bh / H), cx = z ? z.x + z.w / 2 : W / 2, cy = z ? z.y + z.h / 2 : H / 2;
    Object.assign(inn.style, { width: W * k + 'px', height: H * k + 'px', left: bw / 2 - cx * k + 'px', top: bh / 2 - cy * k + 'px', transformOrigin: `${cx * k}px ${cy * k}px`, transform: `translate(${V.x}px,${V.y}px) scale(${V.z})` });
    inn.querySelector('svg').setAttribute('viewBox', `0 0 ${W} ${H}`);
    img.style.filter = `brightness(${$('#idv_' + side + 'b').value}) contrast(${$('#idv_' + side + 'c').value})`; }
  const st = $('#idv').style; st.setProperty('--trc', TRC[+ls('bt_trc', 0)] || TRC[0]); st.setProperty('--trw', $('#idv_trw').value);
}
const trPath = pts => 'M' + pts.map(p => p[0] + ' ' + p[1]).join('L') + 'Z';
function drawZones(side) {
  const box = $('#idv_' + side), svg = box.querySelector('svg'), img = box.querySelector('img'), o = sideObs(side), W = img.naturalWidth || 1000, fs = W * .018, d = IDV.drawing && IDV.drawing.side === side ? IDV.drawing : null;
  const zoom = IDV.step === 3 && !IDV.full, zs = [...((o && o.zn) || []).filter(z => !(zoom && z.p === IDV.zp) && !(d && d.z && z.p === IDV.zp && side === 'l')), ...(d && d.z ? [d.z] : [])]; // la zona que se está viendo ya es el marco: no se dibuja
  let h = zs.map(z => `<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}"/>${z.p ? `<text x="${z.x}" y="${z.y - fs * .4}" font-size="${fs}">${esc(z.p)}</text>` : ''}`).join('');
  if (IDV.eye) { const trs = (o && o.tr) || [], r = W * .011;
    h += trs.map((t, i) => { const mx = Math.max(...t.map(p => p[0])), my = Math.min(...t.map(p => p[1])), m = side === 'r' ? IDV.m[i] : 0;
      return `<path class="trh" d="${trPath(t)}"/><path class="trl${m === 1 ? ' y' : m === 2 ? ' n' : ''}" d="${trPath(t)}"/><circle class="trn${m === 1 ? ' y' : m === 2 ? ' n' : ''}" cx="${mx + r * .6}" cy="${my - r * .4}" r="${r}"/><text class="trt" x="${mx + r * .6}" y="${my - r * .4 + r * .42}" font-size="${r * 1.2}">${i + 1}</text>`; }).join(''); }
  if (d && d.tr) h += `<path class="trh" d="M${d.tr.map(p => p.join(' ')).join('L')}"/><path class="trl" d="M${d.tr.map(p => p.join(' ')).join('L')}"/>`;
  svg.innerHTML = h;
}
function setPick(id, p) {
  IDV.id = id; IDV.p = p; IDV.pen.r = false; IDV.m = ((p && p.o.tr) || []).map(() => 0);
  $('#idv_rcap').textContent = p ? `${id} · ${p.ext ? 'referencia importada' : station(p.it)}${p.it.meta && p.it.meta.date ? ' · ' + p.it.meta.date : ''} · ${(FL[p.o.fl] || 'sin lado').toLowerCase()}${p.o.ref ? ' · referencia' : ''}` : id ? `${id}: no tiene fotos de este lado` : '';
  resetView('r'); IDV.hist.r = []; IDV.redo.r = []; renderVerdict(); loadSide('r', p ? p.it : null);
}
function renderCands(repick) { // repick: elegir de nuevo el candidato (si la foto ya tiene individuo, se muestra ese)
  const { it, c, o } = IDV, box = $('#idv_cands'), cw = $('#idv_chipsw'), vd = $('#idv_verdict'); box.after(cw, vd); box.textContent = '';
  if (!o.fl || !o.q) { IDV.cands = []; if (IDV.id || IDV.p) setPick(null, null); box.innerHTML = '<p class="idph">Elige lado y claridad para verlos.</p>'; $('#idv_same').disabled = true; return; } // 1.4.18
  const l = candidates(it, c, o.fl), zp = IDV.zp; IDV.cands = l; $('#idv_same').hidden = !l.length; // 1.4.19: sin individuos no hay con quién decir «es el mismo»
  if (repick || (IDV.id && !l.some(k => k.id === IDV.id))) { const k = (o.id && l.find(k => k.id === o.id)) || l.find(k => !k.other && bestPhotos(k, o.fl, zp).length) || l[0]; setPick(k ? k.id : null, k ? bestPhotos(k, o.fl, zp)[0] || null : null); }
  const sel = l.findIndex(k => k.id === IDV.id), vis = IDV.more || l.length <= 5 ? l : l.filter((k, i) => i < 4 || i === sel); // 1.4.18: los demás con «Ver más candidatos»
  for (const k of vis) {
    const d = document.createElement('div'), on = IDV.id === k.id, shown = bestPhotos(k, o.fl, zp); d.className = 'cand' + (on ? ' on' : '') + (k.other || !shown.length ? ' off' : ''); d.dataset.id = k.id;
    const w = k.fast ? `${k.fast.d.toFixed(0)} km en ${k.fast.h < 1 ? Math.round(k.fast.h * 60) + ' min' : Math.round(k.fast.h) + ' h'}: muy improbable` : k.sexOff ? `sexo distinto: esta foto ${SEXS[o.sex]}` : '';
    const info = w || (k.other ? 'solo se conoce el otro lado' : !shown.length ? 'sin fotos de este lado' : [k.sameSt ? 'misma estación' : isFinite(k.dmin) ? `a ${k.dmin.toFixed(1)} km` : '', isFinite(k.tmin) ? `${Math.round(k.tmin / DAY)} día(s)` : '', k.rec.marcas ? k.rec.marcas : ''].filter(Boolean).join(' · ') || `${k.ph.length} foto(s)`);
    d.innerHTML = '<button class="ch"><img alt=""><span class="cn"><span></span><small></small></span><b></b></button>';
    d.querySelector('.cn span').textContent = k.id; d.querySelector('.cn small').textContent = [k.rec.nombre, k.sex ? k.sex.toLowerCase() : ''].filter(Boolean).join(' · ');
    const sm = d.querySelector('.ch>b'); sm.textContent = info; sm.title = info; if (w) sm.className = 'w';
    box.appendChild(d); const im = d.querySelector('img'), first = shown[0] || [...k.ph].sort(refFirst)[0]; if (first) thumbAny(im, first.it);
    d.querySelector('.ch').onclick = () => { if (on && IDV.cmp) return idCmp(false); if (!on) setPick(k.id, shown[0] || null); idCmp(true); renderCands(); }; // 1.4.19: tocar el candidato abre la comparación; otra vez, la cierra
    const all = [...shown, ...k.ph.filter(p => !shown.includes(p))]; // 1.4.19: todas sus fotos (las del mismo lado primero)
    if (on && all.length > 1) { const th = document.createElement('div'); th.className = 'cth';
      for (const p of all) { const t = document.createElement('img'); t._it = p.it; t.alt = ''; t.title = `${station(p.it)} · lado ${(FL[p.o.fl] || 'sin dato').toLowerCase()}${p.o.ref ? ' · referencia' : ''}${(p.o.tr || []).length ? ' · rosetas calcadas' : ''}`;
        t.className = (p === IDV.p ? 'on' : '') + (p.o.ref ? ' ref' : ''); t.onclick = () => { setPick(k.id, p); idCmp(true); renderCands(); }; th.appendChild(t); }
      d.appendChild(th); th.querySelectorAll('img').forEach(t => thumbAny(t, t._it)); }
    if (on) d.append(cw, vd);
  }
  if (vis.length < l.length) { const b = document.createElement('button'); b.className = 'cat idmore'; b.innerHTML = `<span class="cn">Ver más candidatos</span><b>${l.length - vis.length}</b>`; b.onclick = () => { IDV.more = true; renderCands(); }; box.appendChild(b); }
  if (!l.length) box.innerHTML = `<p class="hint tiny">Todavía no hay otros individuos de ${esc(c)} en el catálogo. Si es la primera vez que ves a este animal, pulsa «Individuo nuevo».</p>`;
}
function renderVerdict() {
  const id = IDV.id, p = IDV.p, trs = (p && p.o.tr) || [], box = $('#idv_chips'), v = $('#idv_verdict'), same = $('#idv_same'), dud = $('#idv_dud'); box.textContent = '';
  trs.forEach((_, i) => { const b = document.createElement('button'), m = IDV.m[i] || 0; b.className = 'idchip' + (m === 1 ? ' y' : m === 2 ? ' n' : ''); b.textContent = i + 1;
    b.title = `Roseta ${i + 1}: toca una vez si coincide, dos si no (o la tecla ${i + 1})`; b.onclick = () => { IDV.m[i] = (m + 1) % 3; renderVerdict(); drawZones('r'); }; box.appendChild(b); });
  const y = IDV.m.filter(x => x === 1).length, n = IDV.m.filter(x => x === 2).length; same.textContent = id ? 'Es ' + id : 'Es el mismo'; same.disabled = !id; $('#idv_chipsw').hidden = !trs.length;
  if (!id) v.textContent = '';
  else if (!p) { v.textContent = `De ${id} no hay fotos de este lado: no se puede comparar con esta.`; same.disabled = true; }
  else if (!trs.length) { v.textContent = `Esta foto de ${id} no tiene rosetas calcadas. Cálcalas con el lápiz, o compara a ojo (queda como dudosa).`; dud.checked = true; }
  else if (n) { v.innerHTML = `<b class="no">${n} no coincide${n > 1 ? 'n' : ''}.</b> Una roseta distinta basta: no es ${esc(id)}.`; same.disabled = true; }
  else if (y >= Math.min(TROK, trs.length)) { v.innerHTML = `<b class="ok">${y} coinciden.</b> Suficiente para decir que es el mismo.`; dud.checked = IDV.o.q === 'M'; }
  else { v.textContent = y ? `${y} de ${Math.min(TROK, trs.length)} necesarias. Con menos, queda como dudosa.` : ''; dud.checked = true; }
}
function applyInd(id, opt = {}) { // asigna el individuo a la foto (y, si se pide, a su ráfaga); «no se puede saber» solo a esta foto
  if (S.busy) return toast('Espera: todavía se está moviendo una foto…', 2000);
  IDV.flg = false; if (IDV.o.fl) IDV.lastFl = IDV.o.fl; // 1.4.18
  const { it, c, o } = IDV, who = $('#reviewer').value.trim(), dud = opt.nuevo ? !!opt.dud : opt.dud || $('#idv_dud').checked, list = [it];
  if (id && $('#idv_burstc').checked) for (const x of IDV.g) if (x !== it && !(x.obs && x.obs[c] && x.obs[c].id)) list.push(x);
  const first = id && !indPhotos(id).length, y = IDV.m.filter(x => x === 1).length;
  for (const x of list) { const ox = obsOf(x, c);
    if (id) { ox.id = id; delete ox.ns; if (dud) ox.dud = 1; else delete ox.dud; ox.ib = who; ox.if = ymd(Date.now()); delete ox.iv; delete ox.rc; } else { delete ox.id; ox.ns = 1; delete ox.dud; delete ox.ref; delete ox.rc; }
    if (x !== it) { if (!ox.fl && o.fl) ox.fl = o.fl; if (!ox.q && o.q) ox.q = o.q; } }
  if (id && !opt.nuevo && IDV.p && IDV.id === id && IDV.m.length) o.rc = `${y}/${IDV.m.length}`;
  if (first) o.ref = 1; // la primera foto de un individuo es su referencia
  if (id) ensureInd(id, c); if (id && opt.rec) Object.assign(S.ind.list[id], opt.rec); saveReg();
  const nx = nextIn(IDV.mode === 'dud' ? dudList(c) : pendList(c), it, new Set(list)); if (nx) openIdent(nx, c, IDV.mode); else { closeOver(); idClosed(); } // 1.4.15: sigue con la siguiente pendiente
  locked(() => indFolders(list)).then(() => { if (opt.card) exportCard(id, { it: opt.card.it, o: opt.card.o }); refreshCards(list); if (!$('#pind').hidden) renderIndPane(); if (S.cur && !$('#lb').hidden) show(S.cur); }); // 1.4.14: la foto pasa a la subcarpeta del individuo
  toast((!id ? 'Esta foto quedó como «no se puede saber».' : first ? `${id} creado${dud ? ' (dudoso)' : ''}. Esta foto es su referencia.` : `${list.length} foto(s) → ${id}${dud ? ' (dudosa)' : ''}.`) + (nx ? '' : ` Ya no quedan fotos de ${c} ${IDV.mode === 'dud' ? 'dudosas' : 'sin identificar'}.`), first ? 6000 : 3000);
}
// 1.4.15: newInd() abre el formulario de individuo nuevo (más abajo)
$('#idv_same').onclick = () => { if (IDV.id) applyInd(IDV.id); };
$('#idv_new').onclick = () => { if (IDV.o.q === 'M') { $('#idv_warn').hidden = false; return; } newInd(); };
$('#idv_wnew').onclick = () => { $('#idv_warn').hidden = true; newInd(true); };
$('#idv_ns').onclick = $('#idv_wns').onclick = () => applyInd(null);
document.addEventListener('pointerdown', e => { if (IDV.menu && !$('#idv').hidden && !e.target.closest('.idpkw')) { IDV.menu = null; idSeg(); } }); // 1.4.18: la ventanita se cierra al tocar fuera
$('#idv_dud').onchange = e => { if (IDV.o.id) { if (e.target.checked) IDV.o.dud = 1; else delete IDV.o.dud; saveReg(); } };
for (const k of ['lb', 'lc', 'rb', 'rc', 'trw']) $('#idv_' + k).oninput = layoutId;
$('#idv_adjr').onclick = () => { for (const k of ['lb', 'lc', 'rb', 'rc', 'trw']) $('#idv_' + k).value = $('#idv_' + k).defaultValue; layoutId(); }; // 1.4.21: restablecer
for (const side of ['l', 'r']) { // zoom y desplazamiento sincronizados; arrastrar dibuja el recuadro de una parte que falta, o calca una roseta con el lápiz
  const box = $('#idv_' + side); let drag = null;
  box.querySelector('.idtools').onclick = e => { const b = e.target.closest('button'); if (b) idTool(side, b.dataset.t); };
  box.addEventListener('pointerenter', () => IDV.hov = side);
  const imgPt = e => { const img = box.querySelector('img'), r = box.querySelector('.idin').getBoundingClientRect(), W = img.naturalWidth, H = img.naturalHeight; if (!r.width || !W) return null;
    return [Math.max(0, Math.min(W, (e.clientX - r.left) / r.width * W)), Math.max(0, Math.min(H, (e.clientY - r.top) / r.height * H))]; };
  box.addEventListener('wheel', e => { e.preventDefault(); const V = IDV.v[side], z = Math.max(1, Math.min(12, V.z * (e.deltaY < 0 ? 1.2 : 1 / 1.2))), r = box.getBoundingClientRect(), cx = e.clientX - (r.left + r.width / 2), cy = e.clientY - (r.top + r.height / 2), k = z / V.z;
    V.x = z === 1 ? 0 : cx - (cx - V.x) * k; V.y = z === 1 ? 0 : cy - (cy - V.y) * k; V.z = z; layoutId(); }, { passive: false }); // 1.4.15: el zoom de una foto ya no mueve la otra
  box.addEventListener('pointerdown', e => { if (e.button !== 0 || e.target.closest('.idtools')) return; const o = sideObs(side); let mode = null, a = null;
    if (o && IDV.er[side] && !IDV.space) { const q = imgPt(e), k = q ? trHit(o.tr || [], q, (box.querySelector('img').naturalWidth || 1000) * .012) : -1; if (k >= 0) { trSnap(side); o.tr.splice(k, 1); if (side === 'r') IDV.m.splice(k, 1); if (!o.tr.length) delete o.tr; trSaved(side); } return; }
    if (o && IDV.pen[side] && !IDV.space) { mode = 'tr'; a = imgPt(e); }
    else if (o && needZone(side)) { mode = 'zn'; a = imgPt(e); }
    if (mode && !a) mode = null;
    drag = { x: e.clientX, y: e.clientY, x0: IDV.v[side].x, y0: IDV.v[side].y, moved: false, mode, a }; if (mode === 'tr') IDV.drawing = { side, tr: [a.map(Math.round)] }; box.setPointerCapture(e.pointerId); });
  box.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true; if (!drag.moved) return;
    if (drag.mode === 'tr') { const b = imgPt(e), t = IDV.drawing.tr, l = t[t.length - 1], W = box.querySelector('img').naturalWidth; if (b && Math.hypot(b[0] - l[0], b[1] - l[1]) > W * .002) { t.push(b.map(Math.round)); drawZones(side); } }
    else if (drag.mode === 'zn') { const a = drag.a, b = imgPt(e); if (!b) return; IDV.drawing = { side, z: { x: Math.min(a[0], b[0]), y: Math.min(a[1], b[1]), w: Math.abs(a[0] - b[0]), h: Math.abs(a[1] - b[1]) } }; drawZones(side); }
    else if (IDV.v[side].z > 1) { IDV.v[side].x = drag.x0 + dx; IDV.v[side].y = drag.y0 + dy; layoutId(); } });
  box.addEventListener('pointerup', () => { const d = drag, dr = IDV.drawing; drag = null; IDV.drawing = null; if (!d || !d.mode) return; const o = sideObs(side), W = box.querySelector('img').naturalWidth;
    if (d.mode === 'tr') { const t = dr && dr.tr, xs = t ? t.map(p => p[0]) : [], ys = t ? t.map(p => p[1]) : [];
      if (t && t.length > 5 && Math.max(...xs) - Math.min(...xs) > W * .006 && Math.max(...ys) - Math.min(...ys) > W * .006) { trSnap(side); o.tr = [...(o.tr || []), trSmooth(t)]; if (side === 'r') IDV.m.push(0); trSaved(side); } // 1.4.15: el trazo se cierra y se suaviza
      idHint(); return drawZones(side); }
    const z = dr && dr.z; if (!z || z.w < W * .02 || z.h < W * .02) return drawZones(side);
    for (const k of ['x', 'y', 'w', 'h']) z[k] = Math.round(z[k]); z.p = IDV.zp;
    o.zn = [...(o.zn || []).filter(x => x.p !== z.p), z]; resetView(side); saveReg();
    if (side === 'l') { IDV.zm = false; renderParts(); } else renderCands(); layoutId(); drawZones(side); idHint(); }); // 1.4.15: después del recuadro, el lápiz queda listo para calcar
  box.addEventListener('dblclick', () => { if (IDV.pen[side] || IDV.er[side]) return; resetView(side); layoutId(); });
}
addEventListener('resize', () => { if (!$('#idv').hidden) layoutId(); });

/* ---------- 1.4.15: lápiz mejorado (borrador, deshacer/rehacer, color, grosor, atajos), cola de pendientes y dudosas, individuo nuevo con formulario ---------- */
function trSmooth(t) { let p = t.concat([t[0]]); const q = []; // una pasada de suavizado (Chaikin) y el trazo queda cerrado
  for (let i = 0; i < p.length - 1; i++) { const a = p[i], b = p[i + 1]; q.push([a[0] * .75 + b[0] * .25, a[1] * .75 + b[1] * .25], [a[0] * .25 + b[0] * .75, a[1] * .25 + b[1] * .75]); }
  return q.map(v => [Math.round(v[0]), Math.round(v[1])]).filter((v, i, a) => !i || v[0] !== a[i - 1][0] || v[1] !== a[i - 1][1]); }
function trBox(t) { let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity; for (const [x, y] of t) { if (x < a) a = x; if (y < b) b = y; if (x > c) c = x; if (y > d) d = y; } return [a, b, c, d]; }
function trHit(trs, q, tol) { let best = -1, bd = Infinity; trs.forEach((t, i) => { const [a, b, c, d] = trBox(t); if (q[0] >= a - tol && q[0] <= c + tol && q[1] >= b - tol && q[1] <= d + tol) { const dd = Math.hypot(q[0] - (a + c) / 2, q[1] - (b + d) / 2); if (dd < bd) { bd = dd; best = i; } } }); return best; }
function trSnap(side) { const o = sideObs(side); if (!o) return; IDV.hist[side].push({ tr: JSON.stringify(o.tr || []), m: IDV.m.slice() }); if (IDV.hist[side].length > 60) IDV.hist[side].shift(); IDV.redo[side] = []; }
function trSaved(side) { saveReg(); if (side === 'r' && IDV.p && IDV.p.ext) indTouch(); if (side === 'r') { renderVerdict(); renderCands(); } if (side === 'l' && !$('#idv_nf').hidden) nfRender(); idHint(); drawZones(side); }
function idUndo(side, again) { const o = sideObs(side), from = again ? IDV.redo : IDV.hist, to = again ? IDV.hist : IDV.redo; if (!o || !from[side].length) return;
  to[side].push({ tr: JSON.stringify(o.tr || []), m: IDV.m.slice() }); const h = from[side].pop(); o.tr = JSON.parse(h.tr); if (!o.tr.length) delete o.tr; if (side === 'r') IDV.m = h.m; trSaved(side); }
function idTool(side, t) { const o = sideObs(side); if (!o) return;
  if (t === 'zone') { IDV.zm = !IDV.zm; IDV.pen.l = IDV.er.l = false; if (IDV.zm && !IDV.zp) IDV.zp = PARTS.find(p => !zoneOf(IDV.o, p)) || PARTS[0]; }
  if (t === 'pen' || t === 'erase') IDV.zm = false;
  if (t === 'pen') { IDV.pen[side] = !IDV.pen[side]; IDV.er[side] = false; if (IDV.pen[side]) IDV.eye = true; }
  if (t === 'erase') { IDV.er[side] = !IDV.er[side] && !!(o.tr || []).length; IDV.pen[side] = false; IDV.eye = true; }
  if (t === 'undo') return idUndo(side); if (t === 'redo') return idUndo(side, true);
  if (t === 'eye') IDV.eye = !IDV.eye;
  if (t === 'color') { sv('bt_trc', (+ls('bt_trc', 0) + 1) % TRC.length); layoutId(); }
  renderParts(); idHint(); drawZones('l'); drawZones('r'); }
addEventListener('keydown', e => { // atajos dentro de «Identificar individuo» (antes de los de la galería: Ctrl+Z aquí deshace el trazo, no la clasificación)
  if ($('#idv').hidden || [...document.querySelectorAll('.over')].some(o => !o.hidden && o !== $('#idv') && $('#idv').compareDocumentPosition(o) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
  if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
  const k = e.key.toLowerCase(), ctl = (e.ctrlKey || e.metaKey) && !e.altKey, side = IDV.step === 3 ? IDV.hov : 'l'; let done = true;
  if (ctl && k === 'z') idUndo(side, e.shiftKey); else if (ctl && k === 'y') idUndo(side, true);
  else if (e.ctrlKey || e.metaKey || e.altKey) done = false;
  else if (k === 'escape') { if (IDV.menu) { IDV.menu = null; idSeg(); } else { closeOver(); idClosed(); } }
  else if (k === 'p') idTool(side, 'pen'); else if (k === 'e') idTool(side, 'erase'); else if (k === 'h') idTool(side, 'eye');
  else if (k === 'v') { IDV.pen[side] = IDV.er[side] = false; idHint(); }
  else if (e.key === ' ') { IDV.space = true; }
  else if (!$('#idv_nf').hidden) done = false;
  else if (/^[idan]$/.test(k)) idSet('fl', k.toUpperCase()); // 1.4.18: lado I/D/A/N, claridad 1/2/3, S salta, Enter confirma, ↑ ↓ candidatos
  else if (/^[1-3]$/.test(k) && (!IDV.o.q || IDV.menu === 'q')) idSet('q', 'BRM'[+k - 1]);
  else if (k === 's') { const sk = $('#idv_skip'); if (sk) sk.click(); }
  else if (k === 'enter' && !$('#idv_same').disabled && !document.activeElement.closest('button,summary,label')) $('#idv_same').click();
  else if (k === 'arrowdown' || k === 'arrowup') idMove(k === 'arrowdown' ? 1 : -1);
  else if (/^[1-9]$/.test(k) && IDV.step === 3 && IDV.p) { const i = +k - 1, n = ((IDV.p.o.tr) || []).length; if (i < n) { IDV.m[i] = ((IDV.m[i] || 0) + 1) % 3; renderVerdict(); drawZones('r'); } }
  else done = false;
  if (done) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
addEventListener('keyup', e => { if (e.key === ' ') IDV.space = false; });
function idClosed() { if (IDV.flg && IDV.o) { delete IDV.o.fl; saveReg(); } IDV.flg = false; IDV.menu = null; const it = IDV.it; if (it && !$('#lb').hidden && S.cur !== it && S.items.includes(it)) show(it); } // al cerrar, el visor queda en la última foto que se identificaba
$('#idv .pclose').addEventListener('click', idClosed);

// Cola: al decidir, pasa sola a la siguiente foto de la especie sin individuo (o a la siguiente dudosa)
const pendList = c => S.items.filter(x => hasCat(x, c) && !(x.obs && x.obs[c] && (x.obs[c].id || x.obs[c].ns)));
const dudList = c => S.items.filter(x => { const o = x.obs && x.obs[c]; return hasCat(x, c) && o && o.id && o.dud && !o.iv; });
function nextIn(list, cur, skip) { if (!list.length) return null; const at = S.items.indexOf(cur), l = list.filter(x => !skip || !skip.has(x));
  return l.find(x => S.items.indexOf(x) > at) || l.find(x => x !== cur) || null; }
function renderQueue() { const el = $('#idv_queue'), dud = IDV.mode === 'dud', l = dud ? dudList(IDV.c) : pendList(IDV.c), i = l.indexOf(IDV.it); // 1.4.18: línea de avance con barra
  el.innerHTML = l.length ? `<span>${dud ? 'Dudosas' : 'Pendientes'} de ${esc(IDV.c.toLowerCase())}</span><span>${i >= 0 ? i + 1 : '–'} de ${l.length}${l.length > (i >= 0 ? 1 : 0) ? ' · <button class="lnk2" id="idv_skip" title="Saltar esta foto (S)">Saltar</button>' : ''}</span>` : `<span>${dud ? 'No hay dudosas por revisar' : `No quedan fotos de ${esc(IDV.c)} sin identificar`}</span>`;
  $('#idv_qbar').style.width = (!l.length ? 100 : i >= 0 ? (i + 1) / l.length * 100 : 0) + '%';
  const sk = $('#idv_skip'); if (sk) sk.onclick = () => { const nx = nextIn(l, IDV.it, new Set([IDV.it])); if (nx) openIdent(nx, IDV.c, IDV.mode); }; }
function goQueue(mode) { const c = S.indSp.find(x => (mode === 'dud' ? dudList(x) : pendList(x)).length);
  if (!c) return toast(mode === 'dud' ? 'No hay identificaciones dudosas por revisar.' : S.indSp.length ? 'No quedan fotos sin identificar de las especies marcadas.' : 'Primero marca qué especies se identifican por individuo (menú ⋯ de Individuos).', 4000);
  const l = mode === 'dud' ? dudList(c) : pendList(c), it = (S.cur && l.includes(S.cur)) ? S.cur : l[0]; openIdent(it, c, mode); }

// Individuo nuevo: formulario en la columna (código, nombre, sexo, edad, crías) en lugar de la ventanita del navegador
const EDADES = ['Cría', 'Juvenil', 'Adulto'];
function newInd(dud) { IDV.nf = { dud: !!dud, id: newIndId(IDV.c), nombre: '', sexo: '', edad: '', crias: false, madre: '' }; $('#idv_s3').classList.add('nfon'); $('#idv_nf').hidden = false; IDV.pen.l = true; IDV.er.l = false; idHint(); nfRender(); $('#nf_id').focus(); }
function nfClose() { $('#idv_s3').classList.remove('nfon'); $('#idv_nf').hidden = true; IDV.pen.l = false; idHint(); }
function nfRender() { const f = IDV.nf; if (!f) return; const n = ((IDV.o && IDV.o.tr) || []).length;
  $('#nf_id').value = f.id; $('#nf_n').value = f.nombre;
  for (const [sel, opts, key] of [['#nf_s', ['Macho', 'Hembra', ''], 'sexo'], ['#nf_e', EDADES, 'edad']]) { const g = $(sel); g.textContent = '';
    for (const v of opts) { const b = document.createElement('button'); b.textContent = v || 'Sin dato'; b.className = f[key] === v ? 'on' : ''; b.onclick = () => { f[key] = f[key] === v && v ? '' : v; nfRender(); }; g.appendChild(b); } }
  const x = $('#nf_x'), moms = Object.keys(S.ind.list).filter(k => S.ind.list[k].sexo === 'Hembra' && norm(S.ind.list[k].sp) === norm(IDV.c)).sort();
  x.innerHTML = f.edad === 'Cría' ? `<label class="idfld">Es cría de<select id="nf_m"><option value="">No se sabe</option>${moms.map(k => `<option ${f.madre === k ? 'selected' : ''}>${esc(k)}</option>`).join('')}</select></label>`
    : f.sexo === 'Hembra' && f.edad !== 'Juvenil' ? `<label class="chk"><input type="checkbox" id="nf_cr" ${f.crias ? 'checked' : ''}> Va con crías</label>` : '';
  if ($('#nf_m')) $('#nf_m').onchange = e => f.madre = e.target.value; if ($('#nf_cr')) $('#nf_cr').onchange = e => f.crias = e.target.checked;
  $('#nf_w').innerHTML = n >= TROK ? `${n} rosetas calcadas: esta foto queda como su referencia y podrás guardarla con las rosetas dibujadas.` : `Esta foto tiene <b>${n}</b> roseta(s) calcada(s). Calca al menos ${TROK} con el lápiz sobre la foto para crear el individuo con su foto de rosetas. <button class="lnk2" id="nf_force">Crear sin rosetas</button>`;
  $('#nf_ok').disabled = n < TROK; if ($('#nf_force')) $('#nf_force').onclick = () => nfCreate(true); }
$('#nf_id').oninput = e => { if (IDV.nf) IDV.nf.id = e.target.value; }; $('#nf_n').oninput = e => { if (IDV.nf) IDV.nf.nombre = e.target.value; };
$('#nf_c').onclick = nfClose; $('#nf_ok').onclick = () => nfCreate(false);
function nfCreate(force) { const f = IDV.nf, v = (f.id || '').trim().replace(/\s+/g, '-'); if (!v) return toast('Escribe el código del individuo.', 2500);
  if (S.ind.list[v]) return toast(`${v} ya existe en el catálogo. Elige otro código, o elígelo en la lista de candidatos.`, 4500);
  const rec = { nombre: f.nombre.trim(), sexo: f.sexo, edad: f.edad, crias: f.crias && f.sexo === 'Hembra' ? 1 : 0, madre: f.edad === 'Cría' ? f.madre : '' }; Object.keys(rec).forEach(k => { if (!rec[k]) delete rec[k]; });
  const it = IDV.it, o = IDV.o; nfClose(); applyInd(v, { nuevo: 1, dud: f.dud, rec, card: !force && (o.tr || []).length >= TROK ? { it, o } : null }); }

/* ---------- 1.4.15: referencias importadas (los jaguares ya identificados, p. ej. de Canva) ----------
   Cada individuo puede tener rec.refs = [{ fl, file, st, tr, dib, ref: 1 }]: imágenes guardadas en «Referencias de individuos/» dentro de la carpeta de una
   estación (st = nombre de esa carpeta). No son fotos del proyecto: no se clasifican ni se cuentan, solo sirven para comparar y entregar. */
const refSrc = r => S.srcs.find(s => s.h && (s.h.name === r.st || s.label === r.st));
async function refFile(r) { const s = refSrc(r); if (!s) throw new Error(`falta la carpeta «${r.st}» en este proyecto`); return (await (await s.h.getDirectoryHandle(REFD)).getFileHandle(r.file)).getFile(); }
const refUrls = new Map();
async function refUrl(r) { const k = r.st + '/' + r.file; if (!refUrls.has(k)) refUrls.set(k, URL.createObjectURL(await refFile(r))); return refUrls.get(k); }
function extRefs(id) { const rec = S.ind.list[id]; return ((rec && rec.refs) || []).map((r, k) => ({ it: { ext: true, ref: r, id: `ref:${id}:${k}`, name: r.file, origName: r.file, meta: null, src: { label: 'Referencia importada' }, obs: {}, h: { getFile: () => refFile(r) } }, c: rec.sp, o: r, ext: true })); }
function thumbAny(im, it) { if (it && it.ext) refUrl(it.ref).then(u => { if (im.isConnected || !im.src) im.src = u; }).catch(() => im.classList.add('bad')); else if (it) { im.dataset.id = it.id; thumb(im); } }
async function saveRefImage(blob, name) { // en la primera estación del proyecto que se pueda escribir; nunca sobrescribe
  if (S.ro) throw new Error('el navegador abrió el proyecto en solo lectura'); const s = S.srcs.find(x => x.h && x.h.getDirectoryHandle); if (!s) throw new Error('abre un proyecto con al menos una estación');
  const dir = await subdir(s.h, [REFD]), base = name.replace(/\.[^.]+$/, '').replace(/[\\/:*?"<>|]/g, '_'), ext = (name.match(/\.[^.]+$/) || ['.png'])[0].toLowerCase(); let file = base + ext;
  for (let k = 2; ; k++) { try { await dir.getFileHandle(file); file = `${base}-${k}${ext}`; } catch (e) { break; } }
  const w = await (await dir.getFileHandle(file, { create: true })).createWritable(); await w.write(blob); await w.close(); return { st: s.h.name, file }; }
const sideName = fl => fl === 'D' ? 'der' : fl === 'I' ? 'izq' : 'ambos';
function bestRef(id, fl) { // la mejor imagen de un lado para mostrar o entregar: con rosetas calcadas, luego referencia, luego claridad
  const l = [...extRefs(id), ...indPhotos(id)].filter(p => fl ? p.o.fl === fl || (p.o.fl === 'A' && !p.ext) : true);
  return l.sort((a, b) => !!(b.o.tr || []).length - !!(a.o.tr || []).length || refFirst(a, b))[0] || null; }
async function bitmapOf(p) { return createImageBitmap(await p.it.h.getFile()); }

/* ---------- 1.4.15: foto con rosetas (la imagen que se entrega del individuo nuevo), lámina del catálogo ---------- */
function paintTraces(x, trs, k, opt = {}) { const col = opt.color || TRC[+ls('bt_trc', 0)] || TRC[0], w = opt.w || 3;
  trs.forEach((t, i) => { x.beginPath(); t.forEach(([a, b], j) => j ? x.lineTo(a * k, b * k) : x.moveTo(a * k, b * k)); x.closePath(); x.lineJoin = 'round';
    x.strokeStyle = 'rgba(0,0,0,.55)'; x.lineWidth = w + 2.5; x.stroke(); x.strokeStyle = (opt.marks && opt.marks[i] === 1) ? '#3fd28a' : (opt.marks && opt.marks[i] === 2) ? '#ff5a4f' : col; x.lineWidth = w + (opt.hi === i ? 2 : 0); x.stroke();
    if (opt.num !== false) { const [, b0, c0] = trBox(t), r = Math.max(9, w * 3.2), cx = c0 * k + r * .5, cy = b0 * k - r * .5; x.fillStyle = 'rgba(0,0,0,.75)'; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
      x.fillStyle = col; x.font = `700 ${Math.round(r * 1.15)}px "Plus Jakarta Sans",system-ui,sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(i + 1, cx, cy + 1); } }); }
function cardCanvas(bmp, trs, title, sub, opt = {}) { const k = Math.min(1, 1600 / bmp.width), W = Math.round(bmp.width * k), H = Math.round(bmp.height * k), band = Math.round(Math.max(80, W * .07)), dark = opt.dark;
  const c = document.createElement('canvas'); c.width = W; c.height = H + band; const x = c.getContext('2d'); x.fillStyle = dark ? '#141615' : '#ffffff'; x.fillRect(0, 0, W, H + band); x.drawImage(bmp, 0, 0, W, H);
  paintTraces(x, trs || [], k, { w: Math.max(2.5, W / 450), ...opt });
  const f = band / 100; x.textAlign = 'left'; x.textBaseline = 'alphabetic'; x.fillStyle = dark ? '#f1f1ef' : '#1b1d1c'; x.font = `700 ${Math.round(34 * f)}px "Plus Jakarta Sans",system-ui,sans-serif`; x.fillText(title, 26 * f, H + 46 * f);
  x.fillStyle = dark ? '#a3a8a4' : '#5e635f'; x.font = `500 ${Math.round(20 * f)}px "Plus Jakarta Sans",system-ui,sans-serif`; x.fillText(sub, 26 * f, H + 80 * f); x.textAlign = 'right'; x.fillText(`${(trs || []).length} rosetas · BioTrampa`, W - 26 * f, H + 80 * f); return c; }
function cardText(id, p) { const rec = S.ind.list[id] || {}, it = p.it;
  return { t: id + (rec.nombre ? ` «${rec.nombre}»` : ''), s: [FL[p.o.fl] ? 'Lado ' + FL[p.o.fl].toLowerCase() : '', [rec.sexo, (rec.edad || '').toLowerCase()].filter(Boolean).join(' '), p.ext ? '' : station(it) + (it.meta && it.meta.date ? ' · ' + it.meta.date : '')].filter(Boolean).join(' · ') }; } // sin coordenadas: las ubicaciones de jaguar son sensibles
const canvasBlob = c => new Promise(r => c.toBlob(r, 'image/png'));
async function exportCard(id, p) { if (!p) return toast(`${id} no tiene una foto de referencia.`, 3000);
  try { const bmp = await bitmapOf(p), t = cardText(id, p), c = cardCanvas(bmp, p.o.tr, t.t, t.s); bmp.close && bmp.close(); const name = `${folder(id)}_${sideName(p.o.fl)}.png`;
    $('#card_img').src = c.toDataURL('image/png'); $('#h_card').textContent = `${id} · foto con rosetas`; $('#card_note').textContent = (p.o.tr || []).length ? 'Sin coordenadas de la estación.' : 'Esta imagen no tiene rosetas calcadas: cálcalas con el lápiz en «Identificar» o en la ficha.';
    $('#card_save').onclick = async () => { download(await canvasBlob(c), name); }; openOver('#cardlg'); } catch (e) { toast('No se pudo preparar la imagen: ' + e.message, 5000); } }
async function sheetCanvas(sp, fl) { const ids = Object.keys(S.ind.list).filter(k => norm(S.ind.list[k].sp) === norm(sp)).sort(), cards = [];
  for (const id of ids) { const p = bestRef(id, fl); if (!p) continue; try { const b = await bitmapOf(p), t = cardText(id, p); cards.push(cardCanvas(b, p.o.tr, t.t, t.s)); b.close && b.close(); } catch (e) {} }
  if (!cards.length) return null; const cols = Math.min(3, cards.length), cw = 520, gap = 28, top = 96, hs = cards.map(c => cw * c.height / c.width), rows = Math.ceil(cards.length / cols), rh = [];
  for (let r = 0; r < rows; r++) rh.push(Math.max(...hs.slice(r * cols, r * cols + cols)));
  const W = cols * cw + gap * (cols + 1), H = top + rh.reduce((a, b) => a + b + gap, 0) + gap, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#1b1d1c'; x.font = '700 36px "Plus Jakarta Sans",system-ui,sans-serif'; x.fillText(`${sp} · ${FL[fl] ? 'lado ' + FL[fl].toLowerCase() : 'catálogo'}`, gap, 58);
  x.fillStyle = '#5e635f'; x.font = '500 19px "Plus Jakarta Sans",system-ui,sans-serif'; x.textAlign = 'right'; x.fillText(`${cards.length} individuo(s) · ${projName()} · ${ymd(Date.now())} · BioTrampa`, W - gap, 58); x.textAlign = 'left';
  let y = top; cards.forEach((cd, i) => { const col = i % cols; if (i && !col) y += rh[Math.floor(i / cols) - 1] + gap; x.drawImage(cd, gap + col * (cw + gap), y, cw, hs[i]); }); return c; }
async function exportCards(sp) { const ids = Object.keys(S.ind.list).filter(k => norm(S.ind.list[k].sp) === norm(sp)).sort(), files = []; toast('Preparando las fotos con rosetas…', 0);
  for (const id of ids) for (const fl of ['I', 'D']) { const p = bestRef(id, fl); if (!p || !(p.o.tr || []).length) continue;
    try { const b = await bitmapOf(p), t = cardText(id, p), c = cardCanvas(b, p.o.tr, t.t, t.s); b.close && b.close(); files.push([`${folder(id)}_${sideName(fl)}.png`, new Uint8Array(await (await canvasBlob(c)).arrayBuffer())]); } catch (e) {} }
  $('#toast').hidden = true; if (!files.length) return toast(`Ningún individuo de ${sp} tiene rosetas calcadas todavía.`, 4000);
  download(zipStore(files), `fotos_con_rosetas_${folder(sp)}_${ymd(Date.now())}.zip`); toast(`${files.length} foto(s) con rosetas (una por individuo y lado).`, 4000); }
async function exportSheet(sp, fl) { toast('Preparando la lámina…', 0); const c = await sheetCanvas(sp, fl); $('#toast').hidden = true; if (!c) return toast(`No hay individuos de ${sp} con foto del lado ${FL[fl].toLowerCase()}.`, 4000);
  $('#card_img').src = c.toDataURL('image/png'); $('#h_card').textContent = `Lámina · ${sp} · lado ${FL[fl].toLowerCase()}`; $('#card_note').textContent = 'Una tarjeta por individuo con su mejor foto de ese lado.';
  $('#card_save').onclick = async () => download(await canvasBlob(c), `lamina_${folder(sp)}_${sideName(fl)}_${ymd(Date.now())}.png`); openOver('#cardlg'); }

/* ---------- 1.4.15: paquete del catálogo (.zip con datos, imágenes de referencia y rosetas) para otra computadora u otra persona ---------- */
async function exportPackage() { const ids = Object.keys(S.ind.list).sort(); if (!ids.length) return toast('El catálogo está vacío.', 3000); toast('Preparando el paquete…', 0);
  const list = JSON.parse(JSON.stringify(S.ind.list)), files = [], used = new Set();
  for (const id of ids) { const refs = [];
    for (const fl of ['I', 'D', 'A']) { const p = bestRef(id, fl); if (!p || (fl === 'A' && refs.length)) continue;
      try { const f = await p.it.h.getFile(), ext = (f.name.match(/\.[^.]+$/) || ['.jpg'])[0].toLowerCase(); let n = `${folder(id)}_${sideName(fl)}${ext}`; while (used.has(n)) n = '_' + n; used.add(n);
        files.push(['referencias/' + n, new Uint8Array(await f.arrayBuffer())]); refs.push({ fl: p.o.fl || fl, file: n, tr: p.o.tr || [], ...(p.o.dib ? { dib: 1 } : {}), ref: 1 }); } catch (e) {} }
    list[id].refs = refs; }
  const data = JSON.stringify({ app: 'BioTrampa', tipo: 'paquete de individuos', version: 1, proyecto: projName(), fecha: ymd(Date.now()), especies: S.indSp, individuos: list }, null, 1);
  $('#toast').hidden = true; download(zipStore([['catalogo.json', data], ...files, ['LEEME.txt', 'Paquete de individuos de BioTrampa: catalogo.json (datos, rosetas calcadas) y referencias/ (una imagen por individuo y lado).\r\nÁbrelo en BioTrampa: Individuos › ⋯ › Importar paquete. Los individuos que ya tengas no se reemplazan.\r\nNo incluye coordenadas de las estaciones.\r\n']]), `paquete_individuos_${depId(projName())}_${ymd(Date.now())}.zip`);
  toast(`Paquete listo: ${ids.length} individuo(s) y ${files.length} imagen(es).`, 5000); }
async function readZipBin(buf) { // lee .zip sin compresión (los de BioTrampa) o comprimidos (deflate, p. ej. los de Canva)
  const v = new DataView(buf), u8 = new Uint8Array(buf), dec = new TextDecoder(); let e = -1; for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 66000); i--) if (v.getUint32(i, true) === 0x06054b50) { e = i; break; }
  if (e < 0) throw new Error('no es un .zip'); const n = v.getUint16(e + 10, true); let p = v.getUint32(e + 16, true); const out = {};
  for (let k = 0; k < n; k++) { const meth = v.getUint16(p + 10, true), csz = v.getUint32(p + 20, true), nl = v.getUint16(p + 28, true), xl = v.getUint16(p + 30, true), cl = v.getUint16(p + 32, true), lo = v.getUint32(p + 42, true), name = dec.decode(u8.subarray(p + 46, p + 46 + nl)); p += 46 + nl + xl + cl;
    if (name.endsWith('/')) continue; const st = lo + 30 + v.getUint16(lo + 26, true) + v.getUint16(lo + 28, true), raw = u8.slice(st, st + csz);
    out[name] = meth === 0 ? raw : meth === 8 ? new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer()) : null; }
  return out; }
async function importPackage(f) { if (S.ro || !S.srcs.length) return toast('Abre el proyecto (con permiso para escribir) antes de importar.', 4000);
  let z, j; try { z = await readZipBin(await f.arrayBuffer()); j = JSON.parse(new TextDecoder().decode(z['catalogo.json'])); } catch (e) { return toast('El archivo no es un paquete de individuos de BioTrampa.', 4000); }
  if (!j || !j.individuos) return toast('El archivo no es un paquete de individuos de BioTrampa.', 4000);
  let add = 0, imgs = 0, same = 0;
  for (const [id, v] of Object.entries(j.individuos)) { const pk = v.refs || [], mine = S.ind.list[id]; delete v.refs;
    if (!mine) { S.ind.list[id] = v; add++; } else same++; const rec = S.ind.list[id]; rec.refs = rec.refs || [];
    for (const r of pk) { const data = z['referencias/' + r.file]; if (!data || rec.refs.some(x => x.file === r.file || x.orig === r.file)) continue;
      try { const w = await saveRefImage(new Blob([data]), r.file); rec.refs.push({ fl: r.fl, ...w, tr: r.tr || [], ...(r.dib ? { dib: 1 } : {}), ref: 1, orig: r.file }); imgs++; } catch (e) { toast('No se pudo guardar una imagen: ' + e.message, 5000); } } }
  if (Array.isArray(j.especies)) { for (const c of j.especies) if (!indOn(c)) S.indSp.push(c); sv('bt_indsp', S.indSp); }
  indTouch(); saveReg(); renderIndPane(); toast(`Paquete importado: ${add} individuo(s) nuevo(s), ${same} ya existían (se conservan los tuyos) y ${imgs} imagen(es) de referencia.`, 7000); }

/* ---------- 1.4.15: visor en lienzo (importar y comparar dos individuos): zoom propio, lápiz, recuadro, borrador, deshacer ---------- */
function CanvasEd(host, o = {}) {
  const tools = o.tools || ['pan', 'pen', 'zone', 'erase', '|', 'undo', 'redo', '|', 'eye', 'color', '|', 'fit'], d = { img: null, tr: [], zone: null, tool: 'pan', eye: true, view: { z: 1, cx: .5, cy: .5 }, und: [], red: [], marks: null, hi: -1, o };
  const TT = { pan: 'Mover y acercar (V)', pen: 'Calcar rosetas (P)', zone: 'Recuadro para recortar', erase: 'Borrar una roseta (E)', undo: 'Deshacer (Ctrl+Z)', redo: 'Rehacer', eye: 'Mostrar u ocultar trazos (H)', color: 'Color del trazo', fit: 'Ver completa' };
  const IK = { pan: 'move', pen: 'pen', zone: 'crop', erase: 'erase', undo: 'undo', redo: 'redo', eye: 'eye', fit: 'image' };
  host.innerHTML = `<canvas></canvas><span class="idlab"></span><div class="idtools">${tools.map(t => t === '|' ? '<i class="tsep"></i>' : `<button data-t="${t}" title="${TT[t]}" aria-label="${TT[t]}">${t === 'color' ? '<span class="tsw"></span>' : `<i class="ic">${icon(IK[t])}</i>`}</button>`).join('')}</div><span class="idhint" hidden></span>`;
  const can = host.querySelector('canvas'), x = can.getContext('2d'), W = () => d.img ? d.img.width : 1, H = () => d.img ? d.img.height : 1;
  const sc = () => { const r = host.getBoundingClientRect(); return Math.min(r.width / W(), r.height / H()) * d.view.z; };
  const pt = e => { const r = can.getBoundingClientRect(), s = sc(); return [(e.clientX - r.left - r.width / 2) / s + d.view.cx * W(), (e.clientY - r.top - r.height / 2) / s + d.view.cy * H()]; };
  d.render = () => { const p = devicePixelRatio || 1, r = host.getBoundingClientRect(); if (can.width !== Math.round(r.width * p) || can.height !== Math.round(r.height * p)) { can.width = Math.round(r.width * p); can.height = Math.round(r.height * p); }
    x.setTransform(p, 0, 0, p, 0, 0); x.clearRect(0, 0, r.width, r.height); if (!d.img) return; const s = sc(); x.save(); x.translate(r.width / 2 - d.view.cx * W() * s, r.height / 2 - d.view.cy * H() * s); x.scale(s, s); x.drawImage(d.img, 0, 0);
    if (d.zone) { const [a, b] = d.zone; x.setLineDash([8 / s, 6 / s]); x.strokeStyle = '#b0a2ff'; x.lineWidth = 2.5 / s; x.strokeRect(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])); x.setLineDash([]); }
    x.restore(); if (d.eye) { x.save(); x.translate(r.width / 2 - d.view.cx * W() * s, r.height / 2 - d.view.cy * H() * s); paintTraces(x, d.cur ? [...d.tr, d.cur] : d.tr, s, { marks: d.marks, hi: d.hi, w: 2.4, num: true }); x.restore(); }
    host.querySelector('.tsw') && (host.querySelector('.tsw').style.background = TRC[+ls('bt_trc', 0)] || TRC[0]);
    host.querySelectorAll('[data-t]').forEach(b => { const t = b.dataset.t; b.classList.toggle('on', t === d.tool || (t === 'eye' && !d.eye)); if (t === 'undo') b.disabled = !d.und.length; if (t === 'redo') b.disabled = !d.red.length; });
    const h = host.querySelector('.idhint'); h.textContent = o.hint ? o.hint(d) : d.tool === 'pen' ? `Dibuja alrededor de cada roseta · ${d.tr.length} calcada(s)` : d.tool === 'zone' ? 'Arrastra un recuadro' : d.tool === 'erase' ? 'Toca una roseta para borrarla' : ''; h.hidden = !h.textContent; };
  d.set = (img, tr, label) => { d.img = img; d.tr = tr || []; d.zone = null; d.und = []; d.red = []; d.view = { z: 1, cx: .5, cy: .5 }; host.querySelector('.idlab').textContent = label || ''; d.render(); };
  d.snap = () => { d.und.push(JSON.stringify([d.tr, d.zone])); d.red = []; };
  d.undo = again => { const a = again ? d.red : d.und, b = again ? d.und : d.red; if (!a.length) return; b.push(JSON.stringify([d.tr, d.zone])); [d.tr, d.zone] = JSON.parse(a.pop()); d.render(); o.onchange && o.onchange(d); };
  d.setTool = t => { d.tool = t; host.classList.toggle('pen', t === 'pen' || t === 'zone'); host.classList.toggle('erase', t === 'erase'); d.render(); };
  let drag = null;
  can.addEventListener('pointerdown', e => { if (!d.img || e.button) return; CanvasEd.act = d; const q = pt(e), t = IDV.space ? 'pan' : d.tool;
    if (t === 'erase') { const k = trHit(d.tr, q, 12 / sc()); if (k >= 0) { d.snap(); d.tr.splice(k, 1); d.render(); o.onchange && o.onchange(d); } return; }
    if (t === 'pen') d.cur = [q]; if (t === 'zone') { d.snap(); d.zs = q; } drag = { x: e.clientX, y: e.clientY, cx: d.view.cx, cy: d.view.cy, t }; can.setPointerCapture(e.pointerId); });
  can.addEventListener('pointermove', e => { if (!drag) return; const q = pt(e), s = sc();
    if (drag.t === 'pen') { const l = d.cur[d.cur.length - 1]; if (Math.hypot(q[0] - l[0], q[1] - l[1]) > 2.5 / s) { d.cur.push(q.map(Math.round)); d.render(); } }
    else if (drag.t === 'zone') { d.zone = [d.zs, q]; d.render(); }
    else { d.view.cx = drag.cx - (e.clientX - drag.x) / s / W(); d.view.cy = drag.cy - (e.clientY - drag.y) / s / H(); d.render(); } });
  const up = () => { if (!drag) return; const t = drag.t; drag = null;
    if (t === 'pen' && d.cur) { const c = d.cur, [a, b, cc, dd] = trBox(c), s = sc(); d.cur = null; if (c.length > 4 && cc - a > 6 / s && dd - b > 6 / s) { d.snap(); d.tr.push(trSmooth(c)); o.onchange && o.onchange(d); } d.render(); }
    if (t === 'zone') { const z = d.zone; if (!z || Math.abs(z[0][0] - z[1][0]) < 10 || Math.abs(z[0][1] - z[1][1]) < 10) { d.und.pop(); d.zone = null; } d.render(); o.onzone && o.onzone(d); } };
  can.addEventListener('pointerup', up); can.addEventListener('pointercancel', up); can.addEventListener('pointerenter', () => CanvasEd.act = d);
  can.addEventListener('wheel', e => { if (!d.img) return; e.preventDefault(); const r = can.getBoundingClientRect(), q = pt(e); d.view.z = Math.min(14, Math.max(1, d.view.z * Math.exp(-e.deltaY * .0015)));
    const s = sc(); d.view.cx = (q[0] - (e.clientX - r.left - r.width / 2) / s) / W(); d.view.cy = (q[1] - (e.clientY - r.top - r.height / 2) / s) / H(); d.render(); }, { passive: false });
  can.addEventListener('dblclick', () => { d.view = { z: 1, cx: .5, cy: .5 }; d.render(); });
  host.querySelector('.idtools').onclick = e => { const b = e.target.closest('button'); if (!b) return; const t = b.dataset.t;
    if (['pan', 'pen', 'zone', 'erase'].includes(t)) d.setTool(d.tool === t ? 'pan' : t); else if (t === 'undo') d.undo(); else if (t === 'redo') d.undo(true);
    else if (t === 'eye') { d.eye = !d.eye; d.render(); } else if (t === 'color') { sv('bt_trc', (+ls('bt_trc', 0) + 1) % TRC.length); d.render(); o.onchange && o.onchange(d, true); } else if (t === 'fit') { d.view = { z: 1, cx: .5, cy: .5 }; d.render(); } };
  new ResizeObserver(() => d.render()).observe(host); return d; }
addEventListener('keydown', e => { const d = CanvasEd.act; if (!d || !d.img || ($('#impdlg').hidden && $('#cmpdlg').hidden && ($('#inddlg').hidden || FI.open < 0)) || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
  const k = e.key.toLowerCase(), ctl = (e.ctrlKey || e.metaKey) && !e.altKey; let done = true; const has = t => d.o.tools ? d.o.tools.includes(t) : true;
  if (ctl && k === 'z') d.undo(e.shiftKey); else if (ctl && k === 'y') d.undo(true); else if (e.ctrlKey || e.metaKey || e.altKey) done = false;
  else if (k === 'p' && has('pen')) d.setTool(d.tool === 'pen' ? 'pan' : 'pen'); else if (k === 'e' && has('erase')) d.setTool(d.tool === 'erase' ? 'pan' : 'erase'); else if (k === 'v') d.setTool('pan'); else if (k === 'h') { d.eye = !d.eye; d.render(); }
  else if (e.key === ' ') IDV.space = true; else if (/^[1-9]$/.test(k) && d.onNum) d.onNum(+k - 1); else done = false;
  if (done) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);

/* ---------- 1.4.15: importar jaguares ya identificados (imágenes sueltas o una página con varios, como el archivo de Canva) ---------- */
const IMP = { list: [], sel: 0, ed: null };
async function openImport() { if (S.ro || !S.srcs.length) return toast('Abre el proyecto (con permiso para escribir) antes de importar.', 4000);
  if (!S.indSp.length) return toast('Primero marca qué especies se identifican por individuo (menú ⋯ de Individuos).', 4000);
  IMP.list = []; IMP.sel = 0; IMP.sp = S.indSp[0]; $('#imp_sp').innerHTML = S.indSp.map(c => `<option>${esc(c)}</option>`).join(''); openOver('#impdlg'); if (!IMP.ed) IMP.ed = CanvasEd($('#imp_stage'), { onchange: (d, colorOnly) => { const m = IMP.list[IMP.sel]; if (m && !colorOnly) { m.tr = d.tr; impForm(); } }, onzone: () => impForm() }); impRender(); }
function impRender() { const box = $('#imp_strip'); box.textContent = '';
  IMP.list.forEach((m, i) => { const b = document.createElement('button'); b.className = i === IMP.sel ? 'on' : ''; b.title = m.name; const c = document.createElement('canvas'), k = Math.min(140 / m.img.width, 96 / m.img.height); c.width = m.img.width * k; c.height = m.img.height * k; c.getContext('2d').drawImage(m.img, 0, 0, c.width, c.height);
    b.appendChild(c); b.insertAdjacentHTML('beforeend', `<small>${esc(m.sheet ? 'Página' : m.id || m.name)}</small>`); b.onclick = () => { IMP.sel = i; impRender(); }; box.appendChild(b); });
  const m = IMP.list[IMP.sel]; $('#imp_empty').hidden = !!m; IMP.ed.set(m ? m.img : null, m ? m.tr : [], m ? m.name : ''); IMP.ed.setTool(m && m.sheet ? 'zone' : m && !m.dib ? 'pen' : 'pan'); impForm(); }
function impFree() { const used = new Set([...Object.keys(S.ind.list), ...IMP.list.map(m => m.id)]); const p = indPrefix(IMP.sp); let k = 1; while (used.has(`${p}-${pad(k)}`)) k++; return `${p}-${pad(k)}`; }
function impAdd(name, img, extra = {}) { IMP.list.push({ name, img, tr: [], id: extra.sheet ? '' : impFree(), fl: 'I', sexo: '', edad: '', nombre: '', dib: true, ...extra }); }
function impForm() { const m = IMP.list[IMP.sel], f = $('#imp_form'), n = IMP.list.filter(x => !x.sheet).length; $('#imp_ok').textContent = n ? `Agregar ${n} al catálogo` : 'Agregar al catálogo'; $('#imp_ok').disabled = !n;
  if (!m) { f.innerHTML = ''; return; }
  if (m.sheet) { f.innerHTML = `<h3>Separar cada individuo</h3><p class="hint tiny">Esta imagen tiene varios. Encierra uno con el recuadro y sepáralo; repite con los demás. Las rosetas que ya vienen dibujadas en la imagen se conservan tal cual.</p><button class="main" id="imp_crop" ${IMP.ed.zone ? '' : 'disabled'}>Separar este recorte</button> <button class="lnk2" id="imp_one">No, es un solo individuo</button>`;
    $('#imp_crop').onclick = impCrop; $('#imp_one').onclick = () => { m.sheet = false; m.id = impFree(); impRender(); }; return; }
  const ex = S.ind.list[m.id], seg = (opts, key) => `<div class="idseg c3" data-k="${key}">${opts.map(([v, t]) => `<button data-v="${v}" class="${m[key] === v ? 'on' : ''}">${t}</button>`).join('')}</div>`;
  f.innerHTML = `<div class="idrow2"><label class="idfld">Código<input id="imp_id" value="${esc(m.id)}"></label><label class="idfld">Nombre<input id="imp_n" value="${esc(m.nombre)}" placeholder="opcional"></label></div>
    ${ex ? `<p class="idwarn">${esc(m.id)} ya está en el catálogo: esta imagen se agrega como otra referencia suya (sus datos no cambian).</p>` : ''}
    <p class="idk">Lado</p><div class="idseg" data-k="fl"><button data-v="I" class="${m.fl === 'I' ? 'on' : ''}">Izquierdo</button><button data-v="D" class="${m.fl === 'D' ? 'on' : ''}">Derecho</button></div>
    ${ex ? '' : `<p class="idk">Sexo</p>${seg([['Macho', 'Macho'], ['Hembra', 'Hembra'], ['', 'Sin dato']], 'sexo')}<p class="idk">Edad</p>${seg(EDADES.map(e => [e, e]), 'edad')}`}
    <p class="idk">Rosetas</p><div class="idseg" data-k="dib"><button data-v="1" class="${m.dib ? 'on' : ''}">Ya vienen dibujadas</button><button data-v="" class="${m.dib ? '' : 'on'}">Calcarlas aquí</button></div>
    <button class="lnk2" id="imp_many">Esta imagen tiene varios individuos: separarlos</button><p class="hint tiny">${m.tr.length ? `${m.tr.length} roseta(s) calcada(s) encima.` : m.dib ? 'Se guarda la imagen tal cual. Si además calcas las rosetas encima con el lápiz, al comparar podrás marcar ✓/✗ una por una.' : `Calca al menos ${TROK} con el lápiz.`}</p><button class="lnk2" id="imp_del">Quitar esta imagen</button>`;
  $('#imp_id').oninput = e => { m.id = e.target.value.trim().replace(/\s+/g, '-'); }; $('#imp_id').onchange = () => impForm(); $('#imp_n').oninput = e => m.nombre = e.target.value;
  f.querySelectorAll('.idseg[data-k] button').forEach(b => b.onclick = () => { const k = b.parentElement.dataset.k, v = b.dataset.v; m[k] = k === 'dib' ? !!v : v; if (k === 'dib') IMP.ed.setTool(v ? 'pan' : 'pen'); impForm(); });
  $('#imp_many').onclick = () => { m.sheet = true; m.id = ''; m.tr = []; impRender(); };
  $('#imp_del').onclick = () => { IMP.list.splice(IMP.sel, 1); IMP.sel = Math.max(0, IMP.sel - 1); impRender(); }; }
function impCrop() { const m = IMP.list[IMP.sel], [a, b] = IMP.ed.zone, x0 = Math.max(0, Math.round(Math.min(a[0], b[0]))), y0 = Math.max(0, Math.round(Math.min(a[1], b[1]))), w = Math.min(m.img.width - x0, Math.round(Math.abs(a[0] - b[0]))), h = Math.min(m.img.height - y0, Math.round(Math.abs(a[1] - b[1])));
  if (w < 20 || h < 20) return; const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(m.img, x0, y0, w, h, 0, 0, w, h);
  impAdd(`Recorte ${IMP.list.filter(x => x.crop).length + 1}`, c, { crop: true }); IMP.ed.zone = null; IMP.sel = IMP.list.length - 1; impRender(); toast('Recorte separado: ponle código y lado.', 3000); }
$('#imp_file').onchange = async e => { const fs = [...e.target.files]; e.target.value = '';
  for (const f of fs) { try { const img = await createImageBitmap(f); impAdd(f.name, img, { file: f }); } catch (x) { toast(`No se pudo abrir ${f.name}.`, 3000); } }
  IMP.sel = Math.max(0, IMP.list.length - fs.length); impRender(); };
$('#imp_sp').onchange = e => { IMP.sp = e.target.value; };
$('#imp_ok').onclick = async () => { const l = IMP.list.filter(m => !m.sheet); if (l.some(m => !m.id)) return toast('Falta el código de alguna imagen.', 3000);
  let nw = 0, more = 0; toast('Guardando las imágenes de referencia…', 0);
  for (const m of l) { try { const blob = m.file && !m.crop ? m.file : await new Promise(r => { const c = document.createElement('canvas'); c.width = m.img.width; c.height = m.img.height; c.getContext('2d').drawImage(m.img, 0, 0); c.toBlob(r, 'image/png'); });
      const name = `${folder(m.id)}_${sideName(m.fl)}${m.file && !m.crop ? (m.file.name.match(/\.[^.]+$/) || ['.png'])[0] : '.png'}`, w = await saveRefImage(blob, name);
      if (!S.ind.list[m.id]) { ensureInd(m.id, IMP.sp); Object.assign(S.ind.list[m.id], { nombre: m.nombre.trim(), sexo: m.sexo, ...(m.edad ? { edad: m.edad } : {}), importado: ymd(Date.now()) }); nw++; } else more++;
      const rec = S.ind.list[m.id]; (rec.refs = rec.refs || []).push({ fl: m.fl, ...w, tr: m.tr, ...(m.dib ? { dib: 1 } : {}), ref: 1 }); } catch (e) { toast(`No se pudo guardar ${m.name}: ${e.message}`, 6000); return; } }
  indTouch(); saveReg(); closeOver(); renderIndPane(); toast(`${nw} individuo(s) nuevo(s) y ${more} referencia(s) para individuos que ya tenías. Las imágenes quedan en «${REFD}» dentro de la carpeta de la primera estación.`, 7000); };

/* ---------- 1.4.17: fotos de un individuo ordenadas de mejor a peor (comparar, ficha, imprimir) ---------- */
const QORD = { B: 2, R: 1, M: 0 }, QCL = { B: 'qb', R: 'qr', M: 'qm' };
const phKey = p => p.it.id;
const phScore = p => ((p.o.tr || []).length ? 3 : 0) + (p.o.ref || p.ext ? 2 : 0) + (QORD[p.o.q] ?? 1) - (p.o.dud && !p.o.iv ? 2 : 0) - (p.o.fl === 'A' ? .5 : 0);
function photosOf(id, fl) { return [...extRefs(id), ...indPhotos(id)].filter(p => !fl || p.o.fl === fl || (p.o.fl === 'A' && !p.ext)).sort((a, b) => phScore(b) - phScore(a)); }
const phTime = p => !p.ext && goodTs(p.it) ? fixTs(p.it) : NaN;
const phWhen = p => { if (p.ext) return 'referencia importada'; const t = phTime(p); if (isNaN(t)) return (p.it.meta && p.it.meta.date) || 'sin fecha'; const d = new Date(t); return `${ymd(t)} ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const phBadges = p => `${p.o.ref || p.ext ? '<i title="Referencia">★</i>' : ''}${(p.o.tr || []).length ? `<i title="${p.o.tr.length} rosetas calcadas">✎</i>` : ''}${p.o.dud && !p.o.iv ? '<i class="w" title="Dudosa">?</i>' : ''}${QCL[p.o.q] ? `<i class="${QCL[p.o.q]}" title="Claridad ${QL[p.o.q].toLowerCase()}">●</i>` : ''}`;
const phTitle = p => [p.ext ? 'Referencia importada' : (p.it.origName || p.it.name), p.ext ? '' : station(p.it), p.ext ? '' : phWhen(p), FL[p.o.fl] ? 'lado ' + FL[p.o.fl].toLowerCase() : '', p.o.q ? 'claridad ' + QL[p.o.q].toLowerCase() : '', (p.o.tr || []).length ? p.o.tr.length + ' rosetas calcadas' : ''].filter(Boolean).join(' · ');
function phStrip(box, list, isOn, onPick) { box.textContent = ''; if (!list.length) { box.innerHTML = '<p class="hint tiny">Sin fotos de este lado.</p>'; return; }
  for (const p of list) { const b = document.createElement('button'); b.className = 'phth' + (isOn(p) ? ' on' : ''); b.title = phTitle(p); b.innerHTML = `<img alt=""><span class="phbd">${phBadges(p)}</span>`; thumbAny(b.querySelector('img'), p.it); b.onclick = () => onPick(p); box.appendChild(b); }
  const on = box.querySelector('.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
const BASEC = new Map(); // imágenes reducidas (para la cuadrícula de comparar y la impresión)
async function baseCanvas(p, max = 1400) { const key = phKey(p) + '|' + max; if (BASEC.has(key)) return BASEC.get(key);
  const b = await bitmapOf(p), k = Math.min(1, max / b.width), c = document.createElement('canvas'); c.width = Math.round(b.width * k); c.height = Math.round(b.height * k); c.getContext('2d').drawImage(b, 0, 0, c.width, c.height); b.close && b.close();
  const r = { c, k }; if (BASEC.size > 80) BASEC.delete(BASEC.keys().next().value); BASEC.set(key, r); return r; }
function tracedCanvas(base, trs, opt = {}) { const c = document.createElement('canvas'); c.width = base.c.width; c.height = base.c.height; const x = c.getContext('2d'); x.drawImage(base.c, 0, 0);
  if (opt.tr !== false && (trs || []).length) paintTraces(x, trs, base.k, { w: Math.max(2, c.width / 420), color: opt.color, num: opt.num !== false }); return c; }

/* ---------- 1.4.17: comparar dos individuos (rehecho: elige solas las mejores fotos, una o hasta 4 de cada uno, pares sugeridos) ---------- */
const CMP = { a: null, b: null, fl: 'I', mode: 1, ka: null, kb: null, ma: [], mb: [] };
function cmpPairs() { const ids = Object.keys(S.ind.list).sort(), inf = {};
  for (const id of ids) { const ph = indPhotos(id), r = { fl: new Set([...ph, ...extRefs(id)].map(p => p.o.fl)), st: new Set(ph.map(p => station(p.it))), days: new Map() };
    for (const p of ph) if (goodTs(p.it)) { const d = ymd(fixTs(p.it)); if (!r.days.has(d)) r.days.set(d, new Set()); r.days.get(d).add(station(p.it)); } inf[id] = r; }
  const out = [];
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) { const a = ids[i], b = ids[j], A = S.ind.list[a], B = S.ind.list[b], ia = inf[a], ib = inf[b];
    if (norm(A.sp) !== norm(B.sp) || (A.dist || []).includes(b) || (A.sexo && B.sexo && A.sexo !== B.sexo) || A.edad === 'Cría' || B.edad === 'Cría') continue;
    const sides = ['I', 'D'].filter(f => (ia.fl.has(f) || ia.fl.has('A')) && (ib.fl.has(f) || ib.fl.has('A'))); if (!sides.length) continue;
    if ([...ia.days].some(([d, sa]) => ib.days.has(d) && [...ib.days.get(d)].some(s => [...sa].some(t => t !== s)))) continue; // el mismo día en estaciones distintas: son distintos
    const sh = [...ia.st].filter(s => ib.st.has(s)).length;
    out.push({ a, b, fl: sides[0], sc: sh, why: `${sh ? sh + ' estación(es) en común' : 'sin estaciones en común'}, nunca el mismo día${!A.sexo || !B.sexo ? ', a uno le falta el sexo' : ''}` }); }
  return out.sort((x, y) => y.sc - x.sc).slice(0, 5); }
function cmpReset() { const la = photosOf(CMP.a, CMP.fl), lb = photosOf(CMP.b, CMP.fl); CMP.ka = la[0] ? phKey(la[0]) : null; CMP.kb = lb[0] ? phKey(lb[0]) : null; CMP.ma = la.slice(0, 4).map(phKey); CMP.mb = lb.slice(0, 4).map(phKey); }
function cmpFixSide() { const has = (id, f) => { const s = new Set(photosOf(id).map(p => p.o.fl)); return s.has(f) || s.has('A'); }; if (!(has(CMP.a, CMP.fl) && has(CMP.b, CMP.fl))) { const f = ['I', 'D'].find(f => has(CMP.a, f) && has(CMP.b, f)); if (f) CMP.fl = f; } }
function openCompare(a, b) { const ids = Object.keys(S.ind.list).sort(); if (ids.length < 2) return toast('Hacen falta al menos dos individuos en el catálogo.', 3000);
  const sug = cmpPairs(), s0 = !a && sug[0];
  CMP.a = s0 ? s0.a : a && S.ind.list[a] ? a : ids[0]; CMP.b = s0 ? s0.b : b && S.ind.list[b] && b !== CMP.a ? b : (sug.find(s => s.a === CMP.a || s.b === CMP.a) ? (s => s.a === CMP.a ? s.b : s.a)(sug.find(s => s.a === CMP.a || s.b === CMP.a)) : ids.find(k => k !== CMP.a && norm(S.ind.list[k].sp) === norm(S.ind.list[CMP.a].sp)) || ids.find(k => k !== CMP.a));
  if (s0) CMP.fl = s0.fl; cmpFixSide(); cmpReset();
  if (!CMP.l) { const tools = ['pan', 'pen', 'erase', '|', 'undo', '|', 'eye', 'color', '|', 'fit']; CMP.l = CanvasEd($('#cmp_l'), { tools, onchange: d => cmpSaved('a', d) }); CMP.r = CanvasEd($('#cmp_r'), { tools, onchange: d => cmpSaved('b', d) }); }
  openOver('#cmpdlg'); cmpRender(); }
function cmpSaved(k, d) { const p = CMP['p' + k]; if (!p) return; p.o.tr = d.tr; if (!p.o.tr.length) delete p.o.tr; if (p.ext) indTouch(); saveReg(); if (k === 'b') { CMP.r.marks = d.tr.map((_, i) => (CMP.r.marks || [])[i] || 0); cmpChips(); } cmpStrips(); }
let cmpTok = 0;
async function cmpRender() { const tok = ++cmpTok, ids = Object.keys(S.ind.list).sort(), sug = cmpPairs();
  const sel = (q, v) => { $(q).innerHTML = ids.map(k => { const fl = [...new Set(photosOf(k).map(p => p.o.fl).filter(f => f === 'I' || f === 'D'))].sort().join('/'); return `<option ${k === v ? 'selected' : ''} value="${esc(k)}">${esc(k)}${S.ind.list[k].nombre ? ' «' + esc(S.ind.list[k].nombre) + '»' : ''}${fl ? ' · ' + fl : ''}</option>`; }).join(''); };
  sel('#cmp_a', CMP.a); sel('#cmp_b', CMP.b);
  $('#cmp_sugw').hidden = !sug.length; $('#cmp_sug').innerHTML = sug.map((s, i) => `<button data-s="${i}" class="${s.a === CMP.a && s.b === CMP.b ? 'on' : ''}"><b>${esc(s.a)} y ${esc(s.b)}</b><small>${esc(s.why)}</small></button>`).join('');
  $('#cmp_sug').querySelectorAll('[data-s]').forEach(b => b.onclick = () => { const s = sug[+b.dataset.s]; Object.assign(CMP, { a: s.a, b: s.b, fl: s.fl }); cmpReset(); cmpRender(); });
  const hasF = (id, f) => photosOf(id, f).length > 0;
  $('#cmp_fl').querySelectorAll('button').forEach(b => { b.classList.toggle('on', b.dataset.v === CMP.fl); b.disabled = !(hasF(CMP.a, b.dataset.v) && hasF(CMP.b, b.dataset.v)); });
  $('#cmp_md').querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.v === CMP.mode));
  const one = CMP.mode === 1; $('#cmp_l').hidden = $('#cmp_r').hidden = !one; $('#cmp_ga').hidden = $('#cmp_gb').hidden = one; $('#cmp_mk').hidden = !one;
  cmpStrips();
  const A = S.ind.list[CMP.a], B = S.ind.list[CMP.b], pa = indPhotos(CMP.a), pb = indPhotos(CMP.b), dist = (A.dist || []).includes(CMP.b);
  const same = pa.some(p => goodTs(p.it) && pb.some(q => goodTs(q.it) && station(q.it) !== station(p.it) && ymd(fixTs(q.it)) === ymd(fixTs(p.it))));
  $('#cmp_info').innerHTML = [same ? '<b>Aparecieron el mismo día en estaciones distintas:</b> probablemente son distintos.' : '', A.sexo && B.sexo && A.sexo !== B.sexo ? `<b>Sexo distinto</b> (${esc(A.sexo.toLowerCase())} y ${esc(B.sexo.toLowerCase())}).` : '', dist ? 'Ya los marcaste como distintos.' : '', one ? '' : 'Doble clic en una foto para verla sola y marcar sus rosetas.'].filter(Boolean).join(' ');
  $('#cmp_join').textContent = `Son el mismo: unir ${CMP.b} a ${CMP.a}`;
  if (one) { for (const [k, ed, id] of [['a', CMP.l, CMP.a], ['b', CMP.r, CMP.b]]) { const l = photosOf(id, CMP.fl), p = l.find(q => phKey(q) === CMP['k' + k]) || l[0] || null; CMP['p' + k] = p;
      if (!p) { ed.set(null, [], `${k.toUpperCase()} · ${id}: sin fotos del lado ${FL[CMP.fl].toLowerCase()}`); continue; }
      try { const bmp = await bitmapOf(p); if (tok !== cmpTok) return; ed.set(bmp, (p.o.tr || []).map(t => t.slice()), `${k.toUpperCase()} · ${id} · ${p.ext ? 'referencia importada' : station(p.it) + ' · ' + phWhen(p)}`); } catch (e) { ed.set(null, [], `${id}: ${e.message}`); } }
    CMP.r.marks = CMP.r.tr.map(() => 0); CMP.r.onNum = i => { if (i < CMP.r.tr.length) { CMP.r.marks[i] = (CMP.r.marks[i] + 1) % 3; cmpChips(); } }; cmpChips(); }
  else { $('#cmp_verdict').textContent = '';
    for (const [k, id, box] of [['a', CMP.a, $('#cmp_ga')], ['b', CMP.b, $('#cmp_gb')]]) { const all = photosOf(id, CMP.fl), l = CMP['m' + k].map(key => all.find(p => phKey(p) === key)).filter(Boolean);
      box.className = 'cmpg n' + Math.max(1, l.length); box.innerHTML = `<span class="cmpgl">${k.toUpperCase()} · ${esc(id)}</span>` + (l.length ? '' : '<p class="cmpge">Sin fotos de este lado</p>');
      for (const p of l) { const cell = document.createElement('div'); cell.className = 'cmpc'; cell.title = 'Doble clic: verla sola'; cell.innerHTML = `<span class="idlab">${esc(p.ext ? 'referencia importada' : station(p.it) + ' · ' + phWhen(p).slice(0, 10))}</span>`; box.appendChild(cell);
        cell.ondblclick = () => { CMP['k' + k] = phKey(p); CMP.mode = 1; cmpRender(); };
        baseCanvas(p, 1200).then(bc => { if (tok === cmpTok) cell.prepend(tracedCanvas(bc, p.o.tr, { tr: CMP.eye !== false })); }).catch(() => cell.classList.add('bad')); } } } }
function cmpStrips() { const one = CMP.mode === 1;
  $('#cmp_ka').innerHTML = `Fotos de A · ${one ? 'toca una para verla' : 'elige hasta 4'} <span class="mu">mejores primero</span>`; $('#cmp_kb').textContent = 'Fotos de B';
  for (const k of ['a', 'b']) phStrip($('#cmp_s' + k), photosOf(CMP[k], CMP.fl), p => one ? phKey(p) === CMP['k' + k] : CMP['m' + k].includes(phKey(p)), p => {
    if (one) CMP['k' + k] = phKey(p); else { const L = CMP['m' + k], i = L.indexOf(phKey(p)); if (i >= 0) L.splice(i, 1); else if (L.length < 4) L.push(phKey(p)); else return toast('Hasta 4 fotos por individuo. Quita una primero.', 2500); }
    cmpRender(); }); }
function cmpChips() { const box = $('#cmp_chips'), m = CMP.r.marks || []; box.textContent = '';
  CMP.r.tr.forEach((_, i) => { const b = document.createElement('button'), v = m[i] || 0; b.className = 'idchip' + (v === 1 ? ' y' : v === 2 ? ' n' : ''); b.innerHTML = `${i + 1}${v ? `<small>${v === 1 ? '✓' : '✗'}</small>` : ''}`;
    b.onclick = () => { m[i] = (v + 1) % 3; cmpChips(); }; b.onmouseenter = () => { CMP.r.hi = i; CMP.r.render(); }; b.onmouseleave = () => { CMP.r.hi = -1; CMP.r.render(); }; box.appendChild(b); });
  CMP.r.render(); const y = m.filter(v => v === 1).length, n = m.filter(v => v === 2).length;
  $('#cmp_verdict').innerHTML = !CMP.pb ? '' : !CMP.r.tr.length ? `Esta foto de ${esc(CMP.b)} no tiene rosetas calcadas: cálcalas con el lápiz para marcarlas una por una.` : n ? '<b class="no">Una roseta no coincide:</b> son individuos distintos.' : y >= TROK ? `<b class="ok">${y} rosetas coinciden:</b> parecen el mismo individuo.` : `${y} de ${CMP.r.tr.length} marcadas. Marca ✓ o ✗ (1–9 en el teclado).`; }
$('#cmp_a').onchange = e => { CMP.a = e.target.value; if (CMP.b === CMP.a) CMP.b = Object.keys(S.ind.list).sort().find(k => k !== CMP.a); cmpFixSide(); cmpReset(); cmpRender(); };
$('#cmp_b').onchange = e => { CMP.b = e.target.value; if (CMP.b === CMP.a) CMP.a = Object.keys(S.ind.list).sort().find(k => k !== CMP.b); cmpFixSide(); cmpReset(); cmpRender(); };
$('#cmp_fl').querySelectorAll('button').forEach(b => b.onclick = () => { CMP.fl = b.dataset.v; cmpReset(); cmpRender(); });
$('#cmp_md').querySelectorAll('button').forEach(b => b.onclick = () => { CMP.mode = +b.dataset.v; cmpRender(); });
$('#cmp_swap').onclick = () => { [CMP.a, CMP.b, CMP.ka, CMP.kb, CMP.ma, CMP.mb] = [CMP.b, CMP.a, CMP.kb, CMP.ka, CMP.mb, CMP.ma]; cmpRender(); };
$('#cmp_join').onclick = () => { closeOver(); mergeInd(CMP.a, CMP.b); };
function cmpNext() { const sug = cmpPairs(); if (!sug.length) return toast('No hay más pares para revisar.', 2500); const i = sug.findIndex(s => s.a === CMP.a && s.b === CMP.b), s = sug[(i + 1) % sug.length]; Object.assign(CMP, { a: s.a, b: s.b, fl: s.fl }); cmpReset(); cmpRender(); }
$('#cmp_next').onclick = cmpNext;
$('#cmp_dist').onclick = () => { for (const [x, y] of [[CMP.a, CMP.b], [CMP.b, CMP.a]]) { const r = S.ind.list[x]; r.dist = [...new Set([...(r.dist || []), y])]; } indTouch(); saveReg(); toast(`${CMP.a} y ${CMP.b} quedan marcados como distintos: ya no se sugieren.`, 4000); if (cmpPairs().length) cmpNext(); else cmpRender(); };

/* ---------- 1.4.15: ficha: dónde y cuándo apareció ---------- */
function indTimeline(ph) { const pts = ph.filter(p => goodTs(p.it)).map(p => ({ t: fixTs(p.it), s: station(p.it), k: p.it.id })); if (!pts.length) return '';
  const sts = [...new Set(pts.map(p => p.s))].sort(), t0 = Math.min(...pts.map(p => p.t)), t1 = Math.max(...pts.map(p => p.t)), span = Math.max(t1 - t0, 864e5), W = 640, L = 110, R = 12, row = 24, H = sts.length * row + 26, X = t => L + (t - t0) / span * (W - L - R);
  let s = `<svg class="indtl" viewBox="0 0 ${W} ${H}" role="img" aria-label="Fechas y estaciones donde apareció">`;
  sts.forEach((st, i) => { const y = i * row + 12; s += `<text x="0" y="${y + 4}">${esc(st.length > 16 ? st.slice(0, 15) + '…' : st)}</text><line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/>`; pts.filter(p => p.s === st).forEach(p => s += `<circle cx="${X(p.t).toFixed(1)}" cy="${y}" r="4.5" data-key="${esc(p.k)}"><title>${ymd(p.t)} · ${esc(st)}</title></circle>`); });
  const n = 5; for (let i = 0; i < n; i++) { const t = t0 + span * i / (n - 1); s += `<text x="${X(t).toFixed(1)}" y="${H - 3}" text-anchor="${i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle'}">${ymd(t)}</text>`; }
  return s + '</svg><p class="hint tiny">Cada punto es una foto, en la fila de su estación.</p>'; }

/* ---------- Panel «Individuos» ---------- */
function indStats() { // una pasada por todas las fotos: fotos, flancos, estaciones y días de cada individuo
  const m = new Map();
  for (const it of S.items) for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (!o || !o.id) continue;
    if (!m.has(o.id)) m.set(o.id, { n: 0, fl: new Set(), st: new Set(), days: new Set(), last: '' }); const r = m.get(o.id); r.n++; if (o.fl) r.fl.add(o.fl); r.st.add(station(it));
    if (goodTs(it)) { const d = ymd(fixTs(it)); r.days.add(d); if (d > r.last) r.last = d; } }
  return m;
}
function indAlerts() { // mismo individuo en dos estaciones lejanas en poco tiempo (más de 5 km/h): posible error de identificación
  const by = new Map(), out = [];
  for (const it of S.items) { if (!goodTs(it)) continue; for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (o && o.id) { if (!by.has(o.id)) by.set(o.id, []); by.get(o.id).push(it); } } }
  for (const [id, l] of by) { l.sort((a, b) => fixTs(a) - fixTs(b));
    for (let i = 1; i < l.length; i++) { const a = l[i - 1], b = l[i]; if (station(a) === station(b)) continue; const ca = stCoords(station(a)), cb = stCoords(station(b)); if (!ca || !cb) continue;
      const d = km(ca, cb), h = Math.max((fixTs(b) - fixTs(a)) / 36e5, 1 / 60); if (d > 1 && d / h > 5) out.push({ id, a, b, d, h }); } }
  return out;
}
const indSpShut = ls('bt_indspfold', {}); // 1.4.11: especies plegadas en la lista de individuos
const indOpen = {}; // qué listas de abajo (dudosas, posible error, no se puede saber) están desplegadas
function renderIndPane() {
  const box = $('#indbody'); if (!box) return; const st = indStats(), al = indAlerts();
  const dud = [], ns = []; for (const it of S.items) for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (o && o.id && o.dud && !o.iv) dud.push({ it, o }); if (o && o.ns && !o.id) ns.push({ it, c }); }
  const ids = Object.keys(S.ind.list).sort(), bySp = new Map(); for (const id of ids) { const c = S.ind.list[id].sp || '—'; if (!bySp.has(c)) bySp.set(c, []); bySp.get(c).push(id); }
  $('#indn').textContent = ids.length || '';
  const ph = it => `${esc(station(it))} · ${esc(it.origName || it.name)}`;
  let h = ids.length ? '' : `<p class="none">Todavía no hay individuos. En el visor pulsa el botón «Individuo», junto a Observación.</p>`;
  for (const [c, l] of bySp) h += `<button class="isp${indSpShut[c] ? '' : ' open'}" data-isp="${esc(c)}" title="Plegar o desplegar"><i class="ic sm">${icon('chevR')}</i><span class="cn">${esc(c)}</span><b>${l.length}</b></button><div class="ikids">` + l.map(id => { const r = S.ind.list[id], s = st.get(id);
    return `<button class="cat" data-ind="${esc(id)}" title="Ver la ficha"><span class="cn">${esc(id)}${r.nombre ? ` <small>${esc(r.nombre)}</small>` : ''}</span><b>${s ? s.n : 0}</b></button>`; }).join('') + '</div>'; // 1.4.11: especie como subtítulo plegable
  const fold = (k, label, n, warn, rows) => n ? `<div class="ifold${indOpen[k] ? ' open' : ''}${warn ? ' warn' : ''}"><button class="cat" data-fold="${k}">${warn ? '<i class="idot"></i>' : `<i class="ic sm">${icon('chevR')}</i>`}<span class="cn">${label}</span><b>${n}</b></button><div class="ifb">${rows}</div></div>` : '';
  h += fold('dud', 'Dudosas por confirmar', dud.length, 1, dud.slice(0, 50).map((d, k) => `<button class="cat sub" data-dud="${k}"><span class="cn">${esc(d.o.id)} <small>${ph(d.it)}</small></span></button>`).join(''));
  h += fold('al', 'Posible error', al.length, 1, al.slice(0, 50).map((a, k) => `<div class="ialr"><span>${esc(a.id)}: ${esc(station(a.a))} → ${esc(station(a.b))}, ${a.d.toFixed(1)} km en ${a.h < 1 ? Math.round(a.h * 60) + ' min' : a.h.toFixed(1) + ' h'}</span><button class="lnk2" data-ala="${k}">foto 1</button><button class="lnk2" data-alb="${k}">foto 2</button></div>`).join(''));
  h += fold('ns', 'No se puede saber', ns.length, 0, ns.slice(0, 50).map((n, k) => `<button class="cat sub" data-ns="${k}"><span class="cn">${esc(n.c)} <small>${ph(n.it)}</small></span></button>`).join('') + (ns.length > 50 ? `<p class="hint tiny">y ${ns.length - 50} más.</p>` : ''));
  box.innerHTML = h;
  box.querySelectorAll('[data-ind]').forEach(b => b.onclick = () => openFicha(b.dataset.ind));
  box.querySelectorAll('[data-isp]').forEach(b => b.onclick = e => { e.stopPropagation(); const c = b.dataset.isp; indSpShut[c] = !indSpShut[c]; if (!indSpShut[c]) delete indSpShut[c]; sv('bt_indspfold', indSpShut); b.classList.toggle('open', !indSpShut[c]); });
  box.querySelectorAll('[data-fold]').forEach(b => b.onclick = () => { const k = b.dataset.fold; indOpen[k] = !indOpen[k]; b.parentElement.classList.toggle('open', indOpen[k]); });
  box.querySelectorAll('[data-dud]').forEach(b => b.onclick = () => { const d = dud[+b.dataset.dud], c = allCats(d.it).find(c => d.it.obs[c] === d.o); if (c) openIdent(d.it, c, 'dud'); else show(d.it); }); // 1.4.15: abre la revisión de dudosas
  box.querySelectorAll('[data-ns]').forEach(b => b.onclick = () => show(ns[+b.dataset.ns].it));
  box.querySelectorAll('[data-ala]').forEach(b => b.onclick = () => show(al[+b.dataset.ala].a)); box.querySelectorAll('[data-alb]').forEach(b => b.onclick = () => show(al[+b.dataset.alb].b));
}
$('#indmore').onclick = e => { e.stopPropagation(); if (closeMenu()) return; const all = [...new Set([...S.indSp, ...S.cats.filter(c => c !== GH)])]; // marcadas: especies que se identifican por individuo (botón de huella)
  const m = menuAt(e.currentTarget, [...all.map(c => [c, () => { S.indSp = indOn(c) ? S.indSp.filter(x => norm(x) !== norm(c)) : [...S.indSp, c]; sv('bt_indsp', S.indSp); S.indDirty = true; saveReg(); renderIndPane(); if (S.cur) renderObs(S.cur); }, 'Marcada: esta especie se identifica por individuo', indOn(c)]),
    null, ['Identificar pendientes', () => goQueue('pend'), 'Abre la primera foto sin individuo y, al decidir, pasa sola a la siguiente'], ['Revisar dudosas', () => goQueue('dud'), 'Repasa una por una las identificaciones dudosas'], ['Comparar dos individuos', () => openCompare(), 'Para encontrar duplicados en el catálogo'],
    null, ['Importar ya identificados…', openImport, 'Imágenes de individuos conocidos (p. ej. exportadas de Canva), con sus rosetas'], ['Importar paquete (.zip)…', () => $('#filepkg').click()],
    ['Fotos con rosetas (.zip)', () => indSpPick(exportCards), 'Una imagen por individuo y lado, con las rosetas dibujadas'], ['Lámina del catálogo (izquierdo)', () => indSpPick(sp => exportSheet(sp, 'I'))], ['Lámina del catálogo (derecho)', () => indSpPick(sp => exportSheet(sp, 'D'))], ['Paquete del catálogo (.zip)', exportPackage, 'Datos, imágenes de referencia y rosetas, para otra computadora'],
    null, ['Ordenar fotos en carpetas por individuo', sortIndFolders, 'Mueve las fotos con individuo a Clasificadas/<Especie>/<Individuo>/ (las identificadas antes de la 1.4.14)'], ['Exportar catálogo', exportCatalog], ['Importar catálogo', () => $('#fileind').click()], ['Imprimir catálogo', () => { const l = Object.keys(S.ind.list).sort(); if (!l.length) return toast('El catálogo está vacío.', 3000); printInd(l); }]]); const hd = document.createElement('b'); hd.className = 'pbh'; hd.textContent = 'Se identifican por individuo'; m.prepend(hd); };

function indSpPick(fn) { const l = [...new Set(Object.values(S.ind.list).map(r => r.sp).filter(Boolean))]; if (!l.length) return toast('El catálogo está vacío.', 3000); fn(l.find(c => S.cur && hasCat(S.cur, c)) || l[0]); }
$('#filepkg').onchange = e => { const f = e.target.files[0]; e.target.value = ''; if (f) importPackage(f); };

/* ---------- Ficha de un individuo (1.4.17: visor con flechas, referencias arriba, números, filtros, estaciones, horas, visto con, historial) ---------- */
const FI = { filt: 'T', st: '', open: -1, tok: 0 };
const fullUrls = new Map(); // imágenes completas de la cabecera de la ficha (pocas, se liberan al pasar de 12)
async function fullUrl(p) { const k = phKey(p); if (fullUrls.has(k)) return fullUrls.get(k); const u = p.ext ? await refUrl(p.it.ref) : URL.createObjectURL(await p.it.h.getFile());
  if (!p.ext) { fullUrls.set(k, u); if (fullUrls.size > 12) { const [k0, u0] = fullUrls.entries().next().value; URL.revokeObjectURL(u0); fullUrls.delete(k0); } } return u; }
function openFicha(id) { if (!S.ind.list[id]) return toast(`${id} no está en el catálogo.`, 3000); if (S.fichaId !== id) Object.assign(FI, { filt: 'T', st: '', open: -1 }); FI.open = -1; S.fichaId = id; renderFicha(); openOver('#inddlg'); }
function ficAll(id) { return [...extRefs(id), ...indPhotos(id).sort((a, b) => (phTime(a) || 0) - (phTime(b) || 0))]; } // referencias importadas primero, luego por fecha
function ficList(id) { return ficAll(id).filter(p => (FI.filt === 'T' || (FI.filt === 'I' || FI.filt === 'D' ? p.o.fl === FI.filt || p.o.fl === 'A' : FI.filt === 'R' ? (p.o.tr || []).length : p.o.dud && !p.o.iv)) && (!FI.st || (!p.ext && station(p.it) === FI.st))); }
function seenWith(id) { const mine = indPhotos(id).filter(p => goodTs(p.it)), out = new Map(), rec = S.ind.list[id], byst = new Map(); if (!rec) return [];
  if (mine.length) { for (const it of S.items) { if (!goodTs(it)) continue; for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (o && o.id && o.id !== id) { const s = station(it); if (!byst.has(s)) byst.set(s, []); byst.get(s).push({ id: o.id, t: fixTs(it), it }); } } }
    for (const p of mine) { const t = fixTs(p.it); for (const q of byst.get(station(p.it)) || []) if (Math.abs(q.t - t) <= 36e5) { const r = out.get(q.id) || { id: q.id, n: 0, same: 0 }; r.n++; if (q.it === p.it) r.same++; out.set(q.id, r); } } }
  const rel = k => S.ind.list[k] && S.ind.list[k].madre === id ? 'su cría' : rec.madre === k ? 'su madre' : '';
  for (const k of Object.keys(S.ind.list)) if (rel(k) && !out.has(k)) out.set(k, { id: k, n: 0, same: 0 });
  return [...out.values()].map(r => ({ ...r, rel: rel(r.id) })).sort((a, b) => !!b.rel - !!a.rel || b.n - a.n); }
function renderFicha() {
  const id = S.fichaId, rec = S.ind.list[id]; if (!rec) return closeOver();
  $('#h_ind').textContent = `${id}${rec.nombre ? ' «' + rec.nombre + '»' : ''}`;
  if (FI.open >= 0 && ficList(id).length) return ficPhoto(id);
  FI.open = -1; FI.tok++; $('#indst').classList.remove('view'); $('#indcard').hidden = false; $('#ind_v').hidden = true; ['#ind_pv', '#ind_nx', '#ind_cl'].forEach(q => $(q).hidden = true);
  const box = $('#indcard'), ph = indPhotos(id), xr = extRefs(id), all = [...xr, ...ph], ts = ph.filter(p => goodTs(p.it)).map(p => fixTs(p.it)).sort((a, b) => a - b), days = new Set(ts.map(t => ymd(t))), sts = new Map();
  for (const p of ph) { const s = station(p.it), r = sts.get(s) || { n: 0, t0: Infinity, t1: -Infinity }; r.n++; if (goodTs(p.it)) { r.t0 = Math.min(r.t0, fixTs(p.it)); r.t1 = Math.max(r.t1, fixTs(p.it)); } sts.set(s, r); }
  const hrs = new Array(24).fill(0); ts.forEach(t => hrs[new Date(t).getHours()]++); const mx = Math.max(1, ...hrs), night = hrs.slice(18).concat(hrs.slice(0, 6)).reduce((a, b) => a + b, 0);
  const fls = new Set(all.map(p => p.o.fl).filter(Boolean)), only = fls.has('A') ? null : fls.has('I') && !fls.has('D') ? 'I' : fls.has('D') && !fls.has('I') ? 'D' : null;
  let maybe = [];
  if (only) { const opp = only === 'I' ? 'D' : 'I';
    maybe = Object.keys(S.ind.list).filter(k => k !== id && norm(S.ind.list[k].sp) === norm(rec.sp) && !(rec.dist || []).includes(k)).map(k => { const p2 = indPhotos(k), f2 = new Set(p2.map(p => p.o.fl)); if (f2.has('A') || f2.has(only) || !f2.has(opp)) return null;
      const st2 = new Set(p2.map(p => station(p.it))), shared = [...sts.keys()].filter(s => st2.has(s)).length;
      const together = ph.some(p => p2.some(q => station(q.it) === station(p.it) && Math.abs(fixTs(q.it) - fixTs(p.it)) <= 60000)); return { k, shared, together, n: p2.length }; }).filter(Boolean).sort((a, b) => b.together - a.together || b.shared - a.shared); }
  const cnt = { T: all.length, I: all.filter(p => p.o.fl === 'I' || p.o.fl === 'A').length, D: all.filter(p => p.o.fl === 'D' || p.o.fl === 'A').length, R: all.filter(p => (p.o.tr || []).length).length, U: all.filter(p => p.o.dud && !p.o.iv).length };
  const L = ficList(id), wth = seenWith(id), dmy = t => ymd(t);
  let h = `<div class="fic"><div class="ficrefs">${['I', 'D'].map(f => { const p = photosOf(id, f)[0]; return `<div class="ficrf"${p ? ` data-key="${esc(phKey(p))}" title="Verla en grande"` : ''}>${p ? '<img alt="">' : `<div class="ficnr">Sin foto del lado ${FL[f].toLowerCase()}</div>`}<span>Lado ${FL[f].toLowerCase()}${p ? (p.o.ref || p.ext ? ' · referencia' : ' · la mejor foto') : ''}</span></div>`; }).join('')}</div>
    <div class="ficstats"><div><b>${ph.length}</b><span>foto(s)</span></div><div><b>${days.size}</b><span>días con registro</span></div><div><b>${sts.size}</b><span>estación(es)</span></div><div><b>${ts.length ? dmy(ts[0]) : '—'}</b><span>primera vez</span></div><div><b>${ts.length ? dmy(ts[ts.length - 1]) : '—'}</b><span>última vez</span></div><div><b>${cnt.R}</b><span>con rosetas</span></div></div>`;
  if (maybe.length) h += `<div class="indal"><b>Posible mismo individuo</b>: de ${esc(id)} solo se conoce el flanco ${FL[only].toLowerCase()} y de estos solo el otro. Únelos solo si lo confirma una foto de los dos lados (por ejemplo, cámaras en par al mismo tiempo).${maybe.slice(0, 8).map(m => `<div class="alr">${esc(m.k)} · ${m.n} foto(s)${m.together ? ' · <b>vistos al mismo tiempo en la misma estación</b>' : m.shared ? ` · ${m.shared} estación(es) en común` : ''} <button class="lnk2" data-ver="${esc(m.k)}">Ver ficha</button> <button class="lnk2" data-join="${esc(m.k)}">Son el mismo: unir</button></div>`).join('')}</div>`;
  h += `<div class="fich"><h3>Fotos</h3><div class="ficf">${[['T', 'Todas'], ['I', 'Izquierdo'], ['D', 'Derecho'], ['R', 'Con rosetas'], ['U', 'Dudosas']].filter(([v]) => cnt[v] || v === 'T' || FI.filt === v).map(([v, t]) => `<button data-f="${v}" class="${FI.filt === v ? 'on' : ''}">${t} <small>${cnt[v]}</small></button>`).join('')}</div>${sts.size > 1 ? `<select id="fic_st"><option value="">Todas las estaciones</option>${[...sts.keys()].sort().map(s => `<option ${FI.st === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select>` : ''}</div>
    <div class="ficg">${L.map((p, i) => `<button class="ficph" data-i="${i}" title="${esc(phTitle(p))}"><img alt=""><span class="phbd">${phBadges(p)}</span><small>${p.ext ? 'Referencia importada' : esc(station(p.it)) + ' · ' + esc(phWhen(p))}</small></button>`).join('') || '<p class="hint tiny">Ninguna foto con este filtro.</p>'}</div>`;
  if (ts.length) h += `<h3>Dónde y cuándo apareció</h3>${indTimeline(ph)}`;
  if (sts.size) h += `<div class="ficcols"><div><h3>Estaciones</h3><table class="fictab"><thead><tr><th>Estación</th><th>Fotos</th><th>Primera</th><th>Última</th></tr></thead><tbody>${[...sts].sort((a, b) => a[0] < b[0] ? -1 : 1).map(([s, r]) => `<tr><td><button class="lnk2" data-st="${esc(s)}">${esc(s)}</button></td><td>${r.n}</td><td>${isFinite(r.t0) ? dmy(r.t0) : '—'}</td><td>${isFinite(r.t1) ? dmy(r.t1) : '—'}</td></tr>`).join('')}</tbody></table></div>
    <div><h3>Actividad por hora</h3>${ts.length ? `<div class="indhrs ficbig" title="Fotos por hora del día">${hrs.map((v, i) => `<i style="height:${Math.round(v / mx * 100)}%" title="${pad(i)}:00 · ${v}"></i>`).join('')}</div><p class="hint tiny">0 a 23 h · ${night > ts.length / 2 ? 'más activo de noche' : 'más activo de día'} (${Math.round(night / ts.length * 100)}% entre 18 y 6 h).</p>` : '<p class="hint tiny">Sin fechas utilizables.</p>'}</div></div>`;
  h += `<h3>Visto con</h3>${wth.length ? `<div class="ficwith">${wth.slice(0, 8).map(w => `<button data-ver="${esc(w.id)}"><img alt=""><span><b>${esc(w.id)}</b><small>${[w.rel, w.same ? `${w.same} vez/veces en la misma foto` : '', w.n - w.same > 0 ? `${w.n - w.same} vez/veces a menos de 1 h en la misma estación` : ''].filter(Boolean).join(' · ')}</small></span></button>`).join('')}</div>` : '<p class="hint tiny">No ha salido con otro individuo en la misma foto ni a menos de 1 hora en la misma estación.</p>'}`;
  const hist = [[rec.creado || '', `entró al catálogo${rec.importado ? ' (importado con sus rosetas)' : ''}`], ...(ts.length ? [[dmy(ts[0]), `primera foto, en ${station(ph.find(p => goodTs(p.it) && fixTs(p.it) === ts[0]).it)}`]] : []), ...ph.filter(p => p.o.if).map(p => [p.o.if, `identificada una foto de ${station(p.it)}${p.o.ib ? ' por ' + p.o.ib : ''}${p.o.dud && !p.o.iv ? ' (dudosa)' : ''}`]), ...(rec.merges || []).map((m, k) => [m.fecha || '', `${m.from} se unió a ${id} (${m.photos.length} foto(s)) <button class="lnk2" data-undo="${k}">Deshacer</button>`, 1])].filter(x => x[0]).sort((a, b) => a[0] < b[0] ? -1 : 1);
  const hshow = hist.length > 12 ? [...hist.slice(0, 4), ['…', `${hist.length - 8} registro(s) más`], ...hist.slice(-4)] : hist;
  h += `<h3>Historial</h3><ul class="fichist">${hshow.map(([d, t, raw]) => `<li><span>${esc(d)}</span> ${raw ? t.replace(/^[^<]*/, s => esc(s)) : esc(t)}</li>`).join('') || '<li>Sin registros.</li>'}</ul></div>`;
  box.innerHTML = h; box.parentElement.scrollTop = FI.scroll || 0; FI.scroll = 0;
  box.querySelectorAll('.ficrf[data-key]').forEach(d => { const p = all.find(q => phKey(q) === d.dataset.key); fullUrl(p).then(u => d.querySelector('img').src = u).catch(() => thumbAny(d.querySelector('img'), p.it));
    d.onclick = () => { FI.filt = 'T'; FI.st = ''; FI.open = ficList(id).findIndex(q => phKey(q) === d.dataset.key); renderFicha(); }; });
  box.querySelectorAll('.ficph').forEach(b => { const p = L[+b.dataset.i]; thumbAny(b.querySelector('img'), p.it); b.onclick = () => { FI.scroll = box.parentElement.scrollTop; FI.open = +b.dataset.i; renderFicha(); }; });
  box.querySelectorAll('.ficwith [data-ver]').forEach(b => { const p = photosOf(b.dataset.ver)[0]; if (p) thumbAny(b.querySelector('img'), p.it); });
  box.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { FI.filt = b.dataset.f; FI.scroll = box.parentElement.scrollTop; renderFicha(); });
  if ($('#fic_st')) $('#fic_st').onchange = e => { FI.st = e.target.value; FI.scroll = box.parentElement.scrollTop; renderFicha(); };
  box.querySelectorAll('[data-st]').forEach(b => b.onclick = () => { FI.st = b.dataset.st; FI.filt = 'T'; renderFicha(); });
  box.querySelectorAll('.indtl circle[data-key]').forEach(c => c.onclick = () => { FI.filt = 'T'; FI.st = ''; FI.open = ficList(id).findIndex(q => phKey(q) === c.dataset.key); renderFicha(); });
  box.querySelectorAll('[data-ver]').forEach(b => b.onclick = () => openFicha(b.dataset.ver));
  box.querySelectorAll('[data-join]').forEach(b => b.onclick = () => mergeInd(id, b.dataset.join));
  box.querySelectorAll('[data-undo]').forEach(b => b.onclick = () => undoMerge(id, +b.dataset.undo));
  ficForm(id, ph);
}
function ficForm(id, ph) { const rec = S.ind.list[id], col = $('#indcol'), kids = Object.keys(S.ind.list).filter(k => S.ind.list[k].madre === id).sort();
  const fl = [...new Set(photosOf(id).map(p => p.o.fl))];
  col.innerHTML = `<p class="mu idsub">${esc(rec.sp)} · ${fl.includes('A') || (fl.includes('I') && fl.includes('D')) ? 'los dos lados conocidos' : fl.includes('I') ? 'solo se conoce el lado izquierdo' : fl.includes('D') ? 'solo se conoce el lado derecho' : 'sin lado anotado'}</p>
    <div class="form indform"><label>Nombre <input data-k="nombre"></label><div class="two"><label>Sexo <select data-k="sexo"><option value="">Sin dato</option><option>Macho</option><option>Hembra</option></select></label><label>Edad <select data-k="edad"><option value="">Sin dato</option>${EDADES.map(e => `<option>${e}</option>`).join('')}</select></label></div>
    ${rec.edad === 'Cría' ? `<label>Es cría de <select data-k="madre"><option value="">No se sabe</option>${Object.keys(S.ind.list).filter(k => k !== id && S.ind.list[k].sexo === 'Hembra' && norm(S.ind.list[k].sp) === norm(rec.sp)).sort().map(k => `<option>${esc(k)}</option>`).join('')}</select></label>` : rec.sexo === 'Hembra' ? `<label class="chk indcr"><input type="checkbox" id="ind_cr" ${rec.crias ? 'checked' : ''}> Se ha visto con crías</label>` : ''}
    ${kids.length ? `<p class="hint tiny">Crías en el catálogo: ${kids.map(k => `<button class="lnk2" data-ver="${esc(k)}">${esc(k)}</button>`).join(', ')}</p>` : ''}
    <label>Marcas distintivas <input data-k="marcas" placeholder="p. ej. cicatriz en la oreja izquierda"></label><label>Notas <input data-k="notas"></label></div>
    <div class="indact"><button id="ind_png"><i class="ic">${icon('download')}</i>Foto con rosetas…</button><button id="ind_cmp"><i class="ic">${icon('split')}</i>Comparar con otro…</button><button id="ind_print"><i class="ic">${icon('sheet')}</i>Imprimir ficha…</button><button id="ind_join"><i class="ic">${icon('ind')}</i>Unir otro individuo a ${esc(id)}…</button>${ph.length ? '' : `<button id="ind_del" class="danger"><i class="ic">${icon('x')}</i>Quitar del catálogo</button>`}</div>`;
  col.querySelectorAll('[data-k]').forEach(inp => { inp.value = rec[inp.dataset.k] || ''; inp.onchange = () => { rec[inp.dataset.k] = inp.value.trim(); if (!rec[inp.dataset.k] && ['edad', 'madre'].includes(inp.dataset.k)) delete rec[inp.dataset.k]; indTouch(); saveReg(); $('#h_ind').textContent = `${id}${rec.nombre ? ' «' + rec.nombre + '»' : ''}`; if (!$('#pind').hidden) renderIndPane(); if (['sexo', 'edad'].includes(inp.dataset.k)) ficForm(id, ph); }; });
  if ($('#ind_cr')) $('#ind_cr').onchange = e => { if (e.target.checked) rec.crias = 1; else delete rec.crias; indTouch(); saveReg(); };
  col.querySelectorAll('[data-ver]').forEach(b => b.onclick = () => openFicha(b.dataset.ver));
  $('#ind_png').onclick = () => { const l = ['I', 'D'].map(f => bestRef(id, f)).filter(Boolean); if (!l.length) return toast(`${id} no tiene fotos de un lado.`, 3000); exportCard(id, l.find(p => (p.o.tr || []).length) || l[0]); };
  $('#ind_cmp').onclick = () => openCompare(id);
  $('#ind_print').onclick = () => openPrint([id]);
  $('#ind_join').onclick = () => { const v = (prompt(`Código del individuo que se une a ${id} (sus fotos pasan a ${id}):`) || '').trim(); if (v) mergeInd(id, v); };
  if ($('#ind_del')) $('#ind_del').onclick = () => { if (!confirm(`¿Quitar ${id} del catálogo? No tiene fotos.`)) return; delete S.ind.list[id]; indTouch(); saveReg(); closeOver(); renderIndPane(); }; }
function ficPhoto(id) { const L = ficList(id); FI.open = Math.max(0, Math.min(FI.open, L.length - 1)); const p = L[FI.open], tok = ++FI.tok, rec = S.ind.list[id]; FI.cur = p;
  $('#indst').classList.add('view'); $('#indcard').hidden = true; $('#ind_v').hidden = false; ['#ind_pv', '#ind_nx', '#ind_cl'].forEach(q => $(q).hidden = false); $('#ind_pv').disabled = $('#ind_nx').disabled = L.length < 2;
  if (!FI.ed) FI.ed = CanvasEd($('#ind_v'), { tools: ['pan', 'pen', 'erase', '|', 'undo', 'redo', '|', 'eye', 'color', '|', 'fit'], onchange: (d, colorOnly) => { const q = FI.cur; if (!q || colorOnly) return; q.o.tr = d.tr.map(t => t.slice()); if (!q.o.tr.length) delete q.o.tr; if (q.ext) indTouch(); saveReg(); ficPhotoCol(id); } });
  FI.ed.set(null, [], 'Cargando…'); bitmapOf(p).then(b => { if (tok === FI.tok) FI.ed.set(b, (p.o.tr || []).map(t => t.slice()), `${id} · ${p.ext ? 'referencia importada' : (p.it.origName || p.it.name)}`); }).catch(e => { if (tok === FI.tok) FI.ed.set(null, [], 'No se pudo abrir: ' + e.message); });
  ficPhotoCol(id); }
function ficPhotoCol(id) { const L = ficList(id), p = FI.cur, rec = S.ind.list[id], col = $('#indcol'), fl = FL[p.o.fl] || 'sin anotar';
  const filt = { T: 'todas las fotos', I: 'lado izquierdo', D: 'lado derecho', R: 'con rosetas', U: 'dudosas' }[FI.filt] + (FI.st ? ' · ' + FI.st : '');
  col.innerHTML = `<p class="indvt"><b>Foto ${FI.open + 1} de ${L.length}</b> · ${esc(filt)}</p><div class="phstrip mini" id="fic_strip"></div>
    <dl class="ficinfo">${p.ext ? `<dt>Imagen</dt><dd>Referencia importada</dd>` : `<dt>Archivo</dt><dd>${esc(p.it.origName || p.it.name)}</dd><dt>Estación</dt><dd>${esc(station(p.it))}</dd><dt>Fecha y hora</dt><dd>${esc(phWhen(p))}</dd>`}<dt>Lado</dt><dd>${esc(fl)}</dd>${p.o.q ? `<dt>Claridad</dt><dd>${QL[p.o.q]}</dd>` : ''}<dt>Rosetas</dt><dd>${(p.o.tr || []).length ? p.o.tr.length + ' calcada(s)' : 'sin calcar · usa el lápiz'}</dd>${p.o.rc ? `<dt>Coincidieron</dt><dd>${esc(p.o.rc)}</dd>` : ''}${p.o.dud && !p.o.iv ? '<dt>Estado</dt><dd class="pe">Dudosa</dd>' : p.o.iv ? '<dt>Estado</dt><dd>Confirmada</dd>' : ''}</dl>
    <div class="indact">${p.ext ? '' : `<button id="fp_ref">${p.o.ref ? '★ Es referencia' : '☆ Usar como referencia'}${FL[p.o.fl] ? ' del lado ' + FL[p.o.fl].toLowerCase() : ''}</button>`}${p.o.dud && !p.o.iv ? `<button id="fp_ok"><i class="ic">${icon('ind')}</i>Confirmar que es ${esc(id)}</button>` : ''}<button id="fp_png"><i class="ic">${icon('download')}</i>Foto con rosetas…</button>${p.ext ? '' : `<button id="fp_vis"><i class="ic">${icon('image')}</i>Abrir en el visor</button>`}<button id="fp_out"><i class="ic">${icon('x')}</i>${p.ext ? 'Quitar esta referencia' : 'Quitar de ' + esc(id)}</button></div>
    <span class="sp"></span><p class="hint tiny">← → para recorrer · Esc para volver a la ficha · la rueda acerca la foto · P calca rosetas</p>`;
  phStrip($('#fic_strip'), L, q => phKey(q) === phKey(p), q => { FI.open = L.indexOf(q); ficPhoto(id); });
  if ($('#fp_ref')) $('#fp_ref').onclick = () => { if (p.o.ref) delete p.o.ref; else { for (const q of indPhotos(id)) if (q.o.fl === p.o.fl && q.o !== p.o) delete q.o.ref; p.o.ref = 1; } saveReg(); ficPhotoCol(id); };
  if ($('#fp_ok')) $('#fp_ok').onclick = () => { delete p.o.dud; p.o.iv = 'sí'; saveReg(); refreshCards([p.it]); if (!$('#pind').hidden) renderIndPane(); ficPhotoCol(id); toast('Confirmada.', 2000); };
  $('#fp_png').onclick = () => exportCard(id, p);
  if ($('#fp_vis')) $('#fp_vis').onclick = () => { closeOver(true); show(p.it); };
  $('#fp_out').onclick = () => { if (p.ext) { if (!confirm(`¿Quitar esta referencia importada de ${id}? La imagen se queda en la carpeta «${REFD}».`)) return; const k = +phKey(p).split(':').pop(); rec.refs.splice(k, 1); if (!rec.refs.length) delete rec.refs; indTouch(); }
    else { if (!confirm(`¿Quitar esta foto de ${id}? Queda sin identificar.`)) return; delete p.o.id; delete p.o.ref; delete p.o.dud; delete p.o.iv; refreshCards([p.it]); }
    saveReg(); if (!ficList(id).length) FI.open = -1; renderFicha(); }; }
function ficMove(d) { const L = ficList(S.fichaId); if (L.length < 2) return; FI.open = (FI.open + d + L.length) % L.length; ficPhoto(S.fichaId); }
$('#ind_pv').onclick = () => ficMove(-1); $('#ind_nx').onclick = () => ficMove(1); $('#ind_cl').onclick = () => { FI.open = -1; renderFicha(); };
addEventListener('keydown', e => { // 1.4.17: ← → recorren las fotos del individuo; Esc vuelve a la ficha (sin cerrarla)
  if ($('#inddlg').hidden || FI.open < 0 || [...document.querySelectorAll('.over')].some(o => !o.hidden && o !== $('#inddlg') && $('#inddlg').compareDocumentPosition(o) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
  if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ficMove(e.key === 'ArrowRight' ? 1 : -1); else if (e.key === 'Escape') { FI.open = -1; renderFicha(); } else return;
  e.preventDefault(); e.stopImmediatePropagation(); }, true);
function sortIndFolders() { // 1.4.14: para las fotos identificadas antes de que existieran las subcarpetas
  const l = S.items.filter(it => it.cat && !it.tagOnly && it.parts[0] === ROOT && it.parts.join('/') !== [ROOT, folder(it.cat), ...(indOf(it) ? [indOf(it)] : [])].join('/'));
  if (!l.length) return toast('Todas las fotos ya están en la carpeta de su individuo.', 3000);
  if (noMove()) return toast('En este modo las fotos no se mueven.', 3000);
  if (!confirm(`Se moverán ${l.length} foto(s) a la carpeta de su individuo, dentro de Clasificadas/<Especie>/ de su estación. ¿Continuar?`)) return;
  locked(() => indFolders(l)).then(ok => { refreshCards(l); if (ok) toast(`${l.length} foto(s) ordenadas en carpetas por individuo.`, 4000); });
}
function mergeInd(to, from) {
  if (!S.ind.list[from] || to === from) return toast(`«${from}» no está en el catálogo.`, 3000);
  const ph = indPhotos(from); if (!confirm(`¿Unir ${from} (${ph.length} foto(s)) dentro de ${to}? Las fotos de ${from} pasan a ${to}. Se puede deshacer desde la ficha de ${to}.`)) return;
  if (S.busy) return toast('Espera: todavía se está moviendo una foto…', 2000);
  const rec = S.ind.list[to]; for (const p of ph) p.o.id = to;
  const old = S.ind.list[from]; delete S.ind.list[from]; if ((old.refs || []).length) rec.refs = [...(rec.refs || []), ...old.refs]; indTouch(); // 1.4.15: sus referencias importadas también
  locked(() => indFolders(ph.map(p => p.it))).then(() => { // 1.4.14: las fotos pasan a la carpeta de «to»; se anotan con su ruta nueva para poder deshacer
    (rec.merges = rec.merges || []).push({ from, rec: old, photos: ph.map(p => pathOf(p.it) + '|' + p.c), fecha: ymd(Date.now()) }); saveReg();
    refreshCards(ph.map(p => p.it)); S.fichaId = to; renderFicha(); if (!$('#pind').hidden) renderIndPane(); toast(`${from} unido a ${to}: ${ph.length} foto(s).`, 4000); });
}
function undoMerge(to, k) {
  if (S.busy) return toast('Espera: todavía se está moviendo una foto…', 2000);
  const rec = S.ind.list[to], m = rec && rec.merges && rec.merges[k]; if (!m) return;
  if (S.ind.list[m.from]) return toast(`${m.from} ya existe otra vez en el catálogo; no se puede deshacer.`, 5000);
  const set = new Set(m.photos), touched = []; let n = 0;
  for (const it of S.items) for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (o && o.id === to && set.has(pathOf(it) + '|' + c)) { o.id = m.from; n++; touched.push(it); } }
  S.ind.list[m.from] = m.rec; if ((m.rec.refs || []).length && rec.refs) { rec.refs = rec.refs.filter(r => !m.rec.refs.some(x => x.file === r.file && x.st === r.st)); if (!rec.refs.length) delete rec.refs; } rec.merges.splice(k, 1); indTouch(); saveReg(); locked(() => indFolders(touched)).then(() => { refreshCards(touched); renderFicha(); if (!$('#pind').hidden) renderIndPane(); }); // 1.4.14: vuelven a la carpeta de m.from
  toast(`Unión deshecha: ${n} foto(s) volvieron a ${m.from}${n < m.photos.length ? ` (${m.photos.length - n} ya no estaban en el mismo lugar)` : ''}.`, 5000);
}

/* ---------- Imprimir (o guardar como PDF) la ficha o el catálogo (1.4.17: elegir fotos, con o sin rosetas, columnas, tamaño, hoja y secciones) ---------- */
const PRINC = [['datos', 'Datos (sexo, edad, crías, marcas)'], ['resumen', 'Resumen en números'], ['pie', 'Pie de cada foto (estación, fecha, lado)'], ['tl', 'Dónde y cuándo apareció'], ['est', 'Tabla de estaciones'], ['hrs', 'Actividad por hora'], ['with', 'Visto con'], ['notas', 'Notas']];
const PRO = Object.assign({ tr: true, color: 0, num: true, cols: 2, size: 'M', page: 'Carta', orient: 'V', q: 'best', inc: { datos: 1, resumen: 1, pie: 1, tl: 1, est: 1, hrs: 0, with: 0, notas: 1 } }, ls('bt_pri', {}));
const PRI = { ids: [], many: false, sel: {}, tok: 0 };
const priSave = () => sv('bt_pri', PRO);
function priQuick(id, q) { const all = photosOf(id); return (q === 'best' ? ['I', 'D'].map(f => photosOf(id, f)[0]).filter(Boolean).filter((p, i, a) => a.findIndex(x => phKey(x) === phKey(p)) === i)
  : q === 'ref' ? all.filter(p => p.o.ref || p.ext) : q === 'tr' ? all.filter(p => (p.o.tr || []).length) : q === 'all' ? all : []).map(phKey); }
function openPrint(ids, many) { ids = ids.filter(k => S.ind.list[k]); if (!ids.length) return toast('El catálogo está vacío.', 3000);
  PRI.ids = ids; PRI.many = !!many || ids.length > 1; PRI.one = ids[0]; PRI.sel = {}; openOver('#pridlg'); priRender(); }
function priPhotos(id) { if (!PRI.many && !PRI.sel[id]) PRI.sel[id] = priQuick(id, PRO.q); const keys = PRI.many ? priQuick(id, PRO.q) : PRI.sel[id], all = [...extRefs(id), ...indPhotos(id)];
  return keys.map(k => all.find(p => phKey(p) === k)).filter(Boolean); }
function priPage(id) { const rec = S.ind.list[id], ph = indPhotos(id), ts = ph.filter(p => goodTs(p.it)).map(p => fixTs(p.it)).sort((a, b) => a - b), sts = new Map(), I = PRO.inc;
  for (const p of ph) { const s = station(p.it), r = sts.get(s) || { n: 0, t0: Infinity, t1: -Infinity }; r.n++; if (goodTs(p.it)) { r.t0 = Math.min(r.t0, fixTs(p.it)); r.t1 = Math.max(r.t1, fixTs(p.it)); } sts.set(s, r); }
  const fl = [...new Set(photosOf(id).map(p => p.o.fl))], sel = priPhotos(id);
  let h = `<header><div><h1>${esc(id)}${rec.nombre ? ' «' + esc(rec.nombre) + '»' : ''}</h1><p>${esc(rec.sp)}${rec.sexo ? ' · ' + esc(rec.sexo.toLowerCase()) : ''}${rec.edad ? ' ' + esc(rec.edad.toLowerCase()) : ''}${rec.crias ? ' · se ha visto con crías' : ''}${rec.madre ? ' · cría de ' + esc(rec.madre) : ''}</p></div><p class="prm">${esc(projName())}<br>${ymd(Date.now())} · BioTrampa</p></header>`;
  if (I.datos) h += `<table class="prd"><tr><th>Sexo</th><td>${esc(rec.sexo || 'Sin dato')}</td><th>Edad</th><td>${esc(rec.edad || 'Sin dato')}</td></tr><tr><th>Lados conocidos</th><td>${fl.includes('A') || (fl.includes('I') && fl.includes('D')) ? 'izquierdo, derecho' : fl.includes('I') ? 'izquierdo' : fl.includes('D') ? 'derecho' : 'sin dato'}</td><th>Marcas</th><td>${esc(rec.marcas || '—')}</td></tr></table>`;
  if (I.resumen) h += `<p class="prr">${ph.length} foto(s) · ${new Set(ts.map(t => ymd(t))).size} día(s) con registro · ${sts.size} estación(es)${ts.length ? ` · del ${ymd(ts[0])} al ${ymd(ts[ts.length - 1])}` : ''}</p>`;
  h += sel.length ? `<div class="prg c${PRO.cols} s${PRO.size}">${sel.map(p => `<figure data-key="${esc(phKey(p))}"><div class="primg"></div>${I.pie ? `<figcaption>${[FL[p.o.fl] ? 'Lado ' + FL[p.o.fl].toLowerCase() : '', p.ext ? 'referencia importada' : station(p.it), p.ext ? '' : phWhen(p).slice(0, 10), p.o.ref ? 'referencia' : ''].filter(Boolean).map(esc).join(' · ')}</figcaption>` : ''}</figure>`).join('')}</div>` : '';
  if (I.tl && ts.length) h += `<h2>Dónde y cuándo apareció</h2>${indTimeline(ph).replace(/<p class="hint tiny">.*<\/p>$/, '')}`;
  if (I.est && sts.size) h += `<h2>Estaciones</h2><table class="prt"><tr><th>Estación</th><th>Fotos</th><th>Primera</th><th>Última</th></tr>${[...sts].sort((a, b) => a[0] < b[0] ? -1 : 1).map(([s, r]) => `<tr><td>${esc(s)}</td><td>${r.n}</td><td>${isFinite(r.t0) ? ymd(r.t0) : '—'}</td><td>${isFinite(r.t1) ? ymd(r.t1) : '—'}</td></tr>`).join('')}</table>`;
  if (I.hrs && ts.length) { const hr = new Array(24).fill(0); ts.forEach(t => hr[new Date(t).getHours()]++); const mx = Math.max(1, ...hr); h += `<h2>Actividad por hora</h2><div class="indhrs prh">${hr.map(v => `<i style="height:${Math.round(v / mx * 100)}%"></i>`).join('')}</div><p class="prs">0 a 23 h</p>`; }
  if (I.with) { const w = seenWith(id); h += `<h2>Visto con</h2><p>${w.length ? w.slice(0, 10).map(x => esc(x.id) + (x.rel ? ` (${x.rel})` : x.n ? ` (${x.n} vez/veces)` : '')).join(', ') : 'Con ningún otro individuo.'}</p>`; }
  if (I.notas) h += `<h2>Notas</h2>${rec.notas ? `<p>${esc(rec.notas)}</p>` : ''}<p class="prn"></p>`;
  return h; }
function priRender() { const scr = $('#pri_col').closest('.idcol').scrollTop, tok = ++PRI.tok, ids = PRI.many ? PRI.ids : [PRI.one], prev = $('#pri_prev'), col = $('#pri_col'), all = Object.keys(S.ind.list).sort();
  $('#pri_sub').textContent = PRI.many ? `${ids.length} individuo(s), uno por página` : `${PRI.one}${S.ind.list[PRI.one].nombre ? ' «' + S.ind.list[PRI.one].nombre + '»' : ''}`;
  prev.innerHTML = ids.map(id => `<div class="prpage${PRO.orient === 'H' ? ' h' : ''}${PRO.page === 'A4' ? ' a4' : ''}" data-id="${esc(id)}">${priPage(id)}</div>`).join('');
  const jobs = [];
  prev.querySelectorAll('.prpage').forEach(pg => { const id = pg.dataset.id, list = [...extRefs(id), ...indPhotos(id)];
    pg.querySelectorAll('figure[data-key]').forEach(f => { const p = list.find(q => phKey(q) === f.dataset.key); if (!p) return;
      jobs.push(baseCanvas(p, PRO.size === 'L' || PRO.cols === 1 ? 1800 : 1200).then(bc => { if (tok === PRI.tok) f.querySelector('.primg').appendChild(tracedCanvas(bc, p.o.tr, { tr: PRO.tr, color: TRC[PRO.color], num: PRO.num })); }).catch(() => f.querySelector('.primg').classList.add('bad'))); }); });
  PRI.ready = Promise.all(jobs);
  const seg = (k, opts) => `<div class="idseg${opts.length === 3 ? ' c3' : ''}" data-o="${k}">${opts.map(([v, t]) => `<button data-v="${v}" class="${String(PRO[k]) === String(v) ? 'on' : ''}">${t}</button>`).join('')}</div>`;
  col.innerHTML = `<p class="idk">Individuos</p><div class="idseg" id="pri_m"><button data-v="0" class="${PRI.many ? '' : 'on'}">Este individuo</button><button data-v="1" class="${PRI.many ? 'on' : ''}">Varios</button></div>
    ${PRI.many ? `<div class="pripk">${all.map(k => `<label class="chk"><input type="checkbox" data-id="${esc(k)}" ${PRI.ids.includes(k) ? 'checked' : ''}> ${esc(k)}${S.ind.list[k].nombre ? ' «' + esc(S.ind.list[k].nombre) + '»' : ''}</label>`).join('')}</div>` : `<label class="idfld">Individuo<select id="pri_id">${all.map(k => `<option ${k === PRI.one ? 'selected' : ''} value="${esc(k)}">${esc(k)}${S.ind.list[k].nombre ? ' «' + esc(S.ind.list[k].nombre) + '»' : ''}</option>`).join('')}</select></label>`}
    <p class="idk">Fotos${PRI.many ? ' (para todos)' : ` · ${(PRI.sel[PRI.one] || []).length} elegida(s)`}</p><div class="priq">${[['best', 'La mejor de cada lado'], ['ref', 'Referencias'], ['tr', 'Con rosetas'], ['all', 'Todas'], ['none', 'Ninguna']].map(([v, t]) => `<button data-q="${v}" class="${PRI.many && PRO.q === v ? 'on' : ''}">${t}</button>`).join('')}</div>${PRI.many ? '' : '<div class="phstrip pick" id="pri_ph"></div>'}
    <p class="idk">Rosetas</p>${seg('tr', [[true, 'Con rosetas'], [false, 'Sin rosetas']])}${PRO.tr ? `<div class="pric">${TRC.map((c, i) => `<button data-c="${i}" title="Color del trazo" style="background:${c}" class="${PRO.color === i ? 'on' : ''}"></button>`).join('')}<label class="chk"><input type="checkbox" id="pri_num" ${PRO.num ? 'checked' : ''}> Números</label></div>` : ''}
    <div class="idrow2"><div><p class="idk">Fotos por fila</p>${seg('cols', [[1, '1'], [2, '2'], [3, '3']])}</div><div><p class="idk">Tamaño</p>${seg('size', [['S', 'Chica'], ['M', 'Media'], ['L', 'Grande']])}</div></div>
    <div class="idrow2"><div><p class="idk">Hoja</p>${seg('page', [['Carta', 'Carta'], ['A4', 'A4']])}</div><div><p class="idk">Orientación</p>${seg('orient', [['V', 'Vertical'], ['H', 'Horizontal']])}</div></div>
    <p class="idk">Incluir</p><div class="priinc">${PRINC.map(([k, t]) => `<label class="chk"><input type="checkbox" data-inc="${k}" ${PRO.inc[k] ? 'checked' : ''}> ${t}</label>`).join('')}</div>`;
  $('#pri_m').querySelectorAll('button').forEach(b => b.onclick = () => { PRI.many = b.dataset.v === '1'; if (PRI.many && PRI.ids.length < 2) PRI.ids = all.filter(k => norm(S.ind.list[k].sp) === norm(S.ind.list[PRI.one].sp)); priRender(); });
  col.querySelectorAll('[data-id]').forEach(i => i.onchange = () => { PRI.ids = [...col.querySelectorAll('[data-id]:checked')].map(x => x.dataset.id); if (!PRI.ids.length) PRI.ids = [PRI.one]; priRender(); });
  if ($('#pri_id')) $('#pri_id').onchange = e => { PRI.one = e.target.value; priRender(); };
  col.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { PRO.q = b.dataset.q; priSave(); if (!PRI.many) PRI.sel[PRI.one] = priQuick(PRI.one, PRO.q); priRender(); });
  if (!PRI.many) { const L = ficAll(PRI.one), S0 = PRI.sel[PRI.one]; phStrip($('#pri_ph'), L, p => S0.includes(phKey(p)), p => { const k = phKey(p), i = S0.indexOf(k); if (i >= 0) S0.splice(i, 1); else S0.push(k); priRender(); }); }
  col.querySelectorAll('[data-o]').forEach(g => g.querySelectorAll('button').forEach(b => b.onclick = () => { const k = g.dataset.o, v = b.dataset.v; PRO[k] = k === 'tr' ? v === 'true' : k === 'cols' ? +v : v; priSave(); priRender(); }));
  col.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { PRO.color = +b.dataset.c; priSave(); priRender(); });
  if ($('#pri_num')) $('#pri_num').onchange = e => { PRO.num = e.target.checked; priSave(); priRender(); };
  col.querySelectorAll('[data-inc]').forEach(i => i.onchange = () => { PRO.inc[i.dataset.inc] = i.checked ? 1 : 0; priSave(); priRender(); }); col.closest('.idcol').scrollTop = scr; }
$('#pri_go').onclick = async () => { toast('Preparando la impresión…', 0); await PRI.ready; const box = $('#printind'), cl = $('#pri_prev').cloneNode(true), src = [...$('#pri_prev').querySelectorAll('canvas')];
  cl.querySelectorAll('canvas').forEach((c, i) => { const im = document.createElement('img'); im.src = src[i].toDataURL('image/jpeg', .9); im.alt = ''; c.replaceWith(im); });
  box.innerHTML = ''; box.append(...cl.childNodes); await Promise.all([...box.querySelectorAll('img')].map(i => i.decode().catch(() => {})));
  let st = $('#pri_css'); if (!st) { st = document.createElement('style'); st.id = 'pri_css'; document.head.appendChild(st); } st.textContent = `@page{size:${PRO.page === 'A4' ? 'A4' : 'letter'} ${PRO.orient === 'H' ? 'landscape' : 'portrait'};margin:12mm}`;
  $('#toast').hidden = true; document.body.classList.add('printind'); print();
  setTimeout(() => { document.body.classList.remove('printind'); box.innerHTML = ''; st.textContent = ''; }, 1000); };
function printInd(ids) { openPrint(ids, ids.length > 1); } // nombre anterior

/* ---------- Resumen: sección «Individuos» ---------- */
function indSummaryHtml() {
  const by = new Map();
  for (const it of sumData.its) for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (!o || !o.id) continue; if (!by.has(o.id)) by.set(o.id, { c, days: new Set(), st: new Map() });
    const r = by.get(o.id); if (goodTs(it)) r.days.add(ymd(fixTs(it))); r.st.set(station(it), (r.st.get(station(it)) || 0) + 1); }
  if (!by.size) return xsec('ss-ind', 'Individuos', 'Individuos identificados por sus marcas', `<p class="hint tiny">Todavía no hay individuos identificados. Especies con identificación: ${esc(S.indSp.join(', ') || 'ninguna')} (se cambia en el panel «Individuos»).</p>`);
  const ids = [...by.keys()].sort(), sts = sumData.stations.filter(s => ids.some(id => by.get(id).st.has(s))), rec = ids.filter(id => by.get(id).days.size >= 2).length;
  return xsec('ss-ind', 'Individuos', 'Individuos identificados por sus marcas',
    `<p class="sumhead"><b>${ids.length}</b> individuo(s) identificado(s) · <b>${rec}</b> recapturado(s) (vistos en 2 días o más)</p><div class="tw"><table class="st"><thead><tr><th>Individuo</th><th>Especie</th>${sts.map(s => `<th>${esc(s)}</th>`).join('')}<th>Días con registro</th></tr></thead><tbody>`
    + ids.map(id => { const r = by.get(id); return `<tr><td>${esc(id)}</td><td>${esc(r.c)}</td>${sts.map(s => `<td>${r.st.get(s) || '<span class="mu">—</span>'}</td>`).join('')}<td>${r.days.size}</td></tr>`; }).join('')
    + `</tbody></table></div><p class="hint tiny">Números: fotos de cada individuo en cada estación. La historia de captura para secr y la tabla para camtrapR están en Exportar.</p>`);
}

/* ---------- Exportes de individuos ---------- */
async function exportIndRecords(keep, tag = '') {
  if (!S.items.length) return toast('Abre una carpeta primero.'); await prepare(true);
  const rows = [['Station', 'Camera', 'Species', 'Individual', 'DateTimeOriginal', 'Date', 'Time', 'Flank', 'Quality', 'Directory', 'FileName', 'Sex', 'Age', 'WithCubs']]; // 1.4.15: sexo, edad y crías al final
  for (const it of S.items) { if (!goodTs(it)) continue; const t = fixTs(it);
    for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (o && o.id && (!keep || keep(o, c))) rows.push([station(it), camOf(it), c, o.id, `${ymd(t)} ${hms(t)}`, ymd(t), hms(t), FL[o.fl] || '', QL[o.q] || '', [it.src.name, ...it.parts].join('/'), it.name, ...(r => [r.sexo || '', r.edad || '', r.crias ? 'yes' : ''])(S.ind.list[o.id] || {})]); } }
  if (rows.length < 2) return toast('No hay fotos con individuo identificado y fecha.', 4000);
  download(new Blob([plainCsv(rows)], { type: 'text/csv;charset=utf-8' }), `registros_individuos_camtrapR${tag}_${ymd(Date.now())}.csv`);
  toast(`Registros de individuos: ${rows.length - 1} fila(s). En camtrapR úsala como recordTableIndividual en spatialDetectionHistory(…, individualCol = "Individual"), junto con la tabla de estaciones (CTtable).`, 10000);
}
async function exportSecr(sp, occ, keep, tag = '', note = '') { // historia de captura para captura-recaptura espacial (paquete secr de R)
  if (!sp) return toast('Elige la especie en Exportar.', 3000); if (!(await missingOk('Historia de captura (secr)', ['fechas', 'gps']))) return;
  const sts = [...new Set(S.items.map(station))].sort().filter(s => stCoords(s) && trapDays(s).start), td = Object.fromEntries(sts.map(s => [s, trapDays(s)]));
  if (!sts.length) return toast('Se necesitan estaciones con coordenadas y fechas.', 5000);
  const t0 = Math.min(...sts.map(s => Date.parse(td[s].start))), t1 = Math.max(...sts.map(s => Date.parse(td[s].end))), nOcc = Math.ceil((Math.round((t1 - t0) / DAY) + 1) / occ);
  const cs = sts.map(s => stCoords(s)), lat0 = cs.reduce((a, c) => a + c[0], 0) / cs.length, lon0 = cs.reduce((a, c) => a + c[1], 0) / cs.length;
  const traps = ['# Detector x y usage   (x, y en metros: proyección local aproximada; usage: 1 = la cámara funcionó en esa ocasión, 0 = no)'];
  sts.forEach((s, i) => { const x = (cs[i][1] - lon0) * Math.cos(lat0 * RAD) * 111320, y = (cs[i][0] - lat0) * 110540, a = Date.parse(td[s].start), b = Date.parse(td[s].end), dn = downSet(s); let u = '';
    for (let k = 0; k < nOcc; k++) { let op = 0; for (let j = 0; j < occ; j++) { const t = t0 + (k * occ + j) * DAY; if (t >= a && t <= b && !dn.has(isoDay(t))) op++; } u += op ? '1' : '0'; }
    traps.push(`${depId(s)} ${x.toFixed(1)} ${y.toFixed(1)} ${u}`); });
  const caps = ['# Session ID Occasion Detector'], seen = new Set(), sess = depId(projName()) || 'sesion1';
  for (const it of S.items) { if (!hasCat(it, sp) || !goodTs(it) || suspect(it)) continue; const o = it.obs && it.obs[sp]; if (!o || !o.id || (keep && !keep(o, sp))) continue; const s = station(it); if (!sts.includes(s)) continue;
    const k = Math.floor((Date.parse(ymd(fixTs(it))) - t0) / DAY / occ); if (k < 0 || k >= nOcc) continue; const key = o.id + '|' + k + '|' + s; if (seen.has(key)) continue; seen.add(key); caps.push(`${sess} ${depId(o.id)} ${k + 1} ${depId(s)}`); }
  if (caps.length < 2) return toast(`No hay fotos de ${sp} con individuo identificado dentro de las fechas de las estaciones.`, 5000);
  const leeme = `Historia de captura de ${sp} para el paquete secr de R (BioTrampa, ${ymd(Date.now())}).\r\n\r\ntraps.txt: una fila por estación (detector) con x, y en metros (proyección local aproximada alrededor del centro de las estaciones; para áreas grandes conviene usar UTM) y la columna usage (1 = funcionó en la ocasión, 0 = no funcionó, incluidos los días sin funcionar).\r\ncaptures.txt: una fila por individuo, ocasión y estación donde se detectó.\r\nOcasiones de ${occ} día(s): ${nOcc} en total, desde ${isoDay(t0)}.\r\n\r\nEn R (revisa el resultado de summary antes de ajustar modelos):\r\n  library(secr)\r\n  ch <- read.capthist("captures.txt", "traps.txt", detector = "proximity", fmt = "trapID")\r\n  summary(ch)\r\n\r\n${note || 'Ojo: si algunos individuos solo se conocen por un lado, el mismo animal podría contarse dos veces (uno por cada lado). Revisa la ficha de cada individuo en BioTrampa.'}\r\n`;
  download(zipStore([['traps.txt', traps.join('\n') + '\n'], ['captures.txt', caps.join('\n') + '\n'], ['LEEME.txt', leeme]]), `secr_${depId(sp)}${tag}_${occ}d_${ymd(Date.now())}.zip`);
  toast(`Historia de captura de ${sp}: ${new Set(caps.slice(1).map(l => l.split(' ')[1])).size} individuo(s), ${caps.length - 1} detección(es), ${sts.length} estación(es), ${nOcc} ocasiones. Instrucciones en LEEME.txt.`, 9000);
}
function exportCatalog() {
  const fotos = []; for (const it of S.items) for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (o && o.id) fotos.push({ estacion: station(it), archivo: it.origName || it.name, fecha: it.meta && it.meta.date ? it.meta.date + ' ' + it.meta.time : '', especie: c, individuo: o.id, flanco: FL[o.fl] || '', calidad: QL[o.q] || '', referencia: !!o.ref }); }
  if (!Object.keys(S.ind.list).length) return toast('El catálogo está vacío.', 3000);
  download(new Blob([JSON.stringify({ app: 'BioTrampa', tipo: 'catalogo de individuos', proyecto: projName(), fecha: ymd(Date.now()), especies: S.indSp, individuos: S.ind.list, fotos }, null, 2)], { type: 'application/json' }), `catalogo_individuos_${depId(projName())}_${ymd(Date.now())}.json`);
  toast(`Catálogo exportado: ${Object.keys(S.ind.list).length} individuo(s) y la lista de sus fotos (sin imágenes).`, 5000);
}
$('#fileind').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return; let j; try { j = JSON.parse(await f.text()); } catch (x) { return toast('El archivo no es un catálogo válido.', 4000); }
  if (!j || (j.tipo !== 'catalogo de individuos' && !j.list)) return toast('El archivo no es un catálogo de individuos de BioTrampa.', 4000);
  const r = mergeCatalog(j); saveReg(); renderIndPane(); toast(`Catálogo importado: ${r.add} individuo(s) nuevo(s); ${r.same} ya existían y se conservaron los tuyos. Las fotos no cambian.`, 7000);
};
/* Antes de exportar: qué lado entra (para no contar dos veces al mismo animal) y si entran las dudosas */
const IXM = { I: ['Lado izquierdo', '_izq'], D: ['Lado derecho', '_der'], B: ['Dos lados conocidos', '_2lados'], T: ['Todos', ''] };
function indSides(sp) { const m = new Map(); // de cada individuo: qué lados se conocen
  for (const it of S.items) for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (!o || !o.id || (sp && norm(c) !== norm(sp))) continue;
    if (!m.has(o.id)) m.set(o.id, { I: 0, D: 0 }); const r = m.get(o.id); if (o.fl === 'I' || o.fl === 'A') r.I = 1; if (o.fl === 'D' || o.fl === 'A') r.D = 1; }
  return m; }
function indKeep(mode, dud, sides) { // qué fotos entran según el lado elegido; las dudosas sin confirmar solo si se piden
  return o => (dud || !o.dud || o.iv) && (mode === 'T' || (mode === 'I' ? o.fl === 'I' || o.fl === 'A' : mode === 'D' ? o.fl === 'D' || o.fl === 'A' : (r => r && r.I && r.D)(sides.get(o.id)))); }
function indCount(sp, keep) { const ids = new Set(); let n = 0, dud = 0;
  for (const it of S.items) for (const c of allCats(it)) { const o = it.obs && it.obs[c]; if (!o || !o.id || (sp && norm(c) !== norm(sp))) continue; if (o.dud && !o.iv) dud++; if (keep(o)) { ids.add(o.id); n++; } }
  return { ids: ids.size, n, dud }; }
const IX = {};
function openIndx(kind, sp, occ) {
  if (!S.items.length) return toast('Abre una carpeta primero.'); if (kind === 'secr' && !sp) return toast('Elige la especie en Exportar.', 3000);
  Object.assign(IX, { kind, sp, occ, sides: indSides(kind === 'secr' ? sp : '') }); const cnt = m => indCount(IX.kind === 'secr' ? sp : '', indKeep(m, false, IX.sides)).ids;
  const ci = cnt('I'), cd = cnt('D'); IX.mode = ci || cd ? (ci >= cd ? 'I' : 'D') : 'T';
  $('#indx_sub').textContent = kind === 'secr' ? `Historia de captura de ${sp} para secr · ocasiones de ${occ} día(s)` : 'Registros de individuos para camtrapR (todas las especies identificadas)';
  const box = $('#indx_fl'); box.textContent = '';
  for (const [m, [t]] of Object.entries(IXM)) { const b = document.createElement('button'); b.dataset.m = m; b.innerHTML = `${t}<small>${cnt(m)} individuo(s)${m === 'T' ? ' · puede contar doble' : ''}</small>`; b.onclick = () => { IX.mode = m; indxSum(); }; box.appendChild(b); }
  $('#indx_dud').checked = false; indxSum(); openOver('#indx');
}
function indxSum() {
  $('#indx_fl').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.m === IX.mode));
  const sp = IX.kind === 'secr' ? IX.sp : '', dud = $('#indx_dud').checked, r = indCount(sp, indKeep(IX.mode, dud, IX.sides)), all = indCount(sp, indKeep('T', dud, IX.sides));
  $('#indx_sum').innerHTML = `<b>${r.ids}</b> individuo(s) · <b>${r.n}</b> foto(s)<small>${all.ids - r.ids > 0 ? `Quedan fuera ${all.ids - r.ids} individuo(s) por el lado elegido. ` : ''}${all.dud ? (dud ? `Incluye ${all.dud} foto(s) dudosa(s) sin confirmar.` : `${all.dud} foto(s) dudosa(s) sin confirmar no entran.`) : 'No hay identificaciones dudosas sin confirmar.'}</small>`;
}
$('#indx_dud').onchange = indxSum;
$('#indx_go').onclick = () => { const dud = $('#indx_dud').checked, keep = indKeep(IX.mode, dud, IX.sides), [t, tag] = IXM[IX.mode]; closeOver();
  const note = `Individuos: ${t.toLowerCase()}${IX.mode === 'T' ? ' (ojo: si algunos individuos solo se conocen por un lado, el mismo animal podría contarse dos veces)' : ''}. ${dud ? 'Incluye identificaciones dudosas sin confirmar.' : 'Sin identificaciones dudosas sin confirmar.'}`;
  if (IX.kind === 'secr') exportSecr(IX.sp, IX.occ, keep, tag, note); else exportIndRecords(keep, tag); };
$('#x_irt').onclick = () => { closePops(); openIndx('irt'); };
$('#x_secr').onclick = () => { const sp = $('#x_sp').value, occ = +$('#x_occ').value; closePops(); openIndx('secr', sp, occ); };

/* ---------- Prueba (index.html#test): además de mover y devolver una foto falsa, revisa los cálculos nuevos ---------- */
async function selfCheck13() {
  const fail = [];
  const th = [1, 1.2, 1.5, 2, 5, 5.2, 22, 23].map(h => h / 24 * 2 * Math.PI), dl = overlapDelta(th, th); if (!(dl > .99 && dl < 1.01)) fail.push('traslape de la misma especie: ' + dl.toFixed(3));
  const day = [10, 11, 12, 13, 14].map(h => h / 24 * 2 * Math.PI), night = [22, 23, 0, 1, 2].map(h => h / 24 * 2 * Math.PI); if (!(overlapDelta(day, night) < .5)) fail.push('traslape día/noche debe ser bajo');
  const z = readZip(await zipStore([['a.json', '{"x":"ñ"}'], ['b.txt', 'hola']]).arrayBuffer()); if (z['a.json'] !== '{"x":"ñ"}' || z['b.txt'] !== 'hola') fail.push('respaldo: el .zip no se lee igual');
  const k = '__prueba__'; S.stations[k] = { start: '2026-03-01', end: '2026-03-30', down: [{ a: '2026-03-11', b: '2026-03-20' }] };
  const t = trapDays(k); if (t.days !== 20 || t.down !== 10) fail.push(`días-trampa con 10 días sin funcionar: ${t.days} (esperado 20)`); delete S.stations[k];
  if (newIndId('Jaguar').slice(0, 4) !== 'JAG-') fail.push('código de individuo');
  { const z2 = await readZipBin(await zipStore([['x.bin', new Uint8Array([0, 255, 7])], ['a.txt', 'ñ']]).arrayBuffer()); if (!z2['x.bin'] || z2['x.bin'].join() !== '0,255,7' || new TextDecoder().decode(z2['a.txt']) !== 'ñ') fail.push('paquete de individuos: imagen dentro del .zip'); } // 1.4.15
  { const t = trSmooth([[0, 0], [10, 0], [10, 10], [0, 10]]), b = trBox(t); if (t.length < 6 || b[0] < 0 || b[2] > 10) fail.push('suavizado del trazo de rosetas'); }
  { const sd = new Map([['A', { I: 1, D: 1 }], ['B', { I: 1, D: 0 }]]), ph = [{ id: 'A', fl: 'I' }, { id: 'A', fl: 'D' }, { id: 'B', fl: 'I', dud: 1 }, { id: 'B', fl: 'A', dud: 1, iv: 'x' }]; // exportar por lado y sin dudosas
    const n = (m, d) => ph.filter(indKeep(m, d, sd)).length; if (n('I', false) !== 2 || n('I', true) !== 3 || n('D', false) !== 2 || n('B', true) !== 2 || n('T', false) !== 3) fail.push(`exportar por lado: ${n('I', false)} ${n('I', true)} ${n('D', false)} ${n('B', true)} ${n('T', false)}`); }
  console[fail.length ? 'error' : 'info']('selfCheck 1.3: ' + (fail.length ? 'FALLA ' + fail.join('; ') : 'todo bien (traslape, respaldo, días sin funcionar, exportar individuos por lado, paquete de individuos, trazo de rosetas)'));
  return fail;
}
if (location.hash === '#test') selfCheck().then(selfCheck13);
