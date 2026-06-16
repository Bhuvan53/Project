// ========== DIJKSTRA'S ALGORITHM VISUALIZER ==========

class Dijkstra {
  constructor(graph, startNode, endNode) {
    this.graph = graph;
    this.startNode = startNode;
    this.endNode = endNode;
    this.steps = [];
    this.nodesProcessed = 0;
    this.relaxations = 0;
  }

  generateSteps() {
    this.steps = [];
    this.nodesProcessed = 0;
    this.relaxations = 0;

    const distances = {};
    const previous = {};
    const visited = new Set();
    const unvisited = new Set();

    // Initialize distances
    this.graph.nodes.forEach(node => {
      distances[node.id] = node.id === this.startNode ? 0 : Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    // Initial step
    this.steps.push({
      graph: this.graph,
      highlights: {
        current: null,
        visiting: null,
        visited: [],
        distances: { ...distances },
        start: this.startNode,
        end: this.endNode
      },
      distances: { ...distances },
      previous: { ...previous },
      description: `Initialized. Source: ${this.startNode}, Target: ${this.endNode}. All distances set to ∞ except source (0).`,
      lineNumber: 0,
      stats: { nodesProcessed: 0, relaxations: 0 }
    });

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let minNode = null;
      let minDist = Infinity;
      
      for (const node of unvisited) {
        if (distances[node] < minDist) {
          minDist = distances[node];
          minNode = node;
        }
      }

      if (minNode === null || distances[minNode] === Infinity) {
        break; // No reachable nodes left
      }

      // Show selecting minimum node
      this.steps.push({
        graph: this.graph,
        highlights: {
          current: minNode,
          visiting: null,
          visited: Array.from(visited),
          distances: { ...distances },
          start: this.startNode,
          end: this.endNode
        },
        distances: { ...distances },
        previous: { ...previous },
        description: `Selected node ${minNode} with minimum distance ${distances[minNode]}.`,
        lineNumber: 1,
        stats: { nodesProcessed: this.nodesProcessed, relaxations: this.relaxations }
      });

      unvisited.delete(minNode);
      visited.add(minNode);
      this.nodesProcessed++;

      // Check if we reached the target
      if (minNode === this.endNode) {
        // Build path
        const path = this.buildPath(previous, this.endNode);
        const pathEdges = this.buildPathEdges(path);

        this.steps.push({
          graph: this.graph,
          highlights: {
            current: null,
            visiting: null,
            visited: Array.from(visited),
            distances: { ...distances },
            start: this.startNode,
            end: this.endNode,
            pathEdges: pathEdges
          },
          distances: { ...distances },
          previous: { ...previous },
          path: path,
          totalDistance: distances[this.endNode],
          description: `Target ${this.endNode} reached! Shortest path: ${path.join(' → ')} with total distance ${distances[this.endNode]}.`,
          lineNumber: 5,
          stats: { nodesProcessed: this.nodesProcessed, relaxations: this.relaxations }
        });

        return this.steps;
      }

      // Relax neighbors
      const neighbors = this.graph.getNeighbors(minNode);

      for (const neighbor of neighbors) {
        if (visited.has(neighbor.node)) continue;

        const alt = distances[minNode] + neighbor.weight;

        // Show checking neighbor
        this.steps.push({
          graph: this.graph,
          highlights: {
            current: minNode,
            visiting: neighbor.node,
            visited: Array.from(visited),
            distances: { ...distances },
            start: this.startNode,
            end: this.endNode,
            currentEdge: { from: minNode, to: neighbor.node }
          },
          distances: { ...distances },
          previous: { ...previous },
          description: `Checking edge ${minNode} → ${neighbor.node} (weight: ${neighbor.weight}). Current: ${distances[minNode]} + ${neighbor.weight} = ${alt}`,
          lineNumber: 2,
          stats: { nodesProcessed: this.nodesProcessed, relaxations: this.relaxations }
        });

        if (alt < distances[neighbor.node]) {
          distances[neighbor.node] = alt;
          previous[neighbor.node] = minNode;
          this.relaxations++;

          // Show relaxation
          this.steps.push({
            graph: this.graph,
            highlights: {
              current: minNode,
              visiting: neighbor.node,
              visited: Array.from(visited),
              distances: { ...distances },
              start: this.startNode,
              end: this.endNode,
              currentEdge: { from: minNode, to: neighbor.node },
              updated: neighbor.node
            },
            distances: { ...distances },
            previous: { ...previous },
            description: `Updated distance to ${neighbor.node}: ${alt} < ${alt === distances[neighbor.node] ? '∞' : distances[neighbor.node] + neighbor.weight}. New distance: ${alt}, via ${minNode}.`,
            lineNumber: 3,
            stats: { nodesProcessed: this.nodesProcessed, relaxations: this.relaxations }
          });
        } else {
          this.steps.push({
            graph: this.graph,
            highlights: {
              current: minNode,
              visiting: null,
              visited: Array.from(visited),
              distances: { ...distances },
              start: this.startNode,
              end: this.endNode
            },
            distances: { ...distances },
            previous: { ...previous },
            description: `No update needed for ${neighbor.node}. ${alt} >= ${distances[neighbor.node]}.`,
            lineNumber: 4,
            stats: { nodesProcessed: this.nodesProcessed, relaxations: this.relaxations }
          });
        }
      }

      // Mark node as processed
      this.steps.push({
        graph: this.graph,
        highlights: {
          current: null,
          visiting: null,
          visited: Array.from(visited),
          distances: { ...distances },
          start: this.startNode,
          end: this.endNode
        },
        distances: { ...distances },
        previous: { ...previous },
        description: `Finished processing node ${minNode}.`,
        lineNumber: 1,
        stats: { nodesProcessed: this.nodesProcessed, relaxations: this.relaxations }
      });
    }

    // No path found
    this.steps.push({
      graph: this.graph,
      highlights: {
        current: null,
        visiting: null,
        visited: Array.from(visited),
        distances: { ...distances },
        start: this.startNode,
        end: this.endNode
      },
      distances: { ...distances },
      previous: { ...previous },
      path: null,
      description: `No path found from ${this.startNode} to ${this.endNode}.`,
      lineNumber: 5,
      stats: { nodesProcessed: this.nodesProcessed, relaxations: this.relaxations }
    });

    return this.steps;
  }

  buildPath(previous, endNode) {
    const path = [];
    let current = endNode;
    
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    return path;
  }

  buildPathEdges(path) {
    const edges = [];
    for (let i = 0; i < path.length - 1; i++) {
      edges.push({ from: path[i], to: path[i + 1] });
    }
    return edges;
  }
}

// Initialize renderer
let renderer;
let currentGraph;

function initCanvas() {
  renderer = new GraphRenderer('graph-canvas');
  renderer.resize();
}

// Load pseudocode
function loadPseudocode() {
  const code = `Dijkstra(graph, source, target):
  dist[source] = 0
  while unvisited not empty:
    u = node with min dist
    for each neighbor v:
      alt = dist[u] + weight(u,v)
      if alt < dist[v]:
        dist[v] = alt
  return dist, path`;
  
  const codeDisplay = document.getElementById('code-display');
  const lines = code.split('\n');
  codeDisplay.innerHTML = lines.map(line => `<div class="line">${line}</div>`).join('');
}

// Update node select options
function updateNodeSelect(graph) {
  const startSelect = document.getElementById('start-node');
  const endSelect = document.getElementById('end-node');
  
  startSelect.innerHTML = '';
  endSelect.innerHTML = '';
  
  graph.nodes.forEach(node => {
    const option1 = document.createElement('option');
    option1.value = node.id;
    option1.textContent = node.id;
    startSelect.appendChild(option1);
    
    const option2 = document.createElement('option');
    option2.value = node.id;
    option2.textContent = node.id;
    endSelect.appendChild(option2);
  });
  
  // Set default end node to last node
  if (graph.nodes.length > 1) {
    endSelect.value = graph.nodes[graph.nodes.length - 1].id;
  }
}

// Update distance table
function updateDistanceTable(distances, previous) {
  const tbody = document.getElementById('distance-tbody');
  tbody.innerHTML = '';
  
  Object.keys(distances).sort().forEach(node => {
    const row = document.createElement('tr');
    const dist = distances[node] === Infinity ? '∞' : distances[node];
    const prev = previous[node] || '-';
    
    row.innerHTML = `
      <td>${node}</td>
      <td>${dist}</td>
      <td>${prev}</td>
    `;
    tbody.appendChild(row);
  });
}

// Render step
function renderStep(step) {
  renderer.drawGraph(step.graph, step.highlights);
  updateDistanceTable(step.distances, step.previous);
  
  document.getElementById('nodes-visited').textContent = step.stats.nodesProcessed;
  document.getElementById('relaxations').textContent = step.stats.relaxations;
  
  // Show path result if available
  const pathResult = document.getElementById('path-result');
  if (step.path) {
    pathResult.style.display = 'block';
    document.getElementById('shortest-path').textContent = step.path.join(' → ');
    document.getElementById('total-distance').textContent = step.totalDistance;
  } else if (step.path === null) {
    pathResult.style.display = 'block';
    document.getElementById('shortest-path').textContent = 'No path exists';
    document.getElementById('total-distance').textContent = '-';
  } else {
    pathResult.style.display = 'none';
  }
}

// Main initialization
let controls = null;

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  loadPseudocode();
  
  // Load initial graph (weighted)
  currentGraph = new Graph(SAMPLE_GRAPHS.weighted);
  updateNodeSelect(currentGraph);
  renderer.drawGraph(currentGraph, {});
  
  // Initialize distance table
  const distances = {};
  const previous = {};
  currentGraph.nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });
  updateDistanceTable(distances, previous);
  
  // Window resize handler
  window.addEventListener('resize', debounce(() => {
    renderer.resize();
    const step = animationState.getCurrentStep();
    if (step) {
      renderer.drawGraph(step.graph, step.highlights);
    } else {
      renderer.drawGraph(currentGraph, {});
    }
  }, 250));
  
  // Start Dijkstra button
  document.getElementById('start-btn').addEventListener('click', () => {
    const startNode = document.getElementById('start-node').value;
    const endNode = document.getElementById('end-node').value;
    
    if (startNode === endNode) {
      showAlert('Source and target nodes must be different.');
      return;
    }
    
    startVisualization(currentGraph, startNode, endNode);
  });
});

function startVisualization(graph, startNode, endNode) {
  const dijkstra = new Dijkstra(graph, startNode, endNode);
  const steps = dijkstra.generateSteps();
  
  animationState.setSteps(steps);
  
  // Hide path result
  document.getElementById('path-result').style.display = 'none';
  
  // Enable controls
  document.getElementById('play-btn').disabled = false;
  document.getElementById('step-btn').disabled = false;
  document.getElementById('reset-btn').disabled = false;
  
  // Render initial state
  const initialStep = animationState.getCurrentStep();
  renderStep(initialStep);
  
  // Initialize controls
  controls = new VisualizerControls(animationState, renderStep);
  
  controls.updateStepInfo(initialStep);
  controls.updateStepCounter();
}
