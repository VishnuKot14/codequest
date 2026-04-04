import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// ─────────────────────────────────────────────────────────────
// PYTHON — 12 lessons covering all core fundamentals
// ─────────────────────────────────────────────────────────────
const PYTHON_LESSONS = [
  {
    id: 'python-1', language: 'python', regionId: 'python',
    title: 'Hello, World!', order: 1, xpReward: 50, isBoss: false,
    description: `## Quest 1: Hello, World!

Every adventurer starts by making the world hear them.

In Python, you print text with the **print()** function:

\`\`\`python
print("Hello, World!")
\`\`\`

### Your Mission
Print exactly:
\`\`\`
Hello, Quest!
\`\`\``,
    starterCode: '# Write your code below\n',
    hint: 'Use print("Hello, Quest!") — exact text, including the exclamation mark.',
    tests: [{ description: 'Output contains "Hello, Quest!"', expected: 'Hello, Quest!' }],
  },
  {
    id: 'python-2', language: 'python', regionId: 'python',
    title: 'Variables & Numbers', order: 2, xpReward: 75, isBoss: false,
    description: `## Quest 2: Variables & Numbers

Variables store values. In Python you don't declare types — just assign:

\`\`\`python
hero_name = "Gandalf"
hero_level = 20
print(hero_level * 2)
\`\`\`

### Your Mission
Create two variables:
- \`attack\` = 42
- \`defense\` = 17

Then print their sum: \`print(attack + defense)\``,
    starterCode: '# Create your variables here\n',
    hint: 'attack = 42 then defense = 17 then print(attack + defense)',
    tests: [{ description: 'Output is 59', expected: '59' }],
  },
  {
    id: 'python-3', language: 'python', regionId: 'python',
    title: 'If / Else', order: 3, xpReward: 100, isBoss: false,
    description: `## Quest 3: Making Decisions

\`if/else\` lets your code take different paths:

\`\`\`python
gold = 100
if gold >= 50:
    print("You can afford the sword!")
else:
    print("Not enough gold.")
\`\`\`

### Your Mission
\`health = 30\` is already set. Check if it's below 50:
- If yes → print: \`Low health! Use a potion!\`
- If no  → print: \`Health is fine.\``,
    starterCode: 'health = 30\n# Write your if/else below\n',
    hint: 'if health < 50: then print the low health message',
    tests: [{ description: 'Prints low health warning', expected: 'Low health! Use a potion!' }],
  },
  {
    id: 'python-4', language: 'python', regionId: 'python',
    title: 'For Loops', order: 4, xpReward: 100, isBoss: false,
    description: `## Quest 4: For Loops

A \`for\` loop repeats code for each item in a sequence:

\`\`\`python
for i in range(3):
    print(i)
# prints 0, 1, 2
\`\`\`

\`range(start, stop)\` generates numbers from start up to (but not including) stop.

### Your Mission
Print the numbers 1 through 5, one per line using a for loop.`,
    starterCode: '# Use a for loop with range()\n',
    hint: 'range(1, 6) gives you 1, 2, 3, 4, 5',
    tests: [{ description: 'Output contains 1 through 5', expected: '1\n2\n3\n4\n5' }],
  },
  {
    id: 'python-5', language: 'python', regionId: 'python',
    title: 'While Loops', order: 5, xpReward: 100, isBoss: false,
    description: `## Quest 5: While Loops

A \`while\` loop keeps running as long as a condition is true:

\`\`\`python
count = 0
while count < 3:
    print(count)
    count += 1
# prints 0, 1, 2
\`\`\`

### Your Mission
Start with \`count = 1\`. Use a while loop to print count while it's <= 5, incrementing by 1 each time.`,
    starterCode: 'count = 1\n# Write your while loop\n',
    hint: 'while count <= 5: print(count) then count += 1',
    tests: [{ description: 'Prints 1 through 5', expected: '1\n2\n3\n4\n5' }],
  },
  {
    id: 'python-6', language: 'python', regionId: 'python',
    title: 'Functions', order: 6, xpReward: 125, isBoss: false,
    description: `## Quest 6: Functions

Functions are reusable blocks of code. Define with \`def\`:

\`\`\`python
def greet(name):
    return "Hello, " + name

print(greet("Hero"))  # Hello, Hero
\`\`\`

### Your Mission
Define a function \`multiply(a, b)\` that returns \`a * b\`.
Then print the result of \`multiply(6, 7)\`.`,
    starterCode: '# Define your function here\n\n# Then call it\n',
    hint: 'def multiply(a, b): return a * b — then print(multiply(6, 7))',
    tests: [{ description: 'Output is 42', expected: '42' }],
  },
  {
    id: 'python-7', language: 'python', regionId: 'python',
    title: 'Lists', order: 7, xpReward: 125, isBoss: false,
    description: `## Quest 7: Lists

Lists store multiple values in order:

\`\`\`python
weapons = ["sword", "bow", "staff"]
weapons.append("dagger")
print(weapons[0])  # sword
print(len(weapons))  # 4
\`\`\`

### Your Mission
Create a list \`heroes\` with: \`"Warrior"\`, \`"Mage"\`, \`"Ranger"\`.
Then:
1. Append \`"Paladin"\` to the list
2. Print the length of the list`,
    starterCode: 'heroes = ["Warrior", "Mage", "Ranger"]\n# Append Paladin then print the length\n',
    hint: 'Use heroes.append("Paladin") then print(len(heroes))',
    tests: [{ description: 'Output is 4', expected: '4' }],
  },
  {
    id: 'python-8', language: 'python', regionId: 'python',
    title: 'Dictionaries', order: 8, xpReward: 125, isBoss: false,
    description: `## Quest 8: Dictionaries

Dictionaries store key-value pairs — like a character sheet:

\`\`\`python
hero = {"name": "Aria", "level": 5, "hp": 100}
print(hero["name"])  # Aria
hero["hp"] = 80
\`\`\`

### Your Mission
Create a dictionary \`stats\` with:
- \`"strength"\`: 15
- \`"agility"\`: 12
- \`"intelligence"\`: 18

Then print the value of \`"intelligence"\`.`,
    starterCode: '# Create your stats dictionary\n',
    hint: 'stats = {"strength": 15, "agility": 12, "intelligence": 18} then print(stats["intelligence"])',
    tests: [{ description: 'Output is 18', expected: '18' }],
  },
  {
    id: 'python-9', language: 'python', regionId: 'python',
    title: 'String Methods', order: 9, xpReward: 125, isBoss: false,
    description: `## Quest 9: String Methods

Strings have built-in methods for manipulation:

\`\`\`python
name = "  hero  "
print(name.strip())       # "hero"
print(name.upper())       # "  HERO  "
print("quest".replace("u", "o"))  # "qoest"
\`\`\`

### Your Mission
Given \`message = "  welcome to codequest  "\`:
1. Strip the whitespace
2. Convert to uppercase
3. Print the result`,
    starterCode: 'message = "  welcome to codequest  "\n# Strip then uppercase then print\n',
    hint: 'print(message.strip().upper())',
    tests: [{ description: 'Output is WELCOME TO CODEQUEST', expected: 'WELCOME TO CODEQUEST' }],
  },
  {
    id: 'python-10', language: 'python', regionId: 'python',
    title: 'List Comprehensions', order: 10, xpReward: 150, isBoss: false,
    description: `## Quest 10: List Comprehensions

List comprehensions create lists in one line — a powerful Python feature:

\`\`\`python
squares = [x * x for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]

evens = [x for x in range(10) if x % 2 == 0]
\`\`\`

### Your Mission
Create a list \`doubled\` containing each number in \`[1, 2, 3, 4, 5]\` multiplied by 2.
Print the list.`,
    starterCode: 'numbers = [1, 2, 3, 4, 5]\n# Create doubled using a list comprehension\n',
    hint: 'doubled = [x * 2 for x in numbers] then print(doubled)',
    tests: [{ description: 'Output is [2, 4, 6, 8, 10]', expected: '[2, 4, 6, 8, 10]' }],
  },
  {
    id: 'python-11', language: 'python', regionId: 'python',
    title: 'Error Handling', order: 11, xpReward: 150, isBoss: false,
    description: `## Quest 11: Error Handling

Use \`try/except\` to handle errors gracefully instead of crashing:

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")
\`\`\`

### Your Mission
Wrap \`int("not_a_number")\` in a try/except block.
Catch the \`ValueError\` and print: \`Invalid number!\``,
    starterCode: '# Write your try/except block\n',
    hint: 'try: int("not_a_number") except ValueError: print("Invalid number!")',
    tests: [{ description: 'Prints Invalid number!', expected: 'Invalid number!' }],
  },
  {
    id: 'python-12', language: 'python', regionId: 'python',
    title: 'Classes & OOP', order: 12, xpReward: 200, isBoss: true,
    description: `## Boss Quest: Classes & OOP

Classes are blueprints for objects. This is Object-Oriented Programming:

\`\`\`python
class Hero:
    def __init__(self, name, level):
        self.name = name
        self.level = level

    def describe(self):
        return f"{self.name} is level {self.level}"

h = Hero("Aria", 5)
print(h.describe())
\`\`\`

### Your Mission
Create a class \`Dragon\` with:
- \`__init__(self, name, hp)\` that sets \`self.name\` and \`self.hp\`
- A method \`roar(self)\` that returns \`f"{self.name} roars with {self.hp} HP!"\`

Create a Dragon named \`"Inferno"\` with \`250\` HP and print its roar.`,
    starterCode: '# Define your Dragon class\n\n# Create an instance and print its roar\n',
    hint: 'class Dragon: def __init__... def roar... then d = Dragon("Inferno", 250) print(d.roar())',
    tests: [{ description: 'Output contains Inferno roars with 250 HP!', expected: 'Inferno roars with 250 HP!' }],
  },
]

// ─────────────────────────────────────────────────────────────
// JAVASCRIPT — 15 lessons
// ─────────────────────────────────────────────────────────────
const JS_LESSONS = [
  {
    id: 'javascript-1', language: 'javascript', regionId: 'javascript',
    title: 'Enter the JS Jungle', order: 1, xpReward: 50, isBoss: false,
    description: `## Quest 1: Enter the JS Jungle

JavaScript uses \`console.log()\` to print output:

\`\`\`javascript
console.log("Hello, World!")
\`\`\`

### Your Mission
Print: \`JavaScript is powerful!\``,
    starterCode: '// Write your code here\n',
    hint: 'console.log("JavaScript is powerful!")',
    tests: [{ description: 'Output contains JavaScript is powerful!', expected: 'JavaScript is powerful!' }],
  },
  {
    id: 'javascript-2', language: 'javascript', regionId: 'javascript',
    title: 'let & const', order: 2, xpReward: 75, isBoss: false,
    description: `## Quest 2: let & const

JavaScript has two modern ways to declare variables:

\`\`\`javascript
let score = 10        // can be reassigned
const MAX_HP = 100    // cannot be reassigned
score = 20            // OK
\`\`\`

Use \`const\` by default; use \`let\` when you need to reassign.

### Your Mission
Declare \`const name = "Hero"\` and \`let level = 1\`.
Reassign level to \`5\`, then print: \`Hero is level 5\``,
    starterCode: '// Declare your variables\n',
    hint: 'const name = "Hero" then let level = 1 then level = 5 then console.log(name + " is level " + level)',
    tests: [{ description: 'Output is Hero is level 5', expected: 'Hero is level 5' }],
  },
  {
    id: 'javascript-3', language: 'javascript', regionId: 'javascript',
    title: 'Template Literals', order: 3, xpReward: 75, isBoss: false,
    description: `## Quest 3: Template Literals

Template literals let you embed variables in strings using backticks:

\`\`\`javascript
const name = "Hero"
const level = 10
console.log(\`\${name} is level \${level}\`)
// Hero is level 10
\`\`\`

### Your Mission
Create \`const weapon = "Excalibyte"\` and \`const damage = 42\`.
Print: \`Excalibyte deals 42 damage!\` using a template literal.`,
    starterCode: '// Use template literals\n',
    hint: 'console.log(`${weapon} deals ${damage} damage!`)',
    tests: [{ description: 'Output is Excalibyte deals 42 damage!', expected: 'Excalibyte deals 42 damage!' }],
  },
  {
    id: 'javascript-4', language: 'javascript', regionId: 'javascript',
    title: 'If / Else', order: 4, xpReward: 100, isBoss: false,
    description: `## Quest 4: If / Else

\`\`\`javascript
const gold = 80
if (gold >= 100) {
  console.log("Buy the armor!")
} else if (gold >= 50) {
  console.log("Buy the potion!")
} else {
  console.log("Save your gold.")
}
\`\`\`

### Your Mission
\`const score = 75\` is set. Print:
- \`"Grade: A"\` if score >= 90
- \`"Grade: B"\` if score >= 75
- \`"Grade: C"\` otherwise`,
    starterCode: 'const score = 75\n// Write your if/else if/else\n',
    hint: 'if (score >= 90) ... else if (score >= 75) console.log("Grade: B")',
    tests: [{ description: 'Output is Grade: B', expected: 'Grade: B' }],
  },
  {
    id: 'javascript-5', language: 'javascript', regionId: 'javascript',
    title: 'For Loops', order: 5, xpReward: 100, isBoss: false,
    description: `## Quest 5: For Loops

\`\`\`javascript
for (let i = 0; i < 3; i++) {
  console.log(i)
}
// 0, 1, 2
\`\`\`

A for loop has three parts: initializer, condition, increment.

### Your Mission
Print the numbers 1 through 5 using a for loop.`,
    starterCode: '// Write your for loop\n',
    hint: 'for (let i = 1; i <= 5; i++) { console.log(i) }',
    tests: [{ description: 'Prints 1 through 5', expected: '1\n2\n3\n4\n5' }],
  },
  {
    id: 'javascript-6', language: 'javascript', regionId: 'javascript',
    title: 'Functions', order: 6, xpReward: 125, isBoss: false,
    description: `## Quest 6: Functions

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!"
}
console.log(greet("Hero"))
\`\`\`

### Your Mission
Write a function \`power(base, exp)\` that returns \`base ** exp\`.
Print the result of \`power(2, 8)\`.`,
    starterCode: '// Define your function\n\n// Call it\n',
    hint: 'function power(base, exp) { return base ** exp } then console.log(power(2, 8))',
    tests: [{ description: 'Output is 256', expected: '256' }],
  },
  {
    id: 'javascript-7', language: 'javascript', regionId: 'javascript',
    title: 'Arrays', order: 7, xpReward: 125, isBoss: false,
    description: `## Quest 7: Arrays

Arrays hold ordered lists of values:

\`\`\`javascript
const spells = ["fire", "ice", "lightning"]
spells.push("void")
console.log(spells.length)  // 4
console.log(spells[0])      // fire
\`\`\`

### Your Mission
Create \`const items = ["sword", "shield", "potion"]\`.
Push \`"scroll"\` to the array, then print its length.`,
    starterCode: 'const items = ["sword", "shield", "potion"]\n// Push scroll then print length\n',
    hint: 'items.push("scroll") then console.log(items.length)',
    tests: [{ description: 'Output is 4', expected: '4' }],
  },
  {
    id: 'javascript-8', language: 'javascript', regionId: 'javascript',
    title: 'Objects', order: 8, xpReward: 125, isBoss: false,
    description: `## Quest 8: Objects

Objects store key-value pairs:

\`\`\`javascript
const hero = { name: "Aria", level: 5, hp: 100 }
console.log(hero.name)    // Aria
hero.hp = 80              // update a property
\`\`\`

### Your Mission
Create a \`const player\` object with \`name: "Zara"\`, \`class: "Mage"\`, \`mana: 200\`.
Print: \`Zara the Mage has 200 mana\` using the object's properties.`,
    starterCode: '// Create your player object\n',
    hint: 'console.log(`${player.name} the ${player.class} has ${player.mana} mana`)',
    tests: [{ description: 'Output is Zara the Mage has 200 mana', expected: 'Zara the Mage has 200 mana' }],
  },
  {
    id: 'javascript-9', language: 'javascript', regionId: 'javascript',
    title: 'Arrow Functions', order: 9, xpReward: 125, isBoss: false,
    description: `## Quest 9: Arrow Functions

Arrow functions are a shorter way to write functions:

\`\`\`javascript
// Traditional
function add(a, b) { return a + b }

// Arrow
const add = (a, b) => a + b
const double = n => n * 2   // single param, no parens needed
\`\`\`

### Your Mission
Write an arrow function \`const square = n => ...\` that returns \`n * n\`.
Print \`square(9)\`.`,
    starterCode: '// Write your arrow function\n',
    hint: 'const square = n => n * n then console.log(square(9))',
    tests: [{ description: 'Output is 81', expected: '81' }],
  },
  {
    id: 'javascript-10', language: 'javascript', regionId: 'javascript',
    title: 'Array Methods', order: 10, xpReward: 150, isBoss: false,
    description: `## Quest 10: Array Methods

JavaScript arrays have powerful built-in methods:

\`\`\`javascript
const nums = [1, 2, 3, 4, 5]
const doubled = nums.map(n => n * 2)      // [2,4,6,8,10]
const evens   = nums.filter(n => n % 2 === 0) // [2,4]
const total   = nums.reduce((sum, n) => sum + n, 0) // 15
\`\`\`

### Your Mission
Given \`const nums = [1, 2, 3, 4, 5, 6]\`:
Use \`.filter()\` to get only even numbers, then print the result.`,
    starterCode: 'const nums = [1, 2, 3, 4, 5, 6]\n// Filter for evens and print\n',
    hint: 'console.log(nums.filter(n => n % 2 === 0))',
    tests: [{ description: 'Output contains 2, 4, 6', expected: '[ 2, 4, 6 ]' }],
  },
  {
    id: 'javascript-11', language: 'javascript', regionId: 'javascript',
    title: 'Destructuring', order: 11, xpReward: 150, isBoss: false,
    description: `## Quest 11: Destructuring

Destructuring extracts values from arrays and objects in one line:

\`\`\`javascript
const [first, second] = [10, 20, 30]
console.log(first)   // 10

const { name, level } = { name: "Hero", level: 5, hp: 100 }
console.log(name)    // Hero
\`\`\`

### Your Mission
Given \`const hero = { name: "Zephyr", weapon: "Staff", power: 88 }\`,
destructure \`name\` and \`power\` from it and print: \`Zephyr has power 88\``,
    starterCode: 'const hero = { name: "Zephyr", weapon: "Staff", power: 88 }\n// Destructure and print\n',
    hint: 'const { name, power } = hero then console.log(`${name} has power ${power}`)',
    tests: [{ description: 'Output is Zephyr has power 88', expected: 'Zephyr has power 88' }],
  },
  {
    id: 'javascript-12', language: 'javascript', regionId: 'javascript',
    title: 'Spread & Rest', order: 12, xpReward: 150, isBoss: false,
    description: `## Quest 12: Spread & Rest

**Spread** expands an array/object. **Rest** collects multiple values:

\`\`\`javascript
const a = [1, 2, 3]
const b = [...a, 4, 5]      // [1,2,3,4,5]

function sum(...nums) {      // rest: collects all args
  return nums.reduce((t, n) => t + n, 0)
}
console.log(sum(1, 2, 3, 4)) // 10
\`\`\`

### Your Mission
Write a function \`sum(...nums)\` using rest params that returns the sum of all arguments.
Print \`sum(10, 20, 30)\`.`,
    starterCode: '// Write sum using rest params\n',
    hint: 'function sum(...nums) { return nums.reduce((t, n) => t + n, 0) } then console.log(sum(10, 20, 30))',
    tests: [{ description: 'Output is 60', expected: '60' }],
  },
  {
    id: 'javascript-13', language: 'javascript', regionId: 'javascript',
    title: 'Promises & Async/Await', order: 13, xpReward: 175, isBoss: false,
    description: `## Quest 13: Async/Await

Async functions let you write asynchronous code that reads like synchronous code:

\`\`\`javascript
async function fetchData() {
  return "data loaded"
}

async function main() {
  const result = await fetchData()
  console.log(result)
}
main()
\`\`\`

### Your Mission
Write an async function \`getHero()\` that returns \`"Hero: Aria"\`.
Write another async function \`main()\` that awaits \`getHero()\` and prints the result.
Call \`main()\`.`,
    starterCode: '// Write your async functions\n',
    hint: 'async function getHero() { return "Hero: Aria" } async function main() { const h = await getHero(); console.log(h) } main()',
    tests: [{ description: 'Output is Hero: Aria', expected: 'Hero: Aria' }],
  },
  {
    id: 'javascript-14', language: 'javascript', regionId: 'javascript',
    title: 'Classes', order: 14, xpReward: 175, isBoss: false,
    description: `## Quest 14: Classes

JavaScript classes are blueprints for objects:

\`\`\`javascript
class Spell {
  constructor(name, damage) {
    this.name = name
    this.damage = damage
  }
  cast() {
    return \`Cast \${this.name} for \${this.damage} damage!\`
  }
}
const fireball = new Spell("Fireball", 80)
console.log(fireball.cast())
\`\`\`

### Your Mission
Create a class \`Hero\` with \`constructor(name, hp)\` and a method \`status()\` that returns \`"{name} has {hp} HP"\`.
Create a Hero \`"Aria"\` with \`150\` HP and print their status.`,
    starterCode: '// Define your Hero class\n',
    hint: 'class Hero { constructor(name, hp)... status() { return `${this.name} has ${this.hp} HP` } }',
    tests: [{ description: 'Output is Aria has 150 HP', expected: 'Aria has 150 HP' }],
  },
  {
    id: 'javascript-15', language: 'javascript', regionId: 'javascript',
    title: 'Boss: The Async Dragon', order: 15, xpReward: 250, isBoss: true,
    description: `## Boss Quest: The Async Dragon

Defeat the Async Dragon by combining classes, array methods, and async/await!

### Your Mission
1. Create an array \`const scores = [85, 92, 78, 95, 60]\`
2. Use \`.filter()\` to get scores >= 80, then \`.reduce()\` to sum them
3. Write an async function \`getResult()\` that returns the sum
4. In \`main()\`, await \`getResult()\` and print: \`Top scores total: {sum}\`

Call \`main()\`.`,
    starterCode: 'const scores = [85, 92, 78, 95, 60]\n// Filter, reduce, async/await\n',
    hint: 'Filter scores >= 80, reduce to sum, return from async getResult(), print in main()',
    tests: [{ description: 'Output is Top scores total: 272', expected: 'Top scores total: 272' }],
  },
]

// ─────────────────────────────────────────────────────────────
// TYPESCRIPT — 14 lessons
// ─────────────────────────────────────────────────────────────
const TS_LESSONS = [
  {
    id: 'typescript-1', language: 'typescript', regionId: 'typescript',
    title: 'Hello, TypeScript!', order: 1, xpReward: 50, isBoss: false,
    description: `## Quest 1: Hello, TypeScript!

TypeScript is JavaScript with types. It catches errors before you run the code.

\`\`\`typescript
const message: string = "Hello!"
console.log(message)
\`\`\`

The \`: string\` is a **type annotation** — it tells TypeScript what type a variable must be.

### Your Mission
Declare \`const greeting: string = "Hello, TypeScript!"\` and print it.`,
    starterCode: '// Declare a typed variable and print it\n',
    hint: 'const greeting: string = "Hello, TypeScript!" then console.log(greeting)',
    tests: [{ description: 'Output is Hello, TypeScript!', expected: 'Hello, TypeScript!' }],
  },
  {
    id: 'typescript-2', language: 'typescript', regionId: 'typescript',
    title: 'Basic Types', order: 2, xpReward: 75, isBoss: false,
    description: `## Quest 2: Basic Types

TypeScript has several primitive types:

\`\`\`typescript
let name: string = "Hero"
let level: number = 10
let alive: boolean = true
\`\`\`

### Your Mission
Declare three typed variables:
- \`name: string\` = \`"Aria"\`
- \`level: number\` = \`7\`
- \`active: boolean\` = \`true\`

Print: \`Aria level 7 active: true\``,
    starterCode: '// Declare your typed variables\n',
    hint: 'console.log(`${name} level ${level} active: ${active}`)',
    tests: [{ description: 'Output is Aria level 7 active: true', expected: 'Aria level 7 active: true' }],
  },
  {
    id: 'typescript-3', language: 'typescript', regionId: 'typescript',
    title: 'Typed Functions', order: 3, xpReward: 100, isBoss: false,
    description: `## Quest 3: Typed Functions

TypeScript lets you type both parameters and return values:

\`\`\`typescript
function add(a: number, b: number): number {
  return a + b
}
\`\`\`

### Your Mission
Write a function \`multiply(a: number, b: number): number\` that returns \`a * b\`.
Print \`multiply(7, 6)\`.`,
    starterCode: '// Write your typed function\n',
    hint: 'function multiply(a: number, b: number): number { return a * b }',
    tests: [{ description: 'Output is 42', expected: '42' }],
  },
  {
    id: 'typescript-4', language: 'typescript', regionId: 'typescript',
    title: 'Interfaces', order: 4, xpReward: 125, isBoss: false,
    description: `## Quest 4: Interfaces

Interfaces define the shape of an object — like a contract:

\`\`\`typescript
interface Spell {
  name: string
  damage: number
}

const fireball: Spell = { name: "Fireball", damage: 80 }
console.log(fireball.name)
\`\`\`

### Your Mission
Define an interface \`Hero\` with \`name: string\` and \`hp: number\`.
Create a hero \`{ name: "Zara", hp: 150 }\` and print: \`Zara has 150 HP\``,
    starterCode: '// Define interface and create object\n',
    hint: 'interface Hero { name: string; hp: number } then const hero: Hero = ...',
    tests: [{ description: 'Output is Zara has 150 HP', expected: 'Zara has 150 HP' }],
  },
  {
    id: 'typescript-5', language: 'typescript', regionId: 'typescript',
    title: 'Arrays & Tuples', order: 5, xpReward: 125, isBoss: false,
    description: `## Quest 5: Arrays & Tuples

\`\`\`typescript
const scores: number[] = [10, 20, 30]
const pair: [string, number] = ["Hero", 42]  // tuple: fixed types per position
console.log(pair[0])  // Hero
\`\`\`

### Your Mission
Create a typed array \`const levels: number[] = [1, 5, 10, 15, 20]\`.
Print the sum of all levels using \`.reduce()\`.`,
    starterCode: 'const levels: number[] = [1, 5, 10, 15, 20]\n// Print the sum\n',
    hint: 'console.log(levels.reduce((sum, n) => sum + n, 0))',
    tests: [{ description: 'Output is 51', expected: '51' }],
  },
  {
    id: 'typescript-6', language: 'typescript', regionId: 'typescript',
    title: 'Union Types', order: 6, xpReward: 125, isBoss: false,
    description: `## Quest 6: Union Types

A union type means a variable can be one of several types:

\`\`\`typescript
let id: string | number = "abc123"
id = 42  // also valid

function printId(id: string | number) {
  console.log("ID: " + id)
}
\`\`\`

### Your Mission
Write a function \`describe(value: string | number): string\` that returns:
- \`"Text: {value}"\` if value is a string
- \`"Number: {value}"\` if value is a number

Print \`describe(42)\` and \`describe("hero")\`.`,
    starterCode: '// Write your union type function\n',
    hint: 'Use typeof value === "string" to check the type inside the function',
    tests: [{ description: 'Output contains Number: 42', expected: 'Number: 42' }],
  },
  {
    id: 'typescript-7', language: 'typescript', regionId: 'typescript',
    title: 'Optional Parameters', order: 7, xpReward: 125, isBoss: false,
    description: `## Quest 7: Optional & Default Parameters

\`\`\`typescript
function greet(name: string, title?: string): string {
  return title ? \`\${title} \${name}\` : name
}

function power(base: number, exp: number = 2): number {
  return base ** exp
}
\`\`\`

### Your Mission
Write a function \`createHero(name: string, level: number = 1): string\`
that returns \`"{name} (Level {level})"\`.
Print \`createHero("Aria")\` (using the default level).`,
    starterCode: '// Write your function with a default parameter\n',
    hint: 'function createHero(name: string, level: number = 1) { return `${name} (Level ${level})` }',
    tests: [{ description: 'Output is Aria (Level 1)', expected: 'Aria (Level 1)' }],
  },
  {
    id: 'typescript-8', language: 'typescript', regionId: 'typescript',
    title: 'Enums', order: 8, xpReward: 150, isBoss: false,
    description: `## Quest 8: Enums

Enums give friendly names to sets of values:

\`\`\`typescript
enum Direction { North, South, East, West }
let dir: Direction = Direction.North
console.log(dir)  // 0 (numeric by default)

enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }
\`\`\`

### Your Mission
Create a string enum \`HeroClass\` with values:
- \`Warrior = "WARRIOR"\`, \`Mage = "MAGE"\`, \`Ranger = "RANGER"\`

Declare \`const myClass: HeroClass = HeroClass.Mage\` and print it.`,
    starterCode: '// Define your enum\n',
    hint: 'enum HeroClass { Warrior = "WARRIOR", Mage = "MAGE", Ranger = "RANGER" }',
    tests: [{ description: 'Output is MAGE', expected: 'MAGE' }],
  },
  {
    id: 'typescript-9', language: 'typescript', regionId: 'typescript',
    title: 'Generics', order: 9, xpReward: 175, isBoss: false,
    description: `## Quest 9: Generics

Generics let you write reusable code that works with any type:

\`\`\`typescript
function identity<T>(value: T): T {
  return value
}
console.log(identity<string>("hello"))  // hello
console.log(identity<number>(42))       // 42
\`\`\`

### Your Mission
Write a generic function \`firstItem<T>(arr: T[]): T\` that returns the first element of any array.
Print \`firstItem(["sword", "shield", "potion"])\`.`,
    starterCode: '// Write your generic function\n',
    hint: 'function firstItem<T>(arr: T[]): T { return arr[0] }',
    tests: [{ description: 'Output is sword', expected: 'sword' }],
  },
  {
    id: 'typescript-10', language: 'typescript', regionId: 'typescript',
    title: 'Type Aliases', order: 10, xpReward: 150, isBoss: false,
    description: `## Quest 10: Type Aliases

Type aliases create a name for any type:

\`\`\`typescript
type Point = { x: number; y: number }
type ID = string | number
type Callback = (value: string) => void
\`\`\`

### Your Mission
Create a type alias \`Stats = { strength: number; agility: number; intelligence: number }\`.
Create a \`const heroStats: Stats\` with values 15, 12, 20.
Print the intelligence value.`,
    starterCode: '// Define your type alias and use it\n',
    hint: 'type Stats = { strength: number; agility: number; intelligence: number }',
    tests: [{ description: 'Output is 20', expected: '20' }],
  },
  {
    id: 'typescript-11', language: 'typescript', regionId: 'typescript',
    title: 'Classes', order: 11, xpReward: 175, isBoss: false,
    description: `## Quest 11: Classes in TypeScript

TypeScript classes have typed properties and access modifiers:

\`\`\`typescript
class Spell {
  private damage: number
  constructor(public name: string, damage: number) {
    this.damage = damage
  }
  cast(): string {
    return \`\${this.name} deals \${this.damage} damage\`
  }
}
\`\`\`

### Your Mission
Create a class \`Warrior\` with \`public name: string\` and \`private hp: number\`.
Add a method \`getStatus(): string\` returning \`"{name}: {hp}HP"\`.
Create a Warrior \`"Thor"\` with \`200\` HP and print their status.`,
    starterCode: '// Define your Warrior class\n',
    hint: 'class Warrior { constructor(public name: string, private hp: number) {} getStatus() { return `${this.name}: ${this.hp}HP` } }',
    tests: [{ description: 'Output is Thor: 200HP', expected: 'Thor: 200HP' }],
  },
  {
    id: 'typescript-12', language: 'typescript', regionId: 'typescript',
    title: 'Type Guards', order: 12, xpReward: 175, isBoss: false,
    description: `## Quest 12: Type Guards

Type guards narrow down types at runtime:

\`\`\`typescript
function process(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase())
  } else {
    console.log(value * 2)
  }
}
\`\`\`

### Your Mission
Write a function \`process(value: string | number)\` that:
- If string: prints the value uppercased
- If number: prints the value doubled

Call \`process("quest")\` and \`process(21)\`.`,
    starterCode: '// Write your type guard function\n',
    hint: 'Use typeof value === "string" to branch',
    tests: [{ description: 'Output contains QUEST', expected: 'QUEST' }],
  },
  {
    id: 'typescript-13', language: 'typescript', regionId: 'typescript',
    title: 'Utility Types', order: 13, xpReward: 175, isBoss: false,
    description: `## Quest 13: Utility Types

TypeScript has built-in utility types to transform types:

\`\`\`typescript
interface Hero { name: string; level: number; hp: number }

type PartialHero = Partial<Hero>        // all fields optional
type ReadonlyHero = Readonly<Hero>      // all fields readonly
type HeroPreview = Pick<Hero, "name" | "level">  // only these fields
\`\`\`

### Your Mission
Define \`interface Item { name: string; cost: number; rarity: string }\`.
Create a \`Partial<Item>\` object with only \`name: "Sword"\` set.
Print the name.`,
    starterCode: '// Define interface and use Partial<>\n',
    hint: 'const item: Partial<Item> = { name: "Sword" } then console.log(item.name)',
    tests: [{ description: 'Output is Sword', expected: 'Sword' }],
  },
  {
    id: 'typescript-14', language: 'typescript', regionId: 'typescript',
    title: 'Boss: The Type Titan', order: 14, xpReward: 250, isBoss: true,
    description: `## Boss Quest: The Type Titan

Combine everything to defeat the Type Titan!

### Your Mission
1. Define interface \`Quest { title: string; xp: number; completed: boolean }\`
2. Write a generic function \`filterComplete<T extends { completed: boolean }>(items: T[]): T[]\` that returns only completed items
3. Create an array of 3 quests (2 completed, 1 not)
4. Print the number of completed quests`,
    starterCode: '// Define interface, generic function, and test data\n',
    hint: 'filterComplete filters where item.completed === true, print the length of the result',
    tests: [{ description: 'Output is 2', expected: '2' }],
  },
]

// ─────────────────────────────────────────────────────────────
// SQL — 10 lessons (each file is a complete SQLite3 script)
// ─────────────────────────────────────────────────────────────
const SQL_LESSONS = [
  {
    id: 'sql-1', language: 'sql', regionId: 'sql',
    title: 'SELECT Basics', order: 1, xpReward: 50, isBoss: false,
    description: `## Quest 1: SELECT Basics

SQL is used to query databases. The most basic command is SELECT:

\`\`\`sql
SELECT column1, column2 FROM table_name;
SELECT * FROM table_name;  -- * means all columns
\`\`\`

### Your Mission
The heroes table is already created. Run a query to select all columns from it.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT, level INTEGER);
INSERT INTO heroes VALUES (1, 'Aria', 10);
INSERT INTO heroes VALUES (2, 'Thor', 15);
INSERT INTO heroes VALUES (3, 'Zara', 8);
-- Write your SELECT below
`,
    hint: 'SELECT * FROM heroes;',
    tests: [{ description: 'Output contains Aria', expected: 'Aria' }],
  },
  {
    id: 'sql-2', language: 'sql', regionId: 'sql',
    title: 'WHERE Clause', order: 2, xpReward: 75, isBoss: false,
    description: `## Quest 2: WHERE Clause

Filter rows with WHERE:

\`\`\`sql
SELECT * FROM heroes WHERE level > 10;
SELECT name FROM heroes WHERE name = 'Aria';
\`\`\`

### Your Mission
Select only the heroes with level >= 10. The table is set up — write the WHERE query.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT, level INTEGER);
INSERT INTO heroes VALUES (1, 'Aria', 10);
INSERT INTO heroes VALUES (2, 'Thor', 15);
INSERT INTO heroes VALUES (3, 'Zara', 8);
-- Write your SELECT with WHERE below
`,
    hint: 'SELECT * FROM heroes WHERE level >= 10;',
    tests: [{ description: 'Output contains Thor', expected: 'Thor' }],
  },
  {
    id: 'sql-3', language: 'sql', regionId: 'sql',
    title: 'ORDER BY & LIMIT', order: 3, xpReward: 75, isBoss: false,
    description: `## Quest 3: ORDER BY & LIMIT

Sort results and limit how many rows return:

\`\`\`sql
SELECT * FROM heroes ORDER BY level DESC;    -- highest first
SELECT * FROM heroes ORDER BY name ASC LIMIT 2;  -- first 2 alphabetically
\`\`\`

### Your Mission
Select all heroes ordered by level descending. Limit to 2 results.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT, level INTEGER);
INSERT INTO heroes VALUES (1, 'Aria', 10);
INSERT INTO heroes VALUES (2, 'Thor', 15);
INSERT INTO heroes VALUES (3, 'Zara', 8);
-- Write your ORDER BY and LIMIT query
`,
    hint: 'SELECT * FROM heroes ORDER BY level DESC LIMIT 2;',
    tests: [{ description: 'Output contains Thor first', expected: '2|Thor|15' }],
  },
  {
    id: 'sql-4', language: 'sql', regionId: 'sql',
    title: 'INSERT INTO', order: 4, xpReward: 100, isBoss: false,
    description: `## Quest 4: INSERT INTO

Add new rows to a table:

\`\`\`sql
INSERT INTO heroes (id, name, level) VALUES (4, 'Nova', 12);
\`\`\`

### Your Mission
The heroes table has 3 rows. Insert a new hero: id=4, name='Kira', level=20.
Then SELECT all heroes to confirm. The output should include Kira.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT, level INTEGER);
INSERT INTO heroes VALUES (1, 'Aria', 10);
INSERT INTO heroes VALUES (2, 'Thor', 15);
INSERT INTO heroes VALUES (3, 'Zara', 8);
-- Insert Kira then SELECT all
`,
    hint: 'INSERT INTO heroes VALUES (4, "Kira", 20); SELECT * FROM heroes;',
    tests: [{ description: 'Output contains Kira', expected: 'Kira' }],
  },
  {
    id: 'sql-5', language: 'sql', regionId: 'sql',
    title: 'UPDATE', order: 5, xpReward: 100, isBoss: false,
    description: `## Quest 5: UPDATE

Modify existing rows:

\`\`\`sql
UPDATE heroes SET level = 20 WHERE name = 'Aria';
\`\`\`

**Always use WHERE with UPDATE** or you'll update every row!

### Your Mission
Update Thor's level to 99, then SELECT Thor's row to confirm.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT, level INTEGER);
INSERT INTO heroes VALUES (1, 'Aria', 10);
INSERT INTO heroes VALUES (2, 'Thor', 15);
INSERT INTO heroes VALUES (3, 'Zara', 8);
-- UPDATE Thor then SELECT to confirm
`,
    hint: "UPDATE heroes SET level = 99 WHERE name = 'Thor'; SELECT * FROM heroes WHERE name = 'Thor';",
    tests: [{ description: 'Output shows Thor with level 99', expected: '2|Thor|99' }],
  },
  {
    id: 'sql-6', language: 'sql', regionId: 'sql',
    title: 'DELETE', order: 6, xpReward: 100, isBoss: false,
    description: `## Quest 6: DELETE

Remove rows from a table:

\`\`\`sql
DELETE FROM heroes WHERE level < 10;
\`\`\`

**Always use WHERE with DELETE** or you'll delete everything!

### Your Mission
Delete the hero with the lowest level (Zara, level 8).
Then SELECT all remaining heroes — there should be 2.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT, level INTEGER);
INSERT INTO heroes VALUES (1, 'Aria', 10);
INSERT INTO heroes VALUES (2, 'Thor', 15);
INSERT INTO heroes VALUES (3, 'Zara', 8);
-- DELETE Zara then SELECT all
`,
    hint: "DELETE FROM heroes WHERE name = 'Zara'; SELECT * FROM heroes;",
    tests: [{ description: 'Zara is gone', expected: '1|Aria|10' }],
  },
  {
    id: 'sql-7', language: 'sql', regionId: 'sql',
    title: 'INNER JOIN', order: 7, xpReward: 150, isBoss: false,
    description: `## Quest 7: INNER JOIN

JOIN combines rows from multiple tables based on a related column:

\`\`\`sql
SELECT heroes.name, weapons.name
FROM heroes
INNER JOIN weapons ON heroes.id = weapons.hero_id;
\`\`\`

### Your Mission
Two tables are set up: heroes and weapons. Join them to show each hero's weapon name.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT);
INSERT INTO heroes VALUES (1, 'Aria'), (2, 'Thor');
CREATE TABLE weapons (id INTEGER, hero_id INTEGER, name TEXT);
INSERT INTO weapons VALUES (1, 1, 'Staff'), (2, 2, 'Hammer');
-- Write your INNER JOIN
`,
    hint: 'SELECT heroes.name, weapons.name FROM heroes INNER JOIN weapons ON heroes.id = weapons.hero_id;',
    tests: [{ description: 'Output contains Aria and Staff', expected: 'Aria|Staff' }],
  },
  {
    id: 'sql-8', language: 'sql', regionId: 'sql',
    title: 'GROUP BY & COUNT', order: 8, xpReward: 150, isBoss: false,
    description: `## Quest 8: GROUP BY & Aggregate Functions

Aggregate functions summarize data:

\`\`\`sql
SELECT class, COUNT(*) as total FROM heroes GROUP BY class;
SELECT class, AVG(level) FROM heroes GROUP BY class;
\`\`\`

### Your Mission
The heroes table has a "class" column. Count how many heroes are in each class.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT, class TEXT, level INTEGER);
INSERT INTO heroes VALUES (1,'Aria','Mage',10),(2,'Thor','Warrior',15),(3,'Zara','Mage',8),(4,'Kira','Warrior',12);
-- Count heroes per class
`,
    hint: 'SELECT class, COUNT(*) FROM heroes GROUP BY class;',
    tests: [{ description: 'Output contains Mage count 2', expected: 'Mage|2' }],
  },
  {
    id: 'sql-9', language: 'sql', regionId: 'sql',
    title: 'HAVING', order: 9, xpReward: 150, isBoss: false,
    description: `## Quest 9: HAVING

HAVING filters grouped results (like WHERE but for aggregates):

\`\`\`sql
-- Classes with more than 2 heroes
SELECT class, COUNT(*) as count
FROM heroes
GROUP BY class
HAVING count > 2;
\`\`\`

### Your Mission
Find classes that have more than 1 hero. Show the class name and count.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT, class TEXT);
INSERT INTO heroes VALUES (1,'Aria','Mage'),(2,'Thor','Warrior'),(3,'Zara','Mage'),(4,'Kira','Warrior'),(5,'Rex','Ranger');
-- GROUP BY with HAVING
`,
    hint: 'SELECT class, COUNT(*) as count FROM heroes GROUP BY class HAVING count > 1;',
    tests: [{ description: 'Output contains Warrior with 2', expected: 'Warrior|2' }],
  },
  {
    id: 'sql-10', language: 'sql', regionId: 'sql',
    title: 'Boss: The Query Kraken', order: 10, xpReward: 250, isBoss: true,
    description: `## Boss Quest: The Query Kraken

Combine JOINs, GROUP BY, and HAVING to defeat the Kraken!

### Your Mission
Three tables: heroes, quests, completions (hero_id, quest_id).
Find heroes who have completed more than 1 quest. Show their name and count.`,
    starterCode: `CREATE TABLE heroes (id INTEGER, name TEXT);
INSERT INTO heroes VALUES (1,'Aria'),(2,'Thor'),(3,'Zara');
CREATE TABLE quests (id INTEGER, title TEXT);
INSERT INTO quests VALUES (1,'Slay Dragon'),(2,'Find Treasure'),(3,'Rescue Villager');
CREATE TABLE completions (hero_id INTEGER, quest_id INTEGER);
INSERT INTO completions VALUES (1,1),(1,2),(1,3),(2,1),(2,2),(3,1);
-- Find heroes with more than 1 completion
`,
    hint: 'SELECT heroes.name, COUNT(*) as done FROM completions JOIN heroes ON ... GROUP BY ... HAVING done > 1',
    tests: [{ description: 'Aria completed 3 quests', expected: 'Aria|3' }],
  },
]

// ─────────────────────────────────────────────────────────────
// GO — 11 lessons
// ─────────────────────────────────────────────────────────────
const GO_LESSONS = [
  {
    id: 'go-1', language: 'go', regionId: 'go',
    title: 'Hello, Go!', order: 1, xpReward: 50, isBoss: false,
    description: `## Quest 1: Hello, Go!

Go (Golang) is fast, simple, and built for concurrency. Every Go program starts with \`package main\` and a \`main()\` function:

\`\`\`go
package main
import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
\`\`\`

### Your Mission
Print: \`Welcome to Go Glacier!\``,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    // Write your code here\n}\n',
    hint: 'fmt.Println("Welcome to Go Glacier!")',
    tests: [{ description: 'Output is Welcome to Go Glacier!', expected: 'Welcome to Go Glacier!' }],
  },
  {
    id: 'go-2', language: 'go', regionId: 'go',
    title: 'Variables & Types', order: 2, xpReward: 75, isBoss: false,
    description: `## Quest 2: Variables & Types

Go has two ways to declare variables:

\`\`\`go
var name string = "Hero"   // explicit type
level := 10                // short declaration (type inferred)
\`\`\`

### Your Mission
Declare \`name := "Aria"\` and \`level := 7\`.
Print: \`Aria is level 7\``,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    // Declare variables and print\n}\n',
    hint: 'fmt.Printf("%s is level %d\\n", name, level) or fmt.Println(name, "is level", level)',
    tests: [{ description: 'Output is Aria is level 7', expected: 'Aria is level 7' }],
  },
  {
    id: 'go-3', language: 'go', regionId: 'go',
    title: 'If / Else', order: 3, xpReward: 100, isBoss: false,
    description: `## Quest 3: If / Else

Go's if/else doesn't use parentheses around conditions:

\`\`\`go
hp := 30
if hp < 50 {
    fmt.Println("Low HP!")
} else {
    fmt.Println("HP is fine.")
}
\`\`\`

### Your Mission
\`score := 85\` is set. Print \`"Pass"\` if score >= 60, else print \`"Fail"\`.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    score := 85\n    // Write your if/else\n}\n',
    hint: 'if score >= 60 { fmt.Println("Pass") } else { fmt.Println("Fail") }',
    tests: [{ description: 'Output is Pass', expected: 'Pass' }],
  },
  {
    id: 'go-4', language: 'go', regionId: 'go',
    title: 'For Loops', order: 4, xpReward: 100, isBoss: false,
    description: `## Quest 4: For Loops

Go only has \`for\` — it acts as while too:

\`\`\`go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}

// while-style
n := 1
for n < 10 {
    n *= 2
}
\`\`\`

### Your Mission
Print numbers 1 through 5 using a for loop.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    // Write your for loop\n}\n',
    hint: 'for i := 1; i <= 5; i++ { fmt.Println(i) }',
    tests: [{ description: 'Prints 1 through 5', expected: '1\n2\n3\n4\n5' }],
  },
  {
    id: 'go-5', language: 'go', regionId: 'go',
    title: 'Functions', order: 5, xpReward: 125, isBoss: false,
    description: `## Quest 5: Functions

Go functions declare return types after the parameters:

\`\`\`go
func add(a int, b int) int {
    return a + b
}
fmt.Println(add(3, 4))  // 7
\`\`\`

### Your Mission
Write a function \`square(n int) int\` that returns \`n * n\`.
Print \`square(9)\`.`,
    starterCode: 'package main\nimport "fmt"\n\n// Define your function here\n\nfunc main() {\n    // Call it here\n}\n',
    hint: 'func square(n int) int { return n * n } then fmt.Println(square(9))',
    tests: [{ description: 'Output is 81', expected: '81' }],
  },
  {
    id: 'go-6', language: 'go', regionId: 'go',
    title: 'Slices', order: 6, xpReward: 125, isBoss: false,
    description: `## Quest 6: Slices

Slices are Go's dynamic arrays:

\`\`\`go
heroes := []string{"Aria", "Thor"}
heroes = append(heroes, "Zara")
fmt.Println(len(heroes))  // 3
fmt.Println(heroes[0])    // Aria
\`\`\`

### Your Mission
Create a slice \`scores := []int{10, 20, 30, 40, 50}\`.
Print the sum of all scores using a for loop.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    scores := []int{10, 20, 30, 40, 50}\n    // Sum and print\n}\n',
    hint: 'sum := 0; for _, v := range scores { sum += v }; fmt.Println(sum)',
    tests: [{ description: 'Output is 150', expected: '150' }],
  },
  {
    id: 'go-7', language: 'go', regionId: 'go',
    title: 'Maps', order: 7, xpReward: 125, isBoss: false,
    description: `## Quest 7: Maps

Maps are key-value stores (like dictionaries in Python):

\`\`\`go
stats := map[string]int{
    "strength": 15,
    "agility":  12,
}
fmt.Println(stats["strength"])  // 15
stats["intelligence"] = 18
\`\`\`

### Your Mission
Create a map \`inventory\` mapping item names (string) to quantities (int):
- "sword" → 1, "potion" → 5, "arrow" → 30

Print the quantity of "potion".`,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    // Create your map and print potion quantity\n}\n',
    hint: 'inventory := map[string]int{"sword": 1, "potion": 5, "arrow": 30} then fmt.Println(inventory["potion"])',
    tests: [{ description: 'Output is 5', expected: '5' }],
  },
  {
    id: 'go-8', language: 'go', regionId: 'go',
    title: 'Structs', order: 8, xpReward: 150, isBoss: false,
    description: `## Quest 8: Structs

Structs group related data together — Go's version of a class without methods:

\`\`\`go
type Hero struct {
    Name  string
    Level int
    HP    int
}

h := Hero{Name: "Aria", Level: 5, HP: 100}
fmt.Println(h.Name)
\`\`\`

### Your Mission
Define a \`Weapon\` struct with \`Name string\` and \`Damage int\`.
Create a Weapon \`{Name: "Excalibur", Damage: 95}\` and print its damage.`,
    starterCode: 'package main\nimport "fmt"\n\n// Define your struct\n\nfunc main() {\n    // Create and print\n}\n',
    hint: 'type Weapon struct { Name string; Damage int } then w := Weapon{...} fmt.Println(w.Damage)',
    tests: [{ description: 'Output is 95', expected: '95' }],
  },
  {
    id: 'go-9', language: 'go', regionId: 'go',
    title: 'Methods', order: 9, xpReward: 150, isBoss: false,
    description: `## Quest 9: Methods on Structs

Go adds methods to structs using a receiver:

\`\`\`go
type Hero struct { Name string; HP int }

func (h Hero) Status() string {
    return fmt.Sprintf("%s has %d HP", h.Name, h.HP)
}

h := Hero{"Aria", 100}
fmt.Println(h.Status())
\`\`\`

### Your Mission
Add a method \`Describe() string\` to a \`Dragon\` struct (Name string, HP int).
It should return \`"{Name} has {HP} HP"\`. Create a dragon and print its description.`,
    starterCode: 'package main\nimport "fmt"\n\ntype Dragon struct {\n    Name string\n    HP   int\n}\n\n// Add your method here\n\nfunc main() {\n    d := Dragon{Name: "Inferno", HP: 500}\n    // Print description\n}\n',
    hint: 'func (d Dragon) Describe() string { return fmt.Sprintf("%s has %d HP", d.Name, d.HP) }',
    tests: [{ description: 'Output is Inferno has 500 HP', expected: 'Inferno has 500 HP' }],
  },
  {
    id: 'go-10', language: 'go', regionId: 'go',
    title: 'Multiple Return Values', order: 10, xpReward: 175, isBoss: false,
    description: `## Quest 10: Multiple Return Values

Go functions can return multiple values — commonly used for error handling:

\`\`\`go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}

result, err := divide(10, 2)
if err != nil {
    fmt.Println("Error:", err)
} else {
    fmt.Println(result)
}
\`\`\`

### Your Mission
Write \`minMax(nums []int) (int, int)\` that returns the minimum and maximum of a slice.
Test with \`[]int{3, 1, 4, 1, 5, 9, 2, 6}\` and print min then max.`,
    starterCode: 'package main\nimport "fmt"\n\n// Define minMax here\n\nfunc main() {\n    nums := []int{3, 1, 4, 1, 5, 9, 2, 6}\n    // Call and print\n}\n',
    hint: 'Loop through nums tracking min and max, return both. fmt.Println(min) fmt.Println(max)',
    tests: [{ description: 'Output contains 1 and 9', expected: '1\n9' }],
  },
  {
    id: 'go-11', language: 'go', regionId: 'go',
    title: 'Boss: The Goroutine Golem', order: 11, xpReward: 250, isBoss: true,
    description: `## Boss Quest: The Goroutine Golem

Goroutines are lightweight threads. Channels let goroutines communicate:

\`\`\`go
ch := make(chan string)
go func() { ch <- "hello from goroutine" }()
msg := <-ch
fmt.Println(msg)
\`\`\`

### Your Mission
Create a channel \`ch := make(chan int)\`.
Launch a goroutine that sends the sum of \`[]int{1,2,3,4,5}\` into the channel.
Receive from the channel in main and print the result.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    ch := make(chan int)\n    nums := []int{1, 2, 3, 4, 5}\n    // Launch goroutine and receive\n}\n',
    hint: 'go func() { sum := 0; for _, v := range nums { sum += v }; ch <- sum }() then fmt.Println(<-ch)',
    tests: [{ description: 'Output is 15', expected: '15' }],
  },
]

// ─────────────────────────────────────────────────────────────
// RUST — 16 lessons
// ─────────────────────────────────────────────────────────────
const RUST_LESSONS = [
  {
    id: 'rust-1', language: 'rust', regionId: 'rust',
    title: 'Hello, Rust!', order: 1, xpReward: 50, isBoss: false,
    description: `## Quest 1: Hello, Rust!

Rust is a systems programming language focused on safety and speed. Every Rust program starts with \`fn main()\`:

\`\`\`rust
fn main() {
    println!("Hello, World!");
}
\`\`\`

Note: \`println!\` is a macro (the \`!\` means macro, not a function).

### Your Mission
Print: \`Welcome to Rust Ruins!\``,
    starterCode: 'fn main() {\n    // Write your code here\n}\n',
    hint: 'println!("Welcome to Rust Ruins!");',
    tests: [{ description: 'Output is Welcome to Rust Ruins!', expected: 'Welcome to Rust Ruins!' }],
  },
  {
    id: 'rust-2', language: 'rust', regionId: 'rust',
    title: 'Variables & Mutability', order: 2, xpReward: 75, isBoss: false,
    description: `## Quest 2: Variables & Mutability

In Rust, variables are **immutable by default**. Use \`mut\` to allow changes:

\`\`\`rust
let x = 5;        // immutable
let mut y = 10;   // mutable
y = 20;           // OK
// x = 6;        // ERROR: cannot assign twice
\`\`\`

### Your Mission
Declare \`let mut score = 0\`. Add 100 to it, then print \`score\`.`,
    starterCode: 'fn main() {\n    let mut score = 0;\n    // Add 100 and print\n}\n',
    hint: 'score += 100; println!("{}", score);',
    tests: [{ description: 'Output is 100', expected: '100' }],
  },
  {
    id: 'rust-3', language: 'rust', regionId: 'rust',
    title: 'Data Types', order: 3, xpReward: 100, isBoss: false,
    description: `## Quest 3: Data Types

Rust's core types:

\`\`\`rust
let hp: i32 = 100;        // signed 32-bit integer
let speed: f64 = 3.14;    // 64-bit float
let alive: bool = true;
let initial: char = 'A';
\`\`\`

### Your Mission
Declare:
- \`let damage: i32 = 42\`
- \`let crit: f64 = 1.5\`

Calculate and print the crit damage: \`damage as f64 * crit\` (cast damage to f64 first).`,
    starterCode: 'fn main() {\n    let damage: i32 = 42;\n    let crit: f64 = 1.5;\n    // Calculate and print crit damage\n}\n',
    hint: 'println!("{}", damage as f64 * crit);',
    tests: [{ description: 'Output is 63', expected: '63' }],
  },
  {
    id: 'rust-4', language: 'rust', regionId: 'rust',
    title: 'If / Else', order: 4, xpReward: 100, isBoss: false,
    description: `## Quest 4: If / Else

Rust if/else works like other languages, but it's also an **expression** (returns a value):

\`\`\`rust
let hp = 30;
if hp < 50 {
    println!("Low HP!");
} else {
    println!("HP is fine.");
}

// As an expression:
let status = if hp < 50 { "critical" } else { "stable" };
\`\`\`

### Your Mission
\`let level = 15;\` is set. Print \`"Expert"\` if level >= 10, otherwise \`"Novice"\`.`,
    starterCode: 'fn main() {\n    let level = 15;\n    // Write your if/else\n}\n',
    hint: 'if level >= 10 { println!("Expert"); } else { println!("Novice"); }',
    tests: [{ description: 'Output is Expert', expected: 'Expert' }],
  },
  {
    id: 'rust-5', language: 'rust', regionId: 'rust',
    title: 'Loops', order: 5, xpReward: 100, isBoss: false,
    description: `## Quest 5: Loops

Rust has three loop types:

\`\`\`rust
// loop: runs forever until break
loop { break; }

// while
let mut i = 0;
while i < 5 { i += 1; }

// for with range
for i in 1..=5 {   // 1..=5 is inclusive (1 to 5)
    println!("{}", i);
}
\`\`\`

### Your Mission
Use a \`for\` loop with \`1..=5\` to print numbers 1 through 5.`,
    starterCode: 'fn main() {\n    // Write your for loop\n}\n',
    hint: 'for i in 1..=5 { println!("{}", i); }',
    tests: [{ description: 'Prints 1 through 5', expected: '1\n2\n3\n4\n5' }],
  },
  {
    id: 'rust-6', language: 'rust', regionId: 'rust',
    title: 'Functions', order: 6, xpReward: 125, isBoss: false,
    description: `## Quest 6: Functions

Rust functions use \`fn\` and must declare parameter and return types:

\`\`\`rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // no semicolon = return value (expression)
}
\`\`\`

### Your Mission
Write a function \`power(base: i32, exp: u32) -> i32\` that returns base raised to exp.
Use \`base.pow(exp)\`. Print \`power(2, 10)\`.`,
    starterCode: 'fn main() {\n    println!("{}", power(2, 10));\n}\n\n// Define power here\n',
    hint: 'fn power(base: i32, exp: u32) -> i32 { base.pow(exp) }',
    tests: [{ description: 'Output is 1024', expected: '1024' }],
  },
  {
    id: 'rust-7', language: 'rust', regionId: 'rust',
    title: 'Ownership', order: 7, xpReward: 175, isBoss: false,
    description: `## Quest 7: Ownership

Ownership is Rust's most unique feature — it ensures memory safety without garbage collection.

**Rules:**
1. Each value has one owner
2. When the owner goes out of scope, the value is dropped
3. Values can be **moved** or **cloned**

\`\`\`rust
let s1 = String::from("hello");
let s2 = s1;         // s1 is MOVED — can't use s1 anymore
// println!("{}", s1); // ERROR

let s3 = s2.clone(); // explicit copy — both valid
\`\`\`

### Your Mission
Create \`let s1 = String::from("Quest")\`. Clone it into \`s2\`. Print both \`s1\` and \`s2\`.`,
    starterCode: 'fn main() {\n    let s1 = String::from("Quest");\n    // Clone and print both\n}\n',
    hint: 'let s2 = s1.clone(); println!("{} {}", s1, s2);',
    tests: [{ description: 'Output is Quest Quest', expected: 'Quest Quest' }],
  },
  {
    id: 'rust-8', language: 'rust', regionId: 'rust',
    title: 'References & Borrowing', order: 8, xpReward: 175, isBoss: false,
    description: `## Quest 8: References & Borrowing

Instead of moving values, you can **borrow** them with references (\`&\`):

\`\`\`rust
fn length(s: &String) -> usize {
    s.len()  // borrows s, doesn't take ownership
}

let s = String::from("hello");
println!("{}", length(&s));  // s still valid here
\`\`\`

### Your Mission
Write a function \`shout(s: &String) -> String\` that returns the string uppercased using \`s.to_uppercase()\`.
Call it with \`"hero"\` and print the result.`,
    starterCode: 'fn main() {\n    let word = String::from("hero");\n    println!("{}", shout(&word));\n}\n\n// Define shout here\n',
    hint: 'fn shout(s: &String) -> String { s.to_uppercase() }',
    tests: [{ description: 'Output is HERO', expected: 'HERO' }],
  },
  {
    id: 'rust-9', language: 'rust', regionId: 'rust',
    title: 'Structs', order: 9, xpReward: 150, isBoss: false,
    description: `## Quest 9: Structs

Structs group related data:

\`\`\`rust
struct Hero {
    name: String,
    level: i32,
    hp: i32,
}

let h = Hero { name: String::from("Aria"), level: 5, hp: 100 };
println!("{} is level {}", h.name, h.level);
\`\`\`

### Your Mission
Define a \`Spell\` struct with \`name: String\` and \`damage: i32\`.
Create a Spell named \`"Fireball"\` with damage \`80\` and print: \`Fireball deals 80 damage\``,
    starterCode: '// Define your struct\n\nfn main() {\n    // Create and print\n}\n',
    hint: 'struct Spell { name: String, damage: i32 } then let s = Spell { name: String::from("Fireball"), damage: 80 }',
    tests: [{ description: 'Output is Fireball deals 80 damage', expected: 'Fireball deals 80 damage' }],
  },
  {
    id: 'rust-10', language: 'rust', regionId: 'rust',
    title: 'Enums', order: 10, xpReward: 150, isBoss: false,
    description: `## Quest 10: Enums

Rust enums are powerful — variants can hold data:

\`\`\`rust
enum Direction { North, South, East, West }

enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
}
\`\`\`

### Your Mission
Define an enum \`HeroClass\` with variants \`Warrior\`, \`Mage\`, \`Ranger\`.
Create a \`let class = HeroClass::Mage\` and use a match to print \`"Casting spells!"\` for Mage.`,
    starterCode: '// Define your enum\n\nfn main() {\n    // Create instance and match\n}\n',
    hint: 'match class { HeroClass::Mage => println!("Casting spells!"), _ => {} }',
    tests: [{ description: 'Output is Casting spells!', expected: 'Casting spells!' }],
  },
  {
    id: 'rust-11', language: 'rust', regionId: 'rust',
    title: 'Pattern Matching', order: 11, xpReward: 175, isBoss: false,
    description: `## Quest 11: Pattern Matching

\`match\` in Rust is like a supercharged switch — it must be exhaustive:

\`\`\`rust
let num = 7;
match num {
    1 => println!("one"),
    2 | 3 => println!("two or three"),
    4..=9 => println!("four to nine"),
    _ => println!("other"),
}
\`\`\`

### Your Mission
Match on \`let grade = 85\`:
- 90..=100 → print \`"A"\`
- 75..=89  → print \`"B"\`
- 60..=74  → print \`"C"\`
- _        → print \`"F"\``,
    starterCode: 'fn main() {\n    let grade = 85;\n    // Write your match\n}\n',
    hint: 'match grade { 90..=100 => ... 75..=89 => println!("B"), ... }',
    tests: [{ description: 'Output is B', expected: 'B' }],
  },
  {
    id: 'rust-12', language: 'rust', regionId: 'rust',
    title: 'Vectors', order: 12, xpReward: 150, isBoss: false,
    description: `## Quest 12: Vectors

Vectors are resizable arrays:

\`\`\`rust
let mut v = vec![1, 2, 3];
v.push(4);
println!("{}", v.len());   // 4
for item in &v {
    println!("{}", item);
}
\`\`\`

### Your Mission
Create \`let mut scores = vec![10, 20, 30]\`. Push \`40\` and \`50\`.
Print the sum of all elements using a for loop.`,
    starterCode: 'fn main() {\n    let mut scores = vec![10, 20, 30];\n    // Push 40 and 50, then print sum\n}\n',
    hint: 'scores.push(40); scores.push(50); let sum: i32 = scores.iter().sum(); println!("{}", sum);',
    tests: [{ description: 'Output is 150', expected: '150' }],
  },
  {
    id: 'rust-13', language: 'rust', regionId: 'rust',
    title: 'HashMaps', order: 13, xpReward: 150, isBoss: false,
    description: `## Quest 13: HashMaps

HashMaps store key-value pairs:

\`\`\`rust
use std::collections::HashMap;

let mut map = HashMap::new();
map.insert("hp", 100);
map.insert("mp", 50);
println!("{}", map["hp"]);
\`\`\`

### Your Mission
Create a HashMap mapping hero names (String) to their levels (i32).
Add: Aria → 10, Thor → 15, Zara → 8.
Print Thor's level.`,
    starterCode: 'use std::collections::HashMap;\n\nfn main() {\n    let mut levels = HashMap::new();\n    // Insert heroes and print Thor\'s level\n}\n',
    hint: 'levels.insert("Thor", 15); println!("{}", levels["Thor"]);',
    tests: [{ description: 'Output is 15', expected: '15' }],
  },
  {
    id: 'rust-14', language: 'rust', regionId: 'rust',
    title: 'Option & Result', order: 14, xpReward: 200, isBoss: false,
    description: `## Quest 14: Option & Result

Rust uses \`Option\` instead of null, and \`Result\` instead of exceptions:

\`\`\`rust
let maybe: Option<i32> = Some(42);
let nothing: Option<i32> = None;

match maybe {
    Some(v) => println!("Got {}", v),
    None    => println!("Nothing"),
}

// unwrap_or provides a default if None
println!("{}", nothing.unwrap_or(0));
\`\`\`

### Your Mission
Create \`let value: Option<i32> = Some(99)\`.
Use \`unwrap_or(0)\` to get the value and print it.`,
    starterCode: 'fn main() {\n    let value: Option<i32> = Some(99);\n    // Unwrap with default and print\n}\n',
    hint: 'println!("{}", value.unwrap_or(0));',
    tests: [{ description: 'Output is 99', expected: '99' }],
  },
  {
    id: 'rust-15', language: 'rust', regionId: 'rust',
    title: 'Closures', order: 15, xpReward: 200, isBoss: false,
    description: `## Quest 15: Closures

Closures are anonymous functions that can capture their environment:

\`\`\`rust
let double = |x| x * 2;
println!("{}", double(5));  // 10

let nums = vec![1, 2, 3, 4, 5];
let evens: Vec<i32> = nums.iter().filter(|&&x| x % 2 == 0).cloned().collect();
\`\`\`

### Your Mission
Create \`let nums = vec![1, 2, 3, 4, 5, 6]\`.
Use \`.iter().filter()\` with a closure to keep only even numbers.
Collect into a Vec and print its length.`,
    starterCode: 'fn main() {\n    let nums = vec![1, 2, 3, 4, 5, 6];\n    // Filter evens and print length\n}\n',
    hint: 'let evens: Vec<i32> = nums.iter().filter(|&&x| x % 2 == 0).cloned().collect(); println!("{}", evens.len());',
    tests: [{ description: 'Output is 3', expected: '3' }],
  },
  {
    id: 'rust-16', language: 'rust', regionId: 'rust',
    title: 'Boss: The Memory Demon', order: 16, xpReward: 300, isBoss: true,
    description: `## Boss Quest: The Memory Demon

Defeat the Memory Demon by combining structs, enums, pattern matching, and iterators!

### Your Mission
1. Define a struct \`Monster\` with \`name: String\` and \`hp: i32\`
2. Create a \`Vec<Monster>\` with 3 monsters (hp: 50, 120, 80)
3. Use \`.iter().filter()\` to find monsters with hp > 75
4. Print how many dangerous monsters there are`,
    starterCode: '// Define Monster struct and complete the quest\n\nfn main() {\n    // Create monsters, filter, and print count\n}\n',
    hint: 'let dangerous: Vec<&Monster> = monsters.iter().filter(|m| m.hp > 75).collect(); println!("{}", dangerous.len());',
    tests: [{ description: 'Output is 2', expected: '2' }],
  },
]

// ─────────────────────────────────────────────────────────────
// Seed function
// ─────────────────────────────────────────────────────────────
async function seed() {
  console.log('🌱 Seeding database...')

  const ALL_LESSONS = [
    ...PYTHON_LESSONS,
    ...JS_LESSONS,
    ...TS_LESSONS,
    ...SQL_LESSONS,
    ...GO_LESSONS,
    ...RUST_LESSONS,
  ]

  for (const lesson of ALL_LESSONS) {
    const { tests, ...lessonData } = lesson
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: lessonData,
      create: { ...lessonData, tests: { create: tests } }
    })
    console.log(`  ✓ ${lesson.id}: ${lesson.title}`)
  }

  // Shop items
  const shopItems = [
    { id: 'item-helm-iron',     name: 'Iron Helm',     emoji: '⛑',  slot: 'helmet', cost: 200,  statBonus: '+5% XP',        rarity: 'common' },
    { id: 'item-helm-mage',     name: 'Mage Crown',    emoji: '👑',  slot: 'helmet', cost: 500,  statBonus: '+12% XP',       rarity: 'rare' },
    { id: 'item-helm-dragon',   name: 'Dragon Helm',   emoji: '🐲',  slot: 'helmet', cost: 1200, statBonus: '+20% XP',       rarity: 'epic' },
    { id: 'item-armor-leather', name: 'Leather Armor', emoji: '🧥',  slot: 'armor',  cost: 150,  statBonus: '+3% XP',        rarity: 'common' },
    { id: 'item-armor-chain',   name: 'Chainmail',     emoji: '🛡',  slot: 'armor',  cost: 400,  statBonus: '+10% XP',       rarity: 'rare' },
    { id: 'item-armor-void',    name: 'Void Plate',    emoji: '🌑',  slot: 'armor',  cost: 1500, statBonus: '+25% XP',       rarity: 'legendary' },
    { id: 'item-weapon-staff',  name: 'Wizard Staff',  emoji: '🪄',  slot: 'weapon', cost: 300,  statBonus: '+8% XP',        rarity: 'common' },
    { id: 'item-weapon-sword',  name: 'Flame Sword',   emoji: '🗡',  slot: 'weapon', cost: 600,  statBonus: '+15% XP',       rarity: 'rare' },
    { id: 'item-weapon-excal',  name: 'Excalibyte',    emoji: '⚡',  slot: 'weapon', cost: 2000, statBonus: '+30% XP',       rarity: 'legendary' },
    { id: 'item-boots-swift',   name: 'Swift Boots',   emoji: '👟',  slot: 'boots',  cost: 250,  statBonus: '+5% speed XP',  rarity: 'common' },
    { id: 'item-boots-storm',   name: 'Stormwalkers',  emoji: '⛈',  slot: 'boots',  cost: 700,  statBonus: '+15% speed XP', rarity: 'epic' },
    { id: 'item-amulet-luck',   name: 'Lucky Charm',   emoji: '🍀',  slot: 'amulet', cost: 350,  statBonus: '+8% points',    rarity: 'rare' },
    { id: 'item-amulet-void',   name: 'Void Crystal',  emoji: '💎',  slot: 'amulet', cost: 1000, statBonus: '+20% points',   rarity: 'epic' },
    { id: 'item-ring-focus',    name: 'Ring of Focus', emoji: '💍',  slot: 'ring',   cost: 450,  statBonus: '-10% hint cost', rarity: 'rare' },
    { id: 'item-ring-legend',   name: 'Ouroboros Ring',emoji: '🐍',  slot: 'ring',   cost: 1800, statBonus: 'Double duel XP', rarity: 'legendary' },
  ]
  for (const item of shopItems) {
    await prisma.shopItem.upsert({ where: { id: item.id }, update: item, create: item })
    console.log(`  ✓ Shop: ${item.name}`)
  }

  // Achievements
  const achievements = [
    { id: 'first-quest',    title: 'First Blood',       emoji: '⚔️', description: 'Complete your first lesson',         condition: 'complete_1_lesson',  xpReward: 0 },
    { id: 'python-start',   title: 'Snake Charmer',     emoji: '🐍', description: 'Complete 5 Python lessons',           condition: 'complete_5_python',  xpReward: 100 },
    { id: 'js-start',       title: 'Jungle Explorer',   emoji: '⚡', description: 'Complete 5 JavaScript lessons',       condition: 'complete_5_js',      xpReward: 100 },
    { id: 'speedster',      title: 'Lightning Fingers', emoji: '⚡', description: 'Complete a lesson in under 60s',      condition: 'fast_lesson',        xpReward: 50 },
    { id: 'first-duel',     title: 'Challenger',        emoji: '🥊', description: 'Win your first duel',                 condition: 'win_1_duel',         xpReward: 150 },
    { id: 'boss-slayer',    title: 'Boss Slayer',        emoji: '🏆', description: 'Defeat your first boss',             condition: 'defeat_1_boss',      xpReward: 200 },
    { id: 'polyglot',       title: 'Polyglot',          emoji: '🌍', description: 'Complete a lesson in 3 languages',   condition: 'complete_3_langs',   xpReward: 300 },
  ]
  for (const ach of achievements) {
    await prisma.achievement.upsert({ where: { id: ach.id }, update: ach, create: ach })
    console.log(`  ✓ Achievement: ${ach.title}`)
  }

  console.log(`\n✅ Seed complete! ${ALL_LESSONS.length} lessons across 6 languages.`)
}

seed()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
