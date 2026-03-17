

## Cambios al plan de la invitacion de Vicky

Basandome en el PDF de referencia de "Mis XV Giuli", entiendo dos cambios clave:

### 1. Fotos integradas como secciones full-width (no carrusel/galeria)

En el ejemplo, las fotos aparecen como **secciones completas de pantalla** entre los bloques de texto, actuando como separadores visuales. Cada foto ocupa todo el ancho y tiene buen alto (tipo hero). El flujo seria:

```text
[Portada con titulo "Mis XV - Vicky"]
[FOTO 1 - full width hero]
[Frase emotiva + texto]
[FOTO 2 - full width hero]
[Cuenta regresiva]
[FOTO 3 - full width hero]
[Datos del evento + botones]
[FOTO 4 - full width hero]
[Seccion regalo]
[FOTO 5 - full width hero]
[Cierre + reproductor]
```

Las fotos usaran `object-cover` con alto fijo (~70vh) y placeholders editables. Cada imagen funciona como un descanso visual entre secciones de contenido.

### 2. Destellos dorados finos con CSS puro (no emojis)

Reemplazar cualquier uso de emojis de estrella/destello por **particulas CSS puras**:
- Puntos pequenos (2-4px) con `background: radial-gradient` en dorado
- Animacion sutil de opacidad y escala con `@keyframes`
- Posicionados con `position: absolute` de forma dispersa
- Efecto de "brillo fino" tipo polvo dorado, no iconos ni emojis

### Archivos a modificar
- **src/pages/Index.tsx** - Reestructurar layout: fotos full-width intercaladas entre secciones, destellos CSS finos
- **src/index.css** - Agregar keyframes para particulas doradas y estilos de las fotos hero
- **tailwind.config.ts** - Agregar animaciones custom si es necesario

