import { Users, Layers, UserCheck, Target, HeartHandshake } from "lucide-react";
import { AcademicReference, LeadershipModule } from "./leadershipData";
import { DecisionTopicLevel } from "./decisionData";

export interface TeamworkTopicLevel extends DecisionTopicLevel {}

export interface TeamworkModule extends LeadershipModule {
  topics: TeamworkTopicLevel[];
}

export const teamworkModules: TeamworkModule[] = [
  {
    id: 1,
    name: "Comunicación Efectiva y Escucha Activa",
    shortName: "Comunicación y Escucha",
    description:
      "Desarrolla la capacidad de compartir información clara, escuchar con atención y prevenir desacuerdos en dinámicas colectivas.",
    academicJustification:
      "Sustenta la comunicación y la escucha activa como la base indispensable para coordinar esfuerzos, reducir errores y generar confianza interpersonal según Tuckman y Lewin.",
    authorsSummary: "Bruce W. Tuckman (1965), Kurt Lewin (1947) y Albert Bandura (1977)",
    icon: Users,
    color: "#059669",
    tint: "#ECFDF5",
    eyebrow: "Dimensión 1 · Trabajo en Equipo",
    intro:
      "Trabajar en equipo no consiste solamente en hablar o repartir tareas. Significa compartir información de manera clara, escuchar con atención, comprobar que todos comprendieron y expresar desacuerdos con respeto. La comunicación efectiva reduce errores, evita rumores y permite que las personas coordinen sus esfuerzos hacia una meta común.",
    consists:
      "Estudio y aplicación de técnicas de clarificación, escucha activa, respeto interpersonal y protocolos de comunicación en equipos presenciales y remotos.",
    acts:
      "Identifica conductas de escucha activa, resuelve divergencias de interpretación en tareas y estructura acuerdos verificables de comunicación.",
    principles: [
      {
        title: "Claridad y Oportunidad",
        text: "Transmitir ideas concretas, completas y oportunas para evitar vacíos y rumores.",
      },
      {
        title: "Escucha Activa y Validación",
        text: "Prestar atención plena, preguntar y confirmar lo que se entendió antes de responder.",
      },
      {
        title: "Respeto Interpersonal",
        text: "Expresar opiniones y desacuerdos constructivos sin atacar ni descalificar a las personas.",
      },
    ],
    references: [
      {
        authors: "Bruce W. Tuckman",
        year: "1965",
        contribution: "Modelo de etapas de desarrollo de grupos: Formación, Conflicto, Normalización y Desempeño.",
        justification: "Base para entender cómo la comunicación inicial establece las bases de la confianza del equipo.",
        links: [],
      },
      {
        authors: "Kurt Lewin",
        year: "1947",
        contribution: "Dinámica de grupos, fuerzas interactivas y construcción de acuerdos participativos.",
        justification: "Explica cómo la interacción y las normas comunicativas transforman la conducta colectiva.",
        links: [],
      },
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta abierta",
        exerciseType: "Comprensión Conceptual",
        suggestedMinutes: 10,
        topicTitle: "Concepto de Comunicación Efectiva y Escucha Activa",
        authorCitation: "Fundamentos de Dinámica de Grupos (Lewin, 1947)",
        theoreticalContent:
          "La comunicación en equipo trasciende la simple emisión de mensajes. Implica un circuito de retroalimentación donde la escucha activa (parafrasear, prestar atención plena y validar lo comprendido) es la clave para coordinar esfuerzos hacia una meta compartida.",
        keyTakeaway:
          "Escuchar activamente no es guardar silencio esperando el turno de hablar, sino comprobar y confirmar lo que la otra persona expresó.",
        questionPrompt:
          "Con tus propias palabras, explica qué significa comunicarse bien cuando se trabaja en equipo. Menciona una conducta que demuestre que estás escuchando activamente.",
        modelAnswer:
          "Comunicarse bien en equipo significa transmitir información clara, precisa y oportuna, asegurándose de que todos hayan comprendido el mensaje y expresando desacuerdos con respeto. Una conducta que demuestra escucha activa es parafrasear o resumir lo dicho por un compañero ('Si entendí bien, lo que propones es...') antes de emitir una opinión, manteniendo atención visual y sin interrumpir.",
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Escenario de la vida real",
        exerciseType: "Resolución Situacional",
        suggestedMinutes: 10,
        topicTitle: "Discrepancia en la Interpretación de Instrucciones",
        authorCitation: "Coordinación y Claridad Operativa en Equipos",
        theoreticalContent:
          "Cuando surgen divergencias en la entrega de partes de un trabajo, el enfoque constructivo exige revisar colectivamente el marco común de instrucciones y acordar los entregables en lugar de buscar culpables individuales.",
        keyTakeaway:
          "Frente a malentendidos operativos, la solución reside en redefinir acuerdos y revisar directrices juntos.",
        questionPrompt:
          "En un trabajo grupal, dos integrantes entendieron de manera distinta las instrucciones y elaboraron partes que no coinciden. ¿Qué acción ayudaría más a resolver la situación?",
        options: [
          "A) Culpar a quien interpretó mal.",
          "B) Reunir al equipo, revisar las instrucciones y acordar qué debe entregar cada persona.",
          "C) Entregar el trabajo así para no perder tiempo.",
          "D) Dejar que una sola persona rehaga todo sin consultar.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Reunir al equipo para revisar las directrices originales y redefinir acuerdos específicos garantiza la coherencia del entregable y fortalece la responsabilidad compartida sin generar fricciones estériles.",
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Desafío práctico",
        exerciseType: "Intervención Interpersonal",
        suggestedMinutes: 12,
        topicTitle: "Garantizar la Participación y el Turno de la Palabra",
        authorCitation: "Inclusión Comunicativa (Bandura, 1977)",
        theoreticalContent:
          "En las dinámicas de grupo, la interrupción sistemática socava la confianza y silencia aportes valiosos. El facilitador o compañero asertivo debe intervenir de manera constructiva para devolver la palabra y centrar la atención.",
        keyTakeaway:
          "Un equipo de alto desempeño protege el derecho de cada integrante a expresar sus dificultades sin ser silenciado.",
        questionPrompt:
          "Durante una reunión, una integrante intenta explicar una dificultad, pero sus compañeros la interrumpen y cambian de tema. Describe dos acciones concretas que podrías realizar para que su idea sea escuchada y el equipo encuentre una solución.",
        modelAnswer:
          "Acción 1: Intervenir de manera respetuosa y asertiva diciendo: 'Hagamos una pausa un momento; Laura estaba compartiendo un obstáculo clave con el entregable y es importante que termine de explicarlo antes de pasar a otro punto'.\nAcción 2: Una vez escuchada, formular una pregunta facilitadora al grupo: 'Ahora que entendemos la dificultad que plantea Laura, ¿qué alternativas prácticas tenemos entre todos para resolverla?'",
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Pregunta tipo Saber Pro",
        exerciseType: "Gestión de Equipos Remotos",
        suggestedMinutes: 12,
        topicTitle: "Optimización de Canales en Comunicación Distribuida",
        authorCitation: "Diseño de Estructuras de Comunicación (Hackman, 2002)",
        theoreticalContent:
          "En equipos remotos o asíncronos, la sobrecarga de mensajes sin reglas claras agrava la desorganización. Se requiere institucionalizar canales oficiales, plazos de respuesta y actas de cierre de reunión con acuerdos verificables.",
        keyTakeaway:
          "La efectividad remota no depende de enviar más mensajes, sino de fijar acuerdos explícitos de comunicación.",
        questionPrompt:
          "Un equipo de trabajo remoto presenta retrasos porque algunos integrantes no revisan los mensajes y otros envían instrucciones incompletas. ¿Cuál estrategia es más pertinente?",
        options: [
          "A) Aumentar la cantidad de mensajes sin establecer acuerdos.",
          "B) Definir canales, responsables y tiempos de respuesta, y cerrar cada reunión con acuerdos verificables.",
          "C) Suspender toda comunicación hasta la entrega.",
          "D) Permitir que cada integrante use el canal que prefiera sin informar a los demás.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Establecer canales específicos, tiempos máximos de respuesta y minutas de cierre con compromisos verificables elimina la ambigüedad y previene retrasos en entornos colaborativos remotos.",
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Evaluación y toma de decisiones",
        exerciseType: "Gestión Restaurativa de Conflictos",
        suggestedMinutes: 15,
        topicTitle: "Desactivación de Culpa Mutua y Prevención de Errores",
        authorCitation: "Etapa de Tormenta / Storming (Tuckman, 1965)",
        theoreticalContent:
          "Cuando un error de interpretación genera acusaciones mutuas, el equipo cae en una espiral destructiva si no se separa a las personas del problema. El líder debe facilitar un espacio seguro para analizar el proceso técnico y generar salvaguardas futuras.",
        keyTakeaway:
          "Los errores de interpretación deben transformarse en protocolos institucionales de verificación, no en juicios personales.",
        questionPrompt:
          "Una diferencia de interpretación provocó un error importante y dos integrantes se responsabilizan mutuamente. Explica cómo facilitarías una conversación que permita reconstruir lo ocurrido sin ataques personales. Después, plantea dos acuerdos para prevenir que el problema se repita.",
        modelAnswer:
          "Facilitación: Convocaría una sesión estructurada estableciendo como norma inicial centrarse en los hechos y procesos, no en calificar intenciones. Pediría a cada parte relatar objetivamente qué entendió y cómo actuó, anotando la secuencia en un tablero visible para identificar dónde ocurrió la brecha de comprensión sin juzgar culpas individuales.\n\nAcuerdo 1 (Verificación Cruzada): Cada vez que se defina un requerimiento crítico, el responsable redactará una breve síntesis escrita de 3 líneas y pedirá confirmación explícita al receptor antes de iniciar la ejecución.\nAcuerdo 2 (Punto de Control Intermedio): Establecer una revisión rápida de 10 minutos a mitad de camino para contrastar las partes elaboradas y corregir desajustes de interpretación a tiempo.",
      },
    ],
  },
  {
    id: 2,
    name: "Cooperación, Coordinación y Metas Compartidas",
    shortName: "Cooperación y Metas",
    description:
      "Transforma esfuerzos individuales dispersos en una acción colectiva integrada mediante objetivos comunes e interdependencia positiva.",
    academicJustification:
      "Fundamenta la teoría de la cooperación y competencia de Morton Deutsch (1949) y las condiciones de efectividad grupal de Richard Hackman (2002).",
    authorsSummary: "Morton Deutsch (1949, 1973), J. Richard Hackman (2002) y Kurt Lewin (1947)",
    icon: Layers,
    color: "#059669",
    tint: "#ECFDF5",
    eyebrow: "Dimensión 2 · Trabajo en Equipo",
    intro:
      "La cooperación ocurre cuando las personas ponen sus capacidades al servicio de un propósito común. Un equipo no es simplemente un conjunto de individuos trabajando al mismo tiempo: sus tareas deben conectarse, complementarse y avanzar hacia una meta compartida. Coordinar implica saber qué se hará, quién lo hará, cuándo y cómo se integrará el resultado.",
    consists:
      "Diseño de metas compartidas, secuenciación interdependiente de actividades y balance entre entregas individuales y calidad colectiva.",
    acts:
      "Diferencia trabajo individual de trabajo en equipo, articula tareas interdependientes y resuelve cuellos de botella temporales.",
    principles: [
      {
        title: "Meta Común",
        text: "Todos los integrantes comprenden con claridad qué resultado se persigue y por qué es relevante.",
      },
      {
        title: "Interdependencia Positiva",
        text: "Cada aporte individual se conecta y potencia con el trabajo de los demás integrantes.",
      },
      {
        title: "Coordinación Sistémica",
        text: "Sincronización de tareas, tiempos y recursos para lograr un producto integrado y coherente.",
      },
    ],
    references: [
      {
        authors: "Morton Deutsch",
        year: "1949 / 1973",
        contribution: "Teoría de la cooperación y competencia: interdependencia positiva vs. rivalidad negativa.",
        justification: "Base para entender que el éxito del equipo requiere que el logro individual favorezca el logro colectivo.",
        links: [],
      },
      {
        authors: "J. Richard Hackman",
        year: "2002",
        contribution: "Condiciones de efectividad en equipos: dirección clara, estructura facilitadora y contexto de apoyo.",
        justification: "Demuestra que la efectividad no es azarosa, sino producto del diseño consciente de metas y roles.",
        links: [],
      },
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta abierta",
        exerciseType: "Diferenciación Conceptual",
        suggestedMinutes: 10,
        topicTitle: "Trabajo en Grupo vs. Verdadero Trabajo en Equipo",
        authorCitation: "Teoría de la Interdependencia Social (Morton Deutsch, 1949)",
        theoreticalContent:
          "Estar juntos en un mismo espacio no constituye un equipo. En un simple grupo los integrantes responden por parcelas aisladas; en un verdadero equipo existe una meta compartida donde los esfuerzos se entrelazan de manera complementaria.",
        keyTakeaway:
          "El equipo existe cuando las partes se articulan en función de una meta que nadie podría lograr en solitario.",
        questionPrompt:
          "¿Cuál es la diferencia entre trabajar al lado de otras personas y trabajar verdaderamente en equipo? Da un ejemplo.",
        modelAnswer:
          "Trabajar al lado de otros implica realizar tareas paralelas e independientes en un mismo espacio, donde cada persona responde únicamente por su producto sin que exista necesidad de coordinarse. Trabajar verdaderamente en equipo exige interdependencia: existe un objetivo conjunto, las partes se complementan y el éxito de cada miembro depende del éxito de los demás. Ejemplo: tres personas redactando capítulos aislados sin leerse trabajan en grupo; esas mismas personas discutiendo la estructura, articulando argumentos y co-editando un informe final trabajan en equipo.",
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Escenario de la vida real",
        exerciseType: "Planificación Cooperativa",
        suggestedMinutes: 10,
        topicTitle: "Organización Colectiva de un Evento",
        authorCitation: "Estructuración del Trabajo en Equipo (Hackman, 2002)",
        theoreticalContent:
          "La cooperación no es la suma inconexa de partes, sino la definición conjunta de la meta y la integración deliberada de las responsabilidades individuales.",
        keyTakeaway:
          "Cooperar requiere acordar el objetivo antes de distribuir tareas y definir cómo ensamblarlas.",
        questionPrompt:
          "Tu grupo debe organizar una jornada cultural. ¿Qué acción refleja mejor la cooperación?",
        options: [
          "A) Cada integrante prepara una actividad sin contarle a los demás.",
          "B) El equipo define una meta, distribuye responsabilidades y establece cómo unir las actividades.",
          "C) La persona con más experiencia realiza todas las tareas.",
          "D) Se espera hasta el último día para decidir qué hará cada uno.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Definir una meta común y planificar cómo interactúan los aportes garantiza que cada acción sume a un resultado articulado y sinérgico.",
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Desafío práctico",
        exerciseType: "Resolución de Cuello de Botella",
        suggestedMinutes: 12,
        topicTitle: "Sincronización Interdependiente entre Subequipos",
        authorCitation: "Coordinación de Flujos de Trabajo (Deutsch, 1973)",
        theoreticalContent:
          "Cuando las tareas son secuenciales, el retraso en un subequipo paraliza al siguiente. Se requieren acuerdos de entregas parciales (hitos) y comunicación temprana de avances.",
        keyTakeaway:
          "La coordinación exige visibilidad del flujo de trabajo y entregas intermedias para evitar bloqueos en cadena.",
        questionPrompt:
          "En un proyecto, el equipo de diseño termina su parte, pero no puede avanzar el equipo de presentación porque aún no recibe la información necesaria. Identifica el problema de coordinación y propone una forma de organizar la entrega entre ambos grupos.",
        modelAnswer:
          "Problema identificado: Desacople temporal e interdependencia secuencial rígida sin hitos intermedios ni comunicación de avances.\nSolución propuesta: Establecer entregas incrementales o por lotes. En lugar de esperar el 100% del diseño final, el equipo de diseño compartirá wireframes y esquemas preliminares al 50%, permitiendo que el equipo de presentación avance en la estructura de contenidos y diapositivas de manera concurrente.",
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Pregunta tipo Saber Pro",
        exerciseType: "Alineación y Coherencia Organizacional",
        suggestedMinutes: 12,
        topicTitle: "Integración de Aportes Multidisciplinarios",
        authorCitation: "Efectividad de Equipos Complejos (Hackman, 2002)",
        theoreticalContent:
          "La excelencia individual no garantiza un resultado colectivo armónico. Sin objetivos compartidos e hitos de revisión conjunta, cada área optimiza su propio interés fragmentando el producto final.",
        keyTakeaway:
          "La integración se construye mediante hitos de revisión conjunta y criterios compartidos de calidad.",
        questionPrompt:
          "Una organización reúne personas de distintas áreas para desarrollar una campaña. Cada área cumple sus tareas, pero el resultado final es incoherente. ¿Qué medida fortalecería la integración?",
        options: [
          "A) Evaluar únicamente el rendimiento individual.",
          "B) Establecer objetivos compartidos, hitos de revisión y espacios para integrar los aportes.",
          "C) Eliminar la comunicación entre áreas.",
          "D) Dejar que cada área cambie el objetivo según sus intereses.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Establecer hitos periódicos de revisión conjunta permite validar la alineación conceptual y técnica entre áreas antes del ensamblaje definitivo.",
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Evaluación y toma de decisiones",
        exerciseType: "Dilema de Calidad Colectiva vs. Tiempo",
        suggestedMinutes: 15,
        topicTitle: "Balance entre Eficiencia Individual y Revisión Colectiva",
        authorCitation: "Dinámica de Decisión y Rendimiento Grupal (Hackman & Deutsch)",
        theoreticalContent:
          "Bajo restricciones de tiempo, existe la tentación de privilegiar la entrega apresurada de partes aisladas. El equipo maduro sabe reservar un tiempo no negociable para revisar la integración y cohesión final.",
        keyTakeaway:
          "Un resultado conjunto de excelencia exige planificar siempre una ventana temporal para la integración y el control de calidad.",
        questionPrompt:
          "El equipo tiene poco tiempo y debe elegir entre terminar rápidamente las tareas individuales o reservar tiempo para integrar y revisar el resultado conjunto. ¿Cómo tomarías la decisión? Justifica cómo equilibrarías la responsabilidad individual y la calidad colectiva.",
        modelAnswer:
          "Decisión: Optaría por delimitar un alcance mínimo viable (MVP) de las tareas individuales para proteger obligatoriamente un bloque del 25% del tiempo restante dedicado a la integración y control de calidad conjunto.\nJustificación: Entregar partes perfectas por separado pero incoherentes entre sí degrada la calidad global del proyecto y demuestra falta de trabajo en equipo. El equilibrio se logra exigiendo a cada integrante cerrar su parte al 80% de detalle para permitir que la revisión colectiva pula las conexiones, unifique el estilo y valide que el resultado final responda coherentemente a la meta acordada.",
      },
    ],
  },
  {
    id: 3,
    name: "Roles, Responsabilidades y Confianza",
    shortName: "Roles y Confianza",
    description:
      "Estructura la distribución equilibrada de compromisos, evita duplicaciones y fomenta un clima de fiabilidad mutua.",
    academicJustification:
      "Se fundamenta en la etapa de normalización de Tuckman (1965), la teoría del aprendizaje social y autoeficacia de Albert Bandura (1977) y el diseño de roles de Hackman (2002).",
    authorsSummary: "Bruce W. Tuckman (1965), Albert Bandura (1977) y J. Richard Hackman (2002)",
    icon: UserCheck,
    color: "#059669",
    tint: "#ECFDF5",
    eyebrow: "Dimensión 3 · Trabajo en Equipo",
    intro:
      "Un equipo funciona mejor cuando cada integrante conoce su responsabilidad y entiende cómo su aporte contribuye al resultado general. Los roles no deben convertirse en etiquetas rígidas: pueden ajustarse según las capacidades y necesidades del proyecto. La confianza aparece cuando las personas cumplen sus compromisos, piden ayuda a tiempo y reconocen el valor del trabajo ajeno.",
    consists:
      "Clarificación de funciones, mecanismos de rendición de cuentas, flexibilidad adaptativa y gestión de la fiabilidad grupal.",
    acts:
      "Define roles operativos claros, aborda el desequilibrio de cargas de trabajo y gestiona contingencias críticas con transparencia.",
    principles: [
      {
        title: "Responsabilidad y Oportunidad",
        text: "Cumplir los compromisos asumidos y avisar con tiempo si surge algún obstáculo.",
      },
      {
        title: "Claridad y Flexibilidad de Roles",
        text: "Evitar vacíos y duplicaciones sin caer en rigideces que impidan apoyarse mutuamente.",
      },
      {
        title: "Cultura de Confianza",
        text: "Actuar con honestidad, coherencia y reconocimiento del esfuerzo y valor de los pares.",
      },
    ],
    references: [
      {
        authors: "Bruce W. Tuckman",
        year: "1965",
        contribution: "Etapa de Normalización (Norming): estabilización de roles, reglas claras y cohesión.",
        justification: "Explica cómo la superación de la ambigüedad de roles genera normas compartidas y confianza.",
        links: [],
      },
      {
        authors: "Albert Bandura",
        year: "1977",
        contribution: "Autoeficacia y modelamiento de conductas de fiabilidad y cumplimiento de acuerdos.",
        justification: "Fundamenta cómo el cumplimiento de los compromisos individuales fortalece la autoeficacia colectiva.",
        links: [],
      },
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta abierta",
        exerciseType: "Clarificación de Roles",
        suggestedMinutes: 10,
        topicTitle: "Importancia de las Responsabilidades Delimitadas",
        authorCitation: "Etapa de Normalización / Norming (Tuckman, 1965)",
        theoreticalContent:
          "Cuando los roles no están definidos, la energía del equipo se disipa en discusiones sobre quién hace qué. La claridad de funciones proporciona seguridad psicológica y optimiza el desempeño.",
        keyTakeaway:
          "La claridad de roles no limita la creatividad; al contrario, libera tiempo para colaborar con seguridad.",
        questionPrompt:
          "Explica por qué es importante que cada integrante conozca sus responsabilidades dentro de un equipo.",
        modelAnswer:
          "Es fundamental porque previene vacíos operativos (tareas que nadie hace) y duplicidades de esfuerzo (dos personas haciendo lo mismo sin saberlo). Además, otorga claridad sobre qué esperar de los demás, reduce la ansiedad laboral y fortalece la rendición de cuentas compartida, permitiendo que cada miembro se enfoque con seguridad en su contribución específica.",
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Escenario de la vida real",
        exerciseType: "Asignación de Responsabilidad Final",
        suggestedMinutes: 10,
        topicTitle: "El Documento sin Responsable Asignado",
        authorCitation: "Diseño de la Tarea en el Equipo (Hackman, 2002)",
        theoreticalContent:
          "La dilución de la responsabilidad ('efecto espectador') ocurre cuando una tarea clave se deja al azar asumiendo que alguien más la hará. Debe existir un responsable claro de integración.",
        keyTakeaway:
          "Si una responsabilidad es de todos sin un coordinador claro, en la práctica no es de nadie.",
        questionPrompt:
          "En una actividad grupal nadie sabe quién debe entregar el documento final. ¿Qué deberían hacer?",
        options: [
          "A) Suponer que alguien se encargará.",
          "B) Acordar un responsable de integración, definir aportes y establecer una fecha interna de revisión.",
          "C) Esperar a que el docente o jefe lo resuelva.",
          "D) Enviar varios documentos distintos.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Establecer explícitamente un encargado de consolidación y una fecha límite previa previene confusiones y garantiza un único producto de calidad.",
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Desafío práctico",
        exerciseType: "Gestión de la Equidad y Compromiso",
        suggestedMinutes: 12,
        topicTitle: "Sobrecarga de Trabajo por Incumplimiento de Pares",
        authorCitation: "Autoeficacia y Modelamiento Social (Bandura, 1977)",
        theoreticalContent:
          "Asumir en silencio las tareas de quien no cumple genera resentimiento y perpetúa la holgazanería social. Se requiere una conversación asertiva centrada en acuerdos y expectativas compartidas.",
        keyTakeaway:
          "La ayuda solidaria apoya temporalmente, pero no debe convertirse en encubrimiento sistemático del incumplimiento.",
        questionPrompt:
          "Una persona termina siempre realizando las tareas de un compañero que no cumple sus compromisos. ¿Cómo conversarías con ambos para aclarar responsabilidades y evitar que la carga siga siendo desigual?",
        modelAnswer:
          "Abordaría la situación en dos momentos constructivos:\n1. Con la persona sobrecargada: Reconocería su esfuerzo, pero le explicaría que suplir en silencio al compañero no le permite al otro aprender ni visibiliza el problema ante el equipo, generando desgaste personal.\n2. Con el compañero que incumple: Tendría un diálogo en privado indagando si enfrenta dificultades técnicas o de tiempo, recordándole el impacto directo de su retraso en el equipo y acordando compromisos específicos con entregas intermedias visibles para reequilibrar la carga.",
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Pregunta tipo Saber Pro",
        exerciseType: "Alineación de Competencias Interdisciplinarias",
        suggestedMinutes: 12,
        topicTitle: "Duplicidad de Esfuerzos y Funciones Críticas Desatendidas",
        authorCitation: "Estructuración Participativa de Roles (Tuckman & Hackman)",
        theoreticalContent:
          "La duplicidad de tareas evidencia falta de mapeo de competencias. La mejor respuesta institucional es una reunión de redistribución participativa con seguimiento visible.",
        keyTakeaway:
          "Reorganizar roles participativamente evita vacíos críticos y potencia el talento del equipo.",
        questionPrompt:
          "En un equipo interdisciplinario, dos integrantes realizan la misma tarea mientras otra función esencial queda sin responsable. ¿Cuál es la mejor intervención?",
        options: [
          "A) Reorganizar los roles con participación del equipo, asignando responsables y mecanismos de seguimiento.",
          "B) Mantener la distribución para evitar conversaciones incómodas.",
          "C) Asignar todas las tareas a la persona más rápida.",
          "D) Eliminar la función que quedó sin responsable.",
        ],
        correctOptionIndex: 0,
        explanation:
          "Reorganizar roles en consenso garantiza que ninguna función crítica quede descubierta y asegura el compromiso mutuo mediante el seguimiento transparente.",
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Evaluación y toma de decisiones",
        exerciseType: "Plan de Contingencia y Confianza",
        suggestedMinutes: 15,
        topicTitle: "Respuesta Asertiva ante la Pérdida Inesperada de un Aporte Crítico",
        authorCitation: "Resiliencia y Confianza en Equipos (Hackman, 2002)",
        theoreticalContent:
          "Cuando un integrante clave avisa oportunamente que no podrá cumplir, el equipo debe responder con empatía y un plan de contingencia que redistribuya tareas sin castigar la confianza.",
        keyTakeaway:
          "La confianza se fortalece cuando avisar a tiempo de una dificultad genera apoyo estructurado en lugar de represalias.",
        questionPrompt:
          "Un integrante con habilidades clave informa que no podrá cumplir una responsabilidad crítica en la fecha acordada. Diseña un plan de respuesta que proteja el resultado, distribuya la carga de manera justa y conserve la confianza dentro del equipo.",
        modelAnswer:
          "Fase 1: Reconocimiento y Contención: Agradecer la honestidad y el aviso oportuno del compañero, reforzando que avisar con anticipación es un acto de responsabilidad que permite actuar a tiempo.\nFase 2: Mapeo y Descomposición: Desglosar la tarea crítica en 3 micro-componentes: lo esencial, lo secundario y el formato final.\nFase 3: Redistribución Equitativa: Asignar el componente técnico esencial entre dos integrantes con habilidades afines, pidiéndole al compañero indispuesto que brinde insumos previos o notas guía en la medida de sus posibilidades.\nFase 4: Compensación Futura: Acordar que en la siguiente etapa del proyecto dicho integrante asumirá una mayor carga en la fase de revisión y presentación, preservando la equidad y la cohesión del grupo.",
      },
    ],
  },
  {
    id: 4,
    name: "Resolución de Conflictos y Toma de Decisiones",
    shortName: "Conflictos y Decisiones",
    description:
      "Aborda los desacuerdos como oportunidades de mejora y establece criterios objetivos para decidir sin deteriorar las relaciones.",
    academicJustification:
      "Fundamenta la gestión del conflicto constructivo vs. destructivo de Morton Deutsch (1973), la dinámica de grupos de Kurt Lewin (1947) y la etapa Storming de Bruce Tuckman (1965).",
    authorsSummary: "Morton Deutsch (1973), Kurt Lewin (1947) y Bruce W. Tuckman (1965)",
    icon: Target,
    color: "#059669",
    tint: "#ECFDF5",
    eyebrow: "Dimensión 4 · Trabajo en Equipo",
    intro:
      "Las diferencias son normales en cualquier grupo: las personas tienen experiencias, prioridades y formas distintas de resolver problemas. El conflicto no tiene que convertirse en una pelea. Si se aborda con respeto, escucha y criterios claros, puede ayudar a descubrir riesgos y mejorar las decisiones. El objetivo es centrarse en el problema y no atacar a las personas.",
    consists:
      "Separación entre personas y problemas, análisis de propuestas con criterios objetivos y procedimientos para decidir bajo división grupal.",
    acts:
      "Normaliza el desacuerdo constructivo, modera tensiones interpersonales y toma decisiones justificadas protegiendo la cohesión.",
    principles: [
      {
        title: "Separar Personas de Problemas",
        text: "Atacar el reto técnico y los hechos concretos sin calificar negativamente a los interlocutores.",
      },
      {
        title: "Criterios Objetivos",
        text: "Evaluar alternativas frente a los objetivos, recursos y plazos del proyecto, no por jerarquía o capricho.",
      },
      {
        title: "Decisión Responsable y Comprometida",
        text: "Procedimientos claros para consensuar o definir quién decide cuando el tiempo apremia.",
      },
    ],
    references: [
      {
        authors: "Morton Deutsch",
        year: "1973",
        contribution: "La resolución del conflicto: procesos constructivos y destructivos en la interacción grupal.",
        justification: "Demuestra que el conflicto canalizado mediante cooperación enriquece la toma de decisiones.",
        links: [],
      },
      {
        authors: "Bruce W. Tuckman",
        year: "1965",
        contribution: "Etapa de Conflicto (Storming): confrontación de ideas y renegociación de dinámicas de poder.",
        justification: "Ayuda a comprender que los desacuerdos son un síntoma natural del crecimiento del equipo.",
        links: [],
      },
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta abierta",
        exerciseType: "Comprensión del Conflicto",
        suggestedMinutes: 10,
        topicTitle: "El Valor del Desacuerdo Constructivo",
        authorCitation: "Resolución Constructiva de Conflictos (Morton Deutsch, 1973)",
        theoreticalContent:
          "La ausencia total de desacuerdos puede ser síntoma de pensamiento grupal (groupthink) o apatía. El desacuerdo enriquecedor revela puntos ciegos y estimula mejores alternativas.",
        keyTakeaway:
          "Disentir no es estar contra el equipo; es aportar una perspectiva distinta para fortalecer la decisión común.",
        questionPrompt:
          "¿Por qué un desacuerdo no significa necesariamente que un equipo esté trabajando mal?",
        modelAnswer:
          "Porque un desacuerdo evidencia que los integrantes están comprometidos con el resultado y aportan perspectivas diversas. Si se tramita con respeto, el desacuerdo permite identificar riesgos no previstos, evaluar alternativas más creativas y robustecer la decisión final, evitando el conformismo acrítico o pensamiento de grupo (groupthink).",
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Escenario de la vida real",
        exerciseType: "Criterios de Evaluación",
        suggestedMinutes: 10,
        topicTitle: "Comparación de Propuestas Divergentes",
        authorCitation: "Dinámica de Grupos y Toma de Decisiones (Kurt Lewin, 1947)",
        theoreticalContent:
          "Ante ideas encontradas, la votación precipitada polariza al grupo. Lo adecuado es contrastar ambas alternativas contra los objetivos del proyecto y los recursos disponibles.",
        keyTakeaway:
          "Antes de votar o imponer, se deben contrastar las ideas con los criterios objetivos del proyecto.",
        questionPrompt:
          "Dos integrantes proponen ideas diferentes para resolver una tarea. ¿Qué deberían hacer primero?",
        options: [
          "A) Votar sin escuchar las razones.",
          "B) Comparar las propuestas con los objetivos, recursos y tiempos del proyecto.",
          "C) Elegir la idea de quien tenga más autoridad, sin analizarla.",
          "D) Dividir el equipo en dos grupos que compitan.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Analizar las alternativas a la luz de los objetivos y restricciones del proyecto despersonaliza el debate y guía hacia la mejor solución técnica.",
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Desafío práctico",
        exerciseType: "Mediación en Tensión Grupal",
        suggestedMinutes: 12,
        topicTitle: "Reencauzamiento del Diálogo ante Ataques Personales",
        authorCitation: "Manejo del Clima Grupal (Deutsch, 1973)",
        theoreticalContent:
          "Cuando el debate se torna emocional y personal, se pierde la escucha. La intervención eficaz requiere pausar, recordar el objetivo común y reenfocar en el problema objetivo.",
        keyTakeaway:
          "El mediador asertivo desactiva los ataques personales y devuelve el foco al problema que el equipo debe resolver.",
        questionPrompt:
          "Durante una reunión, el desacuerdo se vuelve personal y los participantes dejan de escuchar. Describe cómo intervendrías para recuperar el diálogo y volver al problema que necesitan resolver.",
        modelAnswer:
          "Paso 1: Intervención de contención emocional: 'Hagamos un alto de dos minutos. Estamos cayendo en señalamientos personales que nos alejan del objetivo y nos desgastan como grupo'.\nPaso 2: Reenfoque objetivo: 'El problema no es quién tiene la culpa o quién habló primero; el problema real que debemos resolver es cómo cumplir la entrega técnica del viernes. Anotemos en la pizarra los datos objetivos del problema y analicemos qué solución beneficia más al proyecto'.",
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Pregunta tipo Saber Pro",
        exerciseType: "Decisión bajo Urgencia sin Consenso",
        suggestedMinutes: 12,
        topicTitle: "Mecanismos Responsables de Decisión",
        authorCitation: "Efectividad Decisional (Hackman & Lewin)",
        theoreticalContent:
          "Cuando hay una urgencia y el consenso es inviable, aplazar o votar al azar es irresponsable. La regla consiste en apelar a los criterios acordados previamente y activar el rol decisor asignado.",
        keyTakeaway:
          "En urgencias, se recurre a criterios previos y a la responsabilidad del rol decisor asignado.",
        questionPrompt:
          "Un equipo debe tomar una decisión urgente y no logra consenso. ¿Cuál procedimiento es más responsable?",
        options: [
          "A) Posponer indefinidamente la decisión.",
          "B) Recordar el objetivo, comparar opciones con criterios previamente acordados y definir quién tiene la responsabilidad final de decidir.",
          "C) Imponer una opción sin explicar las razones.",
          "D) Elegir al azar para terminar la discusión.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Fijar un procedimiento legítimo fundamentado en criterios objetivos y autoridad acordada permite avanzar sin parálisis ni arbitrariedades.",
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Evaluación y toma de decisiones",
        exerciseType: "Preservación del Compromiso tras una Decisión Dividida",
        suggestedMinutes: 15,
        topicTitle: "Decisión Dividida y Alineación Colectiva Post-Acuerdo",
        authorCitation: "Construcción de Acuerdos Duraderos (Deutsch, 1973)",
        theoreticalContent:
          "Tras una decisión que no contó con unanimidad, quienes apoyaban la opción descartada pueden desmotivarse. El líder debe comunicar con transparencia el porqué de la elección e integrar sus aportes en la ejecución.",
        keyTakeaway:
          "Una buena decisión cuida tanto la solución técnica como el compromiso emocional de quienes defendían otra alternativa.",
        questionPrompt:
          "El equipo está dividido frente a una decisión que puede afectar la calidad del proyecto. Explica qué información recogerías, qué criterios usarías y cómo comunicarías la decisión final para que quienes tenían otra postura sigan comprometidos.",
        modelAnswer:
          "Recolección: Datos concretos de viabilidad técnica, tiempos requeridos por cada opción, impacto en el usuario y riesgos asociados.\nCriterios de valoración: Alineación con los requisitos principales de la entrega, balance costo-beneficio temporal y grado de respaldo que el equipo puede sostener.\nComunicación: Explicar con transparencia cómo se evaluaron ambas posturas, reconociendo explícitamente el valor de los argumentos de la opción no elegida y demostrando por qué la opción seleccionada mitiga mayores riesgos. Finalmente, incorporar elementos de la otra propuesta en la fase de implementación para que todos se sientan coautores del plan.",
      },
    ],
  },
  {
    id: 5,
    name: "Apoyo Mutuo, Inclusión y Aprendizaje Colectivo",
    shortName: "Inclusión y Aprendizaje",
    description:
      "Reconoce la diversidad de ritmos y saberes, fomenta la ayuda solidaria y consolida la mejora continua del equipo.",
    academicJustification:
      "Se apoya en la teoría del aprendizaje social y modelamiento de Albert Bandura (1977), la investigación-acción de Kurt Lewin (1947) y la etapa de Desempeño (Performing) de Tuckman (1965).",
    authorsSummary: "Albert Bandura (1977), Kurt Lewin (1947) y Bruce W. Tuckman (1965)",
    icon: HeartHandshake,
    color: "#059669",
    tint: "#ECFDF5",
    eyebrow: "Dimensión 5 · Trabajo en Equipo",
    intro:
      "El trabajo en equipo requiere reconocer que las personas tienen conocimientos, ritmos y experiencias diferentes. Un equipo sólido crea condiciones para que todos puedan aportar, ofrece apoyo cuando alguien lo necesita y aprende de sus errores. La inclusión no significa que todos piensen igual, sino que las diferencias se traten con respeto y se conviertan en oportunidades para mejorar.",
    consists:
      "Estrategias de andamiaje entre pares, diseño de espacios de participación inclusiva y sesiones de lecciones aprendidas (retrospectivas).",
    acts:
      "Brinda apoyo pedagógico sin paternalismo, integra a integrantes con menor participación y lidera retrospectivas de mejora continua.",
    principles: [
      {
        title: "Apoyo Mutuo sin Paternalismo",
        text: "Ofrecer ayuda y acompañamiento formativo sin asumir automáticamente el trabajo de la otra persona.",
      },
      {
        title: "Inclusión Real de Voces",
        text: "Generar canales y dinámicas donde los integrantes introvertidos o nuevos puedan aportar su valor.",
      },
      {
        title: "Cultura de Aprendizaje Colectivo",
        text: "Revisar periódicamente los resultados para celebrar logros y transformar errores en protocolos de mejora.",
      },
    ],
    references: [
      {
        authors: "Albert Bandura",
        year: "1977",
        contribution: "Aprendizaje social mediante observación, modelamiento y retroalimentación entre pares.",
        justification: "Base para entender el andamiaje solidario sin sustituir la autoeficacia de los integrantes.",
        links: [],
      },
      {
        authors: "Kurt Lewin",
        year: "1947",
        contribution: "Investigación-Acción: ciclos de planificación, acción, observación y reflexión colectiva.",
        justification: "Fundamenta la práctica de retrospectivas periódicas para el aprendizaje continuo del equipo.",
        links: [],
      },
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta abierta",
        exerciseType: "Solidaridad Formativa",
        suggestedMinutes: 10,
        topicTitle: "Apoyo Genuino vs. Asumir el Trabajo del Otro",
        authorCitation: "Aprendizaje Social y Andamiaje (Albert Bandura, 1977)",
        theoreticalContent:
          "Hacerle el trabajo a un compañero no es apoyarlo; fomenta dependencia y frustración. El verdadero apoyo enseña, acompaña y fortalece la autoeficacia del par.",
        keyTakeaway:
          "Apoyar es brindar herramientas para que el compañero pueda lograrlo, no sustituir su esfuerzo.",
        questionPrompt:
          "Menciona dos maneras en que puedes apoyar a un compañero sin hacer todo el trabajo por él.",
        modelAnswer:
          "Manera 1 (Modelamiento y explicación guiada): Explicarle el procedimiento paso a paso mediante un ejemplo práctico similar, resolviendo sus dudas conceptuales y dejándole espacio para que ejecute su tarea real de forma autónoma.\nManera 2 (Revisión y retroalimentación constructiva): Revisar juntos un borrador preliminar de su entrega, señalando aspectos fuertes y haciéndole preguntas clave para que él mismo descubra y corrija los puntos de mejora.",
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Escenario de la vida real",
        exerciseType: "Inducción y Acompañamiento a Nuevos Miembros",
        suggestedMinutes: 10,
        topicTitle: "Integración de un Miembro Nuevo en Fecha Límite",
        authorCitation: "Clima de Acogida e Integración (Lewin, 1947)",
        theoreticalContent:
          "Excluir o criticar a un nuevo integrante destruye su motivación y priva al equipo de un recurso valioso. Se debe asignar una tarea adaptada con acompañamiento y revisión.",
        keyTakeaway:
          "Integrar a un nuevo miembro con tareas adecuadas y acompañamiento acelera su aprendizaje y protege el resultado.",
        questionPrompt:
          "Un integrante nuevo no conoce el procedimiento y el equipo tiene una entrega próxima. ¿Qué respuesta favorece el aprendizaje y el resultado?",
        options: [
          "A) Excluirlo de las tareas importantes.",
          "B) Explicarle el proceso, asignarle una tarea adecuada y ofrecer acompañamiento con una revisión.",
          "C) Criticarlo frente a todos.",
          "D) Hacer su parte sin explicarle nada.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Explicar el procedimiento, delegar una tarea acorde a su nivel actual y brindar acompañamiento asegura la entrega y capacita al integrante para futuros retos.",
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Desafío práctico",
        exerciseType: "Equilibrio Participativo",
        suggestedMinutes: 12,
        topicTitle: "Ampliación de la Participación de Miembros Silenciosos",
        authorCitation: "Dinámica de Participación Inclusiva (Tuckman, 1965)",
        theoreticalContent:
          "Si unos pocos dominan la palabra, el equipo desaprovecha perspectivas valiosas. Se necesitan dinámicas estructuradas (como rondas de opinión, aportes escritos o preguntas directas amables).",
        keyTakeaway:
          "La inclusión activa requiere técnicas deliberadas para que todos los miembros aporten sus fortalezas.",
        questionPrompt:
          "En tu grupo, algunas personas participan mucho y otras casi no intervienen. Propón dos estrategias para ampliar la participación y aprovechar las fortalezas de todos.",
        modelAnswer:
          "Estrategia 1 (Ronda de aportes estructurada / Round Robin): Establecer una dinámica en la que cada integrante dispone de un minuto sin interrupciones para compartir su perspectiva sobre el tema antes de abrir el debate general.\nEstrategia 2 (Aportes asíncronos previos): Crear un documento compartido o pizarra digital donde cada miembro escribe una idea o sugerencia antes de la reunión, permitiendo que quienes tienen un estilo más reflexivo aporten en igualdad de condiciones.",
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Pregunta tipo Saber Pro",
        exerciseType: "Retrospectiva y Mejora Continua",
        suggestedMinutes: 12,
        topicTitle: "Tratamiento de Errores Sistémicos tras una Entrega",
        authorCitation: "Investigación-Acción y Aprendizaje Organizacional (Kurt Lewin, 1947)",
        theoreticalContent:
          "Buscar culpables individuales perpetúa el error. El aprendizaje colectivo se logra revisando el proceso completo, encontrando causas raíz y acordando cambios en los protocolos.",
        keyTakeaway:
          "Aprender en equipo significa analizar causas en el proceso colectivo, no buscar culpables individuales.",
        questionPrompt:
          "Después de una entrega, el equipo identifica errores repetidos. ¿Qué práctica fortalece el aprendizaje colectivo?",
        options: [
          "A) Buscar a una persona para responsabilizarla de todo.",
          "B) Realizar una revisión conjunta del proceso, identificar causas y acordar cambios concretos.",
          "C) Evitar hablar del resultado para no generar incomodidad.",
          "D) Repetir el procedimiento sin modificaciones.",
        ],
        correctOptionIndex: 1,
        explanation:
          "Analizar conjuntamente las causas de los fallos y acordar mejoras operativas transforma los errores en aprendizaje y optimiza entregas futuras.",
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Evaluación y toma de decisiones",
        exerciseType: "Recuperación de la Cohesión y Prevención de Deserción",
        suggestedMinutes: 15,
        topicTitle: "Reintegración de un Miembro Excluido y Revisión de Normas",
        authorCitation: "Desempeño y Cohesión de Alto Nivel (Tuckman & Bandura)",
        theoreticalContent:
          "Cuando alguien se siente invisible hasta el punto de querer abandonar, el problema no es individual sino de la dinámica del equipo. Se requiere validar su malestar, abrir un canal seguro de escucha y redefinir las formas de trabajo grupal.",
        keyTakeaway:
          "Atender a tiempo el sentimiento de exclusión previene la ruptura del equipo y eleva la madurez de la colaboración.",
        questionPrompt:
          "Un integrante se siente excluido porque sus propuestas no han sido consideradas y amenaza con retirarse del proyecto. Diseña una intervención que atienda la situación, recupere su participación y permita al equipo revisar sus formas de colaboración.",
        modelAnswer:
          "Acción 1 (Reunión individual de escucha activa): Conversar en privado con el integrante, reconociendo su malestar sin invalidarlo ('Lamento que te hayas sentido así; valoramos tu presencia y tus ideas son importantes para el proyecto'). Identificar propuestas específicas que sintió ignoradas.\nAcción 2 (Reunión de equipo para ajuste de acuerdos): Convocar una sesión de alineación colectiva sin exhibir culpas, recordando que todo el equipo debe tener voz. Establecer una regla explícita de evaluar las ideas por su mérito técnico.\nAcción 3 (Rol protagonista): Asignarle el liderazgo de un eje o componente donde sus propuestas sean el motor principal, acompañándolo para asegurar que se sienta respaldado y plenamente reintegrado.",
      },
    ],
  },
];

export const teamworkTheoreticalFoundations: AcademicReference[] = [
  {
    authors: "Bruce W. Tuckman",
    year: "1965",
    contribution:
      "Propuso el modelo clásico de desarrollo de grupos con cuatro etapas fundamentales: Formación (Forming), Conflicto (Storming), Normalización (Norming) y Desempeño (Performing). El modelo explica cómo los grupos atraviesan necesariamente tensiones y ajustes antes de alcanzar una colaboración coordinada y madura.",
    justification:
      "Sustenta el abordaje de la cooperación, la delimitación de normas, la confianza y la gestión constructiva de desacuerdos, permitiendo interpretar los retos grupales como fases naturales del desarrollo del equipo.",
    links: [
      {
        label: "APA PsycNet: Developmental Sequence in Small Groups (Tuckman, 1965)",
        url: "https://psycnet.apa.org/record/1965-12187-001",
      },
      {
        label: "PubMed: Developmental sequence in small groups",
        url: "https://pubmed.ncbi.nlm.nih.gov/14314073/",
      },
    ],
  },
  {
    authors: "Kurt Lewin",
    year: "1947",
    contribution:
      "Padre de la psicología social moderna y pionero en la Dinámica de Grupos. Destacó cómo las fuerzas grupales, las normas compartidas y las interacciones influyen decisivamente en la conducta individual. Formuló la metodología de Investigación-Acción para diagnosticar y transformar prácticas colectivas.",
    justification:
      "Ofrece el marco conceptual para analizar cómo se construyen acuerdos, cómo influyen las relaciones interpersonales y por qué la participación democrática es indispensable para transformar la efectividad de un grupo.",
    links: [
      {
        label: "Human Relations: Frontiers in Group Dynamics (Lewin, 1947)",
        url: "https://journals.sagepub.com/doi/10.1177/001872674700100103",
      },
    ],
  },
  {
    authors: "Albert Bandura",
    year: "1977",
    contribution:
      "Teoría del Aprendizaje Social y concepto de Autoeficacia. Demostró que las personas aprenden observando modelos de conducta en su entorno, interpretando consecuencias y desarrollando expectativas sobre su propia capacidad para actuar y colaborar eficazmente.",
    justification:
      "Fundamenta el valor del acompañamiento entre pares, el modelamiento de conductas colaborativas sin paternalismo y el fortalecimiento de la confianza colectiva a través de la experiencia compartida.",
    links: [
      {
        label: "Prentice-Hall: Social Learning Theory (Bandura, 1977)",
        url: "https://www.scirp.org/reference/referencespapers?referenceid=1796123",
      },
    ],
  },
  {
    authors: "Morton Deutsch",
    year: "1949 / 1973",
    contribution:
      "Teoría de la Cooperación y Competencia y principios para la resolución constructiva de conflictos. Demostró que en situaciones cooperativas los participantes perciben interdependencia positiva (el logro individual está ligado al logro colectivo), mientras que la competencia genera rivalidades improductivas.",
    justification:
      "Fundamenta la construcción de metas compartidas, la interdependencia positiva y la resolución de desacuerdos centrándose en el problema y no en atacar a las personas.",
    links: [
      {
        label: "Human Relations: A Theory of Co-operation and Competition (Deutsch, 1949)",
        url: "https://journals.sagepub.com/doi/10.1177/001872674900200204",
      },
      {
        label: "Yale University Press: The Resolution of Conflict (Deutsch, 1973)",
        url: "https://yalebooks.yale.edu/book/9780300021868/the-resolution-of-conflict/",
      },
    ],
  },
  {
    authors: "J. Richard Hackman",
    year: "2002",
    contribution:
      "Investigación seminal sobre diseño y efectividad de equipos (Leading Teams). Estableció que la excelencia de un equipo no surge de reunir personas talentosas, sino de proveer condiciones habilitadoras: dirección clara, estructura de trabajo facilitadora, contexto de apoyo y acompañamiento experto.",
    justification:
      "Respalda la importancia de estructurar objetivos comunes, roles transparentes, recursos suficientes y mecanismos periódicos de sincronización en proyectos complejos.",
    links: [
      {
        label: "Harvard Business Review: Leading Teams - Setting the Stage for Great Performances",
        url: "https://hbr.org/2002/07/leading-teams-setting-the-stage-for-great-performances",
      },
    ],
  },
];
