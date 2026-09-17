export function createDocs() {
  const container = document.createElement('div');
  container.style.cssText = 'max-width: 880px; margin: 0 auto; padding: 2rem 1rem; color: #f0f4f8;';

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <h2 style="margin: 0; font-size: 1.75rem; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">Documentation</h2>
      <a href="/THE%20SPACE%20ERA%20CALENDAR%20STANDARD%20v1.0.pdf" download style="background: #238636; color: #ffffff; padding: 0.6rem 1.2rem; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem; transition: background 0.2s; font-size: 0.9rem;">
        Download PDF Spec
      </a>
    </div>
    
    <div id="docs-card-wrapper" style="background: #0d1117; border-radius: 12px; border: 1px solid #30363d; box-shadow: 0 4px 16px rgba(0,0,0,0.4); overflow: hidden;">
      <div id="markdown-viewer" class="markdown-body" style="padding: 2.5rem; background: transparent; color: #c9d1d9;">
        <p style="color: #8b949e; margin: 0;">Loading documentation specification...</p>
      </div>
    </div>
  `;

  // Asynchronously initialize dependencies and render content
  initDocsViewer(container.querySelector('#markdown-viewer'));

  return container;
}

async function initDocsViewer(viewerElement) {
  if (!viewerElement) return;

  try {
    // 1. Ensure KaTeX and GitHub Markdown CSS dependencies load cleanly
    await loadDependencies();

    // 2. Fetch raw canonical README.md
    const response = await fetch('/README.md');
    if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch README.md`);
    const markdownText = await response.text();

    // 3. Render Markdown to HTML using Marked
    if (window.marked) {
      viewerElement.innerHTML = window.marked.parse(markdownText);
    } else {
      viewerElement.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace;">${markdownText}</pre>`;
    }

    // 4. Execute KaTeX auto-render through the container
    if (window.renderMathInElement) {
      window.renderMathInElement(viewerElement, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false
      });
    }
  } catch (err) {
    viewerElement.innerHTML = `<p style="color: #f85149; margin: 0;">Error loading documentation: ${err.message}</p>`;
  }
}

// Promisified asset loader preventing race conditions & duplicate DOM injection
function loadDependencies() {
  return new Promise((resolve) => {
    // Inject Stylesheets
    injectCSS('katex-css', 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css');
    injectCSS('gh-markdown-css', 'https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css');

    // Resolve immediately if KaTeX auto-render is already loaded
    if (window.renderMathInElement) {
      return resolve();
    }

    // Load KaTeX Core JS, then Auto-Render plugin
    injectScript('katex-js', 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js', () => {
      injectScript('katex-auto-render-js', 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js', () => {
        resolve();
      });
    });
  });
}

function injectCSS(id, href) {
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }
}

function injectScript(id, src, onLoadCallback) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.onload = onLoadCallback;
    document.head.appendChild(script);
  } else if (onLoadCallback) {
    if (window.renderMathInElement) {
      onLoadCallback();
    } else {
      script.addEventListener('load', onLoadCallback);
    }
  }
}
