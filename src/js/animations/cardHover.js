import gsap from 'gsap';

export const initCardHover = () => {
	const allCards = document.querySelectorAll('.product-card, .about-card');

	allCards.forEach((card) => {
		const cardImg = card.classList.contains('about-card')
			? card.querySelector('.about-card__title')
			: card.querySelector('img');

		card.addEventListener('mousemove', (e) => {
			const { clientX, clientY } = e;
			const { left, top, width, height } = card.getBoundingClientRect();

			const moveX = (clientX - (left + width / 2)) / (width / 2);
			const moveY = (clientY - (top + height / 2)) / (height / 2);

			gsap.to(card, {
				rotateY: moveX * 10,
				rotateX: -moveY * 10,
				ease: 'power2.out',
				duration: 0.5,
				transformPerspective: 1000,
			});

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
				gsap.to(cardImg, { x: 0, y: 0, ease: 'power2.out', duration: 0.7 });
			}
		});
	});
};
