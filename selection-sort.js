// ========== SELECTION SORT VISUALIZER ==========

class SelectionSort {
  constructor(array) {
    this.originalArray = [...array];
    this.array = [...array];
    this.steps = [];
    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;
  }

  generateSteps() {
    const arr = [...this.array];
    const n = arr.length;
    this.steps = [];
    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;

    // Initial step
    this.steps.push({
      array: [...arr],
      highlights: { comparing: [], swapping: [], sorted: [], minimum: -1 },
      description: 'Initial array. Selection Sort finds the minimum element and places it at the beginning.',
      lineNumber: 0,
      stats: { comparisons: 0, swaps: 0, accesses: 0 }
    });

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      this.accesses++;

      // Show starting to find minimum
      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [],
          swapping: [],
          sorted: this.getSortedIndices(i),
          minimum: minIndex
        },
        description: `Pass ${i + 1}: Finding minimum element from index ${i} to ${n - 1}. Current minimum: ${arr[minIndex]} at index ${minIndex}`,
        lineNumber: 1,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });

      for (let j = i + 1; j < n; j++) {
        this.comparisons++;
        this.accesses += 2;

        // Show comparison
        this.steps.push({
          array: [...arr],
          highlights: {
            comparing: [j],
            swapping: [],
            sorted: this.getSortedIndices(i),
            minimum: minIndex
          },
          description: `Comparing ${arr[j]} (index ${j}) with current minimum ${arr[minIndex]} (index ${minIndex})`,
          lineNumber: 2,
          stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
        });

        if (arr[j] < arr[minIndex]) {
          minIndex = j;

          // Show new minimum found
          this.steps.push({
            array: [...arr],
            highlights: {
              comparing: [],
              swapping: [],
              sorted: this.getSortedIndices(i),
              minimum: minIndex
            },
            description: `New minimum found: ${arr[minIndex]} at index ${minIndex}`,
            lineNumber: 3,
            stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
          });
        }
      }

      // Swap if needed
      if (minIndex !== i) {
        // Show swap
        this.steps.push({
          array: [...arr],
          highlights: {
            comparing: [],
            swapping: [i, minIndex],
            sorted: this.getSortedIndices(i),
            minimum: -1
          },
          description: `Swapping ${arr[i]} (index ${i}) with minimum ${arr[minIndex]} (index ${minIndex})`,
          lineNumber: 4,
          stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
        });

        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        this.swaps++;
        this.accesses += 2;

        // Show after swap
        this.steps.push({
          array: [...arr],
          highlights: {
            comparing: [],
            swapping: [],
            sorted: this.getSortedIndices(i + 1),
            minimum: -1
          },
          description: `Element ${arr[i]} is now in its correct position at index ${i}`,
          lineNumber: 4,
          stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
        });
      } else {
        // Element already in place
        this.steps.push({
          array: [...arr],
          highlights: {
            comparing: [],
            swapping: [],
            sorted: this.getSortedIndices(i + 1),
            minimum: -1
          },
          description: `Element ${arr[i]} is already in its correct position at index ${i}. No swap needed.`,
          lineNumber: 4,
          stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
        });
      }
    }

    // Final step - all sorted
    this.steps.push({
      array: [...arr],
      highlights: {
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        minimum: -1
      },
      description: 'Array is now fully sorted!',
      lineNumber: 5,
      stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
    });

    return this.steps;
  }

  getSortedIndices(count) {
    const sorted = [];
    for (let i = 0; i < count; i++) {
      sorted.push(i);
    }
    return sorted;
  }
}

// Canvas drawing
let canvas, ctx;

function initCanvas() {
  canvas = document.getElementById('visualizer-canvas');
  ctx = canvas.getContext('2d');
  
  const container = canvas.parentElement;
  canvas.width = container.clientWidth - 40;
  canvas.height = 350;
}

function drawArray(array, highlights = {}) {
  if (!ctx) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const n = array.length;
  const padding = 40;
  const barWidth = Math.min((canvas.width - padding * 2) / n - 4, 60);
  const maxValue = Math.max(...array);
  const maxHeight = canvas.height - 80;
  const startX = (canvas.width - (barWidth + 4) * n) / 2;
  
  array.forEach((value, index) => {
    const barHeight = (value / maxValue) * maxHeight;
    const x = startX + index * (barWidth + 4);
    const y = canvas.height - barHeight - 30;
    
    // Determine color
    let color = '#0d6efd'; // default blue
    if (highlights.sorted && highlights.sorted.includes(index)) {
      color = '#198754'; // green
    } else if (highlights.swapping && highlights.swapping.includes(index)) {
      color = '#dc3545'; // red
    } else if (highlights.minimum === index) {
      color = '#6f42c1'; // purple for minimum
    } else if (highlights.comparing && highlights.comparing.includes(index)) {
      color = '#ffc107'; // yellow
    }
    
    // Draw bar with rounded top
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]);
    ctx.fill();
    
    // Draw value on top
    ctx.fillStyle = '#212529';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(value, x + barWidth / 2, y - 8);
    
    // Draw index below
    ctx.fillStyle = '#6c757d';
    ctx.font = '12px Arial';
    ctx.fillText(index, x + barWidth / 2, canvas.height - 10);
    
    // Draw MIN label
    if (highlights.minimum === index) {
      ctx.fillStyle = '#6f42c1';
      ctx.font = 'bold 11px Arial';
      ctx.fillText('MIN', x + barWidth / 2, y - 22);
    }
  });
}

// Load pseudocode
function loadPseudocode() {
  const code = `for i = 0 to n-1:
  minIndex = i
  for j = i+1 to n-1:
    if arr[j] < arr[minIndex]:
      minIndex = j
  swap(arr[i], arr[minIndex])
// Array is sorted`;
  
  const codeDisplay = document.getElementById('code-display');
  const lines = code.split('\n');
  codeDisplay.innerHTML = lines.map(line => `<div class="line">${line}</div>`).join('');
}

// Main initialization
let controls = null;

document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  loadPseudocode();
  
  window.addEventListener('resize', debounce(() => {
    initCanvas();
    const step = animationState.getCurrentStep();
    if (step) {
      drawArray(step.array, step.highlights);
    }
  }, 250));
  
  document.getElementById('generate-btn').addEventListener('click', () => {
    const array = generateRandomArray(10, 10, 99);
    document.getElementById('input-array').value = array.join(', ');
  });
  
  document.getElementById('start-btn').addEventListener('click', () => {
    const input = document.getElementById('input-array').value;
    const array = parseInputArray(input);
    
    const validation = validateArrayInput(array);
    if (!validation.valid) {
      showAlert(validation.message);
      return;
    }
    
    startVisualization(array);
  });
  
  document.getElementById('generate-btn').click();
});

function startVisualization(array) {
  const selectionSort = new SelectionSort(array);
  const steps = selectionSort.generateSteps();
  
  animationState.setSteps(steps);
  
  document.getElementById('play-btn').disabled = false;
  document.getElementById('step-btn').disabled = false;
  document.getElementById('reset-btn').disabled = false;
  
  const initialStep = animationState.getCurrentStep();
  drawArray(initialStep.array, initialStep.highlights);
  
  controls = new VisualizerControls(animationState, (step) => {
    drawArray(step.array, step.highlights);
  });
  
  controls.updateStepInfo(initialStep);
  controls.updateStepCounter();
}
