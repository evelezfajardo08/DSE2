import { useEffect, useState } from 'react';
import { Bot, GraduationCap, User, Eye, EyeOff, ArrowRight, BookOpen, Trophy, Users, ChevronLeft } from 'lucide-react';

type Role = 'student' | 'teacher';
type AuthMode = 'role-select' | 'login' | 'register';

interface LoginScreenProps {
  onLogin: (role: Role, userData: { name: string; email: string }) => void;
}

const STUDENT_FEATURES = [
  { icon: Bot, text: 'Chatbot mentor personalizado' },
  { icon: Trophy, text: 'Sistema de logros y progreso' },
  { icon: BookOpen, text: 'Actividades de liderazgo' },
];

const TEACHER_FEATURES = [
  { icon: Users, text: 'Panel de seguimiento grupal' },
  { icon: Trophy, text: 'Reportes de desempeño' },
  { icon: BookOpen, text: 'Gestión de cursos y grupos' },
];

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('role-select');
  const [role, setRole] = useState<Role>('student');
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState<'request' | 'code'>('request');
  const [resetToken, setResetToken] = useState('');
  const [registrationCode, setRegistrationCode] = useState('');
  const [isVerifyingRegistration, setIsVerifyingRegistration] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [verificationCooldownSeconds, setVerificationCooldownSeconds] = useState(0);
  const [legalDocument, setLegalDocument] = useState<'terms' | 'privacy' | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (selected: Role) => {
    setRole(selected);
    setAuthMode('login');
    setIsLogin(true);
    setIsForgotPassword(false);
    setResetStep('request');
    setResetToken('');
    setRegistrationCode('');
    setIsVerifyingRegistration(false);
    setError('');
    setSuccessMessage('');
  };

  const leavePasswordRecovery = () => {
    setIsForgotPassword(false);
    setResetStep('request');
    setResetToken('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setError('');
  };

  const [error, setError] = useState('');

  useEffect(() => {
    if (cooldownSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [cooldownSeconds]);

  useEffect(() => {
    if (verificationCooldownSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setVerificationCooldownSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [verificationCooldownSeconds]);

  const formatCooldown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!isLogin && !acceptedTerms) {
      setError('Debes aceptar los términos y condiciones y la política de privacidad.');
      return;
    }

    if (!isLogin && !/^[^\s@]+@gmail\.com$/i.test(form.email.trim())) {
      setError('Para registrarte debes usar una cuenta de correo @gmail.com.');
      return;
    }

    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    const payload = isLogin
      ? { email: form.email, password: form.password, role }
      : { name: form.name, email: form.email, password: form.password, role };

    try {
      const response = await fetch(`http://localhost:4001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en la autenticación');
      }

      if (!isLogin) {
        setIsVerifyingRegistration(true);
        setError('');
        setVerificationCooldownSeconds(0);
        return;
      }

      localStorage.setItem('access_token', data.access_token);
      onLogin(data.user.role as Role, { name: data.user.name, email: data.user.email });
    } catch (err: any) {
      if (!isLogin && err.message.includes('registro pendiente')) {
        setIsVerifyingRegistration(true);
        setError('');
      } else {
        setError(err.message);
      }
    }
  };

  const handleResendRegistrationCode = async () => {
    setError('');

    if (verificationCooldownSeconds > 0) {
      setError(`Espera ${formatCooldown(verificationCooldownSeconds)} antes de solicitar otro código.`);
      return;
    }

    try {
      const response = await fetch('http://localhost:4001/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No se pudo reenviar el código');
      setVerificationCooldownSeconds(60);
      setRegistrationCode('');
      setError('Te enviamos un nuevo código. Revisa también la carpeta de spam.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleVerifyRegistration = async () => {
    setError('');
    if (!registrationCode.trim()) {
      setError('Ingresa el código de verificación enviado a tu correo.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4001/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code: registrationCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'No se pudo verificar el correo');
      if (data.approval_required) {
        setIsVerifyingRegistration(false);
        setIsLogin(true);
        setSuccessMessage(data.message);
        setRegistrationCode('');
        return;
      }
      localStorage.setItem('access_token', data.access_token);
      onLogin(data.user.role as Role, { name: data.user.name, email: data.user.email });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleForgotPasswordRequest = async () => {
    setError('');

    if (cooldownSeconds > 0) {
      setError(`Espera ${formatCooldown(cooldownSeconds)} antes de generar otro código.`);
      return;
    }

    if (!form.email.trim()) {
      setError('Ingresa tu correo electrónico para recuperar la contraseña.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo recuperar la contraseña');
      }

      setResetStep('code');
      setResetToken(data.reset_token || '');
      setError('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setForm((prev) => ({ ...prev, password: '' }));
      setCooldownSeconds(60);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    setError('');

    if (!form.email.trim()) {
      setError('Debes ingresar tu correo electrónico.');
      return;
    }

    if (!resetToken.trim()) {
      setError('Ingresa el código de recuperación que te fue generado.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4001/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          reset_token: resetToken,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'No se pudo restablecer la contraseña');
      }

      setError('');
      setIsForgotPassword(false);
      setResetStep('request');
      setResetToken('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setIsLogin(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const features = role === 'student' ? STUDENT_FEATURES : TEACHER_FEATURES;
  const roleLabel = role === 'student' ? 'Estudiante' : 'Docente';
  const roleColor = role === 'student' ? 'from-blue-600 to-blue-800' : 'from-indigo-700 to-purple-800';
  const accentColor = role === 'student' ? 'bg-yellow-400' : 'bg-purple-400';

  if (authMode === 'role-select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1e4fa8] to-[#1a2f6e] flex flex-col items-center justify-center p-4">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#FACC15]/10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-4">
              <Bot className="w-11 h-11 text-[#1E3A8A]" />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">LideraBot</h1>
            <p className="text-blue-200 mt-1 text-center">Tu asistente virtual para desarrollar liderazgo</p>
          </div>

          {/* Role Cards */}
          <p className="text-center text-white/70 text-sm mb-6 uppercase tracking-widest font-medium">
            ¿Cómo quieres ingresar?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student Card */}
            <button
              onClick={() => handleRoleSelect('student')}
              className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FACC15]/60 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-12 h-12 bg-[#FACC15] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">Soy Estudiante</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Desarrolla habilidades de liderazgo con tu mentor virtual personalizado.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[#FACC15] text-sm font-medium">
                Comenzar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Teacher Card */}
            <button
              onClick={() => handleRoleSelect('teacher')}
              className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-purple-400/60 rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="w-12 h-12 bg-purple-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-1">Soy Docente</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Monitorea el progreso de tus estudiantes y gestiona grupos académicos.
              </p>
              <div className="mt-4 flex items-center gap-2 text-purple-300 text-sm font-medium">
                Comenzar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          <p className="text-center text-white/40 text-xs mt-8">
            Plataforma educativa para el desarrollo de competencias de liderazgo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex">
      {/* Left panel — branding */}
      <div className={`hidden lg:flex flex-col justify-between w-[420px] bg-gradient-to-b ${roleColor} p-10 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10">
          <button
            onClick={() => setAuthMode('role-select')}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm mb-10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Cambiar tipo de acceso
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-[#1E3A8A]" />
            </div>
            <div>
              <div className="text-white font-bold text-xl leading-none">LideraBot</div>
              <div className="text-white/60 text-xs mt-0.5">Asistente virtual educativo</div>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 ${accentColor} text-[#1E3A8A] text-xs font-bold px-3 py-1.5 rounded-full mb-6`}>
            {role === 'student' ? <User className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
            Acceso {roleLabel}
          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-3">
            {role === 'student'
              ? 'Desarrolla tu potencial de liderazgo'
              : 'Gestiona y potencia a tus estudiantes'}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            {role === 'student'
              ? 'Aprende, practica y mide tu crecimiento con un mentor virtual adaptado a ti.'
              : 'Visualiza el progreso de tu grupo, personaliza actividades y genera reportes académicos.'}
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/80 text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile back + brand */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setAuthMode('role-select')}
              className="flex items-center gap-1 text-[#1E3A8A] text-sm mb-4 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver
            </button>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#1E3A8A] rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-[#1E3A8A] text-lg">LideraBot</span>
            </div>
          </div>

          {!isForgotPassword && !isVerifyingRegistration && (
            <div className="bg-white rounded-2xl shadow-lg p-1 flex mb-6">
              <button
                onClick={() => {
                  setIsLogin(true);
                  leavePasswordRecovery();
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isLogin
                    ? 'bg-[#1E3A8A] text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  leavePasswordRecovery();
                }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  !isLogin
                    ? 'bg-[#1E3A8A] text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Registrarse
              </button>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              {!isForgotPassword && !isVerifyingRegistration && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {isLogin ? `Bienvenido/a de vuelta` : `Crear cuenta`}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {isLogin
                      ? `Ingresa tus datos para continuar como ${roleLabel.toLowerCase()}`
                      : `Completa el formulario para registrarte como ${roleLabel.toLowerCase()}`}
                  </p>
                </>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center">
                {successMessage}
              </div>
            )}

            {isLogin && isForgotPassword ? (
              <div className="space-y-4">
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Recuperar contraseña</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Revisa la bandeja de entrada de tu correo y también la carpeta de spam para encontrar el código de verificación.
                  </p>
                </div>

                {resetStep === 'request' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleField('email', e.target.value)}
                      placeholder={isLogin ? 'tu-correo@gmail.com' : 'Ej. nombre@gmail.com'}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                )}

                {resetStep === 'code' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Código temporal</label>
                      <input
                        type="text"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        placeholder="Pega el código recibido"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar nueva contraseña</label>
                      <input
                        type="password"
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] transition-all bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </>
                )}

                {resetStep === 'request' && cooldownSeconds > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-center text-sm text-amber-700">
                    Puedes solicitar otro código en <span className="font-bold">{formatCooldown(cooldownSeconds)}</span>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      leavePasswordRecovery();
                    }}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={resetStep === 'request' ? handleForgotPasswordRequest : handleResetPassword}
                    disabled={resetStep === 'request' && cooldownSeconds > 0}
                    className={`flex-1 py-3 font-semibold rounded-xl transition-all ${
                      resetStep === 'request' && cooldownSeconds > 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-[#1E3A8A] text-white hover:bg-[#1a3278]'
                    }`}
                  >
                    {resetStep === 'request'
                      ? cooldownSeconds > 0
                        ? `Espera ${formatCooldown(cooldownSeconds)}`
                        : 'Generar código'
                      : 'Restablecer'}
                  </button>
                </div>
              </div>
            ) : !isLogin && isVerifyingRegistration ? (
              <div className="space-y-4">
                <div className="mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Verifica tu correo</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Revisa la bandeja de entrada de tu correo y la carpeta de spam para encontrar el código de verificación.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Código de verificación
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                    placeholder="Ingresa el código de 6 dígitos"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] transition-all bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsVerifyingRegistration(false);
                      setRegistrationCode('');
                      setError('');
                    }}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Volver
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyRegistration}
                    className="flex-1 py-3 bg-[#1E3A8A] text-white font-semibold rounded-xl hover:bg-[#1a3278] transition-all"
                  >
                    Verificar correo
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleResendRegistrationCode}
                  disabled={verificationCooldownSeconds > 0}
                  className={`w-full text-sm font-semibold ${
                    verificationCooldownSeconds > 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-[#1E3A8A] hover:underline'
                  }`}
                >
                  {verificationCooldownSeconds > 0
                    ? `Puedes reenviar en ${formatCooldown(verificationCooldownSeconds)}`
                    : 'Reenviar código'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Register-only: name */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => handleField('name', e.target.value)}
                      placeholder="Ej. María González"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => handleField('email', e.target.value)}
                    placeholder="tu-correo@gmail.com"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => handleField('password', e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] transition-all bg-gray-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={form.confirmPassword}
                        onChange={(e) => handleField('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 pr-11 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/30 focus:border-[#1E3A8A] transition-all bg-gray-50 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setIsLogin(true);
                        setError('');
                        setResetStep('request');
                        setResetToken('');
                        setNewPassword('');
                        setNewPasswordConfirm('');
                      }}
                      className="text-[#1E3A8A] text-xs font-medium hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                {!isLogin && (
                  <div className="flex items-start gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      required
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#1E3A8A] rounded"
                    />
                    <label htmlFor="terms" className="text-[11px] leading-5 text-gray-500">
                      Acepto los{' '}
                      <button
                        type="button"
                        onClick={() => setLegalDocument('terms')}
                        className="text-[11px] font-medium leading-5 text-[#1E3A8A] cursor-pointer hover:underline"
                      >
                        términos y condiciones
                      </button>{' '}
                      y la{' '}
                      <button
                        type="button"
                        onClick={() => setLegalDocument('privacy')}
                        className="text-[11px] font-medium leading-5 text-[#1E3A8A] cursor-pointer hover:underline"
                      >
                        política de privacidad
                      </button>
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1E3A8A] hover:bg-[#1a3278] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mt-2 shadow-md hover:shadow-lg active:scale-95"
                >
                  {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {!isForgotPassword && !isVerifyingRegistration && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">o</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <p className="text-center text-sm text-gray-500">
                  {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#1E3A8A] font-semibold hover:underline"
                  >
                    {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
                  </button>
                </p>
              </>
            )}
          </div>

          {/* Role badge at bottom */}
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className={`w-2 h-2 rounded-full ${role === 'student' ? 'bg-[#FACC15]' : 'bg-purple-400'}`} />
            <span className="text-xs text-gray-400">Modo {roleLabel}</span>
            <button
              onClick={() => setAuthMode('role-select')}
              className="text-xs text-[#1E3A8A] font-medium hover:underline ml-1"
            >
              Cambiar
            </button>
          </div>
        </div>
      </div>

      {legalDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-document-title"
        >
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 id="legal-document-title" className="text-2xl font-bold text-gray-900">
                {legalDocument === 'terms' ? 'Términos y condiciones' : 'Política de privacidad'}
              </h2>
              <button
                type="button"
                onClick={() => setLegalDocument(null)}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700"
                aria-label="Cerrar documento"
              >
                ×
              </button>
            </div>

            {legalDocument === 'terms' ? (
              <div className="space-y-4 text-sm leading-relaxed text-gray-600">
                <p>
                  Estos términos regulan el uso de LideraBot, una plataforma educativa para
                  estudiantes y docentes.
                </p>
                <section>
                  <h3 className="font-semibold text-gray-900">Uso de la plataforma</h3>
                  <p>
                    El usuario debe proporcionar información verdadera, mantener segura su
                    contraseña y utilizar la cuenta únicamente para fines académicos. No está
                    permitido acceder a cuentas ajenas, vulnerar la seguridad, acosar a otros
                    usuarios ni manipular actividades o resultados.
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900">Cuentas y roles</h3>
                  <p>
                    La plataforma diferencia entre cuentas de estudiante y docente. El usuario
                    debe ingresar desde el tipo de acceso con el que se registró y no compartir
                    sus credenciales.
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900">Contraseña y recuperación</h3>
                  <p>
                    Los códigos de recuperación se envían al correo registrado, tienen vigencia
                    limitada y deben solicitarse únicamente para la cuenta propia.
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900">Disponibilidad y cambios</h3>
                  <p>
                    LideraBot puede realizar mantenimientos, modificar funcionalidades o
                    suspender cuentas que incumplan estos términos. Los términos pueden
                    actualizarse cuando sea necesario.
                  </p>
                </section>
                <p className="text-xs text-gray-500">
                  Para consultas: liderabot.app@gmail.com. Este texto debe ser revisado y
                  ajustado por un profesional jurídico antes de publicar la plataforma.
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-sm leading-relaxed text-gray-600">
                <p>
                  LideraBot trata los datos personales de acuerdo con la normativa aplicable de
                  protección de datos, incluida la Ley 1581 de 2012 cuando corresponda.
                </p>
                <section>
                  <h3 className="font-semibold text-gray-900">Datos que recopilamos</h3>
                  <p>
                    Podemos recopilar nombre, correo Gmail, contraseña cifrada, rol, actividades,
                    progreso, resultados y conversaciones necesarias para prestar el servicio.
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900">Finalidades</h3>
                  <p>
                    Usamos los datos para crear cuentas, autenticar usuarios, diferenciar roles,
                    guardar el progreso, generar reportes, enviar códigos de recuperación y
                    proteger el funcionamiento de la plataforma.
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900">Almacenamiento y seguridad</h3>
                  <p>
                    Los datos se almacenan en MongoDB Atlas. Las contraseñas se guardan cifradas
                    y los códigos de recuperación tienen expiración. No compartas tus
                    credenciales ni claves de configuración.
                  </p>
                </section>
                <section>
                  <h3 className="font-semibold text-gray-900">Derechos y contacto</h3>
                  <p>
                    Puedes solicitar consulta, actualización, corrección o eliminación de tus
                    datos cuando corresponda. Para ejercer estos derechos, escribe a
                    liderabot.app@gmail.com.
                  </p>
                </section>
                <p className="text-xs text-gray-500">
                  Esta política debe ser revisada y ajustada por un profesional jurídico antes
                  de publicar la plataforma, especialmente si participan menores de edad.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setLegalDocument(null)}
              className="mt-6 w-full rounded-xl bg-[#1E3A8A] py-3 font-semibold text-white hover:bg-[#1a3278]"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
