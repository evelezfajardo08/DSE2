import { useEffect, useState } from 'react';
import { Users, TrendingUp, FileText, Download, Filter, Search, X, Check, Clock } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Progress } from './ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Student {
  id: number;
  name: string;
  email: string;
  status?: string;
  progress: number;
  evaluations: number;
  activities: number;
  lastActivity: string;
}

interface ProgressRecord {
  user_id?: number;
  percentage?: number;
}

interface ResultRecord {
  user_id?: number;
}

interface TeacherRequest {
  id: number;
  name: string;
  email: string;
  registered_at?: string;
}

const skillNames = [
  'Liderazgo',
  'Comunicación',
  'Toma de Decisiones',
  'Trabajo en Equipo',
  'Gestión del Tiempo',
];

export function TeacherPanel() {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [teacherRequests, setTeacherRequests] = useState<TeacherRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState('');
  const [approvingRequestId, setApprovingRequestId] = useState<number | null>(null);
  const [groupProgressData, setGroupProgressData] = useState([
    { week: 'Actual', promedio: 0 },
  ]);
  const [skillsAverages] = useState(
    skillNames.map((skill) => ({ skill, promedio: 0 }))
  );

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const studentsResponse = await fetch('http://localhost:4001/users/students');
        const data = await studentsResponse.json();
        if (!studentsResponse.ok) {
          throw new Error(data.message || 'No se pudieron cargar los estudiantes.');
        }
        let progressRecords: ProgressRecord[] = [];
        let resultRecords: ResultRecord[] = [];

        const [progressResponse, resultsResponse] = await Promise.all([
          fetch('http://localhost:4001/progress'),
          fetch('http://localhost:4001/results'),
        ]);

        if (progressResponse.ok) {
          progressRecords = await progressResponse.json();
        }
        if (resultsResponse.ok) {
          resultRecords = await resultsResponse.json();
        }

        const mappedStudents = data.map((student: { id: number; name: string; email: string; status?: string; registered_at?: string }) => {
          const studentProgress = progressRecords.filter((record) => record.user_id === student.id);
          const percentageTotal = studentProgress.reduce(
            (sum, record) => sum + (Number(record.percentage) || 0),
            0
          );
          const progress = studentProgress.length
            ? Math.round(percentageTotal / studentProgress.length)
            : 0;

          return {
            id: student.id,
            name: student.name,
            email: student.email,
            status: student.status === 'active' ? 'active' : 'inactive',
            progress,
            evaluations: resultRecords.filter((result) => result.user_id === student.id).length,
            activities: studentProgress.length,
            lastActivity: student.registered_at
              ? new Date(student.registered_at).toLocaleDateString('es-CO')
              : 'Sin actividad',
          };
        });
        setStudentsData(mappedStudents);
        setGroupProgressData([
          {
            week: 'Actual',
            promedio: mappedStudents.length
              ? Math.round(mappedStudents.reduce((sum, student) => sum + student.progress, 0) / mappedStudents.length)
              : 0,
          },
        ]);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'No se pudieron cargar los estudiantes.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadStudents();
  }, []);

  useEffect(() => {
    const loadTeacherRequests = async () => {
      try {
        const response = await fetch('http://localhost:4001/users/teacher-requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'No se pudieron cargar las solicitudes.');
        setTeacherRequests(data);
      } catch (error) {
        setRequestsError(error instanceof Error ? error.message : 'No se pudieron cargar las solicitudes.');
      } finally {
        setRequestsLoading(false);
      }
    };

    void loadTeacherRequests();
  }, []);

  const approveTeacherRequest = async (requestId: number) => {
    setApprovingRequestId(requestId);
    setRequestsError('');
    try {
      const response = await fetch(`http://localhost:4001/auth/teacher-requests/${requestId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No se pudo aprobar la solicitud.');
      setTeacherRequests((requests) => requests.filter((request) => request.id !== requestId));
    } catch (error) {
      setRequestsError(error instanceof Error ? error.message : 'No se pudo aprobar la solicitud.');
    } finally {
      setApprovingRequestId(null);
    }
  };

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleStudents = studentsData.filter((student) => {
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesSearch = !normalizedSearchTerm
      || student.name.toLowerCase().includes(normalizedSearchTerm)
      || student.email.toLowerCase().includes(normalizedSearchTerm);
    return matchesStatus && matchesSearch;
  });
  const totalStudents = studentsData.length;
  const activeStudents = studentsData.filter(s => s.status === 'active').length;
  const averageProgress = Math.round(
    studentsData.length
      ? studentsData.reduce((sum, s) => sum + s.progress, 0) / totalStudents
      : 0
  );

  const exportReport = () => {
    const document = new jsPDF();
    const generatedAt = new Date().toLocaleString('es-CO');
    const filterLabel = statusFilter === 'all'
      ? 'Todos'
      : statusFilter === 'active'
        ? 'Activos'
        : 'Inactivos';

    document.setFontSize(18);
    document.setTextColor(30, 58, 138);
    document.text('Reporte del Panel Docente', 14, 20);

    document.setFontSize(10);
    document.setTextColor(75, 85, 99);
    document.text(`Generado: ${generatedAt}`, 14, 28);
    document.text(`Filtro aplicado: ${filterLabel}`, 14, 34);

    document.setFontSize(11);
    document.setTextColor(31, 41, 55);
    document.text(`Total de estudiantes: ${totalStudents}`, 14, 46);
    document.text(`Estudiantes activos: ${activeStudents}`, 14, 53);
    document.text(`Progreso promedio: ${averageProgress}%`, 14, 60);
    document.text(
      `Evaluaciones totales: ${studentsData.reduce((sum, student) => sum + student.evaluations, 0)}`,
      14,
      67
    );

    autoTable(document, {
      startY: 76,
      head: [['Estudiante', 'Correo', 'Progreso', 'Evaluaciones', 'Actividades', 'Estado']],
      body: visibleStudents.map((student) => [
        student.name,
        student.email,
        `${student.progress}%`,
        String(student.evaluations),
        String(student.activities),
        student.status === 'active' ? 'Activo' : 'Inactivo',
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 58, 138] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      didDrawPage: (data) => {
        document.setFontSize(8);
        document.setTextColor(107, 114, 128);
        document.text(
          `Página ${data.pageNumber}`,
          document.internal.pageSize.getWidth() - 30,
          document.internal.pageSize.getHeight() - 10
        );
      },
    });

    document.save(`reporte-docente-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2>Panel de Docente</h2>
          <p className="text-muted-foreground mt-1">
            Monitorea el progreso y desempeño de tus estudiantes
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
            aria-expanded={isFilterOpen}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={exportReport}
            disabled={isLoading || Boolean(loadError)}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50/50 shadow-md">
        <div className="flex items-start justify-between gap-4 border-b border-amber-200 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3>Solicitudes de docentes</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Revisa y aprueba las cuentas que ya verificaron su correo.
              </p>
            </div>
          </div>
          <Badge variant="secondary">{teacherRequests.length} pendientes</Badge>
        </div>
        <div className="p-5">
          {requestsLoading ? (
            <p className="text-sm text-muted-foreground">Cargando solicitudes...</p>
          ) : requestsError ? (
            <p className="text-sm text-red-600">{requestsError}</p>
          ) : teacherRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay solicitudes pendientes.</p>
          ) : (
            <div className="space-y-3">
              {teacherRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium">{request.name}</p>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Solicitud del {request.registered_at ? new Date(request.registered_at).toLocaleDateString('es-CO') : 'fecha desconocida'}
                    </p>
                  </div>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => approveTeacherRequest(request.id)}
                    disabled={approvingRequestId === request.id}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    {approvingRequestId === request.id ? 'Aprobando...' : 'Aprobar docente'}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="student-filter-title"
          onClick={() => setIsFilterOpen(false)}
        >
          <Card
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 id="student-filter-title">Filtrar estudiantes</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {visibleStudents.length} de {studentsData.length} estudiantes
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFilterOpen(false)}
                aria-label="Cerrar filtros"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 border-b p-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Buscar por nombre o correo
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Ej. Camilo o gmail.com"
                    className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Estado
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="max-h-[55vh] overflow-y-auto p-5">
              {isLoading ? (
                <p className="py-8 text-center text-muted-foreground">Cargando estudiantes...</p>
              ) : loadError ? (
                <p className="py-8 text-center text-red-600">{loadError}</p>
              ) : visibleStudents.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No hay estudiantes que coincidan con los filtros.
                </p>
              ) : (
                <div className="space-y-2">
                  {visibleStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex flex-col gap-2 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{student.progress}% progreso</span>
                        <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                          {student.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end border-t p-4">
              <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Estudiantes</p>
              <p className="text-2xl">{totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estudiantes Activos</p>
              <p className="text-2xl">{activeStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progreso Promedio</p>
              <p className="text-2xl">{averageProgress}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Evaluaciones Totales</p>
              <p className="text-2xl">{studentsData.reduce((sum, s) => sum + s.evaluations, 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-md">
          <h3 className="mb-4">Progreso Grupal</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={groupProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="promedio" stroke="#1E3A8A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-md">
          <h3 className="mb-4">Promedio por Habilidad</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillsAverages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="promedio" fill="#FACC15" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Students Table */}
      <Card className="shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3>Estudiantes</h3>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estudiante</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead className="text-center">Evaluaciones</TableHead>
                <TableHead className="text-center">Actividades</TableHead>
                <TableHead>Última Actividad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Cargando estudiantes...
                  </TableCell>
                </TableRow>
              ) : loadError ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-red-600">
                    {loadError}
                  </TableCell>
                </TableRow>
              ) : visibleStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No hay estudiantes registrados.
                  </TableCell>
                </TableRow>
              ) : visibleStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div>
                      <p>{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-32">
                      <div className="flex items-center gap-2 mb-1">
                        <Progress value={student.progress} className="h-2 flex-1" />
                        <span className="text-sm">{student.progress}%</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{student.evaluations}</TableCell>
                  <TableCell className="text-center">{student.activities}</TableCell>
                  <TableCell className="text-sm">{student.lastActivity}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                      {student.status === 'active' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
