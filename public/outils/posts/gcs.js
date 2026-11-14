/* GCS · Global Connect Services — gabarits dessinés en canvas.
   Un seul fichier pour la planche des couleurs, les exemples du kit et le générateur.
   GCS.init(geom, palette) puis GCS.draw(kind, canvas, data, photos).
   Idée graphique : comme le G et le C du logo, les formes s'enlacent.
   La pastille du prix passe devant la carte, séparée d'elle par un liseré,
   et la carte passe devant la photo de la même façon. */
(function (root) {
  'use strict';
  const T = {};
  T.FONT = 'Jost, "Futura", "Century Gothic", Arial, sans-serif';
  const DEF = {
    main: '#162A5B', deep: '#0D1B3E', accent: '#FFC21F', onAccent: '#0D1B3E',
    paper: '#F4F5F8', ink: '#0D1530', white: '#FFFFFF', shade: '9,18,44',
    logoLight: { gs: '#162A5B', c: '#162A5B' }, logoDark: { gs: '#FFFFFF', c: '#FFC21F' },
    tint: '#DCE3F2'
  };
  T.pal = Object.assign({}, DEF);
  let G = null;
  let P = {};

  T.init = function (geom, pal) {
    G = geom;
    if (pal) T.pal = Object.assign({}, DEF, pal); // une palette ne garde rien de la précédente
    P = {
      g: new Path2D(geom.mot.g), c: new Path2D(geom.mot.c), s: new Path2D(geom.mot.s),
      sub: new Path2D(geom.sub.d), rule: new Path2D(geom.rule.d), met: new Path2D(geom.met.d),
      hrule: new Path2D(geom.horiz.rule), l1: new Path2D(geom.horiz.l1), l2: new Path2D(geom.horiz.l2),
      symG: new Path2D(geom.sym.g), symC: new Path2D(geom.sym.c),
      symSG: new Path2D(geom.symS.g), symSC: new Path2D(geom.symS.c)
    };
  };
  T.setPalette = function (pal) { T.pal = Object.assign({}, DEF, pal); };

  T.SIZES = {
    post: [1080, 1350], story: [1080, 1920], avantapres: [1080, 1350], annonce: [1200, 1200],
    profil: [1080, 1080], couverture: [1640, 624], alaune: [1080, 1920]
  };

  T.STATUS = {
    '': null,
    nouveau: { chip: 'NOUVEAU', strong: false },
    promo: { chip: 'PROMO', strong: true },
    stock: { chip: 'EN STOCK', strong: false },
    repare: { chip: 'RÉPARÉ', strong: true }
  };

  // ---------- outils ----------
  function setFont(ctx, weight, px) { ctx.font = weight + ' ' + Math.round(px) + 'px ' + T.FONT; }
  function fit(ctx, text, weight, px, minPx, maxW) {
    setFont(ctx, weight, px);
    while (px > minPx && ctx.measureText(text).width > maxW) { px -= 1; setFont(ctx, weight, px); }
    return px;
  }
  function chars(s) { return Array.from(String(s)); }
  function spacedWidth(ctx, text, track) {
    let w = 0; chars(text).forEach(function (ch) { w += ctx.measureText(ch).width + track; });
    return Math.max(0, w - track);
  }
  function spaced(ctx, text, x, y, track, align) {
    const w = spacedWidth(ctx, text, track);
    let cx = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
    chars(text).forEach(function (ch) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + track; });
    return w;
  }
  function wrap(ctx, text, maxW) {
    const words = String(text).split(/\s+/).filter(Boolean); const lines = []; let line = '';
    words.forEach(function (w) {
      const t = line ? line + ' ' + w : w;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else { line = t; }
    });
    if (line) lines.push(line);
    return lines;
  }
  function ellipsize(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
    return t.replace(/\s+$/, '') + '…';
  }
  function alpha(hex, a) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(function (c) { return c + c; }).join('') : h, 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  T.alpha = alpha;
  function up(s) { return String(s || '').toLocaleUpperCase('fr-FR'); }

  // prix : « 129 € », « 24,90 € »
  T.price = function (v) {
    if (v == null) return '';
    let s = String(v).trim().replace(/\s|€/g, '').replace(',', '.');
    if (!s) return '';
    const n = Number(s);
    if (!isFinite(n)) return '';
    const cents = Math.round(n * 100) % 100 !== 0;
    const txt = n.toLocaleString('fr-FR', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 });
    return txt.replace(/[  ]/g, ' ') + ' €';
  };
  T.num = function (v) {
    const s = String(v == null ? '' : v).trim().replace(/\s|€/g, '').replace(',', '.');
    const n = Number(s); return s && isFinite(n) ? n : null;
  };

  // formes : rectangle arrondi et pastille (maillon)
  function rrPath(x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    const p = new Path2D();
    p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.arcTo(x + w, y, x + w, y + r, r);
    p.lineTo(x + w, y + h - r); p.arcTo(x + w, y + h, x + w - r, y + h, r);
    p.lineTo(x + r, y + h); p.arcTo(x, y + h, x, y + h - r, r);
    p.lineTo(x, y + r); p.arcTo(x, y, x + r, y, r); p.closePath();
    return p;
  }
  T.rrPath = rrPath;
  function grow(b, d) { return { x: b.x - d, y: b.y - d, w: b.w + 2 * d, h: b.h + 2 * d, r: b.r + d }; }
  function shapePath(b) { return rrPath(b.x, b.y, b.w, b.h, b.r); }
  // dessine en retirant des « liserés » (zones où une forme passe devant)
  function withCuts(ctx, W, H, cuts, fn) {
    if (!cuts || !cuts.length) { fn(); return; }
    ctx.save();
    const clip = new Path2D(); clip.rect(-10, -10, W + 20, H + 20);
    cuts.forEach(function (c) { clip.addPath(shapePath(c)); });
    ctx.clip(clip, 'evenodd');
    fn();
    ctx.restore();
  }

  // ---------- photo : cadrage et flou ----------
  function coverMap(img, w, h, v) {
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    v = v || {};
    const zoom = Math.max(1, v.zoom || 1);
    const fx = v.fx == null ? 0.5 : v.fx, fy = v.fy == null ? 0.5 : v.fy;
    let sw, sh;
    if (iw / ih > w / h) { sh = ih / zoom; sw = sh * w / h; } else { sw = iw / zoom; sh = sw * h / w; }
    return { iw: iw, ih: ih, sw: sw, sh: sh, sx: (iw - sw) * fx, sy: (ih - sh) * fy };
  }
  T.coverMap = coverMap;

  // flous : traits au doigt, en coordonnées de la photo (u, v de 0 à 1 ; r en part de la largeur)
  function blurs(ctx, img, x, y, w, h, v) {
    const list = v && v.blurs;
    if (!img || !list || !list.length) return;
    const m = coverMap(img, w, h, v);
    const k = w / m.sw; // pixels du gabarit par pixel de photo
    list.forEach(function (st) {
      if (!st.pts || !st.pts.length) return;
      const rad = st.r * m.iw * k;
      if (rad < 1) return;
      const pts = st.pts.map(function (p) { return [x + (p[0] * m.iw - m.sx) * k, y + (p[1] * m.ih - m.sy) * k]; });
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      pts.forEach(function (p) { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
      x0 = Math.max(x, Math.floor(x0 - rad)); y0 = Math.max(y, Math.floor(y0 - rad));
      x1 = Math.min(x + w, Math.ceil(x1 + rad)); y1 = Math.min(y + h, Math.ceil(y1 + rad));
      const bw = x1 - x0, bh = y1 - y0;
      if (bw < 2 || bh < 2) return;
      // gros pixels : au moins 1/36 de la largeur, et plus gros pour les grands traits
      const block = Math.max(8, Math.round(Math.max(w / 36, rad * 0.75)));
      const tw = Math.max(1, Math.ceil(bw / block)), th = Math.max(1, Math.ceil(bh / block));
      const small = document.createElement('canvas'); small.width = tw; small.height = th;
      const s = small.getContext('2d'); s.imageSmoothingEnabled = true; s.imageSmoothingQuality = 'high';
      s.drawImage(img, m.sx + (x0 - x) / k, m.sy + (y0 - y) / k, (tw * block) / k, (th * block) / k, 0, 0, tw, th);
      const layer = document.createElement('canvas'); layer.width = bw; layer.height = bh;
      const l = layer.getContext('2d'); l.imageSmoothingEnabled = false;
      l.drawImage(small, 0, 0, tw, th, 0, 0, tw * block, th * block);
      l.globalCompositeOperation = 'destination-in';
      l.lineCap = 'round'; l.lineJoin = 'round'; l.lineWidth = rad * 2; l.strokeStyle = '#000'; l.fillStyle = '#000';
      l.beginPath();
      if (pts.length === 1) { l.arc(pts[0][0] - x0, pts[0][1] - y0, rad, 0, Math.PI * 2); l.fill(); }
      else { l.moveTo(pts[0][0] - x0, pts[0][1] - y0); pts.slice(1).forEach(function (p) { l.lineTo(p[0] - x0, p[1] - y0); }); l.stroke(); }
      ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
      ctx.drawImage(layer, x0, y0);
      ctx.restore();
    });
  }

  function photo(ctx, img, x, y, w, h, v, clipPath) {
    ctx.save();
    if (clipPath) ctx.clip(clipPath); else { ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); }
    if (!img) {
      ctx.fillStyle = T.pal.deep; ctx.fillRect(x, y, w, h);
      // grand symbole ton sur ton, coupé par le bord
      const sw = Math.max(w, h) * 1.15;
      symbol(ctx, x + w * 0.62, y + h * 0.42, sw, { gs: alpha(T.pal.white, 0.06), c: alpha(T.pal.white, 0.06) });
    } else {
      const m = coverMap(img, w, h, v);
      ctx.drawImage(img, m.sx, m.sy, m.sw, m.sh, x, y, w, h);
      blurs(ctx, img, x, y, w, h, v);
    }
    ctx.restore();
  }
  T.photo = photo;

  function shade(ctx, x, y, w, h, a0, a1) {
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, 'rgba(' + T.pal.shade + ',' + a0 + ')'); g.addColorStop(1, 'rgba(' + T.pal.shade + ',' + a1 + ')');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  }

  // ---------- logo ----------
  // mot GCS : hauteur h, coin haut gauche (x, y)
  function word(ctx, x, y, h, col) {
    const b = G.mot.bbox, s = h / (b[3] - b[1]);
    col = col || T.pal.logoDark;
    ctx.save(); ctx.translate(x - b[0] * s, y - b[1] * s); ctx.scale(s, s);
    ctx.fillStyle = col.gs; ctx.fill(P.g); ctx.fill(P.s);
    ctx.fillStyle = col.c; ctx.fill(P.c);
    ctx.restore();
    return (b[2] - b[0]) * s;
  }
  function wordWidth(h) { const b = G.mot.bbox; return (b[2] - b[0]) * h / (b[3] - b[1]); }
  // logo principal (mot + sous-titre), largeur w, coin haut gauche ; signature = avec le métier
  function lockup(ctx, x, y, w, col, kind) {
    const b0 = G.mot.bbox, bl = kind === 'signature' ? G.signature_bbox : G.principal_bbox;
    const s = w / (b0[2] - b0[0]);
    col = col || T.pal.logoDark;
    ctx.save(); ctx.translate(x - b0[0] * s, y - b0[1] * s); ctx.scale(s, s);
    ctx.fillStyle = col.gs; ctx.fill(P.g); ctx.fill(P.s); ctx.fill(P.sub);
    if (kind === 'signature') { ctx.fill(P.rule); ctx.fill(P.met); }
    ctx.fillStyle = col.c; ctx.fill(P.c);
    ctx.restore();
    return (bl[3] - b0[1]) * s;
  }
  function horizontal(ctx, x, y, h, col) {
    const b = G.horiz.bbox, s = h / (G.mot.bbox[3] - G.mot.bbox[1]);
    col = col || T.pal.logoDark;
    ctx.save(); ctx.translate(x - b[0] * s, y - b[1] * s); ctx.scale(s, s);
    ctx.fillStyle = col.gs; ctx.fill(P.g); ctx.fill(P.s); ctx.fill(P.hrule); ctx.fill(P.l1); ctx.fill(P.l2);
    ctx.fillStyle = col.c; ctx.fill(P.c);
    ctx.restore();
    return (b[2] - b[0]) * s;
  }
  // symbole G+C centré en (cx, cy), largeur w ; small = liseré élargi pour les petites tailles
  function symbol(ctx, cx, cy, w, col, small) {
    const b = (small ? G.symS : G.sym).bbox, s = w / (b[2] - b[0]);
    col = col || T.pal.logoDark;
    ctx.save(); ctx.translate(cx - (b[0] + b[2]) / 2 * s, cy - (b[1] + b[3]) / 2 * s); ctx.scale(s, s);
    ctx.fillStyle = col.gs; ctx.fill(small ? P.symSG : P.symG);
    ctx.fillStyle = col.c; ctx.fill(small ? P.symSC : P.symC);
    ctx.restore();
  }
  T.word = word; T.wordWidth = wordWidth; T.lockup = lockup; T.horizontal = horizontal; T.symbol = symbol;

  // ---------- contenu ----------
  // pannes (identifiants du site GCS) : question d'accroche et action faite
  const PANNES = {
    'ecran': ['Écran cassé ?', 'écran changé'], 'batterie': ['Batterie à plat ?', 'batterie changée'],
    'camera-arriere': ['Caméra en panne ?', 'caméra arrière changée'], 'camera-avant': ['Caméra en panne ?', 'caméra avant changée'],
    'lentille-camera': ['Lentille fêlée ?', 'lentille de caméra changée'], 'connecteur-charge': ['Ça ne charge plus ?', 'connecteur de charge changé'],
    'vitre-arriere': ['Vitre arrière fêlée ?', 'vitre arrière changée'], 'haut-parleur': ['Plus de son ?', 'haut-parleur changé'],
    'ecouteur-interne': ['Tu entends mal tes appels ?', 'écouteur interne changé'], 'boutons': ['Bouton bloqué ?', 'bouton réparé'],
    'desoxydation': ['Tombé dans l\'eau ?', 'désoxydation faite'], 'micro-soudure': ['Il ne s\'allume plus ?', 'carte mère réparée']
  };
  T.PANNES = PANNES;
  function lines(d) {
    const t = d.type || 'reparation';
    let label, title, details, note = '';
    if (t === 'accessoire') {
      label = 'ACCESSOIRE';
      title = d.nom || 'Accessoire';
      details = d.compat ? 'Compatible ' + d.compat : '';
    } else if (t === 'recond') {
      label = 'RECONDITIONNÉ';
      title = [d.modele || 'Téléphone', d.capacite].filter(Boolean).join(' · ');
      details = [d.etat, d.batterie && ('Batterie ' + String(d.batterie).replace(/\s*%$/, '') + ' %'), d.garantie && ('Garantie ' + d.garantie)].filter(Boolean).join(' · ');
    } else {
      label = 'RÉPARATION' + (d.panne ? ' · ' + up(d.panne) : '');
      title = d.modele || 'Ton téléphone';
      details = [d.delai, d.garantie && ('Garantie ' + d.garantie)].filter(Boolean).join(' · ');
      if (d.qualite) note = d.qualite;
    }
    const old = d.statut === 'promo' ? T.price(d.ancienPrix) : '';
    return { label: label, title: title, details: details, note: note, old: old, price: T.price(d.prix) };
  }
  T.lines = lines;
  T.headline = function (d) {
    const t = d.type || 'reparation';
    if (d.statut === 'repare') return ['C\'est réparé.', 'Comme promis.'];
    if (d.statut === 'promo') return ['Petit prix,', 'en ce moment.'];
    if (t === 'accessoire') return d.statut === 'stock' ? ['En stock', 'en boutique.'] : ['Nouveau', 'en boutique.'];
    if (t === 'recond') return ['Reconditionné,', d.garantie ? 'garanti ' + d.garantie + '.' : 'testé et garanti.'];
    const k = PANNES[d.panneId || ''];
    return [k ? k[0] : 'En panne ?', 'On répare.'];
  };

  // carte d'infos : mesure puis dessin. Retourne {h, draw(x, y)}
  function card(ctx, d, w, s, opt) {
    opt = opt || {};
    const L = lines(d), pad = 52 * s, inner = w - pad * 2;
    const pillW = L.price ? pricePillWidth(ctx, L.price, s) : 0;
    const items = [];
    let h = pad * 0.92;
    // étiquette
    setFont(ctx, 700, 25 * s);
    const lab = ellipsize(ctx, L.label, Math.max(120 * s, inner - pillW - 40 * s));
    items.push({ kind: 'label', text: lab, y: h + 25 * s * 0.74 }); h += 25 * s + 22 * s;
    // titre (2 lignes max)
    let tpx = fit(ctx, L.title, 800, 84 * s, 58 * s, inner);
    let tl = [L.title];
    if (ctx.measureText(L.title).width > inner) { tpx = 66 * s; setFont(ctx, 800, tpx); tl = wrap(ctx, L.title, inner).slice(0, 2); if (tl.length === 2) tl[1] = ellipsize(ctx, tl[1], inner); }
    tl.forEach(function (ln, i) { items.push({ kind: 'title', text: ln, px: tpx, y: h + tpx * 0.76 + i * tpx * 1.02 }); });
    h += tpx * 0.76 + (tl.length - 1) * tpx * 1.02 + 30 * s;
    if (L.details) {
      const dpx = fit(ctx, L.details, 500, 36 * s, 26 * s, inner);
      items.push({ kind: 'details', text: ellipsize(ctx, L.details, inner), px: dpx, y: h + dpx * 0.74 }); h += dpx + 16 * s;
    }
    const noteParts = [];
    if (L.old) noteParts.push({ old: L.old });
    if (L.note) noteParts.push({ text: L.note });
    if (d.prix && !opt.noTTC) noteParts.push({ text: 'Prix TTC' });
    if (noteParts.length) { items.push({ kind: 'note', parts: noteParts, px: 27 * s, y: h + 27 * s * 0.74 }); h += 27 * s + 10 * s; }
    h += pad * 0.62;
    return {
      h: h, pillW: pillW, L: L,
      draw: function (x, y, bg, ink, labelCol) {
        ctx.fillStyle = bg; ctx.fill(rrPath(x, y, w, h, 44 * s));
        ctx.textBaseline = 'alphabetic';
        items.forEach(function (it) {
          if (it.kind === 'label') { ctx.fillStyle = labelCol; setFont(ctx, 700, 25 * s); spaced(ctx, it.text, x + pad, y + it.y, 3.2 * s, 'left'); }
          if (it.kind === 'title') { ctx.fillStyle = ink; setFont(ctx, 800, it.px); ctx.fillText(it.text, x + pad, y + it.y); }
          if (it.kind === 'details') { ctx.fillStyle = alpha(ink, 0.8); setFont(ctx, 500, it.px); ctx.fillText(it.text, x + pad, y + it.y); }
          if (it.kind === 'note') {
            let cx = x + pad; setFont(ctx, 500, it.px);
            it.parts.forEach(function (p, i) {
              if (i) { ctx.fillStyle = alpha(ink, 0.5); ctx.fillText(' · ', cx, y + it.y); cx += ctx.measureText(' · ').width; }
              if (p.old) {
                ctx.fillStyle = alpha(ink, 0.6); const pre = 'Au lieu de '; ctx.fillText(pre, cx, y + it.y); cx += ctx.measureText(pre).width;
                const ow = ctx.measureText(p.old).width; ctx.fillText(p.old, cx, y + it.y);
                ctx.fillRect(cx - 2 * s, y + it.y - it.px * 0.3, ow + 4 * s, Math.max(2, 2.5 * s)); cx += ow;
              } else { ctx.fillStyle = alpha(ink, 0.6); ctx.fillText(p.text, cx, y + it.y); cx += ctx.measureText(p.text).width; }
            });
          }
        });
      }
    };
  }
  function pricePillWidth(ctx, txt, s) { setFont(ctx, 800, 74 * s); return ctx.measureText(txt).width + 88 * s; }
  // pastille du prix : centrée sur le bord haut de la carte, à droite
  function pricePill(ctx, txt, xRight, yMid, s) {
    const w = pricePillWidth(ctx, txt, s), h = 132 * s;
    return { x: xRight - w, y: yMid - h / 2, w: w, h: h, r: h / 2, txt: txt, s: s };
  }
  function drawPill(ctx, p, bg, ink) {
    ctx.fillStyle = bg; ctx.fill(shapePath(p));
    ctx.fillStyle = ink; setFont(ctx, 800, 74 * p.s); ctx.textBaseline = 'alphabetic';
    ctx.fillText(p.txt, p.x + 44 * p.s, p.y + p.h / 2 + 74 * p.s * 0.36);
  }
  function chip(ctx, d, xRight, yMid, s, onPhoto) {
    const st = T.STATUS[d.statut || ''];
    if (!st) return;
    let txt = st.chip;
    if (d.statut === 'promo') {
      const a = T.num(d.ancienPrix), n = T.num(d.prix);
      if (a && n && a > n) txt += '  −' + Math.round((1 - n / a) * 100) + ' %';
    }
    setFont(ctx, 700, 25 * s);
    const track = 3 * s, tw = spacedWidth(ctx, txt, track), padX = 28 * s, h = 62 * s;
    const strong = st.strong;
    const x = xRight - tw - padX * 2, y = yMid - h / 2;
    ctx.fillStyle = strong ? T.pal.accent : (onPhoto ? T.pal.white : T.pal.paper);
    ctx.fill(rrPath(x, y, tw + padX * 2, h, h / 2));
    ctx.fillStyle = strong ? T.pal.onAccent : T.pal.main; ctx.textBaseline = 'alphabetic';
    spaced(ctx, txt, x + padX, yMid + 25 * s * 0.36, track, 'left');
  }
  function exempleTag(ctx, d, x, y, s, col) {
    if (!d.exemple) return;
    ctx.fillStyle = col; setFont(ctx, 600, 22 * s); ctx.textBaseline = 'alphabetic';
    spaced(ctx, 'EXEMPLE · CHIFFRES FICTIFS', x, y, 2 * s, 'right');
  }

  // ---------- gabarits ----------
  const DRAW = {};

  // post 4:5 : photo pleine page, carte en bas, pastille du prix qui passe devant
  DRAW.post = function (ctx, W, H, d, ph) {
    const img = ph[0], s = 1, m = 48;
    photo(ctx, img, 0, 0, W, H, d.v1);
    if (img) shade(ctx, 0, 0, W, 360, 0.55, 0);
    if (!img) {
      // sans photo : grand titre
      const hl = T.headline(d);
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = T.pal.white; setFont(ctx, 800, fit(ctx, hl[0], 800, 118, 70, W - 128)); ctx.fillText(hl[0], 64, 400);
      ctx.fillStyle = T.pal.hl || T.pal.accent; setFont(ctx, 800, fit(ctx, hl[1], 800, 118, 70, W - 128)); ctx.fillText(hl[1], 64, 530);
    }
    word(ctx, 64, 64, 64, T.pal.logoDark);
    chip(ctx, d, W - 64, 96, s, !!img);
    const c = card(ctx, d, W - m * 2, s);
    const cy = H - m - c.h;
    const pill = c.L.price ? pricePill(ctx, c.L.price, W - m - 40, cy, s) : null;
    withCuts(ctx, W, H, pill ? [grow(pill, 14)] : [], function () { c.draw(m, cy, T.pal.paper, T.pal.ink, T.pal.label || T.pal.main); });
    if (pill) drawPill(ctx, pill, T.pal.accent, T.pal.onAccent);
    exempleTag(ctx, d, W - m - 52, H - m - 30, s, alpha(T.pal.ink, 0.45));
  };

  // story 9:16 : fond de marque, photo dans un cadre, la carte passe devant le cadre
  DRAW.story = function (ctx, W, H, d, ph) {
    const img = ph[0], s = 1.04, m = 48;
    ctx.fillStyle = T.pal.main; ctx.fillRect(0, 0, W, H);
    word(ctx, 64, 250, 66, T.pal.logoDark);
    chip(ctx, d, W - 64, 283, s, false);
    const frame = { x: m, y: 384, w: W - m * 2, h: 1000, r: 48 };
    const cw = W - 64 * 2 - 24;
    const c = card(ctx, d, cw, s);
    const cx = (W - cw) / 2, cy = frame.y + frame.h - 150;
    const cardBox = { x: cx, y: cy, w: cw, h: c.h, r: 44 * s };
    withCuts(ctx, W, H, [grow(cardBox, 16)], function () {
      photo(ctx, img, frame.x, frame.y, frame.w, frame.h, d.v1, shapePath(frame));
      if (!img) {
        const hl = T.headline(d);
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = T.pal.white; setFont(ctx, 800, fit(ctx, hl[0], 800, 112, 66, frame.w - 120)); ctx.fillText(hl[0], frame.x + 60, frame.y + 250);
        ctx.fillStyle = T.pal.hl || T.pal.accent; setFont(ctx, 800, fit(ctx, hl[1], 800, 112, 66, frame.w - 120)); ctx.fillText(hl[1], frame.x + 60, frame.y + 375);
      }
    });
    const pill = c.L.price ? pricePill(ctx, c.L.price, cx + cw - 40, cy, s) : null;
    withCuts(ctx, W, H, pill ? [grow(pill, 14)] : [], function () { c.draw(cx, cy, T.pal.paper, T.pal.ink, T.pal.label || T.pal.main); });
    if (pill) drawPill(ctx, pill, T.pal.accent, T.pal.onAccent);
    // appel à l'action, au-dessus de la zone de réponse d'Instagram
    const ya = cy + c.h + 96;
    ctx.textBaseline = 'alphabetic'; ctx.fillStyle = T.pal.white;
    setFont(ctx, 800, 56); ctx.fillText(d.cta1 || 'Écris-nous en DM', 64, ya);
    ctx.fillStyle = alpha(T.pal.white, 0.72); setFont(ctx, 500, 34);
    ctx.fillText(d.cta2 || '5 rue des Catalpas · Montpellier', 64, ya + 54);
    exempleTag(ctx, d, W - 64, frame.y - 28, s, alpha(T.pal.white, 0.6));
  };

  // avant / après : deux cadres côte à côte, la carte passe devant les deux
  DRAW.avantapres = function (ctx, W, H, d, ph) {
    const s = 1, m = 48, gapX = 24;
    ctx.fillStyle = T.pal.main; ctx.fillRect(0, 0, W, H);
    word(ctx, 64, 64, 60, T.pal.logoDark);
    chip(ctx, Object.assign({}, d, { statut: d.statut || 'repare' }), W - 64, 94, s, false);
    const fw = (W - m * 2 - gapX) / 2, fy = 176, fh = 860;
    const frames = [{ x: m, y: fy, w: fw, h: fh, r: 40 }, { x: m + fw + gapX, y: fy, w: fw, h: fh, r: 40 }];
    const cw = W - 88 * 2;
    const c = card(ctx, d, cw, s);
    const cx = (W - cw) / 2, cy = Math.min(fy + fh - 110, H - m - c.h);
    const cardBox = { x: cx, y: cy, w: cw, h: c.h, r: 44 };
    withCuts(ctx, W, H, [grow(cardBox, 16)], function () {
      frames.forEach(function (f, i) {
        photo(ctx, ph[i] || null, f.x, f.y, f.w, f.h, i ? d.v2 : d.v1, shapePath(f));
        // étiquette AVANT / APRÈS en haut du cadre
        const lab = i ? 'APRÈS' : 'AVANT';
        setFont(ctx, 700, 26); const tw = spacedWidth(ctx, lab, 3.4), lh = 58, lx = f.x + 24, ly = f.y + 24;
        ctx.fillStyle = i ? T.pal.accent : T.pal.white; ctx.fill(rrPath(lx, ly, tw + 52, lh, lh / 2));
        ctx.fillStyle = i ? T.pal.onAccent : T.pal.main; ctx.textBaseline = 'alphabetic';
        spaced(ctx, lab, lx + 26, ly + lh / 2 + 26 * 0.36, 3.4, 'left');
      });
    });
    const pill = c.L.price ? pricePill(ctx, c.L.price, cx + cw - 40, cy, s) : null;
    withCuts(ctx, W, H, pill ? [grow(pill, 14)] : [], function () { c.draw(cx, cy, T.pal.paper, T.pal.ink, T.pal.label || T.pal.main); });
    if (pill) drawPill(ctx, pill, T.pal.accent, T.pal.onAccent);
    exempleTag(ctx, d, W - 64, H - 22, s, alpha(T.pal.white, 0.6));
  };

  // annonce Leboncoin / Vinted : la photo seule, un petit badge GCS (pas de prix ni de coordonnées)
  DRAW.annonce = function (ctx, W, H, d, ph) {
    photo(ctx, ph[0], 0, 0, W, H, d.v1);
    const h = 40, ww = wordWidth(h), padX = 30, bh = h + 44, bw = ww + padX * 2;
    const x = W - 36 - bw, y = H - 36 - bh;
    ctx.fillStyle = T.pal.white; ctx.fill(rrPath(x, y, bw, bh, bh / 2));
    word(ctx, x + padX, y + 22, h, T.pal.logoLight);
    if (d.garantie && d.type !== 'accessoire') {
      const txt = 'GARANTIE ' + up(d.garantie);
      setFont(ctx, 700, 26); const tw = spacedWidth(ctx, txt, 3), gh = 62;
      ctx.fillStyle = T.pal.accent; ctx.fill(rrPath(36, 36, tw + 56, gh, gh / 2));
      ctx.fillStyle = T.pal.onAccent; ctx.textBaseline = 'alphabetic'; spaced(ctx, txt, 64, 36 + gh / 2 + 26 * 0.36, 3, 'left');
    }
  };

  // photo de profil : le symbole sur la couleur principale (Instagram, TikTok, Facebook, Google…)
  DRAW.profil = function (ctx, W, H, d) {
    const v = d.variante || 'main';
    const bg = v === 'blanc' ? T.pal.white : v === 'accent' ? T.pal.accent : T.pal.main;
    const col = v === 'blanc' ? T.pal.logoLight : v === 'accent' ? { gs: T.pal.onAccent, c: T.pal.onAccent } : T.pal.logoDark;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    symbol(ctx, W / 2, H / 2 + H * 0.005, W * 0.6, col, W < 200);
  };

  // couverture Facebook : logo principal à gauche, grand symbole ton sur ton à droite
  function lockupHeight(w, kind) {
    const b0 = G.mot.bbox, bl = kind === 'signature' ? G.signature_bbox : G.principal_bbox;
    return (bl[3] - b0[1]) * w / (b0[2] - b0[0]);
  }
  T.lockupHeight = lockupHeight;
  DRAW.couverture = function (ctx, W, H, d) {
    ctx.fillStyle = T.pal.main; ctx.fillRect(0, 0, W, H);
    symbol(ctx, W * 0.84, H * 0.5, 1100, { gs: alpha(T.pal.white, 0.07), c: alpha(T.pal.white, 0.07) });
    const lw = 520, lh = lockupHeight(lw, 'principal'), x = 300;
    const y = (H - lh - 70) / 2;
    lockup(ctx, x, y, lw, T.pal.logoDark, 'principal');
    ctx.textBaseline = 'alphabetic'; ctx.fillStyle = T.pal.white; setFont(ctx, 500, 27);
    spaced(ctx, d.metier || 'RÉPARATION · ACCESSOIRES · RECONDITIONNÉ', x, y + lh + 70, 3.2, 'left');
  };

  const ICONS = {
    reparations: function (c) { // téléphone et coche
      c.rect(-0.42, -0.72, 0.84, 1.44); c.moveTo(-0.12, -0.56); c.lineTo(0.12, -0.56);
      c.moveTo(-0.2, 0.06); c.lineTo(-0.04, 0.22); c.lineTo(0.24, -0.08);
    },
    avantapres: function (c) { // deux moitiés
      c.rect(-0.72, -0.56, 0.62, 1.12); c.rect(0.1, -0.56, 0.62, 1.12);
    },
    accessoires: function (c) { // câble et prise
      c.rect(-0.26, -0.72, 0.52, 0.5); c.moveTo(-0.12, -0.72); c.lineTo(-0.12, -0.9); c.moveTo(0.12, -0.72); c.lineTo(0.12, -0.9);
      c.moveTo(0, -0.22); c.bezierCurveTo(0, 0.3, 0.5, 0.2, 0.5, 0.6); c.lineTo(0.5, 0.8);
    },
    reconditionnes: function (c) { // flèches en boucle
      c.arc(0, 0, 0.6, Math.PI * 1.1, Math.PI * 1.9); c.moveTo(0.42, -0.66); c.lineTo(0.56, -0.24); c.lineTo(0.14, -0.2);
      c.moveTo(0.6 * Math.cos(Math.PI * 0.1), 0.6 * Math.sin(Math.PI * 0.1)); c.arc(0, 0, 0.6, Math.PI * 0.1, Math.PI * 0.9);
      c.moveTo(-0.42, 0.66); c.lineTo(-0.56, 0.24); c.lineTo(-0.14, 0.2);
    },
    avis: function (c) {
      for (let i = 0; i < 10; i++) {
        const r = i % 2 ? 0.3 : 0.7, a = -Math.PI / 2 + i * Math.PI / 5;
        if (i) c.lineTo(r * Math.cos(a), r * Math.sin(a) + 0.04); else c.moveTo(r * Math.cos(a), r * Math.sin(a) + 0.04);
      }
      c.closePath();
    },
    infos: function (c) { // repère de lieu
      c.moveTo(0, 0.78); c.bezierCurveTo(-0.3, 0.42, -0.56, 0.12, -0.56, -0.2); c.arc(0, -0.2, 0.56, Math.PI, 0); c.bezierCurveTo(0.56, 0.12, 0.3, 0.42, 0, 0.78);
      c.moveTo(0.2, -0.2); c.arc(0, -0.2, 0.2, 0, Math.PI * 2);
    }
  };
  T.ICONS = Object.keys(ICONS);
  T.ICON_LABELS = { reparations: 'Réparations', avantapres: 'Avant / après', accessoires: 'Accessoires', reconditionnes: 'Reconditionnés', avis: 'Avis', infos: 'Infos' };
  function icon(ctx, name, cx, cy, size, color, lw) {
    ctx.save(); ctx.translate(cx, cy); ctx.scale(size / 2, size / 2);
    ctx.lineWidth = lw / (size / 2); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color;
    ctx.beginPath(); ICONS[name](ctx); ctx.stroke(); ctx.restore();
  }
  T.icon = icon;
  // couverture « à la une » Instagram : l'icône au centre (zone ronde)
  DRAW.alaune = function (ctx, W, H, d) {
    ctx.fillStyle = T.pal.main; ctx.fillRect(0, 0, W, H);
    icon(ctx, d.icone || 'reparations', W / 2, H / 2, 360, T.pal.icon || T.pal.accent, 30);
  };

  T.draw = function (kind, canvas, data, photos) {
    const s = T.SIZES[kind]; canvas.width = s[0]; canvas.height = s[1];
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, s[0], s[1]);
    DRAW[kind](ctx, s[0], s[1], data || {}, photos || []);
    return canvas;
  };
  T.FRAMES = { // zone photo de chaque gabarit (pour cadrer depuis l'aperçu)
    post: [[0, 0, 1080, 1350]], story: [[48, 384, 984, 1000]], annonce: [[0, 0, 1200, 1200]],
    avantapres: [[48, 176, 480, 860], [552, 176, 480, 860]]
  };

  root.GCS = T;
})(typeof window !== 'undefined' ? window : this);
