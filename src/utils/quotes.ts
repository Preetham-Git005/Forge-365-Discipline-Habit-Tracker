import type { DisciplineQuote } from '../types';

export const DISCIPLINE_QUOTES: DisciplineQuote[] = [
  {
    id: 'q1',
    text: "At dawn, when you have trouble getting out of bed, tell yourself: 'I have to go to work — as a human being.'",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "stoicism"
  },
  {
    id: 'q2',
    text: "Discipline equals freedom.",
    author: "Jocko Willink",
    source: "Discipline Equals Freedom: Field Manual",
    category: "willpower"
  },
  {
    id: 'q3',
    text: "No man is free who is not master of himself.",
    author: "Epictetus",
    source: "Discourses",
    category: "stoicism"
  },
  {
    id: 'q4',
    text: "We don't rise to the level of our expectations, we fall to the level of our training.",
    author: "Archilochus",
    category: "mastery"
  },
  {
    id: 'q5',
    text: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    source: "Atomic Habits",
    category: "focus"
  },
  {
    id: 'q6',
    text: "He who has a why to live can bear almost any how.",
    author: "Friedrich Nietzsche",
    source: "Twilight of the Idols",
    category: "resilience"
  },
  {
    id: 'q7',
    text: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.",
    author: "Miyamoto Musashi",
    source: "The Book of Five Rings",
    category: "mastery"
  },
  {
    id: 'q8',
    text: "The first and greatest victory is to conquer yourself.",
    author: "Plato",
    category: "willpower"
  },
  {
    id: 'q9',
    text: "Suffering is the true test of life. We must build calluses on our minds through daily discipline.",
    author: "David Goggins",
    source: "Can't Hurt Me",
    category: "willpower"
  },
  {
    id: 'q10',
    text: "Waste no more time arguing what a good man should be. Be one.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "stoicism"
  },
  {
    id: 'q11',
    text: "It is not that we have a short time to live, but that we waste a lot of it.",
    author: "Seneca",
    source: "On the Shortness of Life",
    category: "focus"
  },
  {
    id: 'q12',
    text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.",
    author: "Bruce Lee",
    category: "mastery"
  },
  {
    id: 'q13',
    text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
    author: "John C. Maxwell",
    category: "focus"
  },
  {
    id: 'q14',
    text: "Difficulties strengthen the mind, as labor does the body.",
    author: "Seneca",
    source: "Letters from a Stoic",
    category: "resilience"
  },
  {
    id: 'q15',
    text: "Today I will do what others won't, so tomorrow I can accomplish what others can't.",
    author: "Jerry Rice",
    category: "willpower"
  }
];

export const getRandomQuote = (): DisciplineQuote => {
  const index = Math.floor(Math.random() * DISCIPLINE_QUOTES.length);
  return DISCIPLINE_QUOTES[index];
};
