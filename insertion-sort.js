// ========== INSERTION SORT VISUALIZER ==========

class InsertionSort {
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
      highlights: { comparing: [], swapping: [], sorted: [0], key: -1 },
      description: 'Initial array. First element is considered sorted. Insertion Sort inserts each element into its correct position.',
      lineNumber: 0,
      stats: { comparisons: 0, swaps: 0, accesses: 0 }
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;
      this.accesses++;

      // Show key selection
      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [],
          swapping: [],
          sorted: this.getSortedIndices(i),
          key: i
        },
        description: `Pass ${i}: Key element is ${key} at index ${i}. Will insert into sorted portion [0..${i - 1}]`,
        lineNumber: 1,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });

      // Compare and shift
      while (j >= 0) {
        this.comparisons++;
        this.accesses++;

        // Show comparison
        this.steps.push({
          array: [...arr],
          highlights: {
            comparing: [j],
            swapping: [],
            sorted: this.getSortedIndices(i),
            key: i
          },
          description: `Comparing key ${key} with ${arr[j]} at index ${j}`,
          lineNumber: 2,
          stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
        });

        if (arr[j] > key) {
          // Shift element to the right
          arr[j + 1] = arr[j];
          this.swaps++;
          this.accesses++;

          this.steps.push({
            array: [...arr],
            highlights: {
              comparing: [],
              swapping: [j, j + 1],
              sorted: this.getSortedIndices(i),
              key: -1
            },
            description: `${arr[j]} > ${key}, shifting ${arr[j]} from index ${j} to ${j + 1}`,
            lineNumber: 3,
            stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
          });

          j--;
        } else {
          // Found correct position
          this.steps.push({
            array: [...arr],
            highlights: {
              comparing: [],
              swapping: [],
              sorted: this.getSortedIndices(i),
              key: -1
            },
            description: `${arr[j]} <= ${key}, found insertion point after index ${j}`,
            lineNumber: 2,
            stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
          });
          break;
        }
      }

      // Insert key at correct position
      arr[j + 1] = key;
      this.accesses++;

      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [],
          swapping: [],
          sorted: this.getSortedIndices(i + 1),
          key: j + 1,
          inserted: j + 1
        },
        description: `Inserted ${key} at index ${j + 1}. Sorted portion is now [0..${i}]`,
        lineNumber: 4,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });
    }

    // Final step - all sorted
    this.steps.push({
      array: [...arr],
      highlights: {
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, i) => i),
        key: -1
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
    }
    if (highlights.swapping && highlights.swapping.includes(index)) {
      color = '#dc3545'; // red
    }
    if (highlights.key === index) {
      color = '#6f42c1'; // purple for key
    }
    if (highlights.comparing && highlights.comparing.includes(index)) {
      color = '#ffc107'; // yellow
    }
    if (highlights.inserted === index) {
      color = '#198754'; // green for inserted
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
    
    // Draw KEY label
    if (highlights.key === index) {
      ctx.fillStyle = '#6f42c1';
      ctx.font = 'bold 11px Arial';
      ctx.fillText('KEY', x + barWidth / 2, y - 22);
    }
  });
}

// Load pseudocode
function loadPseudocode() {
  const code = `for i = 1 to n-1:
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key
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
  const insertionSort = new InsertionSort(array);
  const steps = insertionSort.generateSteps();
  
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
