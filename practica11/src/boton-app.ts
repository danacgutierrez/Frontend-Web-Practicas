// NUEVO (Paso 1): <boton-app>, el componente más chico.
// Un botón que se escribe una vez y se reusa en toda la página.

// ?inline le pide a Vite el CSS como TEXTO, para meterlo en el Shadow DOM.
import estilos from './boton-app.css?inline';

// Un componente es una clase que hereda de HTMLElement (como en Java).
export class BotonApp extends HTMLElement {
  // ENTRADAS: los atributos que el navegador vigila. Si cambian, avisa.
  static observedAttributes = ['variante', 'deshabilitado'];

  // El <button> de adentro. Lo guardamos para no buscarlo cada vez.
  private boton: HTMLButtonElement;

  // ── CICLO DE VIDA ──────────────────────────────────────────────────────
  // El navegador llama estas funciones solo, en este orden. Nunca las
  // llamas tú. Son como los eventos de una ventana en Java: tú solo decides
  // qué hacer cuando pasan.

  // 1) constructor — cuando se CREA el elemento (al leer el HTML o con
  //    document.createElement). Todavía no está en la página: aquí se arma
  //    el Shadow DOM, pero no se leen atributos ni se toca el resto del DOM.
  constructor() {
    super(); // obligatorio: arma el HTMLElement antes que nada

    // El Shadow DOM: un pedazo de DOM privado. Su CSS no sale ni entra.
    const sombra = this.attachShadow({ mode: 'open' });

    // <slot> es el hueco donde cae lo que se escribe entre las etiquetas:
    // <boton-app>Vaciar</boton-app>  ->  "Vaciar" aparece dentro del botón.
    sombra.innerHTML = `
      <style>${estilos}</style>
      <button><slot></slot></button>
    `;
    this.boton = sombra.querySelector('button')!;
  }

  // 2) connectedCallback — cuando la etiqueta ENTRA a la página. Aquí ya
  //    existen los atributos: es el lugar para pintar, pedir datos o poner
  //    listeners de afuera (window, document).
  connectedCallback() {
    this.pintar();
  }

  // 3) attributeChangedCallback(nombre, anterior, nuevo) — cada vez que
  //    cambia un atributo de observedAttributes. Recibe cuál cambió, su valor
  //    viejo y el nuevo. Aquí no los usamos: con cualquier cambio se repinta.
  attributeChangedCallback() {
    this.pintar();
  }

  // 4) disconnectedCallback — cuando la etiqueta SALE de la página
  //    (element.remove()). Sirve para limpiar: quitar listeners de window,
  //    parar un setInterval. Este botón no deja nada pendiente, por eso no
  //    lo necesita.
  // disconnectedCallback() {
  //   console.log('boton-app salió de la página');
  // }

  // 5) adoptedCallback — cuando la etiqueta se MUDA a otro documento (por
  //    ejemplo, a un <iframe>). Casi nunca se usa; se menciona para que
  //    sepan que existe.
  // adoptedCallback() {
  //   console.log('boton-app se mudó de documento');
  // }

  // Lee los atributos y ajusta el botón de adentro.
  private pintar() {
    // Todo atributo llega como texto. Si no viene, usamos 'primario'.
    this.boton.className = this.getAttribute('variante') ?? 'primario';
    // hasAttribute: basta con que el atributo exista, sin valor.
    this.boton.disabled = this.hasAttribute('deshabilitado');
  }
}

// Registra la etiqueta. Desde aquí el navegador ya sabe qué es <boton-app>.
// El nombre DEBE llevar guion: así nunca choca con una etiqueta del estándar.
customElements.define('boton-app', BotonApp);