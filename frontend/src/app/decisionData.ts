import { Target, Layers, BrainCircuit, ShieldAlert, BarChart3 } from "lucide-react";
import { LeadershipModule } from "./leadershipData";

export interface DecisionTopicLevel {
  level: number;
  difficultyLabel: string;
  exerciseType: string;
  suggestedMinutes: number;
  topicTitle: string;
  authorCitation: string;
  theoreticalContent: string;
  keyTakeaway: string;
  questionPrompt: string;
  modelAnswer?: string;
  scenarioTitle?: string;
  scenarioContext?: string;
  options?: string[];
  correctOptionIndex?: number;
  explanation?: string;
}

export interface DecisionModule extends LeadershipModule {
  topics: DecisionTopicLevel[];
}

export const decisionModules: DecisionModule[] = [
  {
    id: 1,
    name: "Identificación y Definición del Problema",
    shortName: "Diagnóstico y Análisis",
    description: "Desarrolla el criterio analítico para distinguir síntomas visibles de causas raíz y aplicar matrices de priorización.",
    academicJustification: "Fundamenta la metodología de diagnóstico riguroso mediante la Matriz de Eisenhower y el análisis de causalidad estructural para evitar decisiones reactivas.",
    authorsSummary: "Dwight D. Eisenhower (1954), Kaoru Ishikawa (1968), Herbert Simon (1960)",
    icon: Target,
    color: "#E11D48",
    tint: "#FFE4E6",
    eyebrow: "Eje Temático 1 · Toma de Decisiones",
    intro: "El 80% del éxito en la toma de decisiones radica en formular adecuadamente el problema; confundir un síntoma con la causa raíz conduce a soluciones costosas e inútiles.",
    consists: "Metodologías de diagnóstico organizacional, aplicación de la Matriz de Eisenhower y detección de causas estructurales.",
    acts: "Distingue síntomas de problemas raíz, prioriza urgencia vs. importancia y evalúa impactos financieros en casos reales.",
    principles: [
      { title: "Diferenciación Causal", text: "Atacar los síntomas ofrece alivio efímero; resolver la causa raíz erradica la disfunción." },
      { title: "Priorización Estratégica", text: "Lo urgente rara vez es importante, y lo importante rara vez es urgente (Eisenhower)." }
    ],
    references: [
      {
        authors: "Herbert A. Simon",
        year: "1960",
        contribution: "El nuevo arte de la decisión gerencial: fases de Inteligencia, Diseño y Elección.",
        justification: "Establece la fase de 'Inteligencia' (diagnóstico) como la condición previa indispensable para cualquier decisión acertada.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1: Pregunta abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "Síntoma vs. Problema Raíz en el Diagnóstico",
        authorCitation: "Kaoru Ishikawa & Herbert Simon",
        theoreticalContent: "Un síntoma es una manifestación visible o consecuencia superficial generada por una falla subyacente. El problema raíz es el origen causal que genera y sostiene dicha manifestación.",
        keyTakeaway: "Tratar solo el síntoma provoca la reaparición del problema y desperdicia recursos organizacionales.",
        questionPrompt: "Explique la diferencia conceptual entre un 'síntoma' y un 'problema raíz' en el marco del diagnóstico para la toma de decisiones. Proporcione un ejemplo breve.",
        modelAnswer: "Un síntoma es una manifestación visible, efecto o consecuencia no deseada causada por una disfunción subyacente (por ejemplo, la disminución vertiginosa en las ventas de un producto). El problema raíz es la causa fundamental u origen que genera esa manifestación (por ejemplo, una falla crítica en el control de calidad del producto que genera insatisfacción en los clientes). Resolver un síntoma ofrece solo una solución temporal; resolver el problema raíz elimina la causa subyacente y evita su recurrencia."
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2: Desafío",
        exerciseType: "Aplicación Técnica",
        suggestedMinutes: 12,
        topicTitle: "Aplicación Práctica de la Matriz de Eisenhower",
        authorCitation: "Dwight D. Eisenhower (1954)",
        theoreticalContent: "La Matriz de Eisenhower clasifica tareas según su Urgencia (tiempo cercano) e Importancia (impacto en objetivos a largo plazo), distribuyéndolas en cuatro cuadrantes de acción ejecutiva.",
        keyTakeaway: "El cuadrante II (No urgente pero Importante) es el motor de la efectividad y el crecimiento sostenible.",
        questionPrompt: "Aplique la Matriz de Eisenhower diseñando un esquema práctico de 3 pasos para clasificar y priorizar decisiones urgentes vs. importantes en la gestión académica o profesional.",
        modelAnswer: "Paso 1: Inventario y Filtrado (Listar todas las tareas y evaluarlas mediante escala binaria Urgencia vs Importancia).\nPaso 2: Categorización en Matriz (Cuadrante I: Hacer de inmediato; Cuadrante II: Planificar y agendar; Cuadrante III: Delegar; Cuadrante IV: Eliminar o descartar).\nPaso 3: Ejecución y Bloqueo de Tiempo (Priorizar la ejecución del Cuadrante II mediante bloques protegidos en agenda para evitar que se conviertan en emergencias del Cuadrante I)."
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3: Pregunta cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Priorización ante Dilemas Académicos y Sociales",
        authorCitation: "Gestión del Tiempo y Toma de Decisiones Personales",
        theoreticalContent: "La toma de decisiones bajo restricción de tiempo exige alineación con metas estratégicas de vida, postergando la gratificación inmediata de compromisos no esenciales.",
        keyTakeaway: "Saber decir 'no' a lo socialmente atractivo protege el logro de objetivos de alto impacto.",
        questionPrompt: "Un estudiante universitario tiene un examen final mañana por la mañana (que representa el 40% de la nota de la materia) y la entrega de un trabajo grupal cuyo plazo vence esta medianoche. Además, recibe una invitación de última hora a una reunión social importante para su grupo de amigos. ¿Cómo debe aplicar la priorización de decisiones para resolver este dilema de gestión del tiempo?",
        modelAnswer: "El estudiante debe priorizar la entrega del trabajo grupal (Urgente e Importante, Cuadrante I) dedicando las primeras horas a culminar su parte y coordinar el envío. Posteriormente, debe declinar la invitación social (No Urgente / No Importante dentro del objetivo del día) y asignar el bloque restante y la mañana a la revisión estructurada para el examen final (Urgente e Importante)."
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4: Caso de la vida real",
        exerciseType: "Análisis Organizacional",
        suggestedMinutes: 15,
        topicTitle: "El Caso de Soporte Técnico en TechSol",
        authorCitation: "Análisis de Causa Raíz en Operaciones TI",
        theoreticalContent: "Contratar más personal ante quejas operativas es una falacia común si el cuello de botella se deriva de procesos burocráticos o herramientas obsoletas.",
        keyTakeaway: "Invertir más recursos en un proceso defectuoso solo amplifica el sobrecosto sin solucionar el problema.",
        scenarioTitle: "TechSol: Quejas de soporte técnico",
        scenarioContext: "La empresa de servicios informáticos TechSol ha registrado un incremento del 35% en las quejas de clientes por demoras en el soporte técnico. La dirección asumió de inmediato que el problema era la falta de personal y contrató a tres nuevos técnicos. Tras tres meses, las quejas continuaron aumentando. Un análisis posterior reveló que los técnicos actuales pasaban el 60% de su tiempo completando formularios manuales repetitivos por la obsolescencia del software interno.",
        questionPrompt: "Analice este caso identificando la confusión cometida entre síntoma y problema raíz, y exponga el impacto organizativo de la decisión tomada.",
        modelAnswer: "• Síntoma percibido: Demora en la atención de soporte y acumulación de quejas.\n• Diagnóstico erróneo: Asumir que el problema era el número insuficiente de empleados.\n• Problema raíz: Ineficiencia operativa provocada por un software interno obsoleto que exigía tareas manuales repetitivas.\n• Impacto organizativo: La empresa incurrió en un costo financiero innecesario (salarios de 3 contrataciones adicionales) sin resolver el cuello de botella y sobrecargando la estructura."
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5: Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Auditoría de Margen Operativo",
        authorCitation: "Saber Pro — Diagnóstico Estratégico Organizacional",
        theoreticalContent: "Las preguntas de selección evalúan la capacidad de contrastar hipótesis directivas frente a datos cuantitativos duros de auditoría.",
        keyTakeaway: "La decisión óptima siempre ataca la causa estructural con mayor peso cuantitativo en los datos.",
        questionPrompt: "Una consultora de gestión fue contratada por una cadena retail para investigar la caída del 20% en el margen operativo durante el último año. El equipo directivo insiste en que el problema central es el aumento imprevisto en las tarifas de los proveedores de transporte. Sin embargo, la auditoría interna mostró los siguientes hallazgos: 1. El costo de proveedores aumentó un 4%. 2. Los índices de rotación de inventario cayeron a la mitad debido a sobrestock de líneas de producto obsoletas. 3. El costo de almacenamiento e imprevistos por mermas creció un 28%.\n\nDe acuerdo con la metodología de diagnóstico e identificación de problemas, la decisión más adecuada para la consultora es:",
        options: [
          "A) Aceptar la hipótesis de la directiva y negociar de inmediato nuevos contratos a largo plazo con los proveedores de transporte para reducir ese 4%.",
          "B) Recomendar una reestructuración de la estrategia de compras e inventarios para resolver la acumulación de stock obsoleto que incrementa los costos de almacenamiento.",
          "C) Reducir el precio de venta al público general de manera masiva para liquidar todo el inventario de la tienda sin importar el margen.",
          "D) Aumentar las comisiones de los vendedores para acelerar las salidas del almacén sin revisar la cadena de suministros."
        ],
        correctOptionIndex: 1,
        explanation: "El análisis de datos evidencia que el 4% en transporte es un factor menor que no explica la caída total del margen. El verdadero problema raíz radica en la gestión ineficiente de inventarios (caída de rotación y aumento del 28% en almacenaje por stock obsoleto). La opción B ataca directamente la causa estructural."
      }
    ]
  },
  {
    id: 2,
    name: "Generación y Evaluación de Alternativas",
    shortName: "Evaluación de Alternativas",
    description: "Dominio de la dinámica divergente-convergente, matrices de ponderación y análisis de costo de oportunidad.",
    academicJustification: "Aplica modelos multicriterio ponderados y evaluación de trade-offs para seleccionar soluciones óptimas bajo restricciones de recursos.",
    authorsSummary: "Alex Osborn (1953), Thomas Saaty (1980), Michael Porter (1985)",
    icon: Layers,
    color: "#2563EB",
    tint: "#EFF6FF",
    eyebrow: "Eje Temático 2 · Toma de Decisiones",
    intro: "Una decisión solo es tan buena como la mejor alternativa considerada; sin un proceso riguroso de divergencia y filtrado ponderado, caemos en la trampa de la primera idea disponible.",
    consists: "Dinámica creativa y lógica, construcción de matrices de criterio-ponderación y análisis de costos de oportunidad.",
    acts: "Compara opciones técnicas, equilibra costo vs. escalabilidad y calcula compensaciones en proyectos sociales y empresariales.",
    principles: [
      { title: "Pensamiento Divergente y Convergente", text: "Separar la fase de generar ideas de la fase de juzgarlas y filtrarlas." },
      { title: "Criterios Ponderados", text: "Ponderar variables objetivas (costo, riesgo, tiempo, impacto) antes de evaluar alternativas." }
    ],
    references: [
      {
        authors: "Thomas L. Saaty",
        year: "1980",
        contribution: "El Proceso de Jerarquía Analítica (AHP) para la toma de decisiones multicriterio.",
        justification: "Metodología base para la construcción de matrices ponderadas en la selección de alternativas complejas.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1: Pregunta abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "Pensamiento Divergente vs. Pensamiento Convergente",
        authorCitation: "J.P. Guilford & Alex Osborn",
        theoreticalContent: "El pensamiento divergente expande creativamente el abanico de opciones sin juzgar su viabilidad preliminar. El pensamiento convergente evalúa analíticamente las opciones bajo criterios objetivos para escoger la mejor.",
        keyTakeaway: "Mezclar ambas fases simultáneamente ahoga la innovación o produce decisiones precipitadas.",
        questionPrompt: "Explique la dinámica analítica entre el pensamiento divergente y el pensamiento convergente durante la fase de generación y evaluación de alternativas de solución.",
        modelAnswer: "El pensamiento divergente es un proceso creativo que busca expandir el espacio de soluciones generando masivamente opciones sin juzgar su viabilidad inicial. El pensamiento convergente es un proceso analítico y lógico que toma las opciones generadas, las filtra bajo criterios prefijados (costo, factibilidad, riesgo) y selecciona la alternativa óptima para la acción."
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2: Desafío",
        exerciseType: "Aplicación Técnica",
        suggestedMinutes: 12,
        topicTitle: "Matriz de Criterio-Ponderación para Servidores PYME",
        authorCitation: "Metodología de Toma de Decisiones Multicriterio",
        theoreticalContent: "Permite tabular criterios con ponderaciones porcentuales que suman 100% y puntuar alternativas del 1 al 5 para obtener una calificación objetiva.",
        keyTakeaway: "La ponderación explícita transparenta los compromisos (trade-offs) de la decisión.",
        questionPrompt: "Diseñe una Matriz de Criterio-Ponderación para comparar 3 alternativas de solución frente a la necesidad de actualizar la infraestructura de servidor de una PYME.",
        modelAnswer: "Escala 1 (Deficiente) a 5 (Excelente):\n• Costo Inicial (30%): Servidor On-Premise: 1 | Migración Cloud: 5 | Modelo Híbrido: 3\n• Escalabilidad (25%): On-Premise: 2 | Cloud: 5 | Híbrido: 4\n• Seguridad de Datos (25%): On-Premise: 4 | Cloud: 3 | Híbrido: 4\n• Mantenimiento (20%): On-Premise: 2 | Cloud: 5 | Híbrido: 3\nTOTAL PONDERADO: On-Premise: 2.20 | Migración Cloud: 4.50 | Modelo Híbrido: 3.50\nConclusión: La Migración Cloud resulta la opción más viable con 4.50 puntos."
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3: Pregunta cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Evaluación de Opciones de Transporte Personal",
        authorCitation: "Análisis de Restricciones y Ponderación Personal",
        theoreticalContent: "Evaluar alternativas cotidianas exige ponderar variables conflictivas como costo monetario directo, predictibilidad del tiempo y nivel de desgaste físico/emocional.",
        keyTakeaway: "No existe una opción perfecta universal; la mejor alternativa depende de las prioridades del decisor.",
        questionPrompt: "Una persona debe desplazarse diariamente a su nuevo lugar de trabajo a 15 km de distancia. Dispone de tres alternativas: Automóvil propio, Transporte Público masivo o Bicicleta/Monopatín eléctrico. Evalúe analíticamente las tres alternativas considerando tres variables: Costo Mensual, Tiempo de Traslado y Seguridad/Estrés.",
        modelAnswer: "• Automóvil: Costo Alto, Tiempo Variable (tráfico), Alto estrés por congestión pero alta seguridad física.\n• Transporte Público: Costo Bajo, Tiempo Alto y variable, Estrés moderado por aglomeraciones.\n• Bicicleta/Monopatín: Costo Muy bajo, Tiempo Predecible en distancias medias, Exposición vial pero beneficio a la salud y sin estrés de tráfico.\nDecisión analítica: Si el costo es crítico, transporte público o micro-movilidad son óptimos. Si el confort y el tiempo priman y hay presupuesto, el automóvil resulta idóneo."
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4: Caso de la vida real",
        exerciseType: "Análisis Organizacional",
        suggestedMinutes: 15,
        topicTitle: "Costo de Oportunidad en Educación Rural (ONG)",
        authorCitation: "Evaluación de Impacto y Sostenibilidad Social",
        theoreticalContent: "El costo de oportunidad de elegir tecnología efímera (tablets sin conectividad) frente a la capacitación del talento humano y dotación bibliográfica duradera.",
        keyTakeaway: "La sostenibilidad a largo plazo siempre supera al impacto efectista de corto plazo.",
        scenarioTitle: "Presupuesto de $50,000 USD para lectura en 10 escuelas",
        scenarioContext: "Una ONG educativa cuenta con un presupuesto limitado de $50,000 USD para mejorar el rendimiento lector en 10 escuelas rurales. Se presentan tres alternativas:\n• Opción 1: Comprar tablets para todos los estudiantes con libros preinstalados.\n• Opción 2: Capacitar intensivamente a docentes en lectura crítica y dotar bibliotecas físicas escolares.\n• Opción 3: Construir un aula informática centralizada en una de las escuelas.",
        questionPrompt: "Evalúe las alternativas identificando los costos de oportunidad y seleccione la de mayor impacto sostenible.",
        modelAnswer: "• Opción 1: Genera dependencia tecnológica, requiere conectividad y mantenimiento constante; alto riesgo de obsolescencia rápida.\n• Opción 3: Beneficia solo a una escuela o exige traslados complejos para estudiantes de otras sedes.\n• Opción 2: Maximiza la sostenibilidad; la capacitación docente deja capacidad instalada duradera en el cuerpo profesoral y la dotación bibliográfica beneficia a múltiples promociones sin costos de mantenimiento tecnológico.\nSelección: La Opción 2 representa la alternativa de mayor costo-efectividad e impacto pedagógico a largo plazo."
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5: Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Inversión en Biotecnología",
        authorCitation: "Saber Pro — Toma de Decisiones Bajo Incertidumbre",
        theoreticalContent: "Ponderación entre tasa de retorno absoluto (ROI), tiempo de recuperación de capital (payback) y exposición a riesgos regulatorios.",
        keyTakeaway: "En entornos inciertos, la velocidad de retorno de liquidez y el bajo riesgo regulatorio prevalecen sobre el ROI nominal.",
        questionPrompt: "Una firma de biotecnología debe decidir la asignación de recursos para lanzar un producto al mercado. El equipo financiero presenta la siguiente matriz:\n• Proyecto Alpha: Inversión $1,000,000 USD | ROI 25% | Retorno: 4 años | Riesgo: Alto\n• Proyecto Beta: Inversión $400,000 USD | ROI 18% | Retorno: 1.5 años | Riesgo: Bajo\n• Proyecto Gamma: Inversión $600,000 USD | ROI 12% | Retorno: 2 años | Riesgo: Moderado\n\nSi el objetivo de la junta directiva es minimizar el costo de oportunidad y garantizar liquidez a corto plazo frente a un entorno regulatorio incierto, la decisión más racional de selección de alternativas es:",
        options: [
          "A) Financiar el Proyecto Alpha, porque ofrece la mayor tasa absoluta de retorno de inversión (25%).",
          "B) Financiar el Proyecto Beta, dado que minimiza el riesgo regulatorio, requiere menor capital y ofrece el menor tiempo de retorno con un ROI competitivo.",
          "C) Dividir el presupuesto por igual entre los tres proyectos sin importar el monto mínimo requerido de inversión.",
          "D) Invertir en el Proyecto Gamma por situarse en un punto medio de capital y retorno."
        ],
        correctOptionIndex: 1,
        explanation: "La condición de la junta directiva especifica dos restricciones críticas: liquidez a corto plazo y mitigación de riesgo regulatorio. El Proyecto Beta satisface directamente ambas restricciones al requerir menor capital ($400k), retornar el capital en solo 1.5 años y presentar riesgo regulatorio bajo."
      }
    ]
  },
  {
    id: 3,
    name: "Sesgos Cognitivos y Juicio Crítico",
    shortName: "Sesgos y Juicio Crítico",
    description: "Identificación y mitigación de trampas heurísticas: anclaje, confirmación, disponibilidad y costo hundido.",
    academicJustification: "Explora la economía conductual y los modelos de juicio intuitivo vs. analítico para blindar la toma de decisiones contra ilusiones cognitivas.",
    authorsSummary: "Daniel Kahneman & Amos Tversky (1974), Richard Thaler (2008)",
    icon: BrainCircuit,
    color: "#7C3AED",
    tint: "#F5F3FF",
    eyebrow: "Eje Temático 3 · Toma de Decisiones",
    intro: "El cerebro humano recurre a atajos mentales (heurísticas) para ahorrar energía, pero en situaciones complejas estos atajos producen errores sistemáticos que arruinan inversiones y proyectos.",
    consists: "Reconocimiento empírico de sesgos, técnicas de desanclaje y reencuadre analítico de decisiones bajo presión.",
    acts: "Identifica falacias de costo hundido, desarma el sesgo de confirmación y diseña protocolos de evaluación ciega.",
    principles: [
      { title: "Sistema 1 y Sistema 2", text: "La intuición rápida (Sistema 1) debe ser auditada por el pensamiento deliberado y analítico (Sistema 2)." },
      { title: "Mitigación del Costo Hundido", text: "Las decisiones racionales miran hacia los costos y beneficios futuros, jamás hacia las pérdidas irrecuperables del pasado." }
    ],
    references: [
      {
        authors: "Daniel Kahneman y Amos Tversky",
        year: "1974 / 2011",
        contribution: "Teoría de las Perspectivas y Pensar Rápido, Pensar Despacio.",
        justification: "Pilar científico para desentrañar cómo los sesgos de anclaje, representatividad y disponibilidad sesgan el juicio profesional.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1: Pregunta abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "Sesgo de Confirmación y Sesgo de Anclaje",
        authorCitation: "Kahneman & Tversky (1974)",
        theoreticalContent: "El sesgo de confirmación busca solo datos que validen creencias previas. El sesgo de anclaje ancla el juicio a la primera cifra o dato recibido, ajustando deficientemente la conclusión posterior.",
        keyTakeaway: "Reconocer nuestros propios sesgos es el primer requisito del pensamiento crítico.",
        questionPrompt: "Defina conceptualmente el Sesgo de Confirmación y el Sesgo de Anclaje, explicando cómo interfieren en la toma de decisiones objetivas.",
        modelAnswer: "• Sesgo de Confirmación: Es la tendencia sistemática a buscar, interpretar, favorecer y recordar información que confirma hipótesis previas, ignorando o descartando activamente la evidencia contradictoria.\n• Sesgo de Anclaje: Ocurre cuando un individuo depende en exceso de la primera pieza de información recibida (el 'ancla') al tomar decisiones posteriores, ajustando insuficientemente sus juicios a partir de datos nuevos o adicionales."
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2: Desafío",
        exerciseType: "Aplicación Técnica",
        suggestedMinutes: 12,
        topicTitle: "Reencuadre Analítico del Sesgo de Disponibilidad",
        authorCitation: "Kahneman (2011) — Heurística de Disponibilidad",
        theoreticalContent: "Ocurre cuando se evalúa la probabilidad de un riesgo basándose en un evento reciente o dramático que viene fácil a la memoria, en lugar de consultar estadísticas representativas.",
        keyTakeaway: "Un evento aislado memorable no constituye una muestra estadística representativa.",
        questionPrompt: "En una reunión de evaluación de producto, el director de operaciones afirma: 'No debemos invertir en empaques biodegradables porque la semana pasada vi una noticia sobre una empresa que quebró al usarlos'. Identifique el sesgo cognitivo presente y redacte una propuesta de reencuadre analítico.",
        modelAnswer: "• Sesgo Identificado: Sesgo de Disponibilidad (Heurística de Disponibilidad). El director evalúa la probabilidad de fracaso basándose en un evento reciente y memorable en lugar de datos estadísticos representativos.\n• Propuesta de Reencuadre: 'Entiendo la preocupación por ese caso específico. Sin embargo, para tomar una decisión informada, solicitemos un estudio de mercado estructurado que evalúe la tasa real de adopción, los costos de insumos y el retorno de inversión en nuestro sector, en lugar de basarnos en un evento aislado.'"
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3: Pregunta cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Anclaje de Precio y Urgencia en Compras Cotidianas",
        authorCitation: "Richard Thaler (2008) — Nudge y Economía Conductual",
        theoreticalContent: "Las etiquetas tachadas con precios inflados sirven de ancla psicológica, mientras que el sentido de urgencia ('solo por hoy') activa el miedo a perder (FOMO) inhibiendo el análisis crítico.",
        keyTakeaway: "Las ofertas agresivas están diseñadas deliberadamente para burlar el juicio analítico.",
        questionPrompt: "Un consumidor ingresa a una tienda de ropa y ve una chaqueta etiquetada con un precio original de $300 USD, rebajada con un descuento del 60% a $120 USD por 'tiempo limitado (solo por hoy)'. Aunque no necesitaba la prenda, la compra de inmediato. Analice qué sesgos influyeron en la decisión de compra.",
        modelAnswer: "Convergen dos sesgos:\na. Sesgo de Anclaje: El precio original de $300 USD actúa como ancla, haciendo que $120 USD parezca un ahorro enorme independientemente de si realmente necesitaba la prenda.\nb. Efecto de Escasez / Sesgo de Urgencia: La restricción de 'solo por hoy' genera percepción de escasez temporal (FOMO), forzando una compra impulsiva y anulando el análisis reflexivo de utilidad."
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4: Caso de la vida real",
        exerciseType: "Análisis Organizacional",
        suggestedMinutes: 15,
        topicTitle: "La Falacia del Costo Hundido en SoftTech",
        authorCitation: "Hal Arkes & Catherine Blumer (1985)",
        theoreticalContent: "La falacia del costo hundido consiste en justificar inversiones adicionales basándose en dinero o tiempo ya gastado e irrecuperable, en lugar de evaluar las perspectivas futuras reales.",
        keyTakeaway: "El dinero ya gastado nunca regresa; insistir en un error solo multiplica las pérdidas.",
        scenarioTitle: "SoftTech: $200k invertidos en un módulo fallido",
        scenarioContext: "El equipo de desarrollo de software de la empresa SoftTech ha invertido $200,000 USD y 10 meses de trabajo en un nuevo módulo. Durante las pruebas de usabilidad, el 85% de los usuarios reportó que la herramienta es confusa e innecesaria. A pesar de las recomendaciones de cancelarla, el líder del proyecto decide asignar $100,000 USD adicionales afirmando: 'Ya hemos gastado demasiado tiempo y dinero como para abandonar el proyecto ahora'.",
        questionPrompt: "Analice la falacia cognitiva en la que incurre el líder y exponga el riesgo financiero de su postura.",
        modelAnswer: "• Sesgo / Falacia Incurrida: Falacia del Costo Hundido (Sunk Cost Fallacy). Ocurre al tomar decisiones basadas en inversiones pasadas e irrecuperables en lugar de evaluar las perspectivas futuras de costo-beneficio.\n• Análisis de Riesgo: Los $200,000 USD ya están perdidos. Asignar $100,000 USD adicionales a un producto rechazado por el 85% del mercado incrementa las pérdidas a $300,000 USD y dilapida capacidad operativa que podría usarse en proyectos viables."
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5: Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Mitigación de Sesgos Públicos",
        authorCitation: "Saber Pro — Juicio Crítico y Políticas Públicas",
        theoreticalContent: "En decisiones de impacto social, los métodos cuantitativos ciegos contrarrestan el sesgo de confirmación de los tomadores de decisiones.",
        keyTakeaway: "La auditoría independiente ciega es el antídoto por excelencia contra el sesgo de confirmación.",
        questionPrompt: "El comité de inversiones de una entidad gubernamental debe decidir sobre la renovación de un programa social que no ha mostrado impacto en los indicadores de reducción de pobreza tras tres años de ejecución. Durante el debate, los miembros muestran las siguientes posturas:\n• El Miembro A sugiere recopilar solo los testimonios de los beneficiarios que expresan satisfacción, omitiendo los indicadores del DANE.\n• El Miembro B sugiere contratar una auditoría externa independiente con metodologías cuantitativas ciegas para evaluar los datos objetivos de impacto antes de votar.\n\nDesde la perspectiva del juicio crítico y la mitigación de sesgos cognitivos en la toma de decisiones públicas, la postura técnica más adecuada corresponde a:",
        options: [
          "A) El Miembro A, porque prioriza la percepción cualitativa de los ciudadanos sobre las métricas estadísticas abstractas.",
          "B) El Miembro B, porque implementa un mecanismo de evaluación objetiva diseñado para contrarrestar el sesgo de confirmación del comité.",
          "C) Ambos miembros por igual, dado que la intuición directiva sustituye los métodos científicos de auditoría.",
          "D) Ninguno de los dos, pues la decisión debe tomarse inmediatamente por votación política sin analizar datos previos."
        ],
        correctOptionIndex: 1,
        explanation: "La propuesta del Miembro A es un claro ejemplo de sesgo de confirmación al seleccionar intencionadamente testimonios favorables ignorando los datos de ineficacia. La propuesta del Miembro B aplica rigor analítico mediante auditoría independiente ciega garantizando neutralidad."
      }
    ]
  },
  {
    id: 4,
    name: "Toma de Decisiones Éticas y Responsabilidad Social",
    shortName: "Decisiones Éticas y RSE",
    description: "Resolución de dilemas éticos, matrices de impacto en grupos de interés (stakeholders) y valor público.",
    academicJustification: "Articula el utilitarismo, la deontología y la teoría de los stakeholders para balancear rentabilidad financiera con sostenibilidad social y ambiental.",
    authorsSummary: "Edward Freeman (1984), Mark H. Moore (1995), Archie Carroll (1991)",
    icon: ShieldAlert,
    color: "#059669",
    tint: "#ECFDF5",
    eyebrow: "Eje Temático 4 · Toma de Decisiones",
    intro: "Toda decisión empresarial o profesional impacta vidas humanas; la ética no es un obstáculo para la gestión, sino el cimiento de la legitimidad y la viabilidad a largo plazo.",
    consists: "Análisis de dilemas éticos irresolubles, ponderación de stakeholders y primacía de derechos fundamentales.",
    acts: "Evalúa impactos en salud y medio ambiente, distingue legalidad de legitimidad moral y prioriza el bien común.",
    principles: [
      { title: "Mapeo de Stakeholders", text: "Identificar y ponderar los efectos de la decisión en todos los grupos afectados, no solo en los accionistas." },
      { title: "Valor Público", text: "Las decisiones gerenciales deben preservar los derechos fundamentales y la confianza ciudadana." }
    ],
    references: [
      {
        authors: "R. Edward Freeman",
        year: "1984",
        contribution: "Teoría de los Stakeholders: gestión estratégica para la relación con grupos de interés.",
        justification: "Marco fundacional para sustituir la visión puramente accionista por la responsabilidad integral hacia la sociedad.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1: Pregunta abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "Concepto y Elementos del Dilema Ético",
        authorCitation: "Ética Organizacional y Filosofía Moral",
        theoreticalContent: "Un dilema ético ocurre cuando un decisor enfrenta alternativas en las que cumplir con un principio o valor moral vulnera inevitablemente otro principio legítimo.",
        keyTakeaway: "Un dilema ético auténtico no tiene solución indolora; exige ponderar cuál es el bien superior.",
        questionPrompt: "Defina qué es un Dilema Ético en el contexto organizacional e identifique sus elementos constitutivos fundamentales.",
        modelAnswer: "Un Dilema Ético es una situación de toma de decisiones en la cual un individuo o gerencia se enfrenta a dos o más alternativas donde cada opción implica la adhesión a un principio moral deseable, pero su cumplimiento conlleva la violación de otro valor prioritario o genera consecuencias adversas. Sus elementos constitutivos son:\na. La presencia de al menos dos opciones mutuamente excluyentes.\nb. La colisión de principios éticos o normativos legítimos.\nc. La inevitabilidad de un costo ético, social o moral independientemente de la opción elegida."
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2: Desafío",
        exerciseType: "Aplicación Técnica",
        suggestedMinutes: 12,
        topicTitle: "Matriz de Impacto en Stakeholders (Farmacéutica)",
        authorCitation: "R. Edward Freeman (1984)",
        theoreticalContent: "Evalúa cómo una decisión afecta a Pacientes, Accionistas, Reguladores y la Reputación Corporativa según el tipo de impacto y grado de responsabilidad.",
        keyTakeaway: "Maximizar el beneficio financiero violando la salud pública destruye la licencia social para operar.",
        questionPrompt: "Diseñe una Matriz de Impacto en Grupos de Interés (Stakeholders) para analizar la decisión de una empresa farmacéutica de aumentar en un 200% el precio de un medicamento esencial para el cual posee la patente exclusiva.",
        modelAnswer: "• Pacientes/Consumidores: Restricción al tratamiento vital; riesgo para la salud pública. Tipo: Negativo Crítico. Responsabilidad: Alta (deber de proteger la salud).\n• Accionistas: Incremento del margen de rentabilidad a corto plazo. Tipo: Positivo Financiero. Responsabilidad: Moderada (retorno sobre inversión).\n• Gobierno/Reguladores: Presión presupuestal e intervención de precios. Tipo: Negativo Regulatorio. Responsabilidad: Alta (normas de bienestar social).\n• Reputación Corporativa: Pérdida de legitimidad y posible boicot comercial. Tipo: Negativo Estratégico. Responsabilidad: Alta (preservación de licencia social)."
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3: Pregunta cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Dilema Ético de Integridad Académica",
        authorCitation: "Integridad y Honestidad Profesional",
        theoreticalContent: "Colisión entre la lealtad grupal hacia compañeros de estudio y la honestidad académica indispensable para la formación profesional justa.",
        keyTakeaway: "La complicidad con el fraude distorsiona la competencia y socava la propia ética profesional futura.",
        questionPrompt: "Un estudiante descubre que en un repositorio digital público no protegido se encuentran guardadas las respuestas del examen parcial final de su materia clave. El estudiante tiene dificultades académicas en la materia. Sus compañeros le piden que comparta el enlace en el grupo de chat estudiantil. ¿Cómo debe abordar esta decisión ética?",
        modelAnswer: "El estudiante enfrenta un dilema entre la lealtad percibida hacia sus pares y los principios de honestidad e integridad académica.\n• Análisis: Compartir el enlace vulnera el principio de evaluación justa, distorsiona la medición del aprendizaje y promueve la deshonestidad profesional.\n• Acción Correcta: Debe abstenerse de compartir las respuestas y notificar de forma reservada al docente o administrador sobre la vulnerabilidad del repositorio para que sea corregida, actuando con integridad."
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4: Caso de la vida real",
        exerciseType: "Análisis Organizacional",
        suggestedMinutes: 15,
        topicTitle: "Legalidad vs. Responsabilidad Ética en EcoExtract",
        authorCitation: "Archie Carroll (1991) — Pirámide de RSE",
        theoreticalContent: "Cumplir leyes obsoletas no exime a una empresa de su responsabilidad ambiental cuando la evidencia científica demuestra daño a fuentes de agua comunitarias.",
        keyTakeaway: "La ética empresarial empieza donde termina la ley.",
        scenarioTitle: "EcoExtract y la ley ambiental obsoleta",
        scenarioContext: "La empresa minera EcoExtract opera en una región vulnerable. Sus plantas cumplen estrictamente con los límites de emisión de contaminantes fijados por la ley local (que es obsoleta). Sin embargo, análisis científicos internos demuestran que las emisiones actuales causan daños graduales a la fuente hídrica comunitaria. Elevar los filtros de emisión más allá de lo exigido por la ley costaría $1.5 millones de USD, reduciendo los dividendos de los socios este año.",
        questionPrompt: "Evalúe analíticamente la decisión desde la responsabilidad social empresarial y el valor público.",
        modelAnswer: "• Cumplimiento Legal vs Responsabilidad Ética: Cumplir una ley obsoleta otorga amparo legal pero no exime de la responsabilidad ética ni del daño ambiental.\n• Análisis de Valor Público: La preservación del agua y la salud colectiva prevalecen sobre el dividendo financiero a corto plazo de los socios.\n• Decisión Estratégica: La directiva debe invertir los $1.5 millones de USD. Continuar contaminando expone a la empresa a litigios futuros, demandas y cancelación de su licencia social para operar."
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5: Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Presupuesto Hospitalario y Derechos Fundamentales",
        authorCitation: "Saber Pro — Ética Pública y Deontología",
        theoreticalContent: "Jerarquización de bienes jurídicos tutelados: el derecho fundamental a la vida y la salud prima sobre programas de capacitación administrativa interna.",
        keyTakeaway: "En la función pública, la protección de la vida humana es el valor superior innegociable.",
        questionPrompt: "El director general de un hospital público descubre que el presupuesto anual para insumos de urgencias se agotará dos meses antes de finalizar el año. Tiene dos opciones: 1. Reorientar fondos del programa de capacitación y bienestar del personal médico para garantizar los insumos. 2. Limitar el ingreso de pacientes no urgentes hasta el siguiente ejercicio fiscal para no sobrepasar el presupuesto legal asignado.\n\nAtendiendo a los principios de la función pública, el valor público y los códigos de ética médica, la conducta que mejor pondera los derechos fundamentales es:",
        options: [
          "A) Adoptar la Opción 2, salvaguardando la disciplina presupuestal absoluta por encima de cualquier atención en salud.",
          "B) Adoptar la Opción 1, garantizando el derecho fundamental a la salud y la vida de los usuarios como bien superior, reasignando partidas no esenciales.",
          "C) Cancelar todos los salarios del personal administrativo para comprar insumos médicos sin reasignar partidas.",
          "D) Renunciar al cargo inmediatamente para no asumir la responsabilidad legal del agotamiento presupuestal."
        ],
        correctOptionIndex: 1,
        explanation: "En la gestión pública y de salud prima el valor constitucional de la protección a la vida e integridad física sobre aspectos secundarios como capacitaciones internas. La Opción B resuelve la urgencia priorizando el bien común sin suspender el servicio vital del hospital."
      }
    ]
  },
  {
    id: 5,
    name: "Implementación, Monitoreo y Retroalimentación",
    shortName: "Monitoreo y Retroalimentación",
    description: "Planes de contingencia, tableros de control con KPIs y ciclos de ajuste ante desvíos en la ejecución.",
    academicJustification: "Aplica el ciclo Deming (PDCA) y metodologías de gestión del cambio para asegurar que la decisión adoptada genere los resultados esperados.",
    authorsSummary: "W. Edwards Deming (1986), John Kotter (1996), Robert Kaplan & David Norton (1996)",
    icon: BarChart3,
    color: "#D97706",
    tint: "#FFFBEB",
    eyebrow: "Eje Temático 5 · Toma de Decisiones",
    intro: "Una decisión estratégica sin monitoreo continuo es una apuesta ciega; la retroalimentación oportuna permite corregir el rumbo antes de que los desvíos se conviertan en crisis.",
    consists: "Diseño de planes de contingencia, definición de KPIs operativos y gestión humana del cambio.",
    acts: "Construye tableros de control, diagnostica fallas en transiciones de software y aplica ciclos correctivos de estudio.",
    principles: [
      { title: "Ciclo PDCA (Deming)", text: "Planificar, Hacer, Verificar y Actuar como espiral de mejora continua ininterrumpida." },
      { title: "Gestión Humana del Cambio", text: "El éxito de un sistema nuevo depende de la adopción de las personas, no solo del código informático." }
    ],
    references: [
      {
        authors: "Robert S. Kaplan y David P. Norton",
        year: "1996",
        contribution: "El Cuadro de Mando Integral (Balanced Scorecard): medición estratégica más allá de lo financiero.",
        justification: "Metodología estándar para diseñar tableros de control con KPIs de clientes, procesos internos y aprendizaje.",
        links: []
      }
    ],
    topics: [
      {
        level: 1,
        difficultyLabel: "Nivel 1: Pregunta abierta",
        exerciseType: "Fundamentación Teórica",
        suggestedMinutes: 10,
        topicTitle: "Concepto e Importancia del Plan de Contingencia",
        authorCitation: "Gestión de Riesgos y Continuidad Operativa",
        theoreticalContent: "Un Plan de Contingencia define procedimientos alternativos preestablecidos para activarse ante riesgos o desviaciones no planificadas durante la ejecución.",
        keyTakeaway: "Tener un plan de contingencia evita la improvisación desesperada en momentos de crisis.",
        questionPrompt: "Defina qué es un Plan de Contingencia y explique su importancia crítica durante la fase posterior a la adopción de una decisión estratégica.",
        modelAnswer: "Un Plan de Contingencia es un conjunto de procedimientos alternativos, acciones preventivas y reactivas prediseñadas para ser ejecutadas si ocurren eventos imprevistos, riesgos o desviaciones graves tras implementar una decisión. Su importancia radica en que minimiza el tiempo de respuesta ante la crisis, reduce el impacto financiero u operativo y otorga flexibilidad resiliente sin improvisar bajo presión."
      },
      {
        level: 2,
        difficultyLabel: "Nivel 2: Desafío",
        exerciseType: "Aplicación Técnica",
        suggestedMinutes: 12,
        topicTitle: "Tablero de Control con KPIs para Plataforma E-Learning",
        authorCitation: "Kaplan & Norton (1996) — Balanced Scorecard",
        theoreticalContent: "Diseño de indicadores con nombre, objetivo, fórmula métrica, meta operativa y frecuencia de medición para monitorear una decisión tecnológica educativa.",
        keyTakeaway: "Lo que no se mide no se puede gestionar ni mejorar.",
        questionPrompt: "Diseñe un tablero de control con cuatro Indicadores Clave de Desempeño (KPIs) para monitorear el éxito de la decisión estratégica de implementar una plataforma de e-learning en una institución educativa.",
        modelAnswer: "Tablero de 4 KPIs:\n1. Tasa de Adopción: (Estudiantes Activos en LMS / Total Matriculados) * 100 | Meta: ≥ 85% | Frecuencia: Mensual\n2. Índice de Satisfacción (CSAT): Encuesta de usabilidad y calidad (Escala 1 a 5) | Meta: ≥ 4.2 / 5.0 | Frecuencia: Trimestral\n3. Tiempo de Inactividad (Downtime): Horas fuera de servicio no programadas | Meta: < 0.1% | Frecuencia: Semanal\n4. Tasa de Deserción Escolar: (Estudiantes Retirados / Total Matrícula Inicial) * 100 | Meta: < 5% | Frecuencia: Semestral"
      },
      {
        level: 3,
        difficultyLabel: "Nivel 3: Pregunta cotidiana",
        exerciseType: "Contextualización Personal",
        suggestedMinutes: 10,
        topicTitle: "Ciclo de Retroalimentación en el Rendimiento Académico",
        authorCitation: "W. Edwards Deming — Ciclo PDCA Personal",
        theoreticalContent: "Aplicación del ciclo Monitoreo y Comparación ➔ Diagnóstico de Falla ➔ Acción Correctiva cuando las horas de estudio pasivo no producen las notas deseadas.",
        keyTakeaway: "Aumentar horas de estudio pasivo no corrige una técnica de aprendizaje deficiente.",
        questionPrompt: "Un estudiante planeó dedicar 3 horas diarias de estudio individual para el semestre académico. Sin embargo, en la entrega de notas del primer corte obtuvo un promedio no satisfactorio de 2.8/5.0. Aplique un ciclo de retroalimentación para ajustar su decisión de estudio.",
        modelAnswer: "a. Monitoreo y Comparación: El 2.8/5.0 evidencia una brecha respecto a la meta (4.0/5.0). El plan de 3 horas diarias no logró la efectividad esperada.\nb. Diagnóstico de Falla: El estudiante identifica que en esas 3 horas incurrió en distracciones por redes sociales y estudio pasivo (solo relectura).\nc. Acción Correctiva (Retroalimentación): Modificar la técnica en lugar de solo aumentar horas. Implementar metodologías de estudio activo (Técnica Pomodoro, resolución de ejercicios prácticos) y evaluar el impacto semanalmente mediante autoevaluaciones."
      },
      {
        level: 4,
        difficultyLabel: "Nivel 4: Caso de la vida real",
        exerciseType: "Análisis Organizacional",
        suggestedMinutes: 15,
        topicTitle: "Fallas de Implementación en UniGlobal (Software de Matrículas)",
        authorCitation: "John Kotter (1996) — Liderar el Cambio",
        theoreticalContent: "El colapso de un sistema digital tras una transición directa 'big bang' sin pruebas de carga ni capacitación del personal genera resistencia cultural al cambio.",
        keyTakeaway: "El software puede estar bien codificado, pero si las personas no están preparadas, la implementación fracasa.",
        scenarioTitle: "UniGlobal: Colapso del sistema automatizado de matrículas",
        scenarioContext: "La universidad UniGlobal decidió reemplazar de manera definitiva su sistema manual de matrículas por un nuevo software automatizado. Durante la semana de lanzamientos, el servidor colapsó, el 40% de los estudiantes no pudo inscribir asignaturas y el personal administrativo rechazó el sistema solicitando volver al papel.",
        questionPrompt: "Analice las fallas en el proceso de implementación, monitoreo y gestión del cambio en esta situación.",
        modelAnswer: "• Falla de Pruebas y Carga: Transición 'big bang' directa sin pruebas de estrés suficientes para soportar la concurrencia simultánea.\n• Ausencia de Plan de Contingencia: No se estableció un sistema paralelo o escalonado de respaldo para absorber el tráfico en caso de falla crítica.\n• Gestión del Cambio Deficiente: La falta de capacitación previa al personal administrativo generó resistencia al cambio, transformando un problema técnico momentáneo en un rechazo cultural al nuevo sistema."
      },
      {
        level: 5,
        difficultyLabel: "Nivel 5: Saber Pro",
        exerciseType: "Pregunta Selección Múltiple",
        suggestedMinutes: 10,
        topicTitle: "Evaluación Estandarizada: Decisión Gerencial ante Monitoreo Logístico",
        authorCitation: "Saber Pro — Gestión de la Calidad y Operaciones",
        theoreticalContent: "Cuando un indicador de calidad mejora drásticamente (90% menos errores) pero el tiempo sube por problemas de interfaz, la decisión racional es capacitar y rediseñar UX, no destruir la automatización.",
        keyTakeaway: "La retroalimentación gerencial identifica el cuello de botella específico sin retroceder en las ganancias alcanzadas.",
        questionPrompt: "Una empresa de logística gubernamental automatizó su centro de distribución para reducir el tiempo de despachos en un 30%. Pasados seis meses de la implementación, el tablero de indicadores refleja los siguientes datos:\n• El tiempo de despacho empeoró, incrementándose en un 12%.\n• El índice de errores en rotulado de paquetes disminuyó en un 90% (resultado altamente positivo).\n• Las encuestas al personal muestran que los operadores tardan el doble de tiempo ingresando datos al nuevo software debido a interfaces complejas.\n\nFrente a la retroalimentación de este monitoreo, la decisión gerencial más adecuada para corregir la implementación es:",
        options: [
          "A) Desmantelar completamente el sistema de automatización y regresar al proceso manual previo.",
          "B) Rediseñar la interfaz de usuario del software para simplificar el ingreso de datos y capacitar intensivamente a los operadores en la nueva herramienta.",
          "C) Despedir a los operadores por no adaptarse con la rapidez exigida a los nuevos sistemas tecnológicos.",
          "D) Ignorar el indicador de tiempo de despacho, considerando que la reducción en errores de rotulado compensa totalmente la demora."
        ],
        correctOptionIndex: 1,
        explanation: "La retroalimentación muestra que la automatización aportó un beneficio sustancial en calidad (reducción del 90% en errores), pero presentó un cuello de botella en la usabilidad del software (factor humano). La opción B ataca con precisión el punto de falla (interfaz e integración hombre-máquina), optimizando la decisión tomada sin destruir el avance logrado."
      }
    ]
  }
];
