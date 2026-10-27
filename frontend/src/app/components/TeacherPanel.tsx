import { useEffect, useState, useMemo } from 'react';
import {
  Users,
  TrendingUp,
  FileText,
  Download,
  Filter,
  Search,
  X,
  Check,
  Clock,
  Trash2,
  AlertTriangle,
  Mail,
  MessageSquare,
  ShieldAlert,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
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
  last_connection?: string;
  lastLoginDate?: string;
}

interface ProgressRecord {
  user_id?: number;
  module_id?: number;
  activity_id?: string;
  submodule_name?: string;
  exercise_response?: string;
  overall_progress?: number;
  percentage?: number;
  status?: string;
}

interface RegisteredUser extends Student {
  role: 'student' | 'teacher';
  registered_at?: string;
  submodules?: ProgressRecord[];
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

interface SuggestionItem {
  id: string;
  user_id: number;
  user_name: string;
  user_email: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:4001');

function formatLastConnection(isoString?: string): string {
  if (!isoString) return 'Sin registro reciente';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Sin registro';

  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Conectado hace un momento';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;
  if (diffHours < 24) {
    return `Hoy, ${date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays === 1) {
    return `Ayer, ${date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`;
  }

  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TeacherPanel() {
  const [panelTab, setPanelTab] = useState<'monitoring' | 'suggestions' | 'requests'>('monitoring');
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Solicitudes docentes
  const [teacherRequests, setTeacherRequests] = useState<TeacherRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestsError, setRequestsError] = useState('');
  const [approvingRequestId, setApprovingRequestId] = useState<number | null>(null);

  // Eliminación de usuario con motivo
  const [userToDelete, setUserToDelete] = useState<RegisteredUser | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Sugerencias de estudiantes
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [updatingSuggestionId, setUpdatingSuggestionId] = useState<string | null>(null);

  const loadStudents = async () => {
    try {
      setIsLoading(true);
      const studentsResponse = await fetch(`${API_BASE}/users/registered`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
      });
      const data = await studentsResponse.json();
      if (!studentsResponse.ok) {
        throw new Error(data.message || 'No se pudieron cargar los estudiantes.');
      }
      let progressRecords: ProgressRecord[] = [];
      let resultRecords: ResultRecord[] = [];

      const [progressResponse, resultsResponse] = await Promise.all([
        fetch(`${API_BASE}/progress`),
        fetch(`${API_BASE}/results`),
      ]);

      if (progressResponse.ok) {
        progressRecords = await progressResponse.json();
      }
      if (resultsResponse.ok) {
        resultRecords = await resultsResponse.json();
      }

      const mappedUsers = data.map(
        (student: {
          id: number;
          name: string;
          email: string;
          role: 'student' | 'teacher';
          status?: string;
          registered_at?: string;
          last_connection?: string;
          lastLoginDate?: string;
        }) => {
          const studentProgress = progressRecords
            .filter((record) => record.user_id === student.id)
            .sort((a, b) => (a.module_id ?? 0) - (b.module_id ?? 0));

          // Calcular progreso total real sobre 15 submódulos de las 3 disciplinas
          const totalPercentages = studentProgress.reduce(
            (sum, record) => sum + (Number(record.percentage) || 0),
            0,
          );
          // Si ha trabajado en liderazgo (5 submódulos) o en las 3 (15 submódulos), normalizamos el avance
          const denominator = Math.max(studentProgress.length, 5);
          const progress = Math.min(100, Math.round(totalPercentages / denominator));

          const activeSubmodulesCount = studentProgress.filter(
            (record) => (Number(record.percentage) || 0) > 0,
          ).length;

          return {
            id: student.id,
            name: student.name,
            email: student.email,
            role: student.role,
            status: student.status === 'active' ? 'active' : 'inactive',
            registered_at: student.registered_at,
            last_connection: student.last_connection || (student.lastLoginDate ? `${student.lastLoginDate}T12:00:00Z` : student.registered_at),
            lastLoginDate: student.lastLoginDate,
            progress,
            evaluations: resultRecords.filter((result) => result.user_id === student.id).length,
            activities: activeSubmodulesCount,
            submodules: studentProgress,
            lastActivity: student.last_connection || student.registered_at
              ? formatLastConnection(student.last_connection || student.registered_at)
              : 'Sin actividad',
          };
        },
      );

      const mappedStudents = mappedUsers.filter((user: RegisteredUser) => user.role === 'student');
      setRegisteredUsers(mappedUsers);
      setStudentsData(mappedStudents);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'No se pudieron cargar los estudiantes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadStudents();
  }, []);

  useEffect(() => {
    const loadTeacherRequests = async () => {
      try {
        const response = await fetch(`${API_BASE}/users/teacher-requests`, {
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

  const loadSuggestions = async () => {
    try {
      setSuggestionsLoading(true);
      const res = await fetch(`${API_BASE}/suggestions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch {
      // Ignorar errores en carga de sugerencias
    } finally {
      setSuggestionsLoading(false);
    }
  };

  useEffect(() => {
    if (panelTab === 'suggestions') {
      void loadSuggestions();
    }
  }, [panelTab]);

  const approveTeacherRequest = async (requestId: number) => {
    setApprovingRequestId(requestId);
    setRequestsError('');
    try {
      const response = await fetch(`${API_BASE}/auth/teacher-requests/${requestId}/approve`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token') || ''}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No se pudo aprobar la solicitud.');
      setTeacherRequests((requests) => requests.filter((request) => request.id !== requestId));
      setActionSuccess('Docente aprobado exitosamente.');
      setTimeout(() => setActionSuccess(''), 5000);
      void loadStudents();
    } catch (error) {
      setRequestsError(error instanceof Error ? error.message : 'No se pudo aprobar la solicitud.');
    } finally {
      setApprovingRequestId(null);
    }
  };

  // Función para eliminar usuario y notificar por correo con el motivo
  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    if (!deleteReason.trim() || deleteReason.trim().length < 4) {
      setDeleteError('Por favor ingresa el motivo detallado de la eliminación (mínimo 4 caracteres).');
      return;
    }

    setIsDeleting(true);
    setDeleteError('');

    try {
      const response = await fetch(`${API_BASE}/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        body: JSON.stringify({ reason: deleteReason.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'No se pudo eliminar el usuario.');
      }

      setRegisteredUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setStudentsData((prev) => prev.filter((s) => s.id !== userToDelete.id));
      if (selectedUser?.id === userToDelete.id) {
        setSelectedUser(null);
      }

      setActionSuccess(
        `El usuario ${userToDelete.name} (${userToDelete.email}) fue eliminado y se le envió la notificación con el motivo a su correo.`,
      );
      setTimeout(() => setActionSuccess(''), 6000);
      setUserToDelete(null);
      setDeleteReason('');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Error al eliminar usuario.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkSuggestionReviewed = async (suggestionId: string, currentStatus: string) => {
    setUpdatingSuggestionId(suggestionId);
    try {
      const newStatus = currentStatus === 'reviewed' ? 'pending' : 'reviewed';
      const res = await fetch(`${API_BASE}/suggestions/${suggestionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSuggestions((prev) =>
          prev.map((s) => (s.id === suggestionId ? { ...s, status: newStatus } : s)),
        );
      }
    } catch {
      // ignore error
    } finally {
      setUpdatingSuggestionId(null);
    }
  };

  // 1. Métricas de Progreso Real por Habilidad
  const realSkillsData = useMemo(() => {
    const students = registeredUsers.filter((u) => u.role === 'student');
    if (!students.length) {
      return [
        { skill: 'Formación en Liderazgo', promedio: 0, color: '#1E3A8A' },
        { skill: 'Comunicación Educativa', promedio: 0, color: '#0891B2' },
        { skill: 'Toma de Decisiones', promedio: 0, color: '#7C3AED' },
      ];
    }

    let totalLead = 0;
    let totalComm = 0;
    let totalDec = 0;

    for (const st of students) {
      const subs = st.submodules || [];
      const leadSubs = subs.filter(
        (s) =>
          s.activity_id?.includes('leadership') ||
          (!s.activity_id?.includes('communication') && !s.activity_id?.includes('decision')),
      );
      const commSubs = subs.filter((s) => s.activity_id?.includes('communication'));
      const decSubs = subs.filter((s) => s.activity_id?.includes('decision'));

      const calcAvg = (records: ProgressRecord[]) => {
        if (!records.length) return 0;
        const total = records.reduce((acc, r) => acc + (Number(r.percentage) || 0), 0);
        return total / Math.max(records.length, 5);
      };

      totalLead += calcAvg(leadSubs);
      totalComm += calcAvg(commSubs);
      totalDec += calcAvg(decSubs);
    }

    return [
      {
        skill: 'Formación en Liderazgo',
        promedio: Math.round(totalLead / students.length),
        color: '#1E3A8A',
      },
      {
        skill: 'Comunicación Educativa',
        promedio: Math.round(totalComm / students.length),
        color: '#0891B2',
      },
      {
        skill: 'Toma de Decisiones',
        promedio: Math.round(totalDec / students.length),
        color: '#7C3AED',
      },
    ];
  }, [registeredUsers]);

  // 2. Gráfica de Distribución Real de Estudiantes por Nivel de Avance
  const realDistributionData = useMemo(() => {
    const students = registeredUsers.filter((u) => u.role === 'student');
    const brackets = [
      { nivel: 'Sin iniciar (0%)', cantidad: 0, color: '#94A3B8' },
      { nivel: 'Inicial (1-25%)', cantidad: 0, color: '#F59E0B' },
      { nivel: 'Medio (26-50%)', cantidad: 0, color: '#3B82F6' },
      { nivel: 'Avanzado (51-75%)', cantidad: 0, color: '#8B5CF6' },
      { nivel: 'Dominio (76-100%)', cantidad: 0, color: '#10B981' },
    ];

    for (const s of students) {
      const p = s.progress || 0;
      if (p === 0) brackets[0].cantidad++;
      else if (p <= 25) brackets[1].cantidad++;
      else if (p <= 50) brackets[2].cantidad++;
      else if (p <= 75) brackets[3].cantidad++;
      else brackets[4].cantidad++;
    }

    return brackets;
  }, [registeredUsers]);

  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const visibleUsers = registeredUsers.filter((student) => {
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesRole = roleFilter === 'all' || student.role === roleFilter;
    const matchesSearch =
      !normalizedSearchTerm ||
      student.name.toLowerCase().includes(normalizedSearchTerm) ||
      student.email.toLowerCase().includes(normalizedSearchTerm);
    return matchesStatus && matchesRole && matchesSearch;
  });

  const totalStudents = studentsData.length;
  const activeStudents = studentsData.filter((s) => s.status === 'active').length;
  const averageProgress = Math.round(
    studentsData.length
      ? studentsData.reduce((sum, s) => sum + s.progress, 0) / totalStudents
      : 0,
  );
  const pendingSuggestionsCount = suggestions.filter((s) => s.status === 'pending').length;

  const exportReport = () => {
    const document = new jsPDF();
    const generatedAt = new Date().toLocaleString('es-CO');
    const filterLabel =
      statusFilter === 'all'
        ? 'Todos'
        : statusFilter === 'active'
          ? 'Activos'
          : 'Inactivos';

    document.setFontSize(18);
    document.setTextColor(30, 58, 138);
    document.text('Reporte del Panel Docente - Progreso Real', 14, 20);

    document.setFontSize(10);
    document.setTextColor(75, 85, 99);
    document.text(`Generado: ${generatedAt}`, 14, 28);
    document.text(`Filtro aplicado: ${filterLabel}`, 14, 34);

    document.setFontSize(11);
    document.setTextColor(31, 41, 55);
    document.text(`Total de estudiantes: ${totalStudents}`, 14, 46);
    document.text(`Estudiantes activos: ${activeStudents}`, 14, 53);
    document.text(`Progreso promedio general: ${averageProgress}%`, 14, 60);
    document.text(
      `Evaluaciones totales registradas: ${studentsData.reduce((sum, student) => sum + student.evaluations, 0)}`,
      14,
      67,
    );

    autoTable(document, {
      startY: 76,
      head: [['Estudiante', 'Correo', 'Progreso Real', 'Última Conexión', 'Evaluaciones', 'Estado']],
      body: visibleUsers.map((student) => [
        student.name,
        student.email,
        `${student.progress}%`,
        student.last_connection ? formatLastConnection(student.last_connection) : 'Sin registro',
        String(student.evaluations),
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
          document.internal.pageSize.getHeight() - 10,
        );
      },
    });

    document.save(`reporte-docente-progreso-real-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Alerta de Éxito Global */}
      {actionSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header y Pestañas Principales del Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-black text-[#10264F] tracking-wide">PANEL DE CONTROL DOCENTE</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitorea el progreso por habilidades, conexiones de estudiantes y buzón de sugerencias
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen((isOpen) => !isOpen)}
            aria-expanded={isFilterOpen}
            className="text-xs font-bold"
          >
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            FILTRAR
          </Button>
          <Button
            size="sm"
            className="bg-[#0F3B8F] text-xs font-bold hover:bg-[#174AA6]"
            onClick={exportReport}
            disabled={isLoading || Boolean(loadError)}
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#FACC15]" />
            EXPORTAR REPORTE PDF
          </Button>
        </div>
      </div>

      {/* Selector de Pestañas del Panel Docente */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
        <button
          onClick={() => setPanelTab('monitoring')}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all ${
            panelTab === 'monitoring'
              ? 'bg-white text-[#0F3B8F] shadow-sm'
              : 'text-slate-600 hover:text-[#0F3B8F] hover:bg-white/60'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>MONITOREO Y PROGRESO REAL</span>
        </button>

        <button
          onClick={() => {
            setPanelTab('suggestions');
            void loadSuggestions();
          }}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all ${
            panelTab === 'suggestions'
              ? 'bg-white text-[#0F3B8F] shadow-sm'
              : 'text-slate-600 hover:text-[#0F3B8F] hover:bg-white/60'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>BUZÓN DE MENSAJES Y PQRS</span>
          {pendingSuggestionsCount > 0 && (
            <span className="rounded-full bg-amber-500 px-2 py-0.2 text-[10px] text-white font-extrabold">
              {pendingSuggestionsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setPanelTab('requests')}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black transition-all ${
            panelTab === 'requests'
              ? 'bg-white text-[#0F3B8F] shadow-sm'
              : 'text-slate-600 hover:text-[#0F3B8F] hover:bg-white/60'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>SOLICITUDES DOCENTES</span>
          {teacherRequests.length > 0 && (
            <span className="rounded-full bg-[#0F3B8F] px-2 py-0.2 text-[10px] text-white font-extrabold">
              {teacherRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* PESTAÑA 1: MONITOREO Y PROGRESO REAL */}
      {panelTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Tarjetas de Estadísticas Reales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0F3B8F] shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">TOTAL ESTUDIANTES</p>
                  <p className="text-2xl font-black text-[#10264F]">{totalStudents}</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">ESTUDIANTES ACTIVOS</p>
                  <p className="text-2xl font-black text-emerald-700">{activeStudents}</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">PROGRESO PROMEDIO REAL</p>
                  <p className="text-2xl font-black text-amber-700">{averageProgress}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">EVALUACIONES REALIZADAS</p>
                  <p className="text-2xl font-black text-purple-700">
                    {studentsData.reduce((sum, s) => sum + s.evaluations, 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Gráficas de Progreso Real (Actualizadas según requerimiento) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Gráfica 1: Progreso por Habilidades */}
            <Card className="p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 min-h-[36px]">
                  <h3 className="text-base font-black text-[#10264F] tracking-wide">
                    PROGRESO POR HABILIDADES
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-bold text-[#0F3B8F] shrink-0">
                    Basado en actividades reales
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Promedio de desempeño y avance grupal en cada una de las competencias
                </p>
              </div>

              <div className="h-[270px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={realSkillsData} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="skill"
                      tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }}
                      interval={0}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: '#475569' }}
                      unit="%"
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val}% de avance promedio`, 'Progreso']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}
                    />
                    <Bar dataKey="promedio" radius={[8, 8, 0, 0]}>
                      {realSkillsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Gráfica 2: Distribución de Estudiantes por Nivel de Avance */}
            <Card className="p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 min-h-[36px]">
                  <h3 className="text-base font-black text-[#10264F] tracking-wide">
                    DISTRIBUCIÓN DE ESTUDIANTES POR AVANCE
                  </h3>
                  <Badge variant="outline" className="text-[10px] font-bold text-emerald-700 shrink-0">
                    {totalStudents} estudiantes
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cantidad real de estudiantes según su porcentaje de progreso general
                </p>
              </div>

              <div className="h-[270px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={realDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="nivel"
                      tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }}
                      interval={0}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#475569' }}
                    />
                    <Tooltip
                      formatter={(val: number) => [`${val} estudiante(s)`, 'Cantidad']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0' }}
                    />
                    <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                      {realDistributionData.map((entry, index) => (
                        <Cell key={`dist-cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Tabla de Estudiantes con Última Conexión y Acción de Eliminar */}
          <Card className="shadow-sm border border-slate-200">
            <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-[#10264F] tracking-wide">
                  ESTUDIANTES Y CUENTAS REGISTRADAS
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Visualiza el progreso real, la última conexión y gestiona las cuentas de usuario
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32 h-8 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Activos</SelectItem>
                    <SelectItem value="inactive">Inactivos</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-32 h-8 text-xs font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="student">Estudiantes</SelectItem>
                    <SelectItem value="teacher">Docentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600">USUARIO</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600">ROL</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600">PROGRESO REAL</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600">ÚLTIMA CONEXIÓN</TableHead>
                    <TableHead className="text-center font-bold text-[11px] uppercase tracking-wider text-slate-600">EVALUACIONES</TableHead>
                    <TableHead className="text-center font-bold text-[11px] uppercase tracking-wider text-slate-600">ACTIVIDADES</TableHead>
                    <TableHead className="font-bold text-[11px] uppercase tracking-wider text-slate-600">ESTADO</TableHead>
                    <TableHead className="text-right font-bold text-[11px] uppercase tracking-wider text-slate-600">ACCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                        Cargando usuarios y progreso real...
                      </TableCell>
                    </TableRow>
                  ) : loadError ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-red-600 text-xs font-bold">
                        {loadError}
                      </TableCell>
                    </TableRow>
                  ) : visibleUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground text-xs">
                        No hay usuarios registrados con los filtros aplicados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleUsers.map((student) => (
                      <TableRow key={student.id} className="hover:bg-slate-50/80">
                        <TableCell>
                          <div>
                            <p className="font-bold text-xs text-[#10264F]">{student.name}</p>
                            <p className="text-[11px] text-muted-foreground">{student.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={student.role === 'teacher' ? 'default' : 'secondary'}
                            className="text-[10px] font-bold"
                          >
                            {student.role === 'teacher' ? 'Docente' : 'Estudiante'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-28">
                            <div className="flex items-center gap-2 mb-1">
                              <Progress value={student.progress} className="h-1.5 flex-1" />
                              <span className="text-xs font-bold text-[#10264F]">{student.progress}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs font-semibold text-slate-700">
                            {formatLastConnection(student.last_connection || student.registered_at)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-xs font-bold">{student.evaluations}</TableCell>
                        <TableCell className="text-center text-xs font-bold">{student.activities}</TableCell>
                        <TableCell>
                          <Badge
                            variant={student.status === 'active' ? 'default' : 'secondary'}
                            className="text-[10px] font-bold"
                          >
                            {student.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2.5 text-xs font-bold text-[#0F3B8F] hover:bg-blue-50"
                              onClick={() => setSelectedUser(student)}
                            >
                              Ver Detalles
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setUserToDelete(student);
                                setDeleteReason('');
                                setDeleteError('');
                              }}
                              title="Eliminar usuario y notificar por correo"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      )}

      {/* PESTAÑA 2: BUZÓN DE MENSAJES Y SUGERENCIAS DE ESTUDIANTES */}
      {panelTab === 'suggestions' && (
        <div className="space-y-6">
          <Card className="p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h3 className="text-lg font-black text-[#10264F] tracking-wide">
                  BUZÓN DE MENSAJES Y SUGERENCIAS DE ESTUDIANTES
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mensajes enviados por los estudiantes a través de su panel. Se notifican automáticamente a las cuentas de los docentes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-bold text-slate-700">
                  {suggestions.length} totales
                </Badge>
                <Badge variant="default" className="text-xs font-bold bg-[#0F3B8F]">
                  {pendingSuggestionsCount} pendientes
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {suggestionsLoading ? (
                <p className="text-center py-8 text-xs text-muted-foreground">
                  Cargando mensajes y sugerencias...
                </p>
              ) : suggestions.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-slate-200">
                  <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-xs font-bold text-[#475569]">
                    No hay mensajes ni sugerencias registradas
                  </p>
                  <p className="mt-1 text-[11px] text-[#8C9AA8]">
                    Cuando un estudiante envíe un mensaje desde su panel, aparecerá aquí y se notificará por correo.
                  </p>
                </div>
              ) : (
                suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs hover:border-[#2D6BFF]/40 transition-all"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF0FF] px-3 py-1 text-xs font-black text-[#0F3B8F]">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-slate-800">{item.user_name}</span>
                        <span className="text-xs text-slate-500">({item.user_email})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.created_at).toLocaleString('es-CO')}
                        </span>
                        <Badge
                          variant={item.status === 'reviewed' ? 'default' : 'secondary'}
                          className={`text-[10px] font-bold ${
                            item.status === 'reviewed' ? 'bg-emerald-600' : 'bg-amber-500 text-white'
                          }`}
                        >
                          {item.status === 'reviewed' ? 'Revisado' : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-[#10264F]">{item.subject}</h4>
                      <p className="mt-1.5 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100">
                        {item.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500">
                        Atención / PQRS: <strong className="text-blue-900">liderabot.app@gmail.com</strong>
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={updatingSuggestionId === item.id}
                        onClick={() => handleMarkSuggestionReviewed(item.id, item.status)}
                        className="text-xs font-bold h-8"
                      >
                        <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                        {item.status === 'reviewed' ? 'Marcar como pendiente' : 'Marcar como revisado'}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* PESTAÑA 3: SOLICITUDES DE DOCENTES */}
      {panelTab === 'requests' && (
        <Card className="border-amber-200 bg-amber-50/50 shadow-md">
          <div className="flex items-start justify-between gap-4 border-b border-amber-200 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#10264F] tracking-wide">SOLICITUDES DE CUENTAS DOCENTES</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Revisa y aprueba las cuentas con rol docente que ya verificaron su correo institucional.
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="font-bold">{teacherRequests.length} pendientes</Badge>
          </div>
          <div className="p-5">
            {requestsLoading ? (
              <p className="text-xs text-muted-foreground">Cargando solicitudes...</p>
            ) : requestsError ? (
              <p className="text-xs text-red-600 font-bold">{requestsError}</p>
            ) : teacherRequests.length === 0 ? (
              <p className="text-xs text-muted-foreground">No hay solicitudes docentes pendientes por aprobar.</p>
            ) : (
              <div className="space-y-3">
                {teacherRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-white p-4 md:flex-row md:items-center md:justify-between shadow-xs"
                  >
                    <div>
                      <p className="font-bold text-xs text-[#10264F]">{request.name}</p>
                      <p className="text-xs text-muted-foreground">{request.email}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Solicitud registrada:{' '}
                        {request.registered_at
                          ? new Date(request.registered_at).toLocaleDateString('es-CO')
                          : 'fecha no disponible'}
                      </p>
                    </div>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
                      onClick={() => approveTeacherRequest(request.id)}
                      disabled={approvingRequestId === request.id}
                    >
                      <Check className="mr-1.5 h-4 w-4" />
                      {approvingRequestId === request.id ? 'Aprobando...' : 'Aprobar como Docente'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* MODAL 1: DETALLES DE LA CUENTA Y PROGRESO (con última conexión en LideraBot) */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="user-details-title"
          onClick={() => setSelectedUser(null)}
        >
          <Card
            className="w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b p-5 shrink-0 bg-[#0F3B8F] text-white">
              <div>
                <h3 id="user-details-title" className="text-lg font-black text-white tracking-wide">
                  DETALLES DE LA CUENTA Y PROGRESO REAL
                </h3>
                <p className="mt-0.5 text-xs text-blue-100">
                  Información académica, última conexión y respuestas del estudiante.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedUser(null)}
                aria-label="Cerrar detalles"
                className="text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">NOMBRE COMPLETO</p>
                  <p className="mt-1 font-black text-sm text-[#10264F]">{selectedUser.name}</p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">CORREO ELECTRÓNICO</p>
                  <p className="mt-1 break-all font-semibold text-xs text-[#10264F]">{selectedUser.email}</p>
                </div>

                {/* Apartado de Última Conexión en LideraBot (Requerido) */}
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-3.5 sm:col-span-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#0F3B8F]" />
                    <p className="text-xs font-black text-[#0F3B8F] uppercase tracking-wide">
                      ÚLTIMA CONEXIÓN EN LIDERABOT:
                    </p>
                  </div>
                  <p className="mt-1 text-sm font-extrabold text-[#10264F]">
                    {formatLastConnection(selectedUser.last_connection || selectedUser.registered_at)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Fecha exacta registrada:{' '}
                    {selectedUser.last_connection
                      ? new Date(selectedUser.last_connection).toLocaleString('es-CO')
                      : 'Sin registro previo'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">TIPO DE CUENTA</p>
                  <p className="mt-1 font-black text-xs text-[#10264F]">
                    {selectedUser.role === 'teacher' ? 'Docente' : 'Estudiante'}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ESTADO DE CUENTA</p>
                  <p className="mt-1 font-bold text-xs text-emerald-700">
                    {selectedUser.status === 'active' ? '✓ Activo' : 'Inactivo'}
                  </p>
                </div>

                {selectedUser.role === 'student' && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:col-span-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">RESUMEN ACADÉMICO REAL</p>
                    <p className="mt-1 font-black text-sm text-[#0F3B8F]">
                      {selectedUser.progress}% de progreso general real · {selectedUser.evaluations} evaluaciones completadas · {selectedUser.activities} submódulos activos
                    </p>
                  </div>
                )}
              </div>

              {selectedUser.role === 'student' && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-black text-xs text-[#10264F] uppercase tracking-wider">
                    Progreso y Respuestas por Submódulo / Eje
                  </h4>
                  {selectedUser.submodules && selectedUser.submodules.length > 0 ? (
                    selectedUser.submodules.map((sub, idx) => {
                      const [part1 = '', part2 = ''] = (sub.exercise_response || '').split('|||');
                      const hasExerciseAnswer = part1.trim().length > 0 && part2.trim().length > 0;
                      return (
                        <div
                          key={sub.activity_id || idx}
                          className="rounded-xl border border-slate-200 p-3.5 space-y-2 bg-white"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-extrabold text-xs text-[#10264F]">
                              {sub.submodule_name || `Submódulo ${sub.module_id || idx + 1}`}
                            </p>
                            <Badge
                              variant={sub.percentage === 100 ? 'default' : 'secondary'}
                              className="text-[10px] font-bold"
                            >
                              {sub.percentage ?? 0}%
                            </Badge>
                          </div>
                          {hasExerciseAnswer ? (
                            <div className="mt-2 space-y-1.5 rounded-lg bg-slate-50 p-3 text-xs border border-slate-100">
                              <p className="font-black text-[#0F3B8F] text-[11px] uppercase tracking-wide">
                                RESPUESTA AL EJERCICIO PRÁCTICO:
                              </p>
                              <p>
                                <strong className="uppercase text-[11px]">1. Estrategia:</strong> {part1}
                              </p>
                              <p>
                                <strong className="uppercase text-[11px]">2. Sustentación teórica:</strong> {part2}
                              </p>
                            </div>
                          ) : (
                            <p className="text-[11px] text-muted-foreground">
                              Actividad o ejercicio práctico aún no respondido.
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">
                      El estudiante aún no registra avance en los submódulos.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t p-4 shrink-0 bg-slate-50">
              <Button
                variant="destructive"
                size="sm"
                className="text-xs font-bold"
                onClick={() => {
                  setUserToDelete(selectedUser);
                  setDeleteReason('');
                  setDeleteError('');
                }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Eliminar este Usuario
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 2: CONFIRMACIÓN DE ELIMINACIÓN CON MOTIVO Y NOTIFICACIÓN POR CORREO */}
      {userToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <Card
            className="w-full max-w-lg overflow-hidden rounded-[24px] shadow-2xl border-red-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-red-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="h-5 w-5 text-amber-200" />
                <h3 className="text-base font-black tracking-wide">ELIMINAR CUENTA DE USUARIO</h3>
              </div>
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="text-white hover:text-white/80"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-900 space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-600" /> Acción Irreversible
                </p>
                <p>
                  Estás a punto de dar de baja la cuenta de{' '}
                  <strong>{userToDelete.name}</strong> ({userToDelete.email}). Se eliminará todo su historial, evaluaciones y progreso.
                </p>
              </div>

              {/* Notificación oficial por correo */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-[#0F3B8F] shrink-0 mt-0.5" />
                <p>
                  El sistema enviará automáticamente un correo electrónico a{' '}
                  <strong>{userToDelete.email}</strong> notificándole la baja y el motivo que especifiques a continuación.
                </p>
              </div>

              {deleteError && (
                <div className="rounded-xl border border-red-300 bg-red-100 p-3 text-xs font-bold text-red-800">
                  {deleteError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-black text-[#10264F] uppercase tracking-wide mb-1.5">
                  MOTIVO DE LA ELIMINACIÓN (REQUERIDO - SE NOTIFICARÁ AL ESTUDIANTE) *
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Ej: Inactividad prolongada en el período académico / Solicitud voluntaria del estudiante / Incumplimiento de requisitos..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Para más información o radicación formal, el correo de la notificación también incluirá la dirección de PQRS:{' '}
                  <strong>liderabot.app@gmail.com</strong>
                </p>
              </div>
            </div>

            <div className="border-t bg-slate-50 px-6 py-4 flex items-center justify-end gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserToDelete(null)}
                disabled={isDeleting}
                className="text-xs font-bold"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmDeleteUser}
                disabled={isDeleting || !deleteReason.trim()}
                className="text-xs font-extrabold bg-red-600 hover:bg-red-700 shadow-md"
              >
                {isDeleting ? 'Eliminando y notificando...' : 'Eliminar y Notificar por Correo'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 3: FILTROS */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsFilterOpen(false)}
        >
          <Card
            className="w-full max-w-xl overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h3 className="font-black text-sm text-[#10264F] tracking-wide">FILTRAR ESTUDIANTES</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {visibleUsers.length} cuentas visibles de {registeredUsers.length}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  BUSCAR POR NOMBRE O CORREO
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ej: Camilo o gmail.com"
                    className="w-full h-9 pl-9 pr-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F3B8F]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">ESTADO</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full h-9 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Activos</SelectItem>
                      <SelectItem value="inactive">Inactivos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">TIPO DE CUENTA</label>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full h-9 text-xs font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="student">Estudiantes</SelectItem>
                      <SelectItem value="teacher">Docentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t p-4 bg-slate-50">
              <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)}>
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
