# F1 Angular App

Aplicación web con Angular 20 que consume la API de Fórmula 1 (https://f1api.dev). Permite explorar equipos, buscar pilotos y visualizar estadísticas de temporadas.

## Stack técnico

- Angular 20 (Standalone Components)
- TypeScript 5.8
- NG-Zorro Ant Design 20
- Chart.js 4.4 + ng2-charts 6
- RxJS 7.8
- ESLint 9 + Prettier 3
- Husky 9 (pre-commit hooks)

## Requisitos

- Node.js 20+
- NPM

## Instalación

```powershell
npm install
```

## Desarrollo

```powershell
npm start
```

Navegar a http://localhost:4200

## Build

```powershell
npm run build
```

---

## Scripts útiles

```powershell
npm start            # Ejecutar en desarrollo
npm run build        # Build de producción
npm run lint         # Lint (ESLint)
npm run lint:fix     # Lint con autofix
npm run format       # Formatear con Prettier
npm run format:check # Verificar formato con Prettier
npm run type-check   # Chequeo de tipos (tsc --noEmit)
```

## Calidad de código

- Pre-commit ejecuta ESLint, Prettier y type-check
- `npm run lint` y `npm run type-check` para feedback rápido

## Arquitectura

- Angular 20 Standalone Components
- Feature-based routing con lazy loading
- NG-Zorro Ant Design
- RxJS para búsquedas (debounce + switchMap)
- Chart.js + ng2-charts
- OnPush change detection
- Signals para estado reactivo
- Path aliases con `@`

Estructura principal:

```
src/app/
  core/
    services/
      f1-api.service.ts         # Servicio centralizado de API
      image-mapper.service.ts   # Mapeo de imágenes de equipos/pilotos
      error-handler.service.ts  # Manejo centralizado de errores
      utils.service.ts          # Utilidades (fechas, formateo, etc.)
    constants/                  # (reservado para futuras constantes)
  shared/
    models/                     # Modelos TS (driver, team, standings)
      driver.model.ts
      team.model.ts
      standings.model.ts
    components/                 # Componentes reutilizables
      entity-card/              # Card genérico para equipos/pilotos
      info-row/                 # Fila de información (label: valor)
      loading-wrapper/          # Wrapper de loading
      empty-state/              # Estado vacío reutilizable
    constants/
      f1.constants.ts           # Constantes de la aplicación
    navbar/                     # Navbar responsivo
    header/                     # Header de página
    sidebar/                    # Sidebar (desktop)
    year-selector/              # Selector de año reutilizable
    ng-zorro-modules.ts         # Módulos de NG-Zorro organizados
  features/
    teams/
      team-list/
        teams-list.component.*  # Listado de equipos
      team-detail/
        team-detail.component.* # Detalle de equipo + pilotos
    drivers/
      drivers-search.component.*# Buscador de pilotos
    charts/
      charts-season.component.* # Gráficas de temporada
  home/
    home.component.*            # Página de inicio
  layout/
    main-layout/
      main-layout.component.*   # Layout principal
  app.component.*               # Componente raíz
  app.routes.ts                 # Definición de rutas
main.ts                         # bootstrapApplication + providers
styles/
  index.scss                    # Estilos globales
  _page-common.scss             # Estilos comunes de página
  tokens/
    _tokens.scss                # Design tokens (colores, espaciado)
    themes/
      _dark.scss                # Tema oscuro
  mixins/
    _elevation.scss             # Mixins de sombras
    _focus.scss                 # Mixins de focus
    _media.scss                 # Media queries
    _truncate.scss              # Truncate de texto
assets/
  images/
    drivers/                    # Imágenes de pilotos (.avif)
    teams/                      # Imágenes de equipos (.avif)
    f1-logo.jpg                 # Logo de F1
```

### Rutas

- `/` — Home
- `/teams` — Listado de equipos
- `/teams/:teamId` — Detalle de equipo
- `/drivers` — Búsqueda de pilotos
- `/charts` — Gráficas de temporada

### Servicios Core

#### F1ApiService

Centraliza llamadas a `https://f1api.dev/api`:

- `getCurrentTeams()` / `getTeams(year?)`
- `getTeam(teamId, year?)`
- `getTeamDrivers(teamId, year?)`
- `searchDrivers(query, year?)`
- `getDriversChampionship(year)`
- `getConstructorsChampionship(year)`

Manejo de errores con `catchError` y feedback con `NzMessageService`.

#### ImageMapperService

Mapeo de imágenes y normalización de nombres:

- `getTeamImagePath(teamName)` / `getTeamDisplayName(teamName)`
- `getDriverImagePath(driver)`
- `getInitials(name)`
- `normalizeTeamName(name)`

Soporta AVIF para optimización.

#### ErrorHandlerService

Manejo centralizado de errores:

- `handleApiError(message, fallback)` — Operador RxJS para catchError
- `showError` / `showSuccess` / `showInfo`

#### UtilsService

Utilidades comunes:

- `formatDate(dateString)` — DD/MM/YYYY
- `generateYears(count)` — Array de años
- `normalizeSlug(text)` — Normalización de strings
- `formatPoints(points)` — Formato de puntos

### Componentes Compartidos

#### EntityCardComponent

Card genérico para equipos y pilotos con avatar, fallback de iniciales, badge opcional y lazy loading.

#### InfoRowComponent

Fila label-valor reutilizable con iconos opcionales.

#### LoadingWrapperComponent

Wrapper con spinner de NG-Zorro.

#### EmptyStateComponent

Estado vacío con icono, mensaje y acción opcional.

#### YearSelectorComponent

Select de año con output del valor seleccionado.

### Búsqueda de pilotos

Búsqueda con RxJS:

- FormControl con validación (>= 4 caracteres)
- `debounceTime(350)` + `distinctUntilChanged()` + `switchMap()`
- Tabla con link a Wikipedia
- Feedback de loading y estados vacíos

### Gráficas

Chart.js con `ng2-charts`:

- Bar charts para pilotos y constructores
- Top 5 por puntos
- Selector de año reactivo
- Responsive y animado

## Características

### Design System

- Design tokens en SCSS con variables CSS
- Tema oscuro
- Mixins (elevation, focus, media queries, truncate)

### Optimizaciones

- OnPush change detection
- Lazy loading de rutas
- Signals para estado reactivo
- Imágenes AVIF
- @defer para imágenes en cards
- Debounce en búsquedas

### Código

- Path aliases (`@models`, `@services`, etc.)
- Barrel exports
- Constantes centralizadas
- Separación core/shared/features

### UX

- Navbar responsivo
- Loading/empty states consistentes
- Error handling con feedback visual
- Animaciones sutiles

## Decisiones técnicas

- Standalone Components + OnPush para performance y tree-shaking
- `importProvidersFrom` para HttpClient y módulos NG-Zorro
- Tipos de respuesta flexibles en el servicio (normalización de arrays)
- Signals para estado local simple
- ImageMapperService dedicado
- ErrorHandlerService para DRY
- Componentes reutilizables para consistencia
- Filtrado de pilotos excluidos con constantes
- Formato AVIF para imágenes

## Posibles mejoras

- Tests unitarios y E2E
- Interceptor HTTP global
- Cache en memoria
- Service Workers
- Theming claro/oscuro dinámico
- i18n
- Animaciones avanzadas
- Paginación
- Comparador de pilotos/equipos
- PWA

## Troubleshooting

**Estilos de NG-Zorro no se aplican:**

- Verificar `ng-zorro-antd.min.css` en `angular.json` → `styles`

**Imágenes no cargan:**

- Verificar imágenes en `src/assets/images/drivers` y `/teams`
- Formato: `.avif`

**Errores de TypeScript:**

- `npm run type-check`
- Revisar imports de path aliases

**Husky no ejecuta pre-commit:**

- `npm run prepare`
- Verificar permisos en `.husky/`

**API no responde:**

- Verificar conexión
- API: `https://f1api.dev/api`
- Revisar console

**Errores de compilación:**

- Limpiar cache y reinstalar dependencias

## Convenciones

### Git Flow

- `main` — Estable
- `dev` — Desarrollo
- `feature/*` — Features

### Commits

- `feat:` — Nueva funcionalidad
- `fix:` — Corrección
- `chore:` — Configuración/tooling
- `refactor:` — Cambios internos
- `style:` — Formato
- `docs:` — Documentación
- `perf:` — Performance
- `test:` — Tests

---

Federico Morón — 2025
