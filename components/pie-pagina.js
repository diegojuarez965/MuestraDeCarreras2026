class PiePagina extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <section class="pie" id="contacto">
      <div class="pie-contenedor">
        <div class="part-1">
          <img
            src="img/logo70.png"
            alt="70 años Universidad Nacional del Sur"
          />
        </div>

        <div class="pie-derecha">
          <div class="part-2">
            <div>
              <a
                href="https://www.instagram.com/muestrainformativadecarreras?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                title="instagram Muestra de Carreras"
                ><img src="img/instagram.jpeg" alt="Instagram"
              /></a>
            </div>
            <div>
              <a
                href="mailto:muestradecarrerasuns@gmail.com"
                title="Correo Muestra de Carreras"
                ><img src="img/correo.jpeg" alt="Correo electrónico"
              /></a>
            </div>
          </div>

          <div class="pie-texto">
            <p>&copy; 2026 MUESTRA2026 | UNIVERSIDAD NACIONAL DEL SUR</p>
            <p id="visitas-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="
                  vertical-align: middle;
                  margin-right: 4px;
                  display: inline-block;
                "
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Visitas: <span id="contador-visitas">...</span>
            </p>
          </div>
        </div>
      </div>
    </section>`;

    const script = document.createElement("script");
    script.src = "js/contador.js";
    this.appendChild(script);
  }
}

customElements.define("pie-pagina", PiePagina);
