import { store } from '../core/store.js';

export function createLiveClock() {
  const container = document.createElement('section');
  container.className = 'card';

  function render() {
    const se = store.getLiveConversion();
    const utcFormatted = store.state.now.toUTCString().replace(/\s*GMT$/, ' UTC');

    container.innerHTML = `
      <h2 style="font-weight: 500;">Live Space Era Clock</h2>
      
      <!-- Earth Reference Box -->
      <div class="phase-box" style="margin-bottom: 1rem;">
        <span class="label">Earth Reference</span>
        <span class="val">${utcFormatted}</span>
      </div>

      <!-- Space Era Phase Standard Boxes -->
      <div class="phase-grid">
        <div class="phase-box">
          <span class="label">Phase 1 Standard</span>
          <span class="val">${se.phase1}</span>
        </div>
        <div class="phase-box">
          <span class="label">Phase 2 Standard</span>
          <span class="val">${se.phase2}</span>
        </div>
      </div>
    `;
  }

  render();
  store.addEventListener('tick', render);
  return container;
}
