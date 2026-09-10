import './style.css';
import { createLiveClock } from './components/LiveClock.js';
import { createConverter } from './components/Converter.js';
import { createFooter } from './components/Footer.js';
import { createDocs } from './components/Docs.js';

// DOM Nodes with safety checks
const viewTools = document.querySelector('#view-tools');
const viewDocs = document.querySelector('#view-docs');
const footerContainer = document.querySelector('#footer-container');

const btnTools = document.querySelector('#nav-tools');
const btnDocs = document.querySelector('#nav-docs');

// Mount Components safely
if (viewTools) {
  viewTools.appendChild(createLiveClock());
  viewTools.appendChild(createConverter());
}

if (viewDocs) {
  viewDocs.appendChild(createDocs());
}

if (footerContainer) {
  footerContainer.appendChild(createFooter());
}

// View Router Logic
function switchView(view) {
  if (!viewTools || !viewDocs || !btnTools || !btnDocs) return;
  
  if (view === 'tools') {
    viewTools.style.display = 'block';
    viewDocs.style.display = 'none';
    btnTools.style.color = 'var(--text-primary)';
    btnDocs.style.color = 'var(--text-muted)';
  } else if (view === 'docs') {
    viewTools.style.display = 'none';
    viewDocs.style.display = 'block';
    btnTools.style.color = 'var(--text-muted)';
    btnDocs.style.color = 'var(--text-primary)';
  }
}

// Event Listeners for Nav
if (btnTools && btnDocs) {
  btnTools.addEventListener('click', () => switchView('tools'));
  btnDocs.addEventListener('click', () => switchView('docs'));
}

// Register Offline Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => console.error('ServiceWorker registration failed: ', err));
  });
}
