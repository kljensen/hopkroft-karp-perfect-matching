import { describe, test, expect } from "bun:test";

// Import the implementation (adjust path as needed)
// Assuming the implementation is in './hopkroft-karp.ts'
import { 
  BipartiteGraph, 
  Matching, 
  HopcroftKarp, 
  createBipartiteGraph, 
  BipartiteGraphError 
} from "./hopkroft-karp";

describe("HopcroftKarp", () => {
  describe("createBipartiteGraph", () => {
    test("creates empty graph correctly", () => {
      const graph = createBipartiteGraph(3, 3, []);
      
      expect(graph.leftSize).toBe(3);
      expect(graph.rightSize).toBe(3);
      expect(graph.edges).toHaveLength(3);
      expect(graph.edges[0]).toEqual([]);
      expect(graph.edges[1]).toEqual([]);
      expect(graph.edges[2]).toEqual([]);
    });

    test("creates graph with edges correctly", () => {
      const edges: [number, number][] = [
        [0, 1], [0, 2],
        [1, 0],
        [2, 1], [2, 2]
      ];
      const graph = createBipartiteGraph(3, 3, edges);
      
      expect(graph.edges[0]).toEqual([1, 2]);
      expect(graph.edges[1]).toEqual([0]);
      expect(graph.edges[2]).toEqual([1, 2]);
    });
  });

  describe("findMaximumMatching", () => {
    test("finds maximum matching in complete bipartite graph", () => {
      const graph = createBipartiteGraph(3, 3, [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1], [1, 2],
        [2, 0], [2, 1], [2, 2]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(3);
      expect(matching.matchLeft).toHaveLength(3);
      expect(matching.matchRight).toHaveLength(3);
      
      // Verify matching is valid
      for (let u = 0; u < 3; u++) {
        const v = matching.matchLeft[u];
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(3);
        expect(matching.matchRight[v]).toBe(u);
      }
    });

    test("finds maximum matching in sparse graph", () => {
      const graph = createBipartiteGraph(4, 4, [
        [0, 0], [0, 1],
        [1, 2],
        [2, 1], [2, 3],
        [3, 3]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      // This graph has a perfect matching of size 4:
      // 0->1, 1->2, 2->3, 3->3 (or similar valid matching)
      expect(matching.size).toBe(4);
    });

    test("handles graph with no edges", () => {
      const graph = createBipartiteGraph(3, 3, []);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(0);
      expect(matching.matchLeft).toEqual([-1, -1, -1]);
      expect(matching.matchRight).toEqual([-1, -1, -1]);
    });

    test("handles graph with isolated vertices", () => {
      const graph = createBipartiteGraph(4, 4, [
        [0, 0],
        [2, 2]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(2);
      expect(matching.matchLeft[0]).toBe(0);
      expect(matching.matchLeft[1]).toBe(-1);
      expect(matching.matchLeft[2]).toBe(2);
      expect(matching.matchLeft[3]).toBe(-1);
    });
  });

  describe("findPerfectMatching", () => {
    test("returns perfect matching when it exists", () => {
      const graph = createBipartiteGraph(3, 3, [
        [0, 0], [0, 1],
        [1, 1], [1, 2],
        [2, 0], [2, 2]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const perfectMatch = hk.findPerfectMatching();
      
      expect(perfectMatch).not.toBeNull();
      expect(perfectMatch!.size).toBe(3);
      
      // Verify all vertices are matched
      for (let i = 0; i < 3; i++) {
        expect(perfectMatch!.matchLeft[i]).not.toBe(-1);
        expect(perfectMatch!.matchRight[i]).not.toBe(-1);
      }
    });

    test("returns null when perfect matching doesn't exist", () => {
      const graph = createBipartiteGraph(3, 3, [
        [0, 0],
        [1, 0],
        [2, 0]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const perfectMatch = hk.findPerfectMatching();
      
      expect(perfectMatch).toBeNull();
    });

    test("returns null for unbalanced bipartite graph", () => {
      const graph = createBipartiteGraph(3, 4, [
        [0, 0], [0, 1],
        [1, 1], [1, 2],
        [2, 2], [2, 3]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const perfectMatch = hk.findPerfectMatching();
      
      expect(perfectMatch).toBeNull();
    });

    test("handles single vertex graphs", () => {
      const graph = createBipartiteGraph(1, 1, [[0, 0]]);
      
      const hk = new HopcroftKarp(graph);
      const perfectMatch = hk.findPerfectMatching();
      
      expect(perfectMatch).not.toBeNull();
      expect(perfectMatch!.size).toBe(1);
      expect(perfectMatch!.matchLeft[0]).toBe(0);
      expect(perfectMatch!.matchRight[0]).toBe(0);
    });
  });

  describe("complex test cases", () => {
    test("handles graph requiring multiple augmenting paths", () => {
      // Graph that requires the algorithm to find multiple augmenting paths
      const graph = createBipartiteGraph(5, 5, [
        [0, 0], [0, 1],
        [1, 1], [1, 2],
        [2, 2], [2, 3],
        [3, 3], [3, 4],
        [4, 0], [4, 4]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(5);
    });

    test("performance test with larger graph", () => {
      const n = 100;
      const edges: [number, number][] = [];
      
      // Create a graph where each left vertex connects to 3 right vertices
      for (let i = 0; i < n; i++) {
        edges.push([i, i]);
        edges.push([i, (i + 1) % n]);
        edges.push([i, (i + 2) % n]);
      }
      
      const graph = createBipartiteGraph(n, n, edges);
      const hk = new HopcroftKarp(graph);
      
      const start = performance.now();
      const matching = hk.findMaximumMatching();
      const end = performance.now();
      
      expect(matching.size).toBe(n);
      expect(end - start).toBeLessThan(100); // Should complete in < 100ms
    });

    test("matching uniqueness - different runs produce valid matchings", () => {
      const graph = createBipartiteGraph(4, 4, [
        [0, 0], [0, 1],
        [1, 1], [1, 2],
        [2, 2], [2, 3],
        [3, 3], [3, 0]
      ]);
      
      const hk1 = new HopcroftKarp(graph);
      const matching1 = hk1.findMaximumMatching();
      
      const hk2 = new HopcroftKarp(graph);
      const matching2 = hk2.findMaximumMatching();
      
      // Both should find maximum matching of size 4
      expect(matching1.size).toBe(4);
      expect(matching2.size).toBe(4);
      
      // Verify both matchings are valid
      for (let i = 0; i < 4; i++) {
        expect(matching1.matchLeft[i]).not.toBe(-1);
        expect(matching2.matchLeft[i]).not.toBe(-1);
      }
    });
  });

  describe("edge cases", () => {
    test("empty graph (0 vertices)", () => {
      const graph = createBipartiteGraph(0, 0, []);
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(0);
      expect(matching.matchLeft).toEqual([]);
      expect(matching.matchRight).toEqual([]);
    });

    test("graph with self-loops handled correctly", () => {
      const graph = createBipartiteGraph(2, 2, [
        [0, 0], [0, 1],
        [1, 0], [1, 1]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(2);
    });

    test("duplicate edges are handled correctly", () => {
      const graph = createBipartiteGraph(2, 2, [
        [0, 0], [0, 0], [0, 1],
        [1, 1], [1, 1]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(2);
      
      // Verify that duplicate edges don't affect the final matching
      // Graph with single occurrence of each edge should have same result
      const graph2 = createBipartiteGraph(2, 2, [
        [0, 0], [0, 1],
        [1, 1]
      ]);
      
      const hk2 = new HopcroftKarp(graph2);
      const matching2 = hk2.findMaximumMatching();
      
      expect(matching2.size).toBe(2);
    });
    
    test("handles parallel edges", () => {
      // Multiple edges between the same vertex pairs (may be redundant in the implementation)
      const graph = createBipartiteGraph(3, 3, [
        [0, 1], [0, 1], [0, 1], // 3 parallel edges from 0 to 1
        [1, 2], [1, 2],         // 2 parallel edges from 1 to 2
        [2, 0]                   // 1 edge from 2 to 0
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(3);
      
      // The matching should use each vertex exactly once
      expect(new Set(matching.matchLeft.filter(x => x !== -1)).size).toBe(3);
    });
  });
  
  describe("input validation", () => {
    test("handles negative indices in edge list with default options", () => {
      // With default options, invalid edges should be skipped
      const edges: [number, number][] = [
        [0, 0], [0, -1], // Negative right index
        [-1, 0]          // Negative left index
      ];
      
      expect(() => {
        createBipartiteGraph(2, 2, edges);
      }).not.toThrow(); // Shouldn't crash with default options
      
      const graph = createBipartiteGraph(2, 2, edges);
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      // Only valid edge should be matched
      expect(matching.matchLeft[0]).toBe(0);
    });
    
    test("throws error for negative indices when skipInvalidEdges is false", () => {
      const edges: [number, number][] = [
        [0, 0], [0, -1] // Negative right index
      ];
      
      expect(() => {
        createBipartiteGraph(2, 2, edges, { skipInvalidEdges: false });
      }).toThrow(BipartiteGraphError);
    });
    
    test("handles out of bounds indices with default options", () => {
      const edges: [number, number][] = [
        [0, 0], [0, 5], // Right index beyond rightSize
        [5, 0]          // Left index beyond leftSize
      ];
      
      expect(() => {
        createBipartiteGraph(3, 3, edges);
      }).not.toThrow(); // Shouldn't crash with default options
      
      const graph = createBipartiteGraph(3, 3, edges);
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      // Only valid edge should be matched
      expect(matching.matchLeft[0]).toBe(0);
    });
    
    test("throws error for out of bounds indices when skipInvalidEdges is false", () => {
      const edges: [number, number][] = [
        [0, 0], [0, 5] // Right index beyond rightSize
      ];
      
      expect(() => {
        createBipartiteGraph(3, 3, edges, { skipInvalidEdges: false });
      }).toThrow(BipartiteGraphError);
    });
    
    test("throws error for negative partition sizes", () => {
      expect(() => {
        createBipartiteGraph(-1, 3, [[0, 0]]);
      }).toThrow(BipartiteGraphError);
      
      expect(() => {
        createBipartiteGraph(3, -1, [[0, 0]]);
      }).toThrow(BipartiteGraphError);
    });
    
    test("validation can be disabled", () => {
      expect(() => {
        createBipartiteGraph(-1, -1, [[0, 0]], { validateInput: false });
      }).not.toThrow();
    });
  });
  
  describe("unbalanced bipartite graphs", () => {
    test("left partition larger than right", () => {
      const graph = createBipartiteGraph(5, 3, [
        [0, 0], [1, 1], [2, 2], [3, 0], [4, 1]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(3); // Can't match more than rightSize
      expect(matching.matchRight).toHaveLength(3);
      expect(matching.matchLeft).toHaveLength(5);
      
      // Check that all right vertices are matched
      for (let i = 0; i < 3; i++) {
        expect(matching.matchRight[i]).not.toBe(-1);
      }
      
      // Check that some left vertices remain unmatched
      expect(matching.matchLeft.filter(x => x === -1).length).toBe(2);
    });
    
    test("right partition larger than left", () => {
      const graph = createBipartiteGraph(3, 5, [
        [0, 0], [0, 3], [1, 1], [1, 4], [2, 2]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(3); // Can't match more than leftSize
      expect(matching.matchLeft).toHaveLength(3);
      expect(matching.matchRight).toHaveLength(5);
      
      // Check that all left vertices are matched
      for (let i = 0; i < 3; i++) {
        expect(matching.matchLeft[i]).not.toBe(-1);
      }
      
      // Check that some right vertices remain unmatched
      expect(matching.matchRight.filter(x => x === -1).length).toBe(2);
    });
  });
  
  describe("graph modification", () => {
    test("behavior when graph is modified after HopcroftKarp instantiation", () => {
      const edges: [number, number][] = [
        [0, 0], [1, 1]
      ];
      
      const graph = createBipartiteGraph(3, 3, edges);
      const hk = new HopcroftKarp(graph);
      
      // Modify the graph after HopcroftKarp is created
      graph.edges[2].push(2); // Add edge from left node 2 to right node 2
      
      const matching = hk.findMaximumMatching();
      
      // Since we added a valid edge, it should find a matching of size 3
      // This tests if the implementation uses the graph reference or makes a copy
      expect(matching.size).toBe(3);
    });
  });
  
  describe("known specific matchings", () => {
    test("verifies exact matching edges for a specific graph", () => {
      const graph = createBipartiteGraph(3, 3, [
        [0, 2],
        [1, 0], [1, 1],
        [2, 0], [2, 1]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(3);
      
      // Verify that the matching is valid
      // All vertices should be matched
      for (let i = 0; i < 3; i++) {
        expect(matching.matchLeft[i]).not.toBe(-1);
        expect(matching.matchRight[i]).not.toBe(-1);
      }
      
      // Verify that the matching is valid by checking that each edge exists in the graph
      for (let u = 0; u < 3; u++) {
        const v = matching.matchLeft[u];
        expect(graph.edges[u].includes(v)).toBe(true);
        expect(matching.matchRight[v]).toBe(u);
      }
      
      // This graph actually has two valid perfect matchings:
      // 1. (0,2), (1,1), (2,0)
      // 2. (0,2), (1,0), (2,1)
      // Check that we got one of these
      const validMatching1 = matching.matchLeft[0] === 2 && matching.matchLeft[1] === 1 && matching.matchLeft[2] === 0;
      const validMatching2 = matching.matchLeft[0] === 2 && matching.matchLeft[1] === 0 && matching.matchLeft[2] === 1;
      expect(validMatching1 || validMatching2).toBe(true);
    });
    
    test("finds one of multiple valid perfect matchings", () => {
      // This graph has multiple valid perfect matchings
      const graph = createBipartiteGraph(3, 3, [
        [0, 0], [0, 1], [0, 2],
        [1, 0], [1, 1],
        [2, 1], [2, 2]
      ]);
      
      const hk = new HopcroftKarp(graph);
      const matching = hk.findMaximumMatching();
      
      expect(matching.size).toBe(3);
      
      // Verify it's one of the valid perfect matchings by checking constraints
      // For this graph, any valid matching must assign vertex 1 from left to either 0 or 1 from right
      expect(matching.matchLeft[1] === 0 || matching.matchLeft[1] === 1).toBe(true);
      
      // Left vertex 2 must be assigned to either right vertex 1 or 2
      expect(matching.matchLeft[2] === 1 || matching.matchLeft[2] === 2).toBe(true);
      
      // Verify all vertices are matched
      for (let i = 0; i < 3; i++) {
        expect(matching.matchLeft[i]).not.toBe(-1);
        expect(matching.matchRight[i]).not.toBe(-1);
      }
    });
  });
  
  describe("extreme graph densities", () => {
    test("very sparse graph", () => {
      // Create a graph with only n edges (minimum for perfect matching)
      const n = 20;
      const edges: [number, number][] = [];
      
      // Create a perfect matching pattern (just diagonal edges)
      for (let i = 0; i < n; i++) {
        edges.push([i, i]);
      }
      
      const graph = createBipartiteGraph(n, n, edges);
      const hk = new HopcroftKarp(graph);
      
      const matching = hk.findMaximumMatching();
      expect(matching.size).toBe(n);
    });
    
    test("very dense graph", () => {
      // Create a complete bipartite graph (n*n edges)
      const n = 20;
      const edges: [number, number][] = [];
      
      // Connect every left vertex to every right vertex
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          edges.push([i, j]);
        }
      }
      
      const graph = createBipartiteGraph(n, n, edges);
      const hk = new HopcroftKarp(graph);
      
      const matching = hk.findMaximumMatching();
      expect(matching.size).toBe(n);
    });
  });
  
  describe("reproducibility", () => {
    test("produces consistent results on multiple runs with same graph", () => {
      const graph = createBipartiteGraph(5, 5, [
        [0, 0], [0, 1],
        [1, 0], [1, 2],
        [2, 2], [2, 3],
        [3, 1], [3, 4],
        [4, 3], [4, 4]
      ]);
      
      // Run the algorithm multiple times on the same graph
      const results: Matching[] = [];
      for (let i = 0; i < 5; i++) {
        const hk = new HopcroftKarp(graph);
        results.push(hk.findMaximumMatching());
      }
      
      // All runs should produce matchings of the same size
      for (const matching of results) {
        expect(matching.size).toBe(5);
      }
      
      // Check if all runs produce the same matching (would be ideal)
      // This may depend on the specific implementation characteristics
      const firstMatching = results[0];
      let allSame = true;
      
      for (let i = 1; i < results.length; i++) {
        const currentMatching = results[i];
        
        for (let j = 0; j < graph.leftSize; j++) {
          if (firstMatching.matchLeft[j] !== currentMatching.matchLeft[j]) {
            allSame = false;
            break;
          }
        }
      }
      
      // Either all matchings are the same, or they're all valid perfect matchings
      if (!allSame) {
        // Verify all matchings are valid
        for (const matching of results) {
          for (let u = 0; u < graph.leftSize; u++) {
            const v = matching.matchLeft[u];
            if (v !== -1) {
              expect(matching.matchRight[v]).toBe(u);
              expect(graph.edges[u].includes(v)).toBe(true);
            }
          }
        }
      }
    });
  });
});

// Run with: bun test hopkroft-karp.test.ts