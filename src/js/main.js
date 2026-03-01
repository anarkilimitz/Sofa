import '../scss/style.scss';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import { initSmoothScroll } from './animations/smoothScroll';
import { initHeroScroll } from './animations/heroScroll';
import { initCardHover } from './animations/cardHover';
import { initNavIconLabels } from './animations/iconText';
import { initMenu } from './animations/menu';
import { initCarousel } from './animations/carousel';

// Регистрируем плагин один раз в главной точке входа
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
	// 1. Инициализация плавного скролла (Lenis)
	initSmoothScroll();

	// 2. Инициализация анимаций
	initHeroScroll();
	initCardHover();

	// 3. Инициализация компонентов интерфейса
	initNavIconLabels();
	initMenu();
	initCarousel();
});
