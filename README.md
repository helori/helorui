# helorui

Vue3 components library

## Installation

Les composants s'appuient sur Tailwind CSS 3 et sur une feuille de classes communes
(boutons, champs, étiquettes, tableaux, menus). Dans la feuille Tailwind du projet :

```css
@import 'helorui/src/css/helorui.css';

@tailwind base;
@tailwind components;
@tailwind utilities;
```

Dans `tailwind.config.js` :

- `content` doit lister `'./node_modules/helorui/**/*.vue'` ;
- `theme.colors` doit déclarer `primary`, `slate`, `red`, `amber`, `emerald` et `blue`.

Enregistrement global des composants :

```js
import * as helorui from 'helorui'

for(const [name, component] of Object.entries(helorui.components)) {
    app.component(name, component);
}
app.config.globalProperties.$filters = helorui.filters;
```

## Mise en page

| Composant | Rôle |
|---|---|
| `side-nav-layout` | menu latéral (groupes, icônes Heroicons, entrée active) et zone de contenu qui défile ; remplit son parent positionné |
| `app-page` | une page : titre `h1`, phrase grise (slot `description`), actions à droite (slot `actions`) ; `wide` pour un tableau, `full` pour une page d'outil |
| `app-section` | une carte blanche : titre, description, slot `actions`, pied gris clair (slot `footer`) pour les boutons |
| `stat-tiles` | une rangée de chiffres clés : `items = [{ label, value, suffix?, sub? }]` |
| `form-field` | un champ : libellé au-dessus en gras, aide dessous (`hint`) ; le slot reçoit l'`id` du libellé |

## Administration générique

`generic-table` (liste) et `generic-singleton` (réglages) construisent une page d'admin
à partir d'une liste de champs. Options de `generic-table` en plus des champs :
`description`, `createLabel` (« Nouvelle version »), `itemLabel` (champ qui nomme un
élément dans les popups), `canCreate`, `canUpdate`, `canDelete`, `orderBy`, `orderDir`,
`orderableBy`, `storageKey`.

Le slot `before-list` de `generic-table` accueille un contenu entre le titre et la liste
(chiffres clés, graphique).

Options d'un champ :

| Clé | Effet |
|---|---|
| `type` | `text`, `email`, `password`, `number`, `date`, `time`, `textarea`, `html`, `boolean`, `select`, `slug`, `media`, `medias` ; tout autre type est affiché sans être modifiable |
| `description` | aide sous le champ du formulaire |
| `table` | `false` pour masquer la colonne, ou une liste de sous-champs empilés dans la cellule (`{ name, type, class: 'cell-main' / 'cell-sub' }`) |
| `class` | classe de la cellule (`cell-main` pour le texte principal) |
| `sortable` | colonne triable |
| `trueLabel` / `falseLabel` | libellés de l'étiquette d'un booléen (« Publié » / « Non publié ») |
| `accept` | types de fichiers d'un `media` / `medias` (`.dmg,.pkg`) ; images seules par défaut |
| `options` | `[{ value, label }]` d'un `select` |
| `editable` | `false` pour exclure le champ du formulaire |
