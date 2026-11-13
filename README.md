# helorui

Vue3 components library

## Installation

Version 2 : **Tailwind CSS 4**. La version 1.x reste celle des projets en Tailwind 3.

Les composants s'appuient sur une feuille de classes communes (boutons, champs,
étiquettes, tableaux, menus). Dans la feuille Tailwind du projet :

```css
@import 'tailwindcss';
@import 'helorui/src/css/helorui.css';

/* Mode sombre par classe (sinon dark: suit le réglage du système) */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
    --color-primary-50: …;   /* jusqu'à --color-primary-950 */
}
```

- La feuille déclare elle-même les composants comme source Tailwind (`@source`) :
  pas de `content` à configurer.
- Seule `primary` est à déclarer ; `slate`, `red`, `amber`, `emerald` et `blue`
  viennent de la palette de Tailwind. Un projet aux neutres chauds peut
  redéfinir `--color-slate-*` dans son `@theme`.

### Passer de la version 1 à la version 2

- Les classes des composants suivent les noms de Tailwind 4 (`shadow-xs`,
  `rounded-sm`, `outline-hidden`, `grow`…) ; l'API des composants ne change pas.
- Dans le projet : `tailwind.config.js` remplacé par `@theme` et `@source`,
  et la ligne `@custom-variant dark` pour garder le mode sombre par classe.
- `window.tailwindcss` n'existe plus : `ListHeader` et `SideNavLayout` testent
  les points de rupture `md` (48rem) et `lg` (64rem) en dur.
- Aucun composant n'a plus de `<style>` avec `@apply` (il ne verrait pas le
  `@theme` du projet) : la pagination est dans `helorui.css`.
- `space-y-*` pose maintenant une marge **basse** sur chaque enfant : une marge
  négative sur un enfant (ex. `-mb-3`) la remplace au lieu de la réduire.
- Les composants importent `luxon`, `numeral`, `vue-i18n`, `flatpickr` pour
  certains d'entre eux : un projet qui ne les installe pas importe les
  composants un par un (`helorui/src/Components/AppPage.vue`) plutôt que
  l'index, et fournit `$t` s'il n'a pas vue-i18n.

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
