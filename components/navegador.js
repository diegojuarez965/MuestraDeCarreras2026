class Navegador extends HTMLElement {
  connectedCallback() {
    const noBorder = this.hasAttribute("no-border")
      ? 'style="border-bottom-style: none"'
      : "";
    this.innerHTML = `
       <section class="navegador" ${noBorder}>
        <div class="nav-logos">
          <div class="logos">
            <img src="img/logos.png" alt="UNS | doe Logo" />
          </div>
        </div>

        <div class="nav-menu">
          <div class="menu">
            <button
              class="menu-responsive"
              onclick="accion()"
              title="Menú"
              aria-label="Abrir menú"
              id="btnMenu"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.3"
                stroke-linecap="round"
              >
                <line
                  class="linea linea-top"
                  x1="3"
                  y1="6"
                  x2="21"
                  y2="6"
                ></line>
                <line
                  class="linea linea-mid"
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                ></line>
                <line
                  class="linea linea-bottom"
                  x1="3"
                  y1="18"
                  x2="21"
                  y2="18"
                ></line>
              </svg>
            </button>
            <ul class="menu-horizontal">
              <li class="menu-enlace">
                <a href="index-muestra.html">INICIO</a>
              </li>
              <li class="menu-enlace">
                <a href="#">ACTIVIDADES</a>
              </li>
              <li class="menu-enlace"><a href="doe.html">DOE</a></li>
              <li class="menu-enlace">
                <a href="#">CONTACTO</a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    `;

    const script = document.createElement("script");
    script.src = "js/menu.js";
    this.appendChild(script);
  }
}

customElements.define("menu-navegador", Navegador);
