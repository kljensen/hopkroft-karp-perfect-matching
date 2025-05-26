# Hopcroft-Karp Perfect Matching

![Tests](https://github.com/kljensen/hopkroft-karp-perfect-matching/actions/workflows/test.yml/badge.svg)
![TypeScript](https://github.com/kljensen/hopkroft-karp-perfect-matching/actions/workflows/typecheck.yml/badge.svg)
![Lint](https://github.com/kljensen/hopkroft-karp-perfect-matching/actions/workflows/lint.yml/badge.svg)

A TypeScript implementation of the Hopcroft-Karp algorithm for finding maximum bipartite matchings, with special focus on perfect matchings.

## Features

- Finds maximum matchings in bipartite graphs
- Determines if a perfect matching exists
- Handles various edge cases (empty graphs, isolated vertices, etc.)
- Written in TypeScript with full type safety
- Comprehensive test suite
- Robust error handling

## Installation

```bash
bun install
```

## Usage

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

## API

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

## Running Tests

```bash
bun test
```

## Contributing

Contributions are welcome! Please make sure to run tests and linting before submitting a PR.

```bash
# Run tests
bun test

# Run linting
bun run lint

# Run type checking
bun run typecheck
```

## License

MIT

This project was created using Bun.