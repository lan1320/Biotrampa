'use strict';
/* BioTrampa 1.3 - Estudio: cámaras en par, días sin funcionar, acumulación de especies, traslape de actividad,
   respaldo del proyecto y doble revisión. Todo en tu computadora: sin IA, sin servidor y sin internet.
   Se carga después de app.js y usa sus funciones (S, station, trapDays, zipStore, download…). */

/* ---------- Cámaras en par: dos carpetas (cámaras) que cuentan como una sola estación ---------- */
function setPair(src) {
  if (!src) return;
  const names = [...new Set(S.srcs.filter(s => s !== src).map(s => s.pair || s.label))];
  const v = prompt(`Cámaras en par: escribe el nombre de la estación que «${src.label}» comparte con otra cámara. Usa el mismo nombre en las dos carpetas (o el nombre de la otra carpeta).\nDéjalo vacío para que vuelva a ser su propia estación.\n\nEstaciones del proyecto: ${names.join(', ') || '—'}`, src.pair || '');
  if (v === null) return;
  const nv = v.trim().replace(/\s+/g, ' '), old = src.pair || src.label, pair = nv && nv !== src.label ? nv : null, nk = pair || src.label;
  if (nk === old) return;
  if (S.stations[old] && !S.stations[nk]) S.stations[nk] = { ...S.stations[old] }; // los datos de la estación pasan al par si este aún no tiene
  src.pair = pair;
  if (!S.srcs.some(s => (s.pair || s.label) === old)) delete S.stations[old];
  if (S.f.src === old) S.f.src = null;
  S.sig = null; saveReg(); applyFilters(); renderProjMenu(); if (!$('#sum').hidden) renderSummary();
  toast(pair ? `«${src.label}» ahora es parte de la estación «${pair}». Cada cámara conserva su corrección de hora y sus ráfagas.` : `«${src.label}» vuelve a ser su propia estación.`, 6000);
}

/* ---------- Días sin funcionar: lista en la ventana de la estación ---------- */
function addDownRow(p = {}) {
  const r = document.createElement('div'); r.className = 'downrow';
  r.innerHTML = '<input type="date" class="da" aria-label="Desde"><span>a</span><input type="date" class="db" aria-label="Hasta"><input class="dw" placeholder="motivo (batería, cámara caída, tarjeta llena…)" aria-label="Motivo"><button class="lnk2" title="Quitar este periodo">Quitar</button>';
  r.querySelector('.da').value = p.a || ''; r.querySelector('.db').value = p.b || ''; r.querySelector('.dw').value = p.why || '';
  r.querySelector('button').onclick = () => r.remove();
  $('#st_down').appendChild(r); return r;
}
function renderDownList(list) { $('#st_down').textContent = ''; list.forEach(p => addDownRow(p)); }
$('#st_addd').onclick = () => { const r = addDownRow(); r.querySelector('.da').focus(); };
function readDownList() { // devuelve los periodos válidos, o null (y avisa) si alguno está mal
  const out = [];
  for (const r of $('#st_down').querySelectorAll('.downrow')) {
    const a = r.querySelector('.da').value, b0 = r.querySelector('.db').value, why = r.querySelector('.dw').value.trim();
    if (!a && !b0) continue;
    if (!a) { toast('Falta la fecha de inicio de un periodo sin funcionar.', 4000); return null; }
    const b = b0 || a; if (b < a) { toast('Un periodo sin funcionar termina antes de empezar.', 4000); return null; }
    out.push(why ? { a, b, why } : { a, b });
  }
  return out.sort((x, y) => x.a.localeCompare(y.a));
}

/* ---------- Resumen: secciones nuevas ---------- */
const xsec = (id, title, tip, body) => { const f = ls('bt_sumfold', {}); return `<details class="ssec" id="${id}"${f[id] ? '' : ' open'}><summary title="${esc(tip)}">${title}</summary>${body}</details>`; };
function extraSummary() {
  const sp = sumData.cats.filter(c => sumData.evs.some(e => e.c === c && !isNaN(e.t)));
  const tr = ls('bt_tras', []), a = sp.includes(tr[0]) ? tr[0] : sp[0], b = sp.includes(tr[1]) && tr[1] !== a ? tr[1] : sp.find(c => c !== a);
  const opts = sel => sp.map(c => `<option${c === sel ? ' selected' : ''}>${esc(c)}</option>`).join('');
  const gap = +ls('bt_gap', 7);
  return xsec('ss-fun', 'Funcionamiento de las cámaras', 'Cuándo funcionó cada estación, los días sin funcionar y los días con fotos',
      `<div class="mbar noprint"><label class="sm">Avisar si una estación pasa <select id="fungap">${[3, 5, 7, 14, 30].map(n => `<option value="${n}"${n === gap ? ' selected' : ''}>${n}</option>`).join('')}</select> días seguidos o más sin fotos</label></div><div id="funchart"></div>`)
    + xsec('ss-acu', 'Acumulación de especies', 'Cuántas especies se suman al aumentar el esfuerzo (días-trampa)', '<div id="acuchart"></div>')
    + xsec('ss-tras', 'Traslape de actividad', 'Qué tanto coinciden los horarios de actividad de dos especies',
      sp.length < 2 ? '<p class="hint tiny">Se necesitan al menos dos especies con eventos con fecha.</p>'
        : `<div class="mbar noprint"><label class="sm">Especie A <select id="tr_a">${opts(a)}</select></label><label class="sm">Especie B <select id="tr_b">${opts(b)}</select></label></div><div id="trchart"></div>`)
    + indSummaryHtml();
}
function bindExtraSummary() {
  drawFun(); drawAcu();
  if ($('#tr_a')) { const go = () => { sv('bt_tras', [$('#tr_a').value, $('#tr_b').value]); drawTras(); }; $('#tr_a').onchange = $('#tr_b').onchange = go; drawTras(); }
  if ($('#fungap')) $('#fungap').onchange = e => { sv('bt_gap', +e.target.value); drawFun(); };
}

/* Línea de tiempo: una barra por estación (instalación a retiro), los días sin funcionar en rojo y los días con fotos como marcas.
   También sugiere huecos largos sin fotos: pueden ser fallas o simplemente días sin animales; tú decides. */
function drawFun() {
  const box = $('#funchart'); if (!box) return;
  const { stations, td, its } = sumData;
  const rows = stations.filter(s => td[s].start && td[s].end).map(s => ({ s, t: td[s], dn: (S.stations[s] && S.stations[s].down) || [], ph: new Set(its.filter(i => station(i) === s && goodTs(i)).map(i => ymd(fixTs(i)))) }));
  if (!rows.length) { box.innerHTML = '<p class="hint tiny">Faltan las fechas de instalación y retiro (o fotos con fecha) para dibujar la línea de tiempo.</p>'; return; }
  const t0 = Math.min(...rows.map(r => Date.parse(r.t.start))), t1 = Math.max(...rows.map(r => Date.parse(r.t.end))) + DAY;
  const W = 720, L = 150, rh = 24, H = rows.length * rh + 24, x = t => L + (t - t0) / (t1 - t0) * (W - L - 8);
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="funsvg" role="img" aria-label="Línea de tiempo del funcionamiento de las cámaras">`;
  const d0 = new Date(t0), months = [];
  for (let k = 0; k < 600; k++) { const t = Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + k, 1); if (t > t1) break; if (t >= t0) months.push(t); }
  const step = Math.max(1, Math.ceil(months.length / 12));
  months.forEach((t, k) => { svg += `<line x1="${x(t)}" x2="${x(t)}" y1="0" y2="${H - 18}" class="grid"/>`; if (k % step === 0) { const d = new Date(t); svg += `<text x="${x(t) + 2}" y="${H - 6}" class="ax">${MES[d.getUTCMonth()]} ${d.getUTCFullYear()}</text>`; } });
  rows.forEach((r, k) => {
    const y = k * rh + 4, a = Date.parse(r.t.start), b = Date.parse(r.t.end) + DAY;
    svg += `<text x="${L - 8}" y="${y + 13}" class="lbl">${esc(r.s.length > 22 ? r.s.slice(0, 21) + '…' : r.s)}<title>${esc(r.s)}</title></text>`;
    svg += `<rect x="${x(a)}" y="${y + 3}" width="${Math.max(1, x(b) - x(a))}" height="14" class="run${r.t.est ? ' est' : ''}"><title>${esc(r.s)}: ${r.t.start} a ${r.t.end}${r.t.est ? ' (estimado con las fotos)' : ''} · ${r.t.days} días-trampa${r.t.down ? ` (${r.t.down} sin funcionar)` : ''}</title></rect>`;
    for (const p of r.dn) { if (!p.a || !p.b) continue; const pa = Date.parse(p.a), pb = Date.parse(p.b) + DAY; svg += `<rect x="${x(pa)}" y="${y + 1}" width="${Math.max(1.5, x(pb) - x(pa))}" height="18" class="down"><title>Sin funcionar: ${p.a} a ${p.b}${p.why ? ' · ' + esc(p.why) : ''}</title></rect>`; }
    for (const d of r.ph) { const t = Date.parse(d); if (t < t0 || t >= t1) continue; svg += `<rect x="${x(t)}" y="${y + 6}" width="${Math.max(1.2, x(t + DAY) - x(t))}" height="8" class="ph"><title>${d}: hay fotos</title></rect>`; }
  });
  svg += '</svg>';
  const gap = +ls('bt_gap', 7), sug = [];
  for (const r of rows) {
    const dn = downSet(r.s); let run = null;
    const end = () => { if (run && run.n >= gap) sug.push({ s: r.s, ...run }); run = null; };
    for (const d of dayList(r.t.start, r.t.end)) { if (!r.ph.has(d) && !dn.has(d)) { if (!run) run = { a: d, n: 0 }; run.b = d; run.n++; } else end(); }
    end();
  }
  const tot = rows.reduce((a, r) => a + r.t.down, 0);
  let html = svg + `<p class="hint tiny"><span class="lg run"></span> funcionando <span class="lg est"></span> fechas estimadas con las fotos <span class="lg down"></span> sin funcionar <span class="lg ph"></span> días con fotos. ${tot ? `En total se descontaron <b>${tot}</b> día(s) sin funcionar de los días-trampa.` : 'Los días sin funcionar se escriben con … junto a la estación (o «Más…» en la tabla de estaciones).'}</p>`;
  if (sug.length) html += `<div class="warnbox noprint"><div><b>${sug.length}</b> hueco(s) de ${gap} días o más sin fotos. Puede ser una falla de la cámara o simplemente que no pasó ningún animal: márcalo solo si lo confirmas (batería, tarjeta, cámara caída).</div>`
    + sug.slice(0, 30).map((g, k) => `<div>${esc(g.s)}: ${g.a} a ${g.b} (${g.n} días) <button class="lnk2" data-sug="${k}">Marcar como sin funcionar</button></div>`).join('') + (sug.length > 30 ? `<div>y ${sug.length - 30} más…</div>` : '') + '</div>';
  box.innerHTML = html;
  box.querySelectorAll('[data-sug]').forEach(b => b.onclick = () => {
    const g = sug[+b.dataset.sug], st = { ...(S.stations[g.s] || {}) }; st.down = [...(st.down || []), { a: g.a, b: g.b, why: 'sin fotos (confirmado)' }].sort((p, q) => p.a.localeCompare(q.a));
    if (!st.start || !st.end) { const t = trapDays(g.s); st.start = st.start || t.start; st.end = st.end || t.end; }
    S.stations[g.s] = st; saveReg(); renderSummary(); toast(`«${g.s}»: ${g.n} día(s) marcados sin funcionar. Se descontaron de los días-trampa.`, 5000);
  });
}

/* Curva de acumulación de especies: cada día-trampa (estación y día que funcionó) aporta las especies vistas ese día.
   Se promedian 100 órdenes al azar de esos días. */
function drawAcu() {
  const box = $('#acuchart'); if (!box) return;
  const { stations, td, its } = sumData, units = [];
  for (const s of stations) {
    const t = td[s]; if (!t.start || !t.end) continue; const dn = downSet(s), by = new Map();
    for (const it of its) if (station(it) === s && goodTs(it)) { const d = ymd(fixTs(it)); for (const c of allCats(it)) if (c !== GH && S.cats.includes(c)) { if (!by.has(d)) by.set(d, new Set()); by.get(d).add(c); } }
    for (const d of dayList(t.start, t.end)) if (!dn.has(d)) units.push(by.has(d) ? [...by.get(d)] : null);
  }
  const n = units.length; if (n < 2) { box.innerHTML = '<p class="hint tiny">Se necesitan estaciones con fechas (o fotos con fecha) para la curva.</p>'; return; }
  const R = 100, mean = new Float64Array(n), idx = Array.from({ length: n }, (_, i) => i);
  for (let r = 0; r < R; r++) {
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const seen = new Set(); for (let k = 0; k < n; k++) { const u = units[idx[k]]; if (u) for (const c of u) seen.add(c); mean[k] += seen.size / R; }
  }
  const tot = mean[n - 1]; if (!tot) { box.innerHTML = '<p class="hint tiny">Todavía no hay especies clasificadas en fotos con fecha.</p>'; return; }
  const W = 720, H = 220, L = 34, B = 26, X = k => L + k / (n - 1) * (W - L - 10), Y = v => H - B - v / Math.ceil(tot) * (H - B - 10);
  const pts = []; const stp = Math.max(1, Math.floor(n / 240)); for (let k = 0; k < n; k += stp) pts.push(`${X(k).toFixed(1)},${Y(mean[k]).toFixed(1)}`); pts.push(`${X(n - 1).toFixed(1)},${Y(tot).toFixed(1)}`);
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="acusvg" role="img" aria-label="Curva de acumulación de especies">`;
  for (let v = 0; v <= Math.ceil(tot); v += Math.max(1, Math.round(Math.ceil(tot) / 5))) svg += `<line x1="${L}" x2="${W - 10}" y1="${Y(v)}" y2="${Y(v)}" class="grid"/><text x="${L - 6}" y="${Y(v) + 4}" class="ax" style="text-anchor:end">${v}</text>`;
  for (let k = 0; k <= 4; k++) { const d = Math.round((n - 1) * k / 4); svg += `<text x="${X(d)}" y="${H - 8}" class="ax">${d + 1}</text>`; }
  svg += `<polyline points="${pts.join(' ')}" class="cur"/><line x1="${L}" x2="${W - 10}" y1="${H - B}" y2="${H - B}" class="base"/></svg>`;
  const last = Math.max(0, Math.floor(n * .9) - 1), rise = tot - mean[last];
  box.innerHTML = svg + `<p class="hint tiny">Eje horizontal: días-trampa acumulados (${n}); vertical: especies. Con todo el esfuerzo se registraron <b>${Math.round(tot)}</b> especie(s) (Fantasmas no cuenta). En el último 10 % del esfuerzo la curva subió en promedio <b>${rise.toFixed(1)}</b> especie(s): ${rise < .5 ? 'casi ya no sube, así que es poco probable que falten especies comunes.' : 'todavía sube; con más días-trampa probablemente aparecerían más especies.'} Es el promedio de 100 órdenes al azar de los días-trampa.</p>`;
}

/* Traslape de actividad (coeficiente Δ): densidades circulares con núcleo de von Mises.
   Ancho de banda: regla de Taylor (2008). Es un valor aproximado: para publicar, calcúlalo con el paquete overlap de R. */
function besI(nu, x) { let term = Math.pow(x / 2, nu) / (nu === 2 ? 2 : 1), s = 0; for (let k = 0; k < 2000; k++) { s += term; term *= (x * x / 4) / ((k + 1) * (k + 1 + nu)); if (term < s * 1e-14) break; } return s; }
function vmKappa(th) {
  const n = th.length, C = th.reduce((a, t) => a + Math.cos(t), 0) / n, Sn = th.reduce((a, t) => a + Math.sin(t), 0) / n, R = Math.min(.999, Math.hypot(C, Sn));
  const k = R < .53 ? 2 * R + R ** 3 + 5 * R ** 5 / 6 : R < .85 ? -.4 + 1.39 * R + .43 / (1 - R) : 1 / (R ** 3 - 4 * R ** 2 + 3 * R);
  return Math.min(50, Math.max(.01, k));
}
function actDensity(th, G = 288) {
  const n = th.length, k = vmKappa(th), nu = Math.min(100, Math.max(.5, Math.pow(3 * n * k * k * besI(2, 2 * k) / (4 * Math.sqrt(Math.PI) * besI(0, k) ** 2), .4)));
  const i0e = besI(0, nu) * Math.exp(-nu), f = new Float64Array(G);
  for (let g = 0; g < G; g++) { const a = g / G * 2 * Math.PI; let s = 0; for (const t of th) s += Math.exp(nu * (Math.cos(a - t) - 1)); f[g] = s / (n * 2 * Math.PI * i0e); }
  return f;
}
function overlapDelta(A, B, G = 288) { const f = actDensity(A, G), g = actDensity(B, G); let s = 0; for (let i = 0; i < G; i++) s += Math.min(f[i], g[i]); return s * 2 * Math.PI / G; }
function drawTras() {
  const box = $('#trchart'); if (!box) return; const a = $('#tr_a').value, b = $('#tr_b').value;
  if (a === b) { box.innerHTML = '<p class="hint tiny">Elige dos especies distintas.</p>'; return; }
  const th = c => sumData.evs.filter(e => e.c === c && !isNaN(e.t)).map(e => { const d = new Date(e.t); return (d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600) / 24 * 2 * Math.PI; });
  const A = th(a), B = th(b); if (A.length < 2 || B.length < 2) { box.innerHTML = '<p class="hint tiny">Cada especie necesita al menos 2 eventos con fecha.</p>'; return; }
  const G = 288, f = actDensity(A, G), g = actDensity(B, G); let dl = 0, mx = 0; for (let i = 0; i < G; i++) { dl += Math.min(f[i], g[i]); mx = Math.max(mx, f[i], g[i]); } dl *= 2 * Math.PI / G;
  const W = 720, H = 220, L = 10, Bm = 26, X = i => L + i / G * (W - 2 * L), Y = v => H - Bm - v / mx * (H - Bm - 10);
  const line = arr => Array.from(arr, (v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ') + ` ${X(G).toFixed(1)},${Y(arr[0]).toFixed(1)}`;
  const mn = Float64Array.from(f, (v, i) => Math.min(v, g[i]));
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="trsvg" role="img" aria-label="Traslape de actividad de ${esc(a)} y ${esc(b)}"><polygon points="${X(0)},${Y(0)} ${line(mn)} ${X(G)},${Y(0)}" class="ov"/>`;
  svg += `<polyline points="${line(f)}" class="ca"/><polyline points="${line(g)}" class="cb"/>`;
  for (let h = 0; h <= 24; h += 3) svg += `<text x="${X(h / 24 * G)}" y="${H - 8}" class="ax"${h ? (h === 24 ? ' style="text-anchor:end"' : '') : ' style="text-anchor:start"'}>${pad(h % 24)}:00</text>`;
  svg += `<line x1="${L}" x2="${W - L}" y1="${H - Bm}" y2="${H - Bm}" class="base"/></svg>`;
  box.innerHTML = svg + `<p class="hint tiny"><span class="lg ca"></span> ${esc(a)} (${A.length} eventos) <span class="lg cb"></span> ${esc(b)} (${B.length} eventos). Traslape <b>Δ = ${dl.toFixed(2)}</b> (0 = horarios distintos, 1 = iguales; zona gris).${Math.min(A.length, B.length) < 20 ? ' <b>Pocos eventos:</b> el valor es poco confiable.' : ''} Es un cálculo aproximado (núcleo de von Mises); para publicarlo, calcúlalo con su intervalo de confianza en el paquete <i>overlap</i> de R.</p>`;
}

/* ---------- Respaldo del proyecto: solo datos (nunca fotos ni videos) ---------- */
function readZip(buf) { // lee los .zip sin compresión que crea BioTrampa (zipStore)
  const v = new DataView(buf), out = {}, dec = new TextDecoder(); let o = 0;
  while (o + 30 <= v.byteLength && v.getUint32(o, true) === 0x04034b50) {
    const meth = v.getUint16(o + 8, true), size = v.getUint32(o + 18, true), nl = v.getUint16(o + 26, true), xl = v.getUint16(o + 28, true), d = o + 30 + nl + xl;
    if (meth !== 0) throw new Error('el .zip está comprimido; usa el archivo tal como lo guardó BioTrampa');
    out[dec.decode(new Uint8Array(buf, o + 30, nl))] = dec.decode(new Uint8Array(buf, d, size)); o = d + size;
  }
  return out;
}
function backupData() {
  const registros = {};
  for (const src of S.srcs) { const files = {}; for (const it of S.items) if (it.src === src) { const e = regEntry(it); if (e) files[relPath(it)] = e; } registros[src.label] = { carpeta: src.name, par: src.pair || null, files }; }
  const ajustes = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('bt_')) ajustes[k] = localStorage.getItem(k); } } catch (e) {}
  return { app: 'BioTrampa', tipo: 'respaldo', version: '1.3', fecha: new Date().toISOString(), proyecto: projName(), estaciones: S.stations, correcciones: S.offsets, individuos: { especies: S.indSp, list: S.ind.list, act: S.ind.act }, registros, ajustes };
}
function saveBackup() {
  if (!S.srcs.length && !confirm('No hay un proyecto abierto: el respaldo solo tendrá la lista de especies y los ajustes. ¿Guardarlo así?')) return;
  const d = backupData(), n = Object.values(d.registros).reduce((a, r) => a + Object.keys(r.files).length, 0);
  const leeme = `Respaldo de BioTrampa del proyecto «${d.proyecto}» (${d.fecha.slice(0, 10)}).\r\n\r\nSolo contiene DATOS: clasificaciones y origen de cada foto, datos de las estaciones (fechas, GPS, días sin funcionar, cámaras en par), corrección de hora, lista de especies, datos rápidos, catálogo de individuos y ajustes.\r\nNO contiene fotos ni videos: respáldalos aparte (por ejemplo, en un disco externo).\r\n\r\nPara usarlo: abre el proyecto en BioTrampa (o vuelve a agregar sus carpetas) y elige Exportar → «Restaurar un respaldo…».\r\nNo se mueve ni se borra ninguna foto, y no se reemplaza lo que ya esté escrito: solo se completa lo que falte.\r\n`;
  download(zipStore([['respaldo.json', JSON.stringify(d, null, 1)], ['LEEME.txt', leeme]]), `respaldo_biotrampa_${depId(d.proyecto)}_${ymd(Date.now())}.zip`);
  toast(`Respaldo guardado: ${Object.keys(d.registros).length} estación(es) y ${n} foto(s) con datos. No incluye fotos. Guárdalo fuera de esta computadora (USB, Drive…).`, 8000);
}
function fillFromReg(it, r) { // completa lo que le falta a la foto con los datos del respaldo (nunca reemplaza)
  let ch = false;
  if (it.cat && r.o && !it.origParts) { const o = r.o.split('/'); it.origParts = o.slice(0, -1); it.origName = o[o.length - 1]; ch = true; }
  if (r.m && !it.origMod) { it.origMod = r.m; ch = true; }
  if (r.c && !it.cls) { it.cls = r.c; ch = true; }
  if (r.n && !it.note) { it.note = r.n; ch = true; }
  for (const [c, o] of Object.entries(r.obs || {})) if (!it.obs[c] || !Object.keys(it.obs[c]).length) { it.obs[c] = o; ch = true; }
  if (r.rv && !it.rev) { it.rev = true; it.revWhy = r.rw || ''; ch = true; }
  if (r.vf && !it.ver) { it.ver = r.vf; it.verBy = r.vb || ''; ch = true; }
  if (it.cat && Array.isArray(r.xt)) for (const c of r.xt) if (c && c !== it.cat && !hasCat(it, c)) { it.extras.push({ cat: c }); ch = true; }
  if (r.bl && !it.bl) { it.bl = r.bl; it.bb = r.bb || ''; it.br = r.br || ''; ch = true; }
  return ch;
}
async function restoreBackup(j) {
  const nReg = Object.keys(j.registros || {}).length, nInd = Object.keys((j.individuos && j.individuos.list) || {}).length;
  if (!confirm(`Respaldo de «${j.proyecto}» del ${String(j.fecha || '').slice(0, 10)}.\n\nSe restaurarán la lista de especies (con teclas y nombres científicos), los datos rápidos y los ajustes de este navegador${S.srcs.length ? `; y, en el proyecto abierto, los datos de las estaciones y de las fotos que falten (${nReg} estación(es) en el respaldo)` : '. Abre antes el proyecto si también quieres recuperar los datos de sus fotos'}${nInd ? `; y ${nInd} individuo(s) del catálogo` : ''}.\n\nNo se mueve ni se borra ninguna foto y no se reemplaza lo que ya tengas escrito. ¿Continuar?`)) return;
  for (const [k, v] of Object.entries(j.ajustes || {})) if (typeof v === 'string') try { localStorage.setItem(k, v); } catch (e) {}
  S.cats = ls('bt_cats', S.cats); S.keys = ls('bt_keys', S.keys); S.sci = Object.assign({}, SCI, ls('bt_sci', {})); S.presets = ls('bt_presets', S.presets); GH = ls('bt_gh', GH); S.indSp = ls('bt_indsp', S.indSp);
  let nst = 0, nph = 0;
  for (const src of S.srcs) {
    const r = (j.registros || {})[src.label] || Object.values(j.registros || {}).find(x => x.carpeta === src.name); if (!r) continue;
    if (!src.pair && r.par && r.par !== src.label) src.pair = r.par;
    const key = src.pair || src.label;
    if (j.estaciones && j.estaciones[key] && !S.stations[key]) { S.stations[key] = j.estaciones[key]; nst++; }
    if (j.correcciones && j.correcciones[src.label] && !S.offsets[src.label]) S.offsets[src.label] = j.correcciones[src.label];
    for (const it of S.items) if (it.src === src) { const e = r.files && r.files[relPath(it)]; if (e && fillFromReg(it, e)) nph++; }
  }
  const ci = j.individuos ? mergeCatalog(j.individuos) : { add: 0 };
  syncIndCatalog(); S.sig = null; saveReg(); applyFilters(); renderKeys(true);
  toast(`Respaldo restaurado: lista de especies y ajustes${S.srcs.length ? `, ${nst} estación(es) y ${nph} foto(s) completadas` : ''}${ci.add ? `, ${ci.add} individuo(s) añadidos al catálogo` : ''}. Algunos ajustes (tema, tamaños) se ven al recargar la página.`, 10000);
}
$('#filebak').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return; let j;
  try { const txt = /\.zip$/i.test(f.name) ? readZip(await f.arrayBuffer())['respaldo.json'] : await f.text(); if (!txt) throw new Error('no tiene respaldo.json'); j = JSON.parse(txt); }
  catch (x) { return toast('No se pudo leer el respaldo: ' + x.message, 6000); }
  if (!j || j.tipo !== 'respaldo') return toast('Ese archivo no es un respaldo de BioTrampa.', 5000);
  await restoreBackup(j);
};

/* ---------- Doble revisión ---------- */
// 1) A ciegas: otra persona revisa las mismas fotos sin ver la clasificación; su respuesta se anota y NO se mueve ningún archivo.
S.blind = ls('bt_blind', false);
document.body.classList.toggle('blind', S.blind); $('#blind').checked = S.blind;
$('#blind').onchange = e => {
  S.blind = e.target.checked; sv('bt_blind', S.blind); document.body.classList.toggle('blind', S.blind);
  toast(S.blind ? `Revisión a ciegas activada: no se ve la clasificación y tus respuestas se anotan sin mover fotos.${$('#reviewer').value.trim() ? '' : ' Escribe tu nombre en «Nombre de quien revisa».'} Los desacuerdos están en Exportar → Doble revisión.` : 'Revisión a ciegas desactivada.', 7000);
  S.sig = null; applyFilters(); if (S.cur) show(S.cur);
};
async function blindSet(items, cat) { // cat = null borra la respuesta a ciegas
  const who = $('#reviewer').value.trim(), cur = S.cur;
  for (const i of items) { i.bl = cat || ''; i.bb = cat ? who : ''; i.br = ''; }
  saveReg(); applyFilters(items);
  if (cur && cat && $('#adv').checked) { const k = S.view.indexOf(cur), nx = S.view.slice(k + 1).find(x => !x.bl && !groupOf(x).includes(cur)); show(nx || cur); } else if (cur) show(cur);
  toast(cat ? `A ciegas: ${items.length} foto(s) → ${cat}. No se movió ningún archivo.` : 'Respuesta a ciegas borrada.', 2200);
}
async function applySp(it, cat) { // clasifica de verdad (mueve la foto) aunque la revisión a ciegas esté activa
  await locked(async () => { const was = S.blindOff; S.blindOff = true; try { await classify([it], cat, true); } finally { S.blindOff = was; } });
}
function openDis(list, title, la, lb, onA, onB) { // desacuerdos lado a lado: la foto y las dos respuestas
  $('#h_rev').textContent = title; const box = $('#revbody'); box.textContent = '';
  if (!list.length) box.innerHTML = '<p class="hint">No hay desacuerdos.</p>';
  for (const d of list) {
    const r = document.createElement('div'); r.className = 'disrow';
    r.innerHTML = '<img class="dth" alt=""><div class="dinfo"><b></b><small></small></div><button class="da"></button><button class="db"></button><button class="lnk2 dop">Abrir</button>';
    box.appendChild(r);
    const img = r.querySelector('img'); if (d.it) { img.dataset.id = d.it.id; thumb(img); } else img.remove();
    r.querySelector('b').textContent = d.it.origName || d.it.name;
    r.querySelector('small').textContent = [station(d.it), d.kind === 'id' ? `ID del individuo (${d.c})` : 'Especie'].join(' · ');
    const ba = r.querySelector('.da'), bb = r.querySelector('.db'); ba.textContent = `${la}: ${d.a}`; bb.textContent = `${lb}: ${d.b}`;
    ba.title = 'Queda esta respuesta'; bb.title = 'Queda esta respuesta (si es otra especie, la foto se mueve a su carpeta)';
    ba.onclick = async () => { await onA(d); r.remove(); }; bb.onclick = async () => { await onB(d); r.remove(); };
    r.querySelector('.dop').onclick = () => { closeOver(true); show(d.it); };
  }
  openOver('#revdlg');
}
function blindDis() {
  if (!S.items.some(i => i.bl)) return toast('Todavía no hay respuestas a ciegas. Actívala en Ajustes → Revisión → «Doble revisión a ciegas».', 6000);
  const l = S.items.filter(i => i.bl && !i.br && i.bl !== (i.cat || '')).map(it => ({ it, a: it.cat || 'pendiente', b: it.bl + (it.bb ? ` (${it.bb})` : ''), sp: it.bl, kind: 'sp' }));
  const same = S.items.filter(i => i.bl && i.bl === i.cat).length;
  openDis(l, `Revisión a ciegas: ${same} coinciden, ${l.length} desacuerdo(s)`, 'Clasificación', 'A ciegas',
    async d => { d.it.br = 'A'; saveReg(); },
    async d => { if (d.it.cat !== d.sp) await applySp(d.it, d.sp); d.it.br = 'B'; saveReg(); refreshCards([d.it]); });
}
// 2) Comparar con el CSV (registro completo) de otra persona: se emparejan las fotos por nombre original y fecha EXIF
$('#filerev').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  if (!S.items.length) return toast('Abre primero el proyecto con las mismas fotos.', 5000);
  const rows = parseCsv(await f.text()); if (rows.length < 2) return toast('El CSV no tiene filas.', 4000);
  const H = rows[0], ix = n => H.indexOf(n);
  if (ix('Especie o categoría') < 0) return toast('Ese CSV no es un «Registro completo» de BioTrampa (falta la columna «Especie o categoría»).', 7000);
  await prepare(true);
  const clean = v => (v || '').replace(/^'(?=[=+@\-])/, ''), g = (r, n) => ix(n) < 0 ? '' : clean(r[ix(n)]);
  const key = (name, d, t, st) => norm(name) + '|' + (d ? d + ' ' + (t || '') : norm(st));
  const mine = new Map(); for (const it of S.items) { const m = it.meta || {}; mine.set(key(it.origName || it.name, m.date, m.time, station(it)), it); }
  const list = []; let miss = 0, same = 0;
  for (const r of rows.slice(1)) {
    const typ = g(r, 'Tipo'); if (typ && typ !== 'Principal') continue;
    const it = mine.get(key(g(r, 'Nombre original') || g(r, 'Nombre del archivo'), g(r, 'Fecha de captura (EXIF)'), g(r, 'Hora de captura (EXIF)'), g(r, 'Estación')));
    if (!it) { miss++; continue; }
    const b = g(r, 'Especie o categoría'), a = it.cat || ''; if (!b) continue; // la otra persona la dejó pendiente
    if (a !== b) { list.push({ it, a: a || 'pendiente', b, sp: b, kind: 'sp' }); continue; }
    const ia = ((it.obs || {})[a] || {}).id || '', ib = g(r, 'ID del individuo');
    if (ib && ia !== ib) list.push({ it, a: ia || 'sin ID', b: ib, c: a, kind: 'id' }); else same++;
  }
  openDis(list, `Comparación con «${f.name}»: ${same} coinciden, ${list.length} desacuerdo(s)`, 'Tú', 'Otra persona', async () => {},
    async d => { if (d.kind === 'sp') await applySp(d.it, d.sp); else { const o = obsOf(d.it, d.c); o.id = d.b; delete o.ns; ensureInd(d.b, d.c); saveReg(); refreshCards([d.it]); } });
  if (miss) toast(`${miss} fila(s) del CSV no se encontraron en este proyecto (otras fotos o sin fecha EXIF).`, 7000);
};

/* ---------- camtrapR: tabla de estaciones (CTtable) con los días sin funcionar ---------- */
async function exportCTtable() {
  if (!S.items.length) return toast('Abre una carpeta primero.'); await prepare(true);
  const sts = [...new Set(S.items.map(station))].sort(), maxP = Math.max(0, ...sts.map(s => ((S.stations[s] || {}).down || []).length));
  const head = ['Station', 'Cameras', 'Latitude', 'Longitude', 'Setup_date', 'Retrieval_date']; for (let k = 1; k <= maxP; k++) head.push(`Problem${k}_from`, `Problem${k}_to`);
  const rows = [head];
  for (const s of sts) {
    const t = trapDays(s), c = stCoords(s), dn = (S.stations[s] || {}).down || [];
    const r = [s, S.srcs.filter(x => (x.pair || x.label) === s).map(x => x.label).join(' + '), c ? c[0].toFixed(6) : '', c ? c[1].toFixed(6) : '', t.start || '', t.end || ''];
    for (let k = 0; k < maxP; k++) r.push(dn[k] ? dn[k].a : '', dn[k] ? dn[k].b : '');
    rows.push(r);
  }
  download(new Blob([plainCsv(rows)], { type: 'text/csv;charset=utf-8' }), `CTtable_camtrapR_${ymd(Date.now())}.csv`);
  toast(`Tabla de estaciones para camtrapR: ${sts.length} estación(es)${maxP ? ' con sus días sin funcionar (ProblemN_from / ProblemN_to)' : ''}. En R: cameraOperation(CTtable, stationCol = "Station", setupCol = "Setup_date", retrievalCol = "Retrieval_date", hasProblems = ${maxP ? 'TRUE' : 'FALSE'}, dateFormat = "ymd").`, 12000);
}

/* ---------- Botones del menú Exportar ---------- */
$('#x_ct').onclick = xRun(exportCTtable);
$('#x_bak').onclick = xRun(saveBackup); $('#x_res').onclick = xRun(() => $('#filebak').click());
$('#x_blind').onclick = xRun(blindDis); $('#x_cmp').onclick = xRun(() => $('#filerev').click());
