"""Importe le catalogue dropshipping Utopya dans data/produits.json.

Usage : python3 scripts/importer-utopya.py Catalogue_Utopya_GCS_dropshipping.xlsx [images.json]

Lit UNIQUEMENT l'onglet « Export site » (lignes Publier = Oui).
Le prix d'achat, la marge, le stock et les liens Utopya (onglet Catalogue) ne sont jamais lus.
Le fichier Excel ne doit PAS être ajouté au dépôt (il contient les prix d'achat).
Le 2e argument (facultatif) reçoit la liste réf -> URL d'image source pour le téléchargement des photos.
"""
import json, re, sys, unicodedata
from pathlib import Path
import openpyxl

# Garantie commerciale GCS sur les appareils (mois) : doit correspondre à boutique.garantieReconditionneMois
GARANTIE_MOIS = 6

RACINE = Path(__file__).resolve().parent.parent
FICHIER = RACINE / "data" / "produits.json"
CATEGORIES = {
    "Smartphone": ("smartphones-reconditionnes", "Smartphones reconditionnés", "iPhone reconditionnés et d'occasion testés et garantis."),
    "Tablette": ("tablettes", "Tablettes", "iPad reconditionnés et d'occasion testés et garantis."),
    "Montre": ("montres", "Montres connectées", "Apple Watch reconditionnées et d'occasion testées."),
}
ETATS = {
    "Neuf": "Neuf, jamais utilisé.",
    "Reconditionné": "Testé et remis en état par un professionnel.",
    "Fonctionnel": "Occasion testée et 100 % fonctionnelle, aspect selon le grade.",
}


def slugify(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def texte(v):
    return str(v).strip() if v not in (None, "") else ""


def main():
    wb = openpyxl.load_workbook(sys.argv[1], data_only=True)
    ws = wb["Export site"]
    entetes = [texte(c.value) for c in ws[1]]
    col = {nom: i for i, nom in enumerate(entetes)}
    cat = json.loads(FICHIER.read_text(encoding="utf-8"))
    cat["produits"] = [p for p in cat["produits"] if not p.get("appareil")]
    utilisees = set()
    images = {}
    nouveaux = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        g = lambda k: texte(row[col[k]])
        if not g("Réf") or g("Publier") != "Oui":
            continue
        ref, titre, famille = g("Réf"), g("Titre"), g("Catégorie")
        cid, cnom, cdesc = CATEGORIES.get(famille, CATEGORIES["Smartphone"])
        utilisees.add(famille)
        etat, grade, version = g("État"), g("Grade"), g("Version")
        couleur = g("Couleur")
        info = g("Info client")
        if info.lower().startswith("version"):
            info = ""  # note interne : la version est affichée dans les caractéristiques
        grade_txt = "A, B ou C (au hasard)" if grade.startswith("Mix") else grade if grade not in ("", "—") else ""
        couleur_txt = "Au hasard" if "aléatoire" in couleur.lower() else couleur
        version_txt = version if version and version != "Non précisée" else ""
        caract = {"État": etat}
        if grade_txt:
            caract["Grade"] = grade_txt
        caract["Capacité"] = g("Capacité")
        if couleur_txt:
            caract["Couleur"] = couleur_txt
        if version_txt:
            caract["Version"] = version_txt
        for morceau in g("Caractéristiques").split(";"):
            if morceau.strip():
                caract.setdefault("Détail" if "Détail" not in caract else f"Détail {len(caract)}", morceau.strip())
        caract["Garantie"] = f"{GARANTIE_MOIS} mois (GCS) + garantie légale"
        resume = " · ".join(x for x in [etat + (f" grade {grade_txt}" if grade_txt and not grade.startswith("Mix") else ""), g("Capacité"), couleur_txt if couleur_txt != "Au hasard" else "", f"version {version_txt}" if version_txt else ""] if x)
        slug = slugify(f"{titre}-{ref}")
        image_locale = f"/images/appareils/{ref.lower()}.webp"
        if g("Image (URL)"):
            images[ref.lower()] = g("Image (URL)")
        longue = (
            f"{titre}. {ETATS.get(etat, '')} "
            + ("Le grade (A, B ou C) et la couleur sont attribués selon l'arrivage : vous ne les choisissez pas, d'où ce prix. " if grade.startswith("Mix") else "")
            + (f"Appareil en version {version_txt}. " if version_txt else "")
            + f"Commandé sur demande auprès de notre fournisseur, disponible sous 2 à 4 jours ouvrés, en retrait à la boutique GCS de Montpellier ou en livraison. Garantie GCS de {GARANTIE_MOIS} mois en plus de la garantie légale de conformité. Câble de charge offert."
        )
        nouveaux.append({
            "id": ref.lower(),
            "slug": slug,
            "nom": titre,
            "categorie": cid,
            "marque": "Apple",
            "prix": float(row[col["Prix TTC (€)"]]),
            "description": resume,
            "descriptionLongue": longue,
            "images": [image_locale],
            "compatibilite": [],
            "caracteristiques": caract,
            "options": [],
            "variantes": [],
            "stock": 99,
            "surCommande": True,
            "appareil": {
                "reference": ref,
                "modele": g("Modèle"),
                "capacite": g("Capacité"),
                "couleur": couleur_txt,
                "etat": etat,
                "grade": grade_txt,
                "version": version_txt,
                **({"infoClient": info} if info else {}),
            },
            "actif": True,
        })
    cat["produits"] = nouveaux + cat["produits"]
    ids = {c["id"] for c in cat["categories"]}
    for famille in reversed(["Smartphone", "Tablette", "Montre"]):
        cid, cnom, cdesc = CATEGORIES[famille]
        if famille in utilisees and cid not in ids:
            cat["categories"].insert(0, {"id": cid, "nom": cnom, "description": cdesc})
    FICHIER.write_text(json.dumps(cat, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if len(sys.argv) > 2:
        Path(sys.argv[2]).write_text(json.dumps(images, indent=1), encoding="utf-8")
    print(f"{len(nouveaux)} appareils importés")


main()
