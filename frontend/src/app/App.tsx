import { useEffect, useState } from 'react';
import { Home, ClipboardCheck, Dumbbell, TrendingUp, GraduationCap, X, LogOut, Moon, Sun } from 'lucide-react';
import { Header } from './components/Header';
import { ChatPanel } from './components/ChatPanel';
import { StatsPanel } from './components/StatsPanel';
import { SelfAssessment } from './components/SelfAssessment';
import { Activities } from './components/Activities';
import { Progress } from './components/Progress';
import { TeacherPanel } from './components/TeacherPanel';
import { LoginScreen } from './components/LoginScreen';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';

type Screen = 'home' | 'assessment' | 'activities' | 'progress' | 'teacher' | 'profile' | 'settings';

interface AuthUser {
  name: string;
  email: string;
}

const studentStatsData = {
  overallProgress: 73,
  activitiesCompleted: 12,
  currentStreak: 7,
  skills: [
    { name: 'Liderazgo', level: 85, color: '#1E3A8A' },
    { name: 'Comunicación', level: 78, color: '#FACC15' },
    { name: 'Toma de Decisiones', level: 70, color: '#10B981' },
    { name: 'Trabajo en Equipo', level: 88, color: '#8B5CF6' },
  ],
  recentBadges: ['Primera Evaluación', 'Racha de 7 días', 'Comunicador'],
};

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [userRole, setUserRole] = useState<'student' | 'teacher'>('student');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [settingsName, setSettingsName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('');
  const [settingsError, setSettingsError] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  if (!authUser) {
    return (
      <LoginScreen
        onLogin={(role, userData) => {
          setUserRole(role);
          setCurrentScreen(role === 'teacher' ? 'teacher' : 'home');
          setAuthUser(userData);
        }}
      />
    );
  }

  const navigation = [
    { id: 'home', label: 'Inicio', icon: Home, roles: ['student'] },
    { id: 'assessment', label: 'Autoevaluación', icon: ClipboardCheck, roles: ['student'] },
    { id: 'activities', label: 'Actividades', icon: Dumbbell, roles: ['student'] },
    { id: 'progress', label: 'Mi Progreso', icon: TrendingUp, roles: ['student'] },
    { id: 'teacher', label: 'Panel Docente', icon: GraduationCap, roles: ['teacher'] },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(userRole)
  );

  const renderContent = () => {
    if (currentScreen === 'settings') {
      const saveName = async () => {
        setSettingsMessage('');
        setSettingsError('');
        try {
          const response = await fetch('http://localhost:4001/auth/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: authUser.email, name: settingsName }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'No se pudo actualizar el nombre.');
          setAuthUser((previous) => previous ? { ...previous, name: data.name } : previous);
          setSettingsMessage('Nombre actualizado correctamente.');
        } catch (error) {
          setSettingsError(error instanceof Error ? error.message : 'No se pudo actualizar el nombre.');
        }
      };

      const savePassword = async () => {
        setSettingsMessage('');
        setSettingsError('');
        if (newPassword !== confirmNewPassword) {
          setSettingsError('Las nuevas contraseñas no coinciden.');
          return;
        }
        try {
          const response = await fetch('http://localhost:4001/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: authUser.email,
              current_password: currentPassword,
              new_password: newPassword,
            }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.message || 'No se pudo cambiar la contraseña.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
          setSettingsMessage(data.message);
        } catch (error) {
          setSettingsError(error instanceof Error ? error.message : 'No se pudo cambiar la contraseña.');
        }
      };

      return (
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h2>Configuración</h2>
            <p className="text-muted-foreground mt-1">Personaliza tu cuenta y tus preferencias.</p>
          </div>
          {settingsMessage && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{settingsMessage}</p>}
          {settingsError && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{settingsError}</p>}
          <Card className="p-6 shadow-md">
            <h3 className="mb-4">Datos personales</h3>
            <label className="block text-sm font-medium mb-1.5">Nombre</label>
            <input
              value={settingsName}
              onChange={(event) => setSettingsName(event.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
              placeholder={authUser.name}
            />
            <Button className="mt-4" onClick={saveName}>Guardar nombre</Button>
          </Card>
          <Card className="p-6 shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3>Tema oscuro</h3>
                <p className="text-sm text-muted-foreground">Cambia la apariencia de la aplicación.</p>
              </div>
              <Button variant="outline" onClick={() => setIsDarkMode((value) => !value)}>
                {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                {isDarkMode ? 'Claro' : 'Oscuro'}
              </Button>
            </div>
          </Card>
          <Card className="p-6 shadow-md">
            <h3 className="mb-4">Cambiar contraseña</h3>
            <div className="space-y-3">
              <input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Contraseña actual" className="w-full rounded-lg border border-gray-200 px-3 py-2" />
              <input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="Nueva contraseña (mínimo 6 caracteres)" className="w-full rounded-lg border border-gray-200 px-3 py-2" />
              <input type="password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} placeholder="Confirmar nueva contraseña" className="w-full rounded-lg border border-gray-200 px-3 py-2" />
            </div>
            <Button className="mt-4" onClick={savePassword}>Cambiar contraseña</Button>
          </Card>
        </div>
      );
    }

    if (currentScreen === 'profile') {
      return (
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 shadow-md">
            <div className="flex items-center gap-4 border-b pb-5">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
                {authUser.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2>Mi Perfil</h2>
                <p className="text-muted-foreground">Información de tu cuenta</p>
              </div>
            </div>
            <div className="grid gap-4 pt-5 sm:grid-cols-2">
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Nombre completo</p>
                <p className="font-semibold mt-1">{authUser.name}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Correo electrónico</p>
                <p className="font-semibold mt-1 break-all">{authUser.email}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Tipo de cuenta</p>
                <p className="font-semibold mt-1">{userRole === 'teacher' ? 'Docente' : 'Estudiante'}</p>
              </div>
              <div className="rounded-lg bg-muted/40 p-4">
                <p className="text-sm text-muted-foreground">Estado</p>
                <p className="font-semibold text-green-600 mt-1">Sesión activa</p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    if (userRole === 'teacher') {
      return <TeacherPanel />;
    }

    switch (currentScreen) {
      case 'home':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Panel - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 h-[600px]">
              <ChatPanel />
            </div>

            {/* Stats Panel - Takes 1 column */}
            <div className="lg:col-span-1">
              <StatsPanel data={studentStatsData} />
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-3">
              <Card className="p-6 shadow-md">
                <h3 className="mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => setCurrentScreen('assessment')}
                  >
                    <ClipboardCheck className="w-6 h-6 text-primary" />
                    <div>
                      <p>Autoevaluación</p>
                      <p className="text-xs text-muted-foreground">Evalúa tus habilidades</p>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => setCurrentScreen('activities')}
                  >
                    <Dumbbell className="w-6 h-6 text-primary" />
                    <div>
                      <p>Ejercicios</p>
                      <p className="text-xs text-muted-foreground">Practica liderazgo</p>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2 hover:border-primary hover:bg-primary/5"
                    onClick={() => setCurrentScreen('progress')}
                  >
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <div>
                      <p>Mi Progreso</p>
                      <p className="text-xs text-muted-foreground">Ver estadísticas</p>
                    </div>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        );
      case 'assessment':
        return <SelfAssessment />;
      case 'activities':
        return <Activities />;
      case 'progress':
        return <Progress />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userRole}
        userName={authUser.name}
        userEmail={authUser.email}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onHomeClick={() => {
          setCurrentScreen(userRole === 'teacher' ? 'teacher' : 'home');
          setIsMobileMenuOpen(false);
        }}
        onProfile={() => setCurrentScreen('profile')}
        onSettings={() => {
          setSettingsName(authUser.name);
          setSettingsMessage('');
          setSettingsError('');
          setCurrentScreen('settings');
        }}
        onLogout={() => setAuthUser(null)}
      />

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-white min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-4 flex flex-col h-full">
            {/* User info */}
            <div className="mb-6 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground">Sesión iniciada como</p>
              <p className="font-semibold text-primary text-sm truncate">{authUser.name}</p>
              <p className="text-xs text-muted-foreground truncate">{authUser.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole === 'student' ? 'Estudiante' : 'Docente'}</p>
            </div>

            <div className="space-y-1 flex-1">
              {filteredNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id as Screen)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <button
              onClick={() => setAuthUser(null)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}>
            <aside className="w-64 bg-white h-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3>Menú</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* User info */}
                <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <p className="text-xs text-muted-foreground">Sesión iniciada como</p>
                  <p className="font-semibold text-primary text-sm truncate">{authUser.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userRole === 'student' ? 'Estudiante' : 'Docente'}</p>
                </div>

                <div className="space-y-1 flex-1">
                  {filteredNavigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentScreen(item.id as Screen);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => { setAuthUser(null); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
