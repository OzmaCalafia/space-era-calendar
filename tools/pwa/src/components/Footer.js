export function createFooter() {
  const footer = document.createElement('footer');
  footer.style.cssText = 'margin-top: auto; padding: 2.5rem 1rem 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.8125rem; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.625rem;';
  
  footer.innerHTML = `
    <div style="font-weight: 500; color: var(--text-primary); font-size: 0.875rem; letter-spacing: 0.02em;">
      Space Era Calendar Standard • Year 80 SE / 2026 CE
    </div>
    <div style="color: var(--text-muted); line-height: 1.5;">
      Open-source timekeeping architecture & local-first software.
      <br />
      Coded by <strong style="color: var(--text-primary);">Ozma Calafia [OC]</strong>.
    </div>
    <div style="margin-top: 0.25rem;">
      <a 
        href="https://github.com/OzmaCalafia/space-era-calendar" 
        target="_blank" 
        rel="noopener noreferrer" 
        style="color: var(--text-primary); text-decoration: underline; text-decoration-color: var(--border-color); font-weight: 500; display: inline-flex; align-items: center; gap: 0.25rem;"
      >
        <span>Verify Repository & Specification</span>
        <span style="font-size: 0.75rem;">↗</span>
      </a>
    </div>
  `;
  
  return footer;
}
