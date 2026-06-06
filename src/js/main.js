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
	initForm(lenis); // Ленис тут для блока скролла!
	initPhoneMask();
});

function handleMobileLayout() {
	const isMobile = window.innerWidth <= 600;

	// Находим все элементы
	const galleryItems = document.querySelectorAll('.gallery-grid__item');
	const accordionItems = document.querySelectorAll('.accordion__item');
	const galleryGrid = document.querySelector('.gallery-grid');

	// Проверки на наличие элементов
	if (!galleryItems.length || !accordionItems.length || !galleryGrid) return;

	if (isMobile) {
		// --- ЛОГИКА ДЛЯ МОБИЛЬНОЙ ВЕРСИИ ---

		// 1. Перемещаем первые 3 картинки после "Описания" (индекс 0)
		// Важно: вставляем в обратном порядке (3, 2, 1), чтобы в итоге получить 1, 2, 3
		// так как after вставляет элемент сразу после цели
		const descBlock = accordionItems[0]; // Описание
		if (descBlock) {
			if (galleryItems[2]) descBlock.after(galleryItems[2]);
			if (galleryItems[1]) descBlock.after(galleryItems[1]);
			if (galleryItems[0]) descBlock.after(galleryItems[0]);
		}

		// 2. Перемещаем остальные картинки (с 4-й и далее) после "Параметров" (индекс 3)
		const paramsBlock = accordionItems[3]; // Параметры
		if (paramsBlock) {
			// Проходим по оставшимся картинкам с конца, чтобы сохранить порядок
			for (let i = galleryItems.length - 1; i >= 3; i--) {
				paramsBlock.after(galleryItems[i]);
			}
		}
	} else {
		// --- ВОЗВРАТ НА ДЕСКТОП ---

		// Если экран стал большим, возвращаем все картинки обратно в контейнер галереи
		galleryItems.forEach((item) => {
			galleryGrid.appendChild(item);
		});
	}
}

// Запускаем при загрузке страницы
handleMobileLayout();

// Запускаем при изменении размера окна (с небольшой задержкой для производительности)
let resizeTimer;
window.addEventListener('resize', () => {
	clearTimeout(resizeTimer);
	resizeTimer = setTimeout(handleMobileLayout, 100);
});