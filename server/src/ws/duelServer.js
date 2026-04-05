/**
 * WebSocket Duel Server
 *
 * How WebSockets work vs HTTP:
 *   HTTP:      Client asks → Server answers → connection closes
 *   WebSocket: Client connects → connection stays open → either side can send at any time
 *
 * This file manages the entire real-time duel lifecycle:
 *   1. A player sends { type: "join_queue", language }
 *   2. Once two players are queued for the same language, a duel starts
 *   3. Both players get the same coding problem
 *   4. Players send { type: "submit", code } when they think they've solved it
 *   5. Server runs the code and broadcasts the winner
 *
 * State is kept in memory (Maps). In production you'd use Redis so multiple
 * server instances can share state — but for a single server, Maps are fine.
 */

import { WebSocketServer } from 'ws'
import jwt from 'jsonwebtoken'
import { exec } from 'child_process'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'codequest-dev-secret-change-in-production'

// ── In-memory state ───────────────────────────────────────
// Queue: players waiting for an opponent, keyed by language
// Map<language, { ws, userId, username, timeoutId, botTimeoutId }>
const queue = new Map()

// Active duels: Map<duelId, { playerA, playerB, problem, startTime, resolved }>
const activeduels = new Map()

// How long to wait for a real opponent before sending a bot (ms)
const BOT_DELAY = 15000
// How long before cancelling the queue entirely if even the bot fails (ms)
const QUEUE_TIMEOUT = 30000

// ── Duel problems ─────────────────────────────────────────
// Duel problems — multi-fundamental challenges designed to take 5–10 minutes
const DUEL_PROBLEMS = {
  python: [
    {
      id: 'duel-py-1',
      botDelay: 15 * 60 * 1000, // 15 min — medium: class + dict + sorting
      title: 'Inventory Manager',
      description: `Build a simple inventory system using a class and a dict.

1. Create a class \`Inventory\` with a private \`_items\` dict (name -> qty).
2. Add method \`add(name, qty)\` — adds qty to existing or creates new entry.
3. Add method \`remove(name, qty)\` — reduces qty; if qty drops to 0 or below, delete the entry.
4. Add method \`top(n)\` — returns a list of the top n item names sorted by qty descending.
5. Create an Inventory, run these operations in order:
   inv.add("sword", 5)
   inv.add("potion", 12)
   inv.add("shield", 3)
   inv.add("potion", 8)
   inv.remove("sword", 5)
   inv.add("arrow", 25)
   print(inv.top(3))

Expected output (one line, a Python list):
['arrow', 'potion', 'shield']`,
      starterCode: `class Inventory:
    def __init__(self):
        self._items = {}

    def add(self, name, qty):
        pass  # implement

    def remove(self, name, qty):
        pass  # implement

    def top(self, n):
        pass  # implement

inv = Inventory()
inv.add("sword", 5)
inv.add("potion", 12)
inv.add("shield", 3)
inv.add("potion", 8)
inv.remove("sword", 5)
inv.add("arrow", 25)
print(inv.top(3))
`,
      expected: "['arrow', 'potion', 'shield']",
    },
    {
      id: 'duel-py-2',
      botDelay: 12 * 60 * 1000, // 12 min — medium: dict + list comprehension + sort
      title: 'Word Frequency Analyser',
      description: `Analyse word frequency in a text using dicts, list comprehensions, and sorting.

Given the string:
text = "the hero cast a spell the spell hit the dragon the dragon fled"

1. Write \`word_freq(text)\` that returns a dict of {word: count}.
2. Write \`top_words(text, n)\` that returns a list of the top n most frequent words as tuples (word, count), sorted by count descending. Ties broken alphabetically ascending.
3. Print the result of \`top_words(text, 3)\` — one tuple per line.

Expected output:
('the', 4)
('dragon', 2)
('spell', 2)`,
      starterCode: `def word_freq(text):
    pass  # implement

def top_words(text, n):
    pass  # implement

text = "the hero cast a spell the spell hit the dragon the dragon fled"
for item in top_words(text, 3):
    print(item)
`,
      expected: "('the', 4)\n('dragon', 2)\n('spell', 2)",
    },
    {
      id: 'duel-py-3',
      botDelay: 15 * 60 * 1000, // 15 min — medium: OOP + inheritance + loops
      title: 'Dungeon Crawler Simulator',
      description: `Simulate a dungeon using OOP, inheritance, and list comprehensions.

1. Create base class \`Entity\` with \`name\` (str) and \`hp\` (int). Add method \`is_alive()\` returning \`hp > 0\`.
2. Create \`Hero(Entity)\` with extra \`attack_power\` (int). Add \`attack(enemy)\` which reduces enemy.hp by attack_power.
3. Create \`Monster(Entity)\` with extra \`reward\` (int).
4. Simulate:
   - Create Hero("Aria", hp=100, attack_power=35)
   - Create monsters: Monster("Goblin", hp=40, reward=10), Monster("Troll", hp=90, reward=25), Monster("Dragon", hp=60, reward=50)
   - Hero attacks each monster until it dies (loop until not is_alive)
   - Collect rewards only from defeated monsters
5. Print total reward earned.

Expected output:
85`,
      starterCode: `class Entity:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def is_alive(self):
        pass  # implement

class Hero(Entity):
    def __init__(self, name, hp, attack_power):
        super().__init__(name, hp)
        self.attack_power = attack_power

    def attack(self, enemy):
        pass  # implement

class Monster(Entity):
    def __init__(self, name, hp, reward):
        super().__init__(name, hp)
        self.reward = reward

hero = Hero("Aria", hp=100, attack_power=35)
monsters = [
    Monster("Goblin", hp=40, reward=10),
    Monster("Troll", hp=90, reward=25),
    Monster("Dragon", hp=60, reward=50),
]

total_reward = 0
for monster in monsters:
    while monster.is_alive():
        hero.attack(monster)
    total_reward += monster.reward

print(total_reward)
`,
      expected: '85',
    },
    {
      id: 'duel-py-4',
      botDelay: 25 * 60 * 1000, // 25 min — hard: cache eviction logic
      title: 'LRU Cache',
      description: `Implement a Least Recently Used (LRU) cache from scratch.

An LRU cache evicts the least recently used item when it exceeds capacity.

1. Implement class \`LRUCache\` with \`__init__(self, capacity)\`.
2. Add \`get(key)\` — returns the value if key exists (and marks it as recently used), else returns -1.
3. Add \`put(key, value)\` — inserts/updates the key. If over capacity, evict the least recently used key.
4. Use only a dict and manual ordering (or collections.OrderedDict).
5. Run:
   cache = LRUCache(3)
   cache.put("a", 1)
   cache.put("b", 2)
   cache.put("c", 3)
   cache.get("a")       # use "a" — now "b" is LRU
   cache.put("d", 4)    # evicts "b"
   print(cache.get("b"))  # -1 (evicted)
   print(cache.get("a"))  # 1
   print(cache.get("d"))  # 4

Expected output:
-1
1
4`,
      starterCode: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        pass  # implement

    def put(self, key, value):
        pass  # implement

cache = LRUCache(3)
cache.put("a", 1)
cache.put("b", 2)
cache.put("c", 3)
cache.get("a")
cache.put("d", 4)
print(cache.get("b"))
print(cache.get("a"))
print(cache.get("d"))
`,
      expected: '-1\n1\n4',
    },
    {
      id: 'duel-py-5',
      botDelay: 25 * 60 * 1000, // 25 min — hard: graph traversal + shortest path
      title: 'Graph BFS',
      description: `Implement Breadth-First Search on an adjacency list graph.

1. Represent the graph as a dict of lists (adjacency list).
2. Write \`bfs(graph, start)\` that returns a list of nodes in BFS visit order.
3. Write \`shortest_path(graph, start, end)\` that returns the length of the shortest path (number of edges) between start and end, or -1 if unreachable.
4. Use this graph:
   graph = {
     "A": ["B", "C"],
     "B": ["A", "D", "E"],
     "C": ["A", "F"],
     "D": ["B"],
     "E": ["B", "F"],
     "F": ["C", "E"]
   }
5. Print bfs order starting from "A", then print shortest_path("A", "F").

Expected output:
['A', 'B', 'C', 'D', 'E', 'F']
2`,
      starterCode: `from collections import deque

def bfs(graph, start):
    pass  # implement

def shortest_path(graph, start, end):
    pass  # implement

graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"]
}

print(bfs(graph, "A"))
print(shortest_path(graph, "A", "F"))
`,
      expected: "['A', 'B', 'C', 'D', 'E', 'F']\n2",
    },
    {
      id: 'duel-py-6',
      botDelay: 20 * 60 * 1000, // 20 min — medium-hard: parameterised decorator factory
      title: 'Decorator Chain',
      description: `Build a decorator pipeline that transforms function output.

1. Write decorator \`@uppercase\` that converts string return value to uppercase.
2. Write decorator \`@exclaim\` that appends "!!!" to string return value.
3. Write decorator \`@repeat(n)\` (a parameterised decorator factory) that calls the function n times and joins results with " | ".
4. Apply all three (in this order from outermost to innermost: repeat(3), uppercase, exclaim) to function \`greet(name)\` which returns \`"hello " + name\`.
5. Print \`greet("aria")\`.

Expected output:
HELLO ARIA!!! | HELLO ARIA!!! | HELLO ARIA!!!`,
      starterCode: `def uppercase(func):
    pass  # implement

def exclaim(func):
    pass  # implement

def repeat(n):
    def decorator(func):
        pass  # implement
    return decorator

@repeat(3)
@uppercase
@exclaim
def greet(name):
    return "hello " + name

print(greet("aria"))
`,
      expected: 'HELLO ARIA!!! | HELLO ARIA!!! | HELLO ARIA!!!',
    },
    {
      id: 'duel-py-7',
      botDelay: 15 * 60 * 1000, // 15 min — medium: generators + dict grouping
      title: 'Flatten & Group',
      description: `Combine generators, itertools-style logic, and dict grouping.

1. Write generator \`flatten(nested)\` that lazily yields every element from an arbitrarily nested list.
2. Write \`group_by(items, key_fn)\` that returns a dict mapping each key (from key_fn) to a list of matching items.
3. Given:
   data = [[1, 2, [3, 4]], [5, [6, [7, 8]]], 9, 10]
   flat = list(flatten(data))
   groups = group_by(flat, lambda x: "even" if x % 2 == 0 else "odd")
4. Print len(flat), then print sorted(groups["even"]), then print sorted(groups["odd"]).

Expected output:
10
[2, 4, 6, 8, 10]
[1, 3, 5, 7, 9]`,
      starterCode: `def flatten(nested):
    pass  # implement — use yield / yield from

def group_by(items, key_fn):
    pass  # implement

data = [[1, 2, [3, 4]], [5, [6, [7, 8]]], 9, 10]
flat = list(flatten(data))
groups = group_by(flat, lambda x: "even" if x % 2 == 0 else "odd")
print(len(flat))
print(sorted(groups["even"]))
print(sorted(groups["odd"]))
`,
      expected: '10\n[2, 4, 6, 8, 10]\n[1, 3, 5, 7, 9]',
    },
    {
      id: 'duel-py-8',
      botDelay: 25 * 60 * 1000, // 25 min — hard: recursive BST insert + traversal
      title: 'Binary Search Tree',
      description: `Implement a Binary Search Tree with insert, search, and in-order traversal.

1. Create class \`Node\` with \`val\`, \`left = None\`, \`right = None\`.
2. Create class \`BST\` with \`insert(val)\` and \`inorder()\` (returns sorted list) and \`search(val)\` (returns True/False).
3. Insert: 50, 30, 70, 20, 40, 60, 80
4. Print inorder() result.
5. Print search(40), then print search(55).

Expected output:
[20, 30, 40, 50, 60, 70, 80]
True
False`,
      starterCode: `class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        pass  # implement

    def inorder(self):
        pass  # implement — return sorted list

    def search(self, val):
        pass  # implement — return True/False

bst = BST()
for v in [50, 30, 70, 20, 40, 60, 80]:
    bst.insert(v)

print(bst.inorder())
print(bst.search(40))
print(bst.search(55))
`,
      expected: '[20, 30, 40, 50, 60, 70, 80]\nTrue\nFalse',
    },
    {
      id: 'duel-py-9',
      botDelay: 28 * 60 * 1000, // 28 min — hard: sliding window algorithm
      title: 'Rate Limiter',
      description: `Implement a token-bucket rate limiter using closures and time.

1. Write \`make_rate_limiter(rate, per)\` — returns a function \`allow()\` that returns True if a request is allowed, False if rate-limited.
   - \`rate\` = max requests allowed per \`per\` seconds.
   - Use a sliding window: track timestamps of recent calls, discard those older than \`per\` seconds.
2. Simulate (without real time — use a manual clock):
   Write \`make_rate_limiter_manual(rate, per)\` that takes an extra \`now\` argument in \`allow(now)\`.
3. Run:
   limiter = make_rate_limiter_manual(3, 10)
   results = [
       limiter(0), limiter(1), limiter(2),   # 3 allowed
       limiter(3),                             # 4th in window — denied
       limiter(11),                            # window reset — allowed
   ]
   print(results)

Expected output:
[True, True, True, False, True]`,
      starterCode: `def make_rate_limiter_manual(rate, per):
    timestamps = []

    def allow(now):
        pass  # implement sliding window

    return allow

limiter = make_rate_limiter_manual(3, 10)
results = [
    limiter(0), limiter(1), limiter(2),
    limiter(3),
    limiter(11),
]
print(results)
`,
      expected: '[True, True, True, False, True]',
    },
    {
      id: 'duel-py-10',
      botDelay: 35 * 60 * 1000, // 35 min — very hard: stack-based parser with precedence
      title: 'Mini Expression Evaluator',
      description: `Parse and evaluate simple arithmetic expressions using a stack.

Implement a function \`evaluate(expr)\` that evaluates a string expression containing:
- Non-negative integers
- Operators: +, -, *, /  (integer division for /)
- Parentheses for grouping
- Spaces (ignore them)

You must handle operator precedence (* and / before + and -) and parentheses correctly.

Do NOT use eval().

Test:
print(evaluate("3 + 5"))
print(evaluate("10 + 2 * 6"))
print(evaluate("100 * ( 2 + 12 ) / 14"))

Expected output:
8
22
100`,
      starterCode: `def evaluate(expr):
    tokens = expr.replace('(', ' ( ').replace(')', ' ) ').split()
    # Hint: use two stacks — one for numbers, one for operators
    # Handle precedence by checking before pushing each operator
    pass

print(evaluate("3 + 5"))
print(evaluate("10 + 2 * 6"))
print(evaluate("100 * ( 2 + 12 ) / 14"))
`,
      expected: '8\n22\n100',
    },
  ],

  javascript: [
    {
      id: 'duel-js-1',
      botDelay: 15 * 60 * 1000, // 15 min — medium: private fields + getters + array methods
      title: 'Quest Log',
      description: `Build a quest tracking system using classes, closures, and array methods.

1. Create class \`QuestLog\` with private \`#quests = []\` array.
2. Add \`addQuest(name, xp)\` — pushes \`{ name, xp, done: false }\`.
3. Add \`complete(name)\` — marks the matching quest done. If not found, does nothing.
4. Add getter \`totalXP\` — returns sum of xp for completed quests only.
5. Add \`summary()\` — returns an array of strings: \`"[name] - done"\` or \`"[name] - pending"\` for each quest.
6. Run:
   const log = new QuestLog()
   log.addQuest("Slay Dragon", 150)
   log.addQuest("Find Sword", 80)
   log.addQuest("Rescue King", 120)
   log.complete("Slay Dragon")
   log.complete("Rescue King")
   console.log(log.totalXP)
   log.summary().forEach(s => console.log(s))

Expected output:
270
Slay Dragon - done
Find Sword - pending
Rescue King - done`,
      starterCode: `class QuestLog {
  #quests = []

  addQuest(name, xp) {
    // implement
  }

  complete(name) {
    // implement
  }

  get totalXP() {
    // implement
    return 0
  }

  summary() {
    // implement
    return []
  }
}

const log = new QuestLog()
log.addQuest("Slay Dragon", 150)
log.addQuest("Find Sword", 80)
log.addQuest("Rescue King", 120)
log.complete("Slay Dragon")
log.complete("Rescue King")
console.log(log.totalXP)
log.summary().forEach(s => console.log(s))
`,
      expected: '270\nSlay Dragon - done\nFind Sword - pending\nRescue King - done',
    },
    {
      id: 'duel-js-2',
      botDelay: 12 * 60 * 1000, // 12 min — medium: Promise.all + async/await
      title: 'Async Hero Stats',
      description: `Combine async/await, Promises, array methods, and error handling.

1. Write async function \`fetchStats(heroName)\` that returns a Promise resolving to:
   - \`{ name: heroName, hp: heroName.length * 10, power: heroName.length * 7 }\`
2. Write async function \`fetchAllStats(names)\` that calls \`fetchStats\` for all names in parallel using \`Promise.all\`.
3. Write \`strongest(stats)\` — returns the stat object with the highest \`power\`.
4. Run with \`["Aria", "Bolt", "Cassandra"]\`:
   - Fetch all stats in parallel
   - Find and print the strongest hero's name and power on separate lines

Expected output:
Cassandra
63`,
      starterCode: `async function fetchStats(heroName) {
  // implement
}

async function fetchAllStats(names) {
  // implement
}

function strongest(stats) {
  // implement
}

async function main() {
  const stats = await fetchAllStats(["Aria", "Bolt", "Cassandra"])
  const best = strongest(stats)
  console.log(best.name)
  console.log(best.power)
}

main()
`,
      expected: 'Cassandra\n63',
    },
    {
      id: 'duel-js-3',
      botDelay: 15 * 60 * 1000, // 15 min — medium: closures + Map + reduce
      title: 'Spell Combinatorics',
      description: `Use closures, higher-order functions, Map, and reduce.

1. Write \`makeSpellCaster(multiplier)\` — returns a function that takes \`(spellName, basePower)\` and returns \`basePower * multiplier\`.
2. Write \`combineSpells(spells, caster)\` — takes an array of \`{ name, power }\` objects and a caster function, returns a new array with each spell's power run through the caster.
3. Write \`spellMap(spells)\` — returns a Map of \`spellName -> power\` from the spell array.
4. Run:
   const fireMage = makeSpellCaster(3)
   const spells = [{ name: "Fireball", power: 10 }, { name: "Inferno", power: 15 }, { name: "Ember", power: 5 }]
   const boosted = combineSpells(spells, fireMage)
   const map = spellMap(boosted)
   console.log(map.get("Fireball"))
   console.log(map.get("Inferno"))
   console.log([...map.values()].reduce((a, b) => a + b, 0))

Expected output:
30
45
90`,
      starterCode: `function makeSpellCaster(multiplier) {
  // implement
}

function combineSpells(spells, caster) {
  // implement
}

function spellMap(spells) {
  // implement
}

const fireMage = makeSpellCaster(3)
const spells = [
  { name: "Fireball", power: 10 },
  { name: "Inferno", power: 15 },
  { name: "Ember", power: 5 },
]
const boosted = combineSpells(spells, fireMage)
const map = spellMap(boosted)
console.log(map.get("Fireball"))
console.log(map.get("Inferno"))
console.log([...map.values()].reduce((a, b) => a + b, 0))
`,
      expected: '30\n45\n90',
    },
    {
      id: 'duel-js-4',
      botDelay: 18 * 60 * 1000, // 18 min — medium-hard: memoization + recursive caching
      title: 'Memoize & Fibonacci',
      description: `Implement a generic memoize function and use it to optimise recursive Fibonacci.

1. Write \`memoize(fn)\` — returns a wrapped version of \`fn\` that caches results by argument. Use a Map internally.
2. Write recursive \`fib(n)\` (without memoize first).
3. Apply: \`const fastFib = memoize(fib)\` — BUT since \`fib\` calls itself, you need to write it so the recursive calls also go through the cache. The cleanest way: define \`fib\` to call \`fastFib\` internally.
4. Print \`fastFib(10)\`, \`fastFib(20)\`, \`fastFib(30)\`.

Expected output:
55
6765
832040`,
      starterCode: `function memoize(fn) {
  // implement using Map
}

// Define fib to use the memoized version for recursive calls
let fastFib
function fib(n) {
  if (n <= 1) return n
  return fastFib(n - 1) + fastFib(n - 2)
}
fastFib = memoize(fib)

console.log(fastFib(10))
console.log(fastFib(20))
console.log(fastFib(30))
`,
      expected: '55\n6765\n832040',
    },
    {
      id: 'duel-js-5',
      botDelay: 22 * 60 * 1000, // 22 min — hard: pub/sub pattern with once + off
      title: 'Event Emitter',
      description: `Build a typed EventEmitter from scratch using Maps and closures.

1. Implement class \`EventEmitter\` with:
   - \`on(event, listener)\` — register a listener
   - \`off(event, listener)\` — remove a specific listener
   - \`emit(event, ...args)\` — call all listeners for the event with args
   - \`once(event, listener)\` — listener fires only once then auto-removes
2. Run:
   const emitter = new EventEmitter()
   const log = (msg) => console.log("log:", msg)
   emitter.on("msg", log)
   emitter.once("msg", (msg) => console.log("once:", msg))
   emitter.emit("msg", "hello")   // fires log + once
   emitter.emit("msg", "world")   // fires only log (once removed)
   emitter.off("msg", log)
   emitter.emit("msg", "silent")  // nothing fires

Expected output:
log: hello
once: hello
log: world`,
      starterCode: `class EventEmitter {
  constructor() {
    this._listeners = new Map()
  }

  on(event, listener) {
    // implement
  }

  off(event, listener) {
    // implement
  }

  emit(event, ...args) {
    // implement
  }

  once(event, listener) {
    // implement using on + off
  }
}

const emitter = new EventEmitter()
const log = (msg) => console.log("log:", msg)
emitter.on("msg", log)
emitter.once("msg", (msg) => console.log("once:", msg))
emitter.emit("msg", "hello")
emitter.emit("msg", "world")
emitter.off("msg", log)
emitter.emit("msg", "silent")
`,
      expected: 'log: hello\nonce: hello\nlog: world',
    },
    {
      id: 'duel-js-6',
      botDelay: 20 * 60 * 1000, // 20 min — medium-hard: recursive object comparison
      title: 'Deep Object Diff',
      description: `Recursively diff two objects and report what changed.

Write \`diff(obj1, obj2)\` that returns an object describing the differences:
- For each key: if values are equal, skip it.
- If a value changed: \`{ before: oldVal, after: newVal }\`
- If a key was added: \`{ before: undefined, after: newVal }\`
- If a key was removed: \`{ before: oldVal, after: undefined }\`
- If both values are objects: recurse into them.

Run:
const a = { name: "Aria", level: 5, stats: { hp: 100, mp: 50 } }
const b = { name: "Aria", level: 10, stats: { hp: 120, mp: 50 }, guild: "Ironclad" }
const result = diff(a, b)
console.log(result.level.before)
console.log(result.level.after)
console.log(result.stats.hp.after)
console.log(result.guild.after)

Expected output:
5
10
120
Ironclad`,
      starterCode: `function diff(obj1, obj2) {
  // implement recursively
}

const a = { name: "Aria", level: 5, stats: { hp: 100, mp: 50 } }
const b = { name: "Aria", level: 10, stats: { hp: 120, mp: 50 }, guild: "Ironclad" }
const result = diff(a, b)
console.log(result.level.before)
console.log(result.level.after)
console.log(result.stats.hp.after)
console.log(result.guild.after)
`,
      expected: '5\n10\n120\nIronclad',
    },
    {
      id: 'duel-js-7',
      botDelay: 28 * 60 * 1000, // 28 min — hard: concurrency limiting + async queuing
      title: 'Promise Queue',
      description: `Implement a concurrency-limited async task queue.

Write class \`PromiseQueue\` that runs async tasks with a max concurrency limit.

1. \`constructor(concurrency)\` — max number of tasks running simultaneously.
2. \`add(asyncFn)\` — adds an async function to the queue, returns a Promise that resolves with its result.
3. Tasks beyond the concurrency limit wait until a slot frees up.

Simulate with tasks that resolve after a delay:
const queue = new PromiseQueue(2)
const delay = (ms, val) => new Promise(res => setTimeout(() => res(val), ms))
const results = await Promise.all([
  queue.add(() => delay(50, "A")),
  queue.add(() => delay(30, "B")),
  queue.add(() => delay(10, "C")),
  queue.add(() => delay(20, "D")),
])
console.log(results.join(","))

Expected output:
A,B,C,D`,
      starterCode: `class PromiseQueue {
  constructor(concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  add(asyncFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ asyncFn, resolve, reject })
      this._run()
    })
  }

  _run() {
    // implement: while running < concurrency and queue not empty, dequeue and run
  }
}

const queue = new PromiseQueue(2)
const delay = (ms, val) => new Promise(res => setTimeout(() => res(val), ms))

Promise.all([
  queue.add(() => delay(50, "A")),
  queue.add(() => delay(30, "B")),
  queue.add(() => delay(10, "C")),
  queue.add(() => delay(20, "D")),
]).then(results => console.log(results.join(",")))
`,
      expected: 'A,B,C,D',
    },
    {
      id: 'duel-js-8',
      botDelay: 15 * 60 * 1000, // 15 min — medium: pointer manipulation + in-place reversal
      title: 'Linked List',
      description: `Implement a singly linked list with common operations.

1. Create class \`Node\` with \`val\` and \`next = null\`.
2. Create class \`LinkedList\` with:
   - \`push(val)\` — append to end
   - \`pop()\` — remove and return last value
   - \`reverse()\` — reverse the list in-place
   - \`toArray()\` — return all values as an array
3. Run:
   const list = new LinkedList()
   list.push(1); list.push(2); list.push(3); list.push(4); list.push(5)
   console.log(list.pop())
   list.reverse()
   console.log(list.toArray())

Expected output:
5
[4, 3, 2, 1]`,
      starterCode: `class Node {
  constructor(val) {
    this.val = val
    this.next = null
  }
}

class LinkedList {
  constructor() {
    this.head = null
  }

  push(val) {
    // implement
  }

  pop() {
    // implement — return the removed value
  }

  reverse() {
    // implement in-place
  }

  toArray() {
    // implement
  }
}

const list = new LinkedList()
list.push(1); list.push(2); list.push(3); list.push(4); list.push(5)
console.log(list.pop())
list.reverse()
console.log(list.toArray())
`,
      expected: '5\n[4, 3, 2, 1]',
      expectedCheck: (stdout) => stdout.includes('5') && stdout.includes('4, 3, 2, 1'),
    },
    {
      id: 'duel-js-9',
      botDelay: 25 * 60 * 1000, // 25 min — hard: partial application + function pipelines
      title: 'Curry & Compose',
      description: `Implement function currying and composition from scratch.

1. Write \`curry(fn)\` — returns a curried version of fn. A curried function can be called with partial args and keeps returning functions until all args are satisfied.
2. Write \`compose(...fns)\` — returns a function that applies fns right-to-left.
3. Write \`pipe(...fns)\` — same but left-to-right.
4. Run:
   const add = curry((a, b, c) => a + b + c)
   console.log(add(1)(2)(3))
   console.log(add(1, 2)(3))
   console.log(add(1)(2, 3))

   const double = x => x * 2
   const addTen = x => x + 10
   const square = x => x * x

   const transform = compose(square, addTen, double)
   console.log(transform(3))  // square(addTen(double(3))) = square(16) = 256

   const pipeline = pipe(double, addTen, square)
   console.log(pipeline(3))   // square(addTen(double(3))) = same = 256

Expected output:
6
6
6
256
256`,
      starterCode: `function curry(fn) {
  // implement
}

function compose(...fns) {
  // implement — right to left
}

function pipe(...fns) {
  // implement — left to right
}

const add = curry((a, b, c) => a + b + c)
console.log(add(1)(2)(3))
console.log(add(1, 2)(3))
console.log(add(1)(2, 3))

const double = x => x * 2
const addTen = x => x + 10
const square = x => x * x

const transform = compose(square, addTen, double)
console.log(transform(3))

const pipeline = pipe(double, addTen, square)
console.log(pipeline(3))
`,
      expected: '6\n6\n6\n256\n256',
    },
    {
      id: 'duel-js-10',
      botDelay: 28 * 60 * 1000, // 28 min — hard: Redux pattern + pub/sub + unsubscribe
      title: 'Reactive Store',
      description: `Build a mini reactive state store (like a simplified Redux/Zustand).

1. Write \`createStore(reducer, initialState)\` that returns a store with:
   - \`getState()\` — returns current state
   - \`dispatch(action)\` — calls reducer(currentState, action) and updates state
   - \`subscribe(listener)\` — registers a callback called on every state change, returns an unsubscribe function
2. Reducer handles actions: \`{ type: "ADD", payload }\`, \`{ type: "REMOVE", payload }\`, \`{ type: "CLEAR" }\` on a \`{ items: [] }\` state.
3. Run:
   const store = createStore(reducer, { items: [] })
   const unsub = store.subscribe(() => console.log(store.getState().items.length))
   store.dispatch({ type: "ADD", payload: "sword" })
   store.dispatch({ type: "ADD", payload: "shield" })
   store.dispatch({ type: "REMOVE", payload: "sword" })
   unsub()
   store.dispatch({ type: "ADD", payload: "potion" })  // subscriber gone, no log
   console.log(store.getState().items)

Expected output:
1
2
1
['shield', 'potion']`,
      starterCode: `function createStore(reducer, initialState) {
  // implement
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD":    return { ...state, items: [...state.items, action.payload] }
    case "REMOVE": return { ...state, items: state.items.filter(i => i !== action.payload) }
    case "CLEAR":  return { ...state, items: [] }
    default:       return state
  }
}

const store = createStore(reducer, { items: [] })
const unsub = store.subscribe(() => console.log(store.getState().items.length))
store.dispatch({ type: "ADD", payload: "sword" })
store.dispatch({ type: "ADD", payload: "shield" })
store.dispatch({ type: "REMOVE", payload: "sword" })
unsub()
store.dispatch({ type: "ADD", payload: "potion" })
console.log(JSON.stringify(store.getState().items))
`,
      expected: "1\n2\n1\n[\"shield\",\"potion\"]",
    },
  ],
}

// ── Helper: run code and check output ─────────────────────
const RUNNERS = {
  python: (f) => `python3 "${f}"`,
  javascript: (f) => `node "${f}"`,
}
const EXTS = { python: 'py', javascript: 'js' }

async function runCode(code, language) {
  const runner = RUNNERS[language]
  if (!runner) return { success: false, stdout: 'Language not supported' }

  const ext = EXTS[language] ?? 'txt'
  const filename = `duel_${Date.now()}.${ext}`
  const filepath = join(tmpdir(), filename)

  try {
    await writeFile(filepath, code, 'utf-8')
    const stdout = await new Promise((resolve, reject) => {
      exec(runner(filepath), { timeout: 10000, maxBuffer: 1024 * 64 }, (err, out, errOut) => {
        if (err?.killed) return reject(new Error('Time limit exceeded'))
        resolve(out + (errOut ? `\n${errOut}` : ''))
      })
    })
    return { success: true, stdout: stdout.trim() }
  } catch (err) {
    return { success: false, stdout: err.message }
  } finally {
    unlink(filepath).catch(() => {})
  }
}

// ── Helper: send JSON to a WebSocket client ────────────────
// WebSocket.send() only accepts strings or Buffers, so we always JSON.stringify
function send(ws, payload) {
  if (ws.readyState === 1) { // 1 = OPEN
    ws.send(JSON.stringify(payload))
  }
}

// ── Helper: pick next problem using round-robin per language ─
// Tracks last-used index per language so users rotate through
// all problems before seeing a repeat
const problemIndex = {}
function pickProblem(language) {
  const pool = DUEL_PROBLEMS[language] ?? DUEL_PROBLEMS.python
  const idx = problemIndex[language] ?? 0
  problemIndex[language] = (idx + 1) % pool.length
  return pool[idx]
}

// ── Helper: start a duel between two players ──────────────
function startDuel(playerA, playerB, language) {
  const problem = pickProblem(language)
  const duelId = `duel_${Date.now()}`

  activeduels.set(duelId, {
    playerA: { ...playerA, solved: false },
    playerB: { ...playerB, solved: false },
    problem,
    language,
    startTime: Date.now(),
    resolved: false,
  })

  playerA.duelId = duelId
  playerB.duelId = duelId

  send(playerA.ws, { type: 'duel_start', duelId, problem, opponentName: playerB.username })
  send(playerB.ws, { type: 'duel_start', duelId, problem, opponentName: playerA.username })

  return { duelId, problem }
}

// ── Helper: start a bot duel for a queued player ──────────
function startBotDuel(player, language) {
  // Clear their queue timers
  clearTimeout(player.botTimeoutId)
  clearTimeout(player.timeoutId)
  queue.delete(language)

  const problem = pickProblem(language)
  const duelId = `duel_${Date.now()}`
  const botName = ['CodeBot', 'GlitchBot', 'NullBot', 'ByteBot'][Math.floor(Math.random() * 4)]

  // Bot is a fake player — it has no real ws, we handle it server-side
  const botPlayer = { userId: 'bot', username: botName, duelId, solved: false, isBot: true }

  activeduels.set(duelId, {
    playerA: { ...player, solved: false },
    playerB: botPlayer,
    problem,
    language,
    startTime: Date.now(),
    resolved: false,
    isBot: true,
  })

  player.duelId = duelId

  send(player.ws, { type: 'duel_start', duelId, problem, opponentName: botName })

  // Bot delay comes from the problem itself — scaled to expected human solve time
  // Add a small random jitter (±1 min) so it doesn't feel robotic
  const botDelay = (problem.botDelay ?? 20 * 60 * 1000) + (Math.random() * 2 - 1) * 60 * 1000
  setTimeout(async () => {
    const duel = activeduels.get(duelId)
    if (!duel || duel.resolved) return

    duel.resolved = true
    // Bot wins — tell the human
    send(player.ws, { type: 'duel_result', winner: botName, youWon: false, stdout: '' })
    activeduels.delete(duelId)
  }, botDelay)
}

// ── Main: attach WebSocket server to existing HTTP server ──
export function attachDuelServer(httpServer) {
  // We attach to the same port as Express but at path /ws/duel
  // This means the same port 5000 serves both HTTP and WebSocket traffic
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/duel' })

  wss.on('connection', (ws, req) => {
    // Extract JWT from query string: ws://localhost:5000/ws/duel?token=xxx
    const url = new URL(req.url, 'http://localhost')
    const token = url.searchParams.get('token')

    let player = null
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      player = { ws, userId: decoded.id, username: decoded.username, duelId: null }
    } catch {
      send(ws, { type: 'error', message: 'Invalid token' })
      ws.close()
      return
    }

    console.log(`⚔ Duel socket connected: ${player.username}`)

    // ── Handle incoming messages ────────────────────────────
    // Each message from the client is a JSON string with a `type` field
    ws.on('message', async (raw) => {
      let msg
      try { msg = JSON.parse(raw) } catch { return }

      // ── Join matchmaking queue ──────────────────────────
      if (msg.type === 'join_queue') {
        const lang = msg.language || 'python'
        player.language = lang

        // Is there already a real player waiting for this language?
        const waiting = queue.get(lang)

        if (waiting && waiting.userId !== player.userId) {
          // Real opponent found — cancel their timers and start immediately
          clearTimeout(waiting.botTimeoutId)
          clearTimeout(waiting.timeoutId)
          queue.delete(lang)
          startDuel(waiting, player, lang)

        } else {
          // No opponent yet — add to queue and set two timers:
          // 1. After BOT_DELAY: match against a bot so they're not waiting forever
          // 2. After QUEUE_TIMEOUT: give up entirely (shouldn't normally fire since bot fires first)
          queue.set(lang, player)
          send(ws, { type: 'queued', message: `Waiting for an opponent in ${lang}...` })

          player.botTimeoutId = setTimeout(() => {
            // Only fire if still in queue (not matched with a real player yet)
            if (queue.get(lang)?.userId === player.userId) {
              send(ws, { type: 'queued', message: 'No players found — matched with a bot!' })
              startBotDuel(player, lang)
            }
          }, BOT_DELAY)

          player.timeoutId = setTimeout(() => {
            if (queue.get(lang)?.userId === player.userId) {
              queue.delete(lang)
              clearTimeout(player.botTimeoutId)
              send(ws, { type: 'queue_cancelled', message: 'No opponents found. Try again later!' })
            }
          }, QUEUE_TIMEOUT)
        }
      }

      // ── Submit code ────────────────────────────────────
      if (msg.type === 'submit') {
        if (!player.duelId) return
        const duel = activeduels.get(player.duelId)
        if (!duel || duel.resolved) return

        // Tell the opponent "they're working on it"
        const opponent = duel.playerA.userId === player.userId ? duel.playerB : duel.playerA
        send(opponent.ws, { type: 'opponent_submitted' })

        // Run the submitted code
        const result = await runCode(msg.code, duel.language)
        const passed = result.success && result.stdout.includes(duel.problem.expected)

        if (passed && !duel.resolved) {
          // This player solved it first — they win!
          duel.resolved = true

          // Update database: record duel winner, update win/loss counts
          try {
            await prisma.duel.create({
              data: {
                challengerId: duel.playerA.userId,
                opponentId:   duel.playerB.userId,
                language:     duel.language,
                status:       'complete',
                winnerId:     player.userId,
                completedAt:  new Date(),
              }
            })
            await prisma.user.update({
              where: { id: player.userId },
              data: { duelsWon: { increment: 1 }, points: { increment: 100 } }
            })
            await prisma.user.update({
              where: { id: opponent.userId },
              data: { duelsLost: { increment: 1 } }
            })
          } catch (err) {
            console.error('Failed to save duel:', err.message)
          }

          // Broadcast result to both players
          send(player.ws,   { type: 'duel_result', winner: player.username, youWon: true,  stdout: result.stdout })
          send(opponent.ws, { type: 'duel_result', winner: player.username, youWon: false, stdout: '' })

          activeduels.delete(player.duelId)
        } else {
          // Code ran but didn't pass — tell them and let them try again
          send(ws, { type: 'submit_result', passed: false, stdout: result.stdout })
        }
      }

      // ── Forfeit ────────────────────────────────────────
      if (msg.type === 'forfeit') {
        if (!player.duelId) return
        const duel = activeduels.get(player.duelId)
        if (!duel || duel.resolved) return

        duel.resolved = true
        const opponent = duel.playerA.userId === player.userId ? duel.playerB : duel.playerA

        send(opponent.ws, { type: 'duel_result', winner: opponent.username, youWon: true,  forfeit: true })
        send(player.ws,   { type: 'duel_result', winner: opponent.username, youWon: false, forfeit: true })

        activeduels.delete(player.duelId)
      }
    })

    // ── Clean up on disconnect ──────────────────────────────
    ws.on('close', () => {
      console.log(`⚔ Duel socket disconnected: ${player?.username}`)
      // Remove from queue if they were waiting and cancel any pending timers
      if (player?.language) {
        const waiting = queue.get(player.language)
        if (waiting?.userId === player.userId) {
          queue.delete(player.language)
          clearTimeout(player.botTimeoutId)
          clearTimeout(player.timeoutId)
        }
      }
      // If they were in a duel, the opponent wins by default
      if (player?.duelId) {
        const duel = activeduels.get(player.duelId)
        if (duel && !duel.resolved) {
          duel.resolved = true
          const opponent = duel.playerA.userId === player.userId ? duel.playerB : duel.playerA
          send(opponent.ws, { type: 'duel_result', winner: opponent.username, youWon: true, disconnect: true })
          activeduels.delete(player.duelId)
        }
      }
    })
  })

  console.log('⚔ Duel WebSocket server attached at /ws/duel')
}
