// ========== LINEAR SEARCH VISUALIZER ==========

class LinearSearch {
  constructor(array, target) {
    this.array = [...array];
    this.target = target;
    this.steps = [];
    this.comparisons = 0;
    this.accesses = 0;
  }

  generateSteps() {
    this.steps = [];
    this.comparisons = 0;
    this.accesses = 0;

    // Initial step
    this.steps.push({
      array: [...this.array],
      target: this.target,
      highlights: { current: -1, found: -1, checked: [] },
      description: `Searching for ${this.target} in the array. Will check each element sequentially.`,
      lineNumber: 0,
      stats: { comparisons: 0, accesses: 0 }
    });

    const checked = [];

    for (let i = 0; i < this.array.length; i++) {
      this.accesses++;
      this.comparisons++;
      
      // Show current element being checked
      this.steps.push({
        array: [...this.array],
        target: this.target,
        highlights: { current: i, found: -1, checked: [...checked] },
        description: `Checking index ${i}: Is ${this.array[i]} equal to ${this.target}?`,
        lineNumber: 1,
        stats: { comparisons: this.comparisons, accesses: this.accesses }
      });

      if (this.array[i] === this.target) {
        // Found
        this.steps.push({
          array: [...this.array],
          target: this.target,
          highlights: { current: -1, found: i, checked: [...checked] },
          description: `Found! ${this.target} is at index ${i}.`,
          lineNumber: 2,
          stats: { comparisons: this.comparisons, accesses: this.accesses }
        });
        return this.steps;
      } else {
        // Not found at this index
        checked.push(i);
        this.steps.push({
          array: [...this.array],
          target: this.target,
          highlights: { current: -1, found: -1, checked: [...checked] },
          description: `${this.array[i]} ≠ ${this.target}. Moving to next element.`,
          lineNumber: 3,
          stats: { comparisons: this.comparisons, accesses: this.accesses }
        });
      }
    }

    // Not found in array
    this.steps.push({
      array: [...this.array],
      target: this.target,
      highlights: { current: -1, found: -1, checked: [...checked], notFound: true },
      description: `${this.target} not found in the array. Searched all ${this.array.length} elements.`,
      lineNumber: 4,
      stats: { comparisons: this.comparisons, accesses: this.accesses }
    });

    return this.steps;
  }
}

// Draw array as boxes
function drawArray(array, target, highlights = {}) {
  const container = document.getElementById('array-display');
  container.innerHTML = '';
  
  document.getElementById('target-value').textContent = target;
  
  array.forEach((value, index) => {
    const box = document.createElement('div');
    box.className = 'array-box';
    
    // Apply highlighting
    if (highlights.found === index) {
      box.classList.add('found');
    } else if (highlights.current === index) {
      box.classList.add('current');
    } else if (highlights.checked && highlights.checked.includes(index)) {
      box.classList.add('eliminated');
    }
    
    if (highlights.notFound) {
      box.classList.add('not-found');
    }
    
    box.innerHTML = `
      <span>${value}</span>
      <span class="array-box-index">${index}</span>
    `;
    
    container.appendChild(box);
  });
}

// Load pseudocode
function loadPseudocode() {
  const code = `linearSearch(arr, target):
  for i = 0 to n-1:
    if arr[i] == target:
      return i
  return -1 // not found`;
  
  const codeDisplay = document.getElementById('code-display');
  const lines = code.split('\n');
  codeDisplay.innerHTML = lines.map(line => `<div class="line">${line}</div>`).join('');
}

// Update stats display
function updateStats(stats) {
  if (!stats) return;
  document.getElementById('comparisons').textContent = stats.comparisons;
  document.getElementById('accesses').textContent = stats.accesses;
}

// Main initialization
let controls = null;

document.addEventListener('DOMContentLoaded', () => {
  loadPseudocode();
  
  // Generate random array button
  document.getElementById('generate-btn').addEventListener('click', () => {
    const array = generateRandomArray(10, 10, 99);
    document.getElementById('input-array').value = array.join(', ');
    // Set a random target from the array (70% chance) or random (30% chance)
    if (Math.random() < 0.7) {
      const randomIndex = Math.floor(Math.random() * array.length);
      document.getElementById('input-target').value = array[randomIndex];
    } else {
      document.getElementById('input-target').value = Math.floor(Math.random() * 100);
    }
  });
  
  // Start search button
  document.getElementById('start-btn').addEventListener('click', () => {
    const input = document.getElementById('input-array').value;
    const array = parseInputArray(input);
    const target = parseInt(document.getElementById('input-target').value);
    
    const validation = validateArrayInput(array);
    if (!validation.valid) {
      showAlert(validation.message);
      return;
    }
    
    if (isNaN(target)) {
      showAlert('Please enter a valid target number.');
      return;
    }
    
    startVisualization(array, target);
  });
  
  // Generate initial random array
  document.getElementById('generate-btn').click();
});

function startVisualization(array, target) {
  const linearSearch = new LinearSearch(array, target);
  const steps = linearSearch.generateSteps();
  
  animationState.setSteps(steps);
  
  // Enable controls
  document.getElementById('play-btn').disabled = false;
  document.getElementById('step-btn').disabled = false;
  document.getElementById('reset-btn').disabled = false;
  
  // Render initial state
  const initialStep = animationState.getCurrentStep();
  drawArray(initialStep.array, initialStep.target, initialStep.highlights);
  updateStats(initialStep.stats);
  
  // Initialize controls
  controls = new VisualizerControls(animationState, (step) => {
    drawArray(step.array, step.target, step.highlights);
    updateStats(step.stats);
  });
  
  controls.updateStepInfo(initialStep);
  controls.updateStepCounter();
}
