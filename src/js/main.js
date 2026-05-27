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
import { initFooterNavigation } from './animations/footerNavigation.js';

// Каталог диванов
import { render } from './catalog.js';
import products from '../data/products.json';

// Карточка товаров
import { initProduct } from './product';

// Копирование
import { initCopyEmail } from './copyEmail.js';

// page404
import { initNotFoundPage } from './pages/notFound.js';

// Форма
import { initForm } from './pages/form.js';
import { initPhoneMask } from './utils/mask.js';

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

	// 5. Плавный скролл для футеров и в ссылке hero
	initFooterNavigation(lenis);

	// Карточка товаров
	initProduct();

	// Копирование
	initCopyEmail();

	// 404
	initNotFoundPage();

	// Форма
	initForm(lenis);
	initPhoneMask();
});
