/* GCS · générateur de posts (dans la charte).
   Photo du téléphone, cadrage, flou au doigt, formulaire court : visuels HD et textes prêts.
   Tout se passe dans le navigateur : aucune photo n'est envoyée. */
(function () {
  'use strict';
  const CFG = window.GCS_CFG;              // géométrie du logo, palette, exemple, pannes du site
  GCS.init(CFG.geom, CFG.pal);
  const $ = function (s, r) { return (r || document).querySelector(s); };
  const $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  const root = $('#generateur');
  if (!root) return;

  // ---------- état ----------
  const slots = [mkSlot(), mkSlot()];      // 0 = photo principale (ou « avant »), 1 = photo « après »
  function mkSlot() { return { img: null, name: '', exemple: false, v: { zoom: 1, fx: 0.5, fy: 0.5, blurs: [] } }; }
  let cur = 0, blurOn = false, stroke = null, DL = null, timer = 0, editTimer = 0;
  let exemplePrix = CFG.exemple.prix, prixTouche = false;

  function toast(msg) {
    const t = $('#g-toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { t.hidden = true; }, 2800);
  }
  function val(id) { const e = document.getElementById(id); return e ? String(e.value).trim() : ''; }
  function radio(name) { const e = $('input[name="' + name + '"]:checked', root); return e ? e.value : ''; }
  function slug(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  function tag(s) { const t = slug(s).replace(/-/g, ''); return t ? '#' + t : ''; }
  function lc(s) { s = String(s || ''); return s ? s.charAt(0).toLowerCase() + s.slice(1) : s; }

  function state() {
    const type = radio('g-type') || 'reparation';
    const panneId = val('g-panne');
    const panneNom = panneId === 'autre' ? val('g-panne-autre') : ((CFG.pannes[panneId] || {}).nom || '');
    const statut = radio('g-statut');
    const d = {
      type: type,
      statut: (statut === 'repare' && type !== 'reparation') ? '' : statut,
      modele: type === 'recond' ? val('g-r-modele') : val('g-modele'),
      panneId: panneId, panne: panneNom,
      delai: val('g-delai'), garantie: type === 'recond' ? val('g-r-garantie') : val('g-garantie'),
      prix: type === 'accessoire' ? val('g-a-prix') : type === 'recond' ? val('g-r-prix') : val('g-prix'),
      qualite: val('g-qualite'),
      nom: val('g-a-nom'), compat: val('g-a-compat'),
      capacite: val('g-r-capacite'), etat: val('g-r-etat'), batterie: val('g-r-batterie'),
      ancienPrix: val('g-ancien'),
      v1: slots[0].v, v2: slots[1].v
    };
    // un ancien prix plus bas que le nouveau ne veut rien dire : on ne le barre pas
    if (!(GCS.num(d.ancienPrix) > GCS.num(d.prix))) d.ancienPrix = '';
    d.exemple = !prixTouche && d.type === 'reparation' && d.prix === exemplePrix;
    return d;
  }

  // ---------- textes ----------
  function titre(d) {
    if (d.type === 'accessoire') return d.nom || 'Accessoire';
    if (d.type === 'recond') return [d.modele || 'Téléphone', d.capacite].filter(Boolean).join(' ');
    return d.modele || 'ton téléphone';
  }
  function prixTxt(d, vous) {
    const p = GCS.price(d.prix); if (!p) return '';
    const a = d.statut === 'promo' ? GCS.price(d.ancienPrix) : '';
    return p + ' TTC' + (a ? ' au lieu de ' + a : '');
  }
  function accroche(d, vous) {
    const T = titre(d), P = GCS.PANNES[d.panneId];
    const action = P ? P[1] : (d.panne ? 'réparation faite : ' + lc(d.panne) : 'réparé');
    if (d.type === 'reparation') {
      if (d.statut === 'repare') return 'C\'est réparé. ' + T + ' : ' + action + (d.delai ? ', en ' + d.delai : '') + '.';
      if (d.statut === 'promo') return 'Petit prix en ce moment : ' + lc(d.panne || 'réparation') + ' ' + T + '.';
      if (d.statut === 'nouveau') return 'Nouveau en boutique : réparation ' + lc(d.panne || '') + ' pour ' + T + '.';
      if (d.statut === 'stock') return 'Pièce en stock : ' + lc(d.panne || 'réparation') + ' pour ' + T + '.';
      const q = P ? P[0] : 'En panne ?';
      return q + ' ' + (vous ? 'Nous réparons votre ' : 'On répare ton ') + T + (d.delai ? ' en ' + d.delai : '') + '.';
    }
    if (d.type === 'accessoire') {
      if (d.statut === 'nouveau') return 'Nouveau en boutique : ' + T + '.';
      if (d.statut === 'promo') return 'Petit prix en ce moment : ' + T + '.';
      if (d.statut === 'stock') return 'En stock en boutique : ' + T + '.';
      return T + (d.compat ? ', compatible ' + d.compat : '') + '.';
    }
    if (d.statut === 'nouveau') return 'Nouvel arrivage : ' + T + ' reconditionné.';
    if (d.statut === 'promo') return 'Petit prix en ce moment : ' + T + ' reconditionné.';
    if (d.statut === 'stock') return 'En stock : ' + T + ' reconditionné.';
    return T + ' reconditionné' + (d.garantie ? ', garanti ' + d.garantie : '') + '.';
  }
  function details(d, vous) {
    const L = [];
    if (d.type === 'reparation') {
      if (d.statut === 'repare' || !d.statut) { /* le délai est déjà dans l'accroche */ } else if (d.delai) L.push('Délai : ' + d.delai);
      if (d.garantie) L.push('Garantie ' + d.garantie);
      if (d.qualite) L.push(d.qualite);
    } else if (d.type === 'accessoire') {
      if (d.compat && d.statut) L.push('Compatible ' + d.compat);
    } else {
      if (d.etat) L.push('État : ' + lc(d.etat));
      if (d.batterie) L.push('Batterie ' + String(d.batterie).replace(/\s*%$/, '') + ' %');
      if (d.garantie && d.statut) L.push('Garantie ' + d.garantie);
    }
    const p = prixTxt(d, vous); if (p) L.push(p);
    return L;
  }
  function hashtags(d) {
    const t = ['#gcs'];
    if (d.type === 'reparation') { t.push('#reparationtelephone'); if (d.panneId === 'ecran') t.push('#ecrancasse'); if (d.panneId === 'batterie') t.push('#changementbatterie'); t.push(tag(d.modele)); }
    if (d.type === 'accessoire') { t.push('#accessoirestelephone'); const n = slug(d.nom); if (/coque/.test(n)) t.push('#coque'); if (/chargeur/.test(n)) t.push('#chargeur'); if (/verre|film|protection/.test(n)) t.push('#protectionecran'); }
    if (d.type === 'recond') { t.push('#reconditionne'); t.push(tag(d.modele)); }
    t.push('#montpellier');
    return t.filter(function (x, i, a) { return x && x.length > 1 && a.indexOf(x) === i; }).slice(0, 6).join(' ');
  }
  function legende(d) {   // Instagram, TikTok, Snapchat : tu
    const L = [accroche(d, false)];
    const det = details(d, false);
    if (det.length) L.push('', det.join(' · '));
    L.push('', '📍 ' + CFG.adresse);
    L.push(d.type === 'reparation' ? 'Écris-nous en DM pour un devis.' : 'Écris-nous en DM pour le réserver.');
    L.push('', hashtags(d));
    return L.join('\n');
  }
  function facebook(d) {  // Facebook, post Google : vous
    const L = [accroche(d, true)];
    const det = details(d, true);
    if (det.length) L.push('', det.join(' · '));
    L.push('', 'GCS, ' + CFG.adresse + '.');
    L.push(d.type === 'reparation' ? 'Écrivez-nous ou passez en boutique pour un devis.' : 'Écrivez-nous ou passez en boutique.');
    return L.join('\n');
  }
  function annonceTitre(d) {
    let t;
    if (d.type === 'accessoire') t = [d.nom || 'Accessoire', d.compat && ('compatible ' + d.compat), 'neuf'].filter(Boolean).join(' - ');
    else if (d.type === 'recond') t = [titre(d) + ' reconditionné', d.garantie && ('garantie ' + d.garantie)].filter(Boolean).join(' - ');
    else t = ['Réparation ' + lc(d.panne || 'téléphone') + ' ' + (d.modele || ''), d.delai].filter(Boolean).join(' - ');
    return t.replace(/\s+/g, ' ').trim();
  }
  function annonceTexte(d) {
    const L = ['Bonjour,', ''];
    if (d.type === 'accessoire') {
      L.push(d.nom ? d.nom + ', neuf.' : 'Accessoire neuf.');
      if (d.compat) L.push('Compatible : ' + d.compat + '.');
    } else if (d.type === 'recond') {
      L.push(titre(d) + ' reconditionné : testé et vérifié par notre atelier.');
      L.push('État : ' + (d.etat ? lc(d.etat) : '[à compléter : écran, coque, rayures]') + '.');
      if (d.batterie) L.push('Batterie : ' + String(d.batterie).replace(/\s*%$/, '') + ' % de capacité.');
      L.push('Garantie légale de conformité de 2 ans' + (d.garantie ? ', et garantie GCS de ' + d.garantie : '') + '.');
    } else {
      L.push('Réparation ' + lc(d.panne || '') + ' pour ' + (d.modele || 'votre téléphone') + ', en boutique.');
      if (d.delai) L.push('Délai : ' + d.delai + '.');
      if (d.garantie) L.push('Garantie : ' + d.garantie + '.');
      if (d.qualite) L.push('Pièce : ' + lc(d.qualite) + '.');
    }
    const p = GCS.price(d.prix);
    L.push('Prix : ' + (p ? p + ' TTC' : '[à compléter]') + (d.statut === 'promo' && GCS.price(d.ancienPrix) ? ' (au lieu de ' + GCS.price(d.ancienPrix) + ')' : '') + '.');
    L.push('', d.type === 'reparation' ? 'Réparation sur place, dans notre boutique à Montpellier.' : 'Retrait : [à compléter : en boutique, envoi possible ?]');
    L.push('', 'Vendu par un professionnel : ' + CFG.vendeur + '.');
    return L.join('\n');
  }

  // ---------- rendu ----------
  const OUT = ['post', 'story', 'avantapres', 'annonce'];
  function photos() { return [slots[0].img, slots[1].img]; }
  function render() {
    const d = state();
    OUT.forEach(function (k) {
      const c = document.getElementById('g-cv-' + k);
      const box = document.getElementById('g-out-' + k);
      if (k === 'avantapres') { box.hidden = d.type !== 'reparation'; if (box.hidden) return; }
      GCS.draw(k, c, d, k === 'avantapres' ? photos() : [slots[0].img]);
    });
    $('#g-ap-hint').hidden = !!slots[1].img;
    setText('g-t-legende', legende(d));
    setText('g-t-facebook', facebook(d));
    setText('g-t-titre', annonceTitre(d));
    setText('g-t-annonce', annonceTexte(d));
    $('#g-ancien-wrap').hidden = d.statut !== 'promo';
    $('#g-ex-note').hidden = !d.exemple;
    $$('.g-only-rep', root).forEach(function (e) { e.hidden = d.type !== 'reparation'; });
    $$('.g-only-acc', root).forEach(function (e) { e.hidden = d.type !== 'accessoire'; });
    $$('.g-only-rec', root).forEach(function (e) { e.hidden = d.type !== 'recond'; });
    $('#g-panne-autre-wrap').hidden = !(d.type === 'reparation' && d.panneId === 'autre');
    const rep = $('#g-st-repare'); if (rep) rep.hidden = d.type !== 'reparation';
  }
  function setText(id, t) {
    const el = document.getElementById(id); if (!el) return;
    el.value = t;
    const c = document.querySelector('[data-count="' + id + '"]');
    if (c) c.textContent = Array.from(t).length + ' caractères';
  }
  function schedule() { clearTimeout(timer); timer = setTimeout(render, 120); }

  // ---------- éditeur : photo entière, flou au doigt, cadre du post ----------
  const ed = $('#g-edit'), edBox = $('#g-edit-box');
  function drawEditor() {
    const s = slots[cur], img = s.img;
    const w = Math.max(200, Math.round(edBox.clientWidth * Math.min(2, window.devicePixelRatio || 1)));
    if (!img) {
      ed.width = w; ed.height = Math.round(w * 0.75);
      const c = ed.getContext('2d'); c.fillStyle = CFG.pal.deep; c.fillRect(0, 0, ed.width, ed.height);
      c.fillStyle = 'rgba(255,255,255,.75)'; c.textAlign = 'center'; c.font = '500 ' + Math.round(w / 22) + 'px Jost, Arial, sans-serif';
      c.fillText(cur ? 'Ajoute la photo « après » au-dessus' : 'Ajoute une photo au-dessus', ed.width / 2, ed.height / 2);
      c.textAlign = 'start';
      return;
    }
    const iw = img.width, ih = img.height;
    const maxH = Math.round(window.innerHeight * 0.62 * Math.min(2, window.devicePixelRatio || 1));
    let W = w, H = Math.round(w * ih / iw);
    if (H > maxH) { H = maxH; W = Math.round(H * iw / ih); }
    ed.width = W; ed.height = H;
    ed.style.width = (W / Math.min(2, window.devicePixelRatio || 1)) + 'px';
    const c = ed.getContext('2d');
    GCS.photo(c, img, 0, 0, W, H, { zoom: 1, fx: 0.5, fy: 0.5, blurs: s.v.blurs.concat(stroke && stroke.slot === cur ? [stroke] : []) });
    // cadre du post (4:5) pour la photo principale, cadre « après » pour la 2e
    const fr = cur ? GCS.FRAMES.avantapres[1] : GCS.FRAMES.post[0];
    const m = GCS.coverMap(img, fr[2], fr[3], s.v);
    const x = m.sx / iw * W, y = m.sy / ih * H, cw = m.sw / iw * W, ch = m.sh / ih * H;
    c.save();
    c.fillStyle = 'rgba(0,0,0,.42)';
    c.beginPath(); c.rect(0, 0, W, H); c.rect(x, y, cw, ch); c.fill('evenodd');
    c.setLineDash([Math.max(6, W / 60), Math.max(4, W / 90)]); c.lineWidth = Math.max(2, W / 300); c.strokeStyle = '#FFFFFF';
    c.strokeRect(x, y, cw, ch);
    c.restore();
  }
  function scheduleEditor() { clearTimeout(editTimer); editTimer = setTimeout(drawEditor, 16); }
  function edPoint(e) {
    const r = ed.getBoundingClientRect();
    return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))];
  }
  function setBlur(on) {
    blurOn = on;
    ed.classList.toggle('g-painting', on);
    const b = $('#g-flou'); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.textContent = on ? 'Terminer le flou' : 'Flouter au doigt';
    $('#g-flou-aide').hidden = !on;
  }
  ed.addEventListener('pointerdown', function (e) {
    if (!blurOn || !slots[cur].img) return;
    e.preventDefault();
    try { ed.setPointerCapture(e.pointerId); } catch (_) {}
    const r = Number(val('g-taille') || 5) / 100;
    stroke = { slot: cur, r: r, pts: [edPoint(e)] };
    scheduleEditor();
  });
  ed.addEventListener('pointermove', function (e) {
    if (!stroke) return;
    e.preventDefault();
    const p = edPoint(e), q = stroke.pts[stroke.pts.length - 1];
    if (Math.hypot(p[0] - q[0], p[1] - q[1]) > stroke.r * 0.2) { stroke.pts.push(p); scheduleEditor(); }
  });
  function endStroke() {
    if (!stroke) return;
    slots[stroke.slot].v.blurs.push({ r: stroke.r, pts: stroke.pts });
    stroke = null; drawEditor(); render();
  }
  ed.addEventListener('pointerup', endStroke);
  ed.addEventListener('pointercancel', endStroke);
  $('#g-flou').addEventListener('click', function () {
    if (!slots[cur].img) { toast('Choisis d\'abord une photo.'); return; }
    setBlur(!blurOn);
  });
  $('#g-annuler').addEventListener('click', function () { slots[cur].v.blurs.pop(); drawEditor(); render(); });
  $('#g-effacer').addEventListener('click', function () { slots[cur].v.blurs = []; drawEditor(); render(); });

  // cadrage
  function syncSliders() {
    const v = slots[cur].v;
    $('#g-zoom').value = v.zoom; $('#g-fx').value = v.fx; $('#g-fy').value = v.fy;
  }
  ['g-zoom', 'g-fx', 'g-fy'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', function () {
      const v = slots[cur].v;
      v.zoom = Number(val('g-zoom')) || 1; v.fx = Number(val('g-fx')); v.fy = Number(val('g-fy'));
      scheduleEditor(); schedule();
    });
  });
  $('#g-recentrer').addEventListener('click', function () {
    const v = slots[cur].v; v.zoom = 1; v.fx = 0.5; v.fy = 0.5; syncSliders(); drawEditor(); render();
  });
  // choix de la photo à travailler
  $$('input[name="g-cur"]', root).forEach(function (r) {
    r.addEventListener('change', function () { cur = Number(radio('g-cur')) || 0; setBlur(false); syncSliders(); drawEditor(); });
  });

  // ---------- chargement des photos ----------
  function loadImage(src) {
    return new Promise(function (res, rej) { const i = new Image(); i.onload = function () { res(i); }; i.onerror = rej; i.src = src; });
  }
  function shrink(img) {  // photo réduite à 2400 px de côté au plus (mémoire des téléphones)
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height, k = Math.min(1, 2400 / Math.max(iw, ih));
    const c = document.createElement('canvas'); c.width = Math.round(iw * k); c.height = Math.round(ih * k);
    const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height);
    return c;
  }
  function setPhoto(slot, img, name, exemple) {
    slots[slot] = mkSlot();
    slots[slot].img = img; slots[slot].name = name; slots[slot].exemple = !!exemple;
    const lab = document.getElementById('g-ph-name-' + slot);
    lab.textContent = name;
    const th = document.getElementById('g-ph-thumb-' + slot);
    const tw = 112, k = tw / img.width; th.width = tw; th.height = Math.round(img.height * k);
    th.getContext('2d').drawImage(img, 0, 0, th.width, th.height);
    th.hidden = false;
    document.getElementById('g-ph-del-' + slot).hidden = false;
    cur = slot; const rc = $('input[name="g-cur"][value="' + slot + '"]', root); if (rc) rc.checked = true;
    setBlur(false); syncSliders(); drawEditor(); render();
  }
  [0, 1].forEach(function (slot) {
    document.getElementById('g-photo-' + slot).addEventListener('change', function (e) {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      const url = URL.createObjectURL(f);
      loadImage(url).then(function (i) {
        setPhoto(slot, shrink(i), f.name || 'Ta photo', false);
        URL.revokeObjectURL(url);
        toast(slot ? 'Photo « après » prête' : 'Photo prête : floute ce qui est perso');
      }).catch(function () { toast('Cette photo ne s\'ouvre pas. Essaie une capture ou une photo en JPEG.'); });
      e.target.value = '';
    });
    document.getElementById('g-ph-del-' + slot).addEventListener('click', function () {
      slots[slot] = mkSlot();
      document.getElementById('g-ph-name-' + slot).textContent = slot ? 'Pas de photo « après »' : 'Pas de photo : visuel sans photo';
      document.getElementById('g-ph-thumb-' + slot).hidden = true;
      this.hidden = true;
      setBlur(false); syncSliders(); drawEditor(); render();
    });
  });

  // ---------- formulaire ----------
  const form = $('#g-form');
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  form.addEventListener('input', function (e) {
    if (e.target && (e.target.id === 'g-prix')) prixTouche = true;
    if (e.target && e.target.id === 'g-delai') $('#g-delai').dataset.touche = '1';
    if (e.target && /^g-(zoom|fx|fy|taille)$/.test(e.target.id)) return;
    schedule();
  });
  const anciens = {}; let typeCourant = radio('g-type') || 'reparation';
  form.addEventListener('change', function (e) {
    if (e.target && e.target.name === 'g-type') { // chaque type garde son propre ancien prix
      anciens[typeCourant] = val('g-ancien'); typeCourant = e.target.value;
      $('#g-ancien').value = anciens[typeCourant] || '';
    }
    if (e.target && e.target.id === 'g-panne') {
      const p = CFG.pannes[val('g-panne')];
      if (p && p.duree && !$('#g-delai').dataset.touche) $('#g-delai').value = p.duree;
    }
    schedule();
  });

  // ---------- copier ----------
  function copyFrom(id, btn) {
    const el = document.getElementById(id); const text = el.value;
    function done() { const o = btn.textContent; btn.textContent = 'Copié'; setTimeout(function () { btn.textContent = o; }, 1400); }
    function fallback() { try { el.focus(); el.select(); el.setSelectionRange(0, text.length); } catch (_) {} toast('Texte sélectionné : copie-le avec ton téléphone.'); }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
      else fallback();
    } catch (_) { fallback(); }
  }
  $$('[data-copy]', root).forEach(function (b) { b.addEventListener('click', function () { copyFrom(b.getAttribute('data-copy'), b); }); });

  // ---------- téléchargements ----------
  function fileName(k, d) {
    const what = d.type === 'accessoire' ? d.nom : d.type === 'recond' ? [d.modele, d.capacite].join(' ') : [d.modele, d.panne].join(' ');
    return ['gcs', k, slug(what).slice(0, 40), d.statut].filter(Boolean).join('-') + '.jpg';
  }
  function canvasBlob(c) {
    return new Promise(function (res) { c.toBlob(function (b) { res(b); }, 'image/jpeg', 0.95); });
  }
  function save(name, blob) {
    if (!DL) { toast('Téléchargement indisponible ici : ouvre la charte dans Claude (site ou appli).'); return Promise.resolve(); }
    return DL.save({ filename: name, data: blob }).then(function () { toast('Enregistré : ' + name); }, function (e) {
      const c = e && e.code;
      if (c === 'declined') return;
      if (c === 'rate_limited') { toast('Un enregistrement est déjà en cours : réessaie dans un instant.'); return; }
      toast('Enregistrement impossible (' + (c || 'erreur') + ').');
    });
  }
  $$('[data-dl]', root).forEach(function (b) {
    b.addEventListener('click', function () {
      render();
      const k = b.getAttribute('data-dl'), d = state();
      canvasBlob(document.getElementById('g-cv-' + k)).then(function (bl) { if (bl) return save(fileName(k, d), bl); });
    });
  });
  let zipBusy = false;
  $('#g-zip').addEventListener('click', function () {
    if (zipBusy) return;
    if (!DL) { toast('Téléchargement indisponible ici : ouvre la charte dans Claude (site ou appli).'); return; }
    const btn = this, label = btn.textContent; zipBusy = true; btn.disabled = true; btn.textContent = 'Préparation…';
    render();
    const d = state();
    (window.GCS_ZIP ? window.GCS_ZIP() : Promise.reject(new Error('zip'))).then(function (JSZip) {
      const z = new JSZip();
      const ks = OUT.filter(function (k) { return k !== 'avantapres' || d.type === 'reparation'; });
      return Promise.all(ks.map(function (k) {
        return canvasBlob(document.getElementById('g-cv-' + k)).then(function (bl) { z.file(fileName(k, d), bl); });
      })).then(function () {
        z.file('textes.txt', ['LÉGENDE (Instagram, TikTok, Snapchat)', legende(d), '', 'TEXTE (Facebook, post Google)', facebook(d), '',
          'ANNONCE (Leboncoin, Vinted)', 'Titre : ' + annonceTitre(d), '', annonceTexte(d)].join('\n'));
        return z.generateAsync({ type: 'blob' });
      });
    }).then(function (blob) {
      return save(['gcs', slug(titre(d)).slice(0, 30), 'visuels'].filter(Boolean).join('-') + '.zip', blob);
    }, function () { toast('Le zip n\'a pas pu être préparé : télécharge les images une par une.'); })
      .then(function () { zipBusy = false; btn.disabled = false; btn.textContent = label; });
  });
  function noDownloads() { $('#g-dl-note').hidden = false; }
  // Hors de Claude (page du site) : partage natif du téléphone (« Enregistrer l'image »), sinon téléchargement classique.
  const LOCAL_DL = {
    save: function (o) {
      const file = new File([o.data], o.filename, { type: o.data.type || 'application/octet-stream' });
      const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (mobile && navigator.canShare && navigator.canShare({ files: [file] })) {
        return navigator.share({ files: [file] }).catch(function (e) { if (e && e.name === 'AbortError') throw { code: 'declined' }; throw e; });
      }
      const a = document.createElement('a'); a.href = URL.createObjectURL(o.data); a.download = o.filename;
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      return Promise.resolve();
    }
  };
  if (window.GCS_AUTONOME) DL = LOCAL_DL;
  else try {
    if (window.claude && typeof window.claude.use === 'function') {
      window.claude.use('downloads').then(function (ns) { DL = ns; if (!ns) noDownloads(); }, noDownloads);
    } else noDownloads();
  } catch (_) { noDownloads(); }

  // ---------- démarrage ----------
  window.addEventListener('resize', function () { scheduleEditor(); });
  const fontsReady = (document.fonts && document.fonts.load)
    ? Promise.all([400, 500, 600, 700, 800].map(function (w) { return document.fonts.load(w + ' 40px Jost'); })).catch(function () {})
    : Promise.resolve();
  render(); drawEditor();
  fontsReady.then(function () {
    render(); drawEditor();
    if (!CFG.exemple.photo) return;
    return loadImage(CFG.exemple.photo).then(function (i) {
      setPhoto(0, shrink(i), CFG.exemple.photoNom || 'Photo d\'exemple', true);
      if (CFG.exemple.blurs) { slots[0].v.blurs = CFG.exemple.blurs.slice(); drawEditor(); render(); }
    }, function () {});
  });
  window.GCS_GEN = { state: state, render: render, slots: slots, legende: legende, facebook: facebook, annonceTitre: annonceTitre, annonceTexte: annonceTexte };
})();
