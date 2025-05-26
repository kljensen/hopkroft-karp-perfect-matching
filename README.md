# 🧩 Hopcroft-Karp Perfect Matching

![Tests](https://github.com/kljensen/hopkroft-karp-perfect-matching/actions/workflows/test.yml/badge.svg)
![TypeScript](https://github.com/kljensen/hopkroft-karp-perfect-matching/actions/workflows/typecheck.yml/badge.svg)
![Lint](https://github.com/kljensen/hopkroft-karp-perfect-matching/actions/workflows/lint.yml/badge.svg)
[![Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Bun](https://img.shields.io/badge/Bun-1.0+-yellow)

A TypeScript implementation of the [Hopcroft-Karp algorithm](https://en.wikipedia.org/wiki/Hopcroft%E2%80%93Karp_algorithm) for finding maximum bipartite matchings, with special focus on perfect matchings in [bipartite graphs](https://en.wikipedia.org/wiki/Bipartite_graph).

## 📋 Features

- ✅ Finds maximum matchings in bipartite graphs
- ✅ Determines if a perfect matching exists
- ✅ Handles various edge cases (empty graphs, isolated vertices, etc.)
- ✅ Written in TypeScript with full type safety
- ✅ Comprehensive test suite
- ✅ Robust error handling

## 🚀 Installation

```bash
# Using Bun (recommended)
bun install

# Using npm
npm install

# Using yarn
yarn install
```

## 🔍 Algorithm Overview

The Hopcroft-Karp algorithm finds a maximum matching in a bipartite graph with time complexity O(E√V), where E is the number of edges and V is the number of vertices. This is more efficient than the traditional augmenting path algorithms which run in O(VE) time.

Key concepts:
- **Bipartite Graph**: A graph whose vertices can be divided into two disjoint sets such that every edge connects a vertex in the first set to one in the second set.
- **Matching**: A set of edges without common vertices.
- **Maximum Matching**: A matching with the largest possible number of edges.
- **Perfect Matching**: A matching that covers all vertices in the graph (only possible when both partitions have the same size).

## 📊 Usage

```typescript
import { createBipartiteGraph, HopcroftKarp } from './hopkroft-karp';

// Create a bipartite graph
const graph = createBipartiteGraph(
  3, // leftSize - number of nodes in the left partition
  3, // rightSize - number of nodes in the right partition
  [
    [0, 0], [0, 1], // Edges from left node 0 to right nodes 0 and 1
    [1, 1], [1, 2], // Edges from left node 1 to right nodes 1 and 2
    [2, 0], [2, 2]  // Edges from left node 2 to right nodes 0 and 2
  ]
);

// Create a Hopcroft-Karp instance
const hk = new HopcroftKarp(graph);

// Find a maximum matching
const maximumMatching = hk.findMaximumMatching();
console.log('Maximum matching size:', maximumMatching.size);
console.log('Left matches:', maximumMatching.matchLeft);
console.log('Right matches:', maximumMatching.matchRight);

// Try to find a perfect matching (returns null if none exists)
const perfectMatching = hk.findPerfectMatching();
if (perfectMatching) {
  console.log('Perfect matching found!');
} else {
  console.log('No perfect matching exists.');
}
```

## 📘 API

### `createBipartiteGraph(leftSize, rightSize, edges, options?)`

Creates a bipartite graph representation.

- **leftSize**: Number of nodes in the left partition
- **rightSize**: Number of nodes in the right partition
- **edges**: Array of `[leftNode, rightNode]` pairs representing edges
- **options** (optional):
  - **validateInput**: Whether to validate input (default: `true`)
  - **skipInvalidEdges**: Whether to skip invalid edges instead of throwing (default: `true`)

### `class HopcroftKarp`

- **constructor(graph)**: Creates a new instance with the given bipartite graph
- **findMaximumMatching()**: Finds a maximum matching in the graph
- **findPerfectMatching()**: Finds a perfect matching if one exists, otherwise returns `null`

## ⚙️ Development

```bash
# Run tests
bun test

# Run linting
bun run lint

# Run type checking
bun run typecheck

# Run example
bun start
```

## 🔄 Algorithm Visualization

<details>
<summary>Click to expand</summary>

```
Given bipartite graph G = (U, V, E):

1. Initialize empty matching M
2. Repeat until no augmenting path is found:
   a. Use BFS to find the shortest augmenting path P
   b. If no augmenting path exists, return M as the maximum matching
   c. Find a maximal set of disjoint augmenting paths P1, P2, ..., Pk
   d. Augment M using all paths in the set (M = M ⊕ (P1 ∪ P2 ∪ ... ∪ Pk))
3. Return M as the maximum matching

* Augmenting path: A path that starts and ends with unmatched vertices and alternates
  between edges in the matching and edges not in the matching.
* Augmentation: The symmetric difference between the current matching and an augmenting path,
  which increases the size of the matching by 1.
```

</details>

## 📚 Applications

Bipartite matching has numerous applications, including:

- 👔 Assignment problems (assigning workers to jobs)
- 🎓 University admission matching
- 🏥 Organ donor matching
- 🧠 Network flow problems
- 🔍 Pattern matching in images
- 🗄️ Database record deduplication

## 📜 License

This project is released into the public domain under the [Unlicense](http://unlicense.org/):

```
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
```

## 📝 References

- [Hopcroft-Karp Algorithm (Wikipedia)](https://en.wikipedia.org/wiki/Hopcroft%E2%80%93Karp_algorithm)
- [Bipartite Graph (Wikipedia)](https://en.wikipedia.org/wiki/Bipartite_graph)
- [Matching (Graph Theory) (Wikipedia)](https://en.wikipedia.org/wiki/Matching_(graph_theory))
- [Maximum Matching (Wikipedia)](https://en.wikipedia.org/wiki/Maximum_cardinality_matching)
- Original paper: Hopcroft, J. E.; Karp, R. M. (1973), "An n^5/2 Algorithm for Maximum Matchings in Bipartite Graphs", SIAM Journal on Computing, 2 (4): 225–231, doi:10.1137/0202019

---

Built with ❤️ using [TypeScript](https://www.typescriptlang.org/) and [Bun](https://bun.sh)