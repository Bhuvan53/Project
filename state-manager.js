// ========== STATE MANAGER ==========
// Manages animation state for all visualizers

class AnimationState {
  constructor() {
    this.steps = [];
    this.currentStep = 0;
    this.isPlaying = false;
    this.isPaused = false;
    this.speed = 1000; // milliseconds (1000 = medium)
    this.animationId = null;
    this.onStepChange = null;
    this.onComplete = null;
  }

  setSteps(steps) {
    this.steps = steps;
    this.currentStep = 0;
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
  }

  getCurrentStep() {
    return this.steps[this.currentStep] || null;
  }

  getStepCount() {
    return this.steps.length;
  }

  getCurrentStepIndex() {
    return this.currentStep;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      if (this.onStepChange) {
        this.onStepChange(this.getCurrentStep(), this.currentStep);
      }
      return this.getCurrentStep();
    }
    return null;
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      if (this.onStepChange) {
        this.onStepChange(this.getCurrentStep(), this.currentStep);
      }
      return this.getCurrentStep();
    }
    return null;
  }

  goToStep(index) {
    if (index >= 0 && index < this.steps.length) {
      this.currentStep = index;
      if (this.onStepChange) {
        this.onStepChange(this.getCurrentStep(), this.currentStep);
      }
      return this.getCurrentStep();
    }
    return null;
  }

  play(renderCallback) {
    if (this.steps.length === 0) return;
    
    this.isPlaying = true;
    this.isPaused = false;

    const animate = () => {
      if (!this.isPlaying || this.isPaused) return;

      renderCallback(this.getCurrentStep());

      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        if (this.onStepChange) {
          this.onStepChange(this.getCurrentStep(), this.currentStep);
        }
        this.animationId = setTimeout(animate, this.speed);
      } else {
        this.isPlaying = false;
        if (this.onComplete) {
          this.onComplete();
        }
      }
    };

    animate();
  }

  pause() {
    this.isPaused = true;
    this.isPlaying = false;
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
  }

  reset() {
    this.currentStep = 0;
    this.isPlaying = false;
    this.isPaused = false;
    if (this.animationId) {
      clearTimeout(this.animationId);
      this.animationId = null;
    }
    if (this.onStepChange) {
      this.onStepChange(this.getCurrentStep(), this.currentStep);
    }
  }

  setSpeed(speedLevel) {
    // speedLevel: 1 (slow), 2 (medium), 3 (fast)
    const speedMap = {
      1: 1500, // slow
      2: 800,  // medium
      3: 300   // fast
    };
    this.speed = speedMap[speedLevel] || 800;
  }

  isAtStart() {
    return this.currentStep === 0;
  }

  isAtEnd() {
    return this.currentStep >= this.steps.length - 1;
  }
}

// Create global instance
const animationState = new AnimationState();
