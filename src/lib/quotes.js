export const QUOTES = [
  {
    id: 'cyber-1',
    category: 'Cyberpunk',
    difficulty: 'Medium',
    text: 'The sky above the port was the color of television, tuned to a dead channel. Neon reflections cut through the dark rain as machines hummed with electric ambition.',
  },
  {
    id: 'speed-1',
    category: 'Velocity',
    difficulty: 'Easy',
    text: 'Speed is not merely about moving fast; it is about keeping complete clarity while the entire universe blurs into streaks of pure light.',
  },
  {
    id: 'tech-1',
    category: 'Engineering',
    difficulty: 'Medium',
    text: 'Code is like poetry written in logic. Every keystroke is an instruction to silicon crystals pulsing billions of times each second.',
  },
  {
    id: 'gaming-1',
    category: 'Gaming',
    difficulty: 'Easy',
    text: 'Press start to begin. The engine roars, headlights ignite the dark straightaway, and the finish line awaits the swiftest fingers on the grid.',
  },
  {
    id: 'sci-fi-1',
    category: 'Cosmic',
    difficulty: 'Hard',
    text: 'Beyond the orbit of Jupiter, orbital relays synchronized quantum packets across interstellar vacuum, weaving planetary civilizations into a single luminous tapestry.',
  },
  {
    id: 'focus-1',
    category: 'Mindset',
    difficulty: 'Easy',
    text: 'Rhythm beats raw speed every single time. Keep your breath steady, eyes focused on the upcoming words, and let muscle memory lead the race.',
  },
  {
    id: 'matrix-1',
    category: 'Cyberpunk',
    difficulty: 'Medium',
    text: 'You take the blue pill, the story ends and you wake up in your bed. You take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes.',
  },
  {
    id: 'dev-1',
    category: 'Developer',
    difficulty: 'Medium',
    text: 'First solve the problem, then write the code. Premature optimization is the root of all evil, but clean architecture endures across generations.',
  },
  {
    id: 'racing-1',
    category: 'Racing',
    difficulty: 'Easy',
    text: 'Three, two, one, green light! Tires grip the asphalt, nitro ignites in the fuel line, and the speedometer needle climbs past the redline.',
  },
  {
    id: 'arcade-1',
    category: 'Arcade',
    difficulty: 'Hard',
    text: 'Insert coin to continue. High scores are etched in digital memory, immortalizing the fearless champions who mastered the keyboard without missing a single beat.',
  },
  {
    id: 'future-1',
    category: 'Futurism',
    difficulty: 'Medium',
    text: 'The future is already here, it is just not evenly distributed. Those who can articulate thoughts through keyboards at lightning speed command the digital frontier.',
  },
]

export const getRandomQuote = (difficulty) => {
  let pool = QUOTES
  if (difficulty && difficulty !== 'All') {
    pool = QUOTES.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase())
  }
  if (!pool.length) pool = QUOTES
  return pool[Math.floor(Math.random() * pool.length)]
}
