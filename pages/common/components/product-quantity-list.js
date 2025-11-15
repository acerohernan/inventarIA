class ProductQuantityList extends HTMLElement {
  constructor() {
    super();
    this._products = [];
    this.attachShadow({ mode: "open" });
  }

  set products(value) {
    this._products = Array.isArray(value) ? value : [];
    this.render();
  }

  get products() {
    return this._products;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const style = `
      :host {
        display: block;
      }
      .list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .card {
        border: 1px solid #e6e6e6;
        border-radius: 12px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        background: #fff;
      }
      .left {
        display: flex;
        flex-direction: column;
      }
      .name {
        font-weight: 600;
        font-size: 1rem;
      }
      .meta {
        color: #666;
        font-size: 0.85rem;
      }
      .controls {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      button {
        border: none;
        background: transparent;
        font-size: 1.25rem;
        width: 36px;
        height: 36px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        cursor: pointer;
      }
      button:active { transform: scale(0.98); }
      .count {
        min-width: 28px;
        text-align: center;
        font-size: 1.1rem;
      }
    `;

    const itemsHtml =
      this._products
        .map((p) => {
          const qty = typeof p.quantity === "number" ? p.quantity : 0;
          // Using data attributes to reference product id on actions
          return `
          <div class="card" data-id="${p.id || ""}">
            <div class="left">
              <div class="name">${this._escapeHtml(p.name || "Untitled")}</div>
              <div class="meta">Código: ${this._escapeHtml(
                p.code || "-"
              )} &nbsp; Cantidad: <span id="quantityCounter">${qty}</span></div>
              
            </div>
            <div class="controls">
              <button class="decrease" disabled title="Restar">-</button>
              <div class="count">0</div>
              <button class="increase" title="Agregar">+</button>
            </div>
          </div>
        `;
        })
        .join("\n") || `<div class=\"meta\">No hay productos</div>`;

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <div class="list">${itemsHtml}</div>
    `;

    // Attach event listeners
    this.shadowRoot.querySelectorAll(".card").forEach((card) => {
      const id = card.getAttribute("data-id");
      const incBtn = card.querySelector(".increase");
      const decBtn = card.querySelector(".decrease");
      const countEl = card.querySelector(".count");
      const quantityCounter = card.querySelector("#quantityCounter");

      incBtn.addEventListener("click", () => {
        decBtn.disabled = false;

        const current = parseInt(countEl.textContent, 10) || 0;
        const currentQty = parseInt(quantityCounter.textContent, 10) || 0;

        const next = Math.min(current + 1, currentQty);

        if (next === currentQty) incBtn.disabled = true;
        else incBtn.disabled = false;

        countEl.textContent = next;
        this._emitChange(id, next);
      });

      decBtn.addEventListener("click", () => {
        const current = parseInt(countEl.textContent, 10) || 0;
        incBtn.disabled = false;

        const next = Math.max(0, current - 1);

        if (next === 0) decBtn.disabled = true;
        else decBtn.disabled = false;

        countEl.textContent = next;
        this._emitChange(id, next);
      });
    });
  }

  _emitChange(productId, newQuantity) {
    const idx = this._products.findIndex((p) => p.id === productId);
    if (idx >= 0) {
      this._products[idx].quantity = newQuantity;
    }

    this.dispatchEvent(
      new CustomEvent("quantity-change", {
        detail: { productId, quantity: newQuantity },
        bubbles: true,
        composed: true,
      })
    );
  }

  _escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

customElements.define("product-quantity-list", ProductQuantityList);
