/**
 * Class 8 Computing / Technology: Maze Navigator Algorithm Studio
 * Focus: Sequential logic, loops, state tracking, and algorithmic thinking.
 * Mission: Guide the rural solar rover to collect energy cells and reach the charging pad.
 */

export function createCodingModule({ container, onComplete, initialCode = [] } = {}) {
  const GRID_SIZE = 5;
  // 0: empty, 1: obstacle (rock), 2: battery cell, 3: solar beacon (target)
  const INITIAL_GRID = [
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 2, 0, 1, 0],
    [0, 1, 2, 0, 0],
    [0, 0, 0, 1, 3]
  ];

  let roverState = {
    x: 0,
    y: 0,
    dir: 1, // 0: North, 1: East, 2: South, 3: West
    cellsCollected: 0,
    totalCells: 2
  };

  let program = [...initialCode]; // Array of commands: 'FORWARD', 'LEFT', 'RIGHT', 'REPEAT_3_FWD'
  let isRunning = false;
  let statusMessage = 'Assemble commands to guide the rover to the solar beacon!';
  let isCompleted = false;

  const DIR_NAMES = ['North (↑)', 'East (→)', 'South (↓)', 'West (←)'];
  const DIR_OFFSETS = [
    { dx: 0, dy: -1 }, // North
    { dx: 1, dy: 0 },  // East
    { dx: 0, dy: 1 },  // South
    { dx: -1, dy: 0 }  // West
  ];

  function resetRover() {
    roverState = {
      x: 0,
      y: 0,
      dir: 1,
      cellsCollected: 0,
      totalCells: 2
    };
    isRunning = false;
    statusMessage = 'Rover reset to starting position at (0,0) facing East.';
    render();
  }

  function addCommand(cmd) {
    if (isRunning) return;
    if (program.length >= 16) {
      statusMessage = 'Program memory full (max 16 steps).';
      render();
      return;
    }
    program.push(cmd);
    render();
  }

  function removeCommand(index) {
    if (isRunning) return;
    program.splice(index, 1);
    render();
  }

  function clearProgram() {
    if (isRunning) return;
    program = [];
    resetRover();
  }

  async function executeProgram() {
    if (isRunning || program.length === 0) return;
    isRunning = true;
    resetRover();
    statusMessage = 'Executing algorithm...';
    render();

    // Expand commands
    const expandedSteps = [];
    for (const cmd of program) {
      if (cmd === 'REPEAT_3_FWD') {
        expandedSteps.push('FORWARD', 'FORWARD', 'FORWARD');
      } else {
        expandedSteps.push(cmd);
      }
    }

    // Deep copy grid for cell collection tracking
    const currentGrid = INITIAL_GRID.map(row => [...row]);

    for (let i = 0; i < expandedSteps.length; i++) {
      const step = expandedSteps[i];
      await new Promise(resolve => setTimeout(resolve, 450));

      if (step === 'LEFT') {
        roverState.dir = (roverState.dir + 3) % 4;
        statusMessage = `Step ${i + 1}: Turned Left, now facing ${DIR_NAMES[roverState.dir]}`;
      } else if (step === 'RIGHT') {
        roverState.dir = (roverState.dir + 1) % 4;
        statusMessage = `Step ${i + 1}: Turned Right, now facing ${DIR_NAMES[roverState.dir]}`;
      } else if (step === 'FORWARD') {
        const offset = DIR_OFFSETS[roverState.dir];
        const newX = roverState.x + offset.dx;
        const newY = roverState.y + offset.dy;

        // Boundary check
        if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE) {
          statusMessage = `Collision alert! Rover hit the grid boundary at (${newX}, ${newY})!`;
          isRunning = false;
          render();
          return;
        }

        // Obstacle check
        if (currentGrid[newY][newX] === 1) {
          statusMessage = `Collision! Rover crashed into a boulder at (${newX}, ${newY})!`;
          isRunning = false;
          render();
          return;
        }

        roverState.x = newX;
        roverState.y = newY;

        // Battery pickup
        if (currentGrid[newY][newX] === 2) {
          roverState.cellsCollected++;
          currentGrid[newY][newX] = 0; // consumed
          statusMessage = `Energy cell picked up! (${roverState.cellsCollected}/${roverState.totalCells})`;
        } else {
          statusMessage = `Step ${i + 1}: Moved forward to (${roverState.x}, ${roverState.y})`;
        }
      }

      render(currentGrid);
    }

    // End of program evaluation
    isRunning = false;
    if (roverState.x === 4 && roverState.y === 4) {
      if (roverState.cellsCollected >= roverState.totalCells) {
        statusMessage = '🎉 Mission Accomplished! Rover reached the Solar Beacon with all energy cells collected!';
        isCompleted = true;
        if (typeof onComplete === 'function') {
          onComplete({ success: true, steps: program.length, cellsCollected: roverState.cellsCollected });
        }
      } else {
        statusMessage = `Rover reached the beacon but only collected ${roverState.cellsCollected}/${roverState.totalCells} cells. Try routing through the cells!`;
      }
    } else {
      statusMessage = `Program ended. Rover stopped at (${roverState.x}, ${roverState.y}). Needs to reach the beacon at (4,4).`;
    }
    render(currentGrid);
  }

  function render(grid = INITIAL_GRID) {
    if (!container) return;

    const cellHtml = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isRover = roverState.x === x && roverState.y === y;
        const val = grid[y][x];
        let content = '';
        let cellClass = 'maze-cell';

        if (isRover) {
          cellClass += ' cell-rover';
          const dirSymbols = ['▲', '▶', '▼', '◀'];
          content = `<div class="rover-icon" title="Rover facing ${DIR_NAMES[roverState.dir]}">${dirSymbols[roverState.dir]}</div>`;
        } else if (val === 1) {
          cellClass += ' cell-rock';
          content = '🪨';
        } else if (val === 2) {
          cellClass += ' cell-battery';
          content = '⚡';
        } else if (val === 3) {
          cellClass += ' cell-beacon';
          content = '☀️';
        }

        cellHtml.push(`<div class="${cellClass}" data-x="${x}" data-y="${y}">${content}</div>`);
      }
    }

    const commandChips = program.map((cmd, idx) => {
      let label = cmd;
      let badgeClass = 'cmd-badge';
      if (cmd === 'FORWARD') label = 'Step ⏩';
      if (cmd === 'LEFT') label = 'Left ↺';
      if (cmd === 'RIGHT') label = 'Right ↻';
      if (cmd === 'REPEAT_3_FWD') {
        label = 'Loop: 3x ⏩';
        badgeClass += ' cmd-loop';
      }
      return `<button class="${badgeClass}" data-idx="${idx}" ${isRunning ? 'disabled' : ''} title="Click to remove">
        ${idx + 1}. ${label} ✕
      </button>`;
    }).join('');

    container.innerHTML = `
      <div class="coding-lab-container card p-4">
        <div class="d-flex justify-between align-center mb-3">
          <div>
            <span class="badge badge-purple">Class 8 Computing</span>
            <h3 class="mt-1 mb-0">Autonomous Solar Rover Navigator</h3>
            <p class="text-sm text-muted mb-0">Learn sequence algorithms and iterative loop structures.</p>
          </div>
          <div class="stat-pill">
            <span class="text-muted">Energy Cells:</span>
            <strong>${roverState.cellsCollected} / ${roverState.totalCells}</strong>
          </div>
        </div>

        <div class="grid grid-2 gap-4">
          <!-- Left: Maze Grid -->
          <div class="maze-stage-card p-3 text-center">
            <div class="maze-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; max-width: 320px; margin: 0 auto;">
              ${cellHtml.join('')}
            </div>
            <div class="d-flex justify-between text-xs text-muted mt-2">
              <span>Start: (0,0)</span>
              <span>Target Beacon: (4,4) ☀️</span>
            </div>
          </div>

          <!-- Right: Program Sequencer & Controls -->
          <div class="sequencer-card">
            <label class="font-bold text-sm mb-2 block">Command Library (Click to add):</label>
            <div class="btn-group gap-2 mb-3 wrap">
              <button class="btn btn-secondary btn-sm" id="btn-add-fwd" ${isRunning ? 'disabled' : ''}>+ Step ⏩</button>
              <button class="btn btn-secondary btn-sm" id="btn-add-left" ${isRunning ? 'disabled' : ''}>+ Left ↺</button>
              <button class="btn btn-secondary btn-sm" id="btn-add-right" ${isRunning ? 'disabled' : ''}>+ Right ↻</button>
              <button class="btn btn-primary btn-sm" id="btn-add-loop" ${isRunning ? 'disabled' : ''} title="Executes 3 steps forward in 1 instruction">+ Loop: 3x ⏩</button>
            </div>

            <label class="font-bold text-sm mb-2 block">Algorithm Execution Queue (${program.length}/16):</label>
            <div class="program-queue p-2 mb-3 border rounded bg-surface-subtle" style="min-height: 80px; display: flex; flex-wrap: wrap; gap: 4px; align-content: flex-start;">
              ${program.length === 0 ? '<span class="text-xs text-muted p-2">Queue is empty. Click commands above to compose an algorithm.</span>' : commandChips}
            </div>

            <div class="btn-group gap-2 mb-3">
              <button class="btn btn-success" id="btn-run-code" ${isRunning || program.length === 0 ? 'disabled' : ''}>
                ${isRunning ? 'Executing...' : '▶ Run Program'}
              </button>
              <button class="btn btn-outline" id="btn-reset-rover" ${isRunning ? 'disabled' : ''}>↺ Reset Rover</button>
              <button class="btn btn-text text-danger" id="btn-clear-code" ${isRunning || program.length === 0 ? 'disabled' : ''}>Clear All</button>
            </div>

            <div class="alert ${isCompleted ? 'alert-success' : 'alert-info'} text-xs" role="status">
              ${statusMessage}
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind events
    container.querySelector('#btn-add-fwd')?.addEventListener('click', () => addCommand('FORWARD'));
    container.querySelector('#btn-add-left')?.addEventListener('click', () => addCommand('LEFT'));
    container.querySelector('#btn-add-right')?.addEventListener('click', () => addCommand('RIGHT'));
    container.querySelector('#btn-add-loop')?.addEventListener('click', () => addCommand('REPEAT_3_FWD'));
    container.querySelector('#btn-run-code')?.addEventListener('click', () => executeProgram());
    container.querySelector('#btn-reset-rover')?.addEventListener('click', () => resetRover());
    container.querySelector('#btn-clear-code')?.addEventListener('click', () => clearProgram());

    container.querySelectorAll('.cmd-badge').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
        removeCommand(idx);
      });
    });
  }

  // Initial render
  render();

  return {
    getProgram: () => [...program],
    getState: () => ({ ...roverState, isCompleted }),
    reset: resetRover
  };
}

export const CodingModule = {
  id: 'mission-computing-maze',
  subjectId: 'computing',

  getInitialState() {
    return {
      x: 0,
      y: 0,
      dir: 1,
      cellsCollected: 0,
      hasInteracted: false
    };
  },

  validateInvariant(state) {
    if (!state) return { isValid: false, userFacingMessage: 'No rover data available.' };
    return {
      isValid: Boolean(state.hasInteracted),
      userFacingMessage: 'Rover algorithm executed through grid maze.'
    };
  },

  resetState() {
    if (this._instance && typeof this._instance.reset === 'function') {
      this._instance.reset();
    }
    return this.getInitialState();
  },

  mount(container, options = {}) {
    this._container = container;
    this._options = options;
    this._instance = createCodingModule({
      container,
      onComplete: (res) => {
        if (options.onStateChange) {
          options.onStateChange(true, { ...res, hasInteracted: true });
        }
      }
    });
  },

  destroy() {
    this._container = null;
    this._instance = null;
  }
};
