import estilos from './tarjeta-producto.css?inline';
import type { DetalleAgregar } from './tipos';
import './boton-app'; // la tarjeta lleva un <boton-app> adentro

// Formato de dinero: $1,299.00. Se crea una vez para todas las tarjetas.
const pesos = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export class TarjetaProducto extends HTMLElement {
  // ENTRADAS del contrato.
  static observedAttributes = ['producto-id', 'nombre', 'precio', 'imagen', 'existencia'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.pintar();
  }

  attributeChangedCallback() {
    // Si cambia un atributo antes de entrar a la página, todavía no se pinta.
    if (this.isConnected) this.pintar();
  }

  private pintar() {
    // Todo llega como texto: el precio y la existencia se convierten a número.
    const id = this.getAttribute('producto-id') ?? '';
    const nombre = this.getAttribute('nombre') ?? '';
    const precio = Number(this.getAttribute('precio'));
    const imagen = this.getAttribute('imagen') ?? '';
    const existencia = Number(this.getAttribute('existencia'));
    const agotado = existencia === 0; // la regla de negocio vive AQUÍ adentro

    // ADENTRO: el marcado. Quien usa la tarjeta no necesita saber cómo es.
    this.shadowRoot!.innerHTML = `
      <style>${estilos}</style>
      <article class="tarjeta">
        <img src="${imagen}" alt="${nombre}">
        <div class="cuerpo">
          <h3>${nombre}</h3>
          <p class="precio">${pesos.format(precio)}</p>
          <p class="existencia ${agotado ? 'agotado' : ''}">
            ${agotado ? 'Agotado' : `${existencia} disponibles`}
          </p>
          <boton-app ${agotado ? 'deshabilitado' : ''}>Agregar al carrito</boton-app>
        </div>
      </article>
    `;

    // SALIDA: al presionar el botón, la tarjeta AVISA. No sabe quién escucha.
    this.shadowRoot!.querySelector('boton-app')!.addEventListener('click', () => {
      if (agotado) return;
      const detalle: DetalleAgregar = { id, nombre, precio };
      this.dispatchEvent(
        new CustomEvent('agregar', {
          detail: detalle,  // lo que viaja con el aviso
          bubbles: true,    // que suba por el árbol hasta #rejilla
          composed: true,   // que pueda SALIR del Shadow DOM
        }),
      );
    });
  }
}

customElements.define('tarjeta-producto', TarjetaProducto);