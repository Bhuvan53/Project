// ========== UTILITY FUNCTIONS ==========
// Shared utilities for all visualizers

// Generate random array
function generateRandomArray(size = 10, min = 5, max = 100) {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return array;
}

// Generate sorted array (for binary search)
function generateSortedArray(size = 10, min = 1, max = 100) {
  const array = generateRandomArray(size, min, max);
  return array.sort((a, b) => a - b);
}

// Parse input string to array
function parseInputArray(input) {
  if (!input || input.trim() === '') return null;
  
  const numbers = input.split(',').map(n => {
    const parsed = parseInt(n.trim());
    return isNaN(parsed) ? null : parsed;
  });
  
  if (numbers.includes(null)) return null;
  return numbers;
}

// Validate array input
function validateArrayInput(array, minSize = 2, maxSize = 20) {
  if (!array || !Array.isArray(array)) {
    return { valid: false, message: 'Please enter valid numbers separated by commas.' };
  }
  
  if (array.length < minSize) {
    return { valid: false, message: `Please enter at least ${minSize} numbers.` };
  }
  
  if (array.length > maxSize) {
    return { valid: false, message: `Maximum ${maxSize} numbers allowed.` };
  }
  
  return { valid: true, message: '' };
}

// Validate search target
function validateSearchTarget(target, array) {
  if (target === null || target === undefined || isNaN(target)) {
    return { valid: false, message: 'Please enter a valid target number.' };
  }
  return { valid: true, message: '' };
}

// Sleep function for async animations
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Swap elements in array (returns new array)
function swapElements(array, i, j) {
  const newArray = [...array];
  [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  return newArray;
}

// Deep clone object
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Generate colors based on state
function getBarColor(state) {
  const colors = {
    default: '#0d6efd',
    comparing: '#ffc107',
    swapping: '#dc3545',
    sorted: '#198754',
    pivot: '#6f42c1'
  };
  return colors[state] || colors.default;
}

// Format complexity string
function formatComplexity(type, best, average, worst) {
  if (best === average && average === worst) {
    return average;
  }
  return `Best: ${best}, Avg: ${average}, Worst: ${worst}`;
}

// Show alert message
function showAlert(message, type = 'danger') {
  const alertContainer = document.getElementById('alert-container');
  if (!alertContainer) return;
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show`;
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  alertContainer.innerHTML = '';
  alertContainer.appendChild(alert);
  
  // Auto dismiss after 3 seconds
  setTimeout(() => {
    alert.classList.remove('show');
    setTimeout(() => alert.remove(), 150);
  }, 3000);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Canvas utilities
function clearCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resizeCanvas(canvas, container) {
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width - 40;
  canvas.height = 350;
}

// Draw rounded rectangle
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
