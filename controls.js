// ========== VISUALIZER CONTROLS ==========
// Handles Play, Pause, Step, Reset buttons and speed control

class VisualizerControls {
  constructor(state, renderFunction) {
    this.state = state;
    this.render = renderFunction;
    this.playBtn = document.getElementById('play-btn');
    this.pauseBtn = document.getElementById('pause-btn');
    this.stepBtn = document.getElementById('step-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.stepBackBtn = document.getElementById('step-back-btn');
    this.speedSlider = document.getElementById('speed-slider');
    this.speedLabel = document.getElementById('speed-label');
    this.stepCounter = document.getElementById('step-counter');
    
    this.initControls();
    this.initSpeedControl();
    this.setupStateCallbacks();
  }

  initControls() {
    // Play button
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        if (!this.state.isPlaying) {
          this.onPlay();
          this.state.play((step) => {
            this.render(step);
            this.updateStepInfo(step);
            this.updateStepCounter();
          });
        }
      });
    }

    // Pause button
    if (this.pauseBtn) {
      this.pauseBtn.addEventListener('click', () => {
        this.state.pause();
        this.onPause();
      });
    }

    // Step Forward button
    if (this.stepBtn) {
      this.stepBtn.addEventListener('click', () => {
        if (this.state.isPlaying) {
          this.state.pause();
          this.onPause();
        }
        const step = this.state.nextStep();
        if (step) {
          this.render(step);
          this.updateStepInfo(step);
          this.updateStepCounter();
        }
      });
    }

    // Step Back button
    if (this.stepBackBtn) {
      this.stepBackBtn.addEventListener('click', () => {
        if (this.state.isPlaying) {
          this.state.pause();
          this.onPause();
        }
        const step = this.state.prevStep();
        if (step) {
          this.render(step);
          this.updateStepInfo(step);
          this.updateStepCounter();
        }
      });
    }

    // Reset button
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.state.reset();
        const step = this.state.getCurrentStep();
        if (step) {
          this.render(step);
          this.updateStepInfo(step);
          this.updateStepCounter();
        }
        this.onReset();
      });
    }
  }

  initSpeedControl() {
    if (this.speedSlider) {
      this.speedSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        this.state.setSpeed(value);

        const labels = {
          1: 'Slow',
          2: 'Medium',
          3: 'Fast'
        };
        
        if (this.speedLabel) {
          this.speedLabel.textContent = labels[value];
        }
      });

      // Set initial speed
      this.state.setSpeed(parseInt(this.speedSlider.value) || 2);
    }
  }

  setupStateCallbacks() {
    this.state.onComplete = () => {
      this.onComplete();
    };
  }

  onPlay() {
    if (this.playBtn) this.playBtn.disabled = true;
    if (this.pauseBtn) this.pauseBtn.disabled = false;
    if (this.stepBtn) this.stepBtn.disabled = true;
    if (this.stepBackBtn) this.stepBackBtn.disabled = true;
  }

  onPause() {
    if (this.playBtn) this.playBtn.disabled = false;
    if (this.pauseBtn) this.pauseBtn.disabled = true;
    if (this.stepBtn) this.stepBtn.disabled = false;
    if (this.stepBackBtn) this.stepBackBtn.disabled = false;
  }

  onReset() {
    if (this.playBtn) this.playBtn.disabled = false;
    if (this.pauseBtn) this.pauseBtn.disabled = true;
    if (this.stepBtn) this.stepBtn.disabled = false;
    if (this.stepBackBtn) this.stepBackBtn.disabled = true;
  }

  onComplete() {
    if (this.playBtn) this.playBtn.disabled = false;
    if (this.pauseBtn) this.pauseBtn.disabled = true;
    if (this.stepBtn) this.stepBtn.disabled = true;
    if (this.stepBackBtn) this.stepBackBtn.disabled = false;
  }

  updateStepInfo(step) {
    const stepDesc = document.getElementById('step-description');
    if (stepDesc && step && step.description) {
      stepDesc.textContent = step.description;
    }
    
    this.highlightCode(step ? step.lineNumber : -1);
    this.updateStats(step ? step.stats : null);
  }

  highlightCode(lineNumber) {
    const codeLines = document.querySelectorAll('#code-display .line');
    codeLines.forEach((line, index) => {
      line.classList.remove('highlight');
      if (index === lineNumber) {
        line.classList.add('highlight');
      }
    });
  }

  updateStats(stats) {
    if (!stats) return;
    
    const comparisons = document.getElementById('comparisons');
    const swaps = document.getElementById('swaps');
    const accesses = document.getElementById('accesses');
    
    if (comparisons && stats.comparisons !== undefined) {
      comparisons.textContent = stats.comparisons;
    }
    if (swaps && stats.swaps !== undefined) {
      swaps.textContent = stats.swaps;
    }
    if (accesses && stats.accesses !== undefined) {
      accesses.textContent = stats.accesses;
    }
  }

  updateStepCounter() {
    if (this.stepCounter) {
      this.stepCounter.textContent = `Step ${this.state.getCurrentStepIndex() + 1} of ${this.state.getStepCount()}`;
    }
  }

  enableAllButtons() {
    if (this.playBtn) this.playBtn.disabled = false;
    if (this.pauseBtn) this.pauseBtn.disabled = true;
    if (this.stepBtn) this.stepBtn.disabled = false;
    if (this.stepBackBtn) this.stepBackBtn.disabled = true;
    if (this.resetBtn) this.resetBtn.disabled = false;
  }
}
