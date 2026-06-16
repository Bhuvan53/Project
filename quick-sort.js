// ========== QUICK SORT VISUALIZER ==========

class QuickSort {
  constructor(array) {
    this.originalArray = [...array];
    this.array = [...array];
    this.steps = [];
    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;
    this.sortedIndices = new Set();
  }

  generateSteps() {
    this.steps = [];
    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;
    this.sortedIndices = new Set(); //used to remember which index is sorted even during the recursive call

    // Initial step
    this.steps.push({
      array: [...this.array],
      highlights: { comparing: [], swapping: [], sorted: [], pivot: -1 },
      description: 'Initial array. Quick Sort will select a pivot and partition the array.',
      lineNumber: 0,
      stats: { comparisons: 0, swaps: 0, accesses: 0 }
    });

    const arr = [...this.array];
    this.quickSort(arr, 0, arr.length - 1);  //recursive call
 
    // Final step
    this.steps.push({
      array: [...arr],
      highlights: {
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: arr.length }, (_, i) => i),
        pivot: -1
      },
      description: 'Array is now fully sorted!',
      lineNumber: 6,
      stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
    });

    return this.steps;
  }

  quickSort(arr, low, high) {
    if (low < high) {
      const pivotIndex = this.partition(arr, low, high); //stores the index of the pivot element
      
      // Mark pivot as sorted
      this.sortedIndices.add(pivotIndex); //marking the pivot element as sorted
      
      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [],
          swapping: [],
          sorted: Array.from(this.sortedIndices),
          pivot: -1 //indicates no active pivot element at present 
        },
        description: `Pivot ${arr[pivotIndex]} is now in its correct position at index ${pivotIndex}`,
        lineNumber: 2,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });

      this.quickSort(arr, low, pivotIndex - 1);   //recursive calls
      this.quickSort(arr, pivotIndex + 1, high);  //recursive calls 
    } else if (low === high) {
      // Single element is sorted
      this.sortedIndices.add(low); //handles sub array of size 1
    }
  }

  partition(arr, low, high) {
    const pivot = arr[high];  //pivot element
    this.accesses++;

    // Show pivot selection
    this.steps.push({
      array: [...arr],
      highlights: {
        comparing: [],
        swapping: [],
        sorted: Array.from(this.sortedIndices),
        pivot: high,  
        range: this.getRange(low, high)
      },
      description: `Selecting pivot: ${pivot} (last element at index ${high})`,
      lineNumber: 1,
      stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      this.comparisons++;
      this.accesses++;

      // Show comparison
      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [j],
          swapping: [],
          sorted: Array.from(this.sortedIndices),
          pivot: high,
          pointer: i + 1
        },
        description: `Comparing ${arr[j]} with pivot ${pivot}`,
        lineNumber: 3,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });

      if (arr[j] < pivot) {
        i++;
        
        if (i !== j) { //avoids useless swaps
          // Swap
          [arr[i], arr[j]] = [arr[j], arr[i]];
          this.swaps++;
          this.accesses += 2;

          this.steps.push({
            array: [...arr],
            highlights: {
              comparing: [],
              swapping: [i, j],
              sorted: Array.from(this.sortedIndices),
              pivot: high
            },
            description: `${arr[j]} < ${pivot}, swapping elements at index ${i} and ${j}`,
            lineNumber: 4,
            stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
          });
        } else {
          this.steps.push({
            array: [...arr],
            highlights: {
              comparing: [],
              swapping: [],
              sorted: Array.from(this.sortedIndices),
              pivot: high
            },
            description: `${arr[i]} < ${pivot}, element already in correct position`,
            lineNumber: 4,
            stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
          });
        }
      } else {
        this.steps.push({
          array: [...arr],
          highlights: {
            comparing: [],
            swapping: [],
            sorted: Array.from(this.sortedIndices),
            pivot: high
          },
          description: `${arr[j]} >= ${pivot}, no swap needed`,
          lineNumber: 3,
          stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
        });
      }
    }

    // Place pivot in correct position
    if (i + 1 !== high) {
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      this.swaps++;
      this.accesses += 2;

      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [],
          swapping: [i + 1, high],
          sorted: Array.from(this.sortedIndices),
          pivot: i + 1
        },
        description: `Placing pivot ${pivot} at its correct position (index ${i + 1})`,
        lineNumber: 5,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });
    }

    return i + 1; //returns pivot index
  }

  getRange(start, end) {  //specifies the array being worked
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
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
    } else if (highlights.pivot === index) {
      color = '#6f42c1'; // purple for pivot
    } else if (highlights.swapping && highlights.swapping.includes(index)) {
      color = '#dc3545'; // red
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
    
    // Draw pivot label
    if (highlights.pivot === index) {
      ctx.fillStyle = '#6f42c1';
      ctx.font = 'bold 11px Arial';
      ctx.fillText('PIVOT', x + barWidth / 2, y - 22);
    }
  });
}

// Load pseudocode
function loadPseudocode() {
  const code = `quickSort(arr, low, high):
  if low < high:
    pivot = partition(arr, low, high)
    quickSort(arr, low, pivot-1)
    quickSort(arr, pivot+1, high)
// Partition places pivot correctly
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
  const quickSort = new QuickSort(array);
  const steps = quickSort.generateSteps();
  
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
