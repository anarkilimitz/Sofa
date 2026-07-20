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
import { initConditionsSlider } from './animations/conditionsSlider.js';
import { initFooterNavigation } from './animations/footerNavigation.js';

// Каталог диванов
import { render } from './catalog.js';
import products from '../data/products.json';

// Карточка товаров
import { initProduct } from './product';

// Копирование
import { initCopyEmail } from './copyEmail.js';

// Поиск
import { initSearch } from './ui/search';

// page404
import { initNotFoundPage } from './pages/notFound.js';

// Форма
import { initForm } from './pages/form.js';
import { initPhoneMask } from './utils/mask.js';

import { handleMobileLayout } from './mobileLayout.js';

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
	initSearch(lenis);
	initHeroScale();
	initNavIconLabels();
	initCarousel();
	initCardTextAnimation(lenis);

	// 4. Табы, слайдер и каталог c loader - контроль первого рендера
	let isFirstRender = true;
	await render(products, { withLoader: true });
	isFirstRender = false;
	initTabs(render, products);
	initConditionsSlider();

	// 5. Плавный скролл для футеров и в ссылке hero
	initFooterNavigation(lenis);

	// Карточка товаров
	initProduct();

	// Копирование
	initCopyEmail();

	// 404
	initNotFoundPage();

	// Форма
	initForm(lenis); // Ленис тут для блока скролла!
	initPhoneMask();
});

// Запускаем при загрузке страницы
handleMobileLayout();

// Запускаем при изменении размера окна (с небольшой задержкой для производительности)
let resizeTimer;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(handleMobileLayout, 100);
});