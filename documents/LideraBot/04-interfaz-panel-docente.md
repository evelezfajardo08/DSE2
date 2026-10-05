# Interfaz y funcionalidades del panel docente

## Lista real de estudiantes

El panel dejó de utilizar estudiantes ficticios. La información se consulta desde MongoDB mediante:

- `GET /users/students`

La respuesta solo incluye información pública:

- `id`
- `name`
- `email`
- `status`
- `registered_at`

No se devuelven contraseñas.

## Métricas reales

- El progreso individual se calcula desde `/progress`.
- Las evaluaciones se cuentan desde `/results`.
- Las actividades se calculan con los registros de progreso.
- Si un estudiante no tiene registros, sus valores aparecen en cero.
- Si las métricas no están disponibles, la lista de estudiantes sigue apareciendo.

## Filtros

El botón **Filtrar** abre una ventana independiente con la lista real de estudiantes. Permite:

- Buscar por nombre.
- Buscar por correo.
- Filtrar por estado activo o inactivo.
- Ver cuántos estudiantes coinciden.
- Mostrar progreso y estado de cada resultado.

La tabla principal y el PDF usan los resultados filtrados.

## Perfil

La opción **Mi Perfil** muestra:

- Nombre completo.
- Correo registrado.
- Tipo de cuenta.
- Estado de la sesión.

## Archivos relacionados

- `frontend/src/app/components/TeacherPanel.tsx`
- `frontend/src/app/App.tsx`
- `src/users/users.controller.ts`
- `src/users/users.service.ts`
- `src/users/entities/schema.ts`
