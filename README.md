# ☀️ Enteixinat — Solar Plant Manager

> **La red inteligente para el control total de tu energía fotovoltaica.**

**Enteixinat** (enrejado en catalán) no es solo una app; es el nexo visual entre tus paneles y tú. Inspirada en la geometría de los tejados solares, esta plataforma web permite gestionar, monitorizar y optimizar instalaciones desde cualquier lugar.

---

## 📸 Screenshots

#### Vista Grid 
![Grid view](public/screenshots/grid.png)
#### Vista Mapa
![Map view](public/screenshots/mapa.png)
#### Vista Tabla
![Table view](public/screenshots/table.png)
#### Detalle de Planta 
![Plant detail](public/screenshots/detalle.png)
#### Login
![Login](public/screenshots/login.png)

---

## 🚀 Características Principales

| Funcionalidad | Descripción |
| --- | --- |
| **Gestión Integral** | 🏗️ Alta, edición y baja de plantas con capacidad en kW y fotos personalizadas. |
| **Geolocalización** | 📍 Captura de coordenadas GPS con un clic e integración con mapas interactivos. |
| **Visualización 360°** | 🔄 Tres vistas conmutables: **Grid** (visual), **Tabla** (admin) y **Mapa** (geo). |
| **Smart Monitoring** | 📈 Gráficos en tiempo real con curvas de generación y consumo realistas. |
| **Seguridad Pro** | 🔐 Autenticación robusta y perfiles de usuario mediante Supabase Auth. |

---

## 🛠️ Stack Tecnológico (Vanguardia 2026)

| Categoría | Herramienta | Icono |
| --- | --- | --- |
| **Framework** | **Angular 21** (Standalone + Signals) | 🅰️ |
| **Backend** | **Supabase** (PostgreSQL + Storage) | ⚡ |
| **Mapas** | **Leaflet 1.9** + Cluster Engine | 🗺️ |
| **Gráficos** | **Chart.js 4** | 📊 |
| **UI Kit** | **Angular Material** (Material 3 Design) | 🎨 |

---

## 🧠 Aspectos Técnicos Destacados

### ⚡ Angular Signals: El Nuevo Corazón Reactivo

Hemos dicho adiós a la complejidad de los stores externos. La reactividad fluye a través de **Signals**, permitiendo una actualización de la UI ultra eficiente.

```ts
// Filtro de búsqueda ultra-rápido mediante computed signals
plantesSignal = signal<Planta[]>([]);
textRecerca = signal<string>('');

plantesSignalFiltered = computed(() =>
  this.plantesSignal().filter(p =>
    p.nom.toLowerCase().includes(this.textRecerca().toLowerCase())
  )
);

```

### 🛰️ Monitorización con Simulación Realista

El servicio `RegistreDemo` no genera números al azar; recrea una **curva de Gauss** para simular la producción solar real (pico al mediodía, silencio nocturno) con ruido atmosférico suavizado.

### 🗺️ Integración Leaflet & Angular Router

Los popups del mapa no son simples etiquetas; están inyectados en el ciclo de vida de Angular para permitir navegación directa desde el marcador:

```ts
// Puente entre el DOM de Leaflet y el Router de Angular
marker.bindPopup(popup).on('popupopen', () => {
  document.getElementById(`btn-${p.id}`)
    ?.addEventListener('click', () => this.router.navigate(['/planta', p.id]));
});

```

---

## 🎨 Sistema de Diseño (Design System)

### 🌈 Paleta de Colores

Utilizamos una paleta cálida y funcional que evoca la energía del sol:

* **Primary** (`#f59e0b`): 🟠 El naranja solar para acciones principales.
* **Info** (`rgb(54, 162, 235)`): 🔵 El azul tecnológico para navegación y datos.
* **Destructive** (`#dc2626`): 🔴 Para alertas y borrados seguros.

### ✍️ Tipografía con Personalidad

* **Space Grotesk**: Para un logo y unos headers con aire futurista y técnico.
* **Outfit**: Para una lectura cómoda y moderna en el cuerpo de texto.

---

## 📁 Estructura del Ecosistema

```bash
src/app/
├── 🧩 components/        # UI Modular (Header, Grid, Detalle...)
├── ⚙️ services/          # Lógica: Supabase, Mapas, Simulador Solar
├── 🛡️ guards/            # Protección de rutas funcional
├── 🧪 interfaces/        # Contratos de datos (Planta, User, Registre)
└── 🛠️ pipes/             # Transformación de datos (Round, Format)

```

---

## ⚙️ Instalación en 3 Pasos

1. **Clonar:** `git clone <url-del-repo>`
2. **Preparar:** `npm install`
3. **Despegar:** `ng serve`

> [!IMPORTANT]
> No olvides configurar tus variables de entorno en `src/environments/environment.ts` con tus `SUPABASE_URL` y `SUPABASE_KEY`.


