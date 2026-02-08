# Larmet 🚨

En modern och elegant webbapplikation för att övervaka och söka bland larmevent i realtid.

## Om projektet

Larmet är en Vue 3 + TypeScript + Vite-baserad applikation som gör det enkelt att:
- 🔍 Söka efter larmevent efter stad
- 📋 Filtrera efter larmtyp
- 📅 Filtrera efter datum
- 📰 Läsa detaljerade artiklar om varje larm
- 🎨 Navigera i ett modernt, responsivt gränssnitt

## Teknologier

- **Frontend Framework**: Vue 3 med Composition API
- **Språk**: TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS
- **API**: Custom backend för larmevent och artikeldata

## Komma igång

### Installation

```bash
# Installera dependencies
npm install

# Starta utvecklingsserver
npm run dev

# Build för produktion
npm run build
```

### Releasehantering

Projektet använder `standard-version` för automatisk versionshantering:

```bash
# Lokal release
npm run release

# GitHub Actions hanterar automatisk release på push till main
```

## Mappstruktur

```
src/
├── components/        # Vue-komponenter
├── composables/      # Vue composition functions
├── types/            # TypeScript typdefintioner
├── assets/           # Statiska resurser
├── App.vue           # Huvudkomponent
├── main.ts           # Entry point
└── style.scss        # Global styling
```

## Bidrag

Gärna skapa en issue eller pull request för förbättringar!

## Licens

MIT © Jonas Larsson
