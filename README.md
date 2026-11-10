# Jöro Kaffé — site vitrine

Site statique d'une seule page (HTML / CSS / JS sans dépendance ni étape de build), tiré de la maquette `Jöro Kaffé, coffee shop de spécialité à Paris 9e (Pigalle) (1).html`.

## Structure

```
index.html              page unique (sections : héros, lieu, travailler ici, galerie, carte, avis, Jöro House, infos)
assets/css/style.css    tout le style (variables de la charte en tête de fichier)
assets/js/main.js       statut ouvert/fermé, menu collant de la carte, carte Google au clic, fenêtres légales
assets/fonts/           Market Deco, Ivy Presto, General Sans, Josefin Sans (repli pour les accents)
assets/img/             logos, photos, visuels des sandwichs, logos presse
```

## Lancer en local

```bash
python3 -m http.server 4173
```

Puis ouvrir http://localhost:4173.

## Où modifier les contenus

- **Horaires affichés** : bloc « Horaires » de `index.html`, et pied de page.
- **Statut Ouvert / Fermé** : tableaux `HOURS`, `CLOSURES` et `SPECIAL` en tête de `assets/js/main.js` (la fermeture du 11 novembre 2026 y est déjà).
- **Carte et prix** : section `#carte` de `index.html`. Les boissons de saison sont dans le bloc `.season`.
- **Avis Google (4,9/5, 192 avis)** : saisis à la main dans la section `#avis`, relevés sur la fiche Google en octobre 2026. Pas de mise à jour automatique.

## À faire avant la mise en ligne (repris des commentaires de la maquette)

- [ ] **Hébergeur** : à compléter dans les mentions légales (repère jaune `.tbc` dans `index.html`).
- [ ] **Textes légaux** : mentions légales et politique de confidentialité sont un brouillon à faire valider (juridique + Maelle).
- [ ] **Nom de domaine** : `https://joro-kaffe.com/` est une hypothèse de travail. À remplacer dans `canonical`, `og:url`, `og:image`, `twitter:image` et le JSON-LD (`url`, `image`, `hasMenu`).
- [x] **Image de partage** : `og-jorokaffe.jpg` (1200 × 630, logo sur fond crème) est à la racine. Elle ne s'affichera dans les aperçus (Slack, WhatsApp…) que lorsque l'adresse `https://joro-kaffe.com/og-jorokaffe.jpg` répond, donc une fois le domaine confirmé et relié au site.
- [ ] **Favicon** : aucune balise `icon` dans la maquette.
- [ ] **Police Market Deco** : le fichier fourni n'a pas les lettres accentuées. Un script les recompose pour l'instant (fin de `main.js`). À retirer dès qu'on a la version complète.
- [ ] **Affiches « 1 consommation toutes les 2 h »** à intégrer (visuels à demander à Sam et Justine).
- [ ] **Formules** petit-déjeuner et déjeuner : emplacement prévu dans la carte, « Bientôt ».
- [ ] Retirer les repères « à confirmer » (`.tbc`, `[data-tbc]`) une fois les points ci-dessus réglés.
