#!/usr/bin/env bun

import { createBipartiteGraph, HopcroftKarp } from './hopkroft-karp';

// Example usage
console.log("Hopcroft-Karp Algorithm Example");
console.log("===============================");

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
  console.log('\nPerfect matching found!');
  console.log('Left partition:', perfectMatching.matchLeft);
  console.log('Right partition:', perfectMatching.matchRight);
} else {
  console.log('\nNo perfect matching exists.');
}

// Example with no perfect matching
console.log("\nExample with no perfect matching");
console.log("===============================");

const noSolutionGraph = createBipartiteGraph(
  3, 
  3, 
  [
    [0, 0],
    [1, 0],
    [2, 0]
  ]
);

const hk2 = new HopcroftKarp(noSolutionGraph);
const perfectMatching2 = hk2.findPerfectMatching();

if (perfectMatching2) {
  console.log('Perfect matching found (unexpected)!');
} else {
  console.log('No perfect matching exists, as expected.');
}