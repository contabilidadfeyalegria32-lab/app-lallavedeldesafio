import { Challenge, Badge, UserProfile, CalendarEvent, NoteItem, HighScore, CommunityPost } from '../types';

export const DEFAULT_AVATAR_URL = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'><rect width='500' height='500' fill='%23ffffff'/><ellipse cx='250' cy='205' rx='98' ry='105' fill='%23678DF8'/><path d='M 80 500 C 80 345, 150 345, 250 345 C 350 345, 420 345, 420 500 Z' fill='%23678DF8'/></svg>";

export const AVATAR_PRESETS = [
  { id: 'av_default', label: 'Silueta Neutra (Azul Predeterminada)', url: DEFAULT_AVATAR_URL },
  { id: 'av1', label: 'Estudiante Tech', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80' },
  { id: 'av2', label: 'Cyber Ninja', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80' },
  { id: 'av3', label: 'Skate & Chill', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80' },
  { id: 'av4', label: 'Creative Artist', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80' },
  { id: 'av5', label: 'Tech Coder', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Rivera',
  username: '@alex_estudiante',
  avatarUrl: DEFAULT_AVATAR_URL,
  level: 5,
  xp: 1850,
  xpToNextLevel: 2500,
  coins: 450,
  streakDays: 8,
  completedChallengesCount: 32,
  activeHours: 24.0,
  selectedTheme: 'indigo',
  title: 'Ninja de las Tareas 🥷',
  unlockedTitles: [
    'Novato Estudiantil 🌱',
    'Ninja de las Tareas 🥷',
    'Cerebro de Exámenes 🎓',
    'Gamer Sabio 🎮',
    'Estudiante VIP ⚡',
    'Leyenda de la Llave 👑'
  ],
  badges: [
    { id: 'b1', name: 'Enfoque Total 🎯', description: 'Completa 5 sesiones de Estudio Pomodoro sin distracciones', category: 'educacion', icon: '🧠', unlocked: true, unlockedAt: '2026-07-20', xpBonus: 150 },
    { id: 'b2', name: 'Atleta Escolar ⚡', description: 'Haz 30 min de deporte o ejercicio antes de hacer tareas', category: 'salud', icon: '🏃‍♂️', unlocked: true, unlockedAt: '2026-07-22', xpBonus: 150 },
    { id: 'b3', name: 'Super Cerebro 📚', description: 'Consigue 100% de efectividad en la Trivia de Conocimiento', category: 'educacion', icon: '🎓', unlocked: true, unlockedAt: '2026-07-23', xpBonus: 200 },
    { id: 'b4', name: 'Creador Digital 🎨', description: 'Publica una nota o tarea completada en el Muro Estudiantil', category: 'entretenimiento', icon: '🎨', unlocked: true, unlockedAt: '2026-07-24', xpBonus: 120 },
    { id: 'b5', name: 'Guardián del Laberinto 🔑', description: 'Completa 3 niveles del minijuego El Laberinto de la Llave', category: 'game', icon: '🎮', unlocked: true, unlockedAt: '2026-07-25', xpBonus: 300 },
    { id: 'b6', name: 'Racha Dorada (8 Días) 🔥', description: 'Mantén una racha ininterrumpida de 8 días de aprendizaje', category: 'general', icon: '🔥', unlocked: true, unlockedAt: '2026-07-25', xpBonus: 250 },
  ]
};

export const INITIAL_CHALLENGES: Challenge[] = [
  // Educación & Estudio (Ideal para jóvenes)
  {
    id: 'c1',
    title: '🍅 Sesión de Enfoque Pomodoro (25 min sin Redes)',
    description: 'Estudia o avanza la tarea sin mirar TikTok, Instagram ni WhatsApp por 25 minutos.',
    category: 'educacion',
    frequency: 'daily',
    xpReward: 120,
    coinReward: 35,
    completed: false,
    iconName: 'Sparkles',
  },
  {
    id: 'c2',
    title: '📝 Hacer Tareas y Repaso de Examen',
    description: 'Avanza en tus tareas pendientes de la escuela o colegio antes de jugar videojuegos.',
    category: 'educacion',
    frequency: 'daily',
    xpReward: 150,
    coinReward: 40,
    completed: false,
    iconName: 'BookOpen',
  },
  {
    id: 'c3',
    title: '🎒 Mochila y Escritorio Listos para Mañana',
    description: 'Deja tu mochila organizada con tus cuadernos, estuche y uniforme listo para el día siguiente.',
    category: 'educacion',
    frequency: 'daily',
    xpReward: 80,
    coinReward: 20,
    completed: false,
    iconName: 'CheckSquare',
  },

  // Salud & Energía
  {
    id: 'c4',
    title: '⚽ 30 Minutos de Deporte, Baile, Gym o Skate',
    description: 'Muévete al aire libre o realiza tu deporte favorito para despejar la mente.',
    category: 'salud',
    frequency: 'daily',
    xpReward: 130,
    coinReward: 30,
    completed: false,
    iconName: 'Activity',
  },
  {
    id: 'c5',
    title: '💧 Hidratación Escolar: 1.5 a 2 Litros de Agua',
    description: 'Toma suficiente agua durante el colegio o instituto para mantenerte fresco y concentrado.',
    category: 'salud',
    frequency: 'daily',
    xpReward: 70,
    coinReward: 15,
    completed: false,
    iconName: 'Droplet',
  },
  {
    id: 'c6',
    title: '🌙 Dormir 8 Horas sin Celular en la Cama',
    description: 'Deja la pantalla 30 minutos antes de dormir para descansar profundo y amanecer con energía.',
    category: 'salud',
    frequency: 'daily',
    xpReward: 100,
    coinReward: 25,
    completed: false,
    iconName: 'Apple',
  },

  // Bienestar & Hábitos
  {
    id: 'c7',
    title: '🧘 10 Minutos de Respiración o Pausa Activa',
    description: 'Relaja tus hombros y ojos después de horas frente a cuadernos o pantallas.',
    category: 'bienestar',
    frequency: 'daily',
    xpReward: 90,
    coinReward: 20,
    completed: false,
    iconName: 'Globe',
  },
  {
    id: 'c8',
    title: '📖 Leer 15 Páginas de Libro, Cómic o Manga',
    description: 'Disfruta la lectura de tu saga o historia favorita fuera del horario escolar.',
    category: 'bienestar',
    frequency: 'weekly',
    xpReward: 220,
    coinReward: 50,
    completed: false,
    iconName: 'BookOpen',
  },

  // Entretenimiento & Creatividad
  {
    id: 'c9',
    title: '🔑 Superar Nivel en El Laberinto de la Llave',
    description: 'Encuentra la llave y supera al menos 1 nivel en el minijuego 2D.',
    category: 'entretenimiento',
    frequency: 'daily',
    xpReward: 110,
    coinReward: 35,
    completed: false,
    iconName: 'Gamepad2',
  },
  {
    id: 'c10',
    title: '🎨 Boceto, Dibujo o Arte Digital de 10 min',
    description: 'Crea un boceto libre, edit o diseño para ejercitar tu lado creativo.',
    category: 'entretenimiento',
    frequency: 'weekly',
    xpReward: 200,
    coinReward: 45,
    completed: false,
    iconName: 'Palette',
  },
];

const todayStr = new Date().toISOString().split('T')[0];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'ev1',
    title: '📐 Examen de Matemáticas (Álgebra & Geometría)',
    date: todayStr,
    time: '09:00 AM',
    type: 'study',
    category: 'educacion',
    color: '#2563eb',
    completed: true,
    notes: 'Traer calculadora científica y regla'
  },
  {
    id: 'ev2',
    title: '🍅 Sesión Pomodoro: Tarea de Historia y Geografía',
    date: todayStr,
    time: '04:00 PM',
    type: 'challenge',
    category: 'educacion',
    color: '#7c3aed',
    completed: true,
    notes: 'Usar Lofi Beats de fondo'
  },
  {
    id: 'ev3',
    title: '🏀 Entrenamiento de Básquetbol / Deporte',
    date: todayStr,
    time: '06:00 PM',
    type: 'gym',
    category: 'salud',
    color: '#059669',
    completed: true,
    notes: 'Llevar termo de agua de 1L'
  },
  {
    id: 'ev4',
    title: '🎮 Torneo de Laberinto con Amigos',
    date: todayStr,
    time: '08:30 PM',
    type: 'custom',
    category: 'entretenimiento',
    color: '#d97706',
    completed: false,
    notes: 'Superar el récord de 1450 pts'
  },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'n1',
    title: '⚡ Guía Rápida de Estudio - Examen de Física',
    content: '1. Fórmula de Velocidad: V = d / t\n2. Fuerza: F = m * a\n3. Repasar ejercicios 1 al 10 de la guía escolar.\n4. Hacer resúmenes en tarjetas con colores.',
    folder: 'Escuela & Exámenes',
    tags: ['física', 'examen', 'resumen', 'escuela'],
    color: '#ecfdf5',
    updatedAt: '2026-07-25 03:20 PM',
    checklists: [
      { id: 'chk1', text: 'Repasar conceptos clave', done: true },
      { id: 'chk2', text: 'Resolver la guía de ejercicios', done: true },
      { id: 'chk3', text: 'Preparar lápices y borrador para mañana', done: false },
    ]
  },
  {
    id: 'n2',
    title: '🎯 Lista de Proyectos Creativos & Juegos',
    content: 'Ideas para el fin de semana:\n- Crear un mapa personalizado en el juego.\n- Aprender 10 frases nuevas en Inglés para gaming en línea.\n- Editar video corto de mejores jugadas.',
    folder: 'Proyectos & Hobbies',
    tags: ['creatividad', 'gaming', 'ideas'],
    color: '#f0fdf4',
    updatedAt: '2026-07-24 07:15 PM'
  },
];

export const INITIAL_HIGH_SCORES: HighScore[] = [
  { id: 'hs1', playerName: 'Alex Rivera (Tú)', score: 1850, timeSeconds: 32, levelReached: 4, date: '2026-07-25' },
  { id: 'hs2', playerName: 'Mateo_Gamer17', score: 1620, timeSeconds: 36, levelReached: 4, date: '2026-07-24' },
  { id: 'hs3', playerName: 'Sofia_Estudiante', score: 1400, timeSeconds: 40, levelReached: 3, date: '2026-07-24' },
  { id: 'hs4', playerName: 'Lucas_Skate', score: 1150, timeSeconds: 48, levelReached: 3, date: '2026-07-23' },
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    username: 'Sofia Martínez',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
    challengeTitle: '🍅 Sesión de Enfoque Pomodoro (25 min)',
    category: 'educacion',
    postType: 'logro',
    subjectTag: '#Matemáticas',
    comment: '¡Estudié 2 sesiones seguidas de Matemáticas sin tocar el celular! Saqué 100% en la guía de álgebra. 📚✨ ¡Vamos por esa racha!',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    likes: 28,
    likedByMe: true,
    timestamp: 'Hace 15 min',
    commentsCount: 2,
    repostsCount: 4,
    reactionBadge: '🧠 Mente Brillante',
    commentsList: [
      {
        id: 'c1',
        username: 'Mateo Gómez',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        text: '¡Increíble Sofi! El temporizador Pomodoro ayuda muchísimo a concentrarse 🔥',
        timestamp: 'Hace 10 min',
        likes: 3,
        likedByMe: true,
      },
      {
        id: 'c2',
        username: 'Elena Torres',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: '¡Felicidades por esa nota! Yo también usé el fondo Lofi hoy para redactar mi ensayo 🎵',
        timestamp: 'Hace 5 min',
        likes: 1,
        likedByMe: false,
      },
    ],
  },
  {
    id: 'p_poll_1',
    username: 'Mateo Gómez',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    challengeTitle: '📊 Encuesta Estudiantil',
    category: 'educacion',
    postType: 'encuesta',
    subjectTag: '#Exámenes',
    comment: 'Compañeros, ¿a qué hora del día sienten que rinden mejor para memorizar y estudiar para los exámenes trimestrales? 🗳️👇',
    likes: 42,
    likedByMe: false,
    timestamp: 'Hace 45 min',
    commentsCount: 3,
    repostsCount: 6,
    reactionBadge: '🎯 Enfoque Pomodoro',
    pollData: {
      question: '¿Cuál es tu horario más productivo para estudiar?',
      options: [
        { id: 'opt1', text: '🌅 En la mañana (fresco y sin ruido)', votes: 18 },
        { id: 'opt2', text: '☀️ En la tarde (al salir de clases)', votes: 12 },
        { id: 'opt3', text: '🌙 En la noche (tranquilidad total)', votes: 25 },
        { id: 'opt4', text: '🦉 En la madrugada (modo búho)', votes: 9 },
      ],
      totalVotes: 64,
    },
    commentsList: [
      {
        id: 'c_p1',
        username: 'Camila Rojas',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
        text: '¡En la noche definitivamente! Con música tranquila sin letra.',
        timestamp: 'Hace 30 min',
        likes: 4,
      }
    ]
  },
  {
    id: 'p_q_1',
    username: 'Camila Rojas',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    challengeTitle: '❓ Pregunta / Duda de Clase',
    category: 'educacion',
    postType: 'pregunta',
    subjectTag: '#Física',
    comment: '¿Alguien me explica la diferencia práctica entre Velocidad y Aceleración de forma sencilla para el examen de mañana? 🧐 ¡Le doy un Me Gusta y estrellas a la mejor respuesta!',
    likes: 19,
    likedByMe: false,
    timestamp: 'Hace 1 hora',
    commentsCount: 2,
    repostsCount: 2,
    reactionBadge: '🧠 Mente Brillante',
    isAnswered: true,
    commentsList: [
      {
        id: 'c_q1',
        username: 'Diego Herrera',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        text: '¡Hola Cami! Imagina que vas en bicicleta: la Velocidad es qué tan rápido avanzas (ej. 20 km/h) y la Aceleración es qué tan rápido pisas el pedal para cambiar de velocidad (ej. pasar de 10 a 20 km/h en 3 segundos) 🚴‍♂️⚡',
        timestamp: 'Hace 40 min',
        likes: 12,
        likedByMe: true,
        isHelpfulAnswer: true,
      }
    ]
  },
  {
    id: 'p_tip_1',
    username: 'Diego Herrera',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    challengeTitle: '💡 Consejo & Método de Estudio',
    category: 'bienestar',
    postType: 'tip',
    subjectTag: '#TipsEstudio',
    comment: '💡 Les comparto mi método de 3 colores para apuntes ordenados:\n1. 🟢 Verde = Conceptos y títulos clave\n2. 🔵 Azul = Explicación y fórmulas\n3. 🟡 Amarillo = Fechas o palabras que entran en el examen.\n¡Me redujo a la mitad el tiempo de repaso!',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
    likes: 45,
    likedByMe: true,
    timestamp: 'Hace 2 horas',
    commentsCount: 4,
    repostsCount: 11,
    reactionBadge: '🎨 Creatividad Escolar',
    commentsList: []
  },
  {
    id: 'p2',
    username: 'Lucas Fernández',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    challengeTitle: '🔑 Superar Nivel en El Laberinto de la Llave',
    category: 'entretenimiento',
    postType: 'logro',
    subjectTag: '#ArcadeGamer',
    comment: '¡Acabo de romper mi récord en el Nivel 4 con 1620 puntos! Gané la insignia de Guardián del Laberinto 🎮🗝️',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    likes: 38,
    likedByMe: false,
    timestamp: 'Hace 3 horas',
    commentsCount: 1,
    repostsCount: 7,
    reactionBadge: '⚡ Récord Gamer',
    commentsList: [
      {
        id: 'c3',
        username: 'Alex Rivera (Tú)',
        avatarUrl: DEFAULT_AVATAR_URL,
        text: '¡Buena jugada Lucas! Te reto a superarlo en la Trivia Estudiantil también 🧠',
        timestamp: 'Hace 2 horas',
        likes: 5,
        likedByMe: true,
      }
    ],
  },
  {
    id: 'p_rec_1',
    username: 'Valentina Silva',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    challengeTitle: '🎵 Recomendación Lofi & Concentración',
    category: 'entretenimiento',
    postType: 'recomendacion',
    subjectTag: '#MúsicaEnfoque',
    comment: '🎵 Les recomiendo buscar "Lofi Hip Hop Beats - Study/Relax" en YouTube para estudiar en las noches. Acompañado del temporizador Pomodoro de la app de 25 min no sientes el cansancio 🎧☕',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    likes: 31,
    likedByMe: false,
    timestamp: 'Hace 4 horas',
    commentsCount: 2,
    repostsCount: 5,
    reactionBadge: '🔥 Racha Inmortal',
    commentsList: []
  }
];

