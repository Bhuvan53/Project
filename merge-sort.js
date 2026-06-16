// ========== MERGE SORT VISUALIZER ==========

class MergeSort {
  constructor(array) {
    this.originalArray = [...array];
    this.array = [...array];
    this.steps = [];
    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;
  }

  generateSteps() {
    this.steps = [];
    this.comparisons = 0;
    this.swaps = 0;
    this.accesses = 0;

    // Initial step
    this.steps.push({
      array: [...this.array],
      highlights: { comparing: [], swapping: [], sorted: [], range: [] },
      description: 'Initial array. Merge Sort will divide the array and merge sorted halves.',
      lineNumber: 0,
      stats: { comparisons: 0, swaps: 0, accesses: 0 }
    });

    const arr = [...this.array]; //copy of the original array 
    this.mergeSort(arr, 0, arr.length - 1); //runs merge sort on the copied array

    // Final step
    this.steps.push({
      array: [...arr],
      highlights: {
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: arr.length }, (_, i) => i),
        range: []
      },
      description: 'Array is now fully sorted!',
      lineNumber: 6,
      stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
    });

    return this.steps;
  }

  mergeSort(arr, left, right) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      // Show division step
      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [],
          swapping: [],
          sorted: [],
          range: this.getRange(left, right), //sub array
          divider: mid //indicates the mid point 
        },
        description: `Dividing array from index ${left} to ${right}. Mid point: ${mid}`,
        lineNumber: 1,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });

      this.mergeSort(arr, left, mid);
      this.mergeSort(arr, mid + 1, right);   //these 3 calls are recursive calls 
      this.merge(arr, left, mid, right);
    }
  }

  merge(arr, left, mid, right) {
    const leftArr = arr.slice(left, mid + 1);         //sorted array
    const rightArr = arr.slice(mid + 1, right + 1);   //sorted array
    
    this.accesses += (right - left + 1);   //to update the accesses

    // Show merge start
    this.steps.push({
      array: [...arr],
      highlights: {
        comparing: [],
        swapping: [],
        sorted: [],
        range: this.getRange(left, right),
        leftRange: this.getRange(left, mid),
        rightRange: this.getRange(mid + 1, right)
      },
      description: `Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`,
      lineNumber: 3,
      stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
    });

    let i = 0, j = 0, k = left; //i = leftArray, j = rightArray k = originalArray

    while (i < leftArr.length && j < rightArr.length) {
      this.comparisons++;
      this.accesses += 2;

      // Show comparison
      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [left + i, mid + 1 + j],
          swapping: [],
          sorted: [],
          range: this.getRange(left, right)
        },
        description: `Comparing ${leftArr[i]} (left) with ${rightArr[j]} (right)`,
        lineNumber: 4,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });

      if (leftArr[i] <= rightArr[j]) {  //updaying the i-array to the original array
        arr[k] = leftArr[i];
        this.swaps++;
        this.accesses++;

        this.steps.push({
          array: [...arr],
          highlights: {
            comparing: [],
            swapping: [k],
            sorted: [],
            range: this.getRange(left, right)
          },
          description: `Placing ${leftArr[i]} at index ${k}`,
          lineNumber: 5,
          stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
        });

        i++;
      } else {
        arr[k] = rightArr[j]; //updating the j-array into the original array
        this.swaps++;
        this.accesses++;

        this.steps.push({
          array: [...arr],
          highlights: {
            comparing: [],
            swapping: [k],
            sorted: [],
            range: this.getRange(left, right)
          },
          description: `Placing ${rightArr[j]} at index ${k}`,
          lineNumber: 5,
          stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
        });

        j++;
      }
      k++;
    }

    // Copy remaining elements
    while (i < leftArr.length) {  //updating the remaining element of i-array into the original array
      arr[k] = leftArr[i];
      this.swaps++;
      this.accesses++;

      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [],
          swapping: [k],
          sorted: [],
          range: this.getRange(left, right)
        },
        description: `Copying remaining element ${leftArr[i]} to index ${k}`,
        lineNumber: 5,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });

      i++;
      k++;
    }

    while (j < rightArr.length) {  //updating the remaining element of j-array into the original array
      arr[k] = rightArr[j];
      this.swaps++;
      this.accesses++;

      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [],
          swapping: [k],
          sorted: [],
          range: this.getRange(left, right)
        },
        description: `Copying remaining element ${rightArr[j]} to index ${k}`,
        lineNumber: 5,
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });

      j++;
      k++;
    }

    // Show merged result
    this.steps.push({
      array: [...arr],  //copy array after merging 
      highlights: {
        comparing: [],
        swapping: [],
        sorted: this.getRange(left, right),
        range: []
      },
      description: `Merged subarray [${left}..${right}] is now sorted locally`,
      lineNumber: 6,
      stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
    });
  }
  //helper method
  getRange(start, end) {
    const range = [];  //stores index 
    for (let i = start; i <= end; i++) {
      range.push(i);  //adding each index into the array
    }
    return range;  //returns back to the caller 
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
    } else if (highlights.comparing && highlights.comparing.includes(index)) {
      color = '#ffc107'; // yellow
    } else if (highlights.range && highlights.range.includes(index)) {
      color = '#6f42c1'; // purple for current range
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
  });
}

// Load pseudocode
function loadPseudocode() {
  const code = `mergeSort(arr, left, right):
  if left < right:
    mid = (left + right) / 2
    mergeSort(arr, left, mid)
    mergeSort(arr, mid+1, right)
    merge(arr, left, mid, right)
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
    const array = generateRandomArray(8, 10, 99);
    document.getElementById('input-array').value = array.join(', ');
  });
  
  document.getElementById('start-btn').addEventListener('click', () => {
    const input = document.getElementById('input-array').value;
    const array = parseInputArray(input);
    
    const validation = validateArrayInput(array, 2, 15);
    if (!validation.valid) {
      showAlert(validation.message);
      return;
    }
    
    startVisualization(array);
  });
  
  document.getElementById('generate-btn').click();
});

function startVisualization(array) {
  const mergeSort = new MergeSort(array);
  const steps = mergeSort.generateSteps();
  
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
