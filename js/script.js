import Slide from './slide.js';

const slide = new Slide('.slider', '.slider-wrapper');

slide.init();
slide.changeSlide(3)
slide.activePrevSlide()