import { SlideNav } from "./slide.js";

const slide = new SlideNav(".slider", ".slider-wrapper");
slide.init();
slide.addArrow(".prev", ".next");
slide.addControl(".custom-controls");
