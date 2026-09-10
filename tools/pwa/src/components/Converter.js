import { store } from '../core/store.js';

export function createConverter() {
  const card = document.createElement('section');
  card.className = 'card';
  // Subtle 6-color accent line at the top of the card for your aesthetic
  card.style.borderTop = '3px solid transparent';
  card.style.borderImage = 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff) 1';

  const todayStr = new Date().toISOString().split('T')[0];

  card.innerHTML = `
    <h2 style="font-weight: 500; color: var(--text-primary);">CE → Space Era Converter</h2>
    <p style="color: var(--text-muted); font-size: 0.875rem;">
      Select a Common Era date to instantly calculate its standard formats.
    </p>
    <div style="margin-top: 1rem;">
      <input 
        type="date" 
        id="ce-input" 
        value="${todayStr}" 
        style="background: var(--bg-primary); color: var(--text-primary); border: 1px solid var(--border-color); padding: 0.75rem 1rem; border-radius: 4px; font-family: inherit; font-size: 1rem; outline: none; width: 100%; max-width: 300px; color-scheme: dark;"
      />
    </div>
    <div id="converter-results" class="phase-grid" style="margin-top: 1.5rem;"></div>
  `;

  const input = card.querySelector('#ce-input');
  const resultsContainer = card.querySelector('#converter-results');

  function update() {
    const value = input.value;
    if (!value) return;

    const res = store.convertCustomDate(value);
    if (res.ok) {
      resultsContainer.innerHTML = `
        <div class="phase-box" style="border: 1px solid var(--border-color); padding: 1rem; border-radius: 4px;">
          <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Phase 1 Standard</div>
          <div style="color: var(--text-primary); font-family: monospace; font-size: 1.125rem;">${res.data.phase1}</div>
        </div>
        <div class="phase-box" style="border: 1px solid var(--border-color); padding: 1rem; border-radius: 4px; margin-top: 0.75rem;">
          <div style="color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem;">Phase 2 Standard</div>
          <div style="color: var(--text-primary); font-family: monospace; font-size: 1.125rem;">${res.data.phase2}</div>
        </div>
      `;
    } else {
      resultsContainer.innerHTML = `
        <div style="color: var(--text-primary); font-size: 0.875rem; border: 1px solid var(--border-color); padding: 1rem;">
          Error: ${res.error}
        </div>
      `;
    }
  }

  // Trigger on 'input' for immediate real-time feedback as the user types or uses the calendar dropdown
  input.addEventListener('input', update);

  // Initial calculation on component render
  update();

  return card;
}
