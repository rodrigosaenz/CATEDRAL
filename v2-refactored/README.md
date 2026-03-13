# CATEDRAL v2 — Refactored

Formulario de intake interactivo y bilingüe para la plataforma CATEDRAL.
Esta versión refactorizada separa el código en archivos independientes, agrega validación server-side, persistencia con localStorage y documentación completa.

---

## Estructura del Proyecto

```
v2-refactored/
├── index.html               # HTML principal (limpio, sin CSS ni JS embebido)
├── css/
│   └── style.css            # Todos los estilos (extraídos del index.html original)
├── js/
│   ├── config.js            # Definición de pantallas, preguntas y módulos dinámicos
│   ├── utils.js             # Funciones auxiliares: scoring, renderizado, localStorage
│   ├── validation.js        # Validación frontend de campos requeridos
│   ├── handlers.js          # Manejadores de eventos: radio, checkbox, inputs
│   └── script.js            # Lógica principal: navegación, envío, restauración
├── server/
│   ├── server.js            # Servidor Express con helmet, CORS y rate limiting
│   ├── routes/
│   │   └── submit.js        # Endpoint POST /api/submit
│   ├── middleware/
│   │   └── validation.js    # Validación y sanitización server-side
│   └── .env.example         # Variables de entorno requeridas
├── package.json
└── README.md
```

---

## Uso como Frontend Estático

Puede servir `v2-refactored/` directamente con cualquier servidor HTTP estático.
Los assets del proyecto raíz (imágenes, fuentes) se referencian con rutas relativas (`../Logo.png`).

### Con el servidor Express incluido:

```bash
cd v2-refactored
cp server/.env.example server/.env
# Editar server/.env con sus valores reales
npm install
npm start
# → Abre http://localhost:3000
```

### Sin backend (solo frontend):

Abra `v2-refactored/index.html` desde cualquier servidor estático.
El formulario enviará directamente al webhook n8n configurado en `js/config.js`.

---

## Variables de Entorno (Backend)

| Variable         | Descripción                                    | Default               |
|------------------|------------------------------------------------|-----------------------|
| `PORT`           | Puerto del servidor                            | `3000`                |
| `WEBHOOK_URL`    | URL del webhook n8n para reenvío de datos      | (requerido)           |
| `ALLOWED_ORIGIN` | Origen CORS permitido                          | `http://localhost:3000` |

---

## Características

### Separación de Responsabilidades
- **config.js** — toda la configuración de preguntas y módulos dinámicos
- **utils.js** — funciones puras sin efectos secundarios (scoring, renderizado, storage)
- **validation.js** — lógica de validación aislada (frontend y payload)
- **handlers.js** — manejadores de eventos del DOM
- **script.js** — orquestador principal (navegación, envío, init)

### Persistencia con localStorage
- Progreso guardado automáticamente en cada interacción
- Restauración automática al recargar la página
- Borrado al completar el envío

### Validación
- **Frontend**: campos requeridos validados antes de avanzar pantalla
- **Backend**: validación de tipos, enums, arrays y formato de email
- **Sanitización**: eliminación de HTML tags y limitación de longitud

### Seguridad (Backend)
- `helmet` — headers HTTP de seguridad
- `cors` — origen restringido a dominio configurado
- `express-rate-limit` — máximo 10 envíos por IP cada 15 minutos
- Cuerpo JSON limitado a 50kb

---

## Diferencias con v1

| Aspecto              | v1 (index.html monolítico) | v2 (refactorizado)               |
|----------------------|----------------------------|----------------------------------|
| Estructura           | 1 archivo, 1621 líneas     | 10 archivos especializados       |
| CSS                  | Embebido en `<style>`      | `css/style.css`                  |
| JavaScript           | Embebido en `<script>`     | 5 módulos JS separados           |
| Validación           | Solo frontend básica       | Frontend + backend + sanitización|
| Persistencia         | Sin localStorage           | Guardado y restauración automática|
| Backend              | Sin servidor               | Express con seguridad completa   |
| Visual               | Idéntico                   | Idéntico (sin cambios estéticos) |

---

## Requisitos

- Node.js >= 18.0.0 (solo para el backend)
- Navegador moderno con soporte ES2017+ (para el frontend)
