import gsap from 'gsap';

export function initHeroScale() {
	const hero = document.querySelector('.hero-section');

	if (!hero) return;

	gsap.to(hero, {
		scrollTrigger: {
			trigger: hero,
			start: 'top top', // Начинаем, когда верх секции у топа экрана
			end: 'bottom top', // Заканчиваем, когда низ секции доходит до топа
			scrub: true, // Анимация привязана к движению колеса мыши
		},
		scale: 0.92, // до 90%
		borderRadius: '80px', // скругление при уменьшении
		opacity: 0.8, // Немного приглушаем прозрачность
		y: -60, // Чуть-чуть смещаем вверх для эффекта глубины
		ease: 'none',
	});
}
