import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  Lightbulb,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircleQuestion,
  MessageSquare,
  Moon,
  Save,
  Settings,
  Sparkles,
  Sun,
  Target,
  Unlock,
  User,
  UserRound,
  X,
} from "lucide-react";
import { Header } from "./components/Header";
import { TeacherPanel } from "./components/TeacherPanel";
import { LoginScreen } from "./components/LoginScreen";
import { ChatPanel } from "./components/ChatPanel";
import { DiagnosticView } from "./components/DiagnosticView";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  LeadershipModule,
  ModuleStatus,
  leadershipModules,
  theoreticalFoundations,
} from "./leadershipData";
import { communicationModules } from "./communicationData";
import { decisionModules, DecisionTopicLevel } from "./decisionData";
import { DiagnosticEvaluationResult } from "./diagnosticData";

export type DisciplineKey = "leadership" | "communication" | "decision";

export interface DisciplineInfo {
  key: DisciplineKey;
  number: number;
  title: string;
  shortTitle: string;
  tagline: string;
  color: string;
  icon: typeof Sparkles;
}

export const disciplines: DisciplineInfo[] = [
  {
    key: "leadership",
    number: 1,
    title: "Módulo 1: Formación en Liderazgo",
    shortTitle: "Liderazgo",
    tagline: "Fortalece tu capacidad para guiar equipos y tomar decisiones estratégicas mediante 5 enfoques esenciales.",
    color: "#0F3B8F",
    icon: Sparkles,
  },
  {
    key: "communication",
    number: 2,
    title: "Módulo 2: Competencias en Comunicación Educativa",
    shortTitle: "Comunicación Educativa",
    tagline: "Domina la mediación pedagógica, la interacción dialógica y la educomunicación crítica en 5 ejes temáticos.",
    color: "#0891B2",
    icon: MessageSquare,
  },
  {
    key: "decision",
    number: 3,
    title: "Módulo 3: Toma de Decisiones y Resolución de Problemas",
    shortTitle: "Toma de Decisiones",
    tagline: "Desarrolla competencias analíticas, mitigación de sesgos cognitivos y criterios éticos para resolver problemas complejos.",
    color: "#7C3AED",
    icon: Target,
  },
];

export function getAnswerKey(discipline: DisciplineKey, modId: number, lvl: number) {
  if (discipline === "leadership") {
    return `${modId}-${lvl}`;
  }
  return `${discipline}-${modId}-${lvl}`;
}

type View =
  | "home"
  | "intro"
  | "evaluation"
  | "complete"
  | "diagnostic"
  | "chatbot"
  | "foundations"
  | "responses"
  | "profile"
  | "settings";
type TeacherScreen = "teacher" | "profile" | "settings";

const API_BASE =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.MODE === "production" ? "" : "http://localhost:4001");

interface AuthUser {
  id: number;
  name: string;
  email: string;
  currentStreak: number;
}

export type ModuleWithProgress = LeadershipModule & {
  status: ModuleStatus;
  progress: number;
  completedLevels: number;
  isUnlocked: boolean;
  stepOrderIndex: number;
  unlockRequirementText: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Pill({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        className,
      )}
    >
      {children}
    </span>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "ES";
}

function isAnswerValid(level: number, value?: string) {
  if (!value) return false;
  if (value.includes("|||")) {
    const [part1 = "", part2 = ""] = value.split("|||");
    return part1.trim().length > 0 && part2.trim().length > 0;
  }
  return value.trim().length > 0;
}

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<"student" | "teacher">("student");
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  // Shared Settings State
  const [settingsName, setSettingsName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [settingsMessage, setSettingsMessage] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Teacher Navigation State
  const [teacherScreen, setTeacherScreen] = useState<TeacherScreen>("teacher");
  const [isTeacherMobileMenuOpen, setIsTeacherMobileMenuOpen] = useState(false);

  // Student UI State
  const [view, setView] = useState<View>("chatbot");
  const [currentDiscipline, setCurrentDiscipline] = useState<DisciplineKey>("leadership");
  const [activeModuleId, setActiveModuleId] = useState(1);
  const [level, setLevel] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<Record<number, string>>({});
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticEvaluationResult | null>(null);
  const [hasInteractedWithBot, setHasInteractedWithBot] = useState(false);
  const [hasStartedSubmodule, setHasStartedSubmodule] = useState(false);
  const [lockNotice, setLockNotice] = useState<string | null>(null);
  const [pendingChatPrompt, setPendingChatPrompt] = useState<string | null>(null);
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsRestoringSession(false);
      return;
    }

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "La sesión no es válida.");
        setUserRole(data.role);
        if (data.role === "teacher") {
          setTeacherScreen("teacher");
        }
        setAuthUser({
          id: Number(data.id),
          name: data.name,
          email: data.email,
          currentStreak: data.currentStreak || 0,
        });
      })
      .catch(() => {
        localStorage.removeItem("access_token");
      })
      .finally(() => setIsRestoringSession(false));
  }, []);

  // Hydrate answers, bot interaction & diagnostic for logged-in student
  useEffect(() => {
    if (!authUser) return;
    try {
      const saved = localStorage.getItem(`liderabot-module-answers:${authUser.email}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setAnswers(parsed);
        }
      } else {
        setAnswers({});
      }

      const savedDiagAns = localStorage.getItem(`liderabot-diagnostic-answers:${authUser.email}`);
      if (savedDiagAns) {
        const parsedDiagAns = JSON.parse(savedDiagAns);
        if (parsedDiagAns && typeof parsedDiagAns === "object") {
          setDiagnosticAnswers(parsedDiagAns);
        }
      } else {
        setDiagnosticAnswers({});
      }

      const savedBotInteracted = localStorage.getItem(
        `liderabot-bot-interacted:${authUser.email}`,
      );
      const savedSubStarted = localStorage.getItem(
        `liderabot-submodule-started:${authUser.email}`,
      );
      setHasStartedSubmodule(savedSubStarted === "true");

      const savedDiagRes = localStorage.getItem(`liderabot-diagnostic-result:${authUser.email}`);
      if (savedDiagRes) {
        const parsedDiagRes = JSON.parse(savedDiagRes);
        if (parsedDiagRes && typeof parsedDiagRes === "object") {
          setDiagnosticResult(parsedDiagRes);
          setHasInteractedWithBot(true);
          setView("home");
          return;
        }
      }

      setDiagnosticResult(null);
      setHasInteractedWithBot(savedBotInteracted === "true");
      setView("chatbot");
    } catch {
      setAnswers({});
      setDiagnosticAnswers({});
      setDiagnosticResult(null);
      setHasInteractedWithBot(false);
      setHasStartedSubmodule(false);
      setView("chatbot");
    }
  }, [authUser]);

  const handleBotInteraction = () => {
    if (!hasInteractedWithBot) {
      setHasInteractedWithBot(true);
      if (authUser) {
        localStorage.setItem(`liderabot-bot-interacted:${authUser.email}`, "true");
      }
      setLockNotice(null);
    }
  };

  const handleSaveDiagnosticProgress = (
    nextAnswers: Record<number, string>,
    nextResult: DiagnosticEvaluationResult | null,
  ) => {
    setDiagnosticAnswers(nextAnswers);
    setDiagnosticResult(nextResult);
    if (authUser) {
      localStorage.setItem(
        `liderabot-diagnostic-answers:${authUser.email}`,
        JSON.stringify(nextAnswers),
      );
      if (nextResult) {
        setHasInteractedWithBot(true);
        localStorage.setItem(`liderabot-bot-interacted:${authUser.email}`, "true");
        localStorage.setItem(
          `liderabot-diagnostic-result:${authUser.email}`,
          JSON.stringify(nextResult),
        );
        if (nextResult.recommendedStartingSubmoduleId) {
          setActiveModuleId(nextResult.recommendedStartingSubmoduleId);
        }
        fetch(`${API_BASE}/results`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: Date.now(),
            user_id: authUser.id,
            evaluation_id: 1,
            score: nextResult.overallPercentage,
            evaluation_date: new Date().toISOString(),
          }),
        }).catch(() => undefined);
      }
    }
  };

  const rawDisciplineModules = useMemo(() => {
    switch (currentDiscipline) {
      case "communication":
        return communicationModules;
      case "decision":
        return decisionModules;
      case "leadership":
      default:
        return leadershipModules;
    }
  }, [currentDiscipline]);

  // Compute recommended stepped unlocking order
  const recommendedSubmoduleOrder = useMemo(() => {
    if (currentDiscipline !== "leadership") return [1, 2, 3, 4, 5];
    if (!diagnosticResult) return [1, 2, 3, 4, 5];
    const rawOrder = diagnosticResult.recommendedSubmoduleOrder;
    if (Array.isArray(rawOrder) && rawOrder.length === 5) {
      return rawOrder;
    }
    const startId = diagnosticResult.recommendedStartingSubmoduleId || 1;
    return [startId, ...[1, 2, 3, 4, 5].filter((id) => id !== startId)];
  }, [currentDiscipline, diagnosticResult]);

  // Compute which submodules are currently unlocked (Stepped Unlocking)
  const unlockedSubmoduleIds = useMemo(() => {
    if (currentDiscipline === "leadership") {
      if (!diagnosticResult) return [];
      const unlocked: number[] = [];
      for (let i = 0; i < recommendedSubmoduleOrder.length; i++) {
        const modId = recommendedSubmoduleOrder[i];
        if (i === 0) {
          unlocked.push(modId);
        } else {
          const prevModId = recommendedSubmoduleOrder[i - 1];
          const prevCompleted =
            [1, 2, 3, 4, 5].filter((lvl) =>
              isAnswerValid(lvl, answers[getAnswerKey("leadership", prevModId, lvl)]),
            ).length === 5;
          if (prevCompleted && unlocked.includes(prevModId)) {
            unlocked.push(modId);
          } else {
            break;
          }
        }
      }
      return unlocked;
    }

    // Para Comunicación y Toma de Decisiones: el Eje 1 inicia desbloqueado y los siguientes se desbloquean secuencialmente al completar 5/5
    const unlocked: number[] = [1];
    for (let modId = 2; modId <= 5; modId++) {
      const prevModId = modId - 1;
      const prevCompleted =
        [1, 2, 3, 4, 5].filter((lvl) =>
          isAnswerValid(lvl, answers[getAnswerKey(currentDiscipline, prevModId, lvl)]),
        ).length === 5;
      if (prevCompleted && unlocked.includes(prevModId)) {
        unlocked.push(modId);
      } else {
        break;
      }
    }
    return unlocked;
  }, [currentDiscipline, diagnosticResult, recommendedSubmoduleOrder, answers]);

  // Compute dynamic progress across all 5 modules (25 total levels) + lock status
  const computedModules: ModuleWithProgress[] = useMemo(() => {
    return rawDisciplineModules.map((mod) => {
      const completedLevels = [1, 2, 3, 4, 5].filter((lvl) =>
        isAnswerValid(lvl, answers[getAnswerKey(currentDiscipline, mod.id, lvl)]),
      ).length;
      const progress = Math.round((completedLevels / 5) * 100);
      const status: ModuleStatus =
        completedLevels === 5
          ? "Completado"
          : completedLevels > 0
            ? "En progreso"
            : "No iniciado";

      const isUnlocked = unlockedSubmoduleIds.includes(mod.id);
      const stepOrderIndex = mod.id - 1;

      let unlockRequirementText = "";
      if (currentDiscipline === "leadership") {
        if (!hasInteractedWithBot) {
          unlockRequirementText = "Bloqueado · Habla primero con LideraBot";
        } else if (!diagnosticResult) {
          unlockRequirementText = "Bloqueado · Realiza la Prueba Diagnóstica";
        } else if (!isUnlocked && stepOrderIndex > 0) {
          const prevModId = recommendedSubmoduleOrder[stepOrderIndex - 1];
          unlockRequirementText = `Bloqueado · Completa antes el Submódulo 0${prevModId}`;
        }
      } else {
        if (!isUnlocked) {
          unlockRequirementText = `Bloqueado · Completa los 5 niveles del Eje 0${mod.id - 1} para desbloquear`;
        }
      }

      return {
        ...mod,
        completedLevels,
        progress,
        status,
        isUnlocked,
        stepOrderIndex: stepOrderIndex === -1 ? mod.id - 1 : stepOrderIndex,
        unlockRequirementText,
      };
    });
  }, [
    rawDisciplineModules,
    currentDiscipline,
    answers,
    unlockedSubmoduleIds,
    recommendedSubmoduleOrder,
    hasInteractedWithBot,
    diagnosticResult,
  ]);

  const completedAnswerKeys = useMemo(() => {
    const keys: string[] = [];
    const allDisciplines: DisciplineKey[] = ["leadership", "communication", "decision"];
    for (const disc of allDisciplines) {
      const list =
        disc === "communication"
          ? communicationModules
          : disc === "decision"
            ? decisionModules
            : leadershipModules;
      for (const mod of list) {
        for (const lvl of [1, 2, 3, 4, 5]) {
          const k = getAnswerKey(disc, mod.id, lvl);
          if (isAnswerValid(lvl, answers[k])) {
            keys.push(k);
          }
        }
      }
    }
    return keys;
  }, [answers]);

  const totalCompletedLevels = computedModules.reduce((acc, m) => acc + m.completedLevels, 0);
  const overallProgress = Math.round((totalCompletedLevels / 25) * 100);

  const activeModule = useMemo(
    () => computedModules.find((item) => item.id === activeModuleId) ?? computedModules[0],
    [computedModules, activeModuleId],
  );

  const answerKey = getAnswerKey(currentDiscipline, activeModuleId, level);
  const currentAnswer = answers[answerKey] ?? "";

  const showTemporaryNotice = (msg: string) => {
    setLockNotice(msg);
    setTimeout(() => {
      setLockNotice((current) => (current === msg ? null : current));
    }, 5500);
  };

  const handleOpenDiagnosticGuarded = () => {
    setMobileNav(false);
    if (!hasInteractedWithBot && !diagnosticResult) {
      setView("chatbot");
      showTemporaryNotice(
        "Para desbloquear la Prueba Diagnóstica Inicial, primero envía un mensaje o interactúa con LideraBot.",
      );
      return;
    }
    setLockNotice(null);
    setView("diagnostic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chooseModule = (item: ModuleWithProgress) => {
    if (!item.isUnlocked) {
      if (!hasInteractedWithBot) {
        setView("chatbot");
        showTemporaryNotice(
          "Primero interactúa con LideraBot para desbloquear la Prueba Diagnóstica Inicial.",
        );
        return;
      }
      if (!diagnosticResult) {
        setView("diagnostic");
        showTemporaryNotice(
          "Realiza primero la Prueba Diagnóstica Inicial para que LideraBot desbloquee tu primer módulo recomendado.",
        );
        return;
      }
      showTemporaryNotice(item.unlockRequirementText);
      return;
    }

    setLockNotice(null);
    setHasStartedSubmodule(true);
    if (authUser) {
      localStorage.setItem(`liderabot-submodule-started:${authUser.email}`, "true");
    }
    setActiveModuleId(item.id);
    const firstPending =
      [1, 2, 3, 4, 5].find(
        (lvl) => !isAnswerValid(lvl, answers[getAnswerKey(currentDiscipline, item.id, lvl)]),
      ) ?? 1;
    setLevel(firstPending);
    setView("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setMobileNav(false);
    if (!hasInteractedWithBot && !diagnosticResult) {
      setView("chatbot");
      showTemporaryNotice(
        "Interactúa primero con LideraBot para desbloquear la Prueba Diagnóstica y los módulos.",
      );
      return;
    }
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAskChatbotWithPrompt = (promptText: string) => {
    handleBotInteraction();
    setPendingChatPrompt(promptText);
    setIsFloatingChatOpen(false);
    setView("chatbot");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuthUser(null);
  };

  const openSettings = () => {
    if (!authUser) return;
    setSettingsName(authUser.name);
    setSettingsMessage("");
    setSettingsError("");
    if (userRole === "teacher") {
      setTeacherScreen("settings");
    } else {
      setView("settings");
      setMobileNav(false);
    }
  };

  const openProfile = () => {
    if (userRole === "teacher") {
      setTeacherScreen("profile");
    } else {
      setView("profile");
      setMobileNav(false);
    }
  };

  const saveName = async () => {
    if (!authUser) return;
    setSettingsMessage("");
    setSettingsError("");
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: authUser.email, name: settingsName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo actualizar el nombre.");
      setAuthUser((previous) => (previous ? { ...previous, name: data.name } : previous));
      setSettingsMessage("Nombre actualizado correctamente.");
    } catch (error) {
      setSettingsError(error instanceof Error ? error.message : "No se pudo actualizar el nombre.");
    }
  };

  const savePassword = async () => {
    if (!authUser) return;
    setSettingsMessage("");
    setSettingsError("");
    if (newPassword !== confirmNewPassword) {
      setSettingsError("Las nuevas contraseñas no coinciden.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authUser.email,
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo cambiar la contraseña.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setSettingsMessage(data.message);
    } catch (error) {
      setSettingsError(error instanceof Error ? error.message : "No se pudo cambiar la contraseña.");
    }
  };

  const saveAnswer = (value: string) => {
    setAnswers((previous) => {
      const next = { ...previous, [answerKey]: value };
      if (authUser) {
        localStorage.setItem(`liderabot-module-answers:${authUser.email}`, JSON.stringify(next));
      }
      return next;
    });
  };

  const syncAllSubmodulesToBackend = (currentAnswers: Record<string, string>) => {
    if (!authUser || userRole !== "student") return;

    const allDisciplines: { key: DisciplineKey; name: string; list: LeadershipModule[] }[] = [
      { key: "leadership", name: "Liderazgo", list: leadershipModules },
      { key: "communication", name: "Comunicación Educativa", list: communicationModules },
      { key: "decision", name: "Toma de Decisiones", list: decisionModules },
    ];

    allDisciplines.forEach(({ key, name, list }) => {
      const discTotalDone = list.reduce((acc, mod) => {
        return (
          acc +
          [1, 2, 3, 4, 5].filter((lvl) =>
            isAnswerValid(lvl, currentAnswers[getAnswerKey(key, mod.id, lvl)]),
          ).length
        );
      }, 0);
      const discPct = Math.round((discTotalDone / 25) * 100);

      list.forEach((mod) => {
        const doneLevels = [1, 2, 3, 4, 5].filter((lvl) =>
          isAnswerValid(lvl, currentAnswers[getAnswerKey(key, mod.id, lvl)]),
        ).length;
        const modPct = Math.round((doneLevels / 5) * 100);
        const exerciseResp = currentAnswers[getAnswerKey(key, mod.id, 5)] ?? "";

        fetch(`${API_BASE}/progress/activity-completed`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: authUser.id,
            user_email: authUser.email,
            activity_id: `submodulo-${key}-${mod.id}`,
            module_id: mod.id,
            submodule_name: `[${name}] ${mod.name}`,
            exercise_response: exerciseResp,
            overall_progress: discPct,
            percentage: modPct,
            status:
              doneLevels === 5 ? "completed" : doneLevels > 0 ? "in_progress" : "not_started",
          }),
        }).catch(() => undefined);
      });
    });
  };

  useEffect(() => {
    if (!authUser || userRole !== "student") return;
    syncAllSubmodulesToBackend(answers);
  }, [authUser, userRole, answers]);

  const continueEvaluation = () => {
    let updatedAnswers = answers;
    if (
      currentDiscipline === "leadership" &&
      level < 5 &&
      !isAnswerValid(level, answers[answerKey])
    ) {
      updatedAnswers = { ...answers, [answerKey]: "CONTENIDO_ESTUDIADO" };
      setAnswers(updatedAnswers);
      if (authUser) {
        localStorage.setItem(
          `liderabot-module-answers:${authUser.email}`,
          JSON.stringify(updatedAnswers),
        );
      }
    }

    syncAllSubmodulesToBackend(updatedAnswers);

    if (level < 5) {
      setLevel((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setView("complete");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderProfileSection = () => {
    if (!authUser) return null;
    return (
      <div className="max-w-3xl mx-auto py-8 px-5">
        <Card className="p-6 shadow-md">
          <div className="flex items-center gap-4 border-b pb-5">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-semibold">
              <User className="w-8 h-8 text-white" />
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
              <p className="text-sm text-muted-foreground">Nivel Diagnóstico</p>
              <p className="font-semibold mt-1">
                {diagnosticResult
                  ? `${diagnosticResult.overallLevelTitle} (${diagnosticResult.overallPercentage}%)`
                  : "Pendiente por presentar"}
              </p>
            </div>
            <div className="rounded-lg bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Módulos Habilitados</p>
              <p className="font-semibold text-[#0F3B8F] mt-1">
                3 de 3 módulos ({overallProgress}% global)
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderSettingsSection = () => {
    if (!authUser) return null;
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-8 px-5">
        <div>
          <h2>Configuración</h2>
          <p className="text-muted-foreground mt-1">Personaliza tu cuenta y tus preferencias.</p>
        </div>
        {settingsMessage && (
          <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{settingsMessage}</p>
        )}
        {settingsError && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{settingsError}</p>
        )}
        <Card className="p-6 shadow-md">
          <h3 className="mb-4">Datos personales</h3>
          <label className="block text-sm font-medium mb-1.5">Nombre</label>
          <input
            value={settingsName}
            onChange={(event) => setSettingsName(event.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2"
            placeholder={authUser.name}
          />
          <Button className="mt-4" onClick={saveName}>
            Guardar nombre
          </Button>
        </Card>
        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3>Tema oscuro</h3>
              <p className="text-sm text-muted-foreground">
                Cambia la apariencia de la aplicación.
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsDarkMode((value) => !value)}>
              {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {isDarkMode ? "Claro" : "Oscuro"}
            </Button>
          </div>
        </Card>
        <Card className="p-6 shadow-md">
          <h3 className="mb-4">Cambiar contraseña</h3>
          <div className="space-y-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Contraseña actual"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Nueva contraseña (mínimo 6 caracteres)"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              placeholder="Confirmar nueva contraseña"
              className="w-full rounded-lg border border-gray-200 px-3 py-2"
            />
          </div>
          <Button className="mt-4" onClick={savePassword}>
            Cambiar contraseña
          </Button>
        </Card>
      </div>
    );
  };

  if (isRestoringSession) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Cargando sesión...
      </div>
    );
  }

  if (!authUser) {
    return (
      <LoginScreen
        onLogin={(role, userData) => {
          setUserRole(role);
          if (role === "teacher") {
            setTeacherScreen("teacher");
          } else {
            setView("chatbot");
          }
          setAuthUser(userData);
        }}
      />
    );
  }

  // TEACHER VIEW (Preserved)
  if (userRole === "teacher") {
    return (
      <div className="min-h-screen bg-background">
        <Header
          userRole={userRole}
          userName={authUser.name}
          userEmail={authUser.email}
          onMenuClick={() => setIsTeacherMobileMenuOpen(!isTeacherMobileMenuOpen)}
          onHomeClick={() => {
            setTeacherScreen("teacher");
            setIsTeacherMobileMenuOpen(false);
          }}
          onProfile={openProfile}
          onSettings={openSettings}
          onLogout={handleLogout}
        />

        <div className="flex">
          <aside className="hidden lg:block w-64 border-r bg-white min-h-[calc(100vh-4rem)] sticky top-16">
            <div className="p-4 flex flex-col h-full">
              <div className="mb-6 p-3 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs text-muted-foreground">Sesión iniciada como</p>
                <p className="font-semibold text-primary text-sm truncate">{authUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{authUser.email}</p>
                <p className="text-xs text-muted-foreground capitalize">Docente</p>
              </div>

              <div className="space-y-1 flex-1">
                <button
                  onClick={() => setTeacherScreen("teacher")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    teacherScreen === "teacher"
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Panel Docente</span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-4"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>

          {isTeacherMobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsTeacherMobileMenuOpen(false)}
            >
              <aside className="w-64 bg-white h-full" onClick={(e) => e.stopPropagation()}>
                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3>Menú</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsTeacherMobileMenuOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-xs text-muted-foreground">Sesión iniciada como</p>
                    <p className="font-semibold text-primary text-sm truncate">{authUser.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">Docente</p>
                  </div>

                  <div className="space-y-1 flex-1">
                    <button
                      onClick={() => {
                        setTeacherScreen("teacher");
                        setIsTeacherMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        teacherScreen === "teacher"
                          ? "bg-primary text-white"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                      <span>Panel Docente</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsTeacherMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </aside>
            </div>
          )}

          <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {teacherScreen === "profile" && renderProfileSection()}
            {teacherScreen === "settings" && renderSettingsSection()}
            {teacherScreen === "teacher" && <TeacherPanel />}
          </main>
        </div>
      </div>
    );
  }

  // STUDENT VIEW (Full-Screen Chatbot + Stepped Diagnostic & Module Unlocking)
  return (
    <div
      className={cn(
        "bg-background text-foreground selection:bg-[#FACC15]/60",
        view === "chatbot" ? "h-screen overflow-hidden flex flex-col" : "min-h-screen",
      )}
    >
      <header className="sticky top-0 z-40 shrink-0 border-b border-white/10 bg-[#0B2D70] text-white shadow-[0_8px_24px_rgba(15,59,143,0.16)]">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 lg:px-8">
          <button
            onClick={() => {
              if (!diagnosticResult) {
                setView("chatbot");
              } else {
                goHome();
              }
            }}
            className="flex items-center gap-3 text-left"
            aria-label="Ir al inicio"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#FACC15] text-[#0F3B8F] shadow-[inset_0_-2px_0_rgba(0,0,0,.12)]">
              <BrainCircuit className="h-6 w-6" />
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-[-0.03em]">LideraBot</span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.19em] text-blue-200 sm:block">
                Laboratorio de liderazgo
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-1.5 md:flex">
            <button
              onClick={() => {
                setView("chatbot");
                setIsFloatingChatOpen(false);
                setMobileNav(false);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                view === "chatbot"
                  ? "bg-[#FACC15] text-[#0F3B8F] font-extrabold"
                  : "text-blue-100 hover:bg-white/10",
              )}
            >
              <Bot className="h-4 w-4" />
              Chatbot LideraBot
            </button>

            <button
              onClick={handleOpenDiagnosticGuarded}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                view === "diagnostic"
                  ? "bg-white/20 text-white font-bold"
                  : hasInteractedWithBot || diagnosticResult
                    ? "text-blue-100 hover:bg-white/10"
                    : "text-blue-300/60 hover:bg-white/5",
              )}
            >
              {hasInteractedWithBot || diagnosticResult ? (
                <ClipboardCheck className="h-4 w-4 text-[#FACC15]" />
              ) : (
                <LockKeyhole className="h-3.5 w-3.5 text-blue-300" />
              )}
              Prueba Diagnóstica
            </button>

            <button
              onClick={goHome}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                view === "home" || view === "intro" || view === "evaluation" || view === "complete"
                  ? "bg-white/20 text-white font-bold"
                  : diagnosticResult
                    ? "text-blue-100 hover:bg-white/10"
                    : "text-blue-300/60 hover:bg-white/5",
              )}
            >
              {!diagnosticResult && <LockKeyhole className="h-3.5 w-3.5 text-blue-300" />}
              Módulos (3 de 3)
            </button>

            <button
              onClick={() => {
                setView("foundations");
                setMobileNav(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                view === "foundations"
                  ? "bg-white/15 text-white"
                  : "text-blue-100 hover:bg-white/10",
              )}
            >
              Fundamentación
            </button>

            <button
              onClick={() => {
                setView("responses");
                setMobileNav(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                view === "responses"
                  ? "bg-white/15 text-white"
                  : "text-blue-100 hover:bg-white/10",
              )}
            >
              Progreso ({overallProgress}%)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden items-center gap-3 border-l border-white/20 pl-5 sm:flex text-left outline-none hover:opacity-90 transition-opacity">
                  <div className="text-right">
                    <p className="text-sm font-bold leading-tight">{authUser.name}</p>
                    <p className="text-[11px] text-blue-200">Estudiante · {overallProgress}%</p>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#A855F7] font-bold">
                    <User className="h-5 w-5 text-white" />
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-foreground truncate">{authUser.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{authUser.email}</p>
                  <p className="text-xs text-muted-foreground">Estudiante</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={openProfile}>
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openSettings}>
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setMobileNav(!mobileNav)}
              className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 md:hidden"
              aria-label="Abrir menú"
            >
              {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileNav && (
          <div className="border-t border-white/10 px-5 py-4 md:hidden space-y-1">
            <button
              onClick={() => {
                setView("chatbot");
                setMobileNav(false);
              }}
              className="block w-full rounded-lg bg-white/10 px-4 py-3 text-left text-sm font-semibold text-[#FACC15]"
            >
              Chatbot LideraBot
            </button>
            <button
              onClick={handleOpenDiagnosticGuarded}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-blue-100"
            >
              <span>Prueba Diagnóstica Inicial</span>
              {!hasInteractedWithBot && !diagnosticResult && <LockKeyhole className="h-4 w-4" />}
            </button>
            <button
              onClick={goHome}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-blue-100"
            >
              <span>Módulos (3 de 3)</span>
              {!diagnosticResult && <LockKeyhole className="h-4 w-4" />}
            </button>
            <button
              onClick={() => {
                setView("foundations");
                setMobileNav(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm font-semibold text-blue-100"
            >
              Fundamentación Teórica
            </button>
            <button
              onClick={() => {
                setView("responses");
                setMobileNav(false);
              }}
              className="block w-full px-4 py-3 text-left text-sm font-semibold text-blue-100"
            >
              Progreso ({overallProgress}%)
            </button>
            <button
              onClick={openProfile}
              className="block w-full px-4 py-3 text-left text-sm font-semibold text-blue-100"
            >
              Mi Perfil
            </button>
            <button
              onClick={openSettings}
              className="block w-full px-4 py-3 text-left text-sm font-semibold text-blue-100"
            >
              Configuración
            </button>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-3 text-left text-sm font-semibold text-red-300"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </header>

      {/* Lock Notice Toast Banner */}
      {lockNotice && (
        <div className="bg-[#FFF5C2] border-b border-[#F0D567] px-5 py-2.5 text-center text-xs font-extrabold text-[#5A4E1D] flex items-center justify-center gap-2 shrink-0">
          <LockKeyhole className="h-4 w-4 text-[#0F3B8F] shrink-0" />
          <span>{lockNotice}</span>
          <button
            onClick={() => setLockNotice(null)}
            className="ml-2 rounded-md px-2 py-0.5 text-[11px] underline"
          >
            Entendido
          </button>
        </div>
      )}

      {/* FULL-SCREEN CHATBOT VIEW (No outer page scroll needed) */}
      {view === "chatbot" && (
        <main className="flex-1 min-h-0 w-full max-w-[960px] mx-auto px-3 py-3 sm:px-6 sm:py-4 flex flex-col overflow-hidden">
          <ChatPanel
            userId={authUser.id}
            userEmail={authUser.email}
            userName={authUser.name}
            completedActivityIds={completedAnswerKeys}
            totalAvailableActivities={25}
            moduleAnswers={answers}
            diagnosticResult={diagnosticResult}
            hasInteractedWithBot={hasInteractedWithBot}
            unlockedSubmoduleIds={unlockedSubmoduleIds}
            initialPrompt={pendingChatPrompt}
            onPromptHandled={() => setPendingChatPrompt(null)}
            onBotInteraction={handleBotInteraction}
            onOpenDiagnostic={handleOpenDiagnosticGuarded}
            onOpenSubmodule={(modId, lvl) => {
              const target = computedModules.find((m) => m.id === modId);
              if (!target || !target.isUnlocked) {
                showTemporaryNotice(
                  target?.unlockRequirementText ||
                    "Completa primero la Prueba Diagnóstica Inicial para desbloquear tu módulo recomendado.",
                );
                return;
              }
              setHasStartedSubmodule(true);
              if (authUser) {
                localStorage.setItem(`liderabot-submodule-started:${authUser.email}`, "true");
              }
              setActiveModuleId(modId);
              setLevel(lvl ?? 1);
              setView("intro");
            }}
          />
        </main>
      )}

      {view === "home" && (
        <HomeView
          currentDiscipline={currentDiscipline}
          onSelectDiscipline={(disc) => {
            setCurrentDiscipline(disc);
            setActiveModuleId(1);
            setLevel(1);
          }}
          disciplines={disciplines}
          modules={computedModules}
          overallProgress={overallProgress}
          totalCompletedLevels={totalCompletedLevels}
          diagnosticResult={diagnosticResult}
          hasInteractedWithBot={hasInteractedWithBot}
          unlockedSubmoduleIds={unlockedSubmoduleIds}
          recommendedSubmoduleOrder={recommendedSubmoduleOrder}
          onChoose={chooseModule}
          onOpenDiagnostic={handleOpenDiagnosticGuarded}
          onOpenChatbot={() => {
            setView("chatbot");
          }}
          onOpenFoundations={() => {
            setView("foundations");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {view === "intro" && (
        <IntroView
          item={activeModule}
          discipline={currentDiscipline}
          onBack={goHome}
          onStart={() => {
            setView("evaluation");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {view === "evaluation" && (
        <EvaluationView
          item={activeModule}
          discipline={currentDiscipline}
          level={level}
          answer={currentAnswer}
          answers={answers}
          onAnswer={saveAnswer}
          onLevel={(nextLevel) => {
            setLevel(nextLevel);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onAskAiFeedback={(prompt) => handleAskChatbotWithPrompt(prompt)}
          onBack={() => {
            setView("intro");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onContinue={continueEvaluation}
        />
      )}
      {view === "complete" && (
        <CompleteView
          item={activeModule}
          discipline={currentDiscipline}
          answers={answers}
          modules={computedModules}
          recommendedSubmoduleOrder={recommendedSubmoduleOrder}
          onAskAiFeedback={() =>
            handleAskChatbotWithPrompt(
              `Acabo de completar satisfactoriamente el ${currentDiscipline === "leadership" ? "Submódulo" : "Eje"} 0${activeModule.id} (${activeModule.name}) de ${disciplines.find((d) => d.key === currentDiscipline)?.shortTitle}. Revisa mis 5 respuestas registradas, dame retroalimentación basada en ${activeModule.authorsSummary} e indícame cuál es el siguiente paso en mi ruta de aprendizaje.`,
            )
          }
          onReview={() => {
            setLevel(1);
            setView("evaluation");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onHome={goHome}
          onNext={() => {
            const currentOrderPos = recommendedSubmoduleOrder.indexOf(activeModule.id);
            const nextModId =
              currentOrderPos !== -1 && currentOrderPos + 1 < recommendedSubmoduleOrder.length
                ? recommendedSubmoduleOrder[currentOrderPos + 1]
                : recommendedSubmoduleOrder[0];
            const nextMod = computedModules.find((m) => m.id === nextModId) ?? computedModules[0];
            chooseModule(nextMod);
          }}
        />
      )}
      {view === "diagnostic" && (
        <DiagnosticView
          studentName={authUser.name}
          savedAnswers={diagnosticAnswers}
          savedResult={diagnosticResult}
          unlockedSubmoduleIds={unlockedSubmoduleIds}
          completedSubmoduleIds={computedModules
            .filter((m) => m.status === "Completado")
            .map((m) => m.id)}
          hasStartedSubmodule={
            hasStartedSubmodule || Object.values(answers).some((v) => v.trim().length > 0)
          }
          onSaveProgress={handleSaveDiagnosticProgress}
          onAskChatbotFeedback={handleAskChatbotWithPrompt}
          onOpenSubmodule={(modId) => {
            const target = computedModules.find((m) => m.id === modId) ?? computedModules[0];
            chooseModule(target);
          }}
          onBack={() => {
            if (diagnosticResult) {
              goHome();
            } else {
              setView("chatbot");
            }
          }}
        />
      )}
      {view === "foundations" && (
        <FoundationsView
          modules={computedModules}
          onChoose={chooseModule}
          onBack={goHome}
        />
      )}
      {view === "responses" && (
        <ResponsesView
          currentDiscipline={currentDiscipline}
          onSelectDiscipline={setCurrentDiscipline}
          disciplines={disciplines}
          answers={answers}
          onAskAiFeedback={(prompt) => handleAskChatbotWithPrompt(prompt)}
          onOpenModuleLevel={(disc, mod, lvl) => {
            if (disc !== currentDiscipline) {
              setCurrentDiscipline(disc);
            }
            if (!mod.isUnlocked) {
              showTemporaryNotice(mod.unlockRequirementText);
              return;
            }
            setActiveModuleId(mod.id);
            setLevel(lvl);
            setView("evaluation");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onBack={goHome}
        />
      )}
      {view === "profile" && renderProfileSection()}
      {view === "settings" && renderSettingsSection()}

      {/* Floating Chatbot Drawer Button (visible on all screens except full chatbot screen) */}
      {view !== "chatbot" && (
        <>
          {isFloatingChatOpen && (
            <div className="fixed bottom-20 right-5 z-50 w-[92vw] max-w-[440px] h-[540px] shadow-2xl">
              <ChatPanel
                userId={authUser.id}
                userEmail={authUser.email}
                userName={authUser.name}
                completedActivityIds={completedAnswerKeys}
                totalAvailableActivities={25}
                moduleAnswers={answers}
                diagnosticResult={diagnosticResult}
                hasInteractedWithBot={hasInteractedWithBot}
                unlockedSubmoduleIds={unlockedSubmoduleIds}
                initialPrompt={pendingChatPrompt}
                onPromptHandled={() => setPendingChatPrompt(null)}
                onBotInteraction={handleBotInteraction}
                onOpenDiagnostic={() => {
                  setIsFloatingChatOpen(false);
                  handleOpenDiagnosticGuarded();
                }}
                onOpenSubmodule={(modId, lvl) => {
                  const target = computedModules.find((m) => m.id === modId);
                  if (!target || !target.isUnlocked) {
                    showTemporaryNotice(
                      target?.unlockRequirementText ||
                        "Completa primero la Prueba Diagnóstica Inicial.",
                    );
                    return;
                  }
                  setIsFloatingChatOpen(false);
                  setActiveModuleId(modId);
                  setLevel(lvl ?? 1);
                  setView("evaluation");
                }}
              />
            </div>
          )}
          <button
            onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 rounded-full bg-[#0F3B8F] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_30px_rgba(15,59,143,0.35)] border-2 border-[#FACC15] hover:bg-[#174AA6] transition-transform hover:scale-105"
          >
            {isFloatingChatOpen ? (
              <>
                <X className="h-5 w-5 text-[#FACC15]" />
                <span>Cerrar LideraBot</span>
              </>
            ) : (
              <>
                <MessageSquare className="h-5 w-5 text-[#FACC15]" />
                <span>Mentor IA · LideraBot</span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}

function HomeView({
  currentDiscipline,
  disciplines: discList,
  onSelectDiscipline,
  modules,
  overallProgress,
  totalCompletedLevels,
  diagnosticResult,
  hasInteractedWithBot,
  unlockedSubmoduleIds,
  recommendedSubmoduleOrder,
  onChoose,
  onOpenDiagnostic,
  onOpenChatbot,
  onOpenFoundations,
}: {
  currentDiscipline: DisciplineKey;
  disciplines: DisciplineInfo[];
  onSelectDiscipline: (key: DisciplineKey) => void;
  modules: ModuleWithProgress[];
  overallProgress: number;
  totalCompletedLevels: number;
  diagnosticResult: DiagnosticEvaluationResult | null;
  hasInteractedWithBot: boolean;
  unlockedSubmoduleIds: number[];
  recommendedSubmoduleOrder: number[];
  onChoose: (item: ModuleWithProgress) => void;
  onOpenDiagnostic: () => void;
  onOpenChatbot: () => void;
  onOpenFoundations: () => void;
}) {
  const activeDiscipline =
    discList.find((d) => d.key === currentDiscipline) ?? discList[0];

  return (
    <main className="mx-auto max-w-[1140px] px-5 py-8 lg:px-8">
      {/* Selector de Disciplinas / Módulos */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-2xl bg-[#EEF2F8] p-1.5 border border-[#DCE3EF]">
        {discList.map((d) => {
          const Icon = d.icon;
          const isActive = currentDiscipline === d.key;
          return (
            <button
              key={d.key}
              onClick={() => onSelectDiscipline(d.key)}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-xs sm:text-sm font-extrabold transition-all",
                isActive
                  ? "bg-white text-[#0F3B8F] shadow-sm border border-[#DCE3EF]"
                  : "text-[#5A6A85] hover:text-[#0F3B8F] hover:bg-white/60",
              )}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                style={{ color: isActive ? d.color : undefined }}
              />
              <span className="truncate">{d.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Encabezado con información del módulo activo */}
      <section
        className="rounded-[24px] p-6 text-white md:p-8 transition-colors"
        style={{ backgroundColor: activeDiscipline.color }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white mb-2">
              {activeDiscipline.title}
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              {activeDiscipline.shortTitle}
            </h1>
            <p className="mt-2 text-sm leading-6 text-blue-100">
              {activeDiscipline.tagline}
            </p>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200">Progreso</p>
            <p className="mt-1 text-2xl font-extrabold text-[#FACC15]">{overallProgress}%</p>
            <p className="text-[11px] text-blue-100">
              {unlockedSubmoduleIds.length}/5 {currentDiscipline === "leadership" ? "submódulos" : "ejes"} desbloqueados
            </p>
          </div>
        </div>
      </section>

      {/* Distribución: Módulo desbloqueado a la izquierda y módulos bloqueados/completados a la derecha */}
      <section className="mt-8 grid gap-6 md:grid-cols-[1.25fr_0.95fr] items-start">
        {/* Lado izquierdo: Submódulo desbloqueado actual */}
        <div className="space-y-4">
          {modules.filter((m) => m.isUnlocked && m.status !== "Completado").length > 0 ? (
            modules
              .filter((m) => m.isUnlocked && m.status !== "Completado")
              .map((item, index) => (
                <ModuleCard
                  key={item.id}
                  item={item}
                  index={index}
                  onChoose={() => onChoose(item)}
                />
              ))
          ) : (
            <div className="rounded-[20px] border border-[#DCE3EF] bg-white p-6 text-center shadow-sm">
              <p className="text-sm font-extrabold text-[#10264F]">
                {unlockedSubmoduleIds.length === 0
                  ? "Realiza primero la Prueba Diagnóstica para desbloquear tu módulo aquí"
                  : `¡Has completado todos los submódulos de ${activeDiscipline.shortTitle}!`}
              </p>
              {unlockedSubmoduleIds.length === 0 && (
                <button
                  onClick={onOpenDiagnostic}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0F3B8F] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#174AA6]"
                >
                  Ir a la Prueba Diagnóstica <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Lado derecho: Submódulos bloqueados y completados */}
        <div className="space-y-3">
          {modules
            .filter((m) => !m.isUnlocked || m.status === "Completado")
            .map((item, index) => (
              <ModuleCard
                key={item.id}
                item={item}
                index={index}
                onChoose={() => onChoose(item)}
              />
            ))}
        </div>
      </section>
    </main>
  );
}

function ModuleCard({
  item,
  index,
  onChoose,
}: {
  item: ModuleWithProgress;
  index: number;
  onChoose: () => void;
}) {
  const Icon = item.icon;
  const isCompleted = item.isUnlocked && item.status === "Completado";

  // 1. Estado Bloqueado: sombreado, solo título y candadito
  if (!item.isUnlocked) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="rounded-[18px] border border-[#D5DFEE] bg-[#E9EEF6] px-5 py-4 opacity-75 select-none flex items-center justify-between gap-3"
      >
        <h3 className="text-sm font-bold text-[#64728A] md:text-base">
          0{item.id}. {item.name}
        </h3>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#DCE3EF] text-[#64728A]">
          <LockKeyhole className="h-4 w-4" />
        </span>
      </motion.article>
    );
  }

  // 2. Estado Completado: solo título y chulito en verde
  if (isCompleted) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={onChoose}
        className="cursor-pointer rounded-[18px] border border-[#CBEAD9] bg-[#F2FBF7] px-5 py-4 transition-all hover:shadow-sm flex items-center justify-between gap-3"
      >
        <h3 className="text-sm font-extrabold text-[#0E785F] md:text-base">
          0{item.id}. {item.name}
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#DFF5ED] px-3 py-1.5 text-xs font-extrabold text-[#0E785F]">
          <CheckCircle2 className="h-4 w-4 text-[#10856B]" />
          Completado
        </span>
      </motion.article>
    );
  }

  // 3. Estado Desbloqueado Activo: título, breve introducción y botón
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-[22px] border-2 border-[#2D6BFF] bg-white p-6 shadow-md flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
              style={{ color: item.color, backgroundColor: item.tint }}
            >
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="text-base font-extrabold text-[#10264F] md:text-lg">
              0{item.id}. {item.name}
            </h3>
          </div>
          <span className="rounded-full bg-[#EAF0FF] px-2.5 py-1 text-xs font-extrabold text-[#2457D5]">
            Desbloqueado
          </span>
        </div>

        <p className="mt-3 text-sm leading-6 text-[#4A5870]">{item.description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E9EDF4] flex items-center justify-end">
        <button
          onClick={onChoose}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F3B8F] px-5 py-2.5 text-xs font-extrabold text-white hover:bg-[#174AA6]"
        >
          {item.status === "En progreso" ? "Continuar submódulo" : "Iniciar submódulo"}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.article>
  );
}

function IntroView({
  item,
  discipline = "leadership",
  onBack,
  onStart,
}: {
  item: ModuleWithProgress;
  discipline?: DisciplineKey;
  onBack: () => void;
  onStart: () => void;
}) {
  const Icon = item.icon;
  const isLeadership = discipline === "leadership";
  const modLabel = isLeadership ? "Submódulo" : "Eje Temático";

  return (
    <main className="mx-auto max-w-[820px] px-5 py-8 lg:px-8">
      <button
        onClick={onBack}
        className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#53627A] hover:text-[#0F3B8F]"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a módulos
      </button>

      <section className="rounded-[24px] border border-[#DCE3EF] bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#2D6BFF]">
              {modLabel} 0{item.id}
            </span>
            <h1 className="mt-1 text-2xl font-extrabold text-[#10264F] md:text-3xl">
              {item.name}
            </h1>
          </div>
          <span
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
            style={{ color: item.color, backgroundColor: item.tint }}
          >
            <Icon className="h-6 w-6" />
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#4A5870]">{item.description}</p>
        <p className="mt-3 text-sm leading-6 text-[#31415E]">{item.intro}</p>

        {/* Lista de los 5 niveles */}
        <div className="mt-6 pt-5 border-t border-[#E9EEF6]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#64728A] mb-3">
            Niveles que desarrollarás en este {modLabel.toLowerCase()}:
          </h3>
          <div className="grid gap-2">
            {item.topics.map((t) => (
              <div
                key={t.level}
                className="flex items-center gap-3 rounded-xl bg-[#F8FAFD] border border-[#E9EEF6] px-3.5 py-2.5 text-xs text-[#2A374E]"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#0F3B8F] text-white font-extrabold text-[11px]">
                  {t.level}
                </span>
                <span className="font-bold text-[#0F3B8F]">
                  {t.difficultyLabel || `Tema ${t.level}`}:
                </span>
                <span className="truncate text-[#4A5870]">{t.topicTitle}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0F3B8F] px-6 py-3 text-sm font-extrabold text-white hover:bg-[#174AA6]"
          >
            Comenzar {modLabel.toLowerCase()} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </main>
  );
}

function EvaluationView({
  item,
  discipline = "leadership",
  level,
  answer,
  answers,
  onAnswer,
  onLevel,
  onAskAiFeedback,
  onBack,
  onContinue,
}: {
  item: ModuleWithProgress;
  discipline?: DisciplineKey;
  level: number;
  answer: string;
  answers: Record<string, string>;
  onAnswer: (value: string) => void;
  onLevel: (level: number) => void;
  onAskAiFeedback: (prompt: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const currentTopic = item.topics[level - 1] ?? item.topics[0];
  const isLeadership = discipline === "leadership";
  const isFinal = level === 5;
  const isSaved = isAnswerValid(level, answer);
  const canContinue = isLeadership ? (isFinal ? isSaved : true) : isSaved;
  const modLabel = isLeadership ? "Submódulo" : "Eje Temático";

  return (
    <main className="mx-auto max-w-[1160px] px-5 py-8 lg:px-8 lg:py-12">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#53627A] hover:text-[#0F3B8F]"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la introducción
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {isSaved && (
            <button
              onClick={() =>
                onAskAiFeedback(
                  isLeadership
                    ? `Dame retroalimentación académica sobre mi ejercicio práctico del Submódulo ${item.id} (${item.name}). Mi respuesta fue: "${answer.replace("|||", " / ")}"`
                    : `Revisa pedagógicamente mi respuesta para el Nivel ${level} (${currentTopic.difficultyLabel}) del ${modLabel} "${item.name}". Mi respuesta es: "${answer}". Contrasta con el marco de ${currentTopic.authorCitation}.`,
                )
              }
              className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF0FF] px-3 py-1 text-xs font-extrabold text-[#0F3B8F] hover:bg-[#DCE7FF]"
            >
              <Bot className="h-3.5 w-3.5 text-[#2D6BFF]" />
              Pedir retroalimentación a LideraBot
            </button>
          )}
          <Pill
            className={
              isSaved ? "bg-[#E7F8F1] text-[#0E785F]" : "bg-[#EAF0FF] text-[#0F3B8F]"
            }
          >
            {isSaved ? (
              <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
              <BookOpen className="h-3.5 w-3.5" />
            )}
            {isLeadership
              ? isFinal
                ? isSaved
                  ? "Ejercicio guardado"
                  : "Ejercicio pendiente"
                : isSaved
                  ? "Contenido completado"
                  : "Lectura de contenido"
              : isSaved
                ? "Nivel respondido"
                : "Respuesta pendiente"}
          </Pill>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-[22px] bg-[#0F3B8F] p-5 text-white lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-200">
            {modLabel} 0{item.id}
          </p>
          <h2 className="mt-2 text-xl font-extrabold leading-tight">{item.shortName}</h2>
          <p className="mt-1 text-xs text-blue-200">{item.authorsSummary}</p>
          <div className="my-5 h-px bg-white/15" />
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-blue-200">
            Niveles del Módulo
          </p>
          <div className="space-y-2">
            {item.topics.map((topicEntry) => {
              const number = topicEntry.level;
              const saved = isAnswerValid(
                number,
                answers[getAnswerKey(discipline, item.id, number)],
              );
              const available = number <= level || saved;
              const labelTitle = isLeadership
                ? number === 5
                  ? "Ejercicio Práctico Final"
                  : topicEntry.topicTitle.replace(/^Tema \d+:\s*/, "")
                : topicEntry.difficultyLabel || `Nivel ${number}`;
              const labelSub = isLeadership
                ? number === 5
                  ? "Evaluación del submódulo"
                  : `Contenido ${number} (Lectura)`
                : number === 5
                  ? "Pregunta Saber Pro"
                  : topicEntry.topicTitle.replace(/^[A-ZÁÉÍÓÚa-záéíóú\s0-9]+:\s*/, "");

              return (
                <button
                  key={number}
                  onClick={() => {
                    if (available) {
                      setShowModelAnswer(false);
                      onLevel(number);
                    }
                  }}
                  disabled={!available}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    number === level
                      ? "bg-white text-[#0F3B8F]"
                      : "text-blue-100 hover:bg-white/10",
                    !available && "cursor-not-allowed opacity-45",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-extrabold",
                      saved && number !== level
                        ? "border-[#FACC15] bg-[#FACC15] text-[#0F3B8F]"
                        : "border-current",
                    )}
                  >
                    {saved && number !== level ? <Check className="h-3.5 w-3.5" /> : number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-xs">{labelTitle}</p>
                    <p
                      className={cn(
                        "truncate text-[10px]",
                        number === level ? "text-[#2D6BFF]" : "text-blue-200",
                      )}
                    >
                      {labelSub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section>
          <div className="mb-5 rounded-[18px] border border-[#DCE3EF] bg-white px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-[#10264F]">
                  {isLeadership
                    ? isFinal
                      ? "Paso 5 de 5 · Ejercicio Práctico del Submódulo"
                      : `Paso ${level} de 5 · Contenido Teórico (Solo lectura)`
                    : isFinal
                      ? "Nivel 5 de 5 · Pregunta Evaluativa Saber Pro"
                      : `Nivel ${level} de 5 · ${currentTopic.difficultyLabel}`}
                </p>
                <p className="mt-0.5 text-xs text-[#6C7990]">
                  {isLeadership && isFinal
                    ? `Actividad práctica integradora de ${item.name}`
                    : currentTopic.topicTitle}
                </p>
              </div>
              <p className="text-sm font-extrabold text-[#2D6BFF]">{level * 20}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E9EDF4]">
              <motion.div
                animate={{ width: `${level * 20}%` }}
                className="h-full rounded-full bg-[#2D6BFF]"
              />
            </div>
          </div>

          <motion.article
            key={`${discipline}-${item.id}-${level}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[24px] border border-[#DCE3EF] bg-white shadow-[0_14px_40px_rgba(29,55,96,.07)]"
          >
            <div className="border-b border-[#E3E8F0] bg-[#F8FAFD] px-6 py-5 md:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill className="bg-[#EAF0FF] text-[#2457D5]">
                    {currentTopic.difficultyLabel ||
                      (isFinal ? "Ejercicio Práctico" : "Contenido de Estudio")}
                  </Pill>
                  <Pill className="bg-[#F5EBFF] text-[#7E22CE]">
                    <BookMarked className="h-3.5 w-3.5" />
                    {currentTopic.authorCitation}
                  </Pill>
                </div>
                <span className="text-xs font-semibold text-[#78859A]">
                  Tiempo estimado: {currentTopic.suggestedMinutes} min
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* DISCIPLINA 1: LIDERAZGO (Niveles 1-4 Lectura) */}
              {isLeadership && !isFinal && (
                <>
                  <div className="mb-5 rounded-xl border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-3 text-xs font-semibold text-[#4A5870] flex items-center gap-2.5">
                    <BookOpen className="h-4 w-4 shrink-0 text-[#2D6BFF]" />
                    <span>
                      <strong>Sección de lectura teórica ({level}/4):</strong> Analiza este
                      contenido y su ejemplo resuelto. Al terminar los 4 temas realizarás el{" "}
                      <strong>Ejercicio Práctico</strong> en el Paso 5.
                    </span>
                  </div>

                  <h1 className="text-xl font-extrabold leading-snug tracking-[-0.02em] text-[#10264F] md:text-2xl">
                    {currentTopic.topicTitle}
                  </h1>

                  <div className="mt-4 space-y-3 text-sm leading-7 text-[#31415E] whitespace-pre-line">
                    {currentTopic.theoreticalContent}
                  </div>

                  {level === 4 && item.topics[4] && (
                    <div className="mt-6 pt-6 border-t border-[#E3E8F0]">
                      <h2 className="text-lg font-extrabold text-[#10264F]">
                        {item.topics[4].topicTitle}
                      </h2>
                      <div className="mt-3 space-y-3 text-sm leading-7 text-[#31415E] whitespace-pre-line">
                        {item.topics[4].theoreticalContent}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 rounded-2xl border border-[#DCE3EF] bg-[#F6F8FC] p-5">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#0F3B8F]">
                      <Lightbulb className="h-4 w-4 text-[#2D6BFF]" />
                      Idea Clave
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#31415E] font-semibold">
                      {currentTopic.keyTakeaway}
                    </p>
                  </div>

                  {currentTopic.scenarioTitle && currentTopic.scenarioContext && (
                    <div className="mt-6 rounded-2xl border-l-4 border-[#2D6BFF] bg-[#F4F8FF] p-5 space-y-3">
                      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#0F3B8F]">
                        Ejemplo Resuelto · {currentTopic.scenarioTitle}
                      </p>
                      <p className="text-sm leading-6 text-[#293B5C]">
                        <strong>Situación:</strong> {currentTopic.scenarioContext}
                      </p>
                      {currentTopic.options &&
                        currentTopic.correctOptionIndex !== undefined &&
                        currentTopic.options[currentTopic.correctOptionIndex] && (
                          <div className="rounded-xl bg-white/90 border border-[#CBEAD9] p-3.5 text-sm leading-6 text-[#065F46]">
                            <strong>✓ Cómo actúa el líder según este enfoque:</strong>{" "}
                            {currentTopic.options[currentTopic.correctOptionIndex]}
                          </div>
                        )}
                    </div>
                  )}
                </>
              )}

              {/* DISCIPLINA 1: LIDERAZGO NIVEL 5 (Ejercicio práctico) */}
              {isLeadership && isFinal && (
                <div>
                  <div className="mb-6 rounded-2xl border border-[#DCE3EF] bg-[#EAF0FF] p-4 text-xs sm:text-sm text-[#0F3B8F] leading-6">
                    <strong>¿Qué debes hacer en este ejercicio práctico?</strong> Lee el caso
                    práctico a continuación y aplica los conceptos estudiados en los 4 contenidos
                    anteriores respondiendo las dos preguntas de desarrollo. Al finalizar, haz clic
                    en <strong>"Finalizar submódulo y desbloquear siguiente"</strong>.
                  </div>

                  {currentTopic.scenarioTitle && currentTopic.scenarioContext && (
                    <div className="mb-6 rounded-2xl border-l-4 border-[#A855F7] bg-[#F8F1FF] p-5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#8C39D7]">
                        Caso Práctico · {currentTopic.scenarioTitle}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#293B5C] font-medium">
                        {currentTopic.scenarioContext}
                      </p>
                    </div>
                  )}

                  <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#2D6BFF]">
                    Ejercicio Práctico Final · Submódulo 0{item.id}
                  </p>
                  <h1 className="mt-2 text-lg font-extrabold leading-snug text-[#10264F] md:text-2xl">
                    {currentTopic.questionPrompt}
                  </h1>

                  <div className="mt-6">
                    <OpenResponse
                      level={level}
                      value={answer}
                      subPrompts={currentTopic.openSubPrompts}
                      onChange={onAnswer}
                    />
                  </div>
                </div>
              )}

              {/* DISCIPLINAS 2 Y 3: COMUNICACIÓN Y TOMA DE DECISIONES (NIVELES 1 AL 4) */}
              {!isLeadership && !isFinal && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-[#DCE3EF] bg-[#F8FAFD] px-4 py-3 text-xs font-semibold text-[#4A5870] flex items-center gap-2.5">
                    <BookOpen className="h-4 w-4 shrink-0 text-[#2D6BFF]" />
                    <span>
                      <strong>{currentTopic.difficultyLabel} ({level}/5):</strong> Lee con atención
                      los fundamentos conceptuales y el escenario de aplicación. Luego redacta tu
                      análisis y propuesta en el área de respuesta.
                    </span>
                  </div>

                  <div>
                    <h1 className="text-xl font-extrabold leading-snug tracking-[-0.02em] text-[#10264F] md:text-2xl">
                      {currentTopic.topicTitle}
                    </h1>
                  </div>

                  {/* Fundamentación Teórica */}
                  <div className="space-y-3 text-sm leading-7 text-[#31415E] whitespace-pre-line bg-[#FBFCFE] p-5 rounded-2xl border border-[#E9EEF6]">
                    {currentTopic.theoreticalContent}
                  </div>

                  {/* Idea Clave */}
                  <div className="rounded-2xl border border-[#DCE3EF] bg-[#F6F8FC] p-5">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#0F3B8F]">
                      <Lightbulb className="h-4 w-4 text-[#2D6BFF]" />
                      Idea Clave / Concepto Esencial
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[#31415E] font-semibold">
                      {currentTopic.keyTakeaway}
                    </p>
                  </div>

                  {/* Contexto del caso / escenario */}
                  {currentTopic.scenarioContext && (
                    <div className="rounded-2xl border-l-4 border-[#2D6BFF] bg-[#F4F8FF] p-5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#0F3B8F]">
                        {currentTopic.scenarioTitle || "Contexto de Aplicación"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#293B5C] whitespace-pre-line">
                        {currentTopic.scenarioContext}
                      </p>
                    </div>
                  )}

                  {/* Consigna y Pregunta de desarrollo */}
                  <div className="rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#0F3B8F] mb-2">
                      <MessageCircleQuestion className="h-4 w-4 text-[#0F3B8F]" />
                      Consigna Evaluativa · {currentTopic.difficultyLabel}
                    </div>
                    <h2 className="text-base font-extrabold text-[#10264F] md:text-lg">
                      {currentTopic.questionPrompt}
                    </h2>

                    <div className="mt-4">
                      <OpenResponse
                        level={level}
                        value={answer}
                        placeholder={
                          discipline === "communication"
                            ? "Redacta tu análisis comunicativo, fundamentando tu respuesta según los postulados pedagógicos del autor..."
                            : "Escribe tu análisis, identificación de sesgos, criterios o matriz decisional según lo solicitado..."
                        }
                        onChange={onAnswer}
                      />
                    </div>

                    {isSaved && (
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            onAskAiFeedback(
                              `Revisa mi respuesta para el Nivel ${level} (${currentTopic.difficultyLabel}) del Eje "${item.name}" en ${discipline === "communication" ? "Comunicación Educativa" : "Toma de Decisiones"}. La consigna fue: "${currentTopic.questionPrompt}". Mi respuesta es: "${answer}". Bríndame retroalimentación pedagógica y sugerencias de mejora según el marco teórico de ${currentTopic.authorCitation}.`,
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF0FF] px-4 py-2 text-xs font-extrabold text-[#0F3B8F] hover:bg-[#DCE7FF] transition-colors"
                        >
                          <Bot className="h-3.5 w-3.5 text-[#2D6BFF]" />
                          Pedir retroalimentación a LideraBot sobre mi respuesta
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Respuesta Modelo Pedagógica (especialmente para Toma de Decisiones) */}
                  {currentTopic.modelAnswer && (
                    <div className="rounded-2xl border border-[#DCE3EF] bg-[#F7FAFD] p-4">
                      <button
                        type="button"
                        onClick={() => setShowModelAnswer((v) => !v)}
                        className="flex w-full items-center justify-between text-left text-xs font-bold text-[#0F3B8F] hover:text-[#2D6BFF]"
                      >
                        <span className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
                          {showModelAnswer
                            ? "Ocultar respuesta modelo pedagógica y matriz"
                            : "Ver respuesta modelo pedagógica y matriz de solución"}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            showModelAnswer && "rotate-180",
                          )}
                        />
                      </button>
                      {showModelAnswer && (
                        <div className="mt-3 pt-3 border-t border-[#E2E8F0] text-xs leading-6 text-[#2D3748] whitespace-pre-line bg-white rounded-xl p-4 border border-[#E2E8F0]">
                          {currentTopic.modelAnswer}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* DISCIPLINAS 2 Y 3: NIVEL 5 (PREGUNTA SELECCIÓN MÚLTIPLE TIPO SABER PRO) */}
              {!isLeadership && isFinal && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-[#DCE3EF] bg-[#EAF0FF] p-4 text-xs sm:text-sm text-[#0F3B8F] leading-6">
                    <strong>Pregunta Evaluativa Tipo Saber Pro (Nivel 5 de 5):</strong> Lee con
                    atención la situación y el enunciado pedagógico. Selecciona la opción que
                    consideres correcta y revisa la justificación oficial de la clave.
                  </div>

                  {currentTopic.scenarioContext && (
                    <div className="rounded-2xl border-l-4 border-[#7C3AED] bg-[#FAF5FF] p-5">
                      <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#7C3AED]">
                        {currentTopic.scenarioTitle || "Contexto Saber Pro"}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#293B5C] font-medium whitespace-pre-line">
                        {currentTopic.scenarioContext}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#2D6BFF]">
                      Pregunta Saber Pro · {item.name}
                    </p>
                    <h1 className="mt-2 text-lg font-extrabold leading-snug text-[#10264F] md:text-xl">
                      {currentTopic.questionPrompt}
                    </h1>
                  </div>

                  <div className="mt-4">
                    <MultipleChoice
                      options={currentTopic.options || []}
                      correctOptionIndex={currentTopic.correctOptionIndex}
                      value={answer}
                      onChange={onAnswer}
                    />
                  </div>

                  {answer && currentTopic.explanation && (
                    <div className="rounded-2xl border border-[#CBD5E1] bg-[#F8FAFC] p-5">
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#0F3B8F] mb-2">
                        <Lightbulb className="h-4 w-4 text-[#F59E0B]" />
                        Justificación Pedagógica de la Clave
                      </div>
                      <p className="text-xs sm:text-sm leading-6 text-[#334155] whitespace-pre-line">
                        {currentTopic.explanation}
                      </p>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            onAskAiFeedback(
                              `Explícame con más profundidad por qué en la pregunta Saber Pro del Eje "${item.name}" la opción correcta es la seleccionada y por qué las demás son distractores inválidos según ${currentTopic.authorCitation}. La pregunta fue: "${currentTopic.questionPrompt}".`,
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF0FF] px-4 py-2 text-xs font-extrabold text-[#0F3B8F] hover:bg-[#DCE7FF] transition-colors"
                        >
                          <Bot className="h-3.5 w-3.5 text-[#2D6BFF]" />
                          Pedir a LideraBot profundizar en esta pregunta Saber Pro
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botones de Navegación Inferior */}
              <div className="mt-8 flex flex-col-reverse items-center justify-between gap-4 border-t border-[#E3E8F0] pt-6 sm:flex-row">
                <button
                  onClick={() => {
                    if (level > 1) {
                      setShowModelAnswer(false);
                      onLevel(level - 1);
                    }
                  }}
                  disabled={level === 1}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#65728A] disabled:opacity-30"
                >
                  <ArrowLeft className="h-4 w-4" /> Nivel anterior
                </button>
                <button
                  onClick={() => {
                    setShowModelAnswer(false);
                    onContinue();
                  }}
                  disabled={!canContinue}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F3B8F] px-6 py-3.5 font-bold text-white shadow-md transition-all hover:bg-[#174AA6] disabled:cursor-not-allowed disabled:bg-[#B8C2D1] sm:w-auto"
                >
                  {isFinal
                    ? "Finalizar submódulo y desbloquear siguiente"
                    : isLeadership && level === 4
                      ? "Continuar al Ejercicio Práctico Final"
                      : `Continuar al Nivel ${level + 1}`}{" "}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.article>
        </section>
      </div>
    </main>
  );
}

function MultipleChoice({
  options,
  correctOptionIndex,
  value,
  onChange,
}: {
  options: string[];
  correctOptionIndex?: number;
  value: string;
  onChange: (value: string) => void;
}) {
  const selectedIndex = options.findIndex((opt) => opt === value);
  const isCorrectSelection =
    selectedIndex !== -1 &&
    correctOptionIndex !== undefined &&
    selectedIndex === correctOptionIndex;

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Opciones de respuesta">
      {options.map((option, index) => {
        const selected = option === value;
        return (
          <button
            key={option}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            className={cn(
              "flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all md:p-5",
              selected
                ? "border-[#2D6BFF] bg-[#EEF3FF] shadow-[0_0_0_3px_rgba(45,107,255,.10)]"
                : "border-[#DCE3EF] bg-white hover:border-[#9DB6EF] hover:bg-[#FAFBFE]",
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full border text-sm font-extrabold",
                selected
                  ? "border-[#2D6BFF] bg-[#2D6BFF] text-white"
                  : "border-[#C9D2E1] text-[#68758B]",
              )}
            >
              {String.fromCharCode(65 + index)}
            </span>
            <span className="pt-1 text-sm font-semibold leading-6 text-[#31415E] md:text-base">
              {option}
            </span>
            {selected && <Check className="ml-auto mt-1.5 h-5 w-5 shrink-0 text-[#2D6BFF]" />}
          </button>
        );
      })}

      {selectedIndex !== -1 && correctOptionIndex !== undefined && (
        <div
          className={cn(
            "mt-4 rounded-2xl border p-4 text-sm leading-6",
            isCorrectSelection
              ? "border-[#A7F3D0] bg-[#ECFDF5] text-[#065F46]"
              : "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]",
          )}
        >
          {isCorrectSelection ? (
            <p className="font-semibold">
              ✓ ¡Excelente análisis! Tu elección corresponde a la respuesta correcta según los
              criterios pedagógicos oficiales.
            </p>
          ) : (
            <p className="font-semibold">
              Nota formativa: Tu opción ha sido registrada. Revisa la justificación pedagógica a
              continuación para comprender el fundamento de la clave correcta.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function OpenResponse({
  level,
  value,
  subPrompts,
  placeholder,
  onChange,
}: {
  level: number;
  value: string;
  subPrompts?: [string, string];
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  if (subPrompts) {
    const [part1 = "", part2 = ""] = value.split("|||");
    const prompt1 = subPrompts[0] ?? "1. ¿Qué decisión tomarías?";
    const prompt2 = subPrompts[1] ?? "2. ¿Cómo la sustentas desde los autores?";
    return (
      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-extrabold text-[#31415E]">{prompt1}</span>
          <textarea
            value={part1}
            onChange={(event) => onChange(`${event.target.value}|||${part2}`)}
            className="min-h-32 w-full resize-y rounded-2xl border border-[#C9D2E1] bg-[#FBFCFE] p-4 text-sm leading-6 outline-none transition focus:border-[#2D6BFF] focus:ring-4 focus:ring-[#2D6BFF]/10"
            placeholder="Describe la estrategia y decisión que tomarías..."
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-extrabold text-[#31415E]">{prompt2}</span>
          <textarea
            value={part2}
            onChange={(event) => onChange(`${part1}|||${event.target.value}`)}
            className="min-h-36 w-full resize-y rounded-2xl border border-[#C9D2E1] bg-[#FBFCFE] p-4 text-sm leading-6 outline-none transition focus:border-[#2D6BFF] focus:ring-4 focus:ring-[#2D6BFF]/10"
            placeholder="Sustenta tu respuesta conectando con los conceptos de los autores estudiados..."
          />
        </label>
      </div>
    );
  }
  return (
    <label className="block">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-44 w-full resize-y rounded-2xl border border-[#C9D2E1] bg-[#FBFCFE] p-5 leading-7 outline-none transition focus:border-[#2D6BFF] focus:ring-4 focus:ring-[#2D6BFF]/10"
        placeholder={placeholder || "Escribe aquí tu análisis basándote en los conceptos pedagógicos..."}
      />
      <span className="mt-2 block text-right text-xs text-[#7A879B]">
        {value.length} caracteres · Guardado automático
      </span>
    </label>
  );
}

function CompleteView({
  item,
  discipline = "leadership",
  answers,
  modules,
  recommendedSubmoduleOrder,
  onAskAiFeedback,
  onReview,
  onHome,
  onNext,
}: {
  item: ModuleWithProgress;
  discipline?: DisciplineKey;
  answers: Record<string, string>;
  modules: ModuleWithProgress[];
  recommendedSubmoduleOrder: number[];
  onAskAiFeedback: () => void;
  onReview: () => void;
  onHome: () => void;
  onNext: () => void;
}) {
  const isLeadership = discipline === "leadership";
  const modLabel = isLeadership ? "Submódulo" : "Eje";

  const savedCount = [1, 2, 3, 4, 5].filter((lvl) =>
    isAnswerValid(lvl, answers[getAnswerKey(discipline, item.id, lvl)]),
  ).length;
  const currentOrderPos = recommendedSubmoduleOrder.indexOf(item.id);
  const nextModId =
    currentOrderPos !== -1 && currentOrderPos + 1 < recommendedSubmoduleOrder.length
      ? recommendedSubmoduleOrder[currentOrderPos + 1]
      : null;
  const nextModule = nextModId ? modules.find((m) => m.id === nextModId) : null;

  return (
    <main className="mx-auto max-w-[900px] px-5 py-12 lg:px-8 lg:py-16">
      <section className="overflow-hidden rounded-[28px] border border-[#DCE3EF] bg-white shadow-[0_18px_50px_rgba(29,55,96,.09)]">
        <div className="bg-[#0F3B8F] px-6 py-11 text-center text-white md:px-10">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#FACC15] text-[#0F3B8F] shadow-[0_0_0_10px_rgba(255,255,255,.08)]">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <Pill className="mt-7 bg-white/10 text-blue-100">
            {modLabel} 0{item.id} completado satisfactoriamente
          </Pill>
          <h1 className="mt-4 text-3xl font-extrabold tracking-[-0.04em] md:text-4xl">
            ¡Escalón superado!
          </h1>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-blue-100">
            {item.name} · {item.authorsSummary}
          </p>
        </div>
        <div className="p-6 md:p-9">
          <div className="rounded-2xl bg-[#F6F8FC] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.15em] text-[#64728A]">
                  Registro de actividad
                </p>
                <p className="mt-2 font-extrabold text-[#10264F]">
                  {savedCount} de 5 niveles completados satisfactoriamente
                </p>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E7F8F1] text-[#10856B]">
                <Save className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-5 grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((number) => {
                const done = isAnswerValid(
                  number,
                  answers[getAnswerKey(discipline, item.id, number)],
                );
                return (
                  <div
                    key={number}
                    className={cn(
                      "rounded-lg py-2 text-center text-xs font-extrabold",
                      done ? "bg-[#DFF5ED] text-[#0E785F]" : "bg-[#E8ECF2] text-[#79869A]",
                    )}
                  >
                    N{number} {done && "✓"}
                  </div>
                );
              })}
            </div>
          </div>

          {nextModule && (
            <div className="mt-5 rounded-2xl border border-[#CBEAD9] bg-[#F2FBF7] p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#DFF5ED] text-[#0E785F]">
                  <Unlock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-[#0E785F]">
                    Nuevo {modLabel} Desbloqueado en tu Ruta:
                  </p>
                  <p className="text-sm font-extrabold text-[#10264F]">
                    {modLabel} 0{nextModule.id}: {nextModule.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5">
            <button
              onClick={onAskAiFeedback}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#2D6BFF] bg-[#EAF0FF] p-4 text-sm font-extrabold text-[#0F3B8F] hover:bg-[#DCE7FF]"
            >
              <Bot className="h-5 w-5 text-[#2D6BFF]" />
              Pedir a LideraBot retroalimentación de mis respuestas en este {modLabel.toLowerCase()}
            </button>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <button
              onClick={onReview}
              className="rounded-xl border border-[#BAC6D8] px-4 py-3 text-sm font-extrabold text-[#0F3B8F] hover:bg-[#F4F7FB]"
            >
              Revisar respuestas
            </button>
            <button
              onClick={onHome}
              className="rounded-xl border border-[#BAC6D8] px-4 py-3 text-sm font-extrabold text-[#0F3B8F] hover:bg-[#F4F7FB]"
            >
              Volver a módulos
            </button>
            <button
              onClick={onNext}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F3B8F] px-4 py-3 text-sm font-extrabold text-white"
            >
              {nextModule
                ? `Ir al ${modLabel} 0${nextModule.id} Desbloqueado`
                : "Ver todos los módulos"}{" "}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function FoundationsView({
  modules: _modules,
  onChoose: _onChoose,
  onBack,
}: {
  modules: ModuleWithProgress[];
  onChoose: (item: ModuleWithProgress) => void;
  onBack: () => void;
}) {
  return (
    <main className="mx-auto max-w-[1040px] px-5 py-8 lg:px-8 lg:py-10">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#53627A] hover:text-[#0F3B8F]"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </button>

      <section className="rounded-[28px] bg-[#0F3B8F] px-6 py-8 text-white md:px-10">
        <Pill className="mb-3 bg-white/10 text-blue-100">
          Introducción y Referencias del Módulo
        </Pill>
        <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">
          Módulo de Formación en Liderazgo
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100 md:text-base">
          Este módulo integra cinco enfoques esenciales de liderazgo para fortalecer la toma de
          decisiones, la empatía y la dirección de equipos en entornos reales y educativos.
        </p>
      </section>

      <section className="mt-6 rounded-[24px] border border-[#DCE3EF] bg-white p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-extrabold text-[#10264F]">
          Referencias Académicas del Módulo
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {theoreticalFoundations.map((foundation) => (
            <article
              key={foundation.authors}
              className="rounded-2xl border border-[#DCE3EF] bg-[#F8FAFD] p-5 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-base font-extrabold text-[#10264F]">
                  {foundation.authors} ({foundation.year})
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-[#4A5870]">
                  {foundation.contribution}
                </p>
              </div>
              <div className="mt-4 border-t border-[#E4EAF3] pt-3 space-y-1.5">
                {foundation.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-[#2D6BFF] hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function ResponsesView({
  currentDiscipline,
  onSelectDiscipline,
  disciplines: discList,
  answers,
  onAskAiFeedback: _onAskAiFeedback,
  onOpenModuleLevel,
  onBack,
}: {
  currentDiscipline: DisciplineKey;
  onSelectDiscipline: (disc: DisciplineKey) => void;
  disciplines: DisciplineInfo[];
  answers: Record<string, string>;
  onAskAiFeedback: (prompt: string) => void;
  onOpenModuleLevel: (disc: DisciplineKey, mod: ModuleWithProgress, level: number) => void;
  onBack: () => void;
}) {
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);

  const activeModules = useMemo(() => {
    switch (currentDiscipline) {
      case "communication":
        return communicationModules;
      case "decision":
        return decisionModules;
      case "leadership":
      default:
        return leadershipModules;
    }
  }, [currentDiscipline]);

  const totalStepsDone = activeModules.reduce((acc, m) => {
    return (
      acc +
      [1, 2, 3, 4, 5].filter((lvl) =>
        isAnswerValid(lvl, answers[getAnswerKey(currentDiscipline, m.id, lvl)]),
      ).length
    );
  }, 0);
  const overallProgress = Math.round((totalStepsDone / 25) * 100);

  const activeDiscipline =
    discList.find((d) => d.key === currentDiscipline) ?? discList[0];

  return (
    <main className="mx-auto max-w-[880px] px-5 py-8 lg:px-8">
      {/* Botón Volver */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#53627A] hover:text-[#0F3B8F] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
      </div>

      {/* Tabs Selector de Disciplinas */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-2xl bg-[#EEF2F8] p-1.5 border border-[#DCE3EF]">
        {discList.map((d) => {
          const Icon = d.icon;
          const isActive = currentDiscipline === d.key;
          return (
            <button
              key={d.key}
              onClick={() => {
                setExpandedModuleId(null);
                onSelectDiscipline(d.key);
              }}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-xl px-4 py-3 text-xs sm:text-sm font-extrabold transition-all",
                isActive
                  ? "bg-white text-[#0F3B8F] shadow-sm border border-[#DCE3EF]"
                  : "text-[#5A6A85] hover:text-[#0F3B8F] hover:bg-white/60",
              )}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                style={{ color: isActive ? d.color : undefined }}
              />
              <span className="truncate">{d.shortTitle}</span>
            </button>
          );
        })}
      </div>

      {/* Progreso General de la Disciplina */}
      <section className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64728A]">
              Progreso en {activeDiscipline.shortTitle}
            </span>
            <h1 className="text-xl font-bold text-[#10264F]">{activeDiscipline.title}</h1>
          </div>
          <span className="text-2xl font-black text-[#2D6BFF]">{overallProgress}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[#EDF2F7]">
          <div
            className="h-full rounded-full bg-[#2D6BFF] transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[#718096]">
          {totalStepsDone} de 25 niveles completados
        </p>
      </section>

      {/* Lista de submódulos de la disciplina */}
      <div className="space-y-3.5">
        {activeModules.map((mod) => {
          const completedLevels = [1, 2, 3, 4, 5].filter((lvl) =>
            isAnswerValid(lvl, answers[getAnswerKey(currentDiscipline, mod.id, lvl)]),
          ).length;
          const progress = Math.round((completedLevels / 5) * 100);
          const isExpanded = expandedModuleId === mod.id;

          return (
            <div
              key={mod.id}
              className="rounded-xl border border-[#E2E8F0] bg-white p-5 transition-all shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold",
                      completedLevels === 5
                        ? "bg-[#DFF5ED] text-[#0E785F]"
                        : completedLevels > 0
                          ? "bg-[#EAF0FF] text-[#2457D5]"
                          : "bg-[#F1F3F7] text-[#65728A]",
                    )}
                  >
                    0{mod.id}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#10264F]">{mod.name}</h2>
                    <span className="text-xs font-semibold text-[#64728A]">
                      {completedLevels === 5
                        ? "Completado (5/5 niveles)"
                        : completedLevels > 0
                          ? `En progreso (${completedLevels}/5 niveles)`
                          : "No iniciado"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#10264F]">{progress}%</span>
                  <button
                    onClick={() => {
                      const modWithProg: ModuleWithProgress = {
                        ...mod,
                        completedLevels,
                        progress,
                        status:
                          completedLevels === 5
                            ? "Completado"
                            : completedLevels > 0
                              ? "En progreso"
                              : "No iniciado",
                        isUnlocked: true,
                        stepOrderIndex: mod.id - 1,
                        unlockRequirementText: "",
                      };
                      onOpenModuleLevel(
                        currentDiscipline,
                        modWithProg,
                        completedLevels < 5 ? completedLevels + 1 : 1,
                      );
                    }}
                    className="rounded-lg bg-[#F1F4F9] px-3 py-1.5 text-xs font-bold text-[#0F3B8F] hover:bg-[#E2E8F0] transition-colors"
                  >
                    Ir al módulo
                  </button>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-[#EDF2F7]">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    completedLevels === 5 ? "bg-[#10B981]" : "bg-[#2D6BFF]",
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Toggle para ver respuestas registradas */}
              {completedLevels > 0 && (
                <div className="mt-3 pt-3 border-t border-[#F1F4F9]">
                  <button
                    onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#2D6BFF] hover:underline"
                  >
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")}
                    />
                    {isExpanded ? "Ocultar respuestas" : "Ver respuestas registradas"}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2.5">
                      {mod.topics.map((top) => {
                        const ans = answers[getAnswerKey(currentDiscipline, mod.id, top.level)];
                        if (!isAnswerValid(top.level, ans)) return null;

                        return (
                          <div
                            key={top.level}
                            className="rounded-lg border border-[#E9EDF4] bg-[#F8FAFC] p-3 text-xs text-[#31415E] space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-[#0F3B8F]">
                                Nivel {top.level}: {top.difficultyLabel || top.topicTitle}
                              </span>
                              <span className="text-[10px] text-[#718096]">✓ Completado</span>
                            </div>
                            <p className="text-[11px] text-[#4A5568] italic font-medium">
                              {top.questionPrompt}
                            </p>
                            <div className="mt-1 pt-1 border-t border-[#E2E8F0]">
                              {ans.includes("|||") ? (
                                <div className="space-y-1">
                                  {ans.split("|||").map((part, i) => (
                                    <p key={i} className="text-[#1A202C] whitespace-pre-line">
                                      <strong>{i === 0 ? "Decisión:" : "Sustentación:"}</strong>{" "}
                                      {part}
                                    </p>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[#1A202C] whitespace-pre-line font-medium">
                                  {ans === "CONTENIDO_ESTUDIADO" ? "Lectura completada" : ans}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
