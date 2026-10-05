# Exportación de reportes PDF

## Funcionamiento

El botón **Exportar Reporte** genera un archivo PDF descargable en el navegador.

El documento incluye:

- Título del reporte.
- Fecha y hora de generación.
- Filtro aplicado.
- Total de estudiantes.
- Estudiantes activos.
- Progreso promedio.
- Total de evaluaciones.
- Tabla con nombre, correo, progreso, evaluaciones, actividades y estado.
- Número de página.

## Filtros aplicados

El reporte exporta exactamente los estudiantes visibles en la tabla. Por tanto, puede exportarse:

- La lista completa.
- Solo estudiantes activos.
- Solo estudiantes inactivos.
- Coincidencias de una búsqueda por nombre o correo.

## Dependencias

Se instalaron:

- `jspdf`
- `jspdf-autotable`

## Nombre del archivo

El archivo se descarga con el formato:

`reporte-docente-AAAA-MM-DD.pdf`

## Archivos relacionados

- `frontend/src/app/components/TeacherPanel.tsx`
- `frontend/package.json`
- `frontend/package-lock.json`

## Validación

La generación se ejecuta en el navegador y utiliza los datos reales ya cargados en el panel docente. El frontend compila correctamente después de integrar las dependencias.
