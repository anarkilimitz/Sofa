// src/js/animations/stackingCards.js
import gsap from 'gsap';

export function initStackingCards() {
	const sections = document.querySelectorAll('.about-section');

	sections.forEach((section) => {
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: 'top top',
				// end определяет, как долго секция будет "закреплена"
				// 150% значит: высота экрана + еще половина скролла
				end: '+=100%',
				pin: true,
				pinSpacing: false,
				scrub: true,
			},
		});

		// 1. ПАУЗА (Секция стоит на месте)
		tl.to({}, { duration: 0.3 });

		// 2. АНИМАЦИЯ (Секция улетает)

		tl.to(section, {
			scale: 1.0,
			xPercent: 0, // Гарантированно улетит за край любого экрана
			y: 0,
			filter: 'blur(20px)',
			duration: 1,
			opacity: 0,
			ease: 'none',
		});
	});
}

// Если надо сдвиг вправо просто то эти настройки
// tl.to(section, {
// 	scale: 0.0,
// 	xPercent: 150, // Гарантированно улетит за край любого экрана
// 	y: -500,
// 	filter: 'blur(20px)',
// 	duration: 1,
// 	ease: 'none',
// });
