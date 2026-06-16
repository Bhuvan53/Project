// ========== BUBBLE SORT VISUALIZER ==========

class BubbleSort {
  constructor(array) {
    this.originalArray = [...array]; //(...)used to create a copy array
    this.array = [...array]; //same copy array for sorting 
    this.steps = []; //stores steps of the algorithm
    this.comparisons = 0;
    this.swaps = 0;          //constants to track number of comparisons,swaps,accesses
    this.accesses = 0;
  }

  generateSteps() {    //method for generating steps to be used in visualizing
    const arr = [...this.array];  //copy array
    const n = arr.length; //stores size of array
    this.steps = []; //resets the steps array to start as fresh 
    this.comparisons = 0;
    this.swaps = 0;     //similar constants being updated
    this.accesses = 0;

    // Initial step
    //each steps is treated as objects
    this.steps.push({ 
      array: [...arr], //stores the present state of the array 
      highlights: { comparing: [], swapping: [], sorted: [] }, //for visual highlighting 
      description: 'Initial array. Bubble Sort will compare adjacent elements and swap if needed.', //explanation of the steps
      lineNumber: 0, //used to highlight code (pseudocode)
      stats: { comparisons: 0, swaps: 0, accesses: 0 } //used to track/store the steps being performed 
    });
    //heart of the algo
    for (let i = 0; i < n - 1; i++) {
      let swapped = false; //used as flag 
      
      for (let j = 0; j < n - i - 1; j++) {
        // Comparing step
        this.comparisons++; //increasing the no.of comparisons
        this.accesses += 2; //updating the no.of elements being accessed 
        
        this.steps.push({
          array: [...arr],
          highlights: {
            comparing: [j, j + 1],
            swapping: [],
            sorted: this.getSortedIndices(n, i) //marks element that are sorted
          },
          description: `Comparing elements at index ${j} (value: ${arr[j]}) and index ${j + 1} (value: ${arr[j + 1]})`,
          lineNumber: 2,
          stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
        });

        // Swap if needed
        if (arr[j] > arr[j + 1]) {
          // Swap step
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          this.swaps++; //updating the no.of swaps and accesses
          this.accesses += 2;
          swapped = true; //indicates that swapping is done atleast once

          this.steps.push({
            array: [...arr],
            highlights: {
              comparing: [],
              swapping: [j, j + 1],
              sorted: this.getSortedIndices(n, i)
            },
            description: `Swapping ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}`,
            lineNumber: 3,
            stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
          });
        } else {
          this.steps.push({
            array: [...arr],
            highlights: {
              comparing: [],
              swapping: [],
              sorted: this.getSortedIndices(n, i)
            },
            description: `No swap needed. ${arr[j]} <= ${arr[j + 1]}`,
            lineNumber: 2,
            stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
          });
        }
      }

      // Mark element as sorted
      this.steps.push({
        array: [...arr],
        highlights: {
          comparing: [],
          swapping: [],
          sorted: this.getSortedIndices(n, i + 1) //pasing (i+1) to indicate the number of elements sorted
        },
        description: `Pass ${i + 1} complete. Element ${arr[n - i - 1]} is now in its correct position.`,
        lineNumber: 0, //resets the code (pseudocode) 
        stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
      });

      // Optimization: if no swaps, array is sorted as the swap variable is not updated from false to true
      if (!swapped) {
        break;
      }
    }

    // Final step - all sorted
    this.steps.push({  //final steps
      array: [...arr],
      highlights: {
        comparing: [],
        swapping: [],
        sorted: Array.from({ length: n }, (_, i) => i) //indicates every index is sorted(uses mapping with help of array object n)
      },
      description: 'Array is now fully sorted!',
      lineNumber: 4,
      stats: { comparisons: this.comparisons, swaps: this.swaps, accesses: this.accesses }
    });

    return this.steps; //returns all steps untill now (reponds to generateSteps())
  }

  //method to calculate the index which are sorted 
  getSortedIndices(n, passNumber) {
    const sorted = []; //stores index which already sorted 
    for (let i = n - passNumber; i < n; i++) {
      sorted.push(i); //adds each sorted index to list
    }
    return sorted; //returns list of sorted index(responds to highlights-sorted)
  }
}

// Canvas drawing
let canvas, ctx;

function initCanvas() {
  canvas = document.getElementById('visualizer-canvas');
  ctx = canvas.getContext('2d');
  
  const container = canvas.parentElement;
  canvas.width = container.clientWidth - 40; //adding padding so it doesnt touches the edges
  canvas.height = 350;
}

function drawArray(array, highlights = {}) {
  if (!ctx) return; 
  
  ctx.clearRect(0, 0, canvas.width, canvas.height); //clears the canvas
  
  const n = array.length;
  const padding = 40;
  const barWidth = Math.min((canvas.width - padding * 2) / n - 4, 60); //space per bar, space between bar,caps bar width at 60px
  const maxValue = Math.max(...array); //used to find the largest bar in the array
  const maxHeight = canvas.height - 80;
  const startX = (canvas.width - (barWidth + 4) * n) / 2; //total bar width
  //drawing each bar
  array.forEach((value, index) => {
    const barHeight = (value / maxValue) * maxHeight;
    const x = startX + index * (barWidth + 4); //calculated horizontal position
    const y = canvas.height - barHeight - 30;  //calculates vertical position
    
    // Determine color
    let color = '#0d6efd'; // default blue
    if (highlights.sorted && highlights.sorted.includes(index)) {
      color = '#198754'; // green
    } else if (highlights.swapping && highlights.swapping.includes(index)) {
      color = '#dc3545'; // red
    } else if (highlights.comparing && highlights.comparing.includes(index)) {
      color = '#ffc107'; // yellow
    }
    
    // Draw bar with rounded top
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]); //draws a rect with round top
    ctx.fill(); //paints the bar
    
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
  const code = `for i = 0 to n-1:
  for j = 0 to n-i-1:
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])
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
  
  // Window resize handler
  window.addEventListener('resize', debounce(() => { //used to stop the lag 
    initCanvas();
    const step = animationState.getCurrentStep(); //used to get the current step state
    if (step) {
      drawArray(step.array, step.highlights);
    }
  }, 250));
  
  // Generate random array button
  document.getElementById('generate-btn').addEventListener('click', () => {
    const array = generateRandomArray(10, 10, 99);
    document.getElementById('input-array').value = array.join(', ');
  });
  
  // Start visualization button
  document.getElementById('start-btn').addEventListener('click', () => {
    const input = document.getElementById('input-array').value;
    const array = parseInputArray(input);
    
    const validation = validateArrayInput(array);
    if (!validation.valid) { //checks all elements are number or not 
      showAlert(validation.message);
      return;
    }
    
    startVisualization(array);
  });
  
  // Generate initial random array
  document.getElementById('generate-btn').click();
});

function startVisualization(array) {
  const bubbleSort = new BubbleSort(array); //creats new instance 
  const steps = bubbleSort.generateSteps();
  
  animationState.setSteps(steps);
  
  // Enable controls
  document.getElementById('play-btn').disabled = false;
  document.getElementById('step-btn').disabled = false;
  document.getElementById('reset-btn').disabled = false;
  
  // Render initial state
  const initialStep = animationState.getCurrentStep();
  drawArray(initialStep.array, initialStep.highlights);
  
  // Initialize controls
  controls = new VisualizerControls(animationState, (step) => {
    drawArray(step.array, step.highlights);
  });
  
  controls.updateStepInfo(initialStep); //updates info like description,swapping,accesses etc 
  controls.updateStepCounter(); //updates the step count 
} 
