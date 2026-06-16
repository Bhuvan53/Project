// ========== DFS VISUALIZER ==========

class DFS {
  constructor(graph, startNode) {
    this.graph = graph;
    this.startNode = startNode;
    this.steps = [];
    this.nodesVisited = 0;
    this.edgesExplored = 0;
  }

  generateSteps() {
    this.steps = [];
    this.nodesVisited = 0;
    this.edgesExplored = 0;

    const visited = new Set();
    const stack = [this.startNode];
    const visitedOrder = [];

    // Initial step
    this.steps.push({
      graph: this.graph,
      highlights: {
        current: null,
        visiting: null,
        visited: [],
        inQueue: [this.startNode]
      },
      stack: [...stack],
      visitedOrder: [],
      description: `Starting DFS from node ${this.startNode}. Pushed to stack.`,
      lineNumber: 0,
      stats: { nodesVisited: 0, edgesExplored: 0 }
    });

    while (stack.length > 0) {
      const current = stack.pop();

      if (visited.has(current)) {
        this.steps.push({
          graph: this.graph,
          highlights: {
            current: null,
            visiting: null,
            visited: [...visitedOrder],
            inQueue: [...stack]
          },
          stack: [...stack],
          visitedOrder: [...visitedOrder],
          description: `Popped ${current} from stack, but already visited. Skipping.`,
          lineNumber: 2,
          stats: { nodesVisited: this.nodesVisited, edgesExplored: this.edgesExplored }
        });
        continue;
      }

      visited.add(current);
      visitedOrder.push(current);
      this.nodesVisited++;

      // Show current node being processed
      this.steps.push({
        graph: this.graph,
        highlights: {
          current: current,
          visiting: null,
          visited: [...visitedOrder].slice(0, -1),
          inQueue: [...stack]
        },
        stack: [...stack],
        visitedOrder: [...visitedOrder],
        description: `Popped node ${current} from stack. Visiting...`,
        lineNumber: 1,
        stats: { nodesVisited: this.nodesVisited, edgesExplored: this.edgesExplored }
      });

      // Get neighbors (reverse to maintain order)
      const neighbors = [...this.graph.getNeighbors(current)].reverse();

      for (const neighbor of neighbors) {
        this.edgesExplored++;

        if (!visited.has(neighbor.node)) {
          // Show exploring edge
          this.steps.push({
            graph: this.graph,
            highlights: {
              current: current,
              visiting: neighbor.node,
              visited: [...visitedOrder],
              inQueue: [...stack],
              currentEdge: { from: current, to: neighbor.node }
            },
            stack: [...stack],
            visitedOrder: [...visitedOrder],
            description: `Exploring edge ${current} → ${neighbor.node}`,
            lineNumber: 3,
            stats: { nodesVisited: this.nodesVisited, edgesExplored: this.edgesExplored }
          });

          stack.push(neighbor.node);

          // Show adding to stack
          this.steps.push({
            graph: this.graph,
            highlights: {
              current: current,
              visiting: null,
              visited: [...visitedOrder],
              inQueue: [...stack]
            },
            stack: [...stack],
            visitedOrder: [...visitedOrder],
            description: `Pushed ${neighbor.node} to stack.`,
            lineNumber: 4,
            stats: { nodesVisited: this.nodesVisited, edgesExplored: this.edgesExplored }
          });
        } else {
          // Already visited
          this.steps.push({
            graph: this.graph,
            highlights: {
              current: current,
              visiting: null,
              visited: [...visitedOrder],
              inQueue: [...stack],
              currentEdge: { from: current, to: neighbor.node }
            },
            stack: [...stack],
            visitedOrder: [...visitedOrder],
            description: `Node ${neighbor.node} already visited. Skipping.`,
            lineNumber: 5,
            stats: { nodesVisited: this.nodesVisited, edgesExplored: this.edgesExplored }
          });
        }
      }

      // Mark current as fully processed
      this.steps.push({
        graph: this.graph,
        highlights: {
          current: null,
          visiting: null,
          visited: [...visitedOrder],
          inQueue: [...stack]
        },
        stack: [...stack],
        visitedOrder: [...visitedOrder],
        description: `Finished processing node ${current}.`,
        lineNumber: 1,
        stats: { nodesVisited: this.nodesVisited, edgesExplored: this.edgesExplored }
      });
    }

    // Final step
    this.steps.push({
      graph: this.graph,
      highlights: {
        current: null,
        visiting: null,
        visited: [...visitedOrder],
        inQueue: []
      },
      stack: [],
      visitedOrder: [...visitedOrder],
      description: `DFS complete! Visited ${visitedOrder.length} nodes in order: ${visitedOrder.join(' → ')}`,
      lineNumber: 6,
      stats: { nodesVisited: this.nodesVisited, edgesExplored: this.edgesExplored }
    });

    return this.steps;
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
  const code = `DFS(graph, start):
  stack = [start]
  while stack not empty:
    node = stack.pop()
    if node not visited:
      visit(node)
      for each neighbor:
        stack.push(neighbor)`;
  
  const codeDisplay = document.getElementById('code-display');
  const lines = code.split('\n');
  codeDisplay.innerHTML = lines.map(line => `<div class="line">${line}</div>`).join('');
}

// Update node select options
function updateNodeSelect(graph) {
  const select = document.getElementById('start-node');
  select.innerHTML = '';
  graph.nodes.forEach(node => {
    const option = document.createElement('option');
    option.value = node.id;
    option.textContent = node.id;
    select.appendChild(option);
  });
}

// Render step
function renderStep(step) {
  renderer.drawGraph(step.graph, step.highlights);
  displayStack(step.stack, 'stack-display');
  displayVisited(step.visitedOrder, 'visited-display');
  
  document.getElementById('nodes-visited').textContent = step.stats.nodesVisited;
  document.getElementById('edges-explored').textContent = step.stats.edgesExplored;
}

// Main initialization
let controls = null;

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  loadPseudocode();
  
  // Load initial graph
  currentGraph = new Graph(SAMPLE_GRAPHS.simple);
  updateNodeSelect(currentGraph);
  renderer.drawGraph(currentGraph, {});
  
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
  
  // Graph select change
  document.getElementById('graph-select').addEventListener('change', (e) => {
    const graphType = e.target.value;
    currentGraph = new Graph(SAMPLE_GRAPHS[graphType]);
    updateNodeSelect(currentGraph);
    renderer.drawGraph(currentGraph, {});
    
    // Reset controls
    document.getElementById('play-btn').disabled = true;
    document.getElementById('step-btn').disabled = true;
    document.getElementById('reset-btn').disabled = true;
    document.getElementById('step-description').textContent = 'Select a graph and start node, then click "Start DFS" to begin.';
  });
  
  // Start DFS button
  document.getElementById('start-btn').addEventListener('click', () => {
    const startNode = document.getElementById('start-node').value;
    startVisualization(currentGraph, startNode);
  });
});

function startVisualization(graph, startNode) {
  const dfs = new DFS(graph, startNode);
  const steps = dfs.generateSteps();
  
  animationState.setSteps(steps);
  
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
