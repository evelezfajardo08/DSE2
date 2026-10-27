import { MessageSquare, Users, BookOpen, UserCheck, Share2 } from "lucide-react";
import { LeadershipModule, TopicLevel } from "./leadershipData";

export const communicationModules: LeadershipModule[] = [
  {
    id: 1,
    name: "Fundamentos Teóricos de la Comunicación Educativa",
    shortName: "Fundamentos Teóricos",
    description: "Aborda los enfoques histórico-cultural, cognitivo-instruccional y dialógico en la comunicación pedagógica.",
    academicJustification: "Fundamenta el papel del lenguaje como herramienta mediadora del pensamiento y la interacción constructiva en el aula según Vygotsky, Bruner y Freire.",
    authorsSummary: "Lev Vygotsky (1934), Jerome Bruner (1966) y Paulo Freire (1970)",
    icon: BookOpen,
    color: "#2563EB",
    tint: "#EFF6FF",
    eyebrow: "Eje Temático 1 · Comunicación Educativa",
    intro: "El lenguaje no es un simple transmisor de datos, sino el instrumento psicológico primordial que estructura el pensamiento y permite la co-construcción social de significados.",
    consists: "Revisión teórica y aplicación práctica de la mediación semiótica y el diálogo liberador en situaciones educativas reales.",
    acts: "Comprende la interacción dialógica, contrasta modelos pedagógicos y analiza fallas estructurales en la enseñanza memorística.",
    principles: [
      { title: "Mediación Semiótica", text: "El lenguaje opera como herramienta de andamiaje cognitivo entre docentes y pares." },
      { title: "Sentido Dialógico", text: "Superación del modelo bancario hacia el diálogo liberador y participativo." }
    ],
    references: [
      {
        authors: "Lev S. Vygotsky",
        year: "1934 / 1978",
        contribution: "Teoría Histórico-Cultural y Zona de Desarrollo Próximo (ZDP) mediada por el lenguaje.",
        justification: "Base central para comprender cómo la interacción comunicativa transforma las funciones psicológicas superiores.",
        links: []
      },
      {
        authors: "Paulo Freire",
        year: "1970",
        contribution: "Pedagogía del Oprimido y crítica radical a la educación bancaria transmisiva.",
        justification: "Fundamenta la comunicación horizontal y dialógica como principio de emancipación educativa.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta Abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "El Lenguaje como Mediador del Pensamiento (Vygotsky)",
        authorCitation: "Lev Vygotsky (1934) — Pensamiento y Lenguaje",
        theoreticalContent: "En el enfoque histórico-cultural, el lenguaje cumple una doble función: primero como herramienta interpersonal (social) y posteriormente como instrumento intrapersonal de autorregulación del pensamiento. En el aula, el docente actúa como mediador que propicia la internalización de conceptos a través del andamiaje comunicativo.",
        keyTakeaway: "La palabra no refleja únicamente la realidad, sino que estructura la conciencia y el aprendizaje activo.",
        questionPrompt: "Explica con tus propias palabras qué papel cumple el lenguaje como herramienta mediadora del pensamiento dentro de la interacción en el aula, según el enfoque histórico-cultural de Vygotsky."
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Desafío Conceptual",
        exerciseType: "Esquema y Contraste",
        suggestedMinutes: 12,
        topicTitle: "Modelo Unidireccional vs. Sentido Dialógico-Liberador",
        authorCitation: "Paulo Freire (1970) — Pedagogía del Oprimido",
        theoreticalContent: "El modelo lineal (Shannon y Weaver) reduce la comunicación a emisión, canal y recepción pasiva, reproduciendo la 'educación bancaria'. En contraste, el modelo dialógico freireano concibe a los interlocutores como sujetos cognoscentes que dialogan mediatizados por el mundo, co-construyendo conocimiento crítico.",
        keyTakeaway: "Dialogar no es transferir contenidos, sino problematizar la realidad conjuntamente.",
        questionPrompt: "Diseña un esquema gráfico rápido o un mapa conceptual esquemático de 3 pasos donde contrastes cómo un modelo de comunicación unidireccional (emisor-receptor) difiere de un modelo basado en el sentido dialógico-liberador."
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Pregunta Cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Traducción de Saberes Complejos en la Práctica Entre Pares",
        authorCitation: "Jerome Bruner (1966) — Hacia una Teoría de la Instrucción",
        theoreticalContent: "Cuando un estudiante recurre a analogías cotidianas para explicar un concepto abstracto a un compañero, aplica el principio de representación enactiva e icónica de Bruner y activa la Zona de Desarrollo Próximo de Vygotsky a través del andamiaje entre pares (peer tutoring).",
        keyTakeaway: "Hacer comprensible lo abstracto mediante lo cotidiano es la esencia de la mediación pedagógica espontánea.",
        questionPrompt: "Cuando explicas un tema complejo a un compañero de estudio y utilizas ejemplos de su día a día para que lo comprenda mejor, ¿cuál de los pilares teóricos clásicos estás poniendo en práctica de forma empírica y por qué?"
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Caso de la Vida Real",
        exerciseType: "Análisis Organizacional y Pedagógico",
        suggestedMinutes: 15,
        topicTitle: "El Monólogo en el Aula de Ciencias",
        authorCitation: "Jerome Bruner y Lev Vygotsky",
        theoreticalContent: "La clase magistral expositiva no permite la estructuración de saberes previos ni la negociación semiótica. Si no hay espacio para la interrogación o el debate, se interrumpe la función epistémica del lenguaje.",
        keyTakeaway: "Sin diálogo no hay desequilibrio cognitivo ni acomodación significativa de los saberes.",
        scenarioTitle: "Clase de ciencias sin interacción",
        scenarioContext: "En una clase de ciencias, el profesor se limita a dictar conceptos abstractos esperando que los alumnos los memoricen sin permitir preguntas ni debates.",
        questionPrompt: "Desde la teoría de la instrucción de Bruner y el enfoque de Vygotsky, ¿qué fallas estructurales presenta este proceso comunicativo respecto a la construcción real del conocimiento?"
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Fundamentos de Mediación",
        authorCitation: "Saber Pro — Competencias Pedagógicas y Comunicativas",
        theoreticalContent: "Pregunta de juicio profesional con clave explicativa basada en los estándares nacionales de competencias docentes.",
        keyTakeaway: "La retroalimentación continua y los saberes previos son los núcleos de la mediación semiótica constructivista.",
        questionPrompt: "Un docente busca fundamentar su práctica pedagógica fomentando la retroalimentación constante y la estructuración deliberada de los saberes previos de sus estudiantes para construir conocimiento de manera colaborativa. Esta aproximación teórica se alinea fundamentalmente con:",
        options: [
          "A) El modelo lineal de transmisión de información enfocado exclusivamente en la claridad del canal físico.",
          "B) El enfoque histórico-cultural y la teoría de la instrucción orientados a la mediación semiótica y el diálogo.",
          "C) La teoría conductista clásica basada en estímulos y respuestas automáticas sin mediación del lenguaje.",
          "D) Los modelos de educación bancaria donde el estudiante adopta un rol netamente pasivo y oyente."
        ],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 2,
    name: "Evolución de los Modelos de Comunicación",
    shortName: "Evolución de Modelos",
    description: "Transición de la perspectiva instrumental y lineal hacia lo relacional, contextual y posmasivo.",
    academicJustification: "Analiza el cambio paradigmático desde las teorías cibernéticas lineales hacia los modelos de comunicación horizontal y redes colaborativas.",
    authorsSummary: "Shannon & Weaver (1949), Roman Jakobson (1960), Mario Kaplún (1998)",
    icon: Share2,
    color: "#0891B2",
    tint: "#ECFEFF",
    eyebrow: "Eje Temático 2 · Comunicación Educativa",
    intro: "Comprender la evolución histórica de los modelos comunicativos permite superar la ilusión de que comunicar es simplemente emitir paquetes de información.",
    consists: "Comparación crítica entre modelos tradicionales transmisivos y entramados comunicacionales participativos contemporáneos.",
    acts: "Diferencia la comunicación instrumental de la relacional y rediseña prácticas en canales virtuales.",
    principles: [
      { title: "Dimensión Relacional", text: "La comunicación es un encuentro interpersonal y social, no un canal unidireccional." },
      { title: "Comunicación Posmasiva", text: "Apertura a la interlocución horizontal en entornos hipermediales y colaborativos." }
    ],
    references: [
      {
        authors: "Mario Kaplún",
        year: "1998",
        contribution: "Una Pedagogía de la Comunicación: modelos que ponen el énfasis en contenidos, efectos y procesos.",
        justification: "Clave para fundamentar la comunicación orientada al proceso y la co-construcción participativa.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta Abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "Comprensión Instrumental vs. Concepción Relacional",
        authorCitation: "Mario Kaplún (1998) — Una Pedagogía de la Comunicación",
        theoreticalContent: "La visión instrumental reduce la comunicación a medios técnicos y transmisión eficaz de datos. La concepción relacional y contextual la entiende como un tejido social donde los sujetos construyen identidades, negocian significados y transforman su entorno.",
        keyTakeaway: "La técnica es solo soporte; lo sustantivo es la interacción humana situada.",
        questionPrompt: "¿Cuál es la diferencia fundamental entre una comprensión instrumental de la comunicación educativa y una concepción relacional y contextual?"
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Desafío Conceptual",
        exerciseType: "Transformación Dialógica",
        suggestedMinutes: 12,
        topicTitle: "Del Modelo Vertical a la Comunicación Posmasiva",
        authorCitation: "Jesús Martín-Barbero (2002)",
        theoreticalContent: "En los modelos tradicionales el emisor ostenta el monopolio del mensaje. En los entornos posmasivos, el receptor se convierte en 'emirec' (emisor/receptor simultáneo), interviniendo y aportando en tiempo real.",
        keyTakeaway: "La democratización comunicativa requiere que el educador renuncie a la primacía del monólogo.",
        questionPrompt: "Redacta un breve diálogo de un párrafo entre un docente bajo un modelo tradicional y un estudiante, y reescríbelo transformándolo hacia un modelo de comunicación posmasiva y participativa."
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Pregunta Cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Redes Comunitarias e Instantaneidad en el Aprendizaje",
        authorCitation: "Manuel Castells (2009) — Comunicación y Poder",
        theoreticalContent: "La irrupción de canales virtuales (WhatsApp, Discord, plataformas colaborativas) difumina la frontera entre el espacio académico formal y el intercambio informal, demandando nuevos pactos de inmediatez y límites.",
        keyTakeaway: "Las herramientas móviles transforman la temporalidad y accesibilidad pedagógica.",
        questionPrompt: "¿De qué manera el uso de grupos de WhatsApp o canales comunitarios virtuales en tus clases ha cambiado la forma tradicional en que te comunicas con tus profesores en comparación con el siglo pasado?"
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Caso de la Vida Real",
        exerciseType: "Análisis Organizacional y Pedagógico",
        suggestedMinutes: 15,
        topicTitle: "El Repositorio Estático de PDFs",
        authorCitation: "Mario Kaplún y Jesús Martín-Barbero",
        theoreticalContent: "Digitalizar documentos no equivale a transformar la pedagogía comunicativa. Una plataforma sin retroalimentación replica el modelo transmisivo más rudimentario bajo ropaje informático.",
        keyTakeaway: "La tecnología sin diálogo pedagógico solo automatiza la pasividad.",
        scenarioTitle: "Plataforma de autoestudio unidireccional",
        scenarioContext: "Una institución educativa implementa una plataforma virtual donde los estudiantes solo pueden descargar documentos en PDF estáticos, sin foros de discusión, buzones interactivos ni retroalimentación horizontal.",
        questionPrompt: "Analiza el caso evaluando el atraso del modelo comunicativo frente a las tendencias actuales de educomunicación."
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Complejidad Comunicacional",
        authorCitation: "Saber Pro — Modelos Pedagógicos y Comunicación",
        theoreticalContent: "Los modelos contemporáneos conciben la comunicación como una ecología compleja donde los significados se co-construyen socialmente.",
        keyTakeaway: "La comunicación pedagógica es negociación de sentido, no transferencia estática.",
        questionPrompt: "La evolución de los modelos de comunicación educativa ha transitado desde la transmisión eficaz de contenidos hacia entramados comunicacionales complejos. Esto implica principalmente que:",
        options: [
          "A) Los medios tecnológicos reemplazan por completo la necesidad de interacción humana en el aula.",
          "B) Se prioriza la memorización masiva de datos estructurados por un emisor central.",
          "C) Se pasa de un esquema unidireccional a un proceso donde se negocian significados y contextos sociales.",
          "D) La comunicación educativa pierde rigor metodológico al volverse informal."
        ],
        correctOptionIndex: 2
      }
    ]
  },
  {
    id: 3,
    name: "Mediación Pedagógica",
    shortName: "Mediación Pedagógica",
    description: "El puente metodológico y afectivo entre docente, estudiante, saberes y recursos didácticos.",
    academicJustification: "Explora cómo el tratamiento temático, pedagógico y formal transforma los contenidos en experiencias dialógicas significativas.",
    authorsSummary: "Francisco Gutiérrez Pérez y Daniel Prieto Castillo (1999), Reuven Feuerstein (1980)",
    icon: Users,
    color: "#7C3AED",
    tint: "#F5F3FF",
    eyebrow: "Eje Temático 3 · Comunicación Educativa",
    intro: "La mediación pedagógica es el arte de acompañar y promover el aprendizaje haciendo que los recursos didácticos interroguen, motiven y dialoguen con la experiencia del aprendiz.",
    consists: "Metodologías de mediación formal y temática para humanizar y dar sentido al material formativo.",
    acts: "Diseña recursos dialogantes, analiza factores de desmotivación y transforma guías instruccionales.",
    principles: [
      { title: "Tratamiento Dialógico", text: "El recurso didáctico no expone doctrina; propone preguntas e invita a pensar." },
      { title: "Vínculo Afectivo-Cognitivo", text: "No hay aprendizaje duradero sin resonancia emocional e implicación subjetiva." }
    ],
    references: [
      {
        authors: "Francisco Gutiérrez y Daniel Prieto Castillo",
        year: "1999",
        contribution: "La Mediación Pedagógica: tratamiento del contenido, de la forma y del aprendizaje.",
        justification: "Referencia fundamental en Iberoamérica sobre el diseño de mediaciones educativas centradas en el diálogo.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta Abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "Concepto de Mediación Pedagógica",
        authorCitation: "Gutiérrez & Prieto Castillo (1999)",
        theoreticalContent: "Llamamos pedagógica a toda mediación capaz de promover y acompañar el aprendizaje. No reside en el contenido bruto, sino en el tratamiento que permite al estudiante apropiarse del saber con sentido propio.",
        keyTakeaway: "Mediar es tender puentes comprensivos entre la cultura y la subjetividad del estudiante.",
        questionPrompt: "Define qué se entiende por mediación pedagógica en el marco del proceso de enseñanza-aprendizaje contemporáneo."
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Desafío Conceptual",
        exerciseType: "Diseño Didáctico",
        suggestedMinutes: 12,
        topicTitle: "El Material Didáctico que Conversa",
        authorCitation: "Daniel Prieto Castillo (1999)",
        theoreticalContent: "Un texto dialogante interpela al lector, incorpora preguntas metacognitivas, propone analogías vivenciales y deja márgenes para la formulación de hipótesis personales.",
        keyTakeaway: "El texto didáctico debe comportarse como un tutor paciente e inquisitivo.",
        questionPrompt: "Propón tres estrategias breves mediante las cuales un material didáctico escrito pueda 'conversar' con el estudiante en lugar de limitarse a informarle un concepto."
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Pregunta Cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Facilitadores de la Comprensión en Medios Digitales",
        authorCitation: "Richard Mayer (2009) — Aprendizaje Multimedia",
        theoreticalContent: "Principios de interactividad, retroalimentación inmediata, micro-retos y segmentación visual hacen que las herramientas interactivas reduzcan la carga cognitiva extrínseca y faciliten la asimilación.",
        keyTakeaway: "La interactividad bien orientada convierte la curiosidad en comprensión duradera.",
        questionPrompt: "Piensa en un recurso o herramienta digital (como un video interactivo o un juego de preguntas) que te haya enseñado algo nuevo con facilidad. ¿Qué elementos de ese recurso facilitaron que entendieras el tema?"
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Caso de la Vida Real",
        exerciseType: "Análisis Organizacional y Pedagógico",
        suggestedMinutes: 15,
        topicTitle: "Rediseño de una Guía de Autoestudio Densa",
        authorCitation: "Gutiérrez & Prieto Castillo (1999)",
        theoreticalContent: "El exceso de tecnicismos y la ausencia de autorreflexión generan frustración y deserción. Rediseñar implica dosificar conceptos, incorporar lenguaje cercano, casos situados y pausas activas de evaluación.",
        keyTakeaway: "Un material pedagógico debe cuidar tanto el rigor epistémico como la calidez comunicativa.",
        scenarioTitle: "Deserción por guías densas e impersonales",
        scenarioContext: "Un tutor diseña una guía de autoestudio muy densa, llena de tecnicismos y sin espacios para la autorreflexión del alumno, generando una alta tasa de desmotivación y abandono.",
        questionPrompt: "¿Cómo rediseñarías la mediación pedagógica de esa guía para propiciar un vínculo afectivo y cognitivo con el estudiante?"
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Mediación vs. Transmisión",
        authorCitation: "Saber Pro — Diseño y Mediación de Aprendizajes",
        theoreticalContent: "La mediación pedagógica transforma radicalmente la relación con el conocimiento al conferir voz y agencia al estudiante.",
        keyTakeaway: "El estudiante pasa de espectador pasivo a interlocutor y autor de su propio aprendizaje.",
        questionPrompt: "La mediación pedagógica dentro de la comunicación educativa se diferencia de la simple transmisión de contenidos porque:",
        options: [
          "A) Busca transformar el rol del estudiante de oyente pasivo a un sujeto hablante y constructor activo de su aprendizaje.",
          "B) Depende exclusivamente de la velocidad de conexión a internet de la institución educativa.",
          "C) Elimina la figura del profesor para dejar todo en manos de la tecnología autónoma.",
          "D) Se centra en evaluar cuantitativamente los resultados mediante exámenes memorísticos de opción múltiple."
        ],
        correctOptionIndex: 0
      }
    ]
  },
  {
    id: 4,
    name: "Competencias Comunicativas Docentes",
    shortName: "Competencias Docentes",
    description: "Dimensiones expresivas, afectivas, dialógicas y de interacción asertiva en el ejercicio pedagógico.",
    academicJustification: "Profundiza en la empatía comunicativa, el manejo de la proxémica y el tono de voz en escenarios presenciales y virtuales.",
    authorsSummary: "Dell Hymes (1972), Philippe Perrenoud (2004), Daniel Goleman (1995)",
    icon: UserCheck,
    color: "#059669",
    tint: "#ECFDF5",
    eyebrow: "Eje Temático 4 · Comunicación Educativa",
    intro: "La competencia comunicativa docente integra el dominio del lenguaje, la resonancia afectiva, la escucha activa y la asertividad para crear entornos de seguridad psicológica en el aula.",
    consists: "Exploración de la comunicación no verbal, actitudes empáticas y resolución dialógica de la apatía estudiantil.",
    acts: "Identifica dimensiones expresivas docentes y formula tácticas de conexión pedagógica.",
    principles: [
      { title: "Seguridad Psicológica", text: "La comunicación docente debe validar al estudiante para que se atreva a dudar y equivocarse." },
      { title: "Coherencia Multimodal", text: "Armonía entre el lenguaje verbal, la entonación, la mirada y los gestos." }
    ],
    references: [
      {
        authors: "Philippe Perrenoud",
        year: "2004",
        contribution: "Diez nuevas competencias para enseñar: trabajar a partir de las representaciones y comunicarse eficazmente.",
        justification: "Establece el estándar contemporáneo de profesionalización docente mediante competencias comunicativas.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta Abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "Dimensiones Clave de la Competencia Comunicativa Docente",
        authorCitation: "Philippe Perrenoud (2004)",
        theoreticalContent: "Las competencias comunicativas abarcan la dimensión lingüística (claridad discursiva), paralingüística (tono y modulación), kinésica/proxémica (gestos y presencia), pragmática (adecuación al contexto) y socioafectiva (empatía y validación).",
        keyTakeaway: "El docente enseña con lo que explica, pero sobre todo con cómo se relaciona comunicativamente.",
        questionPrompt: "¿Cuáles son las dimensiones clave que integran las competencias comunicativas de un docente en los escenarios educativos actuales?"
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Desafío Conceptual",
        exerciseType: "Actitudes y Empatía",
        suggestedMinutes: 12,
        topicTitle: "Actitudes Verbales y No Verbales de Escucha Activa",
        authorCitation: "Carl Rogers (1969) & Daniel Goleman",
        theoreticalContent: "Verbalmente: parafrasear con respeto, formular preguntas abiertas y validar la dificultad. No verbalmente: contacto visual empático, postura abierta y asentimiento reflexivo sin interrupciones precipitadas.",
        keyTakeaway: "Escuchar activamente exige suspender el juicio inmediato para comprender la perspectiva del alumno.",
        questionPrompt: "Enlista dos actitudes verbales y dos no verbales que un docente debe manifestar para demostrar empatía y escucha activa en una tutoría académica."
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Pregunta Cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Impacto del Clima Comunicativo en la Motivación",
        authorCitation: "Albert Bandura y Daniel Goleman",
        theoreticalContent: "La calidez en el tono y la claridad expositiva disminuyen los niveles de cortisol y ansiedad académica, elevando la autoeficacia y la predisposición al aprendizaje de materias complejas.",
        keyTakeaway: "El tono emocional del docente abre o cierra las puertas del procesamiento cognitivo.",
        questionPrompt: "Describe una situación en la que la forma de comunicarse de un profesor (su tono, cercanía o claridad) haya influido positivamente en tu motivación hacia una asignatura difícil."
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Caso de la Vida Real",
        exerciseType: "Análisis Organizacional y Pedagógico",
        suggestedMinutes: 15,
        topicTitle: "Apatía y Pantallas Apagadas en Clases Virtuales",
        authorCitation: "Perrenoud y Goleman",
        theoreticalContent: "La imposición de encender cámaras suele activar resistencias pasivas. La pedagogía dialógica recurre a preguntas provocadoras, dinámicas interactivas rápidas (encuestas, pizarras compartidas) y trabajo en grupos pequeños para restablecer el enganche.",
        keyTakeaway: "La participación no se impone por decreto; se seduce mediante mediaciones interactivas.",
        scenarioTitle: "Silencio y apatía en el aula virtual",
        scenarioContext: "Durante una clase virtual sincrónica, un grupo de estudiantes muestra apatía y no enciende sus cámaras ni participa en el chat. Un docente con altas competencias comunicativas afectivas y dialógicas no recurriría a la imposición, sino a estrategias de enganche.",
        questionPrompt: "¿Qué acciones concretas implementaría para transformar el clima de la sesión?"
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Integralidad Comunicativa",
        authorCitation: "Saber Pro — Clima de Aula y Relaciones Pedagógicas",
        theoreticalContent: "La competencia docente articula lo cognitivo con lo afectivo para construir sentido y confianza mutua.",
        keyTakeaway: "El vínculo pedagógico es un acto relacional integral que transciende la mera dicción técnica.",
        questionPrompt: "El desarrollo de competencias comunicativas docentes eficaces en la educación contemporánea exige ir más allá de la correcta dicción o el dominio técnico del discurso. Esto implica principalmente:",
        options: [
          "A) Monitorear de forma punitiva el comportamiento de los estudiantes en los espacios virtuales.",
          "B) Integrar dimensiones cognitivas, afectivas y sociales que fortalezcan el vínculo pedagógico y la negociación de significados.",
          "C) Reducir la interacción al mínimo para optimizar los tiempos de entrega del programa académico.",
          "D) Aplicar rigurosamente un modelo de enseñanza centrado exclusivamente en la autoridad unilateral del emisor."
        ],
        correctOptionIndex: 1
      }
    ]
  },
  {
    id: 5,
    name: "Comunicación Digital y Educomunicación",
    shortName: "Educomunicación Digital",
    description: "Alfabetización mediática, pensamiento crítico frente a la información y participación en redes.",
    academicJustification: "Aborda la formación ciudadana en la era de los ecosistemas hiperconectados y la proliferación de desinformación.",
    authorsSummary: "Célestin Freinet (1927), Roberto Aparici (2010), UNESCO (2011)",
    icon: MessageSquare,
    color: "#D97706",
    tint: "#FFFBEB",
    eyebrow: "Eje Temático 5 · Comunicación Educativa",
    intro: "La educomunicación capacita a los aprendices no solo para manejar interfaces técnicas, sino para decodificar ideologías, verificar fuentes y participar éticamente en la esfera pública digital.",
    consists: "Pensamiento crítico informativo, verificación de fuentes y uso pedagógico de redes sociales.",
    acts: "Establece criterios de curaduría de contenidos y diseña estrategias contra las noticias falsas.",
    principles: [
      { title: "Pensamiento Crítico Mediático", text: "Toda pieza comunicativa digital tiene intencionalidad que debe ser decodificada." },
      { title: "Participación Democrática", text: "La red como espacio de producción colectiva de saberes emancipadores." }
    ],
    references: [
      {
        authors: "Roberto Aparici",
        year: "2010",
        contribution: "Educomunicación: más allá del 2.0. Conectivismo y pedagogía crítica en la era digital.",
        justification: "Marco teórico esencial sobre el rol del emirec y el aprendizaje dialógico en redes.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1 — Pregunta Abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "Alfabetización Mediática y Ciudadanía Crítica",
        authorCitation: "UNESCO (2011) & Roberto Aparici (2010)",
        theoreticalContent: "La alfabetización digital no es mero adiestramiento instrumental en software; es la capacidad de analizar críticamente quién produce la información, con qué intereses, y cómo participar constructivamente en los ecosistemas infomediáticos.",
        keyTakeaway: "Un ciudadano digital crítico sabe distinguir entre información fidedigna y manipulación algorítmica.",
        questionPrompt: "¿Qué relación existe entre la alfabetización mediática y digital y la formación de ciudadanos críticos en los ecosistemas comunicativos actuales?"
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2 — Desafío Conceptual",
        exerciseType: "Criterios de Verificación",
        suggestedMinutes: 12,
        topicTitle: "Criterios de Verificación Informativa en Redes Sociales",
        authorCitation: "Estándares Internacionales de Alfabetización Mediática (MIL)",
        theoreticalContent: "Verificación de autoría y credenciales institucionales, contraste con fuentes primarias especializadas, análisis de fecha y contexto, y detección de sesgos sensacionalistas o 'clickbait'.",
        keyTakeaway: "Verificar antes de compartir es el deber ético fundamental de la ciudadanía digital.",
        questionPrompt: "Elabora un decálogo rápido o una lista de 3 criterios clave que utilizarías para verificar si una noticia o recurso educativo encontrado en redes sociales es confiable o desinformativo."
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3 — Pregunta Cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Curaduría y Rigor Académico en Búsquedas Web",
        authorCitation: "Competencias de Búsqueda y Gestión de Información",
        theoreticalContent: "Diferenciar entre foros de opinión y bases de datos académicas (Google Scholar, Scopus, SciELO), evaluando la solidez metodológica y la vigencia temporal de los autores.",
        keyTakeaway: "El rigor académico empieza por la depuración crítica de los resultados de búsqueda.",
        questionPrompt: "Cuando buscas información en internet para hacer una tarea escolar, ¿cómo decides qué fuentes son verdaderamente útiles y cuáles debes descartar por falta de rigor académico?"
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4 — Caso de la Vida Real",
        exerciseType: "Análisis Organizacional y Pedagógico",
        suggestedMinutes: 15,
        topicTitle: "Redes Sociales en el Aula: De la Recreación al Aprendizaje",
        authorCitation: "Roberto Aparici y Henry Jenkins",
        theoreticalContent: "Si no hay intencionalidad pedagógica clara, las redes reproducen el consumo superficial. Orientarlas hacia el aprendizaje exige retos de creación de contenido con fuentes curadas, debates moderados y coevaluación ética.",
        keyTakeaway: "La red social cobra valor pedagógico cuando el estudiante pasa de espectador a co-creador de saberes.",
        scenarioTitle: "Desinformación y uso superficial en redes escolares",
        scenarioContext: "Un centro educativo decide integrar redes sociales (como Instagram o plataformas interactivas) para el desarrollo de una materia, pero los estudiantes solo las usan de manera recreativa y se genera desinformación ante los contenidos académicos propuestos.",
        questionPrompt: "Desde los retos de la educomunicación, ¿cómo se puede orientar pedagógicamente este espacio para convertirlo en un entorno de aprendizaje colaborativo?"
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5 — Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Prioridades en Educomunicación",
        authorCitation: "Saber Pro — Tecnología, Sociedad y Educación",
        theoreticalContent: "La tendencia global prioriza el pensamiento crítico y la participación colaborativa frente a la fascinación tecnológica acrítica.",
        keyTakeaway: "La educomunicación busca formar sujetos conscientes, deliberantes y solidarios en red.",
        questionPrompt: "En el contexto de la transformación digital de los entornos educativos, la investigación en educomunicación destaca como una tendencia prioritaria:",
        options: [
          "A) La sustitución total de la escuela presencial por algoritmos automatizados de inteligencia artificial.",
          "B) La adopción instrumental y ciega de cualquier dispositivo tecnológico sin análisis pedagógico previo.",
          "C) La alfabetización mediática, el desarrollo de pensamiento crítico frente a los medios y la colaboración participativa en redes.",
          "D) La restricción absoluta del uso de tecnologías digitales para evitar la distracción estudiantil."
        ],
        correctOptionIndex: 2
      }
    ]
  }
];
