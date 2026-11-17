// app/modules/biology_stub.js
/**
 * Gramin PocketLab — Biology Module (Food Web Explorer)
 * Conforming to SubjectInteractionHandler contract.
 * Class 7 NCERT Ch 10: Living Organisms and Ecosystems.
 * Direct manipulation of farm food-web energy transfers.
 * Demonstrates directional energy flow (&rarr;) and simplified qualitative trophic cascade tendencies.
 */

export const BiologyModule = {
  id: 'mission-bio-foodweb',
  subjectId: 'biology',

  getInitialState() {
    return {
      scenario: 'balanced', // 'balanced' | 'remove_snakes' | 'drought'
      hasInteracted: false
    };
  },

  validateInvariant(state) {
    const isValid = Boolean(state && state.hasInteracted);
    return {
      isValid,
      userFacingMessage: isValid 
        ? 'Ecosystem disturbance observed! Notice how directional energy transfer links species across trophic levels.'
        : 'Select an ecological scenario button to observe how energy flow shifts across trophic levels.'
    };
  },

  resetState() {
    return this.getInitialState();
  },

  mount(container, state, onStateChange) {
    let currentState = { ...state };

    container.innerHTML = `
      <div class="interactive-lab-card" role="region" aria-label="Food Web Explorer Lab">
        <div class="lab-header">
          <div>
            <h3 class="lab-title">Food Web Explorer: Farm Ecosystem</h3>
            <p class="lab-subtitle">Explore directional energy transfer and qualitative trophic cascade tendencies in a rural paddy farm.</p>
          </div>
          <button type="button" id="bio-reset-btn" class="btn btn-secondary btn-sm" aria-label="Reset Food Web" style="min-height: 48px;">↺ Reset</button>
        </div>

        <!-- Directional Energy Flow Meaning Banner -->
        <div class="status-badge status-neutral" id="bio-legend" style="margin-bottom: 16px; display: block; line-height: 1.4;">
          <strong>Energy Flow Direction:</strong> Directed arrows represent the flow of organic food energy from the organism consumed to the feeding consumer (&rarr;). Energy moves upward from primary producers.
        </div>

        <!-- SVG Node Graph -->
        <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 16px; text-align: center;">
          <svg viewBox="0 0 540 230" style="max-width: 100%; height: auto;" aria-labelledby="svg-foodweb-desc" role="img">
            <title id="svg-foodweb-desc">Rural Farm Food Web showing energy transfer arrows from paddy crops to grasshoppers, mice, frogs, and rat snakes.</title>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#18794E" />
              </marker>
              <marker id="arrow-dim" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#9CA3AF" />
              </marker>
            </defs>

            <!-- Energy transfer paths -->
            <line id="edge-crop-gh" x1="85" y1="110" x2="185" y2="60" stroke="#18794E" stroke-width="2.5" marker-end="url(#arrow)" />
            <line id="edge-crop-mice" x1="85" y1="110" x2="185" y2="160" stroke="#18794E" stroke-width="2.5" marker-end="url(#arrow)" />
            <line id="edge-gh-frog" x1="245" y1="60" x2="330" y2="60" stroke="#18794E" stroke-width="2.5" marker-end="url(#arrow)" />
            <line id="edge-mice-snake" x1="245" y1="160" x2="430" y2="110" stroke="#18794E" stroke-width="2.5" marker-end="url(#arrow)" />
            <line id="edge-frog-snake" x1="385" y1="60" x2="430" y2="90" stroke="#18794E" stroke-width="2.5" marker-end="url(#arrow)" />

            <!-- Nodes -->
            <g class="node" id="node-crops">
              <rect x="15" y="85" width="95" height="52" rx="8" fill="#E6F4EA" stroke="#18794E" stroke-width="2" />
              <text x="62" y="108" text-anchor="middle" font-weight="700" fill="#162033" font-size="12">Paddy Crops</text>
              <text x="62" y="125" text-anchor="middle" fill="#596579" font-size="10">Producer</text>
            </g>

            <g class="node" id="node-grasshopper">
              <rect x="175" y="35" width="95" height="52" rx="8" fill="#FFF" stroke="#6B7280" stroke-width="2" />
              <text x="222" y="58" text-anchor="middle" font-weight="700" fill="#162033" font-size="12">Grasshopper</text>
              <text x="222" y="75" text-anchor="middle" fill="#596579" font-size="10">Herbivore</text>
            </g>

            <g class="node" id="node-mice">
              <rect x="175" y="135" width="95" height="52" rx="8" fill="#FFF" stroke="#6B7280" stroke-width="2" />
              <text x="222" y="158" text-anchor="middle" font-weight="700" fill="#162033" font-size="12">Field Mice</text>
              <text x="222" y="175" text-anchor="middle" fill="#596579" font-size="10">Herbivore</text>
            </g>

            <g class="node" id="node-frogs">
              <rect x="320" y="35" width="90" height="52" rx="8" fill="#FFF" stroke="#6B7280" stroke-width="2" />
              <text x="365" y="58" text-anchor="middle" font-weight="700" fill="#162033" font-size="12">Frogs</text>
              <text x="365" y="75" text-anchor="middle" fill="#596579" font-size="10">Carnivore</text>
            </g>

            <g class="node" id="node-snakes">
              <rect x="425" y="75" width="95" height="52" rx="8" fill="#FFF" stroke="#6B7280" stroke-width="2" />
              <text x="472" y="98" text-anchor="middle" font-weight="700" fill="#162033" font-size="12">Rat Snakes</text>
              <text x="472" y="115" text-anchor="middle" fill="#596579" font-size="10">Top Predator</text>
            </g>
          </svg>
        </div>

        <!-- Ecological Disturbance Scenario Toggles -->
        <div style="margin-top: 16px; margin-bottom: 8px;">
          <label id="scenario-buttons-label" class="h4" style="font-weight: 600;">Select Ecosystem Scenario to Observe:</label>
        </div>
        <div role="group" aria-labelledby="scenario-buttons-label" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; margin: 12px 0;">
          <button type="button" class="btn btn-primary" id="btn-bio-balanced" aria-pressed="true" style="min-height: 48px; background: var(--color-bio);">🌿 Balanced Web</button>
          <button type="button" class="btn btn-secondary" id="btn-bio-remove-snakes" aria-pressed="false" style="min-height: 48px;">🐍 Remove Snakes</button>
          <button type="button" class="btn btn-secondary" id="btn-bio-drought" aria-pressed="false" style="min-height: 48px;">☀️ Severe Drought</button>
        </div>

        <!-- Qualitative Status Display -->
        <div id="bio-observation-panel" class="callout-box callout-info" style="margin-top: 16px;" role="status" aria-live="polite">
          <strong>Observed Status (Balanced Baseline):</strong> Ecosystem is in stable equilibrium. Energy flows steadily from primary producers (Paddy Crops) through herbivores (Grasshoppers, Field Mice) to predators (Frogs, Rat Snakes).
        </div>

        <!-- Accessible Semantic Table Alternative -->
        <details style="margin-top: 16px; background: #F8FAFC; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 8px 12px;">
          <summary style="cursor: pointer; padding: 6px; font-weight: 600;">Accessible Food Web Relationship Table</summary>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--color-border); text-align: left;">
                <th style="padding: 8px 6px;">Organism</th>
                <th style="padding: 8px 6px;">Trophic Level</th>
                <th style="padding: 8px 6px;">Food Energy Source</th>
                <th style="padding: 8px 6px;">Consumed By</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--color-border);"><td style="padding: 6px;">Paddy Crops</td><td>Primary Producer</td><td>Photosynthesis (Sunlight)</td><td>Grasshoppers, Field Mice</td></tr>
              <tr style="border-bottom: 1px solid var(--color-border);"><td style="padding: 6px;">Grasshoppers</td><td>Primary Consumer (Herbivore)</td><td>Paddy Crops</td><td>Frogs</td></tr>
              <tr style="border-bottom: 1px solid var(--color-border);"><td style="padding: 6px;">Field Mice</td><td>Primary Consumer (Herbivore)</td><td>Paddy Crops</td><td>Rat Snakes</td></tr>
              <tr style="border-bottom: 1px solid var(--color-border);"><td style="padding: 6px;">Frogs</td><td>Secondary Consumer (Carnivore)</td><td>Grasshoppers</td><td>Rat Snakes</td></tr>
              <tr><td style="padding: 6px;">Rat Snakes</td><td>Apex Predator</td><td>Frogs, Field Mice</td><td>None (Decomposers at death)</td></tr>
            </tbody>
          </table>
        </details>
      </div>
    `;

    const obsPanel = container.querySelector('#bio-observation-panel');
    const btnBalanced = container.querySelector('#btn-bio-balanced');
    const btnSnakes = container.querySelector('#btn-bio-remove-snakes');
    const btnDrought = container.querySelector('#btn-bio-drought');

    const updateButtons = (activeScenario) => {
      btnBalanced.className = activeScenario === 'balanced' ? 'btn btn-primary' : 'btn btn-secondary';
      btnBalanced.style.background = activeScenario === 'balanced' ? 'var(--color-bio)' : '';
      btnBalanced.setAttribute('aria-pressed', String(activeScenario === 'balanced'));

      btnSnakes.className = activeScenario === 'remove_snakes' ? 'btn btn-primary' : 'btn btn-secondary';
      btnSnakes.style.background = activeScenario === 'remove_snakes' ? 'var(--color-bio)' : '';
      btnSnakes.setAttribute('aria-pressed', String(activeScenario === 'remove_snakes'));

      btnDrought.className = activeScenario === 'drought' ? 'btn btn-primary' : 'btn btn-secondary';
      btnDrought.style.background = activeScenario === 'drought' ? 'var(--color-bio)' : '';
      btnDrought.setAttribute('aria-pressed', String(activeScenario === 'drought'));
    };

    const updateSvgHighlight = (activeScenario) => {
      const nodeSnakes = container.querySelector('#node-snakes rect');
      const nodeCrops = container.querySelector('#node-crops rect');
      const edgeSnake1 = container.querySelector('#edge-mice-snake');
      const edgeSnake2 = container.querySelector('#edge-frog-snake');

      if (activeScenario === 'remove_snakes') {
        if (nodeSnakes) nodeSnakes.setAttribute('stroke', '#C5221F');
        if (nodeSnakes) nodeSnakes.setAttribute('fill', '#FDF2F2');
        if (edgeSnake1) edgeSnake1.setAttribute('stroke', '#9CA3AF');
        if (edgeSnake2) edgeSnake2.setAttribute('stroke', '#9CA3AF');
      } else if (activeScenario === 'drought') {
        if (nodeCrops) nodeCrops.setAttribute('stroke', '#C5221F');
        if (nodeCrops) nodeCrops.setAttribute('fill', '#FEF3C7');
        if (nodeSnakes) nodeSnakes.setAttribute('stroke', '#6B7280');
        if (nodeSnakes) nodeSnakes.setAttribute('fill', '#FFF');
        if (edgeSnake1) edgeSnake1.setAttribute('stroke', '#18794E');
        if (edgeSnake2) edgeSnake2.setAttribute('stroke', '#18794E');
      } else {
        if (nodeCrops) nodeCrops.setAttribute('stroke', '#18794E');
        if (nodeCrops) nodeCrops.setAttribute('fill', '#E6F4EA');
        if (nodeSnakes) nodeSnakes.setAttribute('stroke', '#6B7280');
        if (nodeSnakes) nodeSnakes.setAttribute('fill', '#FFF');
        if (edgeSnake1) edgeSnake1.setAttribute('stroke', '#18794E');
        if (edgeSnake2) edgeSnake2.setAttribute('stroke', '#18794E');
      }
    };

    btnBalanced.addEventListener('click', () => {
      currentState.scenario = 'balanced';
      currentState.hasInteracted = true;
      updateButtons('balanced');
      updateSvgHighlight('balanced');
      obsPanel.className = 'callout-box callout-info';
      obsPanel.innerHTML = '<strong>Observed Status (Balanced Baseline):</strong> Ecosystem is in stable equilibrium. Energy flows steadily from primary producers (Paddy Crops) through herbivores (Grasshoppers, Field Mice) to predators (Frogs, Rat Snakes).';
      onStateChange(currentState);
    });

    btnSnakes.addEventListener('click', () => {
      currentState.scenario = 'remove_snakes';
      currentState.hasInteracted = true;
      updateButtons('remove_snakes');
      updateSvgHighlight('remove_snakes');
      obsPanel.className = 'callout-box callout-warning';
      obsPanel.innerHTML = '<strong>Simplified Model Tendency (Apex Predator Removed):</strong> With rat snakes removed, frog numbers face reduced predation and tend to surge. Increased feeding pressure from the larger frog population in turn causes grasshopper numbers to decline.';
      onStateChange(currentState);
    });

    btnDrought.addEventListener('click', () => {
      currentState.scenario = 'drought';
      currentState.hasInteracted = true;
      updateButtons('drought');
      updateSvgHighlight('drought');
      obsPanel.className = 'callout-box callout-danger';
      obsPanel.innerHTML = '<strong>Simplified Model Tendency (Primary Producers Withered):</strong> Severe drought withers paddy crops at the base of the energy pyramid. Without primary producers converting sunlight into chemical energy, all herbivore and predator populations face sharp decline.';
      onStateChange(currentState);
    });

    container.querySelector('#bio-reset-btn').addEventListener('click', () => {
      currentState = this.resetState();
      updateButtons('balanced');
      updateSvgHighlight('balanced');
      obsPanel.className = 'callout-box callout-info';
      obsPanel.innerHTML = '<strong>Observed Status:</strong> Balanced ecosystem baseline restored.';
      onStateChange(currentState);
    });
  },

  unmount() {}
};
