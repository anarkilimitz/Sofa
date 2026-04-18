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
import { initTabs } from './animations/tabs';

// Каталог диванов
import { render } from './catalog.js';
import products from '../data/products.json';

// Карточка товаров
import { initProduct } from './product';

// 404
import { initNotFoundPage } from './pages/notFound.js';

// Регистрируем плагин один раз в главной точке входа
gsap.registerPlugin(ScrollTrigger);

let lenis;

document.addEventListener('DOMContentLoaded', async () => {
	// 1. Инициализация плавного скролла (Lenis)
	lenis = initSmoothScroll();

	// 2 Инициализация анимаций
	initHeroScroll();
	setTimeout(() => {
		initCardHover();
	}, 100);

	// 3. Инициализация компонентов интерфейса
	initMenu(lenis);
	initHeroScale();
	initNavIconLabels();
	initCarousel();
	initCardTextAnimation();

	// 4. Табы и каталог c loader - контроль первого рендера
	let isFirstRender = true;
	await render(products, { withLoader: true });
	isFirstRender = false;
	initTabs(render, products);

	// Карточка товаров
	initProduct();

	// 404
	initNotFoundPage();
});
