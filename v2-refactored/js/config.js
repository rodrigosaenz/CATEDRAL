/**
 * @fileoverview CATEDRAL Form Configuration
 * Contains all static screen/question definitions and dynamic module builders.
 */

/** @type {string} Webhook URL for form submission */
const WEBHOOK_URL = 'https://rodrigosaenz.app.n8n.cloud/webhook/71cb09bc-6321-4d13-a086-90b90378e09b';

/** @type {string} Path to the CATEDRAL isotipo image (relative to index.html) */
const ISOTIPO_IMG = '../Isotipo Catedral-04.png';

/**
 * Static form screens shown to every respondent.
 * @type {Array<Object>}
 */
const SCREENS = [
  // --- SCREEN 1: BLOQUE A - DATOS GENERALES ---
  {
    id: 'bloque-a',
    title: 'Datos Generales',
    subtitle: 'General Information',
    questions: [
      { id: 'a1_nombre', type: 'text', es: 'Nombre completo', en: 'Full name', required: true },
      { id: 'a2_nombre_artistico', type: 'text', es: 'Nombre artístico (si aplica)', en: 'Artist / stage name (if applicable)', required: false },
      { id: 'a3_email', type: 'email', es: 'Correo electrónico', en: 'Email address', required: true },
      { id: 'a4_ciudad_pais', type: 'text', es: 'Ciudad y país de residencia', en: 'City and country of residence', required: true },
      {
        id: 'a5_tipo_proyecto', type: 'radio', required: true,
        es: '¿Cómo se define su proyecto?', en: 'How would you define your project?',
        options: [
          { value: 'artista_individual', es: 'Artista individual (proyecto unipersonal)', en: 'Solo artist (one-person project)' },
          { value: 'grupo', es: 'Proyecto grupal (2-5 personas, identidad compartida)', en: 'Group project (2-5 people, shared identity)' },
          { value: 'colectivo', es: 'Colectivo (marca paraguas con múltiples artistas)', en: 'Collective (umbrella brand with multiple artists)' },
          { value: 'creativo_tecnico', es: 'Creativo técnico (compositor, productor, arreglista)', en: 'Technical creative (composer, producer, arranger)' },
        ]
      },
      {
        id: 'a6_roles', type: 'checkbox', required: true,
        es: '¿Cuál es su rol principal? (puede seleccionar más de uno)', en: 'What is your main role? (you may select more than one)',
        options: [
          { value: 'performer_dj', es: 'Performer / DJ', en: 'Performer / DJ' },
          { value: 'productor', es: 'Productor musical', en: 'Music producer' },
          { value: 'compositor', es: 'Compositor / Arreglista', en: 'Composer / Arranger' },
          { value: 'cantante', es: 'Cantante / Vocalista', en: 'Singer / Vocalist' },
          { value: 'letrista', es: 'Letrista', en: 'Lyricist / Songwriter' },
          { value: 'director_creativo', es: 'Director creativo / Visual', en: 'Creative director / Visual artist' },
          { value: 'otro', es: 'Otro', en: 'Other' },
        ]
      },
      {
        id: 'a7_integrantes', type: 'number', required: false,
        es: '¿Cuántas personas integran el proyecto?', en: 'How many people are in the project?',
        conditional: { field: 'a5_tipo_proyecto', values: ['grupo', 'colectivo'] }
      },
      { id: 'a8_link_digital', type: 'url', es: 'Enlace a su presencia digital más representativa', en: 'Link to your most representative digital presence', required: false },
    ]
  },

  // --- SCREEN 2: BLOQUE B - DIAGNÓSTICO ---
  {
    id: 'bloque-b',
    title: 'Diagnóstico',
    subtitle: 'Assessment',
    questions: [
      {
        id: 'b1_produccion', type: 'radio_scored', required: true,
        es: '¿Cuántas obras originales ha publicado o presentado en el último año?',
        en: 'How many original works have you released or performed in the last year?',
        options: [
          { value: 0, es: 'Ninguna', en: 'None' },
          { value: 1, es: '1 a 3', en: '1 to 3' },
          { value: 2, es: '4 a 10', en: '4 to 10' },
          { value: 3, es: 'Más de 10', en: 'More than 10' },
        ]
      },
      {
        id: 'b2_audiencia', type: 'radio_scored', required: true,
        es: '¿Cuál es el tamaño aproximado de su audiencia actual?',
        en: 'What is the approximate size of your current audience?',
        options: [
          { value: 0, es: 'Menos de 100', en: 'Under 100' },
          { value: 1, es: '100 a 1.000', en: '100 to 1,000' },
          { value: 2, es: '1.000 a 10.000', en: '1,000 to 10,000' },
          { value: 3, es: 'Más de 10.000', en: 'Over 10,000' },
        ]
      },
      {
        id: 'b3_shows', type: 'radio_scored', required: true,
        es: '¿Cuántas presentaciones en vivo o sesiones profesionales ha realizado en el último año?',
        en: 'How many live performances or professional sessions in the last year?',
        options: [
          { value: 0, es: 'Ninguna', en: 'None' },
          { value: 1, es: '1 a 5', en: '1 to 5' },
          { value: 2, es: '6 a 20', en: '6 to 20' },
          { value: 3, es: 'Más de 20', en: 'More than 20' },
        ]
      },
      {
        id: 'b4_horas', type: 'radio_scored', required: true,
        es: '¿Cuántas horas semanales dedica a su proyecto?',
        en: 'How many hours per week do you dedicate to your project?',
        options: [
          { value: 0, es: 'Menos de 5 horas', en: 'Under 5 hours' },
          { value: 1, es: '5 a 15 horas', en: '5 to 15 hours' },
          { value: 2, es: '15 a 30 horas', en: '15 to 30 hours' },
          { value: 3, es: 'Más de 30 horas', en: 'Over 30 hours' },
        ]
      },
    ]
  },

  // --- SCREEN 3: BLOQUE B continued ---
  {
    id: 'bloque-b2',
    title: 'Diagnóstico',
    subtitle: 'Assessment (continued)',
    questions: [
      {
        id: 'b5_metas', type: 'radio_scored', required: true,
        es: '¿Tiene metas definidas para los próximos 6 a 12 meses?',
        en: 'Do you have defined goals for the next 6 to 12 months?',
        options: [
          { value: 0, es: 'No tengo metas definidas', en: 'No defined goals' },
          { value: 1, es: 'Ideas generales pero no un plan', en: 'General ideas but no plan' },
          { value: 2, es: 'Metas claras pero no sé cómo ejecutarlas', en: 'Clear goals but don\'t know how to execute' },
          { value: 3, es: 'Metas claras con plan de acción', en: 'Clear goals with action plan' },
        ]
      },
      {
        id: 'b6_equipo', type: 'radio_scored', required: true,
        es: '¿Cuenta con un equipo de apoyo?',
        en: 'Do you have a support team?',
        options: [
          { value: 0, es: 'No, trabajo completamente solo/a', en: 'No, I work completely alone' },
          { value: 1, es: 'Colaboraciones ocasionales e informales', en: 'Occasional, informal collaborations' },
          { value: 2, es: 'Algunas personas con roles parcialmente definidos', en: 'Some people with partially defined roles' },
          { value: 3, es: 'Equipo con roles claros y funcionamiento regular', en: 'Team with clear roles and regular operations' },
        ]
      },
      {
        id: 'b7_identidad', type: 'radio_scored', required: true,
        es: '¿Tiene identidad de marca y visual desarrollada?',
        en: 'Do you have a developed brand and visual identity?',
        options: [
          { value: 0, es: 'Nada definido', en: 'Nothing defined' },
          { value: 1, es: 'Elementos sueltos pero no consistentes', en: 'Scattered elements, not consistent' },
          { value: 2, es: 'Identidad visual en desarrollo', en: 'Visual identity in progress' },
          { value: 3, es: 'Identidad visual sólida y consistente', en: 'Solid, consistent visual identity' },
        ]
      },
      {
        id: 'b8_ingresos', type: 'radio_scored', required: true,
        es: '¿Su proyecto genera ingresos actualmente?',
        en: 'Does your project currently generate income?',
        options: [
          { value: 0, es: 'No genera ningún ingreso', en: 'No income' },
          { value: 1, es: 'Ingresos esporádicos e irregulares', en: 'Sporadic, irregular income' },
          { value: 2, es: 'Ingresos recurrentes pero insuficientes', en: 'Recurring but insufficient income' },
          { value: 3, es: 'Ingresos como fuente principal o significativa', en: 'Income as main or significant source' },
        ]
      },
    ]
  },

  // --- SCREEN 4: BLOQUE C - COMPROMISO ---
  {
    id: 'bloque-c',
    title: 'Compromiso y Expectativas',
    subtitle: 'Commitment & Expectations',
    questions: [
      {
        id: 'c1_motivacion', type: 'textarea', required: true, maxlength: 300,
        es: '¿Por qué hace música o trabaja en el ámbito musical?',
        en: 'Why do you make music or work in the music field?',
      },
      {
        id: 'c2_expectativas', type: 'checkbox', required: true, max: 3,
        es: '¿Qué espera obtener de CATEDRAL? (máximo 3)', en: 'What do you expect from CATEDRAL? (max 3)',
        options: [
          { value: 'claridad', es: 'Claridad estratégica', en: 'Strategic clarity' },
          { value: 'red', es: 'Red profesional de calidad', en: 'Quality professional network' },
          { value: 'herramientas', es: 'Herramientas de profesionalización', en: 'Professionalization tools' },
          { value: 'acompanamiento', es: 'Acompañamiento de carrera', en: 'Career development guidance' },
          { value: 'colaboracion', es: 'Oportunidades de colaboración', en: 'Collaboration opportunities' },
          { value: 'visibilidad', es: 'Visibilidad y exposición', en: 'Visibility and exposure' },
          { value: 'no_seguro', es: 'No estoy seguro/a aún', en: 'I\'m not sure yet' },
        ]
      },
      {
        id: 'c3_inversion', type: 'checkbox', required: true,
        es: '¿Qué está dispuesto/a a invertir en los próximos 6 meses?',
        en: 'What are you willing to invest in the next 6 months?',
        options: [
          { value: 'tiempo', es: 'Tiempo dedicado', en: 'Dedicated time' },
          { value: 'dinero', es: 'Dinero', en: 'Money' },
          { value: 'energia', es: 'Energía creativa', en: 'Creative energy' },
          { value: 'aprendizaje', es: 'Aprendizaje', en: 'Learning' },
          { value: 'conexiones', es: 'Conexiones', en: 'Connections' },
        ]
      },
      {
        id: 'c4_obstaculo', type: 'radio', required: true,
        es: '¿Cuál es el principal obstáculo de su proyecto hoy?',
        en: 'What is the main obstacle your project faces today?',
        options: [
          { value: 'direccion', es: 'No sé qué dirección tomar', en: 'I don\'t know what direction to take' },
          { value: 'recursos', es: 'Falta de recursos', en: 'Lack of resources' },
          { value: 'conocimiento', es: 'Falta de conocimiento del negocio musical', en: 'Lack of music business knowledge' },
          { value: 'tiempo', es: 'Falta de tiempo', en: 'Lack of time' },
          { value: 'red', es: 'Falta de red de contactos', en: 'Lack of network' },
          { value: 'audiencia', es: 'No sé cómo llegar a mi público', en: 'Don\'t know how to reach audience' },
        ]
      },
      {
        id: 'c5_adicional', type: 'textarea', required: false, maxlength: 500,
        es: '¿Hay algo más que considere importante compartir?',
        en: 'Is there anything else you consider important to share?',
      },
    ]
  },
];

/**
 * Returns the type-specific module based on project type.
 * @param {string} tipoProyecto - Project type key
 * @returns {Object|null} Module object or null if not found
 */
function getTypeModule(tipoProyecto) {
  const modules = {
    artista_individual: {
      title: 'Su Proyecto Individual', subtitle: 'Your Individual Project',
      questions: [
        { id: 't1_descripcion', type: 'textarea', maxlength: 200, required: true, es: '¿Cómo describiría su proyecto en una frase?', en: 'How would you describe your project in one sentence?' },
        { id: 't1_diferenciacion', type: 'textarea', maxlength: 300, required: true, es: '¿Qué lo diferencia de otros artistas en su género?', en: 'What sets you apart from others in your genre?' },
        { id: 't1_referentes', type: 'text', required: false, es: 'Nombre hasta 3 referentes artísticos', en: 'Name up to 3 artistic references' },
        {
          id: 't1_produccion_propia', type: 'radio', required: true, es: '¿Produce su propia música?', en: 'Do you produce your own music?', options: [
            { value: 'produce_todo', es: 'Produzco todo yo mismo/a', en: 'I produce everything myself' },
            { value: 'produce_parcial', es: 'Produzco parcialmente y colaboro', en: 'I partially produce and collaborate' },
            { value: 'no_produce', es: 'No produzco — necesito productor', en: 'I don\'t produce — I need a producer' },
            { value: 'no_aplica', es: 'No aplica a mi rol', en: 'Not applicable to my role' },
          ]
        },
        {
          id: 't1_fragilidad', type: 'radio', required: true, es: 'Si no pudiera dedicarse al proyecto por 3 meses, ¿qué pasaría?', en: 'If you couldn\'t work on the project for 3 months, what would happen?', options: [
            { value: 'se_detiene', es: 'Se detiene completamente', en: 'It stops completely' },
            { value: 'avanza_lento', es: 'Avanza lentamente con contenido programado', en: 'Moves slowly with scheduled content' },
            { value: 'parcialmente', es: 'Hay personas que pueden mantenerlo', en: 'Others can partially maintain it' },
            { value: 'funciona_sin_mi', es: 'Tiene estructura para funcionar sin mí', en: 'Has structure to function without me' },
          ]
        },
        {
          id: 't1_asesoria', type: 'radio', required: true, es: '¿Ha tenido asesoría externa para su proyecto?', en: 'Have you had external advisory?', options: [
            { value: 'nunca', es: 'Nunca', en: 'Never' },
            { value: 'informal', es: 'Sí, pero informal o puntual', en: 'Yes, but informal or one-time' },
            { value: 'continua', es: 'Sí, asesoría continua', en: 'Yes, ongoing advisory' },
          ]
        },
      ]
    },
    grupo: {
      title: 'Su Proyecto Grupal', subtitle: 'Your Group Project',
      questions: [
        { id: 't2_origen', type: 'textarea', maxlength: 300, required: true, es: '¿Cómo nació el grupo? ¿Qué los une más allá de la amistad?', en: 'How did the group form? What unites you beyond friendship?' },
        {
          id: 't2_decisiones', type: 'radio', required: true, es: '¿Quién toma las decisiones importantes?', en: 'Who makes important decisions?', options: [
            { value: 'un_lider', es: 'Una persona lidera', en: 'One person leads' },
            { value: 'consenso', es: 'Consenso (todos de acuerdo)', en: 'Consensus (everyone agrees)' },
            { value: 'mayoria', es: 'Mayoría', en: 'Majority' },
            { value: 'no_claro', es: 'No hay proceso claro', en: 'No clear process' },
            { value: 'no_probado', es: 'No hemos tenido que decidir algo difícil aún', en: 'We haven\'t had to make tough decisions yet' },
          ]
        },
        { id: 't2_roles', type: 'textarea', maxlength: 500, required: true, es: '¿Qué rol tiene cada integrante actualmente?', en: 'What role does each member currently have?' },
        {
          id: 't2_acuerdos', type: 'checkbox', required: true, es: '¿Tienen acuerdos escritos sobre alguno de estos temas?', en: 'Do you have written agreements on any of these?', options: [
            { value: 'splits', es: 'Distribución de ingresos', en: 'Income distribution' },
            { value: 'marca', es: 'Propiedad del nombre/marca', en: 'Name/brand ownership' },
            { value: 'salida', es: 'Qué pasa si alguien sale', en: 'What if someone leaves' },
            { value: 'inversion', es: 'Inversión y gastos compartidos', en: 'Shared investment/expenses' },
            { value: 'creditos', es: 'Créditos y autoría', en: 'Credits and authorship' },
            { value: 'ninguno', es: 'No tenemos ningún acuerdo escrito', en: 'No written agreements' },
          ]
        },
        {
          id: 't2_compromiso', type: 'radio', required: true, es: '¿Todos tienen el mismo nivel de compromiso?', en: 'Do all members have the same commitment level?', options: [
            { value: 'si_igual', es: 'Sí, todos al mismo nivel', en: 'Yes, all at the same level' },
            { value: 'diferencias_menores', es: 'Mayoría sí, diferencias menores', en: 'Mostly, minor differences' },
            { value: 'diferencias_significativas', es: 'Diferencias significativas', en: 'Significant differences' },
            { value: 'no_discutido', es: 'No lo hemos discutido', en: 'We haven\'t discussed it' },
          ]
        },
        {
          id: 't2_digital', type: 'radio', required: true, es: '¿Tienen redes sociales propias del grupo?', en: 'Does the group have its own social media?', options: [
            { value: 'si_regular', es: 'Sí, con contenido regular', en: 'Yes, with regular content' },
            { value: 'si_irregular', es: 'Sí, pero actividad irregular', en: 'Yes, but irregular' },
            { value: 'personal', es: 'No, usamos cuentas personales', en: 'No, we use personal accounts' },
            { value: 'no_tiene', es: 'No tenemos presencia digital', en: 'No digital presence' },
          ]
        },
        {
          id: 't2_multicultural', type: 'radio', required: true, es: '¿El grupo incluye integrantes de diferentes países o culturas?', en: 'Does the group include members from different countries or cultures?', options: [
            { value: 'si', es: 'Sí', en: 'Yes' }, { value: 'no', es: 'No', en: 'No' },
          ]
        },
        { id: 't2_integracion_cultural', type: 'textarea', maxlength: 300, required: false, es: '¿Cómo integran las diferentes culturas en el proyecto?', en: 'How do you integrate different cultures?', conditional: { field: 't2_multicultural', values: ['si'] } },
      ]
    },
    colectivo: {
      title: 'Su Colectivo', subtitle: 'Your Collective',
      questions: [
        { id: 't3_funcion', type: 'textarea', maxlength: 300, required: true, es: '¿Cuál es la función principal del colectivo?', en: 'What is the main function of the collective?' },
        {
          id: 't3_estructura', type: 'radio', required: true, es: '¿Tiene estructura de roles definida?', en: 'Does it have a defined role structure?', options: [
            { value: 'formal', es: 'Sí, roles claros y formales', en: 'Yes, clear formal roles' },
            { value: 'implicitos', es: 'Roles implícitos no formalizados', en: 'Implicit, not formalized' },
            { value: 'todos_todo', es: 'Todos hacen de todo', en: 'Everyone does everything' },
            { value: 'concentrado', es: 'Una o dos personas hacen la mayoría', en: 'One or two do most work' },
          ]
        },
        {
          id: 't3_marca', type: 'radio', required: true, es: '¿A quién pertenece la marca del colectivo?', en: 'Who owns the collective\'s brand?', options: [
            { value: 'fundador', es: 'A un fundador o fundadores', en: 'To founder(s)' },
            { value: 'todos_igual', es: 'A todos por igual', en: 'To all equally' },
            { value: 'entidad_legal', es: 'Entidad legal independiente', en: 'Independent legal entity' },
            { value: 'no_definido', es: 'No lo hemos definido', en: 'Not defined' },
            { value: 'no_se', es: 'No lo sé', en: 'I don\'t know' },
          ]
        },
        {
          id: 't3_ingresos', type: 'radio', required: true, es: '¿El colectivo genera ingresos? ¿Cómo se distribuyen?', en: 'Does it generate income? How is it distributed?', options: [
            { value: 'no_genera', es: 'No genera ingresos aún', en: 'No income yet' },
            { value: 'sin_sistema', es: 'Genera pero sin sistema claro', en: 'Income but no clear system' },
            { value: 'informal', es: 'Sistema informal de distribución', en: 'Informal distribution' },
            { value: 'formal', es: 'Sistema formal y documentado', en: 'Formal, documented system' },
          ]
        },
        {
          id: 't3_proyectos_individuales', type: 'radio', required: true, es: '¿Los miembros tienen proyectos individuales?', en: 'Do members have individual projects?', options: [
            { value: 'mayoria_si', es: 'Sí, la mayoría', en: 'Yes, most do' },
            { value: 'algunos', es: 'Algunos sí, algunos no', en: 'Some do, some don\'t' },
            { value: 'no', es: 'No, el colectivo es el único proyecto', en: 'No, the collective is the only project' },
          ]
        },
        {
          id: 't3_ambicion', type: 'radio', required: true, es: '¿Cuál es la ambición de escala en 12-24 meses?', en: 'Scaling ambition for next 12-24 months?', options: [
            { value: 'mantener', es: 'Mantener y mejorar calidad', en: 'Maintain and improve quality' },
            { value: 'crecer_local', es: 'Crecer en la región', en: 'Grow in the region' },
            { value: 'expandir', es: 'Expandir a otras ciudades/países', en: 'Expand to other cities/countries' },
            { value: 'no_discutido', es: 'No lo hemos discutido', en: 'Haven\'t discussed it' },
          ]
        },
        {
          id: 't3_salida', type: 'radio', required: true, es: '¿Qué pasa cuando alguien quiere salir? ¿Existe proceso?', en: 'What happens when someone wants to leave?', options: [
            { value: 'definido', es: 'Hay proceso definido', en: 'Defined process exists' },
            { value: 'informal_resuelto', es: 'No hay proceso pero se ha resuelto', en: 'No process but resolved before' },
            { value: 'no_pensado', es: 'No ha pasado y no hemos pensado en ello', en: 'Hasn\'t happened, haven\'t thought about it' },
            { value: 'tema_delicado', es: 'Es un tema delicado que preferimos no tocar', en: 'Sensitive topic we prefer not to address' },
          ]
        },
      ]
    },
    creativo_tecnico: {
      title: 'Su Perfil Creativo Técnico', subtitle: 'Your Technical Creative Profile',
      questions: [
        {
          id: 't4_formacion', type: 'radio', required: true, es: '¿Cuál es su formación musical o creativa?', en: 'What is your musical or creative training?', options: [
            { value: 'autodidacta', es: 'Autodidacta', en: 'Self-taught' },
            { value: 'informal', es: 'Formación informal (talleres, cursos)', en: 'Informal (workshops, courses)' },
            { value: 'academica_parcial', es: 'Académica parcial', en: 'Partial academic' },
            { value: 'academica_completa', es: 'Académica completa (título)', en: 'Complete academic (degree)' },
          ]
        },
        { id: 't4_formacion_detalle', type: 'text', required: false, es: '¿Dónde y en qué especialidad?', en: 'Where and in what specialty?', conditional: { field: 't4_formacion', values: ['academica_parcial', 'academica_completa'] } },
        {
          id: 't4_proyecto_propio', type: 'radio', required: true, es: '¿Tiene proyecto artístico propio?', en: 'Do you have your own artistic project?', options: [
            { value: 'activo', es: 'Sí, activo con lanzamientos', en: 'Yes, active with releases' },
            { value: 'desarrollo', es: 'Sí, en fase inicial', en: 'Yes, in initial phase' },
            { value: 'quiero', es: 'No, pero quiero desarrollar uno', en: 'No, but I want to develop one' },
            { value: 'no_prioridad', es: 'No, prefiero trabajar con/para otros', en: 'No, prefer working with/for others' },
          ]
        },
        {
          id: 't4_servicios', type: 'checkbox', required: true, es: '¿Qué servicios puede ofrecer a otros?', en: 'What services can you offer others?', options: [
            { value: 'composicion', es: 'Composición', en: 'Composition' },
            { value: 'arreglos', es: 'Arreglos musicales', en: 'Arrangements' },
            { value: 'produccion', es: 'Producción musical', en: 'Music production' },
            { value: 'letras', es: 'Escritura de letras', en: 'Lyric writing' },
            { value: 'direccion', es: 'Dirección musical', en: 'Musical direction' },
            { value: 'ensenanza', es: 'Enseñanza / mentoría', en: 'Teaching / mentoring' },
            { value: 'otro', es: 'Otro', en: 'Other' },
          ]
        },
        {
          id: 't4_portafolio', type: 'radio', required: true, es: '¿Tiene portafolio de trabajos?', en: 'Do you have a portfolio?', options: [
            { value: 'organizado', es: 'Sí, organizado y accesible', en: 'Yes, organized and accessible' },
            { value: 'desorganizado', es: 'Tengo trabajos pero no organizados', en: 'Have work but not organized' },
            { value: 'no_tiene', es: 'Aún no tengo trabajos para terceros', en: 'No work for third parties yet' },
          ]
        },
        {
          id: 't4_cobro', type: 'radio', required: true, es: '¿Cómo cobra por sus servicios?', en: 'How do you charge for services?', options: [
            { value: 'gratis', es: 'No cobro / intercambio', en: 'Free / trade' },
            { value: 'sin_precio_fijo', es: 'Cobro sin precio fijo', en: 'No fixed price' },
            { value: 'tarifas', es: 'Tarifas definidas por servicio', en: 'Defined rates per service' },
            { value: 'combinado', es: 'Tarifa fija + regalías', en: 'Fixed fee + royalties' },
            { value: 'nunca_cobrado', es: 'Nunca he cobrado', en: 'Never charged' },
          ]
        },
        {
          id: 't4_publishing', type: 'radio', required: true, es: '¿Entiende cómo funcionan los derechos de autor y publishing?', en: 'Do you understand copyright and publishing?', options: [
            { value: 'solido', es: 'Sí, conocimiento sólido', en: 'Yes, solid knowledge' },
            { value: 'basico', es: 'Nociones básicas', en: 'Basic notions' },
            { value: 'no_conoce', es: 'No, es un área que no conozco', en: 'No, unfamiliar area' },
          ]
        },
        {
          id: 't4_obras_registradas', type: 'radio', required: true, es: '¿Tiene obras registradas (SAYCE, GEMA, ASCAP, etc.)?', en: 'Works registered with CMO?', options: [
            { value: 'todas', es: 'Sí, todas o la mayoría', en: 'Yes, all or most' },
            { value: 'algunas', es: 'Algunas', en: 'Some' },
            { value: 'ninguna', es: 'No, ninguna', en: 'No, none' },
            { value: 'no_sabe', es: 'No sé qué es eso', en: 'I don\'t know what that is' },
          ]
        },
      ]
    }
  };
  return modules[tipoProyecto] || null;
}

/**
 * Returns role-specific modules for selected roles.
 * @param {string[]} roles - Array of selected role keys
 * @returns {Array<Object>} Array of module objects
 */
function getRoleModules(roles) {
  const allModules = {
    performer_dj: {
      title: 'Performer / DJ', subtitle: 'Performer / DJ Profile',
      questions: [
        { id: 'r1_estilo', type: 'textarea', maxlength: 200, required: true, es: '¿Cómo describiría su estilo musical o set típico?', en: 'How would you describe your style or typical set?' },
        { id: 'r1_experiencia', type: 'textarea', maxlength: 200, required: true, es: '¿Qué experiencia busca crear en vivo?', en: 'What experience do you aim to create live?' },
        {
          id: 'r1_material', type: 'radio', required: true, es: '¿Tiene sets o mixes grabados y publicados?', en: 'Do you have recorded/published sets or mixes?', options: [
            { value: 'regular', es: 'Sí, regularmente', en: 'Yes, regularly' },
            { value: 'irregular', es: 'Sí, pero irregular', en: 'Yes, but irregularly' },
            { value: 'no_publicado', es: 'Tengo grabaciones sin publicar', en: 'Have unpublished recordings' },
            { value: 'no_tiene', es: 'No tengo material grabado', en: 'No recorded material' },
          ]
        },
        {
          id: 'r1_booking', type: 'checkbox', required: true, es: '¿Cómo consigue presentaciones?', en: 'How do you get performances?', options: [
            { value: 'red_personal', es: 'Red de contactos', en: 'Personal network' },
            { value: 'promotores', es: 'Me contactan promotores/venues', en: 'Promoters/venues contact me' },
            { value: 'eventos_propios', es: 'Organizo mis eventos', en: 'I organize my events' },
            { value: 'colectivo', es: 'A través de un colectivo', en: 'Through a collective' },
            { value: 'manager', es: 'Tengo manager/booking agent', en: 'I have a manager/agent' },
            { value: 'no_activo', es: 'No busco activamente', en: 'Not actively seeking' },
          ]
        },
        {
          id: 'r1_rider', type: 'radio', required: true, es: '¿Tiene rider técnico?', en: 'Do you have a technical rider?', options: [
            { value: 'documentado', es: 'Sí, documentado', en: 'Yes, documented' },
            { value: 'no_documentado', es: 'Sé lo que necesito pero no documentado', en: 'Know needs but not documented' },
            { value: 'se_adapta', es: 'Me adapto a lo que haya', en: 'I adapt to whatever is available' },
            { value: 'no_sabe', es: 'No sé qué es un rider técnico', en: 'Don\'t know what that is' },
          ]
        },
        {
          id: 'r1_tarifa', type: 'radio', required: true, es: '¿Rango de tarifa por presentación?', en: 'Fee range per performance?', options: [
            { value: 'gratis', es: 'No cobro', en: 'Free' },
            { value: 'menos_200', es: 'Menos de 200 EUR', en: 'Under 200 EUR' },
            { value: '200_500', es: '200 — 500 EUR', en: '200 — 500 EUR' },
            { value: '500_1500', es: '500 — 1.500 EUR', en: '500 — 1,500 EUR' },
            { value: 'mas_1500', es: 'Más de 1.500 EUR', en: 'Over 1,500 EUR' },
            { value: 'variable', es: 'Variable', en: 'Variable' },
          ]
        },
      ]
    },
    productor: {
      title: 'Productor Musical', subtitle: 'Music Producer Profile',
      questions: [
        {
          id: 'r2_daw', type: 'radio', required: true, es: '¿Qué DAW utiliza?', en: 'What DAW do you use?', options: [
            { value: 'ableton', es: 'Ableton Live', en: 'Ableton Live' },
            { value: 'logic', es: 'Logic Pro', en: 'Logic Pro' },
            { value: 'fl_studio', es: 'FL Studio', en: 'FL Studio' },
            { value: 'pro_tools', es: 'Pro Tools', en: 'Pro Tools' },
            { value: 'cubase', es: 'Cubase / Nuendo', en: 'Cubase / Nuendo' },
            { value: 'otro', es: 'Otro', en: 'Other' },
          ]
        },
        {
          id: 'r2_tipo', type: 'checkbox', required: true, es: '¿Qué tipo de producción realiza?', en: 'What type of production?', options: [
            { value: 'completa', es: 'Producción completa', en: 'Full production' },
            { value: 'beats', es: 'Beatmaking / bases', en: 'Beatmaking' },
            { value: 'grabacion_mezcla', es: 'Grabación y mezcla', en: 'Recording & mixing' },
            { value: 'mezcla_master', es: 'Mezcla y mastering', en: 'Mixing & mastering' },
            { value: 'para_artistas', es: 'Para artistas (sessions)', en: 'For artists (sessions)' },
            { value: 'para_medios', es: 'Para medios (sync)', en: 'For media (sync)' },
          ]
        },
        {
          id: 'r2_sonido', type: 'radio', required: true, es: '¿Tiene un sonido propio?', en: 'Do you have your own sound?', options: [
            { value: 'reconocible', es: 'Sí, reconocible y consistente', en: 'Yes, recognizable' },
            { value: 'en_desarrollo', es: 'En desarrollo', en: 'In development' },
            { value: 'versatil', es: 'Soy versátil', en: 'I\'m versatile' },
            { value: 'sin_direccion', es: 'No lo he pensado', en: 'Haven\'t thought about it' },
          ]
        },
        {
          id: 'r2_output', type: 'radio', required: true, es: '¿Producciones completadas en el último año?', en: 'Completed productions last year?', options: [
            { value: 'ninguna', es: 'Ninguna terminada', en: 'None finished' },
            { value: '1_5', es: '1 a 5', en: '1 to 5' },
            { value: '6_15', es: '6 a 15', en: '6 to 15' },
            { value: 'mas_15', es: 'Más de 15', en: 'More than 15' },
          ]
        },
        {
          id: 'r2_modelo', type: 'radio', required: true, es: '¿Cómo trabaja con otros?', en: 'How do you work with others?', options: [
            { value: 'solo', es: 'Principalmente solo', en: 'Mainly alone' },
            { value: 'colabora_ocasional', es: 'Colaboro ocasionalmente', en: 'Occasional collaboration' },
            { value: 'regular_otros', es: 'Regularmente con otros', en: 'Regularly with others' },
            { value: 'demanda', es: 'Principalmente para otros', en: 'Mainly for others' },
          ]
        },
      ]
    },
    compositor: {
      title: 'Compositor / Arreglista', subtitle: 'Composer / Arranger Profile',
      questions: [
        {
          id: 'r3_tipo', type: 'checkbox', required: true, es: '¿Qué tipo de composición realiza?', en: 'What type of composition?', options: [
            { value: 'canciones', es: 'Canciones completas', en: 'Complete songs' },
            { value: 'arreglos', es: 'Arreglos', en: 'Arrangements' },
            { value: 'instrumental', es: 'Instrumental / orquestal', en: 'Instrumental / orchestral' },
            { value: 'medios', es: 'Para medios (cine, TV)', en: 'For media (film, TV)' },
            { value: 'electronica', es: 'Electrónica / producción creativa', en: 'Electronic / creative production' },
          ]
        },
        {
          id: 'r3_catalogo', type: 'radio', required: true, es: '¿Cuántas composiciones tiene?', en: 'How many compositions?', options: [
            { value: 'menos_5', es: 'Menos de 5', en: 'Under 5' },
            { value: '5_15', es: '5 a 15', en: '5 to 15' },
            { value: '16_50', es: '16 a 50', en: '16 to 50' },
            { value: 'mas_50', es: 'Más de 50', en: 'More than 50' },
          ]
        },
        {
          id: 'r3_coescritura', type: 'radio', required: true, es: '¿Trabaja en co-escritura?', en: 'Do you co-write?', options: [
            { value: 'regularmente', es: 'Sí, regularmente', en: 'Yes, regularly' },
            { value: 'ocasional', es: 'Ocasionalmente', en: 'Occasionally' },
            { value: 'solo', es: 'No, compongo solo/a', en: 'No, I compose alone' },
            { value: 'quiere_no_tiene', es: 'Me gustaría pero no tengo con quién', en: 'Would like to but no one to work with' },
          ]
        },
      ]
    },
    cantante: {
      title: 'Cantante / Vocalista', subtitle: 'Singer / Vocalist Profile',
      questions: [
        { id: 'r4_estilo', type: 'textarea', maxlength: 200, required: true, es: '¿Cómo describiría su voz o estilo vocal?', en: 'How would you describe your voice?' },
        {
          id: 'r4_idiomas', type: 'checkbox', required: true, es: '¿En qué idiomas canta?', en: 'Languages you sing in?', options: [
            { value: 'espanol', es: 'Español', en: 'Spanish' },
            { value: 'ingles', es: 'Inglés', en: 'English' },
            { value: 'aleman', es: 'Alemán', en: 'German' },
            { value: 'portugues', es: 'Portugués', en: 'Portuguese' },
            { value: 'otro', es: 'Otro', en: 'Other' },
          ]
        },
        {
          id: 'r4_letras', type: 'radio', required: true, es: '¿Escribe sus propias letras?', en: 'Write your own lyrics?', options: [
            { value: 'todas', es: 'Escribo todas mis letras', en: 'I write all my lyrics' },
            { value: 'mayoria', es: 'La mayoría, colaboro con letristas', en: 'Most, collaborate with lyricists' },
            { value: 'interprete', es: 'Soy principalmente intérprete', en: 'Mainly a performer' },
            { value: 'ambos', es: 'Ambos por igual', en: 'Both equally' },
          ]
        },
        {
          id: 'r4_estudio', type: 'radio', required: true, es: '¿Experiencia de grabación en estudio?', en: 'Studio recording experience?', options: [
            { value: 'regular_pro', es: 'Regularmente en estudio profesional', en: 'Regularly in professional studio' },
            { value: 'home_studio', es: 'Principalmente home studio', en: 'Mainly home studio' },
            { value: 'pocas_veces', es: 'Pocas veces', en: 'A few times' },
            { value: 'nunca', es: 'Nunca', en: 'Never' },
          ]
        },
        {
          id: 'r4_posicionamiento', type: 'checkbox', required: true, es: '¿Qué tipo de proyectos busca?', en: 'What projects do you seek?', options: [
            { value: 'solista', es: 'Proyecto solista', en: 'Solo project' },
            { value: 'features', es: 'Features y colaboraciones', en: 'Features & collaborations' },
            { value: 'session', es: 'Sesiones para terceros', en: 'Sessions for others' },
            { value: 'live', es: 'Performance en vivo', en: 'Live performance' },
            { value: 'no_claro', es: 'No tengo claro', en: 'Not clear' },
          ]
        },
      ]
    },
    letrista: {
      title: 'Letrista', subtitle: 'Lyricist Profile',
      questions: [
        {
          id: 'r5_tipo', type: 'checkbox', required: true, es: '¿Qué tipo de letras escribe?', en: 'What type of lyrics?', options: [
            { value: 'pop_urbano', es: 'Pop / urbano / indie', en: 'Pop / urban / indie' },
            { value: 'electronica', es: 'Música electrónica', en: 'Electronic music' },
            { value: 'poesia', es: 'Poesía / experimental', en: 'Poetry / experimental' },
            { value: 'medios', es: 'Medios (jingles, publicidad)', en: 'Media (jingles, ads)' },
            { value: 'rap', es: 'Rap / hip-hop', en: 'Rap / hip-hop' },
          ]
        },
        {
          id: 'r5_catalogo', type: 'radio', required: true, es: '¿Cuántas letras completas tiene?', en: 'How many complete lyrics?', options: [
            { value: 'menos_10', es: 'Menos de 10', en: 'Under 10' },
            { value: '10_30', es: '10 a 30', en: '10 to 30' },
            { value: '31_100', es: '31 a 100', en: '31 to 100' },
            { value: 'mas_100', es: 'Más de 100', en: 'More than 100' },
          ]
        },
        {
          id: 'r5_modelo', type: 'radio', required: true, es: '¿Cómo trabaja?', en: 'How do you work?', options: [
            { value: 'independiente', es: 'Independiente — ofrezco letras terminadas', en: 'Independent — offer finished lyrics' },
            { value: 'co_escritura', es: 'Sesiones de co-escritura', en: 'Co-writing sessions' },
            { value: 'ambos', es: 'Ambos modelos', en: 'Both models' },
            { value: 'solo_propio', es: 'Solo para mis proyectos', en: 'Only for my own projects' },
          ]
        },
        {
          id: 'r5_publicadas', type: 'radio', required: true, es: '¿Alguna letra ha sido grabada por otro artista?', en: 'Have any lyrics been recorded by another artist?', options: [
            { value: 'varias', es: 'Sí, más de una vez', en: 'Yes, more than once' },
            { value: 'una', es: 'Sí, una vez', en: 'Yes, once' },
            { value: 'disponibles', es: 'No, pero tengo disponibles', en: 'No, but I have some available' },
            { value: 'solo_para_mi', es: 'No — solo para mí', en: 'No — only for myself' },
          ]
        },
      ]
    },
  };

  return roles.filter(function(r) { return allModules[r]; }).map(function(r) { return allModules[r]; });
}
