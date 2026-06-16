// ========== GRAPH RENDERER ==========
// Shared graph drawing utilities for BFS, DFS, Dijkstra

// Predefined graph layouts
const SAMPLE_GRAPHS = {
  simple: {
    nodes: [
      { id: 'A', x: 100, y: 150 },
      { id: 'B', x: 250, y: 80 },
      { id: 'C', x: 250, y: 220 },
      { id: 'D', x: 400, y: 150 }
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' }
    ]
  },
  tree: {
    nodes: [
      { id: 'A', x: 250, y: 50 },
      { id: 'B', x: 150, y: 130 },
      { id: 'C', x: 350, y: 130 },
      { id: 'D', x: 100, y: 210 },
      { id: 'E', x: 200, y: 210 },
      { id: 'F', x: 300, y: 210 },
      { id: 'G', x: 400, y: 210 }
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'B', to: 'E' },
      { from: 'C', to: 'F' },
      { from: 'C', to: 'G' }
    ]
  },
  complex: {
    nodes: [
      { id: 'A', x: 80, y: 150 },
      { id: 'B', x: 200, y: 60 },
      { id: 'C', x: 200, y: 240 },
      { id: 'D', x: 320, y: 150 },
      { id: 'E', x: 440, y: 60 },
      { id: 'F', x: 440, y: 240 }
    ],
    edges: [
      { from: 'A', to: 'B' },
      { from: 'A', to: 'C' },
      { from: 'B', to: 'C' },
      { from: 'B', to: 'D' },
      { from: 'C', to: 'D' },
      { from: 'D', to: 'E' },
      { from: 'D', to: 'F' },
      { from: 'E', to: 'F' }
    ]
  },
  weighted: {
    nodes: [
      { id: 'A', x: 80, y: 150 },
      { id: 'B', x: 200, y: 60 },
      { id: 'C', x: 200, y: 240 },
      { id: 'D', x: 320, y: 150 },
      { id: 'E', x: 440, y: 60 },
      { id: 'F', x: 440, y: 240 }
    ],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'D', to: 'E', weight: 6 },
      { from: 'D', to: 'F', weight: 2 },
      { from: 'E', to: 'F', weight: 3 }
    ]
  }
};

// Graph class
class Graph {
  constructor(graphData) {
    this.nodes = graphData.nodes.map(n => ({ ...n }));
    this.edges = graphData.edges.map(e => ({ ...e }));
    this.adjacencyList = this.buildAdjacencyList();
  }

  buildAdjacencyList() {
    const adj = {};
    this.nodes.forEach(node => {
      adj[node.id] = [];
    });
    this.edges.forEach(edge => {
      adj[edge.from].push({ node: edge.to, weight: edge.weight || 1 });
      adj[edge.to].push({ node: edge.from, weight: edge.weight || 1 }); // undirected
    });
    return adj;
  }

  getNeighbors(nodeId) {
    return this.adjacencyList[nodeId] || [];
  }

  getNode(nodeId) {
    return this.nodes.find(n => n.id === nodeId);
  }

  getEdge(from, to) {
    return this.edges.find(e => 
      (e.from === from && e.to === to) || (e.from === to && e.to === from)
    );
  }
}

// Graph renderer using Canvas
class GraphRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodeRadius = 25;
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  resize() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth - 40;
    this.canvas.height = 300;
    
    // Calculate scale to fit graph
    this.scale = Math.min(this.canvas.width / 520, this.canvas.height / 280);
    this.offsetX = (this.canvas.width - 520 * this.scale) / 2;
    this.offsetY = (this.canvas.height - 280 * this.scale) / 2;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  transformX(x) {
    return x * this.scale + this.offsetX;
  }

  transformY(y) {
    return y * this.scale + this.offsetY;
  }

  drawGraph(graph, highlights = {}) {
    this.clear();
    
    // Draw edges first
    graph.edges.forEach(edge => {
      this.drawEdge(graph, edge, highlights);
    });
    
    // Draw nodes on top
    graph.nodes.forEach(node => {
      this.drawNode(node, highlights);
    });
  }

  drawEdge(graph, edge, highlights) {
    const fromNode = graph.getNode(edge.from);
    const toNode = graph.getNode(edge.to);
    
    if (!fromNode || !toNode) return;

    const x1 = this.transformX(fromNode.x);
    const y1 = this.transformY(fromNode.y);
    const x2 = this.transformX(toNode.x);
    const y2 = this.transformY(toNode.y);

    // Determine edge color
    let color = '#adb5bd';
    let lineWidth = 2;
    
    if (highlights.pathEdges && this.isEdgeInPath(edge, highlights.pathEdges)) {
      color = '#198754';
      lineWidth = 4;
    } else if (highlights.currentEdge && 
               ((highlights.currentEdge.from === edge.from && highlights.currentEdge.to === edge.to) ||
                (highlights.currentEdge.from === edge.to && highlights.currentEdge.to === edge.from))) {
      color = '#0d6efd';
      lineWidth = 4;
    }

    // Draw edge line
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();

    // Draw weight if exists
    if (edge.weight !== undefined) {
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      
      // Background for weight
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(midX, midY, 12, 0, 2 * Math.PI);
      this.ctx.fill();
      this.ctx.strokeStyle = '#6c757d';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      
      // Weight text
      this.ctx.fillStyle = '#212529';
      this.ctx.font = 'bold 12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(edge.weight, midX, midY);
    }
  }

  isEdgeInPath(edge, pathEdges) {
    return pathEdges.some(pe => 
      (pe.from === edge.from && pe.to === edge.to) ||
      (pe.from === edge.to && pe.to === edge.from)
    );
  }

  drawNode(node, highlights) {
    const x = this.transformX(node.x);
    const y = this.transformY(node.y);
    const r = this.nodeRadius * this.scale;

    // Determine node color
    let fillColor = '#fff';
    let strokeColor = '#6c757d';
    let textColor = '#212529';
    
    if (highlights.current === node.id) {
      fillColor = '#0d6efd';
      strokeColor = '#0b5ed7';
      textColor = '#fff';
    } else if (highlights.visiting === node.id) {
      fillColor = '#ffc107';
      strokeColor = '#d39e00';
      textColor = '#212529';
    } else if (highlights.visited && highlights.visited.includes(node.id)) {
      fillColor = '#198754';
      strokeColor = '#146c43';
      textColor = '#fff';
    } else if (highlights.inQueue && highlights.inQueue.includes(node.id)) {
      fillColor = '#e9ecef';
      strokeColor = '#0d6efd';
      textColor = '#212529';
    }

    // Highlight start and end nodes
    if (highlights.start === node.id) {
      strokeColor = '#198754';
    }
    if (highlights.end === node.id) {
      strokeColor = '#dc3545';
    }

    // Draw node circle
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, 0, 2 * Math.PI);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    // Draw node label
    this.ctx.fillStyle = textColor;
    this.ctx.font = `bold ${14 * this.scale}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(node.id, x, y);

    // Draw distance label for Dijkstra
    if (highlights.distances && highlights.distances[node.id] !== undefined) {
      const dist = highlights.distances[node.id];
      const distText = dist === Infinity ? '∞' : dist;
      
      this.ctx.fillStyle = '#212529';
      this.ctx.font = `${11 * this.scale}px Arial`;
      this.ctx.fillText(`d:${distText}`, x, y + r + 15 * this.scale);
    }
  }
}

// Queue/Stack display
function displayQueue(queue, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = queue.length > 0 
    ? queue.map(item => `<span class="badge bg-primary me-1">${item}</span>`).join('')
    : '<span class="text-muted">Empty</span>';
}

function displayStack(stack, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = stack.length > 0 
    ? stack.map(item => `<span class="badge bg-info me-1">${item}</span>`).join('')
    : '<span class="text-muted">Empty</span>';
}

function displayVisited(visited, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = visited.length > 0 
    ? visited.map(item => `<span class="badge bg-success me-1">${item}</span>`).join('')
    : '<span class="text-muted">None</span>';
}
