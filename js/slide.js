import debounce from "./debounce.js";

export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
    this.activeClass = "active";
  }

  //ativa a transição lenta usado quando soltar o click
  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : "";
  }

  //pega a posição inicial do slide e altera o valor
  //conforme move o slide e adiciona o resultado no style
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

  //se mousedown: previna padrão, pegue o valor do local clickado e adicione o evento
  //se touchstart pegue o valor do local clickado e adicione o evento
  onStart(event) {
    let movetype;
    if (event.type === "mousedown") {
      event.preventDefault();
      this.dist.startX = event.clientX;
      movetype = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      movetype = "touchmove";
    }
    this.wrapper.addEventListener(movetype, this.onMove);
    this.transition(false);
  }

  //se mousemove adicione o event.clientX no updatePosition()
  //se touchmove adicione o clientX do touch no updatePosition()
  //e ative o moveSlide com o valor do updatePosition()
  //o updatePosition() retorna a posicao do clientX do slide
  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  //se soltar o click do mouse remove o evento de mousemove
  //se touchEnd remove o evento de touchmove
  onEnd(event) {
    const movetype = event.type === "mouseup" ? "mousemove" : "tochmove";
    this.wrapper.removeEventListener(movetype, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  //se o movimento for para esquerda ou direita ative as funcoes
  //activeNextSlide e activePrevSlide e se o proximo ou o anterior
  //for undefined retorne o que tiver ativo atualmente
  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active);
    }
  }

  //adicionado eventos
  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart);
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd);
  }

  //calculo para o elemento ficar centralizado
  //relacionando o tamanho da tela e do elemento
  slidePosition(slide) {
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  //passo por todos os elementos do slide e coloco em um objeto
  //com a posição calculada para ficar no centro e o elemento
  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  //pego o slide atual o anterior e o proximo
  //e coloco em um objeto para manipular
  slidesIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  //pego o index do slide e atribuo ao slidesIndexNav
  //pega a posicao que ta o slide e salva na posicao final
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  //adiciona classe 'active' para o slide selecionado e remove dos demais
  changeActiveClass() {
    this.slideArray.forEach((item) =>
      item.element.classList.remove(this.activeClass),
    );
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  //se for pro anterior e não for undefined passe para o anterior
  activePrevSlide() {
    if (this.index.prev !== undefined) this.changeSlide(this.index.prev);
  }

  //se for pro proximo e não for undefined passe para o proximo
  activeNextSlide() {
    if (this.index.next !== undefined) this.changeSlide(this.index.next);
  }

  //depois de .2 segundos ative as funcoes para centralizar
  //novamente o slide com o evento de resize
  onResize() {
    console.log("a");
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.active);
    }, 200);
  }

  //evento de alterar tamanho da tela
  addResizeEvents() {
    window.addEventListener("resize", this.onResize);
  }

  //bind para não perder referencia ao adicionar eventos
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.changeSlide(0);
    this.addResizeEvents();
    return this;
  }
}

export class SlideNav extends Slide {
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }
}
