import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export function initSmoothScroll() {
	// 1. Инициализация Lenis
	const lenis = new Lenis({
		duration: 1.2, // Время плавности
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Функция плавности
		smoothWheel: true,
	});

	// 2. Синхронизация со ScrollTrigger
	// Это критически важно, чтобы GSAP знал о перемещениях Lenis
	lenis.on('scroll', ScrollTrigger.update);

	// 3. Добавление тикера GSAP для работы Lenis
	gsap.ticker.add((time) => {
		lenis.raf(time * 1000);
	});

	// Отключаем лаги сглаживания в GSAP
	gsap.ticker.lagSmoothing(0);

	return lenis;
}
