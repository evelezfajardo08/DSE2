# Botones y navegación

## Logo de LideraBot

El logotipo y el nombre de LideraBot funcionan como botón de inicio:

- Para docentes, vuelve al Panel Docente.
- Para estudiantes, vuelve a Inicio.
- Cierra el menú móvil si estaba abierto.
- No muestra un marco visual al hacer clic.

## Menú de perfil

### Mi Perfil

Abre la vista con la información real de la sesión.

### Configuración

Abre la pantalla de configuración para:

- Cambiar el nombre.
- Activar o desactivar el tema oscuro.
- Cambiar la contraseña.

### Cerrar sesión

Finaliza la sesión actual y devuelve al login.

## Navegación docente

Los usuarios docentes acceden directamente al Panel Docente después de iniciar sesión. Los estudiantes acceden a Inicio y conservan las secciones de autoevaluación, actividades y progreso.

## Acciones del panel docente

- **Filtrar:** abre la ventana de filtros.
- **Exportar Reporte:** genera el PDF.
- Selector de estado: actualiza la lista visible.
- Logo: vuelve al panel inicial según el rol.

## Archivos relacionados

- `frontend/src/app/App.tsx`
- `frontend/src/app/components/Header.tsx`
- `frontend/src/app/components/TeacherPanel.tsx`
