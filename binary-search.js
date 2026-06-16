// ========== BINARY SEARCH VISUALIZER ==========

class BinarySearch {
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

    let left = 0;  
    let right = this.array.length - 1;  //right and left defines the current search range
    const eliminated = [];

    // Initial step
    this.steps.push({
      array: [...this.array],
      target: this.target,
      highlights: { 
        current: -1, 
        found: -1, 
        left: left, 
        right: right, 
        mid: -1,
        inRange: this.getRange(left, right),
        eliminated: []
      },
      description: `Searching for ${this.target}. Array is sorted. Left=${left}, Right=${right}`,
      lineNumber: 0,
      stats: { comparisons: 0, accesses: 0 }
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);  //used to identify the mid point
      this.accesses++;

      // Show mid calculation
      this.steps.push({
        array: [...this.array],
        target: this.target,
        highlights: { 
          current: mid,  //element being compared
          found: -1, 
          left: left, 
          right: right, 
          mid: mid,
          inRange: this.getRange(left, right), //current search space
          eliminated: [...eliminated]
        },
        description: `Mid = (${left} + ${right}) / 2 = ${mid}. Checking arr[${mid}] = ${this.array[mid]}`,
        lineNumber: 1,
        stats: { comparisons: this.comparisons, accesses: this.accesses }
      });

      this.comparisons++;

      if (this.array[mid] === this.target) {
        // Found
        this.steps.push({
          array: [...this.array],
          target: this.target,
          highlights: { 
            current: -1, 
            found: mid,   //targets index
            left: left, 
            right: right, 
            mid: mid,
            inRange: [],  //indicates that search is done
            eliminated: [...eliminated]
          },
          description: `Found! ${this.target} is at index ${mid}.`,
          lineNumber: 2,
          stats: { comparisons: this.comparisons, accesses: this.accesses }
        });
        return this.steps;
      } else if (this.array[mid] < this.target) {
        // Target is in right half
        // Mark left half as eliminated
        for (let i = left; i <= mid; i++) {
          if (!eliminated.includes(i)) eliminated.push(i);
        }
        
        this.steps.push({
          array: [...this.array],
          target: this.target,
          highlights: { 
            current: -1, 
            found: -1, 
            left: mid + 1, 
            right: right, 
            mid: -1,
            inRange: this.getRange(mid + 1, right), //current seacrh range
            eliminated: [...eliminated]
          },
          description: `${this.array[mid]} < ${this.target}. Target is in right half. New Left = ${mid + 1}`,
          lineNumber: 3,
          stats: { comparisons: this.comparisons, accesses: this.accesses }
        });
        
        left = mid + 1; //updates the left index
      } else {
        // Target is in left half
        // Mark right half as eliminated
        for (let i = mid; i <= right; i++) {
          if (!eliminated.includes(i)) eliminated.push(i);
        }
        
        this.steps.push({
          array: [...this.array],
          target: this.target,
          highlights: { 
            current: -1, 
            found: -1, 
            left: left, 
            right: mid - 1, 
            mid: -1,
            inRange: this.getRange(left, mid - 1),
            eliminated: [...eliminated]
          },
          description: `${this.array[mid]} > ${this.target}. Target is in left half. New Right = ${mid - 1}`,
          lineNumber: 4,
          stats: { comparisons: this.comparisons, accesses: this.accesses }
        });
        
        right = mid - 1; //updates the right index
      }
    }

    // Not found
    this.steps.push({
      array: [...this.array],
      target: this.target,
      highlights: { 
        current: -1, 
        found: -1, 
        left: -1, 
        right: -1, 
        mid: -1,
        inRange: [],
        eliminated: Array.from({ length: this.array.length }, (_, i) => i),
        notFound: true  //indicates the element is not present 
      },
      description: `${this.target} not found in the array. Search space exhausted.`,
      lineNumber: 5,
      stats: { comparisons: this.comparisons, accesses: this.accesses }
    });

    return this.steps;
  }

  getRange(start, end) {
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }
}

// Draw array as boxes with pointers
function drawArray(array, target, highlights = {}) {
  const container = document.getElementById('array-display');
  container.innerHTML = ''; //clears the previous state so we can redraw 
  
  document.getElementById('target-value').textContent = target;
  
  // Update pointer displays
  document.getElementById('left-ptr').textContent = highlights.left >= 0 ? highlights.left : '-';
  document.getElementById('mid-ptr').textContent = highlights.mid >= 0 ? highlights.mid : '-';
  document.getElementById('right-ptr').textContent = highlights.right >= 0 ? highlights.right : '-';
  
  array.forEach((value, index) => {
    const boxWrapper = document.createElement('div');  //creates a wrapper class for each box
    boxWrapper.style.position = 'relative';
    boxWrapper.style.display = 'inline-block';  //keeps box in a row 
    
    const box = document.createElement('div');
    box.className = 'array-box';  //styling of the box 
    
    // Apply highlighting
    if (highlights.found === index) {
      box.classList.add('found');
    } else if (highlights.current === index) {
      box.classList.add('current');
    } else if (highlights.eliminated && highlights.eliminated.includes(index)) {
      box.classList.add('eliminated');
    } else if (highlights.inRange && highlights.inRange.includes(index)) {
      box.classList.add('in-range');
    }
    
    box.innerHTML = `   //shows the array value and its index
      <span>${value}</span>
      <span class="array-box-index">${index}</span>
    `;
    
    // Add pointer labels
    const pointers = [];  //hold pointer like L,M,R
    if (highlights.left === index) pointers.push('<span class="array-box-pointer left">L</span>');
    if (highlights.mid === index) pointers.push('<span class="array-box-pointer mid">M</span>');      //if index matches the pointers add the respective (L,M,R)
    if (highlights.right === index) pointers.push('<span class="array-box-pointer right">R</span>');
    
    boxWrapper.appendChild(box);
    if (pointers.length > 0) {
      const pointerContainer = document.createElement('div');
      pointerContainer.style.position = 'absolute';
      pointerContainer.style.top = '-35px';
      pointerContainer.style.left = '50%';
      pointerContainer.style.transform = 'translateX(-50%)';
      pointerContainer.style.display = 'flex';
      pointerContainer.style.gap = '2px';
      pointerContainer.innerHTML = pointers.join('');
      boxWrapper.appendChild(pointerContainer);
    }
    
    container.appendChild(boxWrapper);
  });
}

// Load pseudocode
function loadPseudocode() {
  const code = `binarySearch(arr, target):
  while left <= right:
    mid = (left + right) / 2
    if arr[mid] == target: return mid
    else if arr[mid] < target: left = mid + 1
    else: right = mid - 1
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
  
  // Generate random sorted array button
  document.getElementById('generate-btn').addEventListener('click', () => {
    const array = generateSortedArray(10, 10, 99);
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
    let array = parseInputArray(input);
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
    
    // Sort the array if not sorted
    const sortedArray = [...array].sort((a, b) => a - b);
    if (JSON.stringify(array) !== JSON.stringify(sortedArray)) {
      showAlert('Array has been sorted for binary search.', 'warning');
      array = sortedArray;
      document.getElementById('input-array').value = array.join(', ');
    }
    
    startVisualization(array, target);
  });
  
  // Generate initial random array
  document.getElementById('generate-btn').click();
});

function startVisualization(array, target) {
  const binarySearch = new BinarySearch(array, target);
  const steps = binarySearch.generateSteps();
  
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
