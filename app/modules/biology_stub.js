// app/modules/biology_stub.js
/**
 * Gramin PocketLab — Biology Module (Food Web Explorer)
 * Conforming to SubjectInteractionHandler contract.
 * Focuses on simplified qualitative ecological tendencies (A -> B -> C).
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
    const isValid = state.hasInteracted;
    return {
      isValid,
      userFacingMessage: isValid 
        ? 'Ecosystem state observed! Notice how energy transfer links species across trophic levels.'
        : 'Select an ecological disturbance scenario to observe energy transfer changes.'
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
            <p class="lab-subtitle">Explore directional energy transfer and trophic cascade tendencies.</p>
          </div>
          <button id="bio-reset-btn" class="btn btn-secondary btn-sm" aria-label="Reset Food Web">↺ Reset</button>
        </div>

        <div class="status-badge status-neutral" id="bio-legend" style="margin-bottom: 16px;">
          Legend: Directed arrows represent the flow of food energy from prey to consumer (&rarr;).
        </div>

        <!-- SVG Node Graph -->
        <div style="background: #FFFFFF; border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: 16px; text-align: center;">
          <svg viewBox="0 0 540 220" style="max-width: 100%; height: auto;" aria-labelledby="svg-foodweb-desc">
            <title id="svg-foodweb-desc">Rural Farm Food Web showing energy transfer from crops to grasshoppers, mice, frogs, rat snakes, and barn owls</title>
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#18794E" />
              </marker>
            </defs>

            <!-- Energy transfer paths -->
            <line x1="80" y1="110" x2="190" y2="60" stroke="#18794E" stroke-width="2" marker-end="url(#arrow)" />
            <line x1="80" y1="110" x2="190" y2="160" stroke="#18794E" stroke-width="2" marker-end="url(#arrow)" />
            <line x1="230" y1="60" x2="330" y2="60" stroke="#18794E" stroke-width="2" marker-end="url(#arrow)" />
            <line x1="230" y1="160" x2="440" y2="160" stroke="#18794E" stroke-width="2" marker-end="url(#arrow)" />
            <line x1="370" y1="60" x2="440" y2="100" stroke="#18794E" stroke-width="2" marker-end="url(#arrow)" />

            <!-- Nodes -->
            <g class="node" id="node-crops">
              <rect x="20" y="85" width="80" height="50" rx="8" fill="#E6F4EA" stroke="#18794E" stroke-width="2" />
              <text x="60" y="115" text-anchor="middle" font-weight="600" fill="#162033" font-size="12">Paddy Crops</text>
            </g>

            <g class="node" id="node-grasshopper">
              <rect x="180" y="35" width="90" height="50" rx="8" fill="#FFF" stroke="#6B7280" stroke-width="2" />
              <text x="225" y="65" text-anchor="middle" font-weight="600" fill="#162033" font-size="12">Grasshopper</text>
            </g>

            <g class="node" id="node-mice">
              <rect x="180" y="135" width="90" height="50" rx="8" fill="#FFF" stroke="#6B7280" stroke-width="2" />
              <text x="225" y="165" text-anchor="middle" font-weight="600" fill="#162033" font-size="12">Field Mice</text>
            </g>

            <g class="node" id="node-frogs">
              <rect x="320" y="35" width="80" height="50" rx="8" fill="#FFF" stroke="#6B7280" stroke-width="2" />
              <text x="360" y="65" text-anchor="middle" font-weight="600" fill="#162033" font-size="12">Frogs</text>
            </g>

            <g class="node" id="node-snakes">
              <rect x="430" y="75" width="80" height="50" rx="8" fill="#FFF" stroke="#6B7280" stroke-width="2" />
              <text x="470" y="105" text-anchor="middle" font-weight="600" fill="#162033" font-size="12">Rat Snakes</text>
            </g>
          </svg>
        </div>

        <!-- Disturbances Toggles -->
        <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin: 16px 0;">
          <button class="btn btn-secondary" id="btn-bio-balanced" style="min-height: 48px;">🌿 Balanced Web</button>
          <button class="btn btn-primary" id="btn-bio-remove-snakes" style="min-height: 48px; background: var(--color-bio);">🐍 Remove Snakes</button>
          <button class="btn btn-secondary" id="btn-bio-drought" style="min-height: 48px;">☀️ Severe Drought</button>
        </div>

        <div id="bio-observation-panel" class="callout-box callout-info" style="margin-top: 16px;" role="status" aria-live="polite">
          <strong>Observed Status:</strong> Balanced ecosystem. Energy flows from primary producers (Paddy) to primary herbivores and secondary predators.
        </div>

        <!-- Non-visual Accessible Table -->
        <details style="margin-top: 16px;">
          <summary style="cursor: pointer; padding: 8px; font-weight: 600;">Accessible Food Web Relationship Table</summary>
          <table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 0.9rem;">
            <thead>
              <tr style="border-bottom: 2px solid var(--color-border); text-align: left;">
                <th style="padding: 6px;">Organism</th>
                <th style="padding: 6px;">Trophic Level</th>
                <th style="padding: 6px;">Energy Source (Eaten)</th>
                <th style="padding: 6px;">Energy Consumed By</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="padding: 6px;">Paddy Crops</td><td>Primary Producer</td><td>Sunlight</td><td>Grasshoppers, Mice</td></tr>
              <tr><td style="padding: 6px;">Grasshoppers</td><td>Primary Consumer (Herbivore)</td><td>Paddy Crops</td><td>Frogs</td></tr>
              <tr><td style="padding: 6px;">Field Mice</td><td>Primary Consumer (Herbivore)</td><td>Paddy Crops</td><td>Rat Snakes, Owls</td></tr>
              <tr><td style="padding: 6px;">Frogs</td><td>Secondary Consumer</td><td>Grasshoppers</td><td>Rat Snakes</td></tr>
              <tr><td style="padding: 6px;">Rat Snakes</td><td>Apex Predator</td><td>Frogs, Field Mice</td><td>None (Decomposers)</td></tr>
            </tbody>
          </table>
        </details>
      </div>
    `;

    const obsPanel = container.querySelector('#bio-observation-panel');

    container.querySelector('#btn-bio-balanced').addEventListener('click', () => {
      currentState.scenario = 'balanced';
      currentState.hasInteracted = true;
      obsPanel.className = 'callout-box callout-info';
      obsPanel.innerHTML = '<strong>Observed Status (Balanced):</strong> Ecosystem is stable. Herbivore and predator populations remain balanced.';
      onStateChange(currentState);
    });

    container.querySelector('#btn-bio-remove-snakes').addEventListener('click', () => {
      currentState.scenario = 'remove_snakes';
      currentState.hasInteracted = true;
      obsPanel.className = 'callout-box callout-warning';
      obsPanel.innerHTML = '<strong>Simplified Model Tendency:</strong> When snakes vanish, frog numbers face less predation and tend to surge. Increased frog feeding pressure in turn causes grasshopper numbers to decline!';
      onStateChange(currentState);
    });

    container.querySelector('#btn-bio-drought').addEventListener('click', () => {
      currentState.scenario = 'drought';
      currentState.hasInteracted = true;
      obsPanel.className = 'callout-box callout-danger';
      obsPanel.innerHTML = '<strong>Severe Drought Impact:</strong> Without water, paddy crops wither. Because primary producers support the base of the energy pyramid, all herbivores and predators face starvation.';
      onStateChange(currentState);
    });

    container.querySelector('#bio-reset-btn').addEventListener('click', () => {
      currentState = this.resetState();
      obsPanel.className = 'callout-box callout-info';
      obsPanel.innerHTML = '<strong>Observed Status:</strong> Balanced ecosystem restored.';
      onStateChange(currentState);
    });
  },

  unmount() {}
};

