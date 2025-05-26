/**
 * Hopcroft-Karp algorithm for finding maximum matching in a bipartite graph.
 * Returns a perfect matching if one exists, otherwise returns null.
 */

export interface BipartiteGraph {
  /** Number of nodes in the left partition */
  readonly leftSize: number;
  /** Number of nodes in the right partition */
  readonly rightSize: number;
  /** Adjacency list: edges[u] contains all right nodes connected to left node u */
  readonly edges: readonly (readonly number[])[];
}

export interface Matching {
  /** matchLeft[u] = v means left node u is matched to right node v (-1 if unmatched) */
  readonly matchLeft: readonly number[];
  /** matchRight[v] = u means right node v is matched to left node u (-1 if unmatched) */
  readonly matchRight: readonly number[];
  /** Total number of matched pairs */
  readonly size: number;
}

export class HopcroftKarp {
  private readonly graph: BipartiteGraph;
  private readonly matchLeft: number[];
  private readonly matchRight: number[];
  private readonly dist: number[];
  private static readonly NIL = -1;

  constructor(graph: BipartiteGraph) {
    this.graph = graph;
    this.matchLeft = new Array(graph.leftSize).fill(HopcroftKarp.NIL);
    this.matchRight = new Array(graph.rightSize).fill(HopcroftKarp.NIL);
    this.dist = new Array(graph.leftSize + 1).fill(0);
  }

  /**
   * Finds a maximum matching. Returns perfect matching if one exists, otherwise null.
   */
  findPerfectMatching(): Matching | null {
    const matching = this.findMaximumMatching();
    
    // Check if matching is perfect
    if (matching.size === this.graph.leftSize && 
        matching.size === this.graph.rightSize) {
      return matching;
    }
    
    return null;
  }

  /**
   * Finds maximum matching using Hopcroft-Karp algorithm.
   */
  findMaximumMatching(): Matching {
    let matchingSize = 0;

    while (this.bfs()) {
      for (let u = 0; u < this.graph.leftSize; u++) {
        if (this.matchLeft[u] === HopcroftKarp.NIL && this.dfs(u)) {
          matchingSize++;
        }
      }
    }

    return {
      matchLeft: [...this.matchLeft],
      matchRight: [...this.matchRight],
      size: matchingSize
    } as const;
  }

  /**
   * BFS to find augmenting paths and build level graph.
   */
  private bfs(): boolean {
    const queue: number[] = [];
    
    // Initialize distances
    for (let u = 0; u < this.graph.leftSize; u++) {
      if (this.matchLeft[u] === HopcroftKarp.NIL) {
        this.dist[u] = 0;
        queue.push(u);
      } else {
        this.dist[u] = Infinity;
      }
    }
    this.dist[this.graph.leftSize] = Infinity;

    while (queue.length > 0) {
      // We know queue is not empty from the while condition
      const u = queue.shift() || 0;
      
      if (this.dist[u] < this.dist[this.graph.leftSize]) {
        for (const v of this.graph.edges[u]) {
          // Skip invalid right nodes (should not happen with proper input validation)
          if (v < 0 || v >= this.graph.rightSize) {
            continue;
          }
          
          const matchedU = this.matchRight[v];
          
          if (this.dist[matchedU === HopcroftKarp.NIL ? this.graph.leftSize : matchedU] === Infinity) {
            this.dist[matchedU === HopcroftKarp.NIL ? this.graph.leftSize : matchedU] = this.dist[u] + 1;
            
            if (matchedU !== HopcroftKarp.NIL) {
              queue.push(matchedU);
            }
          }
        }
      }
    }

    return this.dist[this.graph.leftSize] !== Infinity;
  }

  /**
   * DFS to find augmenting path starting from node u.
   */
  private dfs(u: number): boolean {
    if (u === this.graph.leftSize) {
      return true;
    }

    for (const v of this.graph.edges[u]) {
      // Skip invalid right nodes (should not happen with proper input validation)
      if (v < 0 || v >= this.graph.rightSize) {
        continue;
      }
      
      const matchedU = this.matchRight[v];
      const next = matchedU === HopcroftKarp.NIL ? this.graph.leftSize : matchedU;
      
      if (this.dist[next] === this.dist[u] + 1) {
        if (this.dfs(next)) {
          this.matchRight[v] = u;
          this.matchLeft[u] = v;
          return true;
        }
      }
    }

    this.dist[u] = Infinity;
    return false;
  }
}

/**
 * Error thrown when invalid graph input is provided.
 */
export class BipartiteGraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BipartiteGraphError";
  }
}

/**
 * Options for creating a bipartite graph.
 */
export interface BipartiteGraphOptions {
  /** Whether to validate and throw errors for invalid inputs */
  validateInput?: boolean;
  /** Whether to skip invalid edges rather than throw errors */
  skipInvalidEdges?: boolean;
}

/**
 * Helper function to create a bipartite graph from edge list.
 * 
 * @param leftSize Number of nodes in the left partition
 * @param rightSize Number of nodes in the right partition
 * @param edges Array of edges connecting left and right nodes
 * @param options Configuration options
 * @returns A BipartiteGraph object
 * @throws {BipartiteGraphError} If input validation fails and options.skipInvalidEdges is false
 */
export function createBipartiteGraph(
  leftSize: number, 
  rightSize: number, 
  edges: readonly [number, number][],
  options: BipartiteGraphOptions = {}
): BipartiteGraph {
  const { validateInput = true, skipInvalidEdges = true } = options;
  
  // Validate input sizes
  if (validateInput) {
    if (leftSize < 0) {
      throw new BipartiteGraphError(`leftSize must be non-negative, got ${leftSize}`);
    }
    
    if (rightSize < 0) {
      throw new BipartiteGraphError(`rightSize must be non-negative, got ${rightSize}`);
    }
  }
  
  const adjacencyList: number[][] = Array.from(
    { length: leftSize }, 
    () => []
  );
  
  for (const [u, v] of edges) {
    // Check for invalid edges
    if (u < 0 || u >= leftSize || v < 0 || v >= rightSize) {
      if (validateInput && !skipInvalidEdges) {
        throw new BipartiteGraphError(
          `Invalid edge [${u}, ${v}]: indices must be within ranges [0, ${leftSize-1}] and [0, ${rightSize-1}]`
        );
      }
      continue; // Skip invalid edges if skipInvalidEdges is true
    }
    
    // Add edge from left node u to right node v
    adjacencyList[u].push(v);
  }
  
  return {
    leftSize,
    rightSize,
    edges: adjacencyList
  };
}

