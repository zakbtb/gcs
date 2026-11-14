"""Régénère le catalogue de la boutique (data/produits.json) à partir du fichier Excel du fournisseur.

Usage (à la racine du projet) :
    python3 scripts/importer-catalogue.py                      # lit Catalogue_Utopya_GCS_dropshipping.xlsx
    python3 scripts/importer-catalogue.py chemin/vers/fichier.xlsx

- Téléphones, tablettes, montres : onglet « Export site » ; accessoires : onglet « Export accessoires ».
- Seules les lignes « Publier = Oui » sont importées. Les prix sont les valeurs calculées des formules.
- Les onglets internes (prix d'achat, marge, stock, liens fournisseur) ne sont jamais lus.
- Écrit aussi data/photos-catalogue.json (réf -> adresse de la photo source), utilisé par
  scripts/telecharger-photos.mjs pendant la mise en ligne pour héberger les photos dans le site.
- Le fichier Excel ne doit JAMAIS être envoyé sur GitHub (il est dans .gitignore).
"""
import json, re, sys, unicodedata
from pathlib import Path
import openpyxl

RACINE = Path(__file__).resolve().parent.parent
EXCEL = Path(sys.argv[1]) if len(sys.argv) > 1 else RACINE / "Catalogue_Utopya_GCS_dropshipping.xlsx"
PRODUITS = RACINE / "data" / "produits.json"
PHOTOS = RACINE / "data" / "photos-catalogue.json"
GARANTIE_APPAREILS = "12 mois"  # doit correspondre à boutique.garantieReconditionneMois
DELAI = "Commandé sur demande, disponible sous 2 à 4 jours ouvrés, en retrait gratuit à la boutique GCS de Montpellier ou en livraison."

CATEGORIES_APPAREILS = {
    "Smartphone": ("smartphones", "Smartphones", "iPhone reconditionnés et d'occasion, testés et garantis."),
    "Tablette": ("tablettes", "Tablettes", "iPad reconditionnés et d'occasion, testés et garantis."),
    "Montre": ("montres", "Montres connectées", "Apple Watch reconditionnées et d'occasion, testées et garanties."),
}
CATEGORIES_ACCESSOIRES = {
    "Chargeurs": ("chargeurs", "Chargeurs", "Chargeurs secteur rapides USB-C et USB."),
    "Câbles": ("cables", "Câbles", "Câbles USB-C, Lightning et tressés."),
    "Charge sans fil": ("charge-sans-fil", "Charge sans fil", "Chargeurs à induction et MagSafe."),
    "Batteries externes": ("batteries-externes", "Batteries externes", "Batteries externes et PowerBank."),
    "Audio": ("audio", "Écouteurs & audio", "Écouteurs sans fil, filaires et casques."),
    "Enceintes": ("enceintes", "Enceintes", "Enceintes Bluetooth."),
    "Voiture": ("voiture", "Voiture", "Supports et chargeurs voiture."),
    "Accessoires": ("accessoires-divers", "AirTag, MagSafe & PopSockets", "Petits accessoires du quotidien."),
    "Dragonnes & chaînes": ("dragonnes-chaines", "Dragonnes & chaînes", "Chaînes et cordons pour porter son téléphone."),
}
ETATS = {
    "Neuf": "Neuf, jamais utilisé.",
    "Reconditionné": "Testé et remis en état par un professionnel.",
    "Fonctionnel": "Occasion testée et 100 % fonctionnelle, aspect selon le grade.",
}
INTERDITS = re.compile(r"utopya", re.I)


def slugify(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def txt(v):
    return str(v).strip() if v not in (None, "") else ""


def propre(s):
    """Retire toute mention du fournisseur d'un texte affiché."""
    return re.sub(r"\s{2,}", " ", INTERDITS.sub("", s)).strip()


def extension(url):
    m = re.search(r"\.(webp|jpe?g|png)(?:$|\?)", url, re.I)
    return (m.group(1).lower().replace("jpeg", "jpg")) if m else "webp"


def lignes(ws):
    entetes = [txt(c.value) for c in ws[1]]
    col = {nom: i for i, nom in enumerate(entetes)}
    for row in ws.iter_rows(min_row=2, values_only=True):
        if row[col["Réf"]] and txt(row[col["Publier"]]) == "Oui":
            yield lambda k, row=row: txt(row[col[k]]) if k in col else "", row, col


def connectique(titre):
    t = titre.lower()
    out = []
    if "lightning" in t:
        out.append("Lightning")
    if "usb-c" in t or "type-c" in t:
        out.append("USB-C")
    if "magsafe" in t or "magnétique" in t:
        out.append("MagSafe")
    return out


def main():
    wb = openpyxl.load_workbook(EXCEL, data_only=True)
    ancien = json.loads(PRODUITS.read_text(encoding="utf-8")) if PRODUITS.exists() else {}
    # On garde uniquement les produits ajoutés à la main (ni appareil, ni accessoire importé, ni exemple)
    gardes = [p for p in ancien.get("produits", []) if p.get("manuel")]
    photos, produits, cats_utilisees = {}, [], []

    # ---------- Téléphones, tablettes, montres ----------
    for g, row, col in lignes(wb["Export site"]):
        ref, titre, famille = g("Réf"), propre(g("Titre")), g("Catégorie")
        cid, cnom, cdesc = CATEGORIES_APPAREILS.get(famille, CATEGORIES_APPAREILS["Smartphone"])
        cats_utilisees.append((cid, cnom, cdesc))
        etat, grade, version, couleur, info = g("État"), g("Grade"), g("Version"), g("Couleur"), g("Info client")
        grade_txt = "A, B ou C (au hasard)" if grade.startswith("Mix") else grade if grade not in ("", "—") else ""
        couleur_txt = "Au hasard" if "aléatoire" in couleur.lower() else couleur
        version_txt = version if version and version != "Non précisée" else ""
        if info.lower().startswith("version") and version_txt:
            info = f"Version {version_txt}"
        caract = {"État": etat}
        if grade_txt:
            caract["Grade"] = grade_txt
        caract["Capacité"] = g("Capacité")
        if couleur_txt:
            caract["Couleur"] = couleur_txt
        if version_txt:
            caract["Version"] = version_txt
        for i, morceau in enumerate(x.strip() for x in g("Caractéristiques").split(";") if x.strip()):
            caract["Caractéristiques" if i == 0 else f"Caractéristiques ({i + 1})"] = propre(morceau)
        caract["Garantie"] = GARANTIE_APPAREILS
        resume = " · ".join(x for x in [
            etat + (f" grade {grade_txt}" if grade_txt and not grade.startswith("Mix") else ""),
            g("Capacité"),
            couleur_txt if couleur_txt != "Au hasard" else "",
            f"version {version_txt}" if version_txt else "",
        ] if x)
        url = g("Image (URL)")
        image = f"/images/catalogue/{ref.lower()}.{extension(url)}" if url else "/images/appareils-generique.svg"
        if url:
            photos[ref.lower()] = url
        produits.append({
            "id": ref.lower(),
            "slug": slugify(f"{titre}-{ref}"),
            "nom": titre,
            "categorie": cid,
            "marque": "Apple" if re.search(r"iphone|ipad|apple|watch", titre, re.I) else "",
            "prix": float(row[col["Prix TTC (€)"]]),
            "description": resume,
            "descriptionLongue": " ".join(x for x in [
                f"{titre}.", ETATS.get(etat, ""),
                "Le grade (A, B ou C) et la couleur sont attribués selon l'arrivage : vous ne les choisissez pas, d'où ce prix." if grade.startswith("Mix") else "",
                f"Appareil en version {version_txt}." if version_txt else "",
                DELAI, f"Garantie {GARANTIE_APPAREILS}.",
            ] if x),
            "images": [image],
            "compatibilite": [],
            "caracteristiques": caract,
            "options": [],
            "variantes": [],
            "stock": 99,
            "surCommande": True,
            "appareil": {
                "reference": ref,
                "modele": re.sub(r"\bMini\b", "mini", propre(g("Modèle"))),
                "capacite": g("Capacité"),
                "couleur": couleur_txt,
                "etat": etat,
                "grade": grade_txt,
                "version": version_txt,
                **({"infoClient": info} if info else {}),
            },
            "actif": True,
        })

    # ---------- Accessoires ----------
    vus = set()
    for g, row, col in lignes(wb["Export accessoires"]):
        ref, titre, cat = g("Réf"), propre(g("Titre")), g("Catégorie")
        cid, cnom, cdesc = CATEGORIES_ACCESSOIRES.get(cat, ("accessoires-divers", cat, ""))
        cats_utilisees.append((cid, cnom, cdesc))
        marque = propre(g("Marque"))
        conn = connectique(titre)
        url = g("Image (URL)")
        image = f"/images/catalogue/{ref.lower()}.{extension(url)}" if url else "/images/appareils-generique.svg"
        if url:
            photos[ref.lower()] = url
        caract = {"Marque": marque, "Catégorie": cnom}
        if conn:
            caract["Connectique"] = ", ".join(conn)
        caract["Garantie"] = "2 ans (garantie légale de conformité)"
        misEnAvant = cid not in vus and cid in ("chargeurs", "cables", "batteries-externes", "audio")
        vus.add(cid)
        produits.append({
            "id": ref.lower(),
            "slug": slugify(f"{titre}-{ref}"),
            "nom": titre,
            "categorie": cid,
            "marque": marque,
            "prix": float(row[col["Prix TTC (€)"]]),
            "description": f"{cnom} · {marque}" + (f" · {', '.join(conn)}" if conn else ""),
            "descriptionLongue": f"{titre}. {DELAI}",
            "images": [image],
            "compatibilite": conn,
            "caracteristiques": caract,
            "options": [],
            "variantes": [],
            "stock": 99,
            "surCommande": True,
            "accessoire": {"reference": ref},
            **({"misEnAvant": True} if misEnAvant else {}),
            "actif": True,
        })

    categories, ids = [], set()
    for cid, cnom, cdesc in cats_utilisees:
        if cid not in ids:
            ids.add(cid)
            categories.append({"id": cid, "nom": cnom, "description": cdesc})
    for p in gardes:
        if p["categorie"] not in ids:
            ids.add(p["categorie"])
            categories.append(next((c for c in ancien.get("categories", []) if c["id"] == p["categorie"]), {"id": p["categorie"], "nom": p["categorie"], "description": ""}))

    sortie = {
        "_aide": "Généré par scripts/importer-catalogue.py depuis le fichier Excel. Ne pas modifier à la main : relancer le script.",
        "categories": categories,
        "produits": produits + gardes,
    }
    texte = json.dumps(sortie, ensure_ascii=False, indent=2)
    assert not INTERDITS.search(texte), "Le nom du fournisseur ne doit pas apparaître dans le catalogue du site"
    PRODUITS.write_text(texte + "\n", encoding="utf-8")
    PHOTOS.write_text(json.dumps(photos, indent=1) + "\n", encoding="utf-8")
    n_app = sum(1 for p in produits if "appareil" in p)
    print(f"{n_app} appareils + {len(produits) - n_app} accessoires importés ({len(photos)} photos à télécharger)")


main()
