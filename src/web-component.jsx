import React from 'react';
import ReactDOM from 'react-dom/client';
import { BfcLogoGrid } from './BfcLogoGrid';

class BfcLogoGridElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._root = null;
    this._members = [];
  }

  static get observedAttributes() {
    return ['ratio', 'mode', 'data-url'];
  }

  connectedCallback() {
    this.loadData();
  }

  attributeChangedCallback() {
    if (this._root) {
      this.render();
    }
  }

  async loadData() {
    const dataUrl = this.getAttribute('data-url');

    if (dataUrl) {
      try {
        const response = await fetch(dataUrl);
        const data = await response.json();
        this._members = data.members || [];
        this._baseUrl = dataUrl.substring(0, dataUrl.lastIndexOf('/'));
      } catch (error) {
        console.error('BfcLogoGrid: Failed to load members data', error);
        this._members = [];
      }
    }

    this.render();
  }

  render() {
    const ratio = this.getAttribute('ratio') || 'landscape';
    const mode = this.getAttribute('mode') || 'tiered';

    const container = document.createElement('div');
    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(container);

    this._root = ReactDOM.createRoot(container);
    this._root.render(
      React.createElement(BfcLogoGrid, {
        ratio,
        mode,
        members: this._members,
        baseUrl: this._baseUrl || ''
      })
    );
  }

  disconnectedCallback() {
    if (this._root) {
      this._root.unmount();
    }
  }
}

customElements.define('bfc-logo-grid', BfcLogoGridElement);
