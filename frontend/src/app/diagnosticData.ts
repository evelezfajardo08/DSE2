export type CompetencyCategory =
  | "Comunicación"
  | "Liderazgo"
  | "Toma de Decisiones"
  | "Trabajo en Equipo";

export interface DiagnosticOption {
  letter: "A" | "B" | "C";
  text: string;
  levelValue: number; // 1, 2, or 4.5 (representing Nivel 4/5)
  levelLabel: string;
}

export interface DiagnosticQuestion {
  id: number;
  competency: CompetencyCategory;
  type: "ABC" | "Abierta";
  prompt: string;
  options?: DiagnosticOption[];
  placeholder?: string;
}

export interface PerformanceScaleLevel {
  level: number;
  title: string;
  description: string;
}

export const performanceScale: PerformanceScaleLevel[] = [
  {
    level: 1,
    title: "Nivel 1: Inicial",
    description:
      "Reconoce conceptos de forma aislada; requiere guía continua y muestra dificultades de aplicación.",
  },
  {
    level: 2,
    title: "Nivel 2: Básico",
    description:
      "Aplica conceptos en situaciones sencillas o estructuradas; presenta vacíos ante imprevistos.",
  },
  {
    level: 3,
    title: "Nivel 3: Competente",
    description:
      "Demuestra dominio funcional autónomo en situaciones habituales y colabora eficientemente.",
  },
  {
    level: 4,
    title: "Nivel 4: Avanzado",
    description:
      "Aporta soluciones adaptativas, gestiona imprevistos con criterio analítico y guía a otros.",
  },
  {
    level: 5,
    title: "Nivel 5: Experto",
    description:
      "Ejerce visión estratégica y crítica; destaca en resolución de crisis, mentoría e innovación.",
  },
];

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: 1,
    competency: "Comunicación",
    type: "ABC",
    prompt:
      "Al intentar transmitir una instrucción técnica clave a tu equipo, notas que existen barreras que distorsionan el mensaje. Según los principios de comunicación efectiva, ¿cuál es la estrategia inicial más adecuada?",
    options: [
      {
        letter: "A",
        text: "Asumir que el mensaje fue comprendido si ningún integrante realiza preguntas de inmediato.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
      {
        letter: "B",
        text: "Repetir exactamente las mismas palabras con mayor volumen para asegurar la recepción.",
        levelValue: 2,
        levelLabel: "Nivel 2",
      },
      {
        letter: "C",
        text: "Fomentar el diálogo bidireccional, permitiendo preguntas y verificando mediante escucha activa la interpretación correcta del receptor.",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
    ],
  },
  {
    id: 2,
    competency: "Liderazgo",
    type: "ABC",
    prompt:
      "Te encuentras liderando un equipo en su fase inicial (Formación) con alta incertidumbre. Según los patrones de liderazgo participativo y gestión de equipos, ¿cuál debe ser tu enfoque principal?",
    options: [
      {
        letter: "A",
        text: "Mantenerse al margen y esperar que el equipo resuelva de forma autónoma sus responsabilidades.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
      {
        letter: "B",
        text: "Imponer reglas estrictas sin consulta previa para evitar demoras en las entregas.",
        levelValue: 2,
        levelLabel: "Nivel 2",
      },
      {
        letter: "C",
        text: "Proveer dirección clara, definir roles/responsabilidades, fomentar la confianza y alinear al equipo hacia la visión compartida.",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
    ],
  },
  {
    id: 3,
    competency: "Toma de Decisiones",
    type: "Abierta",
    prompt:
      "Describe una situación reciente en la que tuviste que tomar una decisión rápida con información incompleta o bajo presión de tiempo. ¿Qué criterio o modelo (intuitivo, racional o heurístico) aplicaste y cuál fue el resultado?",
    placeholder:
      "Relata la situación, el criterio utilizado (intuitivo, racionalidad limitada, heurístico) y el resultado obtenido...",
  },
  {
    id: 4,
    competency: "Trabajo en Equipo",
    type: "ABC",
    prompt:
      "Durante la fase de 'Conflicto' (Storming) de un proyecto grupal, surgen tensiones por diferencias de opinión respecto a las tareas asignadas. La actitud más constructiva como integrante es:",
    options: [
      {
        letter: "A",
        text: "Retirarse del debate y enfocarse únicamente en el trabajo personal hasta que el conflicto desaparezca.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
      {
        letter: "B",
        text: "Imponer la postura propia mediante discusiones intensas para asegurar el control del grupo.",
        levelValue: 2,
        levelLabel: "Nivel 2",
      },
      {
        letter: "C",
        text: "Promover la escucha activa, facilitar la negociación directa y colaborar para redefinir acuerdos en función de la meta común.",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
    ],
  },
  {
    id: 5,
    competency: "Comunicación",
    type: "ABC",
    prompt:
      "Cuando debes exponer una propuesta ante una audiencia diversa o multidisciplinaria, ¿qué aspecto priorizas para lograr el máximo impacto persuasivo?",
    options: [
      {
        letter: "A",
        text: "Utilizar únicamente jerga técnica compleja para demostrar autoridad en la materia.",
        levelValue: 2,
        levelLabel: "Nivel 2",
      },
      {
        letter: "B",
        text: "Enfocarte en un discurso estandarizado sin adaptar la estructura a los oyentes.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
      {
        letter: "C",
        text: "Adaptar los canales y el lenguaje al perfil de la audiencia, equilibrando el rigor técnico con la empatía y la claridad.",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
    ],
  },
  {
    id: 6,
    competency: "Liderazgo",
    type: "Abierta",
    prompt:
      "¿Cómo influye la inteligencia emocional del líder en el clima de trabajo y en la prevención de conflictos organizacionales? Fundamenta tu respuesta con un ejemplo hipotético o real.",
    placeholder:
      "Explica la relación entre inteligencia emocional, clima organizacional y prevención de conflictos con un ejemplo...",
  },
  {
    id: 7,
    competency: "Toma de Decisiones",
    type: "ABC",
    prompt:
      "Según el modelo de Vroom-Yetton, ¿en qué circunstancia es imprescindible involucrar a los colaboradores en un proceso participativo de toma de decisiones?",
    options: [
      {
        letter: "A",
        text: "Únicamente cuando el líder no desea asumir la responsabilidad final de la decisión.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
      {
        letter: "B",
        text: "Cuando la aceptación y el compromiso del equipo son determinantes para la ejecución exitosa de la solución.",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
      {
        letter: "C",
        text: "En cualquier tipo de problema, sin importar el tiempo disponible ni el nivel de urgencia.",
        levelValue: 2,
        levelLabel: "Nivel 2",
      },
    ],
  },
  {
    id: 8,
    competency: "Trabajo en Equipo",
    type: "ABC",
    prompt:
      "Para asegurar un alto rendimiento y sinergia dentro de un grupo de trabajo, la gestión eficiente de responsabilidades requiere:",
    options: [
      {
        letter: "A",
        text: "Que todos los miembros realicen exactamente las mismas tareas en paralelo para comparar resultados.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
      {
        letter: "B",
        text: "Una delimitación clara de roles que evite la duplicación de esfuerzos y promueva la interdependencia positiva.",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
      {
        letter: "C",
        text: "Dejar que la asignación de roles sea implícita y variable sin acuerdos formales.",
        levelValue: 2,
        levelLabel: "Nivel 2",
      },
    ],
  },
  {
    id: 9,
    competency: "Comunicación",
    type: "Abierta",
    prompt:
      "Relata un caso en el que la falta de retroalimentación (feedback) oportuna haya causado un malentendido o error en un proyecto. ¿Qué canales o pautas de comunicación propondrías para evitarlo?",
    placeholder:
      "Describe el caso y las pautas de retroalimentación asertiva que implementarías...",
  },
  {
    id: 10,
    competency: "Liderazgo",
    type: "ABC",
    prompt:
      "Ante un error crítico cometido por un colaborador durante un momento de alta presión, la respuesta de un líder con orientación al desarrollo debe ser:",
    options: [
      {
        letter: "A",
        text: "Sancionar públicamente al colaborador para sentar un precedente inmediato.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
      {
        letter: "B",
        text: "Asumir la tarea personalmente y retirar la confianza al integrante del equipo.",
        levelValue: 2,
        levelLabel: "Nivel 2",
      },
      {
        letter: "C",
        text: "Abordar el error en privado como una oportunidad de aprendizaje, brindando retroalimentación constructiva y reorientando las acciones.",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
    ],
  },
  {
    id: 11,
    competency: "Toma de Decisiones",
    type: "ABC",
    prompt:
      "El 'sesgo de disponibilidad' o el 'sesgo del superviviente' son atajos mentales que pueden afectar la toma de decisiones. Un profesional competente evita estos sesgos al:",
    options: [
      {
        letter: "A",
        text: "Confiar exclusivamente en las historias de éxito visibles sin analizar casos fallidos o datos completos.",
        levelValue: 2,
        levelLabel: "Nivel 2",
      },
      {
        letter: "B",
        text: "Pausar la decisión para cuestionar percepciones automáticas y contrastar los supuestos con datos objetivos.",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
      {
        letter: "C",
        text: "Tomar decisiones basándose únicamente en la última experiencia vivida de forma intuitiva.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
    ],
  },
  {
    id: 12,
    competency: "Trabajo en Equipo",
    type: "Abierta",
    prompt:
      "¿Qué rol consideras que desempeñas con mayor naturalidad dentro de un equipo (facilitador, organizador, analista, ejecutor) y de qué manera contribuye tu perfil a la consecución de las metas comunes?",
    placeholder:
      "Identifica tu rol principal en un equipo y cómo aporta valor al logro colectivo...",
  },
  {
    id: 13,
    competency: "Comunicación",
    type: "ABC",
    prompt:
      "La escucha activa es una habilidad clave dentro del proceso comunicativo. Esta se caracteriza principalmente por:",
    options: [
      {
        letter: "A",
        text: "Escuchar atentamente mientras se prepara internamente la réplica para refutar la idea expuesta.",
        levelValue: 2,
        levelLabel: "Nivel 2",
      },
      {
        letter: "B",
        text: "Prestar atención completa, validar las emociones del emisor y hacer preguntas clarificadoras sin interrumpir.",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
      {
        letter: "C",
        text: "Asentir continuamente mientras se atienden otras tareas de manera simultánea.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
    ],
  },
  {
    id: 14,
    competency: "Toma de Decisiones",
    type: "ABC",
    prompt:
      "Al enfrentarte a un escenario de crisis con múltiples variables imprevistas, la mejor estrategia para seleccionar un curso de acción consiste en:",
    options: [
      {
        letter: "A",
        text: "Paralizar la acción hasta contar con certeza absoluta sobre todas las variables futuras.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
      {
        letter: "B",
        text: "Priorizar los aspectos críticos esenciales, evaluar riesgos mayores y tomar una decisión adaptable (racionalidad limitada).",
        levelValue: 4.5,
        levelLabel: "Nivel 4/5",
      },
      {
        letter: "C",
        text: "Elegir la primera opción disponible por azar para resolver la urgencia rápidamente.",
        levelValue: 1,
        levelLabel: "Nivel 1",
      },
    ],
  },
];

export type StudyRecommendationStatus =
  | "Debe estudiar con prioridad"
  | "Debe reforzar temas clave"
  | "Módulo dominado (Opcional / Repaso ágil)";

export interface CompetencyModuleResult {
  moduleNumber: number;
  competency: CompetencyCategory;
  moduleTitle: string;
  scoreLevel: number; // 1 to 5
  levelTitle: string;
  percentage: number;
  studyStatus: StudyRecommendationStatus;
  skillsDetected: string[];
  strengths: string;
  weaknesses: string;
  reinforcementTopics: string[];
  availableInPlatform: boolean;
}

export interface SubmoduleRecommendation {
  moduleId: number;
  parentModule: CompetencyCategory;
  moduleName: string;
  priority: "Estudiar completo" | "Reforzar ejercicios" | "Dominado (No requiere estudio obligatorio)";
  reason: string;
}

export interface DiagnosticEvaluationResult {
  completedAt: string;
  overallLevel: number;
  overallLevelTitle: string;
  overallPercentage: number;
  competencyModules: CompetencyModuleResult[];
  strengthsList: string[];
  weaknessesList: string[];
  skillsProfile: string[];
  submoduleRecommendations: SubmoduleRecommendation[];
  recommendedStartingSubmoduleId: number;
  recommendedSubmoduleOrder: number[];
  aiDetailedFeedback?: string;
}

function evaluateOpenResponseScore(text: string, competency: CompetencyCategory): number {
  const cleaned = text.trim();
  if (!cleaned) return 1;
  const wordCount = cleaned.split(/\s+/).length;

  const keywordsByCompetency: Record<CompetencyCategory, string[]> = {
    "Toma de Decisiones": [
      "criterio",
      "racional",
      "intuitiv",
      "heurístic",
      "heuristic",
      "riesgo",
      "datos",
      "alternativa",
      "prioriz",
      "resultado",
      "decisión",
      "decision",
      "presión",
    ],
    Liderazgo: [
      "emocional",
      "empatía",
      "empatia",
      "clima",
      "confianza",
      "escucha",
      "conflicto",
      "motivación",
      "motivacion",
      "equipo",
      "ejemplo",
      "autorregulación",
    ],
    Comunicación: [
      "retroalimentación",
      "feedback",
      "canal",
      "escucha",
      "asertiv",
      "claridad",
      "acuerdo",
      "seguimiento",
      "diálogo",
      "dialogo",
      "mensaje",
    ],
    "Trabajo en Equipo": [
      "facilitador",
      "organizador",
      "analista",
      "ejecutor",
      "rol",
      "meta",
      "colabora",
      "coordin",
      "complement",
      "compromiso",
      "equipo",
    ],
  };

  const lower = cleaned.toLowerCase();
  const matchedKeywords = keywordsByCompetency[competency].filter((kw) =>
    lower.includes(kw),
  ).length;

  if (wordCount >= 32 && matchedKeywords >= 3) return 5;
  if (wordCount >= 20 && matchedKeywords >= 2) return 4;
  if (wordCount >= 12 && matchedKeywords >= 1) return 3;
  if (wordCount >= 6) return 2;
  return 1;
}

export function calculateDiagnosticResult(
  answers: Record<number, string>,
): DiagnosticEvaluationResult {
  const orderedModules: Array<{
    moduleNumber: number;
    competency: CompetencyCategory;
    moduleTitle: string;
    availableInPlatform: boolean;
  }> = [
    {
      moduleNumber: 1,
      competency: "Liderazgo",
      moduleTitle: "Módulo 1: Formación en Liderazgo",
      availableInPlatform: true,
    },
    {
      moduleNumber: 2,
      competency: "Comunicación",
      moduleTitle: "Módulo 2: Comunicación Efectiva y Asertiva",
      availableInPlatform: false,
    },
    {
      moduleNumber: 3,
      competency: "Toma de Decisiones",
      moduleTitle: "Módulo 3: Toma de Decisiones y Resolución de Problemas",
      availableInPlatform: false,
    },
    {
      moduleNumber: 4,
      competency: "Trabajo en Equipo",
      moduleTitle: "Módulo 4: Trabajo en Equipo y Gestión de Conflictos",
      availableInPlatform: false,
    },
  ];

  const competencyScores: Record<CompetencyCategory, number[]> = {
    Comunicación: [],
    Liderazgo: [],
    "Toma de Decisiones": [],
    "Trabajo en Equipo": [],
  };

  for (const question of diagnosticQuestions) {
    const raw = answers[question.id] || "";
    if (question.type === "ABC" && question.options) {
      const selectedOpt = question.options.find((opt) => opt.letter === raw);
      const val = selectedOpt ? selectedOpt.levelValue : 1;
      competencyScores[question.competency].push(val);
    } else {
      const openScore = evaluateOpenResponseScore(raw, question.competency);
      competencyScores[question.competency].push(openScore);
    }
  }

  const competencyModules: CompetencyModuleResult[] = orderedModules.map((modInfo) => {
    const comp = modInfo.competency;
    const vals = competencyScores[comp];
    const avg = vals.reduce((a, b) => a + b, 0) / Math.max(vals.length, 1);
    const roundedLevel = Math.max(1, Math.min(5, Math.round(avg)));
    const scaleInfo = performanceScale[roundedLevel - 1];
    const percentage = Math.min(100, Math.round((avg / 4.6) * 100));

    const studyStatus: StudyRecommendationStatus =
      roundedLevel <= 2
        ? "Debe estudiar con prioridad"
        : roundedLevel === 3
          ? "Debe reforzar temas clave"
          : "Módulo dominado (Opcional / Repaso ágil)";

    const metadataByComp: Record<
      CompetencyCategory,
      {
        skillsHigh: string[];
        skillsLow: string[];
        strengths: string;
        weaknesses: string;
        reinforce: string[];
      }
    > = {
      Liderazgo: {
        skillsHigh: [
          "Dirección adaptativa en etapas de incertidumbre",
          "Inteligencia emocional y gestión constructiva del error",
          "Orientación al desarrollo del talento (Coaching)",
        ],
        skillsLow: [
          "Reconocimiento inicial de la figura del líder",
          "Disposición para estructurar equipos de trabajo",
        ],
        strengths:
          "Capacidad para orientar al equipo hacia una visión compartida, gestionar el clima emocional y convertir errores en oportunidades de aprendizaje.",
        weaknesses:
          "Riesgo de oscilar entre la pasividad (Laissez-faire prematuro) o la imposición autocrática ante errores bajo presión.",
        reinforce: [
          "Liderazgo Transformacional (Burns & Bass: las 4 I's)",
          "Liderazgo estilo Coaching y feedback constructivo (Goleman)",
          "Diagnóstico situacional de madurez M1-M4 (Hersey & Blanchard)",
        ],
      },
      Comunicación: {
        skillsHigh: [
          "Escucha activa empática y validación del interlocutor",
          "Comunicación bidireccional y verificación de mensajes",
          "Adaptación persuasiva a audiencias multidisciplinarias",
        ],
        skillsLow: [
          "Transmisión básica de información operativa",
          "Identificación de barreras comunicativas elementales",
        ],
        strengths:
          "Dominio del diálogo bidireccional, adaptación del discurso técnico a distintos públicos y práctica de escucha activa sin interrupciones.",
        weaknesses:
          "Necesidad de fortalecer la verificación explícita de acuerdos, la retroalimentación oportuna y evitar barreras de jerga unilateral.",
        reinforce: [
          "Escucha activa y preguntas clarificadoras",
          "Diseño de canales de retroalimentación (feedback) oportuna",
          "Asertividad y adaptación del mensaje al receptor",
        ],
      },
      "Toma de Decisiones": {
        skillsHigh: [
          "Participación decisional estratégica (Modelo Vroom-Yetton)",
          "Mitigación de sesgos cognitivos (disponibilidad y supervivencia)",
          "Racionalidad limitada y priorización en escenarios de crisis",
        ],
        skillsLow: [
          "Toma de decisiones intuitiva en contextos familiares",
          "Reconocimiento de situaciones de urgencia",
        ],
        strengths:
          "Criterio analítico para contrastar datos frente a sesgos cognitivos, involucrar al equipo cuando se requiere compromiso y actuar bajo racionalidad limitada en crisis.",
        weaknesses:
          "Tendencia a decidir por intuición inmediata sin contrastar datos o postergar decisiones esperando certeza absoluta.",
        reinforce: [
          "Modelo participativo de Vroom-Yetton-Jago",
          "Control de sesgos cognitivos (disponibilidad, supervivencia, halo)",
          "Toma de decisiones bajo presión y racionalidad limitada",
        ],
      },
      "Trabajo en Equipo": {
        skillsHigh: [
          "Mediación y negociación en fase de Conflicto (Storming - Tuckman)",
          "Delimitación clara de roles e interdependencia positiva",
          "Autoconocimiento del rol grupal y sinergia colaborativa",
        ],
        skillsLow: [
          "Cumplimiento individual de tareas asignadas",
          "Disposición inicial al trabajo grupal",
        ],
        strengths:
          "Habilidad para transformar tensiones grupales en acuerdos constructivos, delimitar responsabilidades sin duplicar esfuerzos y aportar desde un rol claro.",
        weaknesses:
          "Dificultad para gestionar desacuerdos durante la etapa de conflicto (Storming) o trabajar con roles ambiguos.",
        reinforce: [
          "Etapas de desarrollo grupal de Tuckman (Forming, Storming, Norming, Performing)",
          "Las 5 C del trabajo en equipo y delimitación de roles",
          "Negociación colaborativa y resolución de conflictos",
        ],
      },
    };

    const meta = metadataByComp[comp];

    return {
      moduleNumber: modInfo.moduleNumber,
      competency: comp,
      moduleTitle: modInfo.moduleTitle,
      scoreLevel: roundedLevel,
      levelTitle: scaleInfo.title,
      percentage,
      studyStatus,
      skillsDetected: roundedLevel >= 3 ? meta.skillsHigh : meta.skillsLow,
      strengths: meta.strengths,
      weaknesses: meta.weaknesses,
      reinforcementTopics: meta.reinforce,
      availableInPlatform: modInfo.availableInPlatform,
    };
  });

  const overallAvg =
    competencyModules.reduce((acc, c) => acc + c.scoreLevel, 0) / competencyModules.length;
  const overallLevel = Math.max(1, Math.min(5, Math.round(overallAvg)));
  const overallLevelTitle = performanceScale[overallLevel - 1].title;
  const overallPercentage = Math.round(
    competencyModules.reduce((acc, c) => acc + c.percentage, 0) / competencyModules.length,
  );

  const strengthsList = competencyModules
    .filter((c) => c.scoreLevel >= 3)
    .map((c) => `${c.competency} (${c.levelTitle}): ${c.strengths}`);

  if (strengthsList.length === 0) {
    const best = [...competencyModules].sort((a, b) => b.percentage - a.percentage)[0];
    strengthsList.push(
      `Competencia base más sólida en ${best.competency} (${best.levelTitle}): ${best.strengths}`,
    );
  }

  const weaknessesList = competencyModules
    .filter((c) => c.scoreLevel <= 3)
    .map((c) => `${c.competency} (${c.levelTitle}): ${c.weaknesses}`);

  if (weaknessesList.length === 0) {
    weaknessesList.push(
      "Perfeccionamiento de nivel Experto: Integrar simultáneamente liderazgo adaptativo, mitigación de sesgos y negociación en crisis complejas.",
    );
  }

  const skillsProfile = competencyModules.flatMap((c) =>
    c.skillsDetected.map((s) => `${s} (${c.competency})`),
  );

  const getScore = (comp: CompetencyCategory) =>
    competencyModules.find((c) => c.competency === comp)?.scoreLevel ?? 3;

  const leadScore = getScore("Liderazgo");
  const commScore = getScore("Comunicación");
  const decScore = getScore("Toma de Decisiones");
  const teamScore = getScore("Trabajo en Equipo");

  const getSubPriority = (score: number): SubmoduleRecommendation["priority"] => {
    if (score <= 2.5) return "Estudiar completo";
    if (score <= 3.7) return "Reforzar ejercicios";
    return "Dominado (No requiere estudio obligatorio)";
  };

  const submoduleRecommendations: SubmoduleRecommendation[] = [
    {
      moduleId: 1,
      parentModule: "Liderazgo",
      moduleName: "Submódulo 1.1: Liderazgo Transformacional (Burns & Bass)",
      priority: getSubPriority((leadScore + commScore) / 2),
      reason:
        leadScore <= 3
          ? "Debes estudiar cómo alinear al equipo hacia una visión compartida en fases de incertidumbre (Pregunta 2)."
          : "Dominas las bases motivacionales; solo requiere repaso ágil.",
    },
    {
      moduleId: 2,
      parentModule: "Liderazgo",
      moduleName: "Submódulo 1.2: Liderazgo Participativo / Democrático (Lewin & Goleman)",
      priority: getSubPriority((decScore + teamScore) / 2),
      reason:
        decScore <= 3 || teamScore <= 3
          ? "Debes reforzar la toma de decisiones participativa (Vroom-Yetton, Pregunta 7) y la gestión de acuerdos grupales (Pregunta 4)."
          : "Excelente manejo del consenso y la participación grupal.",
    },
    {
      moduleId: 3,
      parentModule: "Liderazgo",
      moduleName: "Submódulo 1.3: Liderazgo estilo Coaching (Goleman, Boyatzis & McKee)",
      priority: getSubPriority((leadScore + commScore) / 2),
      reason:
        leadScore <= 3 || commScore <= 3
          ? "Fundamental para fortalecer la retroalimentación privada y constructiva ante errores críticos (Preguntas 6, 9 y 10)."
          : "Demuestras alta inteligencia emocional y orientación al desarrollo.",
    },
    {
      moduleId: 4,
      parentModule: "Liderazgo",
      moduleName: "Submódulo 1.4: Liderazgo Delegativo / Laissez-Faire (Lewin et al.)",
      priority: getSubPriority(teamScore),
      reason:
        teamScore <= 3
          ? "Necesitas reforzar la delimitación clara de roles e interdependencia positiva para evitar desorganización (Pregunta 8)."
          : "Comprendes cuándo otorgar autonomía con roles bien delimitados.",
    },
    {
      moduleId: 5,
      parentModule: "Liderazgo",
      moduleName: "Submódulo 1.5: Liderazgo Situacional / Adaptativo (Hersey & Blanchard)",
      priority: getSubPriority((leadScore + decScore + commScore + teamScore) / 4),
      reason:
        overallLevel <= 3
          ? "Clave para adaptar tu nivel de dirección y apoyo según la madurez del equipo y las variables de crisis (Preguntas 2 y 14)."
          : "Capacidad adaptativa avanzada; puedes ir directo a los retos de nivel 4 y 5.",
    },
  ];

  const subScores: Array<{ id: number; score: number }> = [
    { id: 1, score: (leadScore + commScore) / 2 },
    { id: 2, score: (decScore + teamScore) / 2 },
    { id: 3, score: (leadScore + commScore) / 2 + 0.05 },
    { id: 4, score: teamScore },
    { id: 5, score: (leadScore + decScore + commScore + teamScore) / 4 + 0.1 },
  ];

  // Order from lowest score (highest need to study first) to highest score
  const recommendedSubmoduleOrder = [...subScores]
    .sort((a, b) => a.score - b.score || a.id - b.id)
    .map((item) => item.id);

  const recommendedStartingSubmoduleId = recommendedSubmoduleOrder[0] ?? 1;

  return {
    completedAt: new Date().toISOString(),
    overallLevel,
    overallLevelTitle,
    overallPercentage,
    competencyModules,
    strengthsList,
    weaknessesList,
    skillsProfile,
    submoduleRecommendations,
    recommendedStartingSubmoduleId,
    recommendedSubmoduleOrder,
  };
}
