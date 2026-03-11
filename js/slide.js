export default class Slider {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
  }

  //pega a posição inicial do slider e altera o valor
  //conforme move o slider e adiciona o resultado no style
  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  //pega o valor iniciado menos o valor do movimento e armazena
  //dentro de movement e retorna o finalPosition menos o movement
  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.6;
    return this.dist.finalPosition - this.dist.movement;
  }

  //ao clickar previna padrão, pegue o valor do local clickado
  //e adicione o evento de mousemove
  onStart(event) {
    event.preventDefault();
    this.dist.startX = event.clientX;
    this.wrapper.addEventListener("mousemove", this.onMove);
  }

  //ao mover o mouse acione o evento updatePosition dentro de moveSlide
  onMove(event) {
    const finalPosition = this.updatePosition(event.clientX);
    this.moveSlide(finalPosition);
  }

  //ao soltar o click do mouse remove o evento de mousemove
  //e salva o valor do finalPosition que recebe o valor de onde esta o slider
  onEnd(event) {
    this.wrapper.removeEventListener("mousemove", this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
  }

  //adicionado eventos
  addSliderEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
  }

  //bind para não perder referencia ao adicionar eventos
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMove = this.onMove.bind(this);
  }

  init() {
    this.bindEvents();
    this.addSliderEvents();
    return this;
  }
}
