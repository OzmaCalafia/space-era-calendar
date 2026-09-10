export function createDocs() {
  const container = document.createElement('div');
  container.style.cssText = 'max-width: 800px; margin: 0 auto; padding: 2rem 1rem; color: #f0f4f8;';
  
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <h2 style="margin: 0; font-size: 1.75rem;">Documentation</h2>
      <a href="/THE%20SPACE%20ERA%20CALENDAR%20STANDARD%20v1.0.pdf" download style="background: #238636; color: white; padding: 0.6rem 1.2rem; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-flex; align-items: center; gap: 0.5rem; transition: background 0.2s;">
        Download PDF Spec
      </a>
    </div>
    
    <div id="markdown-viewer" style="line-height: 1.7; background: #121826; padding: 2rem; border-radius: 12px; border: 1px solid #30363d; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
      <p style="color: #8b949e;">Loading documentation...</p>
    </div>
  `;

  // Fetch and render the README markdown content
  fetch('/README.md')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load documentation');
      return response.text();
    })
    .then(text => {
      const viewer = container.querySelector('#markdown-viewer');
      if (viewer && window.marked) {
        viewer.innerHTML = window.marked.parse(text);
      }
    })
    .catch(err => {
      const viewer = container.querySelector('#markdown-viewer');
      if (viewer) {
        viewer.innerHTML = `<p style="color: #f85149;">Error loading documentation: ${err.message}</p>`;
      }
    });

  return container;
}
