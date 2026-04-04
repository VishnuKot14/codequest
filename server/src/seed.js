/**
 * Database seed script — populates initial lesson content.
 * Run with: npm run db:seed (from the server/ folder)
 *
 * This is separate from migrations. Migrations change the schema structure;
 * seeds populate the data. Think of it like: migration builds the shelves,
 * seed puts the books on them.
 */

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const PYTHON_LESSONS = [
  {
    id: 'python-1',
    language: 'python',
    regionId: 'python',
    title: 'Hello, World!',
    order: 1,
    xpReward: 50,
    description: `## Your First Quest: Hello, World!

Every adventurer starts the same way — by making the world hear them.

In Python, you output text with the **print()** function:

\`\`\`python
print("Hello, World!")
\`\`\`

### Your Mission
Write a program that prints exactly:
\`\`\`
Hello, Quest!
\`\`\``,
    starterCode: '# Write your code below\n',
    hint: 'Use print() with the exact text "Hello, Quest!" inside quotes.',
    tests: [{ description: 'Output contains "Hello, Quest!"', expected: 'Hello, Quest!' }],
  },
  {
    id: 'python-2',
    language: 'python',
    regionId: 'python',
    title: 'Variables & Numbers',
    order: 2,
    xpReward: 75,
    description: `## Quest 2: Variables & Numbers

Variables store values. In Python you don't need to declare a type — just assign!

\`\`\`python
hero_name = "Gandalf"
hero_level = 20
print(hero_name, "is level", hero_level)
\`\`\`

### Your Mission
Create two variables:
- \`attack\` with value \`42\`
- \`defense\` with value \`17\`

Then print their sum with: \`print(attack + defense)\``,
    starterCode: '# Create your variables here\n',
    hint: 'Create attack = 42 and defense = 17, then print(attack + defense)',
    tests: [{ description: 'Output is 59', expected: '59' }],
  },
  {
    id: 'python-3',
    language: 'python',
    regionId: 'python',
    title: 'If/Else: The Choice',
    order: 3,
    xpReward: 100,
    description: `## Quest 3: Making Decisions

The \`if/else\` statement lets your code choose different paths — like a fork in the dungeon.

\`\`\`python
gold = 100
if gold >= 50:
    print("You can afford the sword!")
else:
    print("Not enough gold.")
\`\`\`

### Your Mission
Write code that checks if \`health = 30\` is below 50.
- If it is, print: \`Low health! Use a potion!\`
- If not, print: \`Health is fine.\``,
    starterCode: 'health = 30\n# Write your if/else below\n',
    hint: 'Use: if health < 50: then print the warning message',
    tests: [{ description: 'Prints the low health warning', expected: 'Low health! Use a potion!' }],
  },
]

const JS_LESSONS = [
  {
    id: 'javascript-1',
    language: 'javascript',
    regionId: 'javascript',
    title: 'Enter the JS Jungle',
    order: 1,
    xpReward: 50,
    description: `## Welcome to the JavaScript Jungle

JavaScript is the language of the web. Unlike Python, you need \`console.log()\` to print:

\`\`\`javascript
console.log("Hello from JS!")
\`\`\`

### Your Mission
Print: \`JavaScript is powerful!\``,
    starterCode: '// Write your code here\n',
    hint: 'Use console.log() with the exact text inside quotes',
    tests: [{ description: 'Output contains "JavaScript is powerful!"', expected: 'JavaScript is powerful!' }],
  },
]

async function seed() {
  console.log('🌱 Seeding database...')

  // Create all Python lessons (upsert = create or update if exists)
  for (const lesson of [...PYTHON_LESSONS, ...JS_LESSONS]) {
    const { tests, ...lessonData } = lesson
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: lessonData,
      create: {
        ...lessonData,
        tests: { create: tests }
      }
    })
    console.log(`  ✓ ${lesson.id}: ${lesson.title}`)
  }

  // Create shop items
  const shopItems = [
    { id: 'item-helm-iron',    name: 'Iron Helm',        emoji: '⛑',  slot: 'helmet', cost: 200,  statBonus: '+5% XP',       rarity: 'common' },
    { id: 'item-helm-mage',    name: 'Mage Crown',       emoji: '👑',  slot: 'helmet', cost: 500,  statBonus: '+12% XP',      rarity: 'rare' },
    { id: 'item-helm-dragon',  name: 'Dragon Helm',      emoji: '🐲',  slot: 'helmet', cost: 1200, statBonus: '+20% XP',      rarity: 'epic' },
    { id: 'item-armor-leather',name: 'Leather Armor',    emoji: '🧥',  slot: 'armor',  cost: 150,  statBonus: '+3% XP',       rarity: 'common' },
    { id: 'item-armor-chain',  name: 'Chainmail',        emoji: '🛡',  slot: 'armor',  cost: 400,  statBonus: '+10% XP',      rarity: 'rare' },
    { id: 'item-armor-void',   name: 'Void Plate',       emoji: '🌑',  slot: 'armor',  cost: 1500, statBonus: '+25% XP',      rarity: 'legendary' },
    { id: 'item-weapon-staff', name: 'Wizard Staff',     emoji: '🪄',  slot: 'weapon', cost: 300,  statBonus: '+8% XP',       rarity: 'common' },
    { id: 'item-weapon-sword', name: 'Flame Sword',      emoji: '🗡',  slot: 'weapon', cost: 600,  statBonus: '+15% XP',      rarity: 'rare' },
    { id: 'item-weapon-excal', name: 'Excalibyte',       emoji: '⚡',  slot: 'weapon', cost: 2000, statBonus: '+30% XP',      rarity: 'legendary' },
    { id: 'item-boots-swift',  name: 'Swift Boots',      emoji: '👟',  slot: 'boots',  cost: 250,  statBonus: '+5% speed XP', rarity: 'common' },
    { id: 'item-boots-storm',  name: 'Stormwalkers',     emoji: '⛈',  slot: 'boots',  cost: 700,  statBonus: '+15% speed XP',rarity: 'epic' },
    { id: 'item-amulet-luck',  name: 'Lucky Charm',      emoji: '🍀',  slot: 'amulet', cost: 350,  statBonus: '+8% points',   rarity: 'rare' },
    { id: 'item-amulet-void',  name: 'Void Crystal',     emoji: '💎',  slot: 'amulet', cost: 1000, statBonus: '+20% points',  rarity: 'epic' },
    { id: 'item-ring-focus',   name: 'Ring of Focus',    emoji: '💍',  slot: 'ring',   cost: 450,  statBonus: '-10% hint cost',rarity: 'rare' },
    { id: 'item-ring-legend',  name: 'Ouroboros Ring',   emoji: '🐍',  slot: 'ring',   cost: 1800, statBonus: 'Double duel XP',rarity: 'legendary' },
  ]

  for (const item of shopItems) {
    await prisma.shopItem.upsert({ where: { id: item.id }, update: item, create: item })
    console.log(`  ✓ Shop item: ${item.name}`)
  }

  // Create starter achievements
  const achievements = [
    { id: 'first-quest',   title: 'First Blood',      emoji: '⚔️', description: 'Complete your first lesson', condition: 'complete_1_lesson',    xpReward: 0 },
    { id: 'python-start',  title: 'Snake Charmer',    emoji: '🐍', description: 'Complete 5 Python lessons',  condition: 'complete_5_python',    xpReward: 100 },
    { id: 'speedster',     title: 'Lightning Fingers', emoji: '⚡', description: 'Complete a lesson in under 60 seconds', condition: 'fast_lesson', xpReward: 50 },
    { id: 'first-duel',    title: 'Challenger',       emoji: '🥊', description: 'Win your first duel',        condition: 'win_1_duel',           xpReward: 150 },
  ]

  for (const ach of achievements) {
    await prisma.achievement.upsert({ where: { id: ach.id }, update: ach, create: ach })
    console.log(`  ✓ Achievement: ${ach.title}`)
  }

  console.log('✅ Seed complete!')
}

seed()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
