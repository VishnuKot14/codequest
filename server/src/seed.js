import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
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
  {
    id: 'python-13', language: 'python', regionId: 'python',
    title: 'List Comprehensions', order: 13, xpReward: 100, isBoss: false,
    description: `## Quest 13: List Comprehensions

List comprehensions create lists in a single expressive line:

\`\`\`python
squares = [x**2 for x in range(1, 6)]
print(squares)  # [1, 4, 9, 16, 25]

evens = [x for x in range(10) if x % 2 == 0]
\`\`\`

### Your Mission
Use a list comprehension to create a list of cubes (\`x**3\`) for x in range 1–5.
Print the result.`,
    starterCode: '# Create cubes list using a list comprehension\n',
    hint: 'cubes = [x**3 for x in range(1, 6)]',
    tests: [{ description: 'Output is [1, 8, 27, 64, 125]', expected: '[1, 8, 27, 64, 125]' }],
  },
  {
    id: 'python-14', language: 'python', regionId: 'python',
    title: 'Dictionary Comprehensions', order: 14, xpReward: 100, isBoss: false,
    description: `## Quest 14: Dictionary Comprehensions

Like list comprehensions, but producing dicts:

\`\`\`python
squares = {x: x**2 for x in range(1, 4)}
print(squares)  # {1: 1, 2: 4, 3: 9}

filtered = {k: v for k, v in squares.items() if v > 1}
\`\`\`

### Your Mission
Create a dict mapping numbers 1–4 to their cubes (\`x**3\`). Print the result.`,
    starterCode: '# Create a dict comprehension: x -> x**3 for x in 1-4\n',
    hint: 'cubes = {x: x**3 for x in range(1, 5)}',
    tests: [{ description: 'Output is {1: 1, 2: 8, 3: 27, 4: 64}', expected: '{1: 1, 2: 8, 3: 27, 4: 64}' }],
  },
  {
    id: 'python-15', language: 'python', regionId: 'python',
    title: 'Sets', order: 15, xpReward: 100, isBoss: false,
    description: `## Quest 15: Sets

A **set** stores unique values with O(1) membership testing:

\`\`\`python
s = {1, 2, 3, 3, 2}
print(len(s))   # 3 — duplicates removed

a, b = {1, 2, 3}, {2, 3, 4}
print(a & b)    # intersection: {2, 3}
print(a | b)    # union: {1, 2, 3, 4}
print(a - b)    # difference: {1}
\`\`\`

### Your Mission
Create a set from \`[1, 2, 2, 3, 3, 3, 4]\` and print its length.`,
    starterCode: 'nums = [1, 2, 2, 3, 3, 3, 4]\n# Create a set and print its length\n',
    hint: 'print(len(set(nums)))',
    tests: [{ description: 'Output is 4', expected: '4' }],
  },
  {
    id: 'python-16', language: 'python', regionId: 'python',
    title: 'Tuple Unpacking', order: 16, xpReward: 100, isBoss: false,
    description: `## Quest 16: Tuple Unpacking

Tuples are immutable sequences. Unpack them in one line:

\`\`\`python
point = (10, 20, 30)
x, y, z = point
print(x + y + z)  # 60

first, *rest = [1, 2, 3, 4, 5]
print(first)  # 1
print(rest)   # [2, 3, 4, 5]

a, b = 5, 10
a, b = b, a   # swap
\`\`\`

### Your Mission
Unpack \`(3, 7, 2)\` into \`a\`, \`b\`, \`c\`. Print their sum.`,
    starterCode: 'coords = (3, 7, 2)\n# Unpack and print the sum\n',
    hint: 'a, b, c = coords then print(a + b + c)',
    tests: [{ description: 'Output is 12', expected: '12' }],
  },
  {
    id: 'python-17', language: 'python', regionId: 'python',
    title: 'Lambda Functions', order: 17, xpReward: 110, isBoss: false,
    description: `## Quest 17: Lambda Functions

\`lambda\` creates a small anonymous function in one line:

\`\`\`python
double = lambda x: x * 2
print(double(5))      # 10

add = lambda x, y: x + y
print(add(3, 4))      # 7

# Often used with sorted, map, filter
nums = [3, 1, 4, 1, 5]
print(sorted(nums, key=lambda x: -x))  # [5, 4, 3, 1, 1]
\`\`\`

### Your Mission
Create a lambda \`power\` that takes \`x\` and \`n\` and returns \`x ** n\`. Print \`power(2, 8)\`.`,
    starterCode: '# Define a lambda called power\n',
    hint: 'power = lambda x, n: x ** n',
    tests: [{ description: 'Output is 256', expected: '256' }],
  },
  {
    id: 'python-18', language: 'python', regionId: 'python',
    title: 'map() and filter()', order: 18, xpReward: 110, isBoss: false,
    description: `## Quest 18: map() and filter()

\`map(fn, iterable)\` transforms every element. \`filter(fn, iterable)\` keeps matching elements:

\`\`\`python
nums = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, nums))   # [2, 4, 6, 8, 10]
evens   = list(filter(lambda x: x % 2 == 0, nums))  # [2, 4]
\`\`\`

### Your Mission
Given \`nums = [1, 2, 3, 4, 5, 6, 7, 8]\`:
1. Filter to keep only even numbers
2. Square each even number with \`map\`
3. Print the result`,
    starterCode: 'nums = [1, 2, 3, 4, 5, 6, 7, 8]\n# Filter evens, then square them\n',
    hint: 'evens = filter(lambda x: x%2==0, nums); print(list(map(lambda x: x**2, evens)))',
    tests: [{ description: 'Output is [4, 16, 36, 64]', expected: '[4, 16, 36, 64]' }],
  },
  {
    id: 'python-19', language: 'python', regionId: 'python',
    title: '*args and **kwargs', order: 19, xpReward: 120, isBoss: false,
    description: `## Quest 19: *args and **kwargs

\`*args\` collects extra positional arguments into a tuple. \`**kwargs\` collects keyword arguments into a dict:

\`\`\`python
def greet(*names):
    for name in names:
        print(f"Hello, {name}!")

greet("Aria", "Bolt")   # Hello, Aria!  Hello, Bolt!

def info(**details):
    for k, v in details.items():
        print(f"{k}: {v}")

info(hero="Aria", level=10)
\`\`\`

### Your Mission
Write \`total(*args)\` that returns the sum of all arguments. Print \`total(10, 20, 30, 40)\`.`,
    starterCode: '# Define total(*args)\n',
    hint: 'def total(*args): return sum(args)',
    tests: [{ description: 'Output is 100', expected: '100' }],
  },
  {
    id: 'python-20', language: 'python', regionId: 'python',
    title: 'Generators', order: 20, xpReward: 120, isBoss: false,
    description: `## Quest 20: Generators & yield

Generators produce values lazily using \`yield\`, saving memory:

\`\`\`python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for num in countdown(3):
    print(num)   # 3, then 2, then 1
\`\`\`

A generator only computes the next value when asked — perfect for large sequences.

### Your Mission
Write a generator \`evens_up_to(n)\` that yields even numbers from 2 up to \`n\` (inclusive).
Print each value for \`evens_up_to(8)\`.`,
    starterCode: '# Define your generator\n\nfor n in evens_up_to(8):\n    print(n)\n',
    hint: 'def evens_up_to(n): i=2; (while i<=n: yield i; i+=2)',
    tests: [{ description: 'Yields 2 4 6 8', expected: '2\n4\n6\n8' }],
  },
  {
    id: 'python-21', language: 'python', regionId: 'python',
    title: 'Decorators', order: 21, xpReward: 130, isBoss: false,
    description: `## Quest 21: Decorators

A **decorator** wraps a function to extend its behaviour without changing its code:

\`\`\`python
def shout(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper

@shout
def greet(name):
    return f"hello, {name}"

print(greet("aria"))   # HELLO, ARIA
\`\`\`

The \`@shout\` line is shorthand for \`greet = shout(greet)\`.

### Your Mission
Create a decorator \`double_result\` that multiplies the return value by 2.
Apply it to \`get_value()\` which returns \`21\`. Print the result.`,
    starterCode: '# Define double_result decorator and get_value function\n',
    hint: 'def double_result(func): def wrapper(): return func()*2; return wrapper',
    tests: [{ description: 'Output is 42', expected: '42' }],
  },
  {
    id: 'python-22', language: 'python', regionId: 'python',
    title: 'String Methods', order: 22, xpReward: 110, isBoss: false,
    description: `## Quest 22: String Methods

Python strings have many built-in methods:

\`\`\`python
s = "  Hello, World!  "
print(s.strip())            # "Hello, World!"
print(s.strip().lower())    # "hello, world!"
print("quest".upper())      # "QUEST"
print(",".join(["a","b","c"]))  # "a,b,c"
print("a-b-c".split("-"))   # ['a', 'b', 'c']
print("hello".replace("l","r"))  # "herro"
print("quest".startswith("qu")) # True
\`\`\`

### Your Mission
Given \`words = ["Python", "is", "awesome"]\`, join them with a space separator and print the result in uppercase.`,
    starterCode: 'words = ["Python", "is", "awesome"]\n# Join and uppercase\n',
    hint: 'print(" ".join(words).upper())',
    tests: [{ description: 'Output is PYTHON IS AWESOME', expected: 'PYTHON IS AWESOME' }],
  },
  {
    id: 'python-23', language: 'python', regionId: 'python',
    title: 'f-Strings & Formatting', order: 23, xpReward: 100, isBoss: false,
    description: `## Quest 23: f-Strings

f-strings embed Python expressions directly inside strings:

\`\`\`python
name = "Aria"
level = 15
hp = 87.333

print(f"{name} is level {level}")       # Aria is level 15
print(f"HP: {hp:.2f}")                  # HP: 87.33
print(f"Power: {2 ** 10}")             # Power: 1024
print(f"{'left':<10}|{'right':>10}")   # padding
\`\`\`

### Your Mission
Given \`name = "Bolt"\`, \`kills = 42\`, \`gold = 1337.5\`:
Print: \`Bolt has 42 kills and 1337.50 gold\``,
    starterCode: 'name = "Bolt"\nkills = 42\ngold = 1337.5\n# Print the formatted string\n',
    hint: 'print(f"{name} has {kills} kills and {gold:.2f} gold")',
    tests: [{ description: 'Output matches format', expected: 'Bolt has 42 kills and 1337.50 gold' }],
  },
  {
    id: 'python-24', language: 'python', regionId: 'python',
    title: 'Sorting with key=', order: 24, xpReward: 110, isBoss: false,
    description: `## Quest 24: sorted() and key=

\`sorted()\` returns a new sorted list. The \`key=\` argument accepts a function to sort by:

\`\`\`python
nums = [3, 1, 4, 1, 5, 9]
print(sorted(nums))                   # [1, 1, 3, 4, 5, 9]
print(sorted(nums, reverse=True))     # [9, 5, 4, 3, 1, 1]

words = ["banana", "fig", "apple"]
print(sorted(words, key=len))         # ['fig', 'apple', 'banana']
\`\`\`

### Your Mission
Sort \`["banana", "apple", "cherry", "date"]\` by length (shortest first).
Print the **first** element of the sorted result.`,
    starterCode: 'fruits = ["banana", "apple", "cherry", "date"]\n# Sort by length, print the first\n',
    hint: 'print(sorted(fruits, key=len)[0])',
    tests: [{ description: 'Output is date', expected: 'date' }],
  },
  {
    id: 'python-25', language: 'python', regionId: 'python',
    title: 'Class Inheritance', order: 25, xpReward: 130, isBoss: false,
    description: `## Quest 25: Inheritance

A child class inherits attributes and methods from its parent, and can override them:

\`\`\`python
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

d = Dog("Rex")
print(d.speak())   # Rex says Woof!
\`\`\`

Use \`super().__init__()\` to call the parent constructor.

### Your Mission
Create \`Warrior(Hero)\`. \`Hero\` has \`name\` and \`hp\`. Override \`battle_cry()\` to return \`"[name] charges!"\`. Print the cry for \`Warrior("Ragnar", 200)\`.`,
    starterCode: 'class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n    def battle_cry(self):\n        return "For glory!"\n\n# Define Warrior below\n',
    hint: 'class Warrior(Hero): def battle_cry(self): return f"{self.name} charges!"',
    tests: [{ description: 'Output is Ragnar charges!', expected: 'Ragnar charges!' }],
  },
  {
    id: 'python-26', language: 'python', regionId: 'python',
    title: '@property', order: 26, xpReward: 130, isBoss: false,
    description: `## Quest 26: The @property Decorator

\`@property\` lets you expose a computed value as a simple attribute:

\`\`\`python
class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        return 3.14159 * self.radius ** 2

c = Circle(5)
print(c.area)   # 78.53975 — no () needed
\`\`\`

### Your Mission
Create \`Rectangle\` with \`width\` and \`height\`.
Add \`@property perimeter\` returning \`2 * (width + height)\`.
Print the perimeter of \`Rectangle(6, 4)\`.`,
    starterCode: 'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n    # Add @property here\n\nr = Rectangle(6, 4)\nprint(r.perimeter)\n',
    hint: '@property\ndef perimeter(self): return 2 * (self.width + self.height)',
    tests: [{ description: 'Output is 20', expected: '20' }],
  },
  {
    id: 'python-27', language: 'python', regionId: 'python',
    title: 'Dunder Methods', order: 27, xpReward: 140, isBoss: false,
    description: `## Quest 27: Dunder (Magic) Methods

**Dunder methods** integrate your classes with Python's built-in operations:

\`\`\`python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __str__(self):
        return f"({self.x}, {self.y})"
    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)
    def __len__(self):
        return 2

v = Vector(1, 2) + Vector(3, 4)
print(v)        # (4, 6)
print(len(v))   # 2
\`\`\`

### Your Mission
Create a \`Card\` class with \`rank\` and \`suit\`. Implement \`__str__\` to return \`"rank of suit"\` (e.g. \`"Ace of Spades"\`). Print \`Card("Ace", "Spades")\`.`,
    starterCode: 'class Card:\n    def __init__(self, rank, suit):\n        self.rank = rank\n        self.suit = suit\n    # Implement __str__\n\nc = Card("Ace", "Spades")\nprint(c)\n',
    hint: 'def __str__(self): return f"{self.rank} of {self.suit}"',
    tests: [{ description: 'Output is Ace of Spades', expected: 'Ace of Spades' }],
  },
  {
    id: 'python-28', language: 'python', regionId: 'python',
    title: 'zip() and enumerate()', order: 28, xpReward: 110, isBoss: false,
    description: `## Quest 28: zip() and enumerate()

\`zip()\` pairs elements from multiple iterables. \`enumerate()\` adds an index counter:

\`\`\`python
names  = ["Aria", "Bolt"]
scores = [95, 87]
for name, score in zip(names, scores):
    print(f"{name}: {score}")

for i, name in enumerate(["a","b","c"], start=1):
    print(f"{i}. {name}")
\`\`\`

### Your Mission
Given \`items = ["sword", "shield", "potion"]\`, use \`enumerate(start=1)\` to print:
\`1. sword\`, \`2. shield\`, \`3. potion\` (one per line).`,
    starterCode: 'items = ["sword", "shield", "potion"]\n# Use enumerate to print a numbered list\n',
    hint: 'for i, item in enumerate(items, start=1): print(f"{i}. {item}")',
    tests: [{ description: 'Numbered list output', expected: '1. sword\n2. shield\n3. potion' }],
  },
  {
    id: 'python-29', language: 'python', regionId: 'python',
    title: 'List Slicing', order: 29, xpReward: 110, isBoss: false,
    description: `## Quest 29: List Slicing

Slice with \`list[start:stop:step]\` to extract sub-lists:

\`\`\`python
nums = list(range(10))  # [0, 1, 2, ..., 9]
print(nums[2:6])        # [2, 3, 4, 5]
print(nums[::2])        # [0, 2, 4, 6, 8]  every other
print(nums[::-1])       # reversed
print(nums[-3:])        # last 3: [7, 8, 9]
\`\`\`

### Your Mission
Given \`nums = list(range(1, 11))\` (1–10):
1. Print every second number (starting from index 0)
2. Print the last 3 numbers`,
    starterCode: 'nums = list(range(1, 11))\n# Print every other, then last 3\n',
    hint: 'print(nums[::2]) then print(nums[-3:])',
    tests: [{ description: 'Slices output', expected: '[1, 3, 5, 7, 9]\n[8, 9, 10]' }],
  },
  {
    id: 'python-30', language: 'python', regionId: 'python',
    title: 'Boss: The Grand Pythonmaster', order: 30, xpReward: 350, isBoss: true,
    description: `## Final Boss: The Grand Pythonmaster

The ultimate Python challenge! Combine classes, comprehensions, lambdas, and sorting.

\`\`\`python
class Spell:
    def __init__(self, name, power):
        self.name = name
        self.power = power

spells = [Spell("Fireball", 80), Spell("Ice", 45), Spell("Thunder", 95)]
powerful = [s.name for s in spells if s.power > 60]
strongest = max(spells, key=lambda s: s.power)
\`\`\`

### Your Mission
1. Create a \`Hero\` class with \`name\` (str) and \`xp\` (int)
2. Create 4 heroes: Aria(1200), Bolt(850), Cara(1500), Drake(950)
3. Use a list comprehension to get names of heroes where \`xp > 1000\`
4. Print the **count** of qualifying heroes
5. Print the **name** of the hero with the most xp`,
    starterCode: '# Define Hero class\n\n# Create heroes list\n\n# List comprehension for xp > 1000\n\n# Print count and top hero name\n',
    hint: 'elite=[h.name for h in heroes if h.xp>1000]; print(len(elite)); print(max(heroes,key=lambda h:h.xp).name)',
    tests: [{ description: 'Count then top hero', expected: '2\nCara' }],
  },
]

// ─────────────────────────────────────────────────────────────
// JAVASCRIPT — 30 lessons
// ─────────────────────────────────────────────────────────────
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
  {
    id: 'javascript-16', language: 'javascript', regionId: 'javascript',
    title: 'Destructuring', order: 16, xpReward: 100, isBoss: false,
    description: `## Quest 16: Destructuring

Destructuring unpacks values from arrays and objects in one line:

\`\`\`javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5]
console.log(first)  // 1
console.log(rest)   // [3, 4, 5]

const { name, level, ...stats } = { name: 'Aria', level: 10, hp: 200, mp: 80 }
console.log(name)   // Aria
console.log(stats)  // { hp: 200, mp: 80 }
\`\`\`

### Your Mission
Destructure \`{ title, year, ...extra }\` from \`{ title: "CodeQuest", year: 2024, genre: "RPG", rating: 5 }\`.
Print \`title\`, then \`extra.rating\`.`,
    starterCode: 'const game = { title: "CodeQuest", year: 2024, genre: "RPG", rating: 5 }\n// Destructure and print\n',
    hint: 'const { title, year, ...extra } = game; console.log(title); console.log(extra.rating)',
    tests: [{ description: 'Prints title then rating', expected: 'CodeQuest\n5' }],
  },
  {
    id: 'javascript-17', language: 'javascript', regionId: 'javascript',
    title: 'Spread Operator', order: 17, xpReward: 100, isBoss: false,
    description: `## Quest 17: Spread & Rest

The \`...\` spread operator expands iterables. It also merges objects:

\`\`\`javascript
const a = [1, 2, 3]
const b = [4, 5, 6]
const combined = [...a, ...b]   // [1,2,3,4,5,6]

const hero = { name: 'Aria', hp: 100 }
const buffed = { ...hero, hp: 150, power: 20 }
// { name: 'Aria', hp: 150, power: 20 }
\`\`\`

### Your Mission
Merge \`defaults = { speed: 1, power: 5, defense: 5 }\` with \`upgrades = { power: 15, magic: 30 }\`.
Print the merged object's \`power\` and \`magic\`.`,
    starterCode: 'const defaults = { speed: 1, power: 5, defense: 5 }\nconst upgrades = { power: 15, magic: 30 }\n// Merge and print\n',
    hint: 'const merged = {...defaults, ...upgrades}; console.log(merged.power); console.log(merged.magic)',
    tests: [{ description: 'Prints 15 then 30', expected: '15\n30' }],
  },
  {
    id: 'javascript-18', language: 'javascript', regionId: 'javascript',
    title: 'Array Methods: find & some', order: 18, xpReward: 110, isBoss: false,
    description: `## Quest 18: find() and some()

\`find()\` returns the first matching element. \`some()\` checks if any element matches:

\`\`\`javascript
const heroes = [
  { name: 'Aria', level: 12 },
  { name: 'Bolt', level: 5 },
  { name: 'Cara', level: 8 },
]
const found = heroes.find(h => h.level > 10)
console.log(found.name)  // Aria

const hasNovice = heroes.some(h => h.level < 6)
console.log(hasNovice)  // true
\`\`\`

### Your Mission
Find the first item in \`inventory\` with \`qty === 0\` and print its \`name\`.
Then print \`true\` if any item has \`qty > 10\`.`,
    starterCode: 'const inventory = [\n  { name: "sword", qty: 1 },\n  { name: "potion", qty: 0 },\n  { name: "arrows", qty: 15 },\n]\n// Find empty item and check if any qty > 10\n',
    hint: 'console.log(inventory.find(i=>i.qty===0).name); console.log(inventory.some(i=>i.qty>10))',
    tests: [{ description: 'Prints potion then true', expected: 'potion\ntrue' }],
  },
  {
    id: 'javascript-19', language: 'javascript', regionId: 'javascript',
    title: 'Array Methods: every & flat', order: 19, xpReward: 110, isBoss: false,
    description: `## Quest 19: every() and flat()

\`every()\` checks if ALL elements match. \`flat()\` flattens nested arrays:

\`\`\`javascript
const scores = [80, 92, 76, 88]
console.log(scores.every(s => s >= 70))  // true — all pass

const nested = [[1, 2], [3, 4], [5]]
console.log(nested.flat())     // [1,2,3,4,5]

const deep = [1, [2, [3, [4]]]]
console.log(deep.flat(Infinity))  // [1,2,3,4]
\`\`\`

### Your Mission
Given \`teams = [["Aria","Bolt"], ["Cara","Drake"], ["Eve"]]\`, flatten it and print the total count of players.`,
    starterCode: 'const teams = [["Aria","Bolt"], ["Cara","Drake"], ["Eve"]]\n// Flatten and print count\n',
    hint: 'console.log(teams.flat().length)',
    tests: [{ description: 'Output is 5', expected: '5' }],
  },
  {
    id: 'javascript-20', language: 'javascript', regionId: 'javascript',
    title: 'Map & Set', order: 20, xpReward: 110, isBoss: false,
    description: `## Quest 20: Map and Set

\`Map\` stores key-value pairs (any type as key). \`Set\` stores unique values:

\`\`\`javascript
const map = new Map()
map.set('hero', 'Aria')
map.set('level', 10)
console.log(map.get('hero'))   // Aria
console.log(map.size)          // 2

const unique = new Set([1, 2, 2, 3, 3, 3])
console.log(unique.size)       // 3
console.log([...unique])       // [1, 2, 3]
\`\`\`

### Your Mission
Create a Set from \`["apple","banana","apple","cherry","banana"]\` and print how many unique fruits there are.`,
    starterCode: 'const fruits = ["apple","banana","apple","cherry","banana"]\n// Use Set to count unique fruits\n',
    hint: 'console.log(new Set(fruits).size)',
    tests: [{ description: 'Output is 3', expected: '3' }],
  },
  {
    id: 'javascript-21', language: 'javascript', regionId: 'javascript',
    title: 'Closures', order: 21, xpReward: 120, isBoss: false,
    description: `## Quest 21: Closures

A closure is a function that remembers the variables from its outer scope even after that scope has finished:

\`\`\`javascript
function makeCounter(start = 0) {
  let count = start
  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  }
}

const counter = makeCounter(10)
counter.increment()
counter.increment()
console.log(counter.value())  // 12
\`\`\`

### Your Mission
Write \`makeMultiplier(factor)\` that returns a function which multiplies its argument by \`factor\`.
Create \`triple = makeMultiplier(3)\` and print \`triple(7)\`.`,
    starterCode: '// Define makeMultiplier\n\nconst triple = makeMultiplier(3)\nconsole.log(triple(7))\n',
    hint: 'function makeMultiplier(factor) { return (n) => n * factor }',
    tests: [{ description: 'Output is 21', expected: '21' }],
  },
  {
    id: 'javascript-22', language: 'javascript', regionId: 'javascript',
    title: 'Promises', order: 22, xpReward: 120, isBoss: false,
    description: `## Quest 22: Promises

A \`Promise\` represents a value that will be available in the future:

\`\`\`javascript
const roll = new Promise((resolve, reject) => {
  const n = Math.floor(Math.random() * 6) + 1
  if (n >= 3) resolve(n)
  else reject(new Error('Too low!'))
})

roll
  .then(val => console.log('Rolled:', val))
  .catch(err => console.log('Error:', err.message))
\`\`\`

### Your Mission
Create a Promise that resolves with \`"Quest complete!"\` after calling \`resolve\`.
Log the value using \`.then()\`.`,
    starterCode: 'const quest = new Promise((resolve, reject) => {\n  // resolve with "Quest complete!"\n})\n\nquest.then(msg => console.log(msg))\n',
    hint: 'resolve("Quest complete!")',
    tests: [{ description: 'Output is Quest complete!', expected: 'Quest complete!' }],
  },
  {
    id: 'javascript-23', language: 'javascript', regionId: 'javascript',
    title: 'Error Handling', order: 23, xpReward: 110, isBoss: false,
    description: `## Quest 23: try / catch / finally

Handle errors gracefully so your program doesn't crash:

\`\`\`javascript
function divide(a, b) {
  if (b === 0) throw new Error('Cannot divide by zero')
  return a / b
}

try {
  console.log(divide(10, 0))
} catch (err) {
  console.log('Caught:', err.message)
} finally {
  console.log('Done')
}
\`\`\`

### Your Mission
Write \`parseJSON(str)\` that calls \`JSON.parse(str)\`.
Wrap it in try/catch — on error print \`"Invalid JSON"\`.
Call it with \`"not json"\` and print the result.`,
    starterCode: 'function parseJSON(str) {\n  // try/catch JSON.parse\n}\n\nparseJSON("not json")\n',
    hint: 'try { return JSON.parse(str) } catch { console.log("Invalid JSON") }',
    tests: [{ description: 'Prints Invalid JSON', expected: 'Invalid JSON' }],
  },
  {
    id: 'javascript-24', language: 'javascript', regionId: 'javascript',
    title: 'Modules (import/export)', order: 24, xpReward: 110, isBoss: false,
    description: `## Quest 24: Modules

Modules let you split code across files. Use \`export\` to expose, \`import\` to use:

\`\`\`javascript
// math.js
export const PI = 3.14159
export function circleArea(r) { return PI * r * r }
export default function add(a, b) { return a + b }

// main.js
import add, { PI, circleArea } from './math.js'
console.log(PI)           // 3.14159
console.log(circleArea(5))  // 78.53975
console.log(add(2, 3))      // 5
\`\`\`

### Your Mission
In a single file, define and export (use \`const\`) a function \`power(base, exp)\` that returns \`base ** exp\`.
Then call it and print \`power(3, 4)\`.`,
    starterCode: '// Define power function and print power(3, 4)\nconst power = (base, exp) => base ** exp\nconsole.log(power(3, 4))\n',
    hint: 'console.log(power(3, 4)) should print 81',
    tests: [{ description: 'Output is 81', expected: '81' }],
  },
  {
    id: 'javascript-25', language: 'javascript', regionId: 'javascript',
    title: 'Symbol & WeakMap', order: 25, xpReward: 120, isBoss: false,
    description: `## Quest 25: Symbol

\`Symbol\` creates a guaranteed-unique value — useful as object keys:

\`\`\`javascript
const id = Symbol('id')
const user = { name: 'Aria', [id]: 42 }
console.log(user[id])       // 42
console.log(user.name)      // Aria
console.log(id.toString())  // Symbol(id)

// Symbols don't appear in for...in or Object.keys()
console.log(Object.keys(user))  // ['name']
\`\`\`

### Your Mission
Create a Symbol \`secretKey\`. Add it to an object along with a public \`name\` property.
Print the symbol value and confirm \`Object.keys()\` does NOT include it (print the length of Object.keys).`,
    starterCode: 'const secretKey = Symbol("secret")\nconst item = { name: "Excalibur", [secretKey]: 9999 }\n// Print the secret value and key count\n',
    hint: 'console.log(item[secretKey]); console.log(Object.keys(item).length)',
    tests: [{ description: 'Prints 9999 then 1', expected: '9999\n1' }],
  },
  {
    id: 'javascript-26', language: 'javascript', regionId: 'javascript',
    title: 'Iterators & for...of', order: 26, xpReward: 120, isBoss: false,
    description: `## Quest 26: Iterators

Any object with a \`[Symbol.iterator]\` method is iterable. \`for...of\` uses it:

\`\`\`javascript
function range(start, end) {
  return {
    [Symbol.iterator]() {
      let current = start
      return {
        next() {
          return current <= end
            ? { value: current++, done: false }
            : { value: undefined, done: true }
        }
      }
    }
  }
}

for (const n of range(1, 4)) console.log(n)  // 1 2 3 4
\`\`\`

### Your Mission
Using the \`range\` function above, print the sum of all numbers from 1 to 10.`,
    starterCode: 'function range(start, end) {\n  return {\n    [Symbol.iterator]() {\n      let current = start\n      return { next() { return current <= end ? { value: current++, done: false } : { value: undefined, done: true } } }\n    }\n  }\n}\n\n// Sum 1 to 10 using range\n',
    hint: 'let sum = 0; for (const n of range(1, 10)) sum += n; console.log(sum)',
    tests: [{ description: 'Output is 55', expected: '55' }],
  },
  {
    id: 'javascript-27', language: 'javascript', regionId: 'javascript',
    title: 'Proxy & Reflect', order: 27, xpReward: 130, isBoss: false,
    description: `## Quest 27: Proxy

\`Proxy\` intercepts operations on objects — reads, writes, function calls, etc.:

\`\`\`javascript
const handler = {
  get(target, key) {
    return key in target ? target[key] : \`Property \${key} not found\`
  },
  set(target, key, value) {
    if (typeof value !== 'number') throw new TypeError('Only numbers allowed')
    target[key] = value
    return true
  }
}

const guarded = new Proxy({}, handler)
guarded.hp = 100
console.log(guarded.hp)      // 100
console.log(guarded.mana)    // Property mana not found
\`\`\`

### Your Mission
Create a Proxy around \`{}\` with a \`get\` trap that returns \`0\` for missing properties instead of \`undefined\`.
Print \`proxy.gold\` (should be 0), then set \`proxy.gold = 500\` and print it again.`,
    starterCode: 'const handler = {\n  get(target, key) {\n    // Return 0 for missing properties\n  }\n}\nconst proxy = new Proxy({}, handler)\nconsole.log(proxy.gold)\nproxy.gold = 500\nconsole.log(proxy.gold)\n',
    hint: 'return key in target ? target[key] : 0',
    tests: [{ description: 'Prints 0 then 500', expected: '0\n500' }],
  },
  {
    id: 'javascript-28', language: 'javascript', regionId: 'javascript',
    title: 'Regular Expressions', order: 28, xpReward: 120, isBoss: false,
    description: `## Quest 28: Regular Expressions

Regex patterns match and manipulate strings:

\`\`\`javascript
const email = "hero@codequest.com"
const valid = /^[^@]+@[^@]+\.[^@]+$/.test(email)
console.log(valid)   // true

const text = "The hero has 42 gold and 7 potions"
const nums = text.match(/\d+/g)
console.log(nums)    // ['42', '7']

const result = "Hello World".replace(/\b\w/g, c => c.toLowerCase())
console.log(result)  // hello world
\`\`\`

### Your Mission
Extract all numbers from \`"Quest 3: defeat 12 enemies in 5 minutes"\` using \`.match()\`.
Print the array.`,
    starterCode: 'const quest = "Quest 3: defeat 12 enemies in 5 minutes"\n// Extract all numbers\n',
    hint: 'console.log(quest.match(/\\d+/g))',
    tests: [{ description: 'Output is array of numbers', expected: '["3","12","5"]' }],
  },
  {
    id: 'javascript-29', language: 'javascript', regionId: 'javascript',
    title: 'Prototype Chain', order: 29, xpReward: 130, isBoss: false,
    description: `## Quest 29: Prototype Chain

Every JavaScript object has a prototype — a fallback for property lookups:

\`\`\`javascript
function Hero(name, hp) {
  this.name = name
  this.hp = hp
}
Hero.prototype.greet = function() {
  return \`I am \${this.name} with \${this.hp} HP\`
}

const h = new Hero('Aria', 100)
console.log(h.greet())            // I am Aria with 100 HP
console.log(h.hasOwnProperty('name'))  // true
console.log(h.hasOwnProperty('greet')) // false — on prototype
\`\`\`

### Your Mission
Using the constructor function above, add a \`levelUp()\` method to \`Hero.prototype\` that increases \`hp\` by 50 and returns the new hp.
Create \`hero = new Hero("Drake", 100)\`, call \`levelUp()\`, and print the result.`,
    starterCode: 'function Hero(name, hp) { this.name = name; this.hp = hp }\n// Add levelUp to prototype\n\nconst hero = new Hero("Drake", 100)\nconsole.log(hero.levelUp())\n',
    hint: 'Hero.prototype.levelUp = function() { this.hp += 50; return this.hp }',
    tests: [{ description: 'Output is 150', expected: '150' }],
  },
  {
    id: 'javascript-30', language: 'javascript', regionId: 'javascript',
    title: 'Boss: The Full-Stack Phantom', order: 30, xpReward: 350, isBoss: true,
    description: `## Final Boss: The Full-Stack Phantom

Combine classes, closures, async/await, and array methods to defeat the Phantom!

\`\`\`javascript
class EventEmitter {
  #listeners = {}
  on(event, fn) { (this.#listeners[event] ??= []).push(fn) }
  emit(event, data) { this.#listeners[event]?.forEach(fn => fn(data)) }
}
\`\`\`

### Your Mission
1. Create a class \`QuestLog\` with a private \`#quests = []\` array
2. Add \`addQuest(name, xp)\` that pushes \`{ name, xp, done: false }\`
3. Add \`complete(name)\` that sets the quest's \`done\` to \`true\`
4. Add \`get totalXP()\` getter returning sum of \`xp\` for completed quests
5. Create a log, add 3 quests (50xp, 100xp, 75xp), complete the first two, print \`totalXP\``,
    starterCode: 'class QuestLog {\n  #quests = []\n  // Implement addQuest, complete, totalXP\n}\n\nconst log = new QuestLog()\nlog.addQuest("Slay Dragon", 50)\nlog.addQuest("Find Sword", 100)\nlog.addQuest("Rescue King", 75)\nlog.complete("Slay Dragon")\nlog.complete("Find Sword")\nconsole.log(log.totalXP)\n',
    hint: 'addQuest pushes object, complete finds by name and sets done=true, totalXP uses filter+reduce',
    tests: [{ description: 'Output is 150', expected: '150' }],
  },
]

// ─────────────────────────────────────────────────────────────
// TYPESCRIPT — 30 lessons
// ─────────────────────────────────────────────────────────────
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
  {
    id: 'typescript-15', language: 'typescript', regionId: 'typescript',
    title: 'Type Narrowing', order: 15, xpReward: 110, isBoss: false,
    description: `## Quest 15: Type Narrowing

TypeScript narrows types inside conditionals using \`typeof\`, \`instanceof\`, and \`in\`:

\`\`\`typescript
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase()
  }
  return value.toFixed(2)
}

console.log(format("hello"))  // HELLO
console.log(format(3.14159))  // 3.14
\`\`\`

### Your Mission
Write \`describe(x: string | number | boolean)\` that returns:
- \`"text: [value]"\` for strings
- \`"number: [value]"\` for numbers
- \`"flag: [value]"\` for booleans

Print \`describe("quest")\`, \`describe(42)\`, \`describe(true)\`.`,
    starterCode: 'function describe(x: string | number | boolean): string {\n  // Narrow and return\n  return ""\n}\n\nconsole.log(describe("quest"))\nconsole.log(describe(42))\nconsole.log(describe(true))\n',
    hint: 'if (typeof x === "string") return `text: ${x}` etc.',
    tests: [{ description: 'Three labeled outputs', expected: 'text: quest\nnumber: 42\nflag: true' }],
  },
  {
    id: 'typescript-16', language: 'typescript', regionId: 'typescript',
    title: 'Enums', order: 16, xpReward: 110, isBoss: false,
    description: `## Quest 16: Enums

Enums define a set of named constants:

\`\`\`typescript
enum Direction { Up, Down, Left, Right }
let move: Direction = Direction.Up
console.log(move)         // 0 (numeric by default)
console.log(Direction[0]) // Up

enum Status { Active = "ACTIVE", Inactive = "INACTIVE" }
console.log(Status.Active)  // ACTIVE
\`\`\`

### Your Mission
Define an enum \`HeroClass\` with values \`Warrior\`, \`Mage\`, \`Rogue\` (string values \`"WARRIOR"\`, \`"MAGE"\`, \`"ROGUE"\`).
Create a variable of type \`HeroClass\` set to \`Mage\` and print it.`,
    starterCode: '// Define HeroClass enum\n\nconst myClass: HeroClass = HeroClass.Mage\nconsole.log(myClass)\n',
    hint: 'enum HeroClass { Warrior = "WARRIOR", Mage = "MAGE", Rogue = "ROGUE" }',
    tests: [{ description: 'Output is MAGE', expected: 'MAGE' }],
  },
  {
    id: 'typescript-17', language: 'typescript', regionId: 'typescript',
    title: 'Mapped Types', order: 17, xpReward: 120, isBoss: false,
    description: `## Quest 17: Mapped Types

Mapped types transform every property of an existing type:

\`\`\`typescript
type Readonly<T> = { readonly [K in keyof T]: T[K] }
type Optional<T> = { [K in keyof T]?: T[K] }

interface Hero { name: string; hp: number; level: number }

type ReadonlyHero = Readonly<Hero>
type OptionalHero = Optional<Hero>
\`\`\`

### Your Mission
Create a mapped type \`Nullable<T>\` where every property can also be \`null\`.
Apply it to \`{ name: string; score: number }\` and create an object with \`name: null, score: 100\`.
Print the score.`,
    starterCode: 'type Nullable<T> = { [K in keyof T]: T[K] | null }\n\ntype Stats = { name: string; score: number }\nconst s: Nullable<Stats> = { name: null, score: 100 }\nconsole.log(s.score)\n',
    hint: 'The type is already defined — just print s.score',
    tests: [{ description: 'Output is 100', expected: '100' }],
  },
  {
    id: 'typescript-18', language: 'typescript', regionId: 'typescript',
    title: 'Conditional Types', order: 18, xpReward: 130, isBoss: false,
    description: `## Quest 18: Conditional Types

Conditional types select types based on conditions:

\`\`\`typescript
type IsString<T> = T extends string ? "yes" : "no"

type A = IsString<string>   // "yes"
type B = IsString<number>   // "no"

// Unwrap array element type
type ElementType<T> = T extends (infer U)[] ? U : T
type X = ElementType<number[]>  // number
type Y = ElementType<string>    // string
\`\`\`

### Your Mission
Define \`type NonNullable<T> = T extends null | undefined ? never : T\`.
Create a value of type \`NonNullable<string | null>\` and print it.`,
    starterCode: 'type MyNonNullable<T> = T extends null | undefined ? never : T\n\nconst val: MyNonNullable<string | null> = "alive"\nconsole.log(val)\n',
    hint: 'The type already excludes null — val must be a string',
    tests: [{ description: 'Output is alive', expected: 'alive' }],
  },
  {
    id: 'typescript-19', language: 'typescript', regionId: 'typescript',
    title: 'Decorators', order: 19, xpReward: 130, isBoss: false,
    description: `## Quest 19: Decorators (experimental)

TypeScript decorators add metadata or behaviour to classes and methods:

\`\`\`typescript
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function(...args: any[]) {
    console.log(\`Calling \${key}\`)
    return original.apply(this, args)
  }
  return descriptor
}

class Hero {
  @log
  attack() { return "Slash!" }
}
const h = new Hero()
console.log(h.attack())  // Calling attack \\n Slash!
\`\`\`

### Your Mission
Without using a decorator (just simulate the pattern), wrap a \`heal()\` method that returns \`"Healed!"\` so it first logs \`"Calling heal"\`, then returns the original result. Print both lines.`,
    starterCode: 'class Hero {\n  heal() { return "Healed!" }\n}\n\n// Wrap heal to log before calling\nconst hero = new Hero()\nconst original = hero.heal.bind(hero)\nhero.heal = function() {\n  // Log and call original\n  return ""\n}\nconsole.log(hero.heal())\n',
    hint: 'console.log("Calling heal"); return original()',
    tests: [{ description: 'Logs then returns', expected: 'Calling heal\nHealed!' }],
  },
  {
    id: 'typescript-20', language: 'typescript', regionId: 'typescript',
    title: 'Discriminated Unions', order: 20, xpReward: 130, isBoss: false,
    description: `## Quest 20: Discriminated Unions

A discriminated union uses a shared \`kind\` field to distinguish types:

\`\`\`typescript
type Circle   = { kind: "circle";   radius: number }
type Rectangle = { kind: "rectangle"; width: number; height: number }
type Shape = Circle | Rectangle

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":    return Math.PI * s.radius ** 2
    case "rectangle": return s.width * s.height
  }
}
\`\`\`

### Your Mission
Add a \`Triangle\` type with \`kind: "triangle"\`, \`base: number\`, \`height: number\`.
Add it to \`Shape\` and handle it in \`area\` (\`0.5 * base * height\`).
Print \`area({ kind: "triangle", base: 6, height: 4 })\`.`,
    starterCode: 'type Circle    = { kind: "circle";    radius: number }\ntype Rectangle = { kind: "rectangle"; width: number; height: number }\ntype Triangle  = { kind: "triangle";  base: number; height: number }\ntype Shape = Circle | Rectangle | Triangle\n\nfunction area(s: Shape): number {\n  switch (s.kind) {\n    case "circle":    return Math.PI * s.radius ** 2\n    case "rectangle": return s.width * s.height\n    case "triangle":  return 0  // fix this\n  }\n}\n\nconsole.log(area({ kind: "triangle", base: 6, height: 4 }))\n',
    hint: 'case "triangle": return 0.5 * s.base * s.height',
    tests: [{ description: 'Output is 12', expected: '12' }],
  },
  {
    id: 'typescript-21', language: 'typescript', regionId: 'typescript',
    title: 'Intersection Types', order: 21, xpReward: 120, isBoss: false,
    description: `## Quest 21: Intersection Types

\`A & B\` creates a type with ALL properties of both:

\`\`\`typescript
type Named   = { name: string }
type Leveled = { level: number }
type Hero = Named & Leveled & { hp: number }

const h: Hero = { name: "Aria", level: 10, hp: 200 }
console.log(\`\${h.name} Lv\${h.level}\`)  // Aria Lv10
\`\`\`

### Your Mission
Define \`type Timestamped = { createdAt: string }\` and \`type Identifiable = { id: number }\`.
Create \`type Record = Timestamped & Identifiable & { value: string }\`.
Create one and print its \`id\` and \`value\`.`,
    starterCode: 'type Timestamped  = { createdAt: string }\ntype Identifiable = { id: number }\ntype Record = Timestamped & Identifiable & { value: string }\n\nconst rec: Record = { createdAt: "2024-01-01", id: 7, value: "CodeQuest" }\nconsole.log(rec.id)\nconsole.log(rec.value)\n',
    hint: 'Just run the code as-is',
    tests: [{ description: 'Prints 7 then CodeQuest', expected: '7\nCodeQuest' }],
  },
  {
    id: 'typescript-22', language: 'typescript', regionId: 'typescript',
    title: 'Tuple Types', order: 22, xpReward: 120, isBoss: false,
    description: `## Quest 22: Tuples

Tuples are fixed-length arrays with specific types at each position:

\`\`\`typescript
type Point = [number, number]
const p: Point = [10, 20]

type Entry = [string, number, boolean]
const e: Entry = ["Aria", 10, true]
const [name, level, active] = e

// Named tuples (TS 4.0+)
type Range = [start: number, end: number]
\`\`\`

### Your Mission
Define \`type RGB = [red: number, green: number, blue: number]\`.
Create an RGB value for pure green \`[0, 255, 0]\`.
Destructure and print the green channel.`,
    starterCode: 'type RGB = [red: number, green: number, blue: number]\n\nconst green: RGB = [0, 255, 0]\nconst [r, g, b] = green\nconsole.log(g)\n',
    hint: 'console.log(g) should print 255',
    tests: [{ description: 'Output is 255', expected: '255' }],
  },
  {
    id: 'typescript-23', language: 'typescript', regionId: 'typescript',
    title: 'Readonly & Const Assertions', order: 23, xpReward: 120, isBoss: false,
    description: `## Quest 23: readonly and as const

\`readonly\` prevents mutation. \`as const\` freezes literals into literal types:

\`\`\`typescript
const config = {
  host: "localhost",
  port: 5000,
} as const
// config.port = 9000  // Error! readonly

type Config = typeof config
// { readonly host: "localhost"; readonly port: 5000 }

const DIRECTIONS = ["north", "south", "east", "west"] as const
type Direction = typeof DIRECTIONS[number]  // "north" | "south" | "east" | "west"
\`\`\`

### Your Mission
Create \`const ROLES = ["admin", "user", "guest"] as const\`.
Define \`type Role = typeof ROLES[number]\`.
Declare \`const r: Role = "admin"\` and print it.`,
    starterCode: 'const ROLES = ["admin", "user", "guest"] as const\ntype Role = typeof ROLES[number]\n\nconst r: Role = "admin"\nconsole.log(r)\n',
    hint: 'Just run the code — it should print admin',
    tests: [{ description: 'Output is admin', expected: 'admin' }],
  },
  {
    id: 'typescript-24', language: 'typescript', regionId: 'typescript',
    title: 'Type Guards', order: 24, xpReward: 130, isBoss: false,
    description: `## Quest 24: User-Defined Type Guards

A type guard is a function that returns a type predicate \`x is T\`:

\`\`\`typescript
interface Fish  { swim(): void }
interface Bird  { fly(): void }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) pet.swim()
  else pet.fly()
}
\`\`\`

### Your Mission
Define \`interface Sword { slash(): string }\` and \`interface Wand { cast(): string }\`.
Write \`isSword(w: Sword | Wand): w is Sword\` that checks for the \`slash\` property.
Create both objects, run through a function that calls the right method, and print the results.`,
    starterCode: 'interface Sword { slash(): string }\ninterface Wand  { cast(): string }\n\nfunction isSword(w: Sword | Wand): w is Sword {\n  return (w as Sword).slash !== undefined\n}\n\nfunction use(w: Sword | Wand): string {\n  return isSword(w) ? w.slash() : w.cast()\n}\n\nconst sword: Sword = { slash: () => "Slash!" }\nconst wand: Wand   = { cast: () => "Zap!" }\nconsole.log(use(sword))\nconsole.log(use(wand))\n',
    hint: 'Run as-is — isSword checks for slash property',
    tests: [{ description: 'Prints Slash! then Zap!', expected: 'Slash!\nZap!' }],
  },
  {
    id: 'typescript-25', language: 'typescript', regionId: 'typescript',
    title: 'Namespace & Declaration Merging', order: 25, xpReward: 130, isBoss: false,
    description: `## Quest 25: Namespaces

Namespaces group related code under a single name to avoid collisions:

\`\`\`typescript
namespace Game {
  export interface Hero { name: string; level: number }
  export function levelUp(hero: Hero): Hero {
    return { ...hero, level: hero.level + 1 }
  }
}

const h: Game.Hero = { name: "Aria", level: 5 }
const leveled = Game.levelUp(h)
console.log(leveled.level)  // 6
\`\`\`

### Your Mission
Create a \`namespace Math2\` with an exported \`square(n: number): number\` function.
Call \`Math2.square(9)\` and print the result.`,
    starterCode: 'namespace Math2 {\n  export function square(n: number): number {\n    return n * n\n  }\n}\n\nconsole.log(Math2.square(9))\n',
    hint: 'Should print 81',
    tests: [{ description: 'Output is 81', expected: '81' }],
  },
  {
    id: 'typescript-26', language: 'typescript', regionId: 'typescript',
    title: 'Extract & Exclude Utilities', order: 26, xpReward: 130, isBoss: false,
    description: `## Quest 26: Extract and Exclude

\`Extract<T, U>\` keeps types assignable to U. \`Exclude<T, U>\` removes them:

\`\`\`typescript
type All = string | number | boolean | null

type OnlyStrNum = Extract<All, string | number>  // string | number
type NoNull     = Exclude<All, null>              // string | number | boolean

type EventType = "click" | "focus" | "keydown" | "change"
type MouseEvent = Extract<EventType, "click" | "focus">  // "click" | "focus"
\`\`\`

### Your Mission
From \`type Status = "active" | "inactive" | "banned" | "pending"\`,
extract only \`"active" | "pending"\` into type \`LiveStatus\`.
Declare a variable of that type with value \`"active"\` and print it.`,
    starterCode: 'type Status = "active" | "inactive" | "banned" | "pending"\ntype LiveStatus = Extract<Status, "active" | "pending">\n\nconst s: LiveStatus = "active"\nconsole.log(s)\n',
    hint: 'Should print active',
    tests: [{ description: 'Output is active', expected: 'active' }],
  },
  {
    id: 'typescript-27', language: 'typescript', regionId: 'typescript',
    title: 'Template Literal Types', order: 27, xpReward: 140, isBoss: false,
    description: `## Quest 27: Template Literal Types

TypeScript 4.1+ lets you build string literal types with template syntax:

\`\`\`typescript
type Direction = "north" | "south" | "east" | "west"
type Command   = \`go_\${Direction}\`
// "go_north" | "go_south" | "go_east" | "go_west"

type EventName<T extends string> = \`on\${Capitalize<T>}\`
type ClickEvent = EventName<"click">   // "onClick"
\`\`\`

### Your Mission
Define \`type Animal = "cat" | "dog"\` and \`type Sound<T extends string> = \`\${T}_sound\`\`.
Print a value of type \`Sound<"cat">\`.`,
    starterCode: 'type Animal = "cat" | "dog"\ntype Sound<T extends string> = `${T}_sound`\n\nconst s: Sound<"cat"> = "cat_sound"\nconsole.log(s)\n',
    hint: 'Should print cat_sound',
    tests: [{ description: 'Output is cat_sound', expected: 'cat_sound' }],
  },
  {
    id: 'typescript-28', language: 'typescript', regionId: 'typescript',
    title: 'Async / Await with Types', order: 28, xpReward: 130, isBoss: false,
    description: `## Quest 28: Typed Async Functions

Async functions return \`Promise<T>\` — be explicit about the resolved type:

\`\`\`typescript
interface Quest { id: number; name: string; xp: number }

async function fetchQuest(id: number): Promise<Quest> {
  // Simulate async fetch
  return { id, name: \`Quest \${id}\`, xp: id * 100 }
}

async function main() {
  const q = await fetchQuest(5)
  console.log(\`\${q.name}: \${q.xp}xp\`)
}

main()
\`\`\`

### Your Mission
Write \`async function getTotal(nums: number[]): Promise<number>\` that resolves to the sum.
Call it with \`[10, 20, 30]\` and print the result.`,
    starterCode: 'async function getTotal(nums: number[]): Promise<number> {\n  return 0  // implement\n}\n\ngetTotal([10, 20, 30]).then(console.log)\n',
    hint: 'return nums.reduce((a, b) => a + b, 0)',
    tests: [{ description: 'Output is 60', expected: '60' }],
  },
  {
    id: 'typescript-29', language: 'typescript', regionId: 'typescript',
    title: 'Decorators with Metadata', order: 29, xpReward: 140, isBoss: false,
    description: `## Quest 29: Class Decorators

A class decorator receives the constructor and can modify or replace it:

\`\`\`typescript
function Frozen(constructor: Function) {
  Object.freeze(constructor)
  Object.freeze(constructor.prototype)
}

@Frozen
class Config { version = "1.0" }
\`\`\`

### Your Mission
Write a \`Singleton\` decorator that ensures only one instance of a class is ever created.
Apply it to \`class Database { name = "CodeQuestDB" }\`.
Create two "instances" and verify they are the same object by printing \`db1 === db2\`.`,
    starterCode: 'function Singleton<T extends { new(...args: any[]): {} }>(cls: T) {\n  let instance: InstanceType<T>\n  return new Proxy(cls, {\n    construct(target, args) {\n      if (!instance) instance = new target(...args) as InstanceType<T>\n      return instance\n    }\n  })\n}\n\n@Singleton\nclass Database { name = "CodeQuestDB" }\n\nconst db1 = new Database()\nconst db2 = new Database()\nconsole.log(db1 === db2)\n',
    hint: 'Should print true',
    tests: [{ description: 'Output is true', expected: 'true' }],
  },
  {
    id: 'typescript-30', language: 'typescript', regionId: 'typescript',
    title: 'Boss: The Type Colossus', order: 30, xpReward: 350, isBoss: true,
    description: `## Final Boss: The Type Colossus

Combine generics, mapped types, conditional types, and utility types to defeat the Colossus!

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K]
}
\`\`\`

### Your Mission
1. Define \`interface Player { name: string; stats: { hp: number; mp: number } }\`
2. Create \`type FrozenPlayer = DeepReadonly<Player>\`
3. Create a \`FrozenPlayer\` value
4. Write a generic \`pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>\` function
5. Use \`pick\` to extract only \`{ name }\` from your player and print the name`,
    starterCode: 'type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }\n\ninterface Player { name: string; stats: { hp: number; mp: number } }\ntype FrozenPlayer = DeepReadonly<Player>\n\nfunction pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {\n  const result = {} as Pick<T, K>\n  keys.forEach(k => result[k] = obj[k])\n  return result\n}\n\nconst player: FrozenPlayer = { name: "Aria", stats: { hp: 200, mp: 80 } }\nconst { name } = pick(player, ["name"])\nconsole.log(name)\n',
    hint: 'Run as-is — should print Aria',
    tests: [{ description: 'Output is Aria', expected: 'Aria' }],
  },
]

// ─────────────────────────────────────────────────────────────
// SQL — 25 lessons
// ─────────────────────────────────────────────────────────────
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
  {
    id: 'sql-11', language: 'sql', regionId: 'sql',
    title: 'INSERT & UPDATE', order: 11, xpReward: 100, isBoss: false,
    description: `## Quest 11: INSERT and UPDATE

Add and modify rows in a table:

\`\`\`sql
INSERT INTO heroes (name, level) VALUES ('Aria', 1);
UPDATE heroes SET level = 10 WHERE name = 'Aria';
SELECT name, level FROM heroes WHERE name = 'Aria';
\`\`\`

### Your Mission
Create a \`items\` table with \`name TEXT\` and \`qty INTEGER\`.
Insert \`('potion', 5)\`. Update qty to \`10\`. Select and print \`name|qty\`.`,
    starterCode: 'CREATE TABLE items (name TEXT, qty INTEGER);\nINSERT INTO items VALUES (\'potion\', 5);\n-- Update qty to 10, then SELECT\n',
    hint: 'UPDATE items SET qty = 10 WHERE name = \'potion\'; SELECT name, qty FROM items;',
    tests: [{ description: 'Output is potion|10', expected: 'potion|10' }],
  },
  {
    id: 'sql-12', language: 'sql', regionId: 'sql',
    title: 'DELETE', order: 12, xpReward: 100, isBoss: false,
    description: `## Quest 12: DELETE

Remove rows from a table:

\`\`\`sql
DELETE FROM heroes WHERE level < 5;
DELETE FROM heroes;  -- deletes ALL rows (careful!)
\`\`\`

### Your Mission
Create a \`spells\` table with \`name TEXT\` and \`power INTEGER\`.
Insert 3 rows: \`('Fire', 80)\`, \`('Water', 30)\`, \`('Ice', 45)\`.
Delete all spells where \`power < 50\`. SELECT COUNT(*) and print the result.`,
    starterCode: 'CREATE TABLE spells (name TEXT, power INTEGER);\nINSERT INTO spells VALUES (\'Fire\',80),(\'Water\',30),(\'Ice\',45);\n-- Delete weak spells, then count remaining\n',
    hint: 'DELETE FROM spells WHERE power < 50; SELECT COUNT(*) FROM spells;',
    tests: [{ description: 'Output is 1', expected: '1' }],
  },
  {
    id: 'sql-13', language: 'sql', regionId: 'sql',
    title: 'LIKE & Wildcards', order: 13, xpReward: 100, isBoss: false,
    description: `## Quest 13: LIKE

\`LIKE\` matches patterns using wildcards: \`%\` = any sequence, \`_\` = any single char:

\`\`\`sql
SELECT name FROM heroes WHERE name LIKE 'A%';   -- starts with A
SELECT name FROM heroes WHERE name LIKE '%ia';  -- ends with ia
SELECT name FROM heroes WHERE name LIKE '_o%';  -- second char is o
\`\`\`

### Your Mission
Create a \`heroes\` table with \`name TEXT\`.
Insert: \`Aria\`, \`Bolt\`, \`Bella\`, \`Bruno\`, \`Cara\`.
Select names starting with \`'B'\` and print them (one per line).`,
    starterCode: "CREATE TABLE heroes (name TEXT);\nINSERT INTO heroes VALUES ('Aria'),('Bolt'),('Bella'),('Bruno'),('Cara');\n-- SELECT names starting with B\n",
    hint: "SELECT name FROM heroes WHERE name LIKE 'B%';",
    tests: [{ description: 'Bolt and Bella and Bruno', expected: 'Bolt\nBella\nBruno' }],
  },
  {
    id: 'sql-14', language: 'sql', regionId: 'sql',
    title: 'IN & BETWEEN', order: 14, xpReward: 100, isBoss: false,
    description: `## Quest 14: IN and BETWEEN

Filter rows with specific values or ranges:

\`\`\`sql
SELECT * FROM items WHERE rarity IN ('rare', 'epic', 'legendary');
SELECT * FROM heroes WHERE level BETWEEN 5 AND 10;
\`\`\`

### Your Mission
Create a \`gear\` table with \`name TEXT\` and \`level INTEGER\`.
Insert 5 items at levels 1, 3, 5, 8, 12.
Select names of gear with level BETWEEN 4 and 9 and print them.`,
    starterCode: "CREATE TABLE gear (name TEXT, level INTEGER);\nINSERT INTO gear VALUES ('Dagger',1),('Shield',3),('Sword',5),('Armor',8),('Crown',12);\n-- SELECT names between level 4 and 9\n",
    hint: 'SELECT name FROM gear WHERE level BETWEEN 4 AND 9;',
    tests: [{ description: 'Sword and Armor', expected: 'Sword\nArmor' }],
  },
  {
    id: 'sql-15', language: 'sql', regionId: 'sql',
    title: 'Aliases & CASE', order: 15, xpReward: 110, isBoss: false,
    description: `## Quest 15: Aliases and CASE

\`AS\` creates aliases. \`CASE\` is SQL's if/else:

\`\`\`sql
SELECT name AS hero_name, level AS current_level FROM heroes;

SELECT name,
  CASE
    WHEN level >= 10 THEN 'veteran'
    WHEN level >= 5  THEN 'adept'
    ELSE 'novice'
  END AS rank
FROM heroes;
\`\`\`

### Your Mission
Create a \`players\` table with \`name TEXT\` and \`score INTEGER\`.
Insert: \`Aria(95)\`, \`Bolt(62)\`, \`Cara(78)\`.
SELECT name and a CASE column \`grade\`: score>=90→'A', >=70→'B', else 'C'. Print all rows.`,
    starterCode: "CREATE TABLE players (name TEXT, score INTEGER);\nINSERT INTO players VALUES ('Aria',95),('Bolt',62),('Cara',78);\n-- SELECT name and grade\n",
    hint: "SELECT name, CASE WHEN score>=90 THEN 'A' WHEN score>=70 THEN 'B' ELSE 'C' END as grade FROM players;",
    tests: [{ description: 'Aria gets A', expected: 'Aria|A\nBolt|C\nCara|B' }],
  },
  {
    id: 'sql-16', language: 'sql', regionId: 'sql',
    title: 'Subqueries', order: 16, xpReward: 120, isBoss: false,
    description: `## Quest 16: Subqueries

A subquery is a SELECT inside another SELECT:

\`\`\`sql
-- Heroes with above-average level
SELECT name FROM heroes
WHERE level > (SELECT AVG(level) FROM heroes);

-- Using subquery as a column
SELECT name, (SELECT COUNT(*) FROM items WHERE owner = heroes.name) AS item_count
FROM heroes;
\`\`\`

### Your Mission
Create a \`warriors\` table with \`name TEXT\` and \`power INTEGER\`.
Insert: \`Aria(80)\`, \`Bolt(95)\`, \`Cara(60)\`, \`Drake(88)\`.
Select names with power above average. Print them.`,
    starterCode: "CREATE TABLE warriors (name TEXT, power INTEGER);\nINSERT INTO warriors VALUES ('Aria',80),('Bolt',95),('Cara',60),('Drake',88);\n-- SELECT above average\n",
    hint: 'SELECT name FROM warriors WHERE power > (SELECT AVG(power) FROM warriors);',
    tests: [{ description: 'Bolt and Drake', expected: 'Bolt\nDrake' }],
  },
  {
    id: 'sql-17', language: 'sql', regionId: 'sql',
    title: 'LEFT JOIN', order: 17, xpReward: 120, isBoss: false,
    description: `## Quest 17: LEFT JOIN

\`LEFT JOIN\` returns all rows from the left table even if there's no match:

\`\`\`sql
SELECT heroes.name, guilds.name AS guild
FROM heroes
LEFT JOIN guilds ON heroes.guild_id = guilds.id;
-- Heroes without a guild still appear (guild column = NULL)
\`\`\`

### Your Mission
Create \`heroes (id INTEGER, name TEXT, guild_id INTEGER)\` and \`guilds (id INTEGER, name TEXT)\`.
Insert 3 heroes (guild_ids: 1, 2, NULL) and 2 guilds.
LEFT JOIN and SELECT \`heroes.name | guilds.name\`. Print all 3 rows.`,
    starterCode: "CREATE TABLE heroes (id INTEGER, name TEXT, guild_id INTEGER);\nCREATE TABLE guilds (id INTEGER, name TEXT);\nINSERT INTO heroes VALUES (1,'Aria',1),(2,'Bolt',2),(3,'Cara',NULL);\nINSERT INTO guilds VALUES (1,'Ironclad'),(2,'Arcane');\n-- LEFT JOIN\n",
    hint: 'SELECT heroes.name, guilds.name FROM heroes LEFT JOIN guilds ON heroes.guild_id = guilds.id;',
    tests: [{ description: 'Cara has NULL guild', expected: 'Aria|Ironclad\nBolt|Arcane\nCara|' }],
  },
  {
    id: 'sql-18', language: 'sql', regionId: 'sql',
    title: 'DISTINCT & LIMIT', order: 18, xpReward: 100, isBoss: false,
    description: `## Quest 18: DISTINCT and LIMIT

\`DISTINCT\` removes duplicate rows. \`LIMIT\` caps the number of results:

\`\`\`sql
SELECT DISTINCT class FROM heroes;        -- unique classes only
SELECT name FROM heroes ORDER BY xp DESC LIMIT 3;  -- top 3
SELECT name FROM heroes LIMIT 5 OFFSET 10;         -- page 3
\`\`\`

### Your Mission
Create a \`logs\` table with \`hero TEXT\` and \`action TEXT\`.
Insert: Aria/attack, Bolt/heal, Aria/attack, Cara/attack, Bolt/attack.
SELECT DISTINCT \`hero\` names and print them (alphabetical order).`,
    starterCode: "CREATE TABLE logs (hero TEXT, action TEXT);\nINSERT INTO logs VALUES ('Aria','attack'),('Bolt','heal'),('Aria','attack'),('Cara','attack'),('Bolt','attack');\n-- DISTINCT heroes alphabetically\n",
    hint: "SELECT DISTINCT hero FROM logs ORDER BY hero;",
    tests: [{ description: '3 unique heroes', expected: 'Aria\nBolt\nCara' }],
  },
  {
    id: 'sql-19', language: 'sql', regionId: 'sql',
    title: 'Window Functions', order: 19, xpReward: 140, isBoss: false,
    description: `## Quest 19: Window Functions (ROW_NUMBER)

Window functions compute values across related rows without collapsing them:

\`\`\`sql
SELECT name, score,
  ROW_NUMBER() OVER (ORDER BY score DESC) AS rank
FROM leaderboard;

-- Partition: rank within each class
SELECT name, class, xp,
  RANK() OVER (PARTITION BY class ORDER BY xp DESC) AS class_rank
FROM heroes;
\`\`\`

### Your Mission
Create \`scores (name TEXT, points INTEGER)\`.
Insert: Aria(90), Bolt(75), Cara(90), Drake(60).
Use ROW_NUMBER() OVER (ORDER BY points DESC) to rank them. Print name|rank for all rows.`,
    starterCode: "CREATE TABLE scores (name TEXT, points INTEGER);\nINSERT INTO scores VALUES ('Aria',90),('Bolt',75),('Cara',90),('Drake',60);\n-- ROW_NUMBER ranking\n",
    hint: 'SELECT name, ROW_NUMBER() OVER (ORDER BY points DESC) as rank FROM scores;',
    tests: [{ description: 'Aria and Cara rank 1 and 2', expected: 'Aria|1\nCara|2\nBolt|3\nDrake|4' }],
  },
  {
    id: 'sql-20', language: 'sql', regionId: 'sql',
    title: 'CTEs (WITH)', order: 20, xpReward: 140, isBoss: false,
    description: `## Quest 20: Common Table Expressions

A CTE (WITH clause) creates a named temporary result set:

\`\`\`sql
WITH top_heroes AS (
  SELECT name, xp FROM heroes WHERE xp > 500
)
SELECT name FROM top_heroes ORDER BY xp DESC;

-- Chain multiple CTEs
WITH active AS (SELECT * FROM heroes WHERE active = 1),
     powerful AS (SELECT * FROM active WHERE power > 80)
SELECT name FROM powerful;
\`\`\`

### Your Mission
Create \`items (name TEXT, value INTEGER)\`.
Insert 5 items with values: 10, 250, 80, 500, 30.
Use a CTE \`expensive\` to filter items where \`value > 100\`. Print their names.`,
    starterCode: "CREATE TABLE items (name TEXT, value INTEGER);\nINSERT INTO items VALUES ('Dagger',10),('Crown',250),('Shield',80),('Sword',500),('Potion',30);\n-- CTE then SELECT\n",
    hint: 'WITH expensive AS (SELECT name FROM items WHERE value > 100) SELECT name FROM expensive;',
    tests: [{ description: 'Crown and Sword', expected: 'Crown\nSword' }],
  },
  {
    id: 'sql-21', language: 'sql', regionId: 'sql',
    title: 'Indexes', order: 21, xpReward: 130, isBoss: false,
    description: `## Quest 21: Indexes

Indexes speed up lookups on large tables. CREATE INDEX on frequently-searched columns:

\`\`\`sql
CREATE INDEX idx_hero_name ON heroes(name);
CREATE UNIQUE INDEX idx_hero_email ON heroes(email);  -- enforces uniqueness
DROP INDEX idx_hero_name;  -- remove index

EXPLAIN QUERY PLAN SELECT * FROM heroes WHERE name = 'Aria';
-- With index: uses index scan (fast)
-- Without: full table scan (slow)
\`\`\`

### Your Mission
Create \`heroes (id INTEGER PRIMARY KEY, name TEXT, level INTEGER)\`.
Create an index on \`level\`. Insert 3 heroes. SELECT names where level > 5. Print them.`,
    starterCode: "CREATE TABLE heroes (id INTEGER PRIMARY KEY, name TEXT, level INTEGER);\nCREATE INDEX idx_level ON heroes(level);\nINSERT INTO heroes VALUES (1,'Aria',8),(2,'Bolt',3),(3,'Cara',10);\n-- SELECT names where level > 5\n",
    hint: 'SELECT name FROM heroes WHERE level > 5;',
    tests: [{ description: 'Aria and Cara', expected: 'Aria\nCara' }],
  },
  {
    id: 'sql-22', language: 'sql', regionId: 'sql',
    title: 'Transactions', order: 22, xpReward: 140, isBoss: false,
    description: `## Quest 22: Transactions

Transactions group statements so they all succeed or all fail (ACID):

\`\`\`sql
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE name = 'Aria';
  UPDATE accounts SET balance = balance + 100 WHERE name = 'Bolt';
COMMIT;

-- On error:
ROLLBACK;
\`\`\`

### Your Mission
Create \`vault (hero TEXT, gold INTEGER)\`.
Insert Aria(200) and Bolt(50).
Use a transaction to transfer 75 gold from Aria to Bolt. SELECT and print both rows.`,
    starterCode: "CREATE TABLE vault (hero TEXT, gold INTEGER);\nINSERT INTO vault VALUES ('Aria',200),('Bolt',50);\nBEGIN;\n-- Transfer 75 gold\nCOMMIT;\nSELECT hero, gold FROM vault;\n",
    hint: 'UPDATE vault SET gold=gold-75 WHERE hero=\'Aria\'; UPDATE vault SET gold=gold+75 WHERE hero=\'Bolt\';',
    tests: [{ description: 'Aria 125, Bolt 125', expected: 'Aria|125\nBolt|125' }],
  },
  {
    id: 'sql-23', language: 'sql', regionId: 'sql',
    title: 'Views', order: 23, xpReward: 130, isBoss: false,
    description: `## Quest 23: Views

A view is a saved SELECT query that behaves like a virtual table:

\`\`\`sql
CREATE VIEW top_heroes AS
  SELECT name, xp FROM heroes WHERE xp > 1000 ORDER BY xp DESC;

SELECT * FROM top_heroes;   -- uses the saved query
DROP VIEW top_heroes;
\`\`\`

### Your Mission
Create \`players (name TEXT, wins INTEGER, losses INTEGER)\`.
Insert 3 players. Create view \`winners\` that shows players with wins > losses.
SELECT from the view and print those names.`,
    starterCode: "CREATE TABLE players (name TEXT, wins INTEGER, losses INTEGER);\nINSERT INTO players VALUES ('Aria',10,3),('Bolt',2,8),('Cara',7,5);\nCREATE VIEW winners AS\n  SELECT name FROM players WHERE wins > losses;\nSELECT name FROM winners;\n",
    hint: 'Run as-is — should output Aria and Cara',
    tests: [{ description: 'Aria and Cara', expected: 'Aria\nCara' }],
  },
  {
    id: 'sql-24', language: 'sql', regionId: 'sql',
    title: 'NULL Handling', order: 24, xpReward: 120, isBoss: false,
    description: `## Quest 24: NULL and COALESCE

NULL means "unknown/missing" — not zero, not empty string:

\`\`\`sql
SELECT * FROM heroes WHERE guild_id IS NULL;      -- find unaffiliated
SELECT * FROM heroes WHERE guild_id IS NOT NULL;  -- find affiliated

-- COALESCE returns first non-NULL value
SELECT name, COALESCE(nickname, name) AS display_name FROM heroes;

-- NULLIF returns NULL if two values are equal
SELECT NULLIF(score, 0) FROM players;  -- treat 0 as NULL
\`\`\`

### Your Mission
Create \`items (name TEXT, bonus INTEGER)\`. Insert: \`('Sword',10)\`, \`('Ring', NULL)\`, \`('Hat', NULL)\`.
SELECT name and COALESCE(bonus, 0) AS safe_bonus. Print all rows.`,
    starterCode: "CREATE TABLE items (name TEXT, bonus INTEGER);\nINSERT INTO items VALUES ('Sword',10),('Ring',NULL),('Hat',NULL);\n-- SELECT with COALESCE\n",
    hint: 'SELECT name, COALESCE(bonus, 0) AS safe_bonus FROM items;',
    tests: [{ description: 'NULLs become 0', expected: 'Sword|10\nRing|0\nHat|0' }],
  },
  {
    id: 'sql-25', language: 'sql', regionId: 'sql',
    title: 'Boss: The Database Demon', order: 25, xpReward: 350, isBoss: true,
    description: `## Final Boss: The Database Demon

Combine CTEs, window functions, JOINs, and aggregation to destroy the Demon!

\`\`\`sql
WITH ranked AS (
  SELECT name, score,
    RANK() OVER (PARTITION BY class ORDER BY score DESC) AS rk
  FROM heroes
)
SELECT name, rk FROM ranked WHERE rk = 1;
\`\`\`

### Your Mission
1. Create \`heroes (id INTEGER, name TEXT, class TEXT, xp INTEGER)\`
2. Insert 6 heroes: 2 Warriors, 2 Mages, 2 Rogues with varying XP
3. Use a CTE + RANK() OVER (PARTITION BY class ORDER BY xp DESC) to rank within each class
4. Select only the top-ranked hero per class (rank = 1)
5. Print \`name|class\` for the 3 winners`,
    starterCode: "CREATE TABLE heroes (id INTEGER, name TEXT, class TEXT, xp INTEGER);\nINSERT INTO heroes VALUES\n  (1,'Aria','Warrior',1200),(2,'Bolt','Warrior',800),\n  (3,'Cara','Mage',1500),(4,'Drake','Mage',900),\n  (5,'Eve','Rogue',1100),(6,'Finn','Rogue',950);\nWITH ranked AS (\n  SELECT name, class, RANK() OVER (PARTITION BY class ORDER BY xp DESC) AS rk FROM heroes\n)\n-- SELECT top per class\n",
    hint: 'SELECT name, class FROM ranked WHERE rk = 1;',
    tests: [{ description: 'Three class winners', expected: 'Aria|Warrior\nCara|Mage\nEve|Rogue' }],
  },
]

// ─────────────────────────────────────────────────────────────
// GO — 30 lessons
// ─────────────────────────────────────────────────────────────
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
  {
    id: 'go-12', language: 'go', regionId: 'go',
    title: 'Error Handling', order: 12, xpReward: 125, isBoss: false,
    description: `## Quest 12: Error Handling

Go returns errors as values rather than throwing exceptions:

\`\`\`go
import (
    "errors"
    "fmt"
)

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}

result, err := divide(10, 0)
if err != nil {
    fmt.Println("Error:", err)
} else {
    fmt.Println(result)
}
\`\`\`

### Your Mission
Write \`sqrt(n float64) (float64, error)\` that returns an error if \`n < 0\`, otherwise returns \`math.Sqrt(n)\`.
Print the result for \`sqrt(16)\` and the error message for \`sqrt(-1)\`.`,
    starterCode: 'package main\n\nimport (\n    "errors"\n    "fmt"\n    "math"\n)\n\nfunc sqrt(n float64) (float64, error) {\n    // implement\n    return 0, nil\n}\n\nfunc main() {\n    r, _ := sqrt(16)\n    fmt.Println(r)\n    _, err := sqrt(-1)\n    fmt.Println(err)\n}\n',
    hint: 'if n < 0 { return 0, errors.New("negative input") }; return math.Sqrt(n), nil',
    tests: [{ description: 'Prints 4 then error', expected: '4\nnegative input' }],
  },
  {
    id: 'go-13', language: 'go', regionId: 'go',
    title: 'Interfaces', order: 13, xpReward: 130, isBoss: false,
    description: `## Quest 13: Interfaces

An interface defines a set of method signatures. Any type that implements them satisfies the interface:

\`\`\`go
type Shape interface {
    Area() float64
}

type Circle struct { Radius float64 }
func (c Circle) Area() float64 { return 3.14159 * c.Radius * c.Radius }

type Rect struct { W, H float64 }
func (r Rect) Area() float64 { return r.W * r.H }

func printArea(s Shape) { fmt.Printf("%.2f\\n", s.Area()) }
\`\`\`

### Your Mission
Using the code above, create a \`Circle{Radius: 5}\` and \`Rect{W: 4, H: 6}\`.
Pass both to \`printArea\`. Print their areas.`,
    starterCode: 'package main\nimport "fmt"\n\ntype Shape interface { Area() float64 }\n\ntype Circle struct { Radius float64 }\nfunc (c Circle) Area() float64 { return 3.14159 * c.Radius * c.Radius }\n\ntype Rect struct { W, H float64 }\nfunc (r Rect) Area() float64 { return r.W * r.H }\n\nfunc printArea(s Shape) { fmt.Printf("%.2f\\n", s.Area()) }\n\nfunc main() {\n    // Create and print both shapes\n}\n',
    hint: 'printArea(Circle{Radius: 5}); printArea(Rect{W: 4, H: 6})',
    tests: [{ description: 'Circle then rect area', expected: '78.54\n24.00' }],
  },
  {
    id: 'go-14', language: 'go', regionId: 'go',
    title: 'Slices Deep Dive', order: 14, xpReward: 120, isBoss: false,
    description: `## Quest 14: Slices

Slices are dynamic views into arrays. Key operations:

\`\`\`go
nums := []int{1, 2, 3, 4, 5}
fmt.Println(nums[1:3])    // [2 3]
fmt.Println(nums[:2])     // [1 2]
fmt.Println(len(nums))    // 5
fmt.Println(cap(nums))    // 5

nums = append(nums, 6, 7)
fmt.Println(nums)         // [1 2 3 4 5 6 7]

// Copy
dst := make([]int, len(nums))
copy(dst, nums)
\`\`\`

### Your Mission
Start with \`nums := []int{10, 20, 30}\`.
Append \`40\` and \`50\`.
Print the slice from index 1 to 3 (exclusive).`,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    nums := []int{10, 20, 30}\n    // Append 40 and 50, then print slice [1:3]\n}\n',
    hint: 'nums = append(nums, 40, 50); fmt.Println(nums[1:3])',
    tests: [{ description: 'Output is [20 30]', expected: '[20 30]' }],
  },
  {
    id: 'go-15', language: 'go', regionId: 'go',
    title: 'Maps', order: 15, xpReward: 120, isBoss: false,
    description: `## Quest 15: Maps

Maps store key-value pairs:

\`\`\`go
scores := map[string]int{
    "Aria": 95,
    "Bolt": 82,
}
scores["Cara"] = 88

// Check if key exists
val, ok := scores["Drake"]
if !ok {
    fmt.Println("not found")
}

// Delete
delete(scores, "Bolt")

// Iterate
for name, score := range scores {
    fmt.Printf("%s: %d\\n", name, score)
}
\`\`\`

### Your Mission
Create a map of word counts for \`["apple","banana","apple","cherry","banana","apple"]\`.
Print the count for \`"apple"\`.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    words := []string{"apple","banana","apple","cherry","banana","apple"}\n    counts := map[string]int{}\n    // Count occurrences\n    fmt.Println(counts["apple"])\n}\n',
    hint: 'for _, w := range words { counts[w]++ }',
    tests: [{ description: 'Output is 3', expected: '3' }],
  },
  {
    id: 'go-16', language: 'go', regionId: 'go',
    title: 'Pointers', order: 16, xpReward: 130, isBoss: false,
    description: `## Quest 16: Pointers

A pointer holds the memory address of a value. Use \`&\` to get an address, \`*\` to dereference:

\`\`\`go
x := 10
p := &x          // p is *int
fmt.Println(*p)   // 10
*p = 20
fmt.Println(x)    // 20 — original changed!

func increment(n *int) { *n++ }
increment(&x)
fmt.Println(x)    // 21
\`\`\`

### Your Mission
Write \`double(n *int)\` that multiplies the value at the pointer by 2.
Apply it to \`val := 7\` and print \`val\` after the call.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc double(n *int) {\n    // multiply by 2\n}\n\nfunc main() {\n    val := 7\n    double(&val)\n    fmt.Println(val)\n}\n',
    hint: '*n = *n * 2',
    tests: [{ description: 'Output is 14', expected: '14' }],
  },
  {
    id: 'go-17', language: 'go', regionId: 'go',
    title: 'Closures', order: 17, xpReward: 130, isBoss: false,
    description: `## Quest 17: Closures

Functions can capture and carry variables from their surrounding scope:

\`\`\`go
func adder(base int) func(int) int {
    return func(n int) int {
        base += n
        return base
    }
}

add := adder(10)
fmt.Println(add(5))   // 15
fmt.Println(add(3))   // 18 — base persists
\`\`\`

### Your Mission
Write \`makeCounter()\` that returns a function. Each call should increment and return a counter starting from 0.
Call it 3 times and print the last result.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc makeCounter() func() int {\n    // implement\n    return nil\n}\n\nfunc main() {\n    counter := makeCounter()\n    counter()\n    counter()\n    fmt.Println(counter())\n}\n',
    hint: 'count := 0; return func() int { count++; return count }',
    tests: [{ description: 'Output is 3', expected: '3' }],
  },
  {
    id: 'go-18', language: 'go', regionId: 'go',
    title: 'Variadic Functions', order: 18, xpReward: 120, isBoss: false,
    description: `## Quest 18: Variadic Functions

A variadic function accepts any number of arguments using \`...T\`:

\`\`\`go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

fmt.Println(sum(1, 2, 3))        // 6
fmt.Println(sum(10, 20, 30, 40)) // 100

// Spread a slice
s := []int{5, 10, 15}
fmt.Println(sum(s...))           // 30
\`\`\`

### Your Mission
Write variadic \`max(nums ...int) int\` that returns the largest value.
Print \`max(3, 1, 4, 1, 5, 9, 2, 6)\`.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc max(nums ...int) int {\n    // implement\n    return 0\n}\n\nfunc main() {\n    fmt.Println(max(3, 1, 4, 1, 5, 9, 2, 6))\n}\n',
    hint: 'start with m := nums[0]; for _, n := range nums { if n > m { m = n } }',
    tests: [{ description: 'Output is 9', expected: '9' }],
  },
  {
    id: 'go-19', language: 'go', regionId: 'go',
    title: 'defer', order: 19, xpReward: 120, isBoss: false,
    description: `## Quest 19: defer

\`defer\` schedules a function call to run just before the surrounding function returns.
Deferred calls execute in LIFO order:

\`\`\`go
func greet() {
    defer fmt.Println("Goodbye!")
    fmt.Println("Hello!")
}
// Output: Hello! then Goodbye!

func multiDefer() {
    defer fmt.Println("third")
    defer fmt.Println("second")
    fmt.Println("first")
}
// Output: first, second, third
\`\`\`

### Your Mission
Write a function that prints \`"opening"\`, defers \`"closing"\`, then prints \`"working"\`.
Call it from main and show the order.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc task() {\n    fmt.Println("opening")\n    // defer closing\n    fmt.Println("working")\n}\n\nfunc main() {\n    task()\n}\n',
    hint: 'defer fmt.Println("closing") on line 2 of task()',
    tests: [{ description: 'Order: opening working closing', expected: 'opening\nworking\nclosing' }],
  },
  {
    id: 'go-20', language: 'go', regionId: 'go',
    title: 'Panic & Recover', order: 20, xpReward: 130, isBoss: false,
    description: `## Quest 20: panic and recover

\`panic\` stops normal execution. \`recover\` catches a panic inside a deferred call:

\`\`\`go
func safeDiv(a, b int) (result int, err error) {
    defer func() {
        if r := recover(); r != nil {
            err = fmt.Errorf("recovered: %v", r)
        }
    }()
    return a / b, nil
}

r, err := safeDiv(10, 0)
if err != nil {
    fmt.Println(err)  // recovered: runtime error: integer divide by zero
}
\`\`\`

### Your Mission
Call \`safeDiv(10, 0)\` using the code above. Print the error message.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc safeDiv(a, b int) (result int, err error) {\n    defer func() {\n        if r := recover(); r != nil {\n            err = fmt.Errorf("recovered: %v", r)\n        }\n    }()\n    return a / b, nil\n}\n\nfunc main() {\n    _, err := safeDiv(10, 0)\n    fmt.Println(err)\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Prints recovered error', expected: 'recovered: runtime error: integer divide by zero' }],
  },
  {
    id: 'go-21', language: 'go', regionId: 'go',
    title: 'Embedding', order: 21, xpReward: 130, isBoss: false,
    description: `## Quest 21: Struct Embedding

Go uses embedding instead of inheritance — embed a type to inherit its methods:

\`\`\`go
type Animal struct { Name string }
func (a Animal) Speak() string { return a.Name + " speaks" }

type Dog struct {
    Animal          // embedded — Dog gets Speak() for free
    Breed string
}

d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Husky"}
fmt.Println(d.Speak())  // Rex speaks
fmt.Println(d.Name)     // Rex — promoted field
\`\`\`

### Your Mission
Create a \`Vehicle\` struct with \`Speed int\` and a \`Describe()\` method returning \`"Speed: N"\`.
Embed it in \`Car\` with an extra \`Brand string\` field.
Create \`Car{Vehicle{120}, "Toyota"}\` and print \`Describe()\` and \`Brand\`.`,
    starterCode: 'package main\nimport "fmt"\n\ntype Vehicle struct { Speed int }\nfunc (v Vehicle) Describe() string { return fmt.Sprintf("Speed: %d", v.Speed) }\n\ntype Car struct {\n    Vehicle\n    Brand string\n}\n\nfunc main() {\n    c := Car{Vehicle{120}, "Toyota"}\n    fmt.Println(c.Describe())\n    fmt.Println(c.Brand)\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Speed then brand', expected: 'Speed: 120\nToyota' }],
  },
  {
    id: 'go-22', language: 'go', regionId: 'go',
    title: 'Type Assertions', order: 22, xpReward: 130, isBoss: false,
    description: `## Quest 22: Type Assertions

Type assertions extract the concrete type from an interface:

\`\`\`go
var i interface{} = "hello"

s, ok := i.(string)
if ok {
    fmt.Println(s, len(s))  // hello 5
}

// Type switch
switch v := i.(type) {
case string:
    fmt.Println("string:", v)
case int:
    fmt.Println("int:", v)
default:
    fmt.Printf("type: %T\\n", v)
}
\`\`\`

### Your Mission
Write a function \`describe(i interface{})\` using a type switch that prints \`"string: X"\`, \`"int: X"\`, or \`"other"\`.
Call it with \`"hero"\`, \`42\`, and \`3.14\`. Print each result.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc describe(i interface{}) {\n    switch v := i.(type) {\n    // add cases\n    default:\n        _ = v\n        fmt.Println("other")\n    }\n}\n\nfunc main() {\n    describe("hero")\n    describe(42)\n    describe(3.14)\n}\n',
    hint: 'case string: fmt.Println("string:", v)  case int: fmt.Println("int:", v)',
    tests: [{ description: 'Three lines output', expected: 'string: hero\nint: 42\nother' }],
  },
  {
    id: 'go-23', language: 'go', regionId: 'go',
    title: 'Select Statement', order: 23, xpReward: 140, isBoss: false,
    description: `## Quest 23: select

\`select\` waits on multiple channel operations, executing whichever is ready:

\`\`\`go
ch1 := make(chan string, 1)
ch2 := make(chan string, 1)
ch1 <- "one"
ch2 <- "two"

select {
case msg1 := <-ch1:
    fmt.Println("ch1:", msg1)
case msg2 := <-ch2:
    fmt.Println("ch2:", msg2)
}
\`\`\`

Add a \`default\` case to avoid blocking when no channel is ready.

### Your Mission
Create two buffered channels. Send \`"ping"\` into \`ch1\` only.
Use \`select\` to receive from either channel — print the value you receive.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc main() {\n    ch1 := make(chan string, 1)\n    ch2 := make(chan string, 1)\n    ch1 <- "ping"\n    select {\n    case msg := <-ch1:\n        fmt.Println(msg)\n    case msg := <-ch2:\n        fmt.Println(msg)\n    }\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is ping', expected: 'ping' }],
  },
  {
    id: 'go-24', language: 'go', regionId: 'go',
    title: 'Generics (Go 1.18+)', order: 24, xpReward: 150, isBoss: false,
    description: `## Quest 24: Generics

Go 1.18 introduced generics — write functions that work with any type:

\`\`\`go
func Map[T, U any](s []T, f func(T) U) []U {
    result := make([]U, len(s))
    for i, v := range s {
        result[i] = f(v)
    }
    return result
}

doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
fmt.Println(doubled)  // [2 4 6]

lengths := Map([]string{"go","rust"}, func(s string) int { return len(s) })
fmt.Println(lengths)  // [2 4]
\`\`\`

### Your Mission
Using the \`Map\` function above, transform \`[]int{1, 2, 3, 4, 5}\` by squaring each element. Print the result.`,
    starterCode: 'package main\nimport "fmt"\n\nfunc Map[T, U any](s []T, f func(T) U) []U {\n    result := make([]U, len(s))\n    for i, v := range s { result[i] = f(v) }\n    return result\n}\n\nfunc main() {\n    // Square each element\n}\n',
    hint: 'Map([]int{1,2,3,4,5}, func(n int) int { return n * n })',
    tests: [{ description: 'Output is [1 4 9 16 25]', expected: '[1 4 9 16 25]' }],
  },
  {
    id: 'go-25', language: 'go', regionId: 'go',
    title: 'Context', order: 25, xpReward: 150, isBoss: false,
    description: `## Quest 25: context.Context

\`context\` carries deadlines, cancellation signals, and request-scoped values:

\`\`\`go
import (
    "context"
    "fmt"
    "time"
)

ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

select {
case <-time.After(1 * time.Second):
    fmt.Println("completed")
case <-ctx.Done():
    fmt.Println("timed out:", ctx.Err())
}
\`\`\`

### Your Mission
Create a context with a value: \`context.WithValue(context.Background(), "hero", "Aria")\`.
Retrieve the value using \`ctx.Value("hero")\` and print it.`,
    starterCode: 'package main\nimport (\n    "context"\n    "fmt"\n)\n\nfunc main() {\n    ctx := context.WithValue(context.Background(), "hero", "Aria")\n    val := ctx.Value("hero")\n    fmt.Println(val)\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is Aria', expected: 'Aria' }],
  },
  {
    id: 'go-26', language: 'go', regionId: 'go',
    title: 'WaitGroups', order: 26, xpReward: 150, isBoss: false,
    description: `## Quest 26: sync.WaitGroup

\`WaitGroup\` waits for a collection of goroutines to finish:

\`\`\`go
import (
    "fmt"
    "sync"
)

var wg sync.WaitGroup
for i := 1; i <= 3; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        fmt.Println("worker", n)
    }(i)
}
wg.Wait()
fmt.Println("all done")
\`\`\`

### Your Mission
Launch 5 goroutines, each sending its number into a results channel.
Use a WaitGroup to close the channel when all goroutines finish.
Collect results and print their sum.`,
    starterCode: 'package main\nimport (\n    "fmt"\n    "sync"\n)\n\nfunc main() {\n    var wg sync.WaitGroup\n    ch := make(chan int, 5)\n    for i := 1; i <= 5; i++ {\n        wg.Add(1)\n        go func(n int) {\n            defer wg.Done()\n            ch <- n\n        }(i)\n    }\n    wg.Wait()\n    close(ch)\n    sum := 0\n    for v := range ch { sum += v }\n    fmt.Println(sum)\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is 15', expected: '15' }],
  },
  {
    id: 'go-27', language: 'go', regionId: 'go',
    title: 'Mutex', order: 27, xpReward: 150, isBoss: false,
    description: `## Quest 27: sync.Mutex

A mutex prevents race conditions when multiple goroutines access shared data:

\`\`\`go
import (
    "fmt"
    "sync"
)

type SafeCounter struct {
    mu sync.Mutex
    v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
    c.mu.Lock()
    c.v[key]++
    c.mu.Unlock()
}
\`\`\`

### Your Mission
Create a \`SafeCounter\`. Launch 100 goroutines each calling \`Inc("key")\`.
Use a WaitGroup to wait for all. Print \`c.v["key"]\` — should be 100.`,
    starterCode: 'package main\nimport (\n    "fmt"\n    "sync"\n)\n\ntype SafeCounter struct {\n    mu sync.Mutex\n    v  map[string]int\n}\nfunc (c *SafeCounter) Inc(key string) {\n    c.mu.Lock()\n    c.v[key]++\n    c.mu.Unlock()\n}\n\nfunc main() {\n    c := SafeCounter{v: make(map[string]int)}\n    var wg sync.WaitGroup\n    for i := 0; i < 100; i++ {\n        wg.Add(1)\n        go func() { defer wg.Done(); c.Inc("key") }()\n    }\n    wg.Wait()\n    fmt.Println(c.v["key"])\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is 100', expected: '100' }],
  },
  {
    id: 'go-28', language: 'go', regionId: 'go',
    title: 'JSON Encoding', order: 28, xpReward: 140, isBoss: false,
    description: `## Quest 28: JSON

Go's \`encoding/json\` marshals structs to JSON and back:

\`\`\`go
import (
    "encoding/json"
    "fmt"
)

type Hero struct {
    Name  string \`json:"name"\`
    Level int    \`json:"level"\`
}

h := Hero{Name: "Aria", Level: 10}
data, _ := json.Marshal(h)
fmt.Println(string(data))  // {"name":"Aria","level":10}

var h2 Hero
json.Unmarshal(data, &h2)
fmt.Println(h2.Name)  // Aria
\`\`\`

### Your Mission
Marshal \`Hero{"Bolt", 7}\` to JSON and print the string. Then unmarshal it back and print the Level.`,
    starterCode: 'package main\nimport (\n    "encoding/json"\n    "fmt"\n)\n\ntype Hero struct {\n    Name  string `+"`"+`json:"name"`+"`"+`\n    Level int    `+"`"+`json:"level"`+"`"+`\n}\n\nfunc main() {\n    h := Hero{"Bolt", 7}\n    data, _ := json.Marshal(h)\n    fmt.Println(string(data))\n    var h2 Hero\n    json.Unmarshal(data, &h2)\n    fmt.Println(h2.Level)\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'JSON then level', expected: '{"name":"Bolt","level":7}\n7' }],
  },
  {
    id: 'go-29', language: 'go', regionId: 'go',
    title: 'File I/O', order: 29, xpReward: 140, isBoss: false,
    description: `## Quest 29: File I/O

Read and write files with the \`os\` and \`bufio\` packages:

\`\`\`go
import (
    "fmt"
    "os"
)

// Write
os.WriteFile("hero.txt", []byte("Aria\\nBolt\\n"), 0644)

// Read
data, _ := os.ReadFile("hero.txt")
fmt.Print(string(data))
\`\`\`

### Your Mission
Write \`"CodeQuest\\n"\` to a file \`quest.txt\`, then read it back and print its contents (trimmed).`,
    starterCode: 'package main\nimport (\n    "fmt"\n    "os"\n    "strings"\n)\n\nfunc main() {\n    os.WriteFile("quest.txt", []byte("CodeQuest\\n"), 0644)\n    data, _ := os.ReadFile("quest.txt")\n    fmt.Println(strings.TrimSpace(string(data)))\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is CodeQuest', expected: 'CodeQuest' }],
  },
  {
    id: 'go-30', language: 'go', regionId: 'go',
    title: 'Boss: The Concurrency Colossus', order: 30, xpReward: 350, isBoss: true,
    description: `## Final Boss: The Concurrency Colossus

Combine goroutines, channels, WaitGroups, and interfaces to win!

\`\`\`go
type Worker interface { Work() int }
\`\`\`

### Your Mission
1. Define \`type Miner struct { ID int }\` implementing \`Work() int\` (returns \`ID * 10\`)
2. Create 5 Miners (IDs 1–5)
3. Launch each in a goroutine, send their \`Work()\` result to a buffered channel
4. Use a WaitGroup + close channel pattern
5. Sum all results and print (should be 150)`,
    starterCode: 'package main\nimport (\n    "fmt"\n    "sync"\n)\n\ntype Worker interface { Work() int }\n\ntype Miner struct { ID int }\nfunc (m Miner) Work() int { return m.ID * 10 }\n\nfunc main() {\n    var wg sync.WaitGroup\n    ch := make(chan int, 5)\n    for i := 1; i <= 5; i++ {\n        wg.Add(1)\n        m := Miner{ID: i}\n        go func(w Worker) {\n            defer wg.Done()\n            ch <- w.Work()\n        }(m)\n    }\n    wg.Wait()\n    close(ch)\n    total := 0\n    for v := range ch { total += v }\n    fmt.Println(total)\n}\n',
    hint: 'Run as-is — should print 150',
    tests: [{ description: 'Output is 150', expected: '150' }],
  },
]

// ─────────────────────────────────────────────────────────────
// RUST — 30 lessons
// ─────────────────────────────────────────────────────────────
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
  {
    id: 'rust-17', language: 'rust', regionId: 'rust',
    title: 'HashMap', order: 17, xpReward: 130, isBoss: false,
    description: `## Quest 17: HashMap

\`HashMap\` stores key-value pairs:

\`\`\`rust
use std::collections::HashMap;

let mut scores: HashMap<String, i32> = HashMap::new();
scores.insert(String::from("Aria"), 95);
scores.insert(String::from("Bolt"), 82);

if let Some(s) = scores.get("Aria") {
    println!("Aria: {}", s);
}

// entry API — insert only if missing
scores.entry(String::from("Cara")).or_insert(70);
\`\`\`

### Your Mission
Count word frequencies in \`["hero","quest","hero","spell","quest","hero"]\`.
Print how many times \`"hero"\` appears.`,
    starterCode: 'use std::collections::HashMap;\n\nfn main() {\n    let words = vec!["hero","quest","hero","spell","quest","hero"];\n    let mut counts: HashMap<&str, i32> = HashMap::new();\n    // Count words\n    println!("{}", counts["hero"]);\n}\n',
    hint: 'for w in &words { let c = counts.entry(w).or_insert(0); *c += 1; }',
    tests: [{ description: 'Output is 3', expected: '3' }],
  },
  {
    id: 'rust-18', language: 'rust', regionId: 'rust',
    title: 'Traits', order: 18, xpReward: 140, isBoss: false,
    description: `## Quest 18: Traits

Traits define shared behaviour (like interfaces in other languages):

\`\`\`rust
trait Speak {
    fn speak(&self) -> String;
    fn shout(&self) -> String {
        self.speak().to_uppercase()  // default implementation
    }
}

struct Dog;
impl Speak for Dog {
    fn speak(&self) -> String { String::from("Woof!") }
}

let d = Dog;
println!("{}", d.speak());   // Woof!
println!("{}", d.shout());   // WOOF!
\`\`\`

### Your Mission
Define trait \`Greet\` with \`greet(&self) -> String\`.
Implement it for \`struct Hero { name: String }\` returning \`"I am [name]"\`.
Print \`Hero { name: "Aria".to_string() }.greet()\`.`,
    starterCode: 'trait Greet {\n    fn greet(&self) -> String;\n}\n\nstruct Hero {\n    name: String,\n}\n\nimpl Greet for Hero {\n    fn greet(&self) -> String {\n        // implement\n        String::new()\n    }\n}\n\nfn main() {\n    let h = Hero { name: String::from("Aria") };\n    println!("{}", h.greet());\n}\n',
    hint: 'format!("I am {}", self.name)',
    tests: [{ description: 'Output is I am Aria', expected: 'I am Aria' }],
  },
  {
    id: 'rust-19', language: 'rust', regionId: 'rust',
    title: 'Generics', order: 19, xpReward: 140, isBoss: false,
    description: `## Quest 19: Generics

Generics let you write code that works with multiple types:

\`\`\`rust
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in list {
        if item > largest { largest = item; }
    }
    largest
}

println!("{}", largest(&[34, 50, 25, 100, 65]));  // 100
println!("{}", largest(&["apple", "zebra", "mango"]));  // zebra
\`\`\`

### Your Mission
Use the \`largest\` function to find the largest number in \`[3, 1, 4, 1, 5, 9, 2, 6]\` and print it.`,
    starterCode: 'fn largest<T: PartialOrd>(list: &[T]) -> &T {\n    let mut largest = &list[0];\n    for item in list {\n        if item > largest { largest = item; }\n    }\n    largest\n}\n\nfn main() {\n    let nums = vec![3, 1, 4, 1, 5, 9, 2, 6];\n    println!("{}", largest(&nums));\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is 9', expected: '9' }],
  },
  {
    id: 'rust-20', language: 'rust', regionId: 'rust',
    title: 'Lifetimes', order: 20, xpReward: 150, isBoss: false,
    description: `## Quest 20: Lifetimes

Lifetimes tell Rust how long references are valid:

\`\`\`rust
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

let s1 = String::from("long string");
let result;
{
    let s2 = String::from("xy");
    result = longest(s1.as_str(), s2.as_str());
    println!("{}", result);   // must print inside this block
}
\`\`\`

### Your Mission
Call \`longest("CodeQuest", "Go")\` and print the result.`,
    starterCode: 'fn longest<\'a>(x: &\'a str, y: &\'a str) -> &\'a str {\n    if x.len() > y.len() { x } else { y }\n}\n\nfn main() {\n    let result = longest("CodeQuest", "Go");\n    println!("{}", result);\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is CodeQuest', expected: 'CodeQuest' }],
  },
  {
    id: 'rust-21', language: 'rust', regionId: 'rust',
    title: 'Closures', order: 21, xpReward: 130, isBoss: false,
    description: `## Quest 21: Closures

Rust closures capture their environment and can be stored in variables:

\`\`\`rust
let add = |x, y| x + y;
println!("{}", add(3, 4));   // 7

let offset = 10;
let add_offset = |x| x + offset;   // captures offset
println!("{}", add_offset(5));      // 15

let mut nums = vec![1, 2, 3, 4, 5];
nums.retain(|&x| x % 2 == 0);
println!("{:?}", nums);   // [2, 4]
\`\`\`

### Your Mission
Use \`.map()\` with a closure to square each element in \`vec![1, 2, 3, 4, 5]\`.
Collect into a Vec and print it.`,
    starterCode: 'fn main() {\n    let nums = vec![1, 2, 3, 4, 5];\n    let squared: Vec<i32> = nums.iter().map(|x| x * x).collect();\n    println!("{:?}", squared);\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is [1, 4, 9, 16, 25]', expected: '[1, 4, 9, 16, 25]' }],
  },
  {
    id: 'rust-22', language: 'rust', regionId: 'rust',
    title: 'Iterators', order: 22, xpReward: 140, isBoss: false,
    description: `## Quest 22: Iterator Chains

Rust iterators are lazy and composable:

\`\`\`rust
let nums = vec![1, 2, 3, 4, 5, 6];

let result: i32 = nums.iter()
    .filter(|&&x| x % 2 == 0)   // keep evens
    .map(|&x| x * x)             // square them
    .sum();                       // sum

println!("{}", result);  // 4+16+36 = 56
\`\`\`

### Your Mission
Given \`vec![1..=10]\` (numbers 1 to 10), filter out odds, square the evens, and print the sum.`,
    starterCode: 'fn main() {\n    let nums: Vec<i32> = (1..=10).collect();\n    let result: i32 = nums.iter()\n        .filter(|&&x| x % 2 == 0)\n        .map(|&x| x * x)\n        .sum();\n    println!("{}", result);\n}\n',
    hint: 'Run as-is — 4+16+36+64+100 = 220',
    tests: [{ description: 'Output is 220', expected: '220' }],
  },
  {
    id: 'rust-23', language: 'rust', regionId: 'rust',
    title: 'String Handling', order: 23, xpReward: 120, isBoss: false,
    description: `## Quest 23: Strings

Rust has two string types: \`String\` (owned) and \`&str\` (borrowed slice):

\`\`\`rust
let s = String::from("Hello, World!");
println!("{}", s.to_uppercase());     // HELLO, WORLD!
println!("{}", s.len());               // 13
println!("{}", s.contains("World")); // true
println!("{}", s.replace("World", "Rust")); // Hello, Rust!

let words: Vec<&str> = "one two three".split(' ').collect();
println!("{}", words.len());   // 3

let joined = words.join("-");
println!("{}", joined);  // one-two-three
\`\`\`

### Your Mission
Split \`"Aria:Bolt:Cara:Drake"\` by \`':'\`, collect to a Vec, and print the length.`,
    starterCode: 'fn main() {\n    let names = "Aria:Bolt:Cara:Drake";\n    let parts: Vec<&str> = names.split(\':\').collect();\n    println!("{}", parts.len());\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is 4', expected: '4' }],
  },
  {
    id: 'rust-24', language: 'rust', regionId: 'rust',
    title: 'Error Handling with ?', order: 24, xpReward: 140, isBoss: false,
    description: `## Quest 24: The ? Operator

\`?\` propagates errors automatically — return early if \`Err\`, unwrap if \`Ok\`:

\`\`\`rust
use std::num::ParseIntError;

fn parse_and_double(s: &str) -> Result<i32, ParseIntError> {
    let n: i32 = s.parse()?;   // returns Err if parse fails
    Ok(n * 2)
}

match parse_and_double("21") {
    Ok(v)  => println!("Got: {}", v),   // Got: 42
    Err(e) => println!("Error: {}", e),
}
\`\`\`

### Your Mission
Call \`parse_and_double("21")\` and print the Ok value. Then call with \`"abc"\` and print the error.`,
    starterCode: 'use std::num::ParseIntError;\n\nfn parse_and_double(s: &str) -> Result<i32, ParseIntError> {\n    let n: i32 = s.parse()?;\n    Ok(n * 2)\n}\n\nfn main() {\n    match parse_and_double("21") {\n        Ok(v)  => println!("{}", v),\n        Err(e) => println!("{}", e),\n    }\n    match parse_and_double("abc") {\n        Ok(v)  => println!("{}", v),\n        Err(e) => println!("{}", e),\n    }\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Prints 42 then parse error', expected: '42\ninvalid digit found in string' }],
  },
  {
    id: 'rust-25', language: 'rust', regionId: 'rust',
    title: 'Trait Objects (dyn)', order: 25, xpReward: 150, isBoss: false,
    description: `## Quest 25: Trait Objects

\`Box<dyn Trait>\` lets you store different types that implement the same trait in a collection:

\`\`\`rust
trait Draw { fn draw(&self) -> String; }

struct Circle  { r: f64 }
struct Square  { s: f64 }

impl Draw for Circle { fn draw(&self) -> String { format!("Circle({})", self.r) } }
impl Draw for Square { fn draw(&self) -> String { format!("Square({})", self.s) } }

let shapes: Vec<Box<dyn Draw>> = vec![
    Box::new(Circle { r: 5.0 }),
    Box::new(Square { s: 3.0 }),
];
for s in &shapes { println!("{}", s.draw()); }
\`\`\`

### Your Mission
Run the code above as-is and print both shapes.`,
    starterCode: 'trait Draw { fn draw(&self) -> String; }\n\nstruct Circle { r: f64 }\nstruct Square { s: f64 }\n\nimpl Draw for Circle { fn draw(&self) -> String { format!("Circle({})", self.r) } }\nimpl Draw for Square { fn draw(&self) -> String { format!("Square({})", self.s) } }\n\nfn main() {\n    let shapes: Vec<Box<dyn Draw>> = vec![\n        Box::new(Circle { r: 5.0 }),\n        Box::new(Square { s: 3.0 }),\n    ];\n    for s in &shapes { println!("{}", s.draw()); }\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Circle then Square', expected: 'Circle(5)\nSquare(3)' }],
  },
  {
    id: 'rust-26', language: 'rust', regionId: 'rust',
    title: 'Rc & RefCell', order: 26, xpReward: 150, isBoss: false,
    description: `## Quest 26: Rc and RefCell

\`Rc<T>\` enables multiple owners. \`RefCell<T>\` enables interior mutability:

\`\`\`rust
use std::rc::Rc;
use std::cell::RefCell;

let val = Rc::new(RefCell::new(5));

let a = Rc::clone(&val);
let b = Rc::clone(&val);

*a.borrow_mut() += 10;
println!("{}", b.borrow());  // 15 — shared and mutated
println!("refs: {}", Rc::strong_count(&val));  // 3
\`\`\`

### Your Mission
Create \`Rc<RefCell<i32>>\` with value 100. Clone it twice. Add 50 via one clone. Print the value via the other.`,
    starterCode: 'use std::rc::Rc;\nuse std::cell::RefCell;\n\nfn main() {\n    let val = Rc::new(RefCell::new(100));\n    let a = Rc::clone(&val);\n    let b = Rc::clone(&val);\n    *a.borrow_mut() += 50;\n    println!("{}", b.borrow());\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is 150', expected: '150' }],
  },
  {
    id: 'rust-27', language: 'rust', regionId: 'rust',
    title: 'Concurrency with Threads', order: 27, xpReward: 155, isBoss: false,
    description: `## Quest 27: Threads

Spawn threads with \`std::thread::spawn\`. Use \`Arc<Mutex<T>>\` to share mutable state:

\`\`\`rust
use std::thread;

let handle = thread::spawn(|| {
    println!("Hello from thread!");
});
handle.join().unwrap();
\`\`\`

### Your Mission
Spawn 5 threads, each returning its thread number (1–5) via \`join()\`.
Collect the results and print their sum.`,
    starterCode: 'use std::thread;\n\nfn main() {\n    let handles: Vec<_> = (1..=5).map(|i| {\n        thread::spawn(move || i)\n    }).collect();\n    let sum: i32 = handles.into_iter().map(|h| h.join().unwrap()).sum();\n    println!("{}", sum);\n}\n',
    hint: 'Run as-is — should print 15',
    tests: [{ description: 'Output is 15', expected: '15' }],
  },
  {
    id: 'rust-28', language: 'rust', regionId: 'rust',
    title: 'Channels', order: 28, xpReward: 155, isBoss: false,
    description: `## Quest 28: Channels (mpsc)

Channels allow communication between threads. \`mpsc\` = multiple producer, single consumer:

\`\`\`rust
use std::sync::mpsc;
use std::thread;

let (tx, rx) = mpsc::channel();

thread::spawn(move || {
    tx.send(String::from("hello")).unwrap();
});

let received = rx.recv().unwrap();
println!("{}", received);  // hello
\`\`\`

### Your Mission
Spawn 3 threads each sending their index (1, 2, 3) via \`tx.clone()\`.
Collect all 3 messages on the receiver and print their sum.`,
    starterCode: 'use std::sync::mpsc;\nuse std::thread;\n\nfn main() {\n    let (tx, rx) = mpsc::channel();\n    for i in 1..=3 {\n        let tx = tx.clone();\n        thread::spawn(move || { tx.send(i).unwrap(); });\n    }\n    drop(tx);\n    let sum: i32 = rx.iter().sum();\n    println!("{}", sum);\n}\n',
    hint: 'Run as-is — should print 6',
    tests: [{ description: 'Output is 6', expected: '6' }],
  },
  {
    id: 'rust-29', language: 'rust', regionId: 'rust',
    title: 'Macros', order: 29, xpReward: 150, isBoss: false,
    description: `## Quest 29: Declarative Macros

\`macro_rules!\` creates patterns that expand at compile time:

\`\`\`rust
macro_rules! say_hello {
    () => { println!("Hello!"); };
    ($name:expr) => { println!("Hello, {}!", $name); };
}

say_hello!();           // Hello!
say_hello!("Aria");     // Hello, Aria!

macro_rules! vec_of_strings {
    ($($x:expr),*) => {
        vec![$( String::from($x) ),*]
    };
}
let v = vec_of_strings!["a", "b", "c"];
\`\`\`

### Your Mission
Define a macro \`max!\` that takes two expressions and returns the larger one.
Print \`max!(7, 12)\`.`,
    starterCode: 'macro_rules! max {\n    ($a:expr, $b:expr) => {\n        if $a > $b { $a } else { $b }\n    };\n}\n\nfn main() {\n    println!("{}", max!(7, 12));\n}\n',
    hint: 'Run as-is',
    tests: [{ description: 'Output is 12', expected: '12' }],
  },
  {
    id: 'rust-30', language: 'rust', regionId: 'rust',
    title: 'Boss: The Borrow Checker Beast', order: 30, xpReward: 350, isBoss: true,
    description: `## Final Boss: The Borrow Checker Beast

Combine ownership, traits, generics, iterators, and error handling to win!

\`\`\`rust
trait Summary {
    fn summarize(&self) -> String;
}
fn notify<T: Summary>(item: &T) {
    println!("Breaking: {}", item.summarize());
}
\`\`\`

### Your Mission
1. Define \`trait Describable { fn describe(&self) -> String; }\`
2. Implement it for \`struct Weapon { name: String, power: i32 }\` — return \`"[name] (power: [power])"\`
3. Write \`fn strongest<T: Describable>(items: &[T]) -> &T\` — find max by calling \`describe()\` length (cheat: just return index 0 for simplicity — or sort by power field if you want the challenge)
4. Create \`vec![Weapon{..}, Weapon{..}, Weapon{..}]\` with powers 40, 95, 60
5. Print the description of the weapon with the highest power`,
    starterCode: 'trait Describable {\n    fn describe(&self) -> String;\n    fn power(&self) -> i32;\n}\n\nstruct Weapon {\n    name: String,\n    power: i32,\n}\n\nimpl Describable for Weapon {\n    fn describe(&self) -> String {\n        format!("{} (power: {})", self.name, self.power)\n    }\n    fn power(&self) -> i32 { self.power }\n}\n\nfn strongest<T: Describable>(items: &[T]) -> &T {\n    items.iter().max_by_key(|i| i.power()).unwrap()\n}\n\nfn main() {\n    let weapons = vec![\n        Weapon { name: String::from("Dagger"),    power: 40 },\n        Weapon { name: String::from("Excalibur"), power: 95 },\n        Weapon { name: String::from("Spear"),     power: 60 },\n    ];\n    println!("{}", strongest(&weapons).describe());\n}\n',
    hint: 'Run as-is — should print Excalibur (power: 95)',
    tests: [{ description: 'Output is Excalibur (power: 95)', expected: 'Excalibur (power: 95)' }],
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

  // Demo users — give the leaderboard some life across all languages
  const demoUsers = [
    { username: 'AriaStorm',   email: 'aria@demo.cq',    avatar: '🧙', heroClass: 'Mage',    completedLessons: { python: 20, javascript: 15, typescript: 10, sql: 8,  go: 5,  rust: 3  } },
    { username: 'BoltRunner',  email: 'bolt@demo.cq',    avatar: '⚔️', heroClass: 'Warrior', completedLessons: { python: 10, javascript: 25, typescript: 5,  sql: 3,  go: 12, rust: 0  } },
    { username: 'CaraWitch',   email: 'cara@demo.cq',    avatar: '🔮', heroClass: 'Mage',    completedLessons: { python: 5,  javascript: 8,  typescript: 20, sql: 15, go: 3,  rust: 8  } },
    { username: 'DrakeForge',  email: 'drake@demo.cq',   avatar: '🛡', heroClass: 'Paladin', completedLessons: { python: 15, javascript: 10, typescript: 8,  sql: 20, go: 8,  rust: 15 } },
    { username: 'EvePixel',    email: 'eve@demo.cq',     avatar: '🏹', heroClass: 'Ranger',  completedLessons: { python: 8,  javascript: 20, typescript: 15, sql: 5,  go: 20, rust: 5  } },
    { username: 'FinnCipher',  email: 'finn@demo.cq',    avatar: '🗡', heroClass: 'Rogue',   completedLessons: { python: 25, javascript: 5,  typescript: 3,  sql: 10, go: 6,  rust: 20 } },
    { username: 'GraceLoop',   email: 'grace@demo.cq',   avatar: '✨', heroClass: 'Mage',    completedLessons: { python: 12, javascript: 18, typescript: 22, sql: 6,  go: 4,  rust: 10 } },
    { username: 'HectorByte',  email: 'hector@demo.cq',  avatar: '⚙', heroClass: 'Warrior', completedLessons: { python: 6,  javascript: 12, typescript: 7,  sql: 18, go: 15, rust: 25 } },
    { username: 'IvyScript',   email: 'ivy@demo.cq',     avatar: '🌿', heroClass: 'Ranger',  completedLessons: { python: 18, javascript: 22, typescript: 12, sql: 4,  go: 9,  rust: 6  } },
    { username: 'JaxRuntime',  email: 'jax@demo.cq',     avatar: '🔥', heroClass: 'Rogue',   completedLessons: { python: 3,  javascript: 28, typescript: 18, sql: 12, go: 22, rust: 12 } },
  ]

  const hashedPassword = await bcrypt.hash('demo1234', 10)

  for (const demo of demoUsers) {
    // Calculate total XP and level from completed lessons
    let totalXP = 0
    const progressRecords = []

    for (const [region, count] of Object.entries(demo.completedLessons)) {
      const regionLessons = ALL_LESSONS
        .filter(l => l.regionId === region)
        .sort((a, b) => a.order - b.order)
        .slice(0, count)

      for (const lesson of regionLessons) {
        totalXP += lesson.xpReward
        progressRecords.push({ lessonId: lesson.id, regionId: region, xpEarned: lesson.xpReward })
      }
    }

    // Calculate level from XP
    let level = 1
    let xpNeeded = 100
    let remaining = totalXP
    while (remaining >= xpNeeded) { remaining -= xpNeeded; level++; xpNeeded = level * 100 }

    const points = Math.floor(totalXP / 5)

    // Upsert the user
    const user = await prisma.user.upsert({
      where: { email: demo.email },
      update: { xp: totalXP, level, points },
      create: {
        username: demo.username,
        email: demo.email,
        password: hashedPassword,
        avatar: demo.avatar,
        heroClass: demo.heroClass,
        xp: totalXP,
        level,
        points,
      }
    })

    // Upsert progress records
    for (const p of progressRecords) {
      await prisma.progress.upsert({
        where: { userId_lessonId: { userId: user.id, lessonId: p.lessonId } },
        update: {},
        create: { userId: user.id, lessonId: p.lessonId, regionId: p.regionId, xpEarned: p.xpEarned }
      })
    }

    console.log(`  ✓ Demo user: ${demo.username} (${totalXP} XP, level ${level})`)
  }

  console.log(`\n✅ Seed complete! ${ALL_LESSONS.length} lessons across 6 languages.`)
}

export { seed }

// Allow running directly: node src/seed.js
if (process.argv[1].endsWith('seed.js')) {
  seed()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
