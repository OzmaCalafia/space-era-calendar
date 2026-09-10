import { store } from '../core/store.js';

export function createLiveClock() {
  const container = document.createElement('section');
  container.className = 'card';

  function render() {
    const se = store.getLiveConversion();
    const utcNow = store.state.now.toUTCString();

    container.innerHTML = `
      <h2 style="font-weight: 500;">Live Space Era Clock</h2>
      <div class="time-display">UTC: ${utcNow}</div>
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
