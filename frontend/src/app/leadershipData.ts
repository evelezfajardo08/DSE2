import { Compass, Network, Sparkles, Target, UsersRound } from "lucide-react";

export type ModuleStatus = "No iniciado" | "En progreso" | "Completado";

export interface TopicLevel {
  level: number;
  difficultyLabel: string;
  exerciseType: string;
  suggestedMinutes: number;
  topicTitle: string;
  authorCitation: string;
  theoreticalContent: string;
  keyTakeaway: string;
  scenarioTitle?: string;
  scenarioContext?: string;
  questionPrompt: string;
  options?: string[];
  correctOptionIndex?: number;
  openSubPrompts?: [string, string];
}

export interface AcademicReference {
  authors: string;
  year: string;
  contribution: string;
  justification: string;
  links: { label: string; url: string }[];
}

export interface LeadershipModule {
  id: number;
  name: string;
  shortName: string;
  description: string;
  academicJustification: string;
  authorsSummary: string;
  icon: typeof Sparkles;
  color: string;
  tint: string;
  eyebrow: string;
  intro: string;
  consists: string;
  acts: string;
  principles: { title: string; text: string }[];
  references: AcademicReference[];
  topics: TopicLevel[];
}

export const theoreticalFoundations: AcademicReference[] = [
  {
    authors: "Kurt Lewin, Ronald Lippitt y Ralph K. White",
    year: "1939",
    contribution:
      "Fundadores de la investigación experimental en psicología social sobre el liderazgo. Sus estudios empíricos delimitaron los tres estilos clásicos: Autocrático, Democrático y Laissez-faire.",
    justification:
      "Proporcionan la base empírica primaria para los Subtemas 2 (Participativo/Democrático) y 4 (Delegativo/Laissez-Faire), permitiendo analizar el impacto del control vs. la libertad en la productividad y dinámica grupal.",
    links: [
      {
        label: "Congreso Iberoamericano de Liderazgo: Modelo de Liderazgo de Lewin (PDF)",
        url: "https://congresosfnn.com/wp-content/uploads/2021/03/congreso-iberoamericano-liderazgo/ModdeLiderazgoLewinCOMUNESC.pdf",
      },
    ],
  },
  {
    authors: "Daniel Goleman, Richard Boyatzis y Annie McKee",
    year: "2000 / 2002",
    contribution:
      'Integración de la Inteligencia Emocional al liderazgo organizacional. En su célebre artículo de Harvard Business Review "Leadership That Gets Results", Goleman identificó seis estilos emocionales clave (Visionario, Coaching, Afiliativo, Democrático, Pacesetting y Coercitivo).',
    justification:
      "Sus investigaciones respaldan formalmente el Subtema 3 (Liderazgo estilo Coaching) y el Subtema 2 (Democrático), demostrando con datos cómo el comportamiento emocional del líder afecta directamente el clima organizacional y los resultados financieros.",
    links: [
      {
        label: "Harvard Business Review / NHS: Leadership That Gets Results (PDF)",
        url: "https://www.haygroup.com/downloads/fi/leadership_that_gets_results.pdf",
      },
      {
        label: "Google Books: Leadership That Gets Results (HBR Classics Edition)",
        url: "https://books.google.com/books?q=Leadership+That+Gets+Results+Daniel+Goleman",
      },
    ],
  },
  {
    authors: "James MacGregor Burns y Bernard M. Bass",
    year: "1978 / 1985",
    contribution:
      "Desarrollo de la Teoría de Liderazgo Transformacional y Transaccional. Bass formalizó los componentes operativos del líder transformacional: Estimulación Intelectual, Consideración Individualizada, Motivación Inspiradora e Influencia Idealizada.",
    justification:
      "Constituye el pilar teórico del Subtema 1 (Liderazgo Transformacional), fundamentando la importancia de trascender la mera transacción (premios/castigos) para conectar con la motivación intrínseca de los colaboradores.",
    links: [
      {
        label: "SimplyPsychology: Transformational Leadership Theory by Bernard Bass",
        url: "https://www.simplypsychology.org/transformational-leadership.html",
      },
      {
        label: "TechnoFunc: Bass's Transformational Leadership Theory Analysis",
        url: "https://www.technofunc.com/index.php/leadership-skills-2/leadership-theories/item/bass-transformational-leadership-theory",
      },
    ],
  },
  {
    authors: "Paul Hersey y Kenneth Blanchard",
    year: "1969",
    contribution:
      "Creadores de la Teoría de Liderazgo Situacional. Demostraron que la eficacia del líder depende de adaptar la conducta directiva y de apoyo según el nivel de madurez (competencia y compromiso) del colaborador frente a una tarea específica.",
    justification:
      "Apoya directamente el Subtema 5 (Liderazgo Situacional / Adaptativo), enseñando la flexibilidad estratégica necesaria para liderar personas en distintas etapas de desarrollo.",
    links: [
      {
        label: "Thinking Through Academy: Hersey and Blanchard Situational Leadership Model",
        url: "https://www.leadershipcentral.com/situational-leadership-theory.html",
      },
    ],
  },
];

export const leadershipModules: LeadershipModule[] = [
  {
    id: 1,
    name: "Liderazgo Transformacional",
    shortName: "Transformacional",
    description:
      "Es considerado por la literatura organizacional contemporánea como el modelo de mayor impacto para promover la innovación, elevar el sentido de propósito y contrarrestar el agotamiento laboral en entornos dinámicos.",
    academicJustification:
      "Es considerado por la literatura organizacional contemporánea como el modelo de mayor impacto para promover la innovación, elevar el sentido de propósito y contrarrestar el agotamiento laboral en entornos dinámicos.",
    authorsSummary: "James MacGregor Burns (1978) y Bernard M. Bass (1985)",
    icon: Sparkles,
    color: "#2D6BFF",
    tint: "#EAF0FF",
    eyebrow: "Inspirar para transformar · Burns (1978) & Bass (1985)",
    intro:
      "Desarrollado inicialmente por James MacGregor Burns (1978) y operacionalizado por Bernard M. Bass (1985), el liderazgo transformacional trasciende el simple intercambio de recompensas por desempeño (liderazgo transaccional) para conectar con la motivación intrínseca, los valores y el sentido de propósito superior de los colaboradores.",
    consists:
      "Consiste en elevar la conciencia y el compromiso del equipo mediante cuatro dimensiones operativas (las 4 I's de Bass): Influencia Idealizada, Motivación Inspiradora, Estimulación Intelectual y Consideración Individualizada.",
    acts:
      "El líder actúa como un modelo ético coherente, comunica una visión inspiradora de futuro, reta los supuestos tradicionales para fomentar la creatividad sin miedo al error y atiende de manera personalizada las necesidades de desarrollo de cada integrante.",
    principles: [
      {
        title: "Influencia Idealizada y Motivación Inspiradora",
        text: "El líder genera confianza mediante su integridad ética (modelo de rol) y articula una visión compartida que da sentido al esfuerzo colectivo.",
      },
      {
        title: "Estimulación Intelectual",
        text: "Cuestiona el 'siempre se ha hecho así', promoviendo el pensamiento crítico, la innovación y la resolución creativa de problemas.",
      },
      {
        title: "Consideración Individualizada",
        text: "Reconoce que cada colaborador tiene motivaciones, talentos y necesidades de aprendizaje únicas, ofreciendo acompañamiento personalizado.",
      },
    ],
    references: [theoreticalFoundations[2]],
    topics: [
      {
        level: 1,
        difficultyLabel: "Fácil",
        exerciseType: "Pregunta abierta conceptual",
        suggestedMinutes: 5,
        topicTitle: "Tema 1: De la Transacción a la Transformación",
        authorCitation: "James MacGregor Burns (1978) — Leadership",
        theoreticalContent:
          "En su obra seminal de 1978, James MacGregor Burns estableció la distinción fundamental entre dos formas de liderar:\n\n• Liderazgo Transaccional: Se basa en una relación de intercambio instrumental ('doy para que des'). El líder ofrece premios, bonos, calificaciones o evita castigos a cambio del cumplimiento estricto de metas operativas. Aunque mantiene el orden a corto plazo, rara vez genera compromiso profundo ni innovación.\n\n• Liderazgo Transformacional: Ocurre cuando líderes y seguidores se elevan mutuamente a niveles superiores de motivación y moralidad. En lugar de controlar mediante incentivos externos, el líder conecta las tareas cotidianas con un propósito colectivo trascendente, despertando la motivación intrínseca.",
        keyTakeaway:
          "La transacción gestiona el cumplimiento inmediato; la transformación moviliza el compromiso genuino y el sentido de propósito.",
        questionPrompt:
          "Según el planteamiento de Burns (1978), explica con tus propias palabras por qué un equipo dirigido únicamente con premios y sanciones (transaccional) tiende a estancarse o sufrir agotamiento, y cómo el enfoque transformacional cambia esa dinámica.",
      },
      {
        level: 2,
        difficultyLabel: "Básico / Medio",
        exerciseType: "Escenario de la vida real",
        suggestedMinutes: 5,
        topicTitle: "Tema 2: Influencia Idealizada (Coherencia y Modelo Ético)",
        authorCitation: "Bernard M. Bass (1985) — Leadership and Performance Beyond Expectations",
        theoreticalContent:
          "El primer componente operativo de Bernard M. Bass es la Influencia Idealizada. Esta dimensión señala que el líder transformacional se convierte en un referente ético y de conducta para su equipo.\n\nNo se trata de un 'carisma superficial', sino de la credibilidad ganada a través de la coherencia entre el discurso y la acción. El líder con influencia idealizada asume riesgos junto a su equipo, antepone el bien colectivo al interés personal y demuestra altos estándares morales, especialmente en momentos de presión o incertidumbre.",
        keyTakeaway:
          "La autoridad moral del líder transformacional nace del ejemplo personal y la coherencia ética bajo presión.",
        scenarioTitle: "Decisiones frente a recortes presupuestarios en un proyecto institucional",
        scenarioContext:
          "Lideras un equipo académico-administrativo que lleva meses trabajando en una iniciativa de innovación. Debido a un ajuste financiero inesperado, los recursos se reducen un 30% y el equipo teme que el esfuerzo haya sido en vano o que se les exija trabajar horas extra sin apoyo.",
        questionPrompt:
          "Desde la dimensión de Influencia Idealizada de Bass (1985), ¿qué actuación del líder representa mejor este principio?",
        options: [
          "Exigir al equipo que cumpla el 100% de las metas originales advirtiendo que quienes no rindan serán reemplazados.",
          "Hablar con transparencia sobre el recorte, asumir primero la redistribución de las cargas más complejas y reajustar el alcance protegiendo el bienestar del grupo.",
          "Ocultar la información presupuestaria hasta el final del semestre para evitar que el equipo se desmotive.",
          "Desentenderse del proyecto argumentando que la dirección general fue quien tomó la decisión financiera.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 3,
        difficultyLabel: "Intermedio",
        exerciseType: "Desafío práctico",
        suggestedMinutes: 6,
        topicTitle: "Tema 3: Motivación Inspiradora y Sentido de Propósito",
        authorCitation: "Bernard M. Bass (1985) — Motivación Inspiradora",
        theoreticalContent:
          "La Motivación Inspiradora es la capacidad del líder para articular una visión atractiva y optimista del futuro. Según Bass (1985), cuando las personas comprenden el 'para qué' de su trabajo y cómo su esfuerzo impacta positivamente a otros, el agotamiento laboral disminuye y la resiliencia grupal aumenta.\n\nEl líder inspirador utiliza símbolos, metas claras y un lenguaje entusiasta que transforma tareas rutinarias en desafíos con significado compartido.",
        keyTakeaway:
          "Las personas no se comprometen con una lista de tareas, sino con una visión clara donde su trabajo tiene significado.",
        scenarioTitle: "Equipo desmotivado por exceso de trámites operativos",
        scenarioContext:
          "Un grupo de docentes y coordinadores muestra apatía y cansancio durante la implementación de un nuevo programa formativo; sienten que solo están llenando formatos administrativos sin ver resultados reales.",
        questionPrompt:
          "Aplicando el componente de Motivación Inspiradora de Bass, ¿qué decisión permite revertir la apatía y fortalecer el compromiso del equipo?",
        options: [
          "Aumentar la frecuencia de los controles de asistencia y enviar recordatorios diarios sobre los formatos pendientes.",
          "Conectar cada entregable con el impacto real en el aprendizaje de los estudiantes, visibilizar historias de logro del equipo y simplificar entre todos los pasos burocráticos innecesarios.",
          "Prometer un día libre únicamente a la persona que entregue más rápido los formatos, generando competencia interna.",
          "Suspender las reuniones de equipo para evitar escuchar quejas sobre la carga de trabajo.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 4,
        difficultyLabel: "Avanzado",
        exerciseType: "Pregunta tipo Saber Pro",
        suggestedMinutes: 8,
        topicTitle: "Tema 4: Estimulación Intelectual e Innovación",
        authorCitation: "Bernard M. Bass (1985) — Estimulación Intelectual",
        theoreticalContent:
          "A través de la Estimulación Intelectual, el líder transformacional desafía las creencias establecidas y estimula a los colaboradores a pensar por sí mismos. Bass (1985) destaca que este líder fomenta la creatividad al reformular los problemas, cuestionar viejos métodos y analizar situaciones desde nuevas perspectivas.\n\nUn principio crítico de esta dimensión es que los errores no se ridiculizan en público ni se castigan cuando surgen de intentos legítimos de innovar, ni se descartan las ideas de un integrante solo porque difieren de la opinión del líder.",
        keyTakeaway:
          "La innovación florece cuando el líder cuestiona la rutina y garantiza seguridad psicológica para proponer nuevas ideas.",
        scenarioTitle: "Adopción de herramientas digitales en una facultad tradicional",
        scenarioContext:
          "En una institución educativa se busca rediseñar un curso clave integrando metodologías activas y herramientas digitales. Varios integrantes proponen un enfoque experimental distinto al que el coordinador había planeado originalmente, mientras otros temen equivocarse al usar nuevas tecnologías.",
        questionPrompt:
          "De acuerdo con el componente de Estimulación Intelectual de Bass (1985), ¿cuál es la actuación más coherente del líder?",
        options: [
          "Imponer el diseño original del coordinador para garantizar que no existan desviaciones ni retrasos en el cronograma.",
          "Abrir un laboratorio de prueba donde se evalúen las propuestas alternativas del equipo con criterios pedagógicos, tratando los ajustes iniciales como aprendizaje colectivo.",
          "Permitir que cada docente haga lo que quiera sin ningún objetivo pedagógico común ni evaluación de resultados.",
          "Sancionar públicamente los primeros errores técnicos para asegurar que el resto del equipo preste más atención.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 5,
        difficultyLabel: "Muy difícil",
        exerciseType: "Evaluación y toma de decisiones",
        suggestedMinutes: 10,
        topicTitle: "Tema 5: Consideración Individualizada y Diagnóstico Integral",
        authorCitation: "Burns (1978) & Bass (1985) — Integración de las 4 I's",
        theoreticalContent:
          "La cuarta dimensión de Bass es la Consideración Individualizada: el líder presta atención personal a cada miembro del equipo, reconociendo que las personas tienen distintas fortalezas, temores y ritmos de desarrollo.\n\nAl integrar las 4 I's (Influencia Idealizada, Motivación Inspiradora, Estimulación Intelectual y Consideración Individualizada), el líder transformacional logra impulsar cambios profundos sin sacrificar la cohesión humana ni quemar al talento.",
        keyTakeaway:
          "Transformar una organización exige combinar una visión colectiva inspiradora con un trato humano e individualizado.",
        scenarioTitle: "Reestructuración integral de un equipo multidisciplinario",
        scenarioContext:
          "Acabas de asumir el liderazgo de un proyecto estratégico que presenta retrasos, agotamiento emocional en sus miembros más antiguos y temor a proponer ideas en los miembros nuevos debido a una jefatura anterior excesivamente punitiva.",
        questionPrompt:
          "Diseña tu plan de intervención aplicando la teoría de Burns (1978) y las 4 dimensiones de Bass (1985).",
        openSubPrompts: [
          "1. ¿Qué acciones concretas implementarías para pasar de la cultura punitiva/transaccional a una transformacional?",
          "2. ¿Cómo aplicarías al menos dos de las '4 I's' de Bass (Influencia Idealizada, Motivación Inspiradora, Estimulación Intelectual o Consideración Individualizada) en este caso?",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Liderazgo Participativo / Democrático",
    shortName: "Participativo",
    description:
      "Resulta indispensable en la cultura laboral moderna para fomentar la equidad, la diversidad de criterios, el compromiso del equipo y la retención del talento humano mediante la toma de decisiones colaborativas.",
    academicJustification:
      "Resulta indispensable en la cultura laboral moderna para fomentar la equidad, la diversidad de criterios, el compromiso del equipo y la retención del talento humano mediante la toma de decisiones colaborativas.",
    authorsSummary: "Kurt Lewin, Ronald Lippitt & Ralph K. White (1939) y Daniel Goleman et al. (2000/2002)",
    icon: UsersRound,
    color: "#A855F7",
    tint: "#F5EBFF",
    eyebrow: "Decidir con el equipo · Lewin (1939) & Goleman (2000)",
    intro:
      "Fundamentado en los experimentos clásicos de psicología social de Kurt Lewin, Ronald Lippitt y Ralph K. White (1939) y ampliado por la teoría de Inteligencia Emocional de Daniel Goleman, Richard Boyatzis y Annie McKee (2000/2002), el liderazgo participativo o democrático promueve la toma de decisiones colectiva, la equidad y la corresponsabilidad.",
    consists:
      "Consiste en abrir canales reales de deliberación donde el líder fomenta la participación, escucha diversas perspectivas y construye acuerdos consensuados, elevando el clima emocional y el sentido de pertenencia del grupo.",
    acts:
      "El líder actúa como facilitador del diálogo: distribuye equitativamente la palabra, integra criterios diversos, respalda el compromiso del grupo y distingue cuándo es momento de deliberar y cuándo una urgencia requiere tomar una decisión oportuna.",
    principles: [
      {
        title: "Clima Grupal y Cohesión (Lewin, 1939)",
        text: "Los grupos democráticos desarrollan mayor originalidad, cooperación espontánea y sostienen su trabajo incluso cuando el líder no está presente.",
      },
      {
        title: "Voz y Compromiso Emocional (Goleman, 2000)",
        text: "Dar voz a los colaboradores en las decisiones que afectan su trabajo incrementa la flexibilidad, la responsabilidad y la moral del equipo.",
      },
      {
        title: "Gestión del Consenso con Criterio",
        text: "Evita tanto la imposición autocrática como la parálisis por reuniones interminables cuando el tiempo apremia.",
      },
    ],
    references: [theoreticalFoundations[0], theoreticalFoundations[1]],
    topics: [
      {
        level: 1,
        difficultyLabel: "Fácil",
        exerciseType: "Pregunta abierta conceptual",
        suggestedMinutes: 5,
        topicTitle: "Tema 1: Los Experimentos de Clima Grupal de Kurt Lewin",
        authorCitation: "Kurt Lewin, Ronald Lippitt y Ralph K. White (1939)",
        theoreticalContent:
          "En 1939, Lewin, Lippitt y White realizaron los primeros estudios experimentales sobre estilos de liderazgo comparando grupos bajo dirección Autocrática, Democrática y Laissez-faire.\n\nSus hallazgos demostraron que:\n• Bajo el estilo Autocrático, aunque podía haber alta cantidad de trabajo mientras el líder vigilaba, surgía hostilidad, sumisión o apatía, y el trabajo caía drásticamente en cuanto el líder salía del salón.\n• Bajo el estilo Democrático, las políticas se decidían mediante discusión grupal con el estímulo y asistencia del líder. Estos grupos mostraron relaciones más cordiales, mayor creatividad, sentido de 'nosotros' y mantuvieron su ritmo de trabajo incluso sin supervisión directa.",
        keyTakeaway:
          "El control autocrático genera obediencia temporal bajo vigilancia; la participación democrática construye autonomía y cohesión duradera.",
        questionPrompt:
          "A partir de los hallazgos experimentales de Lewin, Lippitt y White (1939), explica por qué un equipo participa con mayor compromiso cuando interviene en la definición de sus metas que cuando simplemente recibe órdenes.",
      },
      {
        level: 2,
        difficultyLabel: "Básico / Medio",
        exerciseType: "Escenario de la vida real",
        suggestedMinutes: 5,
        topicTitle: "Tema 2: Inteligencia Emocional y Clima Organizacional",
        authorCitation: "Daniel Goleman (2000) — Leadership That Gets Results (Harvard Business Review)",
        theoreticalContent:
          "En su estudio con más de 3.000 ejecutivos publicado en Harvard Business Review, Daniel Goleman (2000) identificó el estilo Democrático como uno de los generadores de resonancia emocional positiva en el clima laboral.\n\nAl dedicar tiempo a obtener las ideas y el respaldo de las personas, el líder genera confianza, respeto y compromiso. Además, como los propios colaboradores participan en el diseño de los objetivos y estándares de evaluación, mantienen un realismo claro sobre lo que se puede lograr y asumen la responsabilidad de los resultados.",
        keyTakeaway:
          "Escuchar genuinamente al equipo antes de decidir fortalece el clima emocional y reduce la resistencia al cambio.",
        scenarioTitle: "Rediseño de las normas de trabajo y horarios de un área",
        scenarioContext:
          "Una coordinación necesita actualizar las normas internas de entrega de proyectos y distribución de turnos. En el pasado, estos cambios se imponían por memorando y generaban quejas constantes e incumplimientos.",
        questionPrompt:
          "Según el enfoque del estilo Democrático de Goleman (2000), ¿cuál es la acción más efectiva del líder?",
        options: [
          "Redactar el nuevo reglamento en privado y publicarlo con sanciones estrictas para quienes lo cuestionen.",
          "Convocar una sesión estructurada con el equipo para exponer las necesidades del área, recoger propuestas de los integrantes y construir acuerdos corresponsables.",
          "Encuestar al equipo solo por formalidad, pero aplicar exactamente el documento que ya estaba decidido de antemano.",
          "Eliminar todas las normas de entrega para evitar cualquier incomodidad en el grupo.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 3,
        difficultyLabel: "Intermedio",
        exerciseType: "Desafío práctico",
        suggestedMinutes: 6,
        topicTitle: "Tema 3: Diversidad de Criterios y Participación Equitativa",
        authorCitation: "Lewin et al. (1939) & Goleman, Boyatzis y McKee (2002)",
        theoreticalContent:
          "Uno de los mayores retos prácticos del liderazgo participativo es evitar que las sesiones grupales sean monopolizadas por dos o tres voces dominantes mientras el resto guarda silencio por conformidad social.\n\nEl líder democrático eficaz no es un espectador pasivo en la reunión: diseña mecanismos de participación equitativa (rondas de palabra, lluvia de ideas escrita o deliberación por subgrupos) para asegurar que la diversidad de criterios enriquezca la decisión final.",
        keyTakeaway:
          "La verdadera democracia grupal requiere que el líder facilite activamente la equidad en el uso de la palabra.",
        scenarioTitle: "Participación desigual en la planeación de un evento institucional",
        scenarioContext:
          "Durante las reuniones de organización de un congreso universitario, dos integrantes con fuerte personalidad acaparan todas las decisiones, mientras cuatro integrantes con gran capacidad técnica guardan silencio y luego muestran desinterés en ejecutar lo acordado.",
        questionPrompt:
          "¿Qué intervención del líder aplica mejor los principios del liderazgo participativo para resolver esta asimetría?",
        options: [
          "Dejar que los dos integrantes más habladores decidan todo para que la reunión termine rápido.",
          "Establecer una metodología donde cada integrante presente primero su propuesta sin interrupciones, moderar los tiempos de intervención y sintetizar los acuerdos integrando los distintos aportes técnicos.",
          "Cancelar las reuniones grupales y asignar tareas por correo electrónico de forma unilateral.",
          "Confrontar agresivamente en público a quienes hablan mucho y obligar a hablar bajo presión a los demás.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 4,
        difficultyLabel: "Avanzado",
        exerciseType: "Pregunta tipo Saber Pro",
        suggestedMinutes: 8,
        topicTitle: "Tema 4: Límites del Consenso y Parálisis por Análisis",
        authorCitation: "Daniel Goleman (2000) — Cuándo funciona y cuándo falla el estilo Democrático",
        theoreticalContent:
          "Goleman (2000) advierte con rigor que el estilo democrático también tiene un costo si se aplica sin criterio: puede derivar en reuniones interminables donde se postergan decisiones cruciales esperando una unanimidad imposible ('parálisis por análisis'), o generar confusión cuando el equipo no cuenta con la información o competencia suficiente para decidir.\n\nAsimismo, en situaciones de crisis inminente o urgencia operativa, buscar consenso prolongado puede resultar contraproducente.",
        keyTakeaway:
          "El liderazgo participativo busca acuerdos informados y compromiso, no reuniones perpetuas que bloqueen la acción.",
        scenarioTitle: "Bloqueo decisional ante una entrega con fecha límite inminente",
        scenarioContext:
          "El equipo lleva tres reuniones seguidas debatiendo qué plataforma tecnológica usar para un proyecto que debe entregarse en 48 horas. Hay dos posturas divididas, ambas viables, pero ningún subgrupo quiere ceder y el plazo está a punto de vencer.",
        questionPrompt:
          "De acuerdo con el análisis crítico de Goleman (2000) sobre el estilo democrático, ¿cuál es la actuación más acertada del líder en este punto?",
        options: [
          "Programar tres reuniones más durante la semana siguiente hasta que el 100% del equipo opine exactamente igual, aunque se pierda la entrega.",
          "Reconocer y agradecer los argumentos de ambas partes, explicar que el plazo exige cerrar la deliberación, tomar una decisión fundamentada en los criterios ya discutidos y alinear al equipo en la ejecución.",
          "Culpar al equipo por su incapacidad de ponerse de acuerdo y abandonar la reunión.",
          "Permitir que cada mitad del equipo trabaje en una plataforma distinta e incompatible entre sí.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 5,
        difficultyLabel: "Muy difícil",
        exerciseType: "Evaluación y toma de decisiones",
        suggestedMinutes: 10,
        topicTitle: "Tema 5: Diseño de Toma de Decisiones Colaborativa en Contextos Complejos",
        authorCitation: "Lewin (1939) & Goleman, Boyatzis y McKee (2000/2002)",
        theoreticalContent:
          "Integrar la tradición empírica de Lewin (1939) con el modelo de inteligencia emocional de Goleman (2000) permite al líder diseñar procesos participativos maduros: abrir la deliberación cuando se requiere calidad de ideas, diversidad de criterios y compromiso de implementación, pero estableciendo reglas claras de decisión y tiempos definidos.",
        keyTakeaway:
          "Participar con éxito implica estructurar el diálogo, valorar la diversidad y traducir las ideas en acuerdos accionables.",
        scenarioTitle: "Conflicto entre departamentos por la asignación de un fondo de innovación",
        scenarioContext:
          "Tres equipos de trabajo compiten por un fondo único para financiar mejoras en el laboratorio. El ambiente se ha vuelto tenso y polarizado, pero el proyecto ganador requerirá la colaboración activa de los tres equipos durante todo el año.",
        questionPrompt:
          "Evalúa el caso y sustenta tu estrategia de liderazgo participativo basándote en Lewin (1939) y Goleman (2000).",
        openSubPrompts: [
          "1. ¿Cómo estructurarías el proceso de toma de decisiones para garantizar equidad, escucha activa y corresponsabilidad entre los tres equipos?",
          "2. ¿Qué mecanismos aplicarías para evitar que el proceso caiga en la polarización o en una parálisis sin acuerdos?",
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Liderazgo estilo Coaching / Desarrollo de Talento",
    shortName: "Coaching",
    description:
      "Responde a la necesidad urgente de pasar de la simple supervisión operativa al desarrollo continuo del potencial de las personas, promoviendo la autonomía y la tutoría a largo plazo.",
    academicJustification:
      "Responde a la necesidad urgente de pasar de la simple supervisión operativa al desarrollo continuo del potencial de las personas, promoviendo la autonomía y la tutoría a largo plazo.",
    authorsSummary: "Daniel Goleman, Richard Boyatzis y Annie McKee (2000 / 2002)",
    icon: Target,
    color: "#F0A900",
    tint: "#FFF7D6",
    eyebrow: "Acompañar para crecer · Goleman, Boyatzis & McKee (2000/2002)",
    intro:
      "Formalizado por Daniel Goleman, Richard Boyatzis y Annie McKee (2000/2002) dentro de la teoría de liderazgo resonante e inteligencia emocional, el estilo Coaching transforma al jefe tradicional en un desarrollador de personas. A pesar de ser uno de los estilos con mayor impacto positivo en el desempeño y el clima laboral, Goleman descubrió que es el menos utilizado por los directivos debido a la presión por las metas inmediatas.",
    consists:
      "Consiste en ayudar a los colaboradores a identificar sus fortalezas y debilidades únicas, vinculándolas con sus aspiraciones personales y profesionales a largo plazo mediante el diálogo, la indagación y planes de desarrollo.",
    acts:
      "El líder estilo Coaching evita resolver todo por su cuenta o microgestionar: formula preguntas reflexivas, delega tareas retadoras para promover el aprendizaje, tolera fallos iniciales a corto plazo en favor del crecimiento duradero y brinda retroalimentación constante.",
    principles: [
      {
        title: "Desarrollo a Largo Plazo (Goleman, 2000)",
        text: "Conecta el trabajo diario del colaborador con su plan de crecimiento personal y profesional futuro.",
      },
      {
        title: "Indagación sobre Imposición",
        text: "Utiliza preguntas abiertas para que el integrante analice la situación y construya sus propias soluciones.",
      },
      {
        title: "Retroalimentación y Delegación Formativa",
        text: "Asigna retos que estiran las capacidades del colaborador y acompaña el proceso con feedback constructivo.",
      },
    ],
    references: [theoreticalFoundations[1]],
    topics: [
      {
        level: 1,
        difficultyLabel: "Fácil",
        exerciseType: "Pregunta abierta conceptual",
        suggestedMinutes: 5,
        topicTitle: "Tema 1: De la Supervisión Operativa al Desarrollo del Potencial",
        authorCitation: "Daniel Goleman (2000) — Leadership That Gets Results",
        theoreticalContent:
          "En su investigación publicada en Harvard Business Review, Daniel Goleman (2000) observó una paradoja: el estilo Coaching era el menos practicado por los líderes (argumentaban que 'no tenían tiempo para enseñar en un entorno de alta presión'), pero quienes lo aplicaban obtenían mejoras notables en el clima emocional y en los resultados de negocio.\n\nA diferencia del supervisor operativo que solo verifica si una tarea inmediata salió bien o mal, el líder Coach invierte tiempo en conocer las metas de vida y carrera de sus colaboradores, ayudándoles a construir competencias que los hacen más autónomos y eficaces en el futuro.",
        keyTakeaway:
          "Dedicar tiempo hoy a desarrollar las capacidades de las personas multiplica la autonomía y el rendimiento mañana.",
        questionPrompt:
          "Según Goleman (2000), ¿cuál es la diferencia esencial entre un jefe que solo supervisa tareas operativas y un líder que aplica el estilo Coaching, y por qué invertir tiempo en el desarrollo del talento mejora los resultados a mediano y largo plazo?",
      },
      {
        level: 2,
        difficultyLabel: "Básico / Medio",
        exerciseType: "Escenario de la vida real",
        suggestedMinutes: 5,
        topicTitle: "Tema 2: La Conversación de Coaching y el Arte de Preguntar",
        authorCitation: "Daniel Goleman, Richard Boyatzis y Annie McKee (2002) — El Líder Resonante Crea Más",
        theoreticalContent:
          "Goleman, Boyatzis y McKee (2002) explican que la base del estilo Coaching es la empatía y la escucha activa. Cuando un colaborador enfrenta una dificultad técnica o metodológica, el impulso habitual de un jefe directivo es darle la solución exacta o hacer el trabajo por él para ahorrar tiempo.\n\nSin embargo, eso genera dependencia. El líder Coach formula preguntas que invitan al colaborador a diagnosticar el problema, explorar alternativas y asumir la autoría de su propio aprendizaje.",
        keyTakeaway:
          "Resolverle todo al equipo crea dependencia; guiar con preguntas desarrolla pensamiento autónomo.",
        scenarioTitle: "Bloqueo técnico de un integrante en su primer proyecto",
        scenarioContext:
          "Un estudiante en práctica profesional se acerca a ti bloqueado porque no sabe cómo estructurar el informe de diagnóstico de un cliente. Aunque tú podrías redactar ese esquema en 15 minutos, él tendrá que elaborar cinco informes similares durante el semestre.",
        questionPrompt:
          "Desde el enfoque del Liderazgo estilo Coaching de Goleman et al. (2000/2002), ¿cuál es la respuesta más adecuada?",
        options: [
          "Quitarle la tarea y redactar tú mismo el informe para asegurarte de que quede perfecto en menos tiempo.",
          "Hacerle preguntas orientadoras sobre qué datos clave ya identificó, revisar juntos un ejemplo de referencia y acompañarlo para que él mismo proponga la estructura y reciba tu retroalimentación.",
          "Decirle que ya debería saber hacerlo por su cuenta y que no regrese hasta tener el documento terminado.",
          "Reasignar permanentemente al practicante a tareas mecánicas de archivo donde no tenga que redactar informes.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 3,
        difficultyLabel: "Intermedio",
        exerciseType: "Desafío práctico",
        suggestedMinutes: 6,
        topicTitle: "Tema 3: Retroalimentación Constructiva y Gestión del Error",
        authorCitation: "Daniel Goleman (2000) — El feedback en el estilo Coaching",
        theoreticalContent:
          "Los líderes Coaching sobresalen en delegar: dan a los colaboradores tareas desafiantes, incluso si eso significa que las tareas no se cumplirán con la máxima rapidez en el primer intento. En palabras de Goleman (2000), estos líderes están dispuestos a tolerar fallos momentáneos porque priorizan el aprendizaje duradero.\n\nPara que el error sea formativo, la retroalimentación debe enfocarse en conductas observables y estrategias de mejora, nunca en descalificar la capacidad personal del colaborador.",
        keyTakeaway:
          "El feedback efectivo evalúa la estrategia y el proceso para impulsar el crecimiento, sin atacar la valía de la persona.",
        scenarioTitle: "Fallo en la presentación de un docente joven ante el comité",
        scenarioContext:
          "Un docente recién incorporado realizó su primera sustentación de proyecto ante el comité académico. Se puso nervioso, omitió datos clave del presupuesto y varias preguntas quedaron sin responder con claridad. Él se siente frustrado y teme haber perdido tu confianza.",
        questionPrompt:
          "Aplicando los principios de retroalimentación del estilo Coaching, ¿qué acción fortalece su aprendizaje y autoconfianza?",
        options: [
          "Anunciar que a partir de ahora tú harás todas las presentaciones públicas para evitar que el equipo quede mal.",
          "Reunirte en privado con él, reconocer primero los puntos que sí explicó con claridad, analizar juntos qué causó la omisión de los datos financieros y ensayar estrategias concretas para su próxima intervención.",
          "Ignorar lo ocurrido y decirle que 'todo salió perfecto' aunque el comité haya pedido corregir el presupuesto.",
          "Reprocharle frente a sus colegas su falta de experiencia para presionarlo a mejorar.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 4,
        difficultyLabel: "Avanzado",
        exerciseType: "Pregunta tipo Saber Pro",
        suggestedMinutes: 8,
        topicTitle: "Tema 4: Condiciones de Efectividad y Límites del Estilo Coaching",
        authorCitation: "Daniel Goleman (2000) — Cuándo funciona mejor el Coaching",
        theoreticalContent:
          "Al igual que otros estilos, Goleman (2000) señala que el Coaching no es una fórmula universal para toda circunstancia. Funciona excepcionalmente bien cuando los colaboradores son conscientes de sus áreas de mejora y están receptivos a desarrollar sus capacidades.\n\nPor el contrario, el estilo Coaching fracasa cuando:\n1. El colaborador carece por completo de motivación para aprender o rechaza abiertamente cualquier retroalimentación.\n2. El propio líder carece de la pericia o sensibilidad necesaria para guiar.\n3. Existe una crisis inmediata que exige acción instantánea y no da margen a procesos de tutoría lenta.",
        keyTakeaway:
          "El Coaching requiere disposición al aprendizaje en el colaborador y un entorno que permita el acompañamiento reflexivo.",
        scenarioTitle: "Diagnóstico de aplicación del Coaching en distintos perfiles del equipo",
        scenarioContext:
          "Como director de área tienes tres situaciones simultáneas: (Caso 1) Una analista junior entusiasta que quiere aprender a liderar proyectos pero aún comete errores de planificación; (Caso 2) Una emergencia de seguridad informática que está caída en este instante; (Caso 3) Un contratista externo que se niega reiteradamente a cumplir los protocolos básicos pese a múltiples sesiones previas de diálogo.",
        questionPrompt:
          "Según los criterios de Goleman (2000), ¿en cuál de estas situaciones el estilo Coaching tendrá su máximo impacto positivo y por qué?",
        options: [
          "En el Caso 2 (emergencia informática en curso), porque una caída crítica del sistema es el mejor momento para hacer preguntas filosóficas de largo plazo sin intervenir.",
          "En el Caso 1 (analista junior motivada), porque existe receptividad al aprendizaje y margen para convertir sus errores de planificación en desarrollo de competencias reales.",
          "En el Caso 3 (contratista que rechaza las normas), porque el coaching funciona mejor con personas que no tienen ningún interés en cambiar.",
          "En ninguno de los tres casos, ya que Goleman afirma que el estilo Coaching deteriora el clima organizacional.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 5,
        difficultyLabel: "Muy difícil",
        exerciseType: "Evaluación y toma de decisiones",
        suggestedMinutes: 10,
        topicTitle: "Tema 5: Diseño de un Plan de Tutoría y Desarrollo de Autonomía",
        authorCitation: "Goleman, Boyatzis y McKee (2000 / 2002) — Liderazgo Resonante",
        theoreticalContent:
          "El objetivo último del líder Coach es hacer innecesaria su supervisión constante: lograr que el colaborador desarrolle criterio propio, seguridad en sus capacidades y compromiso con la excelencia gracias a una relación de confianza y exigencia constructiva.",
        keyTakeaway:
          "El éxito de un líder Coach se mide por el crecimiento y la autonomía que alcanzan las personas a las que acompaña.",
        scenarioTitle: "Transición de un colaborador técnico a coordinador de subgrupo",
        scenarioContext:
          "Uno de los mejores especialistas técnicos de tu equipo acaba de ser promovido para coordinar a cuatro personas. Aunque domina la parte técnica, tiende a hacer el trabajo de sus compañeros cuando se desespera y le cuesta darles retroalimentación sin sonar brusco.",
        questionPrompt:
          "Diseña una intervención de Coaching basada en Goleman, Boyatzis y McKee (2000/2002) para acompañar su transición.",
        openSubPrompts: [
          "1. ¿Qué preguntas clave le plantearías en su primera sesión de coaching para que tome conciencia de su cambio de rol?",
          "2. ¿Qué acuerdos de práctica, seguimiento y retroalimentación establecerías con él durante su primer mes?",
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Liderazgo Delegativo / Laissez-Faire",
    shortName: "Delegativo",
    description:
      "Aporta una perspectiva analítica crucial sobre el manejo de la autonomía total. Permite evaluar cuándo la independencia maximiza el rendimiento en equipos de expertos y cuándo puede degenerar en desorganización si se aplica de forma incorrecta.",
    academicJustification:
      "Aporta una perspectiva analítica crucial sobre el manejo de la autonomía total. Permite evaluar cuándo la independencia maximiza el rendimiento en equipos de expertos y cuándo puede degenerar en desorganización si se aplica de forma incorrecta.",
    authorsSummary: "Kurt Lewin, Ronald Lippitt y Ralph K. White (1939)",
    icon: Network,
    color: "#17A98C",
    tint: "#E5FAF5",
    eyebrow: "Confiar con criterio · Lewin, Lippitt & White (1939)",
    intro:
      "Estudiado originalmente por Kurt Lewin, Ronald Lippitt y Ralph K. White (1939) bajo el concepto de 'Laissez-faire' ('dejar hacer'), el liderazgo delegativo representa el grado máximo de libertad grupal y la mínima intervención directiva del líder. Su análisis riguroso permite distinguir entre la delegación estratégica en equipos altamente competentes y el abandono de funciones que conduce al caos organizacional.",
    consists:
      "Consiste en otorgar a los miembros del equipo plena autonomía para diagnosticar problemas, elegir métodos de trabajo y tomar decisiones operativas, suministrando recursos o información únicamente cuando el propio equipo lo solicita.",
    acts:
      "Cuando se aplica estratégicamente, el líder define el marco general y los límites éticos/institucionales, confía en la pericia de los especialistas sin microgestionar y mantiene puntos de verificación claros; cuando se aplica incorrectamente en equipos inmaduros, provoca ambigüedad de roles y caída del rendimiento.",
    principles: [
      {
        title: "Autonomía en Equipos de Expertos",
        text: "Maximiza la creatividad y velocidad cuando los integrantes poseen alta competencia técnica, autodisciplina y claridad de metas.",
      },
      {
        title: "Riesgo de Anomia y Desorganización (Lewin, 1939)",
        text: "En grupos sin experiencia ni estructura previa, la ausencia de dirección genera confusión, pérdida de tiempo y frustración.",
      },
      {
        title: "Delegación Estratégica vs. Abandono",
        text: "Delegar la ejecución no significa evadir la responsabilidad final ni omitir los lineamientos éticos.",
      },
    ],
    references: [theoreticalFoundations[0]],
    topics: [
      {
        level: 1,
        difficultyLabel: "Fácil",
        exerciseType: "Pregunta abierta conceptual",
        suggestedMinutes: 5,
        topicTitle: "Tema 1: El Estilo Laissez-Faire en los Estudios de Kurt Lewin",
        authorCitation: "Kurt Lewin, Ronald Lippitt y Ralph K. White (1939)",
        theoreticalContent:
          "En los experimentos clásicos de 1939, Lewin, Lippitt y White observaron qué ocurría cuando el líder adoptaba una postura Laissez-faire: daba libertad completa para las decisiones grupales o individuales con una participación mínima, entregaba materiales pero aclaraba que solo daría información si se la pedían, y no participaba en la división de tareas ni evaluaba el curso de las actividades.\n\nEn participantes jóvenes sin experiencia previa en autogestión, este estilo produjo menor cantidad y menor calidad de trabajo que el estilo democrático, además de desorientación y juego desorganizado. Sin embargo, investigaciones posteriores mostraron que cuando los integrantes son expertos autodirigidos, la libertad operativa resulta altamente productiva.",
        keyTakeaway:
          "La libertad total sin estructura desorienta a los principiantes, pero potencia a los equipos expertos y autodirigidos.",
        questionPrompt:
          "Con base en los estudios de Lewin, Lippitt y White (1939), explica por qué el estilo Laissez-faire o delegativo puede fracasar rotundamente en un grupo sin experiencia, pero resultar exitoso en un equipo de especialistas.",
      },
      {
        level: 2,
        difficultyLabel: "Básico / Medio",
        exerciseType: "Escenario de la vida real",
        suggestedMinutes: 5,
        topicTitle: "Tema 2: Autonomía Productiva en Equipos de Alta Especialización",
        authorCitation: "Kurt Lewin et al. (1939) — Aplicación en equipos expertos",
        theoreticalContent:
          "Cuando un equipo está conformado por profesionales senior con alto dominio técnico, motivación intrínseca y conocimiento profundo de los estándares de calidad (por ejemplo, investigadores consolidados, desarrolladores senior o comités científicos), la supervisión microdirectiva frena la innovación y genera rechazo.\n\nEn estos escenarios, el estilo delegativo permite que cada especialista aplique su criterio experto con agilidad, mientras el líder actúa como facilitador de recursos y enlace institucional.",
        keyTakeaway:
          "En equipos de alta pericia y compromiso, el exceso de control estorba; la confianza con objetivos claros multiplica el rendimiento.",
        scenarioTitle: "Dirección de un grupo de investigación senior",
        scenarioContext:
          "Coordinas a cuatro investigadores con doctorado y amplia trayectoria que llevan años trabajando juntos con excelentes resultados. Deben desarrollar un nuevo prototipo en tres meses y conocen a la perfección los estándares éticos y metodológicos.",
        questionPrompt:
          "En este contexto de alta madurez y especialización, ¿qué actuación aplica correctamente el liderazgo delegativo?",
        options: [
          "Exigirles un reporte escrito cada dos horas detallando qué están leyendo y aprobar personalmente cada paso técnico básico.",
          "Acordar con el equipo el objetivo final, el presupuesto disponible y los hitos de entrega, otorgándoles plena autonomía para definir su metodología y distribución interna del trabajo.",
          "No comunicarles cuál es el objetivo del proyecto ni el presupuesto para que adivinen qué necesita la institución.",
          "Imponerles un método básico paso a paso ignorando su experiencia previa.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 3,
        difficultyLabel: "Intermedio",
        exerciseType: "Desafío práctico",
        suggestedMinutes: 6,
        topicTitle: "Tema 3: Cuando el Laissez-Faire Degenera en Desorganización",
        authorCitation: "Lewin, Lippitt y White (1939) — Dinámica grupal y ambigüedad de roles",
        theoreticalContent:
          "Lewin et al. (1939) documentaron que cuando un grupo carece de claridad sobre quién hace qué y el líder se limita a 'dejar hacer' sin ofrecer encuadre, emergen tres síntomas críticos:\n1. Ambigüedad de roles y duplicación de esfuerzos.\n2. Aparición de liderazgos informales impositivos o conflictos interpersonales no resueltos.\n3. Frustración colectiva al sentir que el trabajo no avanza hacia ninguna meta clara.",
        keyTakeaway:
          "Confundir delegación con ausencia de dirección en grupos que necesitan guía provoca caos y desgaste interpersonal.",
        scenarioTitle: "Estudiantes de primer semestre en su primer proyecto integrador",
        scenarioContext:
          "Un grupo de estudiantes recién ingresados debe entregar un proyecto complejo en cuatro semanas. El tutor les dijo el primer día: 'Ustedes son libres, organícense como quieran y me avisan al final'. A la segunda semana nadie sabe qué le toca hacer, hay discusiones en el grupo y no han avanzado nada.",
        questionPrompt:
          "A la luz de los hallazgos de Lewin (1939), ¿qué diagnóstico explica lo ocurrido y qué ajuste debe realizarse?",
        options: [
          "El estilo Laissez-faire se aplicó de forma prematura en un grupo sin experiencia ni estructura previa; el líder debe intervenir para clarificar objetivos, roles y etapas de trabajo.",
          "La culpa es exclusivamente de los estudiantes y el tutor debe mantener su silencio absoluto hasta que reprueben.",
          "El estilo Laissez-faire siempre produce ese resultado sin importar si el equipo es experto o novato.",
          "El tutor debe hacer él mismo todo el trabajo de los estudiantes para resolver el retraso.",
        ],
        correctOptionIndex: 0,
      },
      {
        level: 4,
        difficultyLabel: "Avanzado",
        exerciseType: "Pregunta tipo Saber Pro",
        suggestedMinutes: 8,
        topicTitle: "Tema 4: Delegación con Límites Éticos y Puntos de Control",
        authorCitation: "Análisis organizacional del Liderazgo Delegativo (Lewin, 1939)",
        theoreticalContent:
          "En la gestión contemporánea, delegar la autoridad operativa nunca equivale a abdicar de la responsabilidad institucional o ética. Un líder delegativo competente establece desde el inicio las 'fronteras de autonomía':\n\n• Qué decisiones puede tomar el equipo de manera 100% autónoma.\n• Cuáles son los estándares éticos, legales y de calidad innegociables.\n• En qué hitos específicos se revisarán los resultados sin invadir el día a día del equipo.",
        keyTakeaway:
          "La autonomía efectiva opera dentro de principios éticos y objetivos claramente acordados, nunca en el vacío normativo.",
        scenarioTitle: "Autonomía técnica frente a lineamientos éticos de privacidad de datos",
        scenarioContext:
          "Un equipo experto de desarrollo de software trabaja con total autonomía bajo tu liderazgo delegativo. Para acelerar la entrega de una función, uno de los especialistas propone utilizar una base de datos real de usuarios sin anonimizar, lo cual agilizaría las pruebas pero vulnera los lineamientos éticos y de privacidad.",
        questionPrompt:
          "¿Cuál es la actuación coherente con un liderazgo delegativo responsable?",
        options: [
          "No intervenir en absoluto porque bajo el liderazgo delegativo el equipo puede vulnerar normas éticas si eso acelera su trabajo.",
          "Mantener la autonomía del equipo sobre el diseño técnico, pero intervenir de forma inmediata y firme para hacer respetar el límite ético y legal de protección de datos.",
          "Eliminar para siempre toda autonomía del equipo y pasar a un control autocrático permanente sobre cada línea de código.",
          "Fingir que no te enteraste de la decisión para no asumir responsabilidad si ocurre una sanción.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 5,
        difficultyLabel: "Muy difícil",
        exerciseType: "Evaluación y toma de decisiones",
        suggestedMinutes: 10,
        topicTitle: "Tema 5: Evaluación Crítica de Autonomía vs. Intervención",
        authorCitation: "Kurt Lewin, Ronald Lippitt y Ralph K. White (1939)",
        theoreticalContent:
          "La madurez analítica de un líder frente al estilo Delegativo / Laissez-Faire radica en diagnosticar con precisión cuándo otorgar libertad plena para potenciar el talento experto y cuándo reestructurar el acompañamiento si aparecen señales de desorganización o desconexión con el propósito institucional.",
        keyTakeaway:
          "Saber delegar exige tanta capacidad diagnóstica como saber dirigir: la libertad funciona cuando descansa sobre competencia y responsabilidad.",
        scenarioTitle: "Coordinación simultánea de un comité experto y un equipo de nuevos ingresos",
        scenarioContext:
          "Tienes a tu cargo dos células de trabajo para un mismo lanzamiento institucional: la Célula A está integrada por cuatro especialistas con 8 años de experiencia que ya han ejecutado proyectos similares con éxito; la Célula B está formada por cinco recién graduados en su primera semana laboral.",
        questionPrompt:
          "Sustenta tu estrategia de gestión diferenciada a partir de la teoría de Lewin, Lippitt y White (1939).",
        openSubPrompts: [
          "1. ¿Por qué y cómo aplicarías el liderazgo delegativo con la Célula A sin caer en el abandono total?",
          "2. ¿Qué riesgos correrías si aplicaras el mismo estilo Laissez-faire con la Célula B y qué enfoque utilizarías con ellos?",
        ],
      },
    ],
  },
  {
    id: 5,
    name: "Liderazgo Situacional / Adaptativo",
    shortName: "Situacional",
    description:
      'Consolida el módulo al enseñar que no existe un único estilo "perfecto", ofreciendo al estudiante el marco práctico para diagnosticar la madurez del equipo y adaptar su comportamiento según la circunstancia.',
    academicJustification:
      'Consolida el módulo al enseñar que no existe un único estilo "perfecto", ofreciendo al estudiante el marco práctico para diagnosticar la madurez del equipo y adaptar su comportamiento según la circunstancia.',
    authorsSummary: "Paul Hersey y Kenneth Blanchard (1969)",
    icon: Compass,
    color: "#4F46E5",
    tint: "#EEF2FF",
    eyebrow: "Adaptar según la madurez · Hersey & Blanchard (1969)",
    intro:
      "Formulado por Paul Hersey y Kenneth Blanchard en 1969, el Modelo de Liderazgo Situacional consolida el aprendizaje de todo el módulo bajo una premisa fundamental: no existe un único estilo de liderazgo 'óptimo' para todas las situaciones. Los líderes eficaces son aquellos que diagnostican el nivel de madurez o desarrollo de sus colaboradores frente a una tarea específica y adaptan su conducta en consecuencia.",
    consists:
      "Consiste en combinar estratégicamente dos dimensiones del comportamiento del líder —Conducta Directiva (enfoque en la tarea) y Conducta de Apoyo (enfoque en la relación)— en función de la Competencia (habilidad técnica) y el Compromiso (motivación y confianza) del colaborador.",
    acts:
      "El líder actúa como un diagnosticador flexible que se mueve entre cuatro estilos —Dirigir (E1), Guiar/Persuadir (E2), Apoyar/Participar (E3) y Delegar (E4)— acompañando la evolución de su equipo desde la dependencia inicial hasta la autonomía experta.",
    principles: [
      {
        title: "Diagnóstico de Madurez (M1 a M4)",
        text: "Evalúa el nivel de Competencia (saber hacer) y Compromiso (querer/confiar en hacer) ante cada tarea concreta.",
      },
      {
        title: "Conducta de Tarea vs. Conducta de Relación",
        text: "Ajusta cuánta estructura técnica brinda y cuánto respaldo socioemocional ofrece según la necesidad del colaborador.",
      },
      {
        title: "Flexibilidad de los 4 Estilos (E1 - E4)",
        text: "Pasa de Dirigir (E1) y Guiar (E2) hacia Apoyar (E3) y Delegar (E4) conforme crece la madurez del equipo.",
      },
    ],
    references: [theoreticalFoundations[3]],
    topics: [
      {
        level: 1,
        difficultyLabel: "Fácil",
        exerciseType: "Pregunta abierta conceptual",
        suggestedMinutes: 5,
        topicTitle: "Tema 1: La Premisa Central de Hersey y Blanchard (Tarea vs. Relación)",
        authorCitation: "Paul Hersey y Kenneth Blanchard (1969) — Life Cycle Theory of Leadership",
        theoreticalContent:
          "En 1969, Paul Hersey y Kenneth Blanchard demostraron que la eficacia del liderazgo no depende de un rasgo fijo de personalidad, sino de la adecuación entre la conducta del líder y la situación específica.\n\nPara ello definieron dos dimensiones independientes del comportamiento del líder:\n• Conducta Directiva (Tarea): Grado en que el líder define roles, explica qué hacer, cómo, cuándo y supervisa de cerca el cumplimiento.\n• Conducta de Apoyo (Relación): Grado en que el líder escucha, brinda respaldo socioemocional, facilita la interacción e involucra al colaborador en las decisiones.",
        keyTakeaway:
          "No existe un estilo único ideal: el mejor líder es el que adapta su nivel de dirección y de apoyo a la realidad de su equipo.",
        questionPrompt:
          "Según Hersey y Blanchard (1969), explica por qué un líder que utiliza exactamente el mismo estilo con todas las personas y en todas las tareas termina siendo ineficaz.",
      },
      {
        level: 2,
        difficultyLabel: "Básico / Medio",
        exerciseType: "Escenario de la vida real",
        suggestedMinutes: 5,
        topicTitle: "Tema 2: Diagnóstico del Nivel de Madurez del Colaborador (M1 a M4)",
        authorCitation: "Hersey y Blanchard (1969) — Niveles de Madurez / Desarrollo",
        theoreticalContent:
          "Antes de elegir cómo liderar, Hersey y Blanchard plantean que el líder debe diagnosticar la Madurez (Competencia técnica + Compromiso/Motivación) del colaborador frente a una tarea específica:\n\n• M1 (Baja competencia / Alto compromiso inicial o inseguridad): No sabe cómo hacerlo aún, pero tiene entusiasmo o necesita instrucción básica.\n• M2 (Alguna competencia / Bajo compromiso o desilusión): Ya empezó a aprender que la tarea es más difícil de lo que creía y se siente frustrado.\n• M3 (Alta competencia / Compromiso variable o inseguridad): Sabe cómo hacer la tarea, pero duda de tomar decisiones solo o atraviesa desmotivación.\n• M4 (Alta competencia / Alto compromiso): Domina la tarea con excelencia y tiene plena seguridad y motivación autónoma.",
        keyTakeaway:
          "La madurez no es una etiqueta global sobre la persona, sino su nivel de competencia y confianza frente a una tarea concreta.",
        scenarioTitle: "Identificación del nivel de madurez ante una nueva responsabilidad",
        scenarioContext:
          "Una integrante de tu equipo domina perfectamente el análisis estadístico (en esa tarea es experta), pero hoy debe moderar por primera vez una negociación conflictiva con proveedores externos. Nunca ha negociado antes, aunque está muy entusiasmada y con ganas de aprender.",
        questionPrompt:
          "De acuerdo con el modelo de Hersey y Blanchard (1969), ¿cómo debes diagnosticar su nivel de madurez para esta nueva tarea de negociación?",
        options: [
          "Como M4 (experta autónoma) en negociación, porque como es buena en estadística automáticamente domina cualquier otra actividad sin guía.",
          "Como M1 en esta tarea específica (baja competencia actual en negociación, pero alto compromiso y disposición para aprender), por lo que requiere instrucciones claras y estructura inicial.",
          "Como una persona incompetente que debe ser retirada del equipo.",
          "Sin realizar ningún diagnóstico, porque la madurez del colaborador no influye en el estilo del líder.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 3,
        difficultyLabel: "Intermedio",
        exerciseType: "Desafío práctico",
        suggestedMinutes: 6,
        topicTitle: "Tema 3: Estilos E1 (Dirigir) y E2 (Guiar / Persuadir)",
        authorCitation: "Hersey y Blanchard (1969) — Cuadrantes E1 y E2",
        theoreticalContent:
          "Cuando la competencia técnica frente a la tarea aún es baja (niveles M1 y M2), el líder necesita aportar alta estructura directiva:\n\n• Estilo E1 — Dirigir (Alta Tarea / Baja Relación): Ideal para M1. El líder da instrucciones específicas paso a paso, define metas claras y supervisa de cerca el inicio.\n• Estilo E2 — Guiar o Persuadir (Alta Tarea / Alta Relación): Ideal para M2. Cuando el colaborador se frustra al enfrentar las primeras dificultades, el líder sigue dando dirección técnica pero añade un alto apoyo socioemocional, explicando el 'porqué' de las decisiones y restaurando su confianza.",
        keyTakeaway:
          "Cuando falta competencia técnica no se puede delegar a ciegas: primero se dirige (E1) y se guía con apoyo (E2).",
        scenarioTitle: "Colaborador frustrado tras la primera semana con un nuevo software",
        scenarioContext:
          "Un miembro del equipo que había comenzado con mucho entusiasmo a usar un nuevo sistema contable (M1) lleva tres días cometiendo errores de carga, siente que el sistema es demasiado complejo y ahora está desanimado pensando que no podrá dominarlo (transición a M2).",
        questionPrompt:
          "Según la matriz situacional de Hersey y Blanchard, ¿qué estilo debe adoptar el líder en este momento?",
        options: [
          "Estilo E4 (Delegar: baja dirección y bajo apoyo), dejándolo completamente solo para que resuelva su frustración como pueda.",
          "Estilo E2 (Guiar / Persuadir: alta dirección técnica combinada con alto apoyo socioemocional), reforzando la explicación paso a paso mientras escuchas sus dudas y reconoces sus avances para recuperar su motivación.",
          "Despedirlo inmediatamente por no dominar el sistema en tres días.",
          "Estilo E1 puro sin ningún tipo de escucha ni ánimo, limitándose a señalarle sus errores.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 4,
        difficultyLabel: "Avanzado",
        exerciseType: "Pregunta tipo Saber Pro",
        suggestedMinutes: 8,
        topicTitle: "Tema 4: Estilos E3 (Apoyar / Participar) y E4 (Delegar)",
        authorCitation: "Hersey y Blanchard (1969) — Cuadrantes E3 y E4",
        theoreticalContent:
          "A medida que el colaborador alcanza alta competencia técnica (niveles M3 y M4), el líder debe reducir drásticamente la conducta directiva sobre la tarea:\n\n• Estilo E3 — Apoyar / Participar (Baja Tarea / Alta Relación): Ideal para M3. El colaborador ya sabe hacer el trabajo pero le falta seguridad o motivación. El líder no le dicta cómo hacer la tarea (eso lo sentiría como microgestión), sino que lo escucha, respalda sus ideas y facilita la toma de decisiones compartida.\n• Estilo E4 — Delegar (Baja Tarea / Baja Relación): Ideal para M4. El colaborador es competente y está plenamente motivado; el líder le transfiere la responsabilidad operativa y el control del proceso.",
        keyTakeaway:
          "Con colaboradores técnicamente competentes, dirigir en exceso desmotiva: se apoya su confianza (E3) o se delega con autonomía (E4).",
        scenarioTitle: "Profesional altamente capaz que duda antes de tomar una decisión clave",
        scenarioContext:
          "Una coordinadora de tu equipo tiene un dominio técnico sobresaliente y lleva dos años realizando diagnósticos impecables. Sin embargo, ante un proyecto de alto perfil institucional, se muestra insegura de su propio criterio y te pide validación constante por temor a equivocarse (M3).",
        questionPrompt:
          "De acuerdo con el modelo de Hersey y Blanchard (1969), ¿cuál es el estilo de liderazgo situacional indicado?",
        options: [
          "Estilo E1 (Dirigir): volver a explicarle desde cero los conceptos básicos de su profesión y supervisar cada línea que escribe.",
          "Estilo E3 (Apoyar / Participar): disminuir las instrucciones técnicas innecesarias y concentrarte en escucharla, validar su solvencia profesional y analizar juntos sus propuestas para que recupere la confianza.",
          "Estilo E4 extremo: negarte a hablar con ella y cortar toda comunicación.",
          "Reasignar el proyecto a un principiante sin experiencia.",
        ],
        correctOptionIndex: 1,
      },
      {
        level: 5,
        difficultyLabel: "Muy difícil",
        exerciseType: "Evaluación y toma de decisiones",
        suggestedMinutes: 10,
        topicTitle: "Tema 5: Síntesis Integradora del Módulo de Liderazgo",
        authorCitation: "Síntesis de Burns & Bass, Lewin, Goleman y Hersey & Blanchard",
        theoreticalContent:
          "El Liderazgo Situacional de Hersey y Blanchard (1969) actúa como la brújula integradora de todo el Módulo de Formación en Liderazgo:\n\n• Permite saber cuándo inspirar una visión compartida (Transformacional — Burns y Bass).\n• Cuándo abrir el consenso y dar voz al grupo (Participativo / E3 — Lewin y Goleman).\n• Cuándo acompañar el aprendizaje y desarrollo (Coaching / E2 — Goleman).\n• Y cuándo otorgar autonomía plena a expertos (Delegativo / E4 — Lewin, Hersey y Blanchard).",
        keyTakeaway:
          "La maestría en el liderazgo consiste en diagnosticar personas y contextos para articular el estilo que cada desafío humano requiere.",
        scenarioTitle: "Dirección adaptativa de un equipo heterogéneo en un proyecto institucional",
        scenarioContext:
          "Lideras un equipo de tres personas en un proyecto estratégico: (1) Carlos, recién ingresado sin experiencia técnica pero muy entusiasta (M1); (2) Elena, con nivel técnico intermedio pero frustrada por errores recientes (M2); y (3) Sofía, especialista senior autónoma y altamente comprometida (M4). Además, el equipo necesita mantener una visión inspiradora común.",
        questionPrompt:
          "Integra los marcos teóricos del módulo para diseñar tu estrategia de liderazgo adaptativo.",
        openSubPrompts: [
          "1. Según Hersey y Blanchard (1969), ¿qué estilo específico (E1, E2, E3 o E4) aplicarías con Carlos, con Elena y con Sofía, y por qué?",
          "2. ¿Cómo complementarías esa gestión individual situacional con los aportes del Liderazgo Transformacional (Bass), Participativo (Lewin/Goleman) o Coaching (Goleman) para cohesionar a todo el equipo?",
        ],
      },
    ],
  },
];
