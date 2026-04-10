import '../scss/style.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { initSmoothScroll } from './animations/smoothScroll';
import { initHeroScroll } from './animations/heroScroll';
import { initCardHover } from './animations/cardHover';
import { initNavIconLabels } from './animations/iconText';
import { initMenu } from './animations/menu';
import { initCarousel } from './animations/carousel';
import { initCardTextAnimation } from './animations/cardText';
import { initHeroScale } from './animations/heroScale';
// import { initStackingCards } from './animations/stackingCards';
import { initTabs } from './animations/tabs';

// Каталог диванов
import { render } from './catalog.js';
import products from '../data/products.json';

// Карточка товаров
import { initProduct } from './product';

// Регистрируем плагин один раз в главной точке входа
gsap.registerPlugin(ScrollTrigger);

let lenis;

document.addEventListener('DOMContentLoaded', () => {
	// 1. Инициализация плавного скролла (Lenis)
	lenis = initSmoothScroll();

	// 2. Инициализация анимаций
	initHeroScroll();
	initCardHover();

	// 3. Инициализация компонентов интерфейса
	initMenu(lenis);
	initHeroScale();
	initNavIconLabels();
	initCarousel();
	initCardTextAnimation();

	// 4. Табы и каталог
	render(products);
	initTabs(render, products);

	// Карточка товаров
	initProduct();
});
