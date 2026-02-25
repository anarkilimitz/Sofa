import '../scss/style.scss';
import { initSmoothScroll } from './animations/smoothScroll';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Регистрируем плагин GSAP
gsap.registerPlugin(ScrollTrigger);

// Основные
document.addEventListener('DOMContentLoaded', () => {
	// Запускаем скролл
	initSmoothScroll();

	// Исправленная анимация (проверяем наличие элементов, чтобы не было ошибок)
	const heroTitle = document.querySelector('.hero-title');
	if (heroTitle) {
		gsap.to(heroTitle, {
			y: -50,
			opacity: 0.5,
			scrollTrigger: {
				trigger: '.hero-section',
				start: 'top top',
				end: 'bottom top',
				scrub: true,
			},
		});
	}

	// --- Анимация карточек (универсальная) ---
	// Собираем все типы карточек, которые должны наклоняться
	const allCards = document.querySelectorAll('.product-card, .about-card');

	allCards.forEach((card) => {
		// Ищем картинку или иконку внутри конкретной карточки для параллакса
		const cardImg = card.classList.contains('about-card')
			? card.querySelector('.about-card__title')
			: card.querySelector('img');

		card.addEventListener('mousemove', (e) => {
			const { clientX, clientY } = e;
			const { left, top, width, height } = card.getBoundingClientRect();

			const centerX = left + width / 2;
			const centerY = top + height / 2;

			const moveX = (clientX - centerX) / (width / 2);
			const moveY = (clientY - centerY) / (height / 2);

			// Наклон самой карточки
			gsap.to(card, {
				rotateY: moveX * 10,
				rotateX: -moveY * 10,
				ease: 'power2.out',
				duration: 0.5,
				transformPerspective: 1000,
			});

			// Параллакс эффект для внутреннего элемента
			if (cardImg) {
				gsap.to(cardImg, {
					x: moveX * 15,
					y: moveY * 15,
					duration: 0.5,
				});
			}
		});

		card.addEventListener('mouseleave', () => {
			gsap.to(card, {
				rotateX: 0,
				rotateY: 0,
				ease: 'power2.out',
				duration: 0.7,
			});
			if (cardImg) {
				gsap.to(cardImg, {
					x: 0,
					y: 0,
					ease: 'power2.out',
					duration: 0.7,
				});
			}
		});
	});
	// Бургер
	const menuTriggers = document.querySelectorAll('.menu-trigger');
	const closeMenu = document.getElementById('close-menu');
	const menuDrawer = document.getElementById('menu-drawer');
	const menuOverlay = document.getElementById('menu-overlay');

	const toggleMenu = () => {
		menuDrawer.classList.toggle('open');
		menuOverlay.classList.toggle('open');
	};

	const closeMenuFunc = () => {
		menuDrawer.classList.remove('open');
		menuOverlay.classList.remove('open');
	};

	menuTriggers.forEach((trigger) => {
		trigger.addEventListener('click', toggleMenu);
	});

	if (closeMenu) closeMenu.addEventListener('click', toggleMenu);
	if (menuOverlay) menuOverlay.addEventListener('click', toggleMenu);

	window.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && menuDrawer.classList.contains('open')) {
			closeMenuFunc();
		}
	});
	// склейка карусели для адаптивности
	const initCarousel = () => {
		const carouselContainer = document.querySelector('.carousel-container');
		const carouselWrapper = document.querySelector('.carousel-wrapper');
		if (!carouselContainer || !carouselWrapper) return;

		const initialItems = Array.from(carouselWrapper.children);
		const cycleItemsCount = Math.floor(initialItems.length / 2);
		if (cycleItemsCount === 0) return;

		const cycleTemplate = initialItems.slice(0, cycleItemsCount);

		const syncCarouselTrack = () => {
			const firstItem = carouselWrapper.children[0];
			const lastCycleItem = carouselWrapper.children[cycleItemsCount - 1];
			if (!firstItem || !lastCycleItem) return;

			const firstRect = firstItem.getBoundingClientRect();
			const lastRect = lastCycleItem.getBoundingClientRect();
			const cycleWidth = lastRect.right - firstRect.left;
			if (cycleWidth <= 0) return;

			carouselWrapper.style.setProperty(
				'--carousel-scroll-distance',
				`-${cycleWidth}px`
			);

			while (
				carouselWrapper.scrollWidth <
				carouselContainer.clientWidth + cycleWidth
			) {
				cycleTemplate.forEach((item) => {
					carouselWrapper.appendChild(item.cloneNode(true));
				});
			}
		};

		syncCarouselTrack();

		let resizeTimer;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(syncCarouselTrack, 120);
		});
	};

	initCarousel();
});
