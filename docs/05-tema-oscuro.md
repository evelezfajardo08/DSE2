# Tema oscuro

## Funcionamiento

La configuración permite activar y desactivar el tema oscuro desde el apartado **Configuración**.

- La preferencia se guarda en `localStorage`.
- La clase `dark` se aplica al elemento raíz del documento.
- La configuración se conserva al recargar la aplicación.

## Paleta

El tema oscuro utiliza:

- Fondo negro.
- Tarjetas y paneles gris oscuro.
- Botones principales rojos.
- Elementos secundarios rojo oscuro.
- Bordes gris oscuro.
- Texto blanco y gris claro.
- Campos de entrada oscuros con texto y placeholders legibles.
- Barra superior y barra lateral oscuras.
- Gráficas con tonos rojos.

## Accesibilidad visual

Se añadieron reglas para adaptar componentes que originalmente tenían fondos blancos, textos grises oscuros o bordes claros. Esto evita que desaparezcan elementos o pierdan contraste al activar el tema.

## Archivos relacionados

- `frontend/src/app/App.tsx`
- `frontend/src/styles/globals.css`
